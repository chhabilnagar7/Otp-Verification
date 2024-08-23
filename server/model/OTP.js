import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

export const OTP = mongoose.model('OTP', otpSchema);
