import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileAudio, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const NewInterview = () => {
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [intervieweeName, setIntervieweeName] = useState('');
    const [intervieweeRole, setIntervieweeRole] = useState('');
    const [intervieweeCompany, setIntervieweeCompany] = useState('');
    const [interviewDate, setInterviewDate] = useState('');
    const [transcript, setTranscript] = useState('');

    const isPastDate = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const showUpload = isPastDate(interviewDate);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const readFileContent = (file) => {
        // Only read text files
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setTranscript(content);
            };
            reader.onerror = () => {
                console.error('Error reading file');
            };
            reader.readAsText(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile);
            readFileContent(droppedFile);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            readFileContent(selectedFile);
        }
    };

    const handleSubmit = () => {
        if (!intervieweeName || !interviewDate) return;

        setUploading(true);
        
        // Create new interview object
        const newInterview = {
            id: `user-${Date.now()}`,
            interviewee: intervieweeName,
            role: intervieweeRole || 'Not specified',
            company: intervieweeCompany || 'Not specified',
            date: interviewDate,
            duration: '00:00',
            interviewer: 'You',
            status: isPastDate(interviewDate) ? 'Completed' : 'Scheduled',
            transcript: transcript || '',
            summary: transcript ? 'Pending analysis...' : '',
            themes: [],
            sentiment: ''
        };

        // Save to localStorage
        const savedInterviews = localStorage.getItem('user_interviews');
        const userInterviews = savedInterviews ? JSON.parse(savedInterviews) : [];
        userInterviews.push(newInterview);
        localStorage.setItem('user_interviews', JSON.stringify(userInterviews));

        // Simulate processing delay
        setTimeout(() => {
            setUploading(false);
            navigate('/interviews');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">New Interview</h1>
                <p className="text-slate-400">Add details for a new interview. Upload a recording or paste transcript.</p>
            </div>

            <div className="space-y-6 mb-8">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="intervieweeName" className="block text-sm font-medium text-slate-300 mb-2">
                            Interviewee Name *
                        </label>
                        <input
                            type="text"
                            id="intervieweeName"
                            value={intervieweeName}
                            onChange={(e) => setIntervieweeName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="e.g. Alex Rivera"
                        />
                    </div>

                    <div>
                        <label htmlFor="interviewDate" className="block text-sm font-medium text-slate-300 mb-2">
                            Date *
                        </label>
                        <input
                            type="date"
                            id="interviewDate"
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="intervieweeRole" className="block text-sm font-medium text-slate-300 mb-2">
                            Role
                        </label>
                        <input
                            type="text"
                            id="intervieweeRole"
                            value={intervieweeRole}
                            onChange={(e) => setIntervieweeRole(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="e.g. Product Manager"
                        />
                    </div>

                    <div>
                        <label htmlFor="intervieweeCompany" className="block text-sm font-medium text-slate-300 mb-2">
                            Company
                        </label>
                        <input
                            type="text"
                            id="intervieweeCompany"
                            value={intervieweeCompany}
                            onChange={(e) => setIntervieweeCompany(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="transcript" className="block text-sm font-medium text-slate-300 mb-2">
                        Transcript
                    </label>
                    <textarea
                        id="transcript"
                        rows={8}
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
                        placeholder="Paste interview transcript here..."
                    />
                </div>
            </div>

            {showUpload && (
                <div
                    className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 mb-8 ${dragActive ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-900'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleChange}
                        accept="audio/*,video/*,.pdf,.txt"
                    />

                    {!file ? (
                        <div className="space-y-4 pointer-events-none">
                            <div className="w-12 h-12 bg-slate-800 text-indigo-400 rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-700">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-white">Upload recording or file</p>
                                <p className="text-xs text-slate-500 mt-1">Audio, Video, PDF, TXT</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 pointer-events-none">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm border ${file.type.includes('audio') || file.type.includes('video')
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                {file.type.includes('audio') || file.type.includes('video') ? (
                                    <FileAudio className="w-6 h-6" />
                                ) : (
                                    <FileText className="w-6 h-6" />
                                )}
                            </div>
                            <div>
                                <p className="text-base font-semibold text-white">{file.name}</p>
                                <p className="text-xs text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <div className="pointer-events-auto">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setFile(null);
                                        // Clear transcript if it was loaded from a text file
                                        if (file && (file.type === 'text/plain' || file.name.endsWith('.txt'))) {
                                            setTranscript('');
                                        }
                                    }}
                                    className="text-xs text-rose-400 hover:text-rose-300 font-medium hover:underline z-20 relative"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-end space-x-4">
                <button
                    onClick={() => navigate('/')}
                    className="px-5 py-2.5 text-slate-300 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 font-medium transition-colors shadow-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!intervieweeName || !interviewDate || uploading}
                    className={`px-6 py-2.5 text-white bg-indigo-600 rounded-lg font-medium shadow-md flex items-center transition-all ${!intervieweeName || !interviewDate || uploading ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                >
                    {uploading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing...
                        </>
                    ) : (
                        'Save Interview'
                    )}
                </button>
            </div>
        </div>
    );
};

export default NewInterview;
