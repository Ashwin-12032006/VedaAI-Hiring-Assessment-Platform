'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAssignmentStore } from '../../store/useAssignmentStore';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Minus,
  CalendarDays,
  FileText,
  Sparkles,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Hash,
  AlignLeft,
  List,
  HelpCircle,
  ToggleLeft
} from 'lucide-react';


const QUESTION_TYPES = [
  { id: 'MCQ', label: 'Multiple Choice', icon: <List size={16} />, desc: 'Four option choices' },
  { id: 'Short Answer', label: 'Short Answer', icon: <AlignLeft size={16} />, desc: '1–3 sentence responses' },
  { id: 'Long Answer', label: 'Long Answer', icon: <FileText size={16} />, desc: 'Essay / extended response' },
  { id: 'Fill in the Blank', label: 'Fill in the Blank', icon: <Hash size={16} />, desc: 'Complete missing words' },
  { id: 'True/False', label: 'True / False', icon: <ToggleLeft size={16} />, desc: 'Binary decision questions' },
  { id: 'One Word', label: 'One Word', icon: <HelpCircle size={16} />, desc: 'Single word answer' },
];

interface FormErrors {
  title?: string;
  dueDate?: string;
  questionTypes?: string;
  numQuestions?: string;
  totalMarks?: string;
}

export default function CreateAssignment() {
  const router = useRouter();
  const { createAssignment, loading } = useAssignmentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [totalMarks, setTotalMarks] = useState(50);
  const [instructions, setInstructions] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const toggleQuestionType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    if (errors.questionTypes) setErrors(e => ({ ...e, questionTypes: undefined }));
  };

  const handleFileRead = (file: File) => {
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(e.target?.result as string || '');
      reader.readAsText(file);
    } else if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Read as data URL and extract only the base64 portion
        const result = e.target?.result as string || '';
        const base64 = result.split(',')[1] || '';
        setFileContent(base64);
      };
      reader.readAsDataURL(file);
    }
    setAttachedFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileRead(file);
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = 'Assignment title is required.';
    if (!dueDate) newErrors.dueDate = 'Please pick a due date.';
    if (selectedTypes.length === 0) newErrors.questionTypes = 'Select at least one question type.';
    if (numQuestions < 1 || numQuestions > 100) newErrors.numQuestions = 'Number of questions must be between 1 and 100.';
    if (totalMarks < 1 || totalMarks > 1000) newErrors.totalMarks = 'Total marks must be between 1 and 1000.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const result = await createAssignment({
      title: title.trim(),
      dueDate,
      questionTypes: selectedTypes,
      numQuestions,
      totalMarks,
      instructions,
      fileAttached: attachedFile?.name,
      fileContent: fileContent || undefined,
    });

    setSubmitting(false);
    if (result) {
      router.push(`/paper/${result.id}`);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-bg-gradient)',
      padding: '12px',
      gap: '12px'
    }}>

      {/* ── Sidebar ── */}
      <Sidebar activeTab="assignments" />

      {/* ── Main Form Area ── */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Header Bar */}
        <Header title="Assignments > Create New Assignment" />

        {/* ── Form Card ── */}
        <div style={{
          flexGrow: 1,
          display: 'flex',
          gap: '20px',
          overflowY: 'auto'
        }}>

          {/* Left column — main inputs */}
          <form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Card: Assignment Details */}
            <div style={{
              background: 'var(--color-bg-white)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.04em' }}>
                  Assignment Details
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  Describe the assessment you want to generate.
                </p>
              </div>

              {/* Title */}
              <div className="veda-input-group">
                <label className="veda-input-label" htmlFor="title">Assignment Title *</label>
                <input
                  id="title"
                  className={`veda-input${errors.title ? ' input-error' : ''}`}
                  type="text"
                  placeholder="e.g. Quiz on Electricity and Circuits"
                  value={title}
                  onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(ev => ({ ...ev, title: undefined })); }}
                  style={{ borderRadius: '12px', padding: '14px 18px', borderColor: errors.title ? 'var(--color-error)' : undefined }}
                />
                {errors.title && <ErrorMsg text={errors.title} />}
              </div>

              {/* Due Date */}
              <div className="veda-input-group">
                <label className="veda-input-label" htmlFor="dueDate">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CalendarDays size={14} /> Due Date *
                  </span>
                </label>
                <input
                  id="dueDate"
                  className="veda-input"
                  type="date"
                  min={today}
                  value={dueDate}
                  onChange={e => { setDueDate(e.target.value); if (errors.dueDate) setErrors(ev => ({ ...ev, dueDate: undefined })); }}
                  style={{ borderRadius: '12px', padding: '14px 18px', borderColor: errors.dueDate ? 'var(--color-error)' : undefined }}
                />
                {errors.dueDate && <ErrorMsg text={errors.dueDate} />}
              </div>

              {/* Additional Instructions */}
              <div className="veda-input-group">
                <label className="veda-input-label">Additional Instructions</label>
                <textarea
                  className="veda-textarea"
                  placeholder="e.g. Focus on chapters 4 and 5. Include at least 3 application-based questions..."
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  rows={3}
                  style={{ borderRadius: '14px' }}
                />
              </div>
            </div>

            {/* Card: File Upload */}
            <div style={{
              background: 'var(--color-bg-white)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.04em' }}>
                  Upload Source Material <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: '14px' }}>(optional)</span>
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  Upload a PDF or .txt file to let AI use it as context for generating questions.
                </p>
              </div>

              {!attachedFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? 'var(--color-orange)' : 'rgba(0,0,0,0.15)'}`,
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: dragOver ? 'rgba(255, 86, 35, 0.04)' : 'var(--color-bg-off-white)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Upload size={32} color={dragOver ? 'var(--color-orange)' : 'var(--color-text-muted)'} style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '15px' }}>
                    Drag & drop or <span style={{ color: 'var(--color-orange)' }}>click to upload</span>
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                    PDF or TXT — AI will extract content to generate questions
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,text/plain,application/pdf"
                    style={{ display: 'none' }}
                    onChange={e => { if (e.target.files?.[0]) handleFileRead(e.target.files[0]); }}
                  />
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 20px',
                  background: 'rgba(75, 194, 109, 0.08)',
                  borderRadius: '14px',
                  border: '1px solid rgba(75, 194, 109, 0.2)'
                }}>
                  <CheckCircle2 size={22} color="var(--color-success)" />
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-primary)' }}>{attachedFile.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{(attachedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button type="button" onClick={() => { setAttachedFile(null); setFileContent(''); }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%', display: 'flex' }}>
                    <X size={18} color="var(--color-text-muted)" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button (bottom of form on mobile) */}
            <button
              type="submit"
              disabled={submitting || loading}
              className="veda-btn veda-btn-orange"
              style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '16px', gap: '10px' }}
            >
              <Sparkles size={20} />
              {submitting ? 'Generating Assessment…' : 'Generate Question Paper with AI'}
            </button>

          </form>

          {/* Right column — question type & count config */}
          <div style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Question Types Card */}
            <div style={{
              background: 'var(--color-bg-white)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.04em' }}>
                  Question Types *
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  Select one or more question formats to include.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {QUESTION_TYPES.map(qt => {
                  const active = selectedTypes.includes(qt.id);
                  return (
                    <button
                      key={qt.id}
                      type="button"
                      onClick={() => toggleQuestionType(qt.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `1.5px solid ${active ? 'var(--color-orange)' : 'rgba(0,0,0,0.08)'}`,
                        background: active ? 'rgba(255, 86, 35, 0.06)' : 'var(--color-bg-off-white)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.18s ease',
                        width: '100%'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: active ? 'rgba(255, 86, 35, 0.12)' : 'rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: active ? 'var(--color-orange)' : 'var(--color-text-secondary)',
                        flexShrink: 0
                      }}>
                        {qt.icon}
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: '13px', color: active ? 'var(--color-orange)' : 'var(--color-text-primary)' }}>
                          {qt.label}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '1px' }}>
                          {qt.desc}
                        </div>
                      </div>
                      {active && <CheckCircle2 size={16} color="var(--color-orange)" />}
                    </button>
                  );
                })}
              </div>
              {errors.questionTypes && <ErrorMsg text={errors.questionTypes} />}
            </div>

            {/* Questions Count & Marks Card */}
            <div style={{
              background: 'var(--color-bg-white)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.04em' }}>
                Paper Configuration
              </h2>

              <CounterField
                label="Number of Questions"
                value={numQuestions}
                min={1}
                max={100}
                onChange={v => { setNumQuestions(v); if (errors.numQuestions) setErrors(e => ({ ...e, numQuestions: undefined })); }}
                error={errors.numQuestions}
              />

              <CounterField
                label="Total Marks"
                value={totalMarks}
                min={1}
                max={1000}
                step={5}
                onChange={v => { setTotalMarks(v); if (errors.totalMarks) setErrors(e => ({ ...e, totalMarks: undefined })); }}
                error={errors.totalMarks}
              />

              {/* Preview pill */}
              <div style={{
                padding: '12px 16px',
                background: 'rgba(1, 22, 37, 0.04)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                fontFamily: 'var(--font-bricolage)',
                fontWeight: 600
              }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Marks per question</span>
                <span style={{ color: 'var(--color-text-primary)' }}>~{(totalMarks / numQuestions).toFixed(1)}</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function ErrorMsg({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-error)', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
      <AlertCircle size={13} />
      <span>{text}</span>
    </div>
  );
}

function CounterField({
  label, value, min, max, step = 1, onChange, error
}: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; error?: string;
}) {
  return (
    <div className="veda-input-group">
      <label className="veda-input-label">{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
        <button type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          style={{
            width: '40px', height: '44px', border: '1px solid rgba(0,0,0,0.12)', borderRight: 'none',
            borderRadius: '12px 0 0 12px', background: 'var(--color-bg-off-white)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
          <Minus size={14} />
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={e => {
            const v = parseInt(e.target.value) || min;
            onChange(Math.min(max, Math.max(min, v)));
          }}
          style={{
            width: '100%', textAlign: 'center', border: '1px solid rgba(0,0,0,0.12)',
            padding: '10px', fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-bricolage)',
            outline: 'none', borderColor: error ? 'var(--color-error)' : undefined
          }}
        />
        <button type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          style={{
            width: '40px', height: '44px', border: '1px solid rgba(0,0,0,0.12)', borderLeft: 'none',
            borderRadius: '0 12px 12px 0', background: 'var(--color-bg-off-white)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
          <Plus size={14} />
        </button>
      </div>
      {error && <ErrorMsg text={error} />}
    </div>
  );
}
