import React, { useContext, useState } from 'react';
import { TrendingUp, Users, BookOpen, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../images/logo.png';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { id: '/dashboard', label: 'Dashboard', icon: TrendingUp },
        { id: '/dashboard/instructors', label: 'Instructors', icon: Users },
        { id: '/dashboard/courses', label: 'Courses', icon: BookOpen },
        { id: '/logout', label: 'Logout', icon: LogOut },
    ];

    return (
        <>
            <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-200 fixed w-full z-50">
                <button onClick={toggleSidebar} className="text-gray-700">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="ml-4 flex items-center gap-1">
                    <img src={logo} alt="logo" className="w-8 object-cover" />
                    <span className="text-lg font-semibold text-gray-800">Byway</span>
                </div>
            </div>
            <div
                className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 transform md:translate-x-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:relative md:w-64 w-64 pt-20 md:pt-6`}
            >
                <div className="p-6 hidden md:flex items-center gap-1 mb-6">
                    <img src={logo} alt="logo" className="w-10 object-cover" />
                    <span className="text-xl font-semibold text-gray-800">Byway</span>
                </div>
                <nav>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            location.pathname === item.id ||
                            location.pathname.startsWith(item.id + '/');

                        return item.id === '/logout' ? (
                            <button
                                key={item.id}
                                onClick={handleLogout}
                                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 hover:bg-gray-50 ${isActive
                                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ) : (
                            <Link
                                key={item.id}
                                to={item.id}
                                onClick={() => setIsOpen(false)}
                                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 hover:bg-gray-50 ${isActive
                                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
