import UserModel from "@/model/User";
import { GenRandomNumber, ResponseRef } from "@/util/commonFunctions";
import { sendVerificationEmail } from "@/util/sendVerificationEmail";
import bcrypt from "bcryptjs";

export const POST = async (request: Request, response: Response) => {
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername)
      return ResponseRef(false, "Username Is Already Taken", 400);

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = GenRandomNumber(6).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail?.isVerified) {
        return ResponseRef(false, "User already Exists With This Email", 400);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    //Send Email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse?.success)
      return ResponseRef(false, emailResponse?.message, 500);
    return ResponseRef(
      true,
      "User Registered Successfully. Please Verify Your Email",
      201
    );
  } catch (error) {
    console.log("Error Registering User", error);
    return ResponseRef(false, "Error Registering User", 500);
  }
};
