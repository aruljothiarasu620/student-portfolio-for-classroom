import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Briefcase, Award, Save, Plus, Trash2, Edit3, Globe, Mail, BookOpen } from 'lucide-react';

const DashboardPage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        full_name: '',
        bio: '',
        contact_email: '',
        avatar_url: '',
        class_id: 1
    });
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user && user.role === 'student') {
            fetchStudentData();
        }
    }, [user]);

    const fetchStudentData = async () => {
        try {
            const res = await api.get('/students/me');
            if (res.data) {
                setProfile(res.data);
                const [skillsRes, projectsRes] = await Promise.all([
                    api.get(`/students/${res.data.id}/skills`),
                    api.get(`/students/${res.data.id}/projects`)
                ]);
                setSkills(skillsRes.data);
                setProjects(projectsRes.data);
            }
        } catch (err) {
            console.error('Error fetching student data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/students/me', profile);
            // Refresh to get updated data
            await fetchStudentData();
        } catch (err) {
            console.error('Error updating profile:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;
        try {
            const res = await api.post('/skills', { skill_name: newSkill });
            setSkills([...skills, res.data]);
            setNewSkill('');
        } catch (err) {
            console.error('Error adding skill:', err);
        }
    };

    const handleDeleteSkill = async (id) => {
        try {
            await api.delete(`/skills/${id}`);
            setSkills(skills.filter(s => s.id !== id));
        } catch (err) {
            console.error('Error deleting skill:', err);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Column */}
            <div className="lg:col-span-1 space-y-8">
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-indigo-600">
                        <User size={24} />
                        <h2 className="text-xl font-bold">Profile Info</h2>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 rounded-2xl px-4 py-3 transition-all font-medium"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Contact Email</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-2xl transition-all font-medium"
                                    value={profile.contact_email}
                                    onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Short Bio</label>
                            <textarea
                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-2xl px-4 py-3 transition-all font-medium min-h-[120px]"
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </section>

                {/* Skills Section */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 text-indigo-600">
                        <Award size={24} />
                        <h2 className="text-xl font-bold">Skills</h2>
                    </div>

                    <form onSubmit={handleAddSkill} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Add skill (e.g. React)"
                            className="flex-grow bg-gray-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-100"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                        />
                        <button type="submit" className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition">
                            <Plus size={24} />
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span key={skill.id} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 text-gray-700 rounded-xl text-sm font-bold group">
                                {skill.skill_name}
                                <button
                                    onClick={() => handleDeleteSkill(skill.id)}
                                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </section>
            </div>

            {/* Projects Column */}
            <div className="lg:col-span-2 space-y-8">
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <Briefcase size={24} />
                            <h2 className="text-2xl font-bold">My Projects</h2>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition shadow-sm active:scale-95">
                            <Plus size={20} />
                            New Project
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {projects.length === 0 ? (
                            <div className="md:col-span-2 py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center gap-4">
                                <BookOpen size={48} className="opacity-20" />
                                <p className="font-medium text-lg">No projects added yet.</p>
                            </div>
                        ) : (
                            projects.map(project => (
                                <div key={project.id} className="group p-6 bg-gray-50/50 border border-gray-100 rounded-3xl hover:bg-white hover:shadow-xl transition-all border-b-4 border-b-transparent hover:border-b-indigo-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                                                <Edit3 size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{project.description}</p>
                                    <div className="flex items-center gap-4">
                                        <a href={project.project_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-600 text-sm font-bold hover:underline underline-offset-4">
                                            <Globe size={16} />
                                            View Live
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;
