import { useState } from "react";
import { showSuccess,showError } from "../../../utils/toastUtils";
import { Button } from "../../../commonfields/Button";
import { Input } from "../../../commonfields/Input";
import { requestAadhaarOtp } from "../../../services/abhaApis";


interface Props {
  onOtpSent: (txnId: string) => void;
}

export default function StepEnterAadhaar({ onOtpSent }: Props) {
  const [aadhaar, setAadhaar] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  setLoading(true);
  try {
    const result = await requestAadhaarOtp({ aadhaarNumber: aadhaar });
    console.log(result)

    if (result.success) {
      onOtpSent(result.data.txnId);
      showSuccess("", `${result.data.message}`);
    } else {
      showError("Failed to Send OTP", `Aadhaar Ending in ${aadhaar.slice(-4)}`);
    }
  } catch (err) {
    console.error("Unexpected error during OTP request:", err);
    showError("Registration Failed", `Aadhaar Ending in ${aadhaar.slice(-4)}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter Aadhaar Number"
        value={aadhaar}
        onChange={(e) => setAadhaar(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </div>
  );
}
