import { describe, it, expect, beforeEach, vi } from "vitest";
import nodemailer from "nodemailer";

// Mock nodemailer FIRST
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(),
  },
}));

// Mock useRuntimeConfig
vi.mock("#app", () => ({
  useRuntimeConfig: () => ({
    nodemailer: {
      from: '"Konomi Shop" <noreply@konomi-shop.com>',
      host: "smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: "test_user",
        pass: "test_pass",
      },
    },
  }),
}));

// Import services AFTER mocking
import {
  sendOTPEmail,
  sendPasswordResetEmail,
  verifyMailtrapConnection,
} from "../../server/services/email.service";

describe("Email Service - SEND OTP EMAIL", () => {
  let mockTransporter: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock transporter
    mockTransporter = {
      sendMail: vi.fn(),
      verify: vi.fn(),
    };

    vi.mocked(nodemailer.createTransport).mockReturnValueOnce(mockTransporter);
  });

  it("✅ Should send OTP email successfully", async () => {
    const toEmail = "john@example.com";
    const otp = "123456";
    const expiresIn = "5m";

    mockTransporter.sendMail.mockResolvedValueOnce({
      messageId: "test-message-id",
    });

    const result = await sendOTPEmail(toEmail, otp, expiresIn);

    expect(result.success).toBe(true);
    expect(result.messageId).toBe("test-message-id");
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: toEmail,
        subject: expect.stringContaining("Xác nhận email"),
      })
    );
  });

  it("❌ Should throw error if email sending fails", async () => {
    const toEmail = "john@example.com";
    const otp = "123456";
    const expiresIn = "5m";

    mockTransporter.sendMail.mockRejectedValueOnce(
      new Error("SMTP connection failed")
    );

    await expect(sendOTPEmail(toEmail, otp, expiresIn)).rejects.toThrow();
  });

  it("✅ Should include OTP code in email body", async () => {
    const toEmail = "john@example.com";
    const otp = "789123";
    const expiresIn = "10m";

    mockTransporter.sendMail.mockResolvedValueOnce({
      messageId: "test-id",
    });

    await sendOTPEmail(toEmail, otp, expiresIn);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining(otp),
      })
    );
  });

  it("✅ Should include expiration time in email", async () => {
    const toEmail = "jane@example.com";
    const otp = "456789";
    const expiresIn = "15m";

    mockTransporter.sendMail.mockResolvedValueOnce({
      messageId: "test-id",
    });

    await sendOTPEmail(toEmail, otp, expiresIn);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining(expiresIn),
      })
    );
  });

  it("✅ Should use correct sender email", async () => {
    const toEmail = "user@example.com";
    const otp = "111111";
    const expiresIn = "5m";

    mockTransporter.sendMail.mockResolvedValueOnce({
      messageId: "test-id",
    });

    await sendOTPEmail(toEmail, otp, expiresIn);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.stringContaining("Konomi Shop"),
      })
    );
  });
});

describe("Email Service - SEND PASSWORD RESET EMAIL", () => {
  let mockTransporter: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTransporter = {
      sendMail: vi.fn(),
      verify: vi.fn(),
    };

    vi.mocked(nodemailer.createTransport).mockReturnValueOnce(mockTransporter);
  });

  it("✅ Should send password reset email successfully", async () => {
    const toEmail = "john@example.com";
    const resetToken = "reset_token_abc123";

    mockTransporter.sendMail.mockResolvedValueOnce({
      messageId: "reset-email-id",
    });

    const result = await sendPasswordResetEmail(toEmail, resetToken);

    expect(result.success).toBe(true);
    expect(result.messageId).toBe("reset-email-id");
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: toEmail,
        subject: expect.stringContaining("Đặt lại mật khẩu"),
      })
    );
  });

  it("❌ Should throw error if sending fails", async () => {
    const toEmail = "jane@example.com";
    const resetToken = "token_xyz789";

    mockTransporter.sendMail.mockRejectedValueOnce(
      new Error("Email service error")
    );

    await expect(
      sendPasswordResetEmail(toEmail, resetToken)
    ).rejects.toThrow();
  });

  it("✅ Should include reset link in email", async () => {
    const toEmail = "user@example.com";
    const resetToken = "test_token_123";

    mockTransporter.sendMail.mockResolvedValueOnce({
      messageId: "test-id",
    });

    await sendPasswordResetEmail(toEmail, resetToken);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("reset-password"),
      })
    );
  });
});

describe("Email Service - VERIFY MAILTRAP CONNECTION", () => {
  let mockTransporter: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTransporter = {
      sendMail: vi.fn(),
      verify: vi.fn(),
    };

    vi.mocked(nodemailer.createTransport).mockReturnValueOnce(mockTransporter);
  });

  it("✅ Should successfully verify Mailtrap connection", async () => {
    mockTransporter.verify.mockResolvedValueOnce(true);

    const result = await verifyMailtrapConnection();

    expect(result.success).toBe(true);
    expect(result.message).toContain("successfully connected");
    expect(mockTransporter.verify).toHaveBeenCalled();
  });

  it("❌ Should fail if connection cannot be verified", async () => {
    mockTransporter.verify.mockResolvedValueOnce(false);

    const result = await verifyMailtrapConnection();

    expect(result.success).toBe(false);
    expect(result.message).toContain("failed");
  });

  it("❌ Should throw error if verification throws exception", async () => {
    mockTransporter.verify.mockRejectedValueOnce(
      new Error("Connection refused")
    );

    await expect(verifyMailtrapConnection()).rejects.toThrow();
  });

  it("✅ Should return connection details on success", async () => {
    mockTransporter.verify.mockResolvedValueOnce(true);

    const result = await verifyMailtrapConnection();

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("message");
    expect(result.message).toContain("connected");
  });
});
