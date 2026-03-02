import { Link } from 'react-router-dom';
import { Home, ChevronLeft, AlertCircle, Ghost } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="flex-grow flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl min-h-[500px] border-2 border-dashed border-gray-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 transform translate-x-1/2 -translate-y-1/2 bg-red-50 rounded-full w-96 h-96 blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 p-8 transform -translate-x-1/4 translate-y-1/4 bg-red-100 rounded-full w-80 h-80 blur-2xl opacity-30"></div>

            <div className="relative z-10 flex flex-col items-center gap-10 text-center max-w-2xl px-4 animate-fade-in">
                <div className="w-40 h-40 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                    <Ghost size={100} />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-red-500 text-white px-6 py-2 rounded-full font-extrabold text-sm uppercase self-center tracking-widest shadow-lg shadow-red-200">
                        Error 404
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-gray-800 tracking-tighter">Lost in space?</h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-lg mx-auto opacity-70">
                        The page you're looking for doesn't exist or has been moved to another dimension.
                    </p>
                </div>

                <div className="flex items-center gap-6 mt-4">
                    <Link to="/" className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 hover:scale-110 active:scale-95 active:shadow-md active:translate-y-1">
                        <Home size={22} strokeWidth={2.5} />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-indigo-100 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all active:scale-95 active:translate-y-1"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                        Go Back
                    </button>
                </div>

                <div className="mt-8 flex items-center gap-3 text-red-400 font-bold opacity-50 text-sm md:text-base">
                    <AlertCircle size={20} />
                    <span>If you think this is a bug, please contact your instructor.</span>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
