// import { Bell, Menu, UserCircle } from "lucide-react";
// import SirobiltImage from "../../assets/images/logos/sirobilt.png";

// type Props = {
//   toggleSidebar: () => void;
//   onRegisterClick: () => void; // ✅ add this prop
// };

// export const Navbar = ({ toggleSidebar, onRegisterClick }: Props) => {
//   return (
//     <div className="flex items-center justify-between px-4 py-2 shadow bg-white w-full h-16">
//       <div className="flex items-center gap-4">
//         <button className="block md:hidden" onClick={toggleSidebar}>
//           <Menu className="w-6 h-6" />
//         </button>

//         <img src={SirobiltImage} alt="Logo" className="h-8 w-auto" />
//       </div>

//       <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
//         <input
//           type="text"
//           placeholder="Search"
//           className="input input-bordered input-sm w-40"
//         />

//         {/* ✅ Quick Actions Dropdown */}
//         <div className="dropdown dropdown-end">
//           <label tabIndex={0} className="btn btn-sm btn-outline">
//             Quick Actions
//           </label>
//           <ul
//             tabIndex={0}
//             className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
//           >
//             <li>
//               <button type="button" onClick={onRegisterClick}>
//                 Register Patient
//               </button>
//             </li>
//             <li>
//               <a>Book Appointment</a>
//             </li>
//           </ul>
//         </div>

//         <Bell className="w-5 h-5 cursor-pointer" />

//         <div className="dropdown dropdown-end">
//           <div tabIndex={0} className="avatar cursor-pointer">
//             <UserCircle className="w-6 h-6" />
//           </div>
//           <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 mt-2">
//             <li><a>Profile</a></li>
//             <li><a>Logout</a></li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };
import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import SirobiltImage from "../../assets/images/logos/sirobilt.png";

type Props = {
  toggleSidebar: () => void;
  onRegisterClick: () => void;
};

export const Navbar = ({ toggleSidebar, onRegisterClick }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white shadow-sm w-full h-16">
      {/* Left: Logo, Toggle, Search */}
      <div className="flex items-center gap-4">
        <button className="block md:hidden" onClick={toggleSidebar}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <Link to="/" className="flex items-center space-x-2">
          <img src={SirobiltImage} alt="Logo" className="h-8 w-auto" />
        </Link>

        {/* Search Filter */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <select className="border px-2 py-1.5 rounded-md text-sm bg-white text-black">
            <option>All</option>
            <option>Patients</option>
            <option>Doctors</option>
          </select>

          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Search"
              className="pl-7 pr-8 py-1.5 border rounded-md text-sm text-black"
            />

            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="flex items-center gap-2 px-4 py-1.5 border border-purple-600 text-purple-600 rounded-full cursor-pointer text-base font-medium bg-white hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Quick Actions
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-white text-black rounded-box w-52 mt-2 border border-gray-200"
          >
            <li>
              <button type="button" onClick={onRegisterClick}>
                Register Patient
              </button>
            </li>
            <li>
              <a>Book Appointment</a>
            </li>
          </ul>
        </div>

        {/* Bell Icon */}
        <Bell className="w-5 h-5 text-gray-700 cursor-pointer" />

        {/* Profile Avatar */}
        <div className="relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="avatar w-10 h-10 rounded-full ring ring-blue-400 ring-offset-2 cursor-pointer"
          >
            <div className="relative w-full h-full">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="User Profile"
                className="rounded-full object-cover w-full h-full"
              />
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>

          {/* Manual Dropdown */}
          {isOpen && (
            <ul
              className="absolute right-0 mt-2 w-40 py-2 bg-black text-white rounded-lg shadow-lg z-50"
              onClick={() => setIsOpen(false)}
            >
              <li className="hover:bg-gray-700">
                <a className="block px-4 py-2 cursor-pointer">Profile</a>
              </li>
              <li className="hover:bg-gray-700">
                <a className="block px-4 py-2 cursor-pointer">Logout</a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};