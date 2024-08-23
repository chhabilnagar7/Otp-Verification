import { useState } from 'react';
import axios from 'axios'

function OTPVerification() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);

    const sendOtp = async () => {
        try {
            await axios.post('http://localhost:8000/otp/send', { phoneNumber });
            setStep(2);
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    const verifyOtp = async () => {
        try {
            await axios.post('http://localhost:8000/otp/verify', { phoneNumber, otp });
            alert('OTP verified successfully!'); 
         
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    return (
        <div>
            {step === 1 && (
                <div>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                    />
                    <button onClick={sendOtp}>Send OTP</button>
                </div>
            )}
            {step === 2 && (
                <div>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter the OTP"
                    /> 
                    <button onClick={verifyOtp}>Verify OTP</button>
                </div>
            )}
        </div>
    );
}

export default OTPVerification;
 