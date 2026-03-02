import { Link } from 'react-router-dom';
import { User, ExternalLink, ChevronRight } from 'lucide-react';

const StudentCard = ({ student }) => {
    return (
        <Link
            to={`/student/${student.id}`}
            className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col gap-6"
        >
            <div className="absolute top-0 right-0 p-4 transform translate-x-1/4 -translate-y-1/4 bg-indigo-50/50 rounded-full w-40 h-40 blur-2xl group-hover:bg-indigo-100/50 transition-colors"></div>

            <div className="relative z-10 flex items-start justify-between">
                <div className="w-20 h-20 bg-indigo-100 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 transition shrink-0 border-2 border-indigo-50">
                    {student.avatar_url ? (
                        <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                    ) : (
                        <User size={40} />
                    )}
                </div>
                <div className="p-3 bg-gray-50 text-gray-300 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors self-start shadow-sm shadow-gray-100">
                    <ExternalLink size={20} />
                </div>
            </div>

            <div className="relative z-10 space-y-3">
                <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {student.full_name}
                </h3>
                <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed opacity-80 min-h-[60px] italic">
                    {student.bio || 'This student hasn\'t added a bio yet but has an amazing portfolio.'}
                </p>
            </div>

            <div className="relative z-10 mt-auto flex items-center justify-between pt-6 border-t border-gray-50 group-hover:border-indigo-50 transition-colors">
                <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500 bg-indigo-50/50 px-3 py-1 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    Student
                </span>
                <div className="flex items-center gap-1 text-gray-400 group-hover:text-indigo-600 transition-colors font-bold text-sm">
                    View Profile
                    <ChevronRight size={18} />
                </div>
            </div>
        </Link>
    );
};

export default StudentCard;
