import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Briefcase, Award, Globe, Mail, BookOpen, ChevronLeft, MapPin } from 'lucide-react';

const StudentProfilePage = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await api.get(`/students/${id}`);
                setStudent(res.data);
            } catch (err) {
                console.error('Error fetching student:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
    if (!student) return <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 font-bold text-gray-500">Student not found.</div>;

    return (
        <div className="flex flex-col gap-10">
            {/* Back Link */}
            <Link to="/classes" className="self-start flex items-center gap-2 text-indigo-600 font-bold hover:translate-x-[-4px] transition-transform">
                <ChevronLeft size={20} />
                Back to Classes
            </Link>

            {/* Hero Header */}
            <header className="relative p-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col items-center md:flex-row md:items-start gap-10">
                <div className="absolute top-0 right-0 p-8 transform translate-x-1/2 -translate-y-1/2 bg-indigo-50 rounded-full w-80 h-80 blur-3xl"></div>

                <div className="relative z-10 w-48 h-48 bg-indigo-100 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center text-indigo-400 group border-4 border-indigo-50 shrink-0">
                    {student.avatar_url ? (
                        <img
                            src={student.avatar_url}
                            alt={student.full_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                    ) : (
                        <User size={80} />
                    )}
                </div>

                <div className="relative z-10 flex-grow text-center md:text-left flex flex-col gap-4">
                    <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">{student.full_name}</h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 font-medium">
                        <span className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold">
                            <Award size={16} /> Student
                        </span>
                        <span className="flex items-center gap-2 px-1">
                            <MapPin size={18} className="text-gray-300" /> Web Development Class
                        </span>
                        {student.contact_email && (
                            <a href={`mailto:${student.contact_email}`} className="flex items-center gap-2 text-indigo-600 hover:underline hover:scale-105 transition active:scale-95 px-1">
                                <Mail size={18} /> {student.contact_email}
                            </a>
                        )}
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mt-2 font-medium bg-gray-50/50 p-6 rounded-2xl border-l-4 border-indigo-100">
                        {student.bio || 'This student hasn\'t added a bio yet.'}
                    </p>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Skills Column */}
                <aside className="lg:col-span-1 space-y-8">
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-8">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <Award size={24} />
                            <h2 className="text-2xl font-bold">Technical Skills</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {student.skills.length === 0 ? (
                                <p className="text-gray-400 italic font-medium">No skills listed.</p>
                            ) : (
                                student.skills.map(skill => (
                                    <span key={skill.id} className="px-5 py-3 bg-indigo-50 text-indigo-600 text-sm font-extrabold rounded-2xl hover:scale-110 transition-transform cursor-default">
                                        {skill.skill_name}
                                    </span>
                                ))
                            )}
                        </div>
                    </section>
                </aside>

                {/* Projects Column */}
                <main className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-8">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <Briefcase size={24} />
                            <h2 className="text-2xl font-bold">Featured Projects</h2>
                        </div>

                        <div className="grid gap-8">
                            {student.projects.length === 0 ? (
                                <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center gap-4">
                                    <BookOpen size={48} className="opacity-20" />
                                    <p className="font-medium text-lg italic">No projects added to this portfolio yet.</p>
                                </div>
                            ) : (
                                student.projects.map(project => (
                                    <div key={project.id} className="group p-8 bg-gray-50/50 border border-gray-100 rounded-3xl hover:bg-white hover:shadow-2xl transition duration-500 flex flex-col gap-6 relative overflow-hidden border-b-8 border-b-transparent hover:border-b-indigo-500">
                                        <div className="flex flex-col md:flex-row gap-8">
                                            {project.image_url && (
                                                <div className="w-full md:w-64 h-48 bg-gray-100 rounded-2xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-4">
                                                <h3 className="text-2xl font-extrabold text-gray-800">{project.title}</h3>
                                                <p className="text-gray-500 leading-relaxed font-medium">
                                                    {project.description}
                                                </p>
                                                {project.project_link && (
                                                    <a
                                                        href={project.project_link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-2 self-start flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 hover:scale-110 active:scale-95"
                                                    >
                                                        <Globe size={18} />
                                                        Visit Project
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default StudentProfilePage;
