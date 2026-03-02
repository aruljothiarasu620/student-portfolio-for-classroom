import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, AlertCircle, Loader2, UserCircle2, GraduationCap } from 'lucide-react';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const res = await register(email, password, role);
        setIsSubmitting(false);

        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col p-8 md:p-12 gap-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 transition hover:bg-indigo-100 mb-2">
                        <UserPlus size={40} />
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Create Account</h2>
                    <p className="text-gray-500 font-medium opacity-80">Join the EduPortfolio community today</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3 animate-shake font-semibold text-sm md:text-base">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`p-6 rounded-3xl flex flex-col items-center gap-3 transition border-2 ${role === 'student' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-100 hover:text-gray-600'}`}
                        >
                            <UserCircle2 size={32} />
                            <span className="font-bold">I am a Student</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('teacher')}
                            className={`p-6 rounded-3xl flex flex-col items-center gap-3 transition border-2 ${role === 'teacher' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-100 hover:text-gray-600'}`}
                        >
                            <GraduationCap size={32} />
                            <span className="font-bold">I am a Teacher</span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-600 px-1 ml-1 self-start">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-600 px-1 ml-1 self-start">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 duration-200"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'Register Now'}
                    </button>
                </form>

                <p className="text-center text-gray-500 font-medium mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4 decoration-2">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
