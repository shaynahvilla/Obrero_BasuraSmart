import twilio from 'twilio';
import nodemailer from 'nodemailer';

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (phoneNumber: string, otp: string): Promise<void> => {
  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      await client.messages.create({
        body: `Your BasuraSmart OTP is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+63${phoneNumber.substring(1)}` // Convert 09xxx to +639xxx
      });
      
      console.log(`OTP sent via SMS to ${phoneNumber}`);
    } else {
      console.log(`Mock OTP for ${phoneNumber}: ${otp}`);
    }
  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

const sendEmailOTP = async (email: string, otp: string): Promise<void> => {
  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'BasuraSmart OTP Verification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">BasuraSmart OTP Verification</h2>
            <p>Your One-Time Password (OTP) is:</p>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #27ae60;">${otp}</span>
            </div>
            <p>This OTP is valid for 10 minutes. Please do not share this with anyone.</p>
            <p style="color: #7f8c8d; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
          </div>
        `
      });
      
      console.log(`OTP sent via email to ${email}`);
    } else {
      console.log(`Mock email OTP for ${email}: ${otp}`);
    }
  } catch (error) {
    console.error('Error sending email OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

export { generateOTP, sendOTP, sendEmailOTP };
