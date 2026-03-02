import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, LogIn, LogOut, UserPlus, Home, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between sticky top-0 z-50">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600 transition hover:text-indigo-800">
                <GraduationCap size={40} />
                <span className="hidden sm:inline">EduPortfolio</span>
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                    <Home size={18} />
                    <span className="hidden md:inline">Home</span>
                </Link>
                <Link to="/classes" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                    <span className="hidden md:inline">Classes</span>
                </Link>

                {user ? (
                    <>
                        <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                            <User size={18} />
                            <span className="hidden md:inline">{user.role === 'teacher' ? 'Management' : 'My Portfolio'}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-2 transition"
                        >
                            <LogOut size={18} />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                            <LogIn size={18} />
                            <span>Login</span>
                        </Link>
                        <Link to="/register" className="px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 transition shadow-lg shadow-indigo-100">
                            <UserPlus size={18} />
                            <span>Register</span>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
