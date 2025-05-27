// import { Home, Users, Calendar, Stethoscope, X } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";

// interface SidebarProps {
//   isOpen: boolean;
//   setIsOpen: (val: boolean) => void;
// }

// export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
//   const location = useLocation();

//   const navItems = [
//     { to: "/", label: "Dashboard", icon: <Home /> },
//     { to: "/list", label: "Patients", icon: <Users /> },
//     { to: "/appointments", label: "Appointments", icon: <Calendar /> },
//     { to: "/doctors", label: "Doctors", icon: <Stethoscope /> },
//   ];

//   return (
//     <aside
//       className={`${
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       } md:translate-x-0 sticky md:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-base-200 w-16 md:w-16 hover:w-48 transition-all duration-200 z-40 overflow-hidden group`}
//     >
//       {/* Close button on small screens */}
//       <div className="md:hidden flex justify-end p-2">
//         <X className="mt-10 w-5 h-5 cursor-pointer" onClick={() => setIsOpen(false)} />
//       </div>

//       <ul className="menu space-y-1 p-2 text-base-content">
//         {navItems.map((item) => (
//           <li key={item.to} className={location.pathname === item.to ? "bg-base-300 rounded" : ""}>
//             <Link to={item.to} className="flex items-center gap-3">
//               {item.icon}
//               <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                 {item.label}
//               </span>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// };
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, UserPlus, Calendar, Stethoscope, X, ChevronDown, ChevronRight } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const navItems = [
    { to: "/", label: "Dashboard", icon: <Home /> },
    {
      label: "New Patient Registration",
      icon: <UserPlus />,
      children: [
        { to: "/abha-aadhaar", label: "ABHA with Aadhaar" },
        { to: "/abha-drivinglicense", label: "ABHA with Driving License" },
        { to: "/patients", label: "Manual Registration" },
      ],
    },
    { to: "/list", label: "Patients", icon: <Users /> },
    { to: "/appointments", label: "Appointments", icon: <Calendar /> },
    { to: "/doctors", label: "Doctors", icon: <Stethoscope /> },
  ];

  return (
    <aside
      className={`${isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-base-200 w-64 md:w-20 hover:w-64 transition-all duration-200 z-40 overflow-y-auto group`}
    >
      {/* Close button on small screens */}
      <div className="md:hidden flex justify-end p-2">
        <X className="mt-10 w-5 h-5 cursor-pointer" onClick={() => setIsOpen(false)} />
      </div>

      <ul className="menu space-y-1 p-2 text-base-content">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const hasChildren = !!item.children;

          return (
            <li key={item.label} className={isActive ? "bg-base-300 rounded" : ""}>
              {hasChildren ? (
                <>
                  <div
                    className="flex items-center justify-between gap-2 cursor-pointer px-2 py-2 rounded hover:bg-base-300"
                    onClick={() =>
                      setExpandedItem(expandedItem === item.label ? null : item.label)
                    }
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="whitespace-nowrap opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {item.label}
                      </span>
                    </div>
                    <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {expandedItem === item.label ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>
                  {/* Submenu */}
                  <ul
                    className={`pl-10 mt-1 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${expandedItem === item.label ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    {item.children.map((child) => (
                      <li
                        key={child.to}
                        className={`rounded px-2 py-1 ${location.pathname === child.to ? "bg-base-300" : "hover:bg-base-100"
                          }`}
                      >
                        <Link to={child.to} className="block text-sm">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  to={item.to}
                  className="flex items-center gap-3 px-2 py-2 rounded hover:bg-base-300"
                >
                  {item.icon}
                  <span className="whitespace-nowrap opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {item.label}
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};