import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import {Layout } from '../components/layouts/Layout';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Homepage />} />
    </Route>
  </Routes>
);
