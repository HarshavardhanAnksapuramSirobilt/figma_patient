import { useState } from "react";
import { z } from "zod";
import { showSuccess, showError } from "../../../utils/toastUtils";
import { Button } from "../../../commonfields/Button";
import { Input } from "../../../commonfields/Input";
import { enrollAbhaByOtp, requestAadhaarOtp } from "../../../services/abhaApis";
import { CheckCircle } from "lucide-react";

interface Props {
  txnId: string;
  aadhaarNumber: string;
  onOtpVerified: (abhaPayload: any) => void;
  onResendOtp: (newTxnId: string) => void;
}

const OtpMobileSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be a 10-digit number"),
});

export default function StepVerifyOtp({ txnId, aadhaarNumber, onOtpVerified, onResendOtp }: Props) {
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errors, setErrors] = useState<{ otp?: string; mobile?: string }>({});

  const handleVerify = async () => {
    const validation = OtpMobileSchema.safeParse({ otp, mobile });

    if (!validation.success) {
      const fieldErrors: typeof errors = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await enrollAbhaByOtp({ txnId, otp, mobile });
      if (result.success) {
        showSuccess("OTP Verified", "ABHA Data Captured");
        onOtpVerified(result.data);
      } else {
        showError("OTP Verification Failed", result.error?.message || "Check OTP or Mobile");
      }
    } catch (error) {
      console.error("Unexpected error during OTP verification:", error);
      showError("Verification Error", "Unable to complete verification");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      const result = await requestAadhaarOtp({ aadhaarNumber });
      if (result.success) {
        onResendOtp(result.data.txnId);
        showSuccess("OTP Resent", result.data.message);
      } else {
        showError("Resend Failed", result.error?.message || "Try again later");
      }
    } catch (err) {
      showError("Error", "Unable to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const isOtpValid = /^\d{6}$/.test(otp) && !errors.otp;
  const isMobileValid = /^\d{10}$/.test(mobile) && !errors.mobile;

  return (
    <div className="relative max-w-md mx-auto p-6 border rounded-xl shadow-md bg-white space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Verify OTP & Mobile</h2>

      {/* OTP */}
      <div>
        <div className="flex items-center">
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              if (errors.otp) setErrors((prev) => ({ ...prev, otp: undefined }));
            }}
          />
          {isOtpValid && <CheckCircle className="text-green-600 w-5 h-5 ml-2" />}
        </div>
        {errors.otp && <p className="text-sm text-red-600">{errors.otp}</p>}
      </div>

      {/* Mobile */}
      <div>
        <div className="flex items-center">
          <Input
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
            }}
          />
          {isMobileValid && <CheckCircle className="text-green-600 w-5 h-5 ml-2" />}
        </div>
        {errors.mobile && <p className="text-sm text-red-600">{errors.mobile}</p>}
      </div>

      <Button onClick={handleVerify} disabled={loading || !otp || !mobile}>
        {loading ? "Verifying..." : "Verify & Continue"}
      </Button>

      
    </div>
  );
}
