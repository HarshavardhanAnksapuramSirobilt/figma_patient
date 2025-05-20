import { Bell, Menu, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SirobiltImage from '../../assets/images/logos/sirobilt.png'

export const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    return (
        <div className="flex items-center justify-between px-4 py-2 shadow bg-white w-full">
            <div className="flex items-center gap-4">
                {/* Hamburger visible only on <md */}
                <button className="block md:hidden" onClick={toggleSidebar}>
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={SirobiltImage} alt="Logo" className="h-8 w-auto" />
                    </Link>

                </div>

            </div>

            <div className="flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered input-sm w-40"
                />

                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-sm btn-outline">
                        Quick Actions
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li><a>Register Patient</a></li>
                        <li><a>Book Appointment</a></li>
                    </ul>
                </div>

                <Bell className="w-5 h-5 cursor-pointer" />
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} className="avatar cursor-pointer">
                        <UserCircle className="w-6 h-6" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 mt-2"
                    >
                        <li><a>Profile</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
