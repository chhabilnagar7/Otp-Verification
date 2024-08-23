import express from 'express';
import generateOTP from './generateOtp.js';
import { OTP } from '../model/OTP.js';
import Twilio from 'twilio';
import { configDotenv } from 'dotenv';


configDotenv();

const router = express.Router();
const client = Twilio(process.env.TWILIOACCOUNTSID, process.env.TWILIOAUTHTOKEN);


// Sending OTP 
router.post('/send', async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        
        await OTP.deleteMany({ phoneNumber });

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

        const newOTP = new OTP({ phoneNumber, otp, expiresAt });
        await newOTP.save();

        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIOPHONENUMBER,
            to: phoneNumber,
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
});

// Verify the OTP
router.post('/verify', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const validOTP = await OTP.findOne({ phoneNumber, otp});

        if (!validOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is deleted after verisfication
        await OTP.deleteMany({ phoneNumber });

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
    }
});

export { router as otpRouter };
