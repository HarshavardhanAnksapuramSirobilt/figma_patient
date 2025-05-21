import { PatientRegistrationForm } from "../components/patients/PatientRegistrationForm";
import { useParams } from "react-router-dom";

const PatientPage = () => {
    const { id } = useParams<{ id?: string }>();
  return (
    <div className="p-6">
      <PatientRegistrationForm patientId={id} />
    </div>
  );
};

export default PatientPage;
