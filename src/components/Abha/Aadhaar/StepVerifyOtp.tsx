import { useState } from "react";
import { showSuccess, showError } from "../../../utils/toastUtils";
import { Button } from "../../../commonfields/Button";
import { Input } from "../../../commonfields/Input";
import { enrollAbhaByOtp } from "../../../services/abhaApis";

interface Props {
  txnId: string;
  onOtpVerified: (abhaPayload: any) => void;
}

export default function StepVerifyOtp({ txnId, onOtpVerified }: Props) {
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const payload = {
        txnId,
        otp,
        mobile,
      };

      const result = await enrollAbhaByOtp(payload);

      if (result.success) {
        showSuccess("OTP Verified", `ABHA Data Captured`);
        onOtpVerified(result.data); // Pass ABHA data to the next step
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

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <Input
        placeholder="Enter Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <Button onClick={handleVerify} disabled={loading || !otp || !mobile}>
        {loading ? "Verifying..." : "Verify & Continue"}
      </Button>
    </div>
  );
}
