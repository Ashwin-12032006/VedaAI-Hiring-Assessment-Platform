'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAssignmentStore, IAssignment, ISection } from '../../../store/useAssignmentStore';
import {
  ArrowLeft,
  Download,
  RotateCw,
  Sparkles,
  ChevronRight,
  FileText,
  AlertTriangle,
  Loader2,
  Printer,
  Share2,
  CheckCircle2
} from 'lucide-react';

export default function PaperPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { fetchAssignmentById, activeAssignment, regenerateAssignment, connectWebSocket } = useAssignmentStore();

  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [section, setSection] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);

  const loadAndSubscribe = useCallback(async () => {
    if (!id) return;
    await fetchAssignmentById(id);
    connectWebSocket(id);
  }, [id, fetchAssignmentById, connectWebSocket]);

  useEffect(() => {
    loadAndSubscribe();
  }, [loadAndSubscribe]);

  // Poll for updates while processing
  useEffect(() => {
    if (!activeAssignment || activeAssignment.status !== 'processing') return;
    const poll = setInterval(() => fetchAssignmentById(id), 2500);
    return () => clearInterval(poll);
  }, [activeAssignment?.status, id, fetchAssignmentById]);

  const handleRegenerate = async () => {
    if (!id) return;
    await regenerateAssignment(id);
  };

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    if (!paperRef.current) return;
    setIsExportingPdf(true);

    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const canvas = await html2canvas(paperRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Paginate if content overflows
      const pageHeight = pdf.internal.pageSize.getHeight();
      let position = 0;
      let remaining = pdfHeight;

      while (remaining > 0) {
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        remaining -= pageHeight;
        if (remaining > 0) {
          pdf.addPage();
          position -= pageHeight;
        }
      }

      const filename = `${activeAssignment?.title?.replace(/[^a-z0-9]/gi, '_') || 'assessment'}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error('PDF export failed:', err);
      // Fallback to print
      window.print();
    }

    setIsExportingPdf(false);
  };

  if (!activeAssignment) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-gradient)' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={40} color="var(--color-orange)" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--color-text-secondary)' }}>Loading assessment…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-gradient)', padding: '12px', gap: '12px' }} className="print-wrapper">

      {/* ── Left panel: header + action bar ── */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Topbar */}
        <header style={{
          height: '56px',
          background: 'var(--color-bg-white)',
          borderRadius: 'var(--border-radius-md)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-card)',
          flexShrink: 0
        }}
          className="no-print"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-bg-off-white)' }}>
              <ArrowLeft size={16} color="var(--color-text-primary)" />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)' }}>
              <FileText size={15} />
              <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 600, fontSize: '14px' }}>Assignments</span>
            </div>
            <ChevronRight size={13} color="var(--color-text-muted)" />
            <span style={{
              fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: '14px',
              color: 'var(--color-text-primary)', maxWidth: '260px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {activeAssignment.title}
            </span>
          </div>

          {/* Status badge */}
          <span className={`badge badge-${activeAssignment.status}`} style={{ padding: '6px 14px' }}>
            {activeAssignment.status === 'processing' && <Loader2 size={12} style={{ animation: 'spin 1s linear infinite', marginRight: '6px' }} />}
            {activeAssignment.status}
          </span>
        </header>

        {/* ── Action Bar ── */}
        {activeAssignment.status === 'completed' && (
          <div
            className="no-print"
            style={{
              background: 'var(--color-bg-white)',
              borderRadius: 'var(--border-radius-md)',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)',
              flexShrink: 0,
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={20} color="var(--color-success)" />
              <div>
                <p style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: '14px', color: 'var(--color-text-primary)' }}>
                  Question paper generated successfully
                </p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {activeAssignment.sections?.reduce((acc, s) => acc + s.questions.length, 0)} questions across {activeAssignment.sections?.length} sections · {activeAssignment.totalMarks} total marks
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleRegenerate}
                className="veda-btn veda-btn-secondary"
                style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '12px', gap: '8px' }}
              >
                <RotateCw size={15} /> Regenerate
              </button>
              <button
                onClick={handlePrint}
                className="veda-btn veda-btn-secondary"
                style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '12px', gap: '8px' }}
              >
                <Printer size={15} /> Print
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="veda-btn veda-btn-primary"
                style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '12px', gap: '8px' }}
              >
                {isExportingPdf
                  ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Exporting…</>
                  : <><Download size={15} /> Download PDF</>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── PROCESSING STATE ── */}
        {activeAssignment.status === 'processing' && (
          <ProcessingState title={activeAssignment.title} />
        )}

        {/* ── FAILED STATE ── */}
        {activeAssignment.status === 'failed' && (
          <div
            style={{
              flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '20px', padding: '40px', textAlign: 'center',
              background: 'var(--color-bg-white)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-card)'
            }}
          >
            <AlertTriangle size={56} color="var(--color-error)" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 800, fontSize: '22px', color: 'var(--color-text-primary)' }}>Generation Failed</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '8px', maxWidth: '420px' }}>
                {activeAssignment.error || 'An unknown error occurred. Please try regenerating the question paper.'}
              </p>
            </div>
            <button onClick={handleRegenerate} className="veda-btn veda-btn-primary" style={{ gap: '8px' }}>
              <RotateCw size={16} /> Try Again
            </button>
          </div>
        )}

        {/* ── COMPLETED: EXAM PAPER RENDER ── */}
        {activeAssignment.status === 'completed' && activeAssignment.sections && (
          <div
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              paddingBottom: '32px'
            }}
          >
            <div ref={paperRef} className="exam-container animate-fade-in" id="exam-paper">

              {/* Exam Header */}
              <div className="exam-header">
                <div className="exam-school">Delhi Public School — Bokaro Steel City</div>
                <div className="exam-title">{activeAssignment.title}</div>
                <div className="exam-meta-grid">
                  <div>
                    <strong>Time Allowed:</strong> 3 Hours
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Maximum Marks:</strong> {activeAssignment.totalMarks}
                  </div>
                  <div>
                    <strong>Date:</strong> {new Date(activeAssignment.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Questions:</strong> {activeAssignment.sections.reduce((acc, s) => acc + s.questions.length, 0)}
                  </div>
                </div>
              </div>

              {/* General Instructions */}
              <div style={{
                background: 'rgba(1, 22, 37, 0.03)',
                borderLeft: '3px solid var(--color-navy)',
                padding: '12px 16px',
                borderRadius: '0 8px 8px 0',
                marginBottom: '24px',
                fontSize: '13px',
                lineHeight: 1.6
              }}>
                <strong>General Instructions:</strong> All questions are compulsory unless stated otherwise. Write your answers neatly and legibly.
                Marks are indicated against each question. Mobile phones and electronic gadgets are NOT permitted in the examination hall.
              </div>

              {/* Student Information */}
              <div className="exam-student-info">
                <div className="exam-student-field">
                  Name:&nbsp;
                  <input
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder=" "
                    className="no-print-input"
                    style={{
                      flexGrow: 1, border: 'none', borderBottom: '1px dashed #666',
                      outline: 'none', fontFamily: 'var(--font-bricolage)', fontSize: '14px',
                      paddingBottom: '2px', background: 'transparent'
                    }}
                  />
                </div>
                <div className="exam-student-field">
                  Roll No.:&nbsp;
                  <input
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    placeholder=" "
                    className="no-print-input"
                    style={{
                      flexGrow: 1, border: 'none', borderBottom: '1px dashed #666',
                      outline: 'none', fontFamily: 'var(--font-bricolage)', fontSize: '14px',
                      paddingBottom: '2px', background: 'transparent'
                    }}
                  />
                </div>
                <div className="exam-student-field">
                  Section:&nbsp;
                  <input
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    placeholder=" "
                    className="no-print-input"
                    style={{
                      flexGrow: 1, border: 'none', borderBottom: '1px dashed #666',
                      outline: 'none', fontFamily: 'var(--font-bricolage)', fontSize: '14px',
                      paddingBottom: '2px', background: 'transparent'
                    }}
                  />
                </div>
              </div>

              {/* Question Sections */}
              {activeAssignment.sections.map((sec, sIdx) => (
                <ExamSection key={sec.id} section={sec} sectionIndex={sIdx} />
              ))}

              {/* Footer */}
              <div style={{
                marginTop: '40px',
                paddingTop: '16px',
                borderTop: '2px solid var(--color-text-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#666',
                fontStyle: 'italic'
              }}>
                <span>*** End of Question Paper ***</span>
                <span>Generated by VedaAI Assessment Creator</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Right Panel: Assignment metadata sidebar ── */}
      {activeAssignment.status === 'completed' && (
        <aside
          className="no-print"
          style={{
            width: '260px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{
            background: 'var(--color-bg-white)',
            borderRadius: 'var(--border-radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.04em' }}>Paper Summary</h3>

            <MetaRow label="Sections" value={String(activeAssignment.sections?.length ?? 0)} />
            <MetaRow label="Total Questions" value={String(activeAssignment.numQuestions)} />
            <MetaRow label="Total Marks" value={String(activeAssignment.totalMarks)} />
            <MetaRow label="Due Date" value={new Date(activeAssignment.dueDate).toLocaleDateString()} />

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '12px' }}>
              <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Question Types</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activeAssignment.questionTypes.map(t => (
                  <span key={t} style={{
                    background: 'rgba(1, 22, 37, 0.06)', color: 'var(--color-navy)',
                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Difficulty legend */}
          {activeAssignment.sections && (
            <div style={{
              background: 'var(--color-bg-white)',
              borderRadius: 'var(--border-radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h3 style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.04em' }}>Difficulty Breakdown</h3>
              <DifficultyBreakdown sections={activeAssignment.sections} />
            </div>
          )}
        </aside>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-wrapper { padding: 0 !important; gap: 0 !important; }
          .exam-container { box-shadow: none !important; border-radius: 0 !important; padding: 20mm !important; margin: 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Exam Section Component ── */
function ExamSection({ section, sectionIndex }: { section: ISection; sectionIndex: number }) {
  const sectionLetter = String.fromCharCode(65 + sectionIndex);
  return (
    <div>
      <div className="exam-section-header">
        <span>Section {sectionLetter}: {section.title.replace(/^Section [A-Z]:?\s*/i, '')}</span>
        <span style={{ fontWeight: 600, color: '#555', fontSize: '13px' }}>
          [{section.questions.reduce((a, q) => a + q.marks, 0)} Marks]
        </span>
      </div>
      <p className="exam-section-instruction">{section.instruction}</p>
      <div>
        {section.questions.map((q, qIdx) => (
          <div key={q.id} className="exam-question-item">
            <div className="exam-question-text">
              <span>
                <strong style={{ marginRight: '8px', fontFamily: 'var(--font-bricolage)' }}>
                  Q{qIdx + 1}.
                </strong>
                {q.text}
              </span>
              <span className="exam-question-marks" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flexShrink: 0 }}>
                <span className={`badge badge-${q.difficulty}`} style={{ fontSize: '10px' }}>
                  {q.difficulty}
                </span>
                <span style={{ color: '#333', minWidth: '36px', textAlign: 'right' }}>
                  [{q.marks}M]
                </span>
              </span>
            </div>
            {q.options && (
              <div className="exam-question-options">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="exam-question-option">
                    <span style={{ fontWeight: 700, color: '#555', marginRight: '4px' }}>
                      {String.fromCharCode(97 + oi)})
                    </span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Processing State ── */
function ProcessingState({ title }: { title: string }) {
  const steps = ['Analysing requirements', 'Structuring sections', 'Generating questions', 'Assigning marks & difficulty'];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setStep(s => (s + 1) % steps.length), 2200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '28px', padding: '48px',
      background: 'var(--color-bg-white)', borderRadius: 'var(--border-radius-lg)',
      boxShadow: 'var(--shadow-card)', textAlign: 'center'
    }}>
      {/* Animated AI icon */}
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(255, 86, 35, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <Sparkles size={36} color="var(--color-orange)" />
        </div>
      </div>
      <div>
        <h2 style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.04em' }}>
          AI is generating your paper
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '6px', fontSize: '15px' }}>
          &ldquo;{title}&rdquo;
        </p>
      </div>
      {/* Step progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '360px' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              background: i < step ? 'var(--color-success)' : i === step ? 'var(--color-orange)' : 'var(--color-bg-off-white-darker)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.4s ease'
            }}>
              {i < step
                ? <CheckCircle2 size={14} color="#FFF" />
                : i === step
                  ? <Loader2 size={12} color="#FFF" style={{ animation: 'spin 1s linear infinite' }} />
                  : null
              }
            </div>
            <span style={{
              fontSize: '13px',
              fontFamily: 'var(--font-bricolage)',
              fontWeight: i <= step ? 700 : 400,
              color: i <= step ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              transition: 'all 0.3s ease'
            }}>
              {s}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

/* ── Difficulty Breakdown ── */
function DifficultyBreakdown({ sections }: { sections: ISection[] }) {
  const all = sections.flatMap(s => s.questions);
  const counts = { easy: 0, medium: 0, hard: 0 };
  all.forEach(q => { counts[q.difficulty] = (counts[q.difficulty] || 0) + 1; });
  const total = all.length || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {(['easy', 'medium', 'hard'] as const).map(diff => (
        <div key={diff}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span className={`badge badge-${diff}`} style={{ fontSize: '11px' }}>{diff}</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              {counts[diff]} / {total}
            </span>
          </div>
          <div style={{ height: '6px', borderRadius: '100px', background: 'var(--color-bg-off-white-darker)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '100px',
              background: diff === 'easy' ? '#4BC26D' : diff === 'medium' ? '#e8a057' : 'var(--color-error)',
              width: `${(counts[diff] / total) * 100}%`,
              transition: 'width 0.6s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Meta Row ── */
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
      <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-bricolage)' }}>{label}</span>
      <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-bricolage)' }}>{value}</span>
    </div>
  );
}
