import { useState, useEffect } from 'react';
import api from '../services/api';
import StudentCard from '../components/student/StudentCard';
import { Search, Users, GraduationCap, LayoutGrid } from 'lucide-react';

const ClassPage = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await api.get('/classes');
                setClasses(res.data);
                if (res.data.length > 0) {
                    handleClassSelect(res.data[0]);
                }
            } catch (err) {
                console.error('Error fetching classes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const handleClassSelect = async (cls) => {
        setLoading(true);
        setSelectedClass(cls);
        try {
            const res = await api.get(`/students?class_id=${cls.id}`);
            setStudents(res.data);
        } catch (err) {
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.bio && student.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-gray-100">
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight flex items-center gap-4">
                        <GraduationCap size={44} className="text-indigo-600" />
                        Class Community
                    </h1>
                    <p className="text-gray-500 font-medium opacity-80 pl-1">Browse and discover portfolios from your fellow students.</p>
                </div>

                <div className="relative w-full md:w-[400px] group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder="Search students or bios..."
                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-transparent focus:border-indigo-100 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className="grid lg:grid-cols-4 gap-10">
                {/* Sidebar: Class List */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="flex items-center gap-3 text-indigo-600 mb-2">
                        <Users size={24} />
                        <h2 className="text-xl font-bold">Select Class</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {classes.length === 0 ? (
                            <p className="text-gray-400 italic font-medium p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">No classes available.</p>
                        ) : (
                            classes.map(cls => (
                                <button
                                    key={cls.id}
                                    onClick={() => handleClassSelect(cls)}
                                    className={`flex flex-col items-start gap-1 p-5 rounded-3xl transition border-2 ${selectedClass?.id === cls.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50'}`}
                                >
                                    <span className="font-extrabold text-lg">{cls.name}</span>
                                    <span className={`text-xs uppercase font-bold tracking-widest ${selectedClass?.id === cls.id ? 'text-indigo-100' : 'text-gray-400 opacity-60'}`}>{cls.description || 'General Class'}</span>
                                </button>
                            ))
                        )}
                    </div>
                </aside>

                {/* Main: Student Grid */}
                <main className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <LayoutGrid size={24} className="text-indigo-600" />
                            {selectedClass ? `${selectedClass.name} Students` : 'All Students'}
                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-sm font-extrabold">
                                {filteredStudents.length}
                            </span>
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full py-20 text-center font-bold text-gray-400 animate-pulse">Loading class roster...</div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="col-span-full py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-center text-gray-400">
                                <p className="text-lg font-medium italic">No students found in this selection.</p>
                            </div>
                        ) : (
                            filteredStudents.map(student => (
                                <StudentCard key={student.id} student={student} />
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ClassPage;
