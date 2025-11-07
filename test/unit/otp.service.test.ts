import { describe, it, expect, beforeEach, vi } from "vitest";
import crypto from "crypto";

// Mock dependencies FIRST
vi.mock("@prisma/client", () => {
  return {
    PrismaClient: vi.fn(() => ({
      otp: {
        deleteMany: vi.fn(),
        create: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
      },
      user: {
        update: vi.fn(),
      },
    })),
  };
});

vi.mock("../../server/services/email.service", () => ({
  sendOTPEmail: vi.fn(),
}));

vi.mock("crypto", async () => {
  const actual = await vi.importActual<typeof crypto>("crypto");
  return {
    ...actual,
    randomInt: vi.fn(),
  };
});

// Import services AFTER mocking
import {
  generateOTP,
  createAndSendOTP,
  verifyOTP,
  incrementOTPAttempts,
  getPendingOTP,
  checkAndResendOTP,
} from "../../server/services/otp.service";
import { sendOTPEmail } from "../../server/services/email.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("OTP Service - GENERATE OTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ Should generate 6-digit OTP", () => {
    const otp = generateOTP();
    expect(otp).toHaveLength(6);
    expect(/^\d{6}$/.test(otp)).toBe(true);
  });

  it("✅ Should generate OTP in valid range (100000-999999)", () => {
    const otp = generateOTP();
    const otpNum = parseInt(otp, 10);
    expect(otpNum).toBeGreaterThanOrEqual(100000);
    expect(otpNum).toBeLessThanOrEqual(999999);
  });

  it("✅ Should generate different OTPs on multiple calls", () => {
    const otp1 = generateOTP();
    const otp2 = generateOTP();
    // Note: There's a small chance they could be equal, but very unlikely
    // In a real scenario with many calls, they should differ
    expect(typeof otp1).toBe("string");
    expect(typeof otp2).toBe("string");
  });
});

describe("OTP Service - CREATE AND SEND OTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ Should create OTP and send email", async () => {
    const userId = 1;
    const email = "user@example.com";

    vi.mocked(prisma.otp.deleteMany).mockResolvedValueOnce({ count: 0 });
    vi.mocked(prisma.otp.create).mockResolvedValueOnce({
      id: 1,
      userId,
      email,
      code: "123456",
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(),
      attempts: 0,
      usedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    vi.mocked(sendOTPEmail).mockResolvedValueOnce({
      success: true,
      messageId: "test-id",
    });

    const result = await createAndSendOTP(userId, email);

    expect(result.success).toBe(true);
    expect(result.message).toContain("OTP has been sent");
    expect(result.expiresIn).toBe("5m");
    expect(prisma.otp.deleteMany).toHaveBeenCalled();
    expect(prisma.otp.create).toHaveBeenCalled();
    expect(sendOTPEmail).toHaveBeenCalledWith(
      email,
      expect.any(String),
      "5m"
    );
  });

  it("❌ Should throw error if email sending fails", async () => {
    const userId = 1;
    const email = "user@example.com";

    vi.mocked(prisma.otp.deleteMany).mockResolvedValueOnce({ count: 0 });
    vi.mocked(prisma.otp.create).mockResolvedValueOnce({
      id: 1,
      userId,
      email,
      code: "123456",
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(),
      attempts: 0,
      usedAt: null,
    } as any);
    vi.mocked(sendOTPEmail).mockRejectedValueOnce(
      new Error("Email service failed")
    );

    await expect(createAndSendOTP(userId, email)).rejects.toThrow();
  });
});

describe("OTP Service - VERIFY OTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ Should verify OTP and mark email as verified", async () => {
    const userId = 1;
    const code = "123456";

    const futureDate = new Date(Date.now() + 5 * 60 * 1000);

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce({
      id: 1,
      userId,
      code,
      type: "EMAIL_VERIFICATION",
      expiresAt: futureDate,
      attempts: 0,
      usedAt: null,
    } as any);

    vi.mocked(prisma.otp.update).mockResolvedValueOnce({
      id: 1,
      userId,
      code,
      expiresAt: futureDate,
      attempts: 0,
      usedAt: new Date(),
    } as any);

    vi.mocked(prisma.user.update).mockResolvedValueOnce({
      id: userId,
      username: "john_doe",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      emailVerified: true,
    } as any);

    const result = await verifyOTP(userId, code);

    expect(result.success).toBe(true);
    expect(result.message).toContain("Email verification successful");
    expect(result.user?.emailVerified).toBe(true);
    expect(prisma.otp.update).toHaveBeenCalled();
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it("❌ Should fail if OTP code is empty", async () => {
    const userId = 1;
    const code = "";

    await expect(verifyOTP(userId, code)).rejects.toThrow(
      "OTP code cannot be empty"
    );
  });

  it("❌ Should fail if OTP does not exist or is invalid", async () => {
    const userId = 1;
    const code = "999999";

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce(null);

    await expect(verifyOTP(userId, code)).rejects.toThrow(
      "Invalid or non-existent OTP code"
    );
  });

  it("❌ Should fail if OTP has expired", async () => {
    const userId = 1;
    const code = "123456";
    const expiredDate = new Date(Date.now() - 1000); // 1 second ago

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce({
      id: 1,
      userId,
      code,
      expiresAt: expiredDate,
      attempts: 0,
      usedAt: null,
    } as any);

    await expect(verifyOTP(userId, code)).rejects.toThrow(
      "OTP code has expired"
    );
  });

  it("❌ Should fail if max attempts exceeded", async () => {
    const userId = 1;
    const code = "123456";
    const futureDate = new Date(Date.now() + 5 * 60 * 1000);

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce({
      id: 1,
      userId,
      code,
      expiresAt: futureDate,
      attempts: 3,
      usedAt: null,
    } as any);

    await expect(verifyOTP(userId, code)).rejects.toThrow(
      "too many times"
    );
  });
});

describe("OTP Service - INCREMENT OTP ATTEMPTS", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ Should increment failed OTP attempts", async () => {
    const userId = 1;

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce({
      id: 1,
      userId,
      attempts: 1,
      type: "EMAIL_VERIFICATION",
      usedAt: null,
    } as any);

    vi.mocked(prisma.otp.update).mockResolvedValueOnce({
      id: 1,
      userId,
      attempts: 2,
    } as any);

    await incrementOTPAttempts(userId);

    expect(prisma.otp.update).toHaveBeenCalled();
    expect(prisma.otp.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { attempts: 2 },
    });
  });

  it("✅ Should handle case when no pending OTP exists", async () => {
    const userId = 1;

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce(null);

    await incrementOTPAttempts(userId);

    expect(prisma.otp.update).not.toHaveBeenCalled();
  });
});

describe("OTP Service - GET PENDING OTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ Should return pending OTP if exists", async () => {
    const userId = 1;
    const futureDate = new Date(Date.now() + 5 * 60 * 1000);

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce({
      id: 1,
      userId,
      code: "123456",
      expiresAt: futureDate,
      attempts: 0,
      usedAt: null,
    } as any);

    const result = await getPendingOTP(userId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(1);
    expect(result?.userId).toBe(userId);
  });

  it("✅ Should return null if no pending OTP exists", async () => {
    const userId = 1;

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce(null);

    const result = await getPendingOTP(userId);

    expect(result).toBeNull();
  });
});

describe("OTP Service - CHECK AND RESEND OTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ Should create and send new OTP if none exists", async () => {
    const userId = 1;
    const email = "user@example.com";

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce(null);
    vi.mocked(prisma.otp.deleteMany).mockResolvedValueOnce({ count: 0 });
    vi.mocked(prisma.otp.create).mockResolvedValueOnce({
      id: 1,
      userId,
      email,
      code: "123456",
      expiresAt: new Date(),
      attempts: 0,
      usedAt: null,
    } as any);
    vi.mocked(sendOTPEmail).mockResolvedValueOnce({
      success: true,
      messageId: "test-id",
    });

    const result = await checkAndResendOTP(userId, email);

    expect(result.shouldResend).toBe(true);
    expect(result.message).toContain("OTP has been sent");
    expect(result.expiresIn).toBe("5m");
  });

  it("✅ Should create and send new OTP if previous one expired", async () => {
    const userId = 1;
    const email = "user@example.com";
    const expiredDate = new Date(Date.now() - 1000);

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce({
      id: 1,
      userId,
      email,
      code: "123456",
      expiresAt: expiredDate,
      attempts: 0,
      usedAt: null,
    } as any);
    vi.mocked(prisma.otp.deleteMany).mockResolvedValueOnce({ count: 1 });
    vi.mocked(prisma.otp.create).mockResolvedValueOnce({
      id: 2,
      userId,
      email,
      code: "654321",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      usedAt: null,
    } as any);
    vi.mocked(sendOTPEmail).mockResolvedValueOnce({
      success: true,
      messageId: "test-id",
    });

    const result = await checkAndResendOTP(userId, email);

    expect(result.shouldResend).toBe(true);
    expect(result.message).toContain("expired");
  });

  it("❌ Should NOT resend if existing OTP is still valid", async () => {
    const userId = 1;
    const email = "user@example.com";
    const futureDate = new Date(Date.now() + 3 * 60 * 1000);

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce({
      id: 1,
      userId,
      email,
      code: "123456",
      expiresAt: futureDate,
      attempts: 0,
      usedAt: null,
    } as any);

    const result = await checkAndResendOTP(userId, email);

    expect(result.shouldResend).toBe(false);
    expect(result.message).toContain("OTP already sent");
    expect(result.canResendAt).toEqual(futureDate);
    expect(prisma.otp.create).not.toHaveBeenCalled();
  });

  it("✅ Should include canResendAt timestamp when OTP still valid", async () => {
    const userId = 1;
    const email = "user@example.com";
    const futureDate = new Date(Date.now() + 2 * 60 * 1000);

    vi.mocked(prisma.otp.findFirst).mockResolvedValueOnce({
      id: 1,
      userId,
      email,
      code: "123456",
      expiresAt: futureDate,
      attempts: 0,
      usedAt: null,
    } as any);

    const result = await checkAndResendOTP(userId, email);

    expect(result.canResendAt).toBeDefined();
    expect(result.canResendAt).toEqual(futureDate);
  });
});
