import React from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarDays, User2, Hospital } from "lucide-react";

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171"];

const departmentData = [
  { name: "Cardiology", value: 30 },
  { name: "Pediatrics", value: 20 },
  { name: "Emergency", value: 25 },
  { name: "General", value: 25 },
];

const admissionData = [
  { date: "Mon", patients: 30 },
  { date: "Tue", patients: 45 },
  { date: "Wed", patients: 38 },
  { date: "Thu", patients: 50 },
  { date: "Fri", patients: 65 },
];

const appointments = [
  { time: "09:00 AM", patient: "John Doe", doctor: "Dr. Smith", dept: "Cardiology" },
  { time: "10:30 AM", patient: "Jane Smith", doctor: "Dr. Lee", dept: "Pediatrics" },
  { time: "11:15 AM", patient: "Rahul Kumar", doctor: "Dr. Mehta", dept: "Emergency" },
];

const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="flex items-center p-4 bg-white shadow-md rounded-xl border border-gray-100 gap-4">
    <div className="p-2 bg-blue-100 text-blue-700 rounded-full">{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-lg font-bold text-gray-800">{value}</div>
    </div>
  </div>
);

const Homepage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🏥 Hospital Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Patients Today" value="93" icon={<User2 size={20} />} />
        <StatCard title="Appointments" value="31" icon={<CalendarDays size={20} />} />
        <StatCard title="Available Beds" value="42 / 100" icon={<Hospital size={20} />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">Admissions This Week</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={admissionData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="patients" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">Department Load</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">📅 Upcoming Appointments</h2>
        <div className="space-y-3">
          {appointments.map((a, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div>
                <div className="font-medium text-gray-700">{a.patient}</div>
                <div className="text-xs text-gray-500">{a.dept} — {a.doctor}</div>
              </div>
              <div className="text-sm text-gray-600">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
