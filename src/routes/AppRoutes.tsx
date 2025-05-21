import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import {Layout } from '../components/layouts/Layout';
import PatientPage from "../pages/PatientPage";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Homepage />} />
      <Route path="patients" element={<PatientPage />} />
      <Route path="/patients/:id" element={<PatientPage />} />
    </Route>
    
  </Routes>
);
