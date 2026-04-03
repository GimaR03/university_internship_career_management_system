import React, { useEffect, useState } from 'react';
import { FiMessageSquare, FiPieChart, FiStar, FiCheckCircle, FiInfo, FiUser } from 'react-icons/fi';
import { getStudentReviews, submitStudentReview } from './student_utils';

const initialForm = {
    rating: 5,
    title: '',
    comment: '',
    category: 'System Feedback',
    recommendation: 'Yes',
    performance: 5,
};

const statusTone = {
    pending: 'bg-amber-900/30 text-amber-400 border-amber-500/20',
    replied: 'bg-indigo-900/30 text-indigo-300 border-indigo-500/20',
    closed: 'bg-slate-800/50 text-slate-400 border-slate-700/50',
};

const S_StudentReviews = () => {
    const [activePage, setActivePage] = useState('submit');
    const [formData, setFormData] = useState(initialForm);
    const [reviews, setReviews] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const result = await getStudentReviews();
                setReviews(result.data || []);
            } catch (err) {
                setError(err.message || 'Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: (name === 'rating' || name === 'performance') ? Number(value) : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        // Concatenate new fields into the comment for backend compatibility
        const enrichedComment = `${formData.comment}\n\n--- Additional Details ---\nCategory: ${formData.category}\nRecommend: ${formData.recommendation}\nSystem Performance: ${formData.performance}/5`;

        try {
            const submissionData = {
                rating: formData.rating,
                title: formData.title,
                comment: enrichedComment
            };

            const result = await submitStudentReview(submissionData);
            setReviews((current) => [result.data, ...current]);
            setFormData(initialForm);
            setMessage('Your experience has been shared. Admin will review your feedback shortly.');

            setTimeout(() => setActivePage('history'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Alert Messages */}
            <div className="fixed top-24 right-8 z-50 flex flex-col gap-3 w-80">
                {message && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-slate-900/90 backdrop-blur-md px-5 py-4 text-sm text-emerald-400 shadow-2xl animate-in slide-in-from-right-10">
                        <FiCheckCircle className="text-xl flex-shrink-0" />
                        <span>{message}</span>
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-slate-900/90 backdrop-blur-md px-5 py-4 text-sm text-rose-400 shadow-2xl animate-in slide-in-from-right-10">
                        <FiInfo className="text-xl flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* Navigation Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1e1b4b] to-[#312e81] p-8 text-white shadow-2xl shadow-indigo-900/30 border border-indigo-500/10">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">Student Insights</h1>
                            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] uppercase font-black tracking-widest text-indigo-300">Review Center</span>
                        </div>
                        <p className="mt-2 text-indigo-200/80 max-w-md font-medium">
                            Share your internship journey, evaluate platform performance, and help us improve.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/5">
                        {[
                            { id: 'submit', label: 'Share Experience', icon: FiMessageSquare },
                            { id: 'history', label: 'My Journey', icon: FiPieChart },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActivePage(tab.id)}
                                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 ${activePage === tab.id
                                    ? 'bg-white text-indigo-950 shadow-lg shadow-white/10'
                                    : 'text-indigo-100/60 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <tab.icon className={activePage === tab.id ? 'text-indigo-600' : ''} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activePage === 'submit' && (
                    <div className="grid gap-8 lg:grid-cols-5">
                        <div className="lg:col-span-3 space-y-6">
                            <div className="rounded-[2.5rem] border border-slate-800 bg-[#0f172a] p-8 shadow-2xl shadow-black/20">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        <FiMessageSquare size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">Post your Feedback</h2>
                                        <p className="text-sm text-slate-400">Help the next batch of students by being detailed.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-300">Feedback Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-5 py-3.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                                                placeholder="e.g. My Internship Experience"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-300">Category</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-5 py-3.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 appearance-none shadow-xl"
                                            >
                                                <option>System Feedback</option>
                                                <option>Internship Experience</option>
                                                <option>Interview Process</option>
                                                <option>Communication Quality</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-300 flex justify-between">
                                                <span>Overall Rating</span>
                                                <span className="text-indigo-400">{formData.rating} Stars</span>
                                            </label>
                                            <div className="flex items-center gap-2 pt-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                                        className={`text-2xl transition-transform hover:scale-110 ${star <= formData.rating ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'text-slate-700'}`}
                                                    >
                                                        <FiStar fill={star <= formData.rating ? 'currentColor' : 'none'} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-300 flex justify-between">
                                                <span>Impact of Internship</span>
                                                <span className="text-indigo-400">{formData.performance}/5</span>
                                            </label>
                                            <input
                                                type="range"
                                                name="performance"
                                                min="1"
                                                max="5"
                                                value={formData.performance}
                                                onChange={handleChange}
                                                className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-300">Detailed Feedback</label>
                                        <textarea
                                            name="comment"
                                            value={formData.comment}
                                            onChange={handleChange}
                                            required
                                            rows="5"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-5 py-3.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-600"
                                            placeholder="What went well? How was the mentorship? Any suggestions for improvement?"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-300 block">Would you recommend this system to other students?</label>
                                        <div className="flex gap-4">
                                            {['Yes', 'Maybe', 'No'].map(option => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, recommendation: option }))}
                                                    className={`flex-1 rounded-xl py-3 text-sm font-bold border-2 transition-all ${formData.recommendation === option
                                                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                                                        : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full relative overflow-hidden group rounded-2xl bg-indigo-600 p-4 font-bold text-white shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            {saving ? 'Processing submission...' : 'Share My Experience'}
                                        </div>
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="rounded-[2.5rem] bg-indigo-950/50 border border-indigo-500/20 p-8 text-white shadow-xl backdrop-blur-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <FiStar size={64} className="text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-black relative z-10 text-indigo-100">Why your review matters?</h3>
                                <div className="mt-6 space-y-4 relative z-10">
                                    <div className="flex gap-4">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 font-bold border border-indigo-500/20">1</div>
                                        <p className="text-sm text-indigo-200/70 leading-relaxed font-medium">Empowers the university to improve the internship pipeline for you.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 font-bold border border-indigo-500/20">2</div>
                                        <p className="text-sm text-indigo-200/70 leading-relaxed font-medium">Provides honest insights to prospective interns about companies.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 font-bold border border-indigo-500/20">3</div>
                                        <p className="text-sm text-indigo-200/70 leading-relaxed font-medium">Drives high-quality mentorship and company engagement standards.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2.5rem] border border-slate-800 bg-[#0f172a] p-8 shadow-sm">
                                <h3 className="font-bold text-white border-b border-white/5 pb-4 mb-4 uppercase tracking-widest text-xs">Student Guide</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-slate-400">
                                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                                        <p className="text-xs leading-relaxed">Be professional and specific about your learning outcomes.</p>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-400">
                                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                                        <p className="text-xs leading-relaxed">Maintain confidentiality of company-specific technical information.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activePage === 'history' && (
                    <div className="rounded-[2.5rem] border border-slate-800 bg-[#0f172a] p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white leading-tight tracking-tight">Review Timeline</h2>
                                <p className="text-sm text-slate-400">Track responses and status updates from the university admin.</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 font-bold text-indigo-400 border border-indigo-500/20">
                                {reviews.length}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                                    <p className="text-sm font-medium text-slate-500">Processing journey logs...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
                                    <FiMessageSquare className="text-4xl text-slate-700 mb-4" />
                                    <p className="text-slate-400 font-bold">Your feedback journey is empty.</p>
                                    <p className="text-slate-600 text-xs mt-1">Submit your first review to help the community.</p>
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review._id} className="group relative rounded-3xl border border-slate-800 bg-slate-900/30 p-6 transition-all hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-indigo-900/20">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg font-bold text-slate-50">{review.title}</span>
                                                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusTone[review.status] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                                        {review.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <div className="flex items-center gap-1 font-bold">
                                                        <FiStar className="text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]" />
                                                        <span className="text-slate-300">{review.rating}.0</span>
                                                    </div>
                                                    <span>•</span>
                                                    <span className="font-medium">{new Date(review.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm leading-relaxed text-slate-400 whitespace-pre-line font-medium italic">"{review.comment}"</p>

                                        {review.adminReply ? (
                                            <div className="mt-6 rounded-2xl bg-indigo-950/50 p-5 text-white shadow-lg border border-indigo-500/20 backdrop-blur-sm animate-in zoom-in-95">
                                                <div className="flex items-center gap-2 mb-2 text-xs font-black text-indigo-400 tracking-widest">
                                                    <FiInfo className="text-indigo-400" />
                                                    <span>ADMIN RESPONSE FROM {review.repliedByName?.toUpperCase() || 'SYSTEM ADMIN'}</span>
                                                </div>
                                                <p className="text-sm leading-relaxed text-slate-100/90 font-medium whitespace-pre-line">"{review.adminReply}"</p>
                                            </div>
                                        ) : (
                                            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-slate-800/20 px-4 py-3 text-[11px] font-bold text-slate-500 border border-slate-700/30 tracking-widest">
                                                <FiInfo className="text-sm" />
                                                AWAITING OFFICIAL REVIEW AND REPLY
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default S_StudentReviews;
