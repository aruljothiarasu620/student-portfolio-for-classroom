import { Link } from 'react-router-dom';
import { Briefcase, Users, LayoutDashboard, Database, ShieldCheck, Rocket } from 'lucide-react';

const HomePage = () => {
    const features = [
        {
            title: 'Student Portfolios',
            desc: 'Showcase your best projects, research, and skills to peers and faculty.',
            icon: <Briefcase className="text-blue-600" size={32} />
        },
        {
            title: 'Class Directory',
            desc: 'Connect with classmates and discover their unique skill sets and achievements.',
            icon: <Users className="text-green-600" size={32} />
        },
        {
            title: 'Teacher Management',
            desc: 'Easily manage class lists, review student work, and track progress.',
            icon: <LayoutDashboard className="text-indigo-600" size={32} />
        },
        {
            title: 'Project Showcases',
            desc: 'Add images, links, and detailed descriptions to your personal projects.',
            icon: <Rocket className="text-purple-600" size={32} />
        },
        {
            title: 'MySQL Powered',
            desc: 'Robust and reliable database management for all your student information.',
            icon: <Database className="text-red-500" size={32} />
        },
        {
            title: 'Secure Accounts',
            desc: 'JWT authentication ensures your portfolio is yours alone to edit.',
            icon: <ShieldCheck className="text-teal-500" size={32} />
        }
    ];

    return (
        <div className="flex flex-col gap-12">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center p-8 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-500 rounded-3xl text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 transform translate-x-1/2 -translate-y-1/2 bg-white/10 rounded-full w-96 h-96 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 p-8 transform -translate-x-1/4 translate-y-1/4 bg-blue-400/20 rounded-full w-80 h-80 blur-2xl"></div>

                <div className="relative z-10 max-w-4xl text-center flex flex-col items-center gap-8">
                    <div className="flex items-center gap-4 animate-bounce">
                        <GraduationCap size={48} className="text-blue-100" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                        Build Your Digital <br />
                        <span className="text-blue-200">Success Story</span>
                    </h1>
                    <p className="text-lg md:text-xl text-indigo-100 max-w-2xl leading-relaxed">
                        The ultimate platform for students to showcase their academic and creative achievements.
                        Join EduPortfolio to build your professional profile today.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/register" className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition shadow-xl hover:scale-105 active:scale-95">
                            Get Started
                        </Link>
                        <Link to="/classes" className="px-8 py-4 bg-indigo-500/50 backdrop-blur-md text-white border-2 border-indigo-400/30 rounded-2xl font-bold text-lg hover:bg-indigo-500/70 transition">
                            Explore Classes
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8 py-10 px-4">
                {features.map((feature, idx) => (
                    <div key={idx} className="group p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-b-transparent hover:border-b-indigo-500">
                        <div className="mb-6 w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </section>

            {/* Stats/Call-to-Action */}
            <section className="bg-indigo-50 p-12 rounded-3xl flex flex-col md:flex-row items-center justify-around gap-8 text-indigo-900 border border-indigo-100">
                <div className="text-center md:text-left space-y-2">
                    <h2 className="text-3xl font-extrabold">Ready to start?</h2>
                    <p className="text-indigo-600 text-lg font-medium opacity-80">Join hundreds of students already showcasing their work.</p>
                </div>
                <Link to="/login" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 hover:scale-110 active:scale-95">
                    Sign In Now
                </Link>
            </section>
        </div>
    );
};

// Helper for Lucide icon
const GraduationCap = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

export default HomePage;
