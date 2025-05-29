import { useState } from "react";
import { z } from "zod";
import { showSuccess } from "../../../utils/toastUtils";
import { Button } from "../../../commonfields/Button";
import { Input } from "../../../commonfields/Input";
import { requestAadhaarOtp } from "../../../services/abhaApis";
import { CheckCircle } from "lucide-react";

const AadhaarSchema = z.string().regex(/^\d{12}$/, "Aadhaar number must be a 12-digit number");

interface Props {
  onOtpSent: (txnId: string) => void;
  onContinueToOtp: () => void;
  onAadhaarChange: (aadhaar: string) => void;
}

export default function StepEnterAadhaar({ onOtpSent, onContinueToOtp, onAadhaarChange }: Props) {
  const [aadhaar, setAadhaar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleOtpRequest = async () => {
    const validation = AadhaarSchema.safeParse(aadhaar);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const result = await requestAadhaarOtp({ aadhaarNumber: aadhaar });
      if (result.success) {
        onAadhaarChange(aadhaar);
        onOtpSent(result.data.txnId);
        showSuccess("OTP Sent", result.data.message);
        setOtpSent(true);
      } else {
        setError(`Failed to send OTP to Aadhaar ending in ${aadhaar.slice(-4)}`);
      }
    } catch (err) {
      console.error("Unexpected error during OTP request:", err);
      setError(`Registration failed for Aadhaar ending in ${aadhaar.slice(-4)}`);
    } finally {
      setLoading(false);
    }
  };

  const isAadhaarValid = /^\d{12}$/.test(aadhaar) && !error;

  return (
    <div className="relative max-w-md mx-auto p-6 rounded-xl shadow-md bg-white space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Enter Aadhaar Number</h2>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Enter Aadhaar Number"
          value={aadhaar}
          onChange={(e) => {
            setAadhaar(e.target.value);
            if (error) setError(null);
          }}
          disabled={otpSent}
        />
        {isAadhaarValid && <CheckCircle className="text-green-600 w-6 h-6" />}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-col items-center justify-center space-y-2">
        <Button onClick={handleOtpRequest} disabled={loading || !isAadhaarValid}>
          {loading ? "Sending OTP..." : otpSent ? "Resend OTP" : "Send OTP"}
        </Button>
        {otpSent && !loading && (
          <>
            <p className="text-sm text-gray-600 text-center">OTP sent successfully.</p>
            <Button onClick={onContinueToOtp} variant="outline">
              Continue to OTP Verification
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
