import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// --- Data Structure ---
const navItems = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Info", path: "/info" },
    { name: "Contact", path: "/contact" },
];

// --- NavLink Component (Vertical Focus) ---
function NavLink({ item, isActive, onClick }) {
    const baseClasses = "block py-3 px-4 rounded-lg transition-all duration-150 text-base tracking-wide";
    const activeClasses = "text-blue-400 font-bold bg-slate-800 border-l-4 border-blue-400";
    const inactiveClasses = "text-slate-300 hover:text-white hover:bg-slate-800";

    return (
        <li className="mb-1.5">
            <Link
                to={item.path}
                onClick={onClick}
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            >
                {item.name}
            </Link>
        </li>
    );
}

// --- Main Sidebar Component ---
export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(prev => !prev);
    const closeMenu = () => setIsOpen(false);

    // --- Tailwind Class Strings ---
    
    // 💡 THE FIX IS HERE: Changed h-full to h-screen
    const sidebarBaseClasses = "fixed md:static top-0 left-0 **h-screen** w-64 bg-slate-900 p-6 transform transition-transform duration-300 shadow-2xl md:shadow-none";

    // State Classes
    const sidebarMobileStateClasses = isOpen ? "translate-x-0" : "-translate-x-full";
    const sidebarClasses = `${sidebarBaseClasses} ${sidebarMobileStateClasses} md:translate-x-0`;

    // Mobile Toggle Button
    const mobileToggleClasses = "md:hidden fixed top-4 left-4 z-50 bg-slate-900 p-2 rounded-md text-white shadow-lg";

    return (
        <>
            {/* 1. Mobile Toggle Button */}
            <button className={mobileToggleClasses} onClick={toggleMenu} aria-expanded={isOpen} aria-controls="sidebar-menu">
                {isOpen ? <X size={24} aria-label="Close menu" /> : <Menu size={24} aria-label="Open menu" />}
            </button>

            {/* 2. Sidebar Container */}
            <div id="sidebar-menu" className={sidebarClasses}>
                
                {/* Optional: Add a Logo/Header inside the sidebar */}
                <div className="mb-8 pt-4">
                    <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
                </div>

                <ul className="pt-0">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            item={item}
                            isActive={location.pathname === item.path}
                            onClick={closeMenu}
                        />
                    ))}
                </ul>
            </div>
            {/* 3. Mobile Overlay: Ensures clicks outside close the drawer */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeMenu}
                    aria-hidden="true"
                ></div>
            )}
        </>
    );
}