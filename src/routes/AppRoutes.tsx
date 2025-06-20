import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import {Layout } from '../components/layouts/Layout';
import PatientPage from "../pages/PatientPage";
import PatientListPage from "../pages/PatientListPage";
import AbhaRegistrationForm from "../components/Abha/Aadhaar/AbhaRegistrationForm";
import AppointmentsPage from "../pages/AppointmentsPage";
import AppointmentTestPage from "../pages/AppointmentTestPage";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Homepage />} />
      <Route path="patients" element={<PatientPage />} />
      <Route path="/patients/:id" element={<PatientPage />} />
      <Route path="list" element={<PatientListPage />} />
      <Route path="/abha-aadhaar" element={<AbhaRegistrationForm />} />
      <Route path="appointments" element={<AppointmentsPage />} />
      <Route path="appointments-test" element={<AppointmentTestPage />} />
    </Route>

  </Routes>
);
