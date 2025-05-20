// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import { Navbar } from "./Navbar";
// import { Sidebar } from "./Sidebar";

// export const Layout = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
  

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Navbar */}
//       <header className="w-full fixed top-0 z-50">
//         <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
//       </header>

//       {/* Sidebar and Main Content */}
//       <div className="flex flex-1 pt-16 relative">
//         <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

//         {/* Overlay for small screens */}
//         {isSidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { RegisterPatientDrawer } from "../patients/RegisterPatientDrawer"; // ✅ import

export const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isRegisterDrawerOpen, setRegisterDrawerOpen] = useState(false); // ✅ new state

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="w-full fixed top-0 z-50">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          onRegisterClick={() => setRegisterDrawerOpen(true)} // ✅ pass prop
        />
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex flex-1 pt-16 relative">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Overlay for small screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* ✅ Register Patient Drawer */}
      {isRegisterDrawerOpen && (
        <RegisterPatientDrawer onClose={() => setRegisterDrawerOpen(false)} />
      )}
    </div>
  );
};
