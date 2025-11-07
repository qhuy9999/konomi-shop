import { describe, it, expect, beforeEach, vi } from "vitest";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

// Mock external dependencies FIRST
vi.mock("argon2", () => ({
  hash: vi.fn(),
  verify: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

vi.mock("@prisma/client", () => {
  const mockUser = {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const mockSession = {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  };
  const mockOTP = {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  return {
    PrismaClient: vi.fn(() => ({
      user: mockUser,
      session: mockSession,
      otp: mockOTP,
    })),
  };
});

vi.mock("../../server/services/otp.service", () => ({
  createAndSendOTP: vi.fn(),
  checkAndResendOTP: vi.fn(),
}));

// Import services with relative paths AFTER mocking
import {
  signUp,
  signIn,
  signOut,
  refreshTokenService,
} from "../../server/services/auth.service";
import { createAndSendOTP, checkAndResendOTP } from "../../server/services/otp.service";
import { PrismaClient } from "@prisma/client";

// Create prisma instance AFTER mocking
const prisma = new PrismaClient();

describe("Auth Service - SIGNUP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ Should successfully signup with valid data", async () => {
    const input = {
      username: "john_doe",
      password: "SecurePass123!",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    const mockUser = {
      id: 1,
      ...input,
      password: "<hashed_password>",
      emailVerified: false,
      avatarUrl: null,
      avatarId: null,
      bio: null,
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(argon2.hash).mockResolvedValueOnce("<hashed_password>");
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.user.create).mockResolvedValueOnce(mockUser);
    vi.mocked(createAndSendOTP).mockResolvedValueOnce({
      success: true,
      message: "OTP sent",
      expiresIn: "5m",
    });

    const result = await signUp(input);

    expect(result.success).toBe(true);
    expect(result.userId).toBe(1);
    expect(result.email).toBe("john@example.com");
    expect(result.requiresEmailVerification).toBe(true);
    expect(result.user.emailVerified).toBe(false);
    expect(argon2.hash).toHaveBeenCalled();
    expect(createAndSendOTP).toHaveBeenCalledWith(1, "john@example.com");
  });

  it("❌ Should fail if username already exists", async () => {
    const input = {
      username: "john_doe",
      password: "SecurePass123!",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: 1,
      username: "john_doe",
    } as any);

    await expect(signUp(input)).rejects.toThrow("username đã tồn tại");
  });

  it("❌ Should fail if email already exists", async () => {
    const input = {
      username: "john_doe",
      password: "SecurePass123!",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    // First findUnique (username check) returns null
    // Second findUnique (email check) returns existing user
    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 2, email: "john@example.com" } as any);

    await expect(signUp(input)).rejects.toThrow("email đã tồn tại");
  });

  it("❌ Should fail if missing required fields", async () => {
    const input = {
      username: "john_doe",
      password: "SecurePass123!",
      email: "john@example.com",
      firstName: "", // Missing firstName
      lastName: "Doe",
    };

    await expect(signUp(input)).rejects.toThrow(
      "Không thể thiếu username, password, email, firstName, và lastName"
    );
  });

  it("✅ Should hash password with argon2", async () => {
    const input = {
      username: "john_doe",
      password: "SecurePass123!",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    vi.mocked(argon2.hash).mockResolvedValueOnce("<hashed_password>");
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.user.create).mockResolvedValueOnce({
      id: 1,
      ...input,
      password: "<hashed_password>",
      emailVerified: false,
      avatarUrl: null,
      avatarId: null,
      bio: null,
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(createAndSendOTP).mockResolvedValueOnce({
      success: true,
      message: "OTP sent",
      expiresIn: "5m",
    });

    await signUp(input);

    expect(argon2.hash).toHaveBeenCalledWith(
      input.password,
      expect.any(Object)
    );
  });
});

describe("Auth Service - SIGNIN", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_ACCESS_SECRET = "test-secret-key-at-least-32-chars";
  });

  it("✅ Should successfully signin with valid credentials and verified email", async () => {
    const input = {
      username: "john_doe",
      password: "SecurePass123!",
    };

    const mockUser = {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      password: "<hashed_password>",
      firstName: "John",
      lastName: "Doe",
      emailVerified: true,
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as any);
    vi.mocked(argon2.verify).mockResolvedValueOnce(true);
    vi.mocked(jwt.sign).mockReturnValueOnce("access_token_value" as any);
    vi.mocked(prisma.session.create).mockResolvedValueOnce({
      id: 1,
      userId: 1,
      refreshToken: "refresh_token_value",
      expiresAt: new Date(),
      createdAt: new Date(),
    } as any);

    const result = await signIn(input);

    expect(result.success).toBe(true);
    expect(result.accessToken).toBe("access_token_value");
    expect(result.user?.id).toBe(1);
    expect(result.user?.username).toBe("john_doe");
    expect(argon2.verify).toHaveBeenCalledWith(
      "<hashed_password>",
      input.password
    );
    expect(jwt.sign).toHaveBeenCalled();
  });

  it("❌ Should fail if email is not verified - require OTP verification", async () => {
    const input = {
      username: "john_doe",
      password: "SecurePass123!",
    };

    const mockUser = {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      password: "<hashed_password>",
      firstName: "John",
      lastName: "Doe",
      emailVerified: false,
    };

    const futureDate = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as any);
    vi.mocked(checkAndResendOTP).mockResolvedValueOnce({
      shouldResend: true,
      message: "OTP has been sent to your email",
      expiresIn: "5m",
    });

    const result = await signIn(input);

    expect(result.success).toBe(false);
    expect(result.requiresEmailVerification).toBe(true);
    expect(result.message).toContain("OTP");
    expect(result.userId).toBe(1);
    expect(result.email).toBe("john@example.com");
    expect(result.resendOTP).toBe(true);
    expect(checkAndResendOTP).toHaveBeenCalledWith(1, "john@example.com");
  });

  it("❌ Should fail if email not verified - existing OTP still valid, do not resend", async () => {
    const input = {
      username: "jane_doe",
      password: "SecurePass456!",
    };

    const mockUser = {
      id: 2,
      username: "jane_doe",
      email: "jane@example.com",
      password: "<hashed_password>",
      firstName: "Jane",
      lastName: "Doe",
      emailVerified: false,
    };

    const canResendAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as any);
    vi.mocked(checkAndResendOTP).mockResolvedValueOnce({
      shouldResend: false,
      canResendAt,
      message: "OTP already sent to your email. Please check your inbox. Can request new OTP after 2 minutes",
    });

    const result = await signIn(input);

    expect(result.success).toBe(false);
    expect(result.requiresEmailVerification).toBe(true);
    expect(result.message).toContain("OTP already sent");
    expect(result.userId).toBe(2);
    expect(result.email).toBe("jane@example.com");
    expect(result.resendOTP).toBe(false);
    expect(result.canResendAt).toEqual(canResendAt);
    expect(checkAndResendOTP).toHaveBeenCalledWith(2, "jane@example.com");
  });

  it("❌ Should fail if username does not exist", async () => {
    const input = {
      username: "nonexistent_user",
      password: "SecurePass123!",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

    await expect(signIn(input)).rejects.toThrow("User not found");
  });

  it("❌ Should fail if password is incorrect", async () => {
    const input = {
      username: "john_doe",
      password: "WrongPassword123!",
    };

    const mockUser = {
      id: 1,
      username: "john_doe",
      password: "<hashed_password>",
      emailVerified: true,
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as any);
    vi.mocked(argon2.verify).mockResolvedValueOnce(false);

    await expect(signIn(input)).rejects.toThrow(
      "Username or password is incorrect"
    );
  });

  it("❌ Should fail if missing credentials", async () => {
    const input = {
      username: "john_doe",
      password: "",
    };

    await expect(signIn(input)).rejects.toThrow("Thiếu username hoặc password");
  });

  it("✅ Should create session with refresh token", async () => {
    const input = {
      username: "john_doe",
      password: "SecurePass123!",
    };

    const mockUser = {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      password: "<hashed_password>",
      firstName: "John",
      lastName: "Doe",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as any);
    vi.mocked(argon2.verify).mockResolvedValueOnce(true);
    vi.mocked(jwt.sign).mockReturnValueOnce("access_token" as any);
    vi.mocked(prisma.session.create).mockResolvedValueOnce({
      id: 1,
      userId: 1,
      refreshToken: "refresh_token",
      expiresAt: new Date(),
      createdAt: new Date(),
    } as any);

    await signIn(input);

    expect(prisma.session.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 1,
        refreshToken: expect.any(String),
        expiresAt: expect.any(Date),
      }),
    });
  });
});

describe("Auth Service - SIGNOUT", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ Should successfully signout", async () => {
    const refreshToken = "valid_refresh_token";

    vi.mocked(prisma.session.deleteMany).mockResolvedValueOnce({ count: 1 });

    const result = await signOut(refreshToken);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Đã đăng xuất");
    expect(prisma.session.deleteMany).toHaveBeenCalledWith({
      where: { refreshToken },
    });
  });

  it("❌ Should fail if refresh token is missing", async () => {
    const refreshToken = "";

    await expect(signOut(refreshToken)).rejects.toThrow("Token không tồn tại");
  });

  it("✅ Should delete session from database", async () => {
    const refreshToken = "valid_refresh_token";

    vi.mocked(prisma.session.deleteMany).mockResolvedValueOnce({ count: 1 });

    await signOut(refreshToken);

    expect(prisma.session.deleteMany).toHaveBeenCalledWith({
      where: { refreshToken },
    });
  });
});

describe("Auth Service - REFRESH TOKEN", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_ACCESS_SECRET = "test-secret-key-at-least-32-chars";
  });

  it("✅ Should successfully refresh token", async () => {
    const refreshToken = "valid_refresh_token";
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const mockSession = {
      id: 1,
      userId: 1,
      refreshToken,
      expiresAt: futureDate,
    };

    vi.mocked(prisma.session.findUnique).mockResolvedValueOnce(
      mockSession as any
    );
    vi.mocked(jwt.sign).mockReturnValueOnce("new_access_token" as any);

    const result = await refreshTokenService(refreshToken);

    expect(result.success).toBe(true);
    expect(result.accessToken).toBe("new_access_token");
    expect(jwt.sign).toHaveBeenCalled();
  });

  it("❌ Should fail if token is missing", async () => {
    const refreshToken = "";

    await expect(refreshTokenService(refreshToken)).rejects.toThrow(
      "Token không tồn tại"
    );
  });

  it("❌ Should fail if session not found", async () => {
    const refreshToken = "invalid_token";

    vi.mocked(prisma.session.findUnique).mockResolvedValueOnce(null);

    await expect(refreshTokenService(refreshToken)).rejects.toThrow(
      "Token không hợp lệ hoặc đã hết hạn"
    );
  });

  it("❌ Should fail if token expired", async () => {
    const refreshToken = "expired_token";
    const expiredDate = new Date(Date.now() - 1000); // 1 second ago

    const mockSession = {
      id: 1,
      userId: 1,
      refreshToken,
      expiresAt: expiredDate,
    };

    vi.mocked(prisma.session.findUnique).mockResolvedValueOnce(
      mockSession as any
    );
    vi.mocked(prisma.session.delete).mockResolvedValueOnce({} as any);

    await expect(refreshTokenService(refreshToken)).rejects.toThrow(
      "Token đã hết hạn"
    );
    expect(prisma.session.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("✅ Should create new JWT with correct payload", async () => {
    const refreshToken = "valid_refresh_token";
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const mockSession = {
      id: 1,
      userId: 1,
      refreshToken,
      expiresAt: futureDate,
    };

    vi.mocked(prisma.session.findUnique).mockResolvedValueOnce(
      mockSession as any
    );
    vi.mocked(jwt.sign).mockReturnValueOnce("new_access_token" as any);

    await refreshTokenService(refreshToken);

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 1 },
      expect.any(String),
      expect.any(Object)
    );
  });
});
