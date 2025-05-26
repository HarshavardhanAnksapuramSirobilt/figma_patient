import { FaIdCard, FaMobileAlt } from "react-icons/fa";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { label: "Aadhaar", icon: <FaIdCard /> },
  { label: "Verify OTP", icon: <FaMobileAlt /> },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, index) => {
        const isActive = index <= currentStep;
        return (
          <div key={index} className="flex-1 text-center relative">
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isActive ? "border-green-600 bg-green-100 text-green-800" : "border-gray-300 bg-white text-gray-400"
              } mx-auto`}
            >
              {step.icon}
            </div>
            <div
              className={`mt-2 text-sm font-medium ${
                isActive ? "text-green-700" : "text-gray-400"
              }`}
            >
              {step.label}
            </div>

            {index < steps.length - 1 && (
              <div className={`absolute top-5 left-1/2 w-full h-1 -z-10 ${isActive ? "bg-green-500" : "bg-gray-200"}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
