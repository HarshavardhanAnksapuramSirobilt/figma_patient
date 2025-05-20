import { Home, Users, Calendar, Stethoscope, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Dashboard", icon: <Home /> },
    { to: "/patients", label: "Patients", icon: <Users /> },
    { to: "/appointments", label: "Appointments", icon: <Calendar /> },
    { to: "/doctors", label: "Doctors", icon: <Stethoscope /> },
  ];

  return (
    <aside
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 fixed md:static top-0 left-0 h-[calc(100vh-4rem)] bg-base-200 w-16 md:w-16 hover:w-48 transition-all duration-200 z-40 overflow-hidden group`}
    >
      {/* Close button on small screens */}
      <div className="md:hidden flex justify-end p-2">
        <X className="w-5 h-5 cursor-pointer" onClick={() => setIsOpen(false)} />
      </div>

      <ul className="menu space-y-1 p-2 text-base-content">
        {navItems.map((item) => (
          <li key={item.to} className={location.pathname === item.to ? "bg-base-300 rounded" : ""}>
            <Link to={item.to} className="flex items-center gap-3">
              {item.icon}
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
