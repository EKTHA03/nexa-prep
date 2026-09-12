import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Trash2 } from 'lucide-react';
import { parsePdfResume } from '../../services/resumeParser';
import { useProgress } from '../../context/ProgressContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { API_BASE_URL } from '../../config/constants';

export function ResumeUpload({ onParsed }: { onParsed?: () => void }) {
  const { user } = useAuth();
  const { progress, dispatch } = useProgress();
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsedSkills, setParsedSkills] = useState<string[]>(progress.extractedSkills || []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleFileProcess = async (file: File) => {
    setError(null);
    setLoading(true);
    setUploadedFileName(file.name);

    try {
      const result = await parsePdfResume(file, user?.email);
      setParsedSkills(result.deduplicatedSkills);

      dispatch({ type: 'SET_EXTRACTED_SKILLS', payload: result.deduplicatedSkills });
      dispatch({ type: 'CLEAR_LEARNED_SKILLS' });
      if (onParsed) onParsed();
    } catch (err: any) {
      console.error('Error parsing resume:', err);
      setError('Could not extract text or skills from this PDF. Please upload a clear text-based PDF resume.');
      setParsedSkills([]);
      dispatch({ type: 'SET_EXTRACTED_SKILLS', payload: [] });
      dispatch({ type: 'CLEAR_LEARNED_SKILLS' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      const headers: Record<string, string> = {};
      if (user?.email) headers['X-User-Email'] = user.email;

      await fetch(`${API_BASE_URL}/api/resume/clear/all`, {
        method: 'DELETE',
        headers
      });
    } catch (e) {
      console.warn('Backend delete notification failed:', e);
    }

    dispatch({ type: 'SET_EXTRACTED_SKILLS', payload: [] });
    dispatch({ type: 'CLEAR_LEARNED_SKILLS' });
    setParsedSkills([]);
    setUploadedFileName(null);
    setShowDeleteModal(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          Smart PDF Resume Parser
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload your resume PDF to extract your technical skills automatically.
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={onFileSelect}
          className="hidden"
          id="resume-upload-input"
        />

        <label htmlFor="resume-upload-input" className="cursor-pointer space-y-3 block">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-cyan-400">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Drag & Drop your resume PDF here, or <span className="text-cyan-400 underline">browse</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Supports PDF files up to 10MB</p>
          </div>
        </label>
      </div>

      {loading && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs text-cyan-300 font-medium">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>Parsing text and extracting candidate skills from PDF...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Extracted Skills Output */}
      {parsedSkills.length > 0 && !loading && (
        <div className="space-y-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Successfully Extracted {parsedSkills.length} Technical Skills
              </span>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Resume
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {parsedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Uploaded Resume"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete your uploaded resume and clear all extracted skills for your account?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteResume}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
            >
              Delete Resume
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
