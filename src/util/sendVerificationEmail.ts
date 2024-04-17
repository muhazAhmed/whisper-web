import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Whisper Web | Verification Code",
      react: VerificationEmail({ username, otp: verificationCode }),
    });
    return { success: true, message: "Verification Email Sent Successfully" };
  } catch (error) {
    console.error("Error Sending verification Email", error);
    return { success: false, message: "Failed to Send Mail" };
  }
};
