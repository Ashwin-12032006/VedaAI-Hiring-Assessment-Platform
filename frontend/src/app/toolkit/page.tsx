'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Sparkles, BookOpen, Table, FileText, Send, Copy, Check, RotateCcw } from 'lucide-react';

type ToolType = 'lesson' | 'rubric' | 'comment';

export default function ToolkitPage() {
  const [activeTool, setActiveTool] = useState<ToolType>('lesson');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Lesson Plan Form State
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('10th Grade');
  const [duration, setDuration] = useState('60 minutes');
  const [objectives, setObjectives] = useState('');

  // Rubric Form State
  const [task, setTask] = useState('');
  const [rubricGrade, setRubricGrade] = useState('10th Grade');
  const [criteria, setCriteria] = useState('Understanding, Execution, Presentation');

  // Comment Form State
  const [studentName, setStudentName] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [tone, setTone] = useState('supportive and constructive');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');
    setCopied(false);

    let endpoint = '/api/toolkit/lesson-plan';
    let body = {};

    if (activeTool === 'lesson') {
      endpoint = '/api/toolkit/lesson-plan';
      body = { topic, grade, duration, objectives };
    } else if (activeTool === 'rubric') {
      endpoint = '/api/toolkit/rubric';
      body = { task, grade: rubricGrade, criteria };
    } else if (activeTool === 'comment') {
      endpoint = '/api/toolkit/comment';
      body = { studentName, subject, strengths, improvements, tone };
    }

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.content || '');
      }
    } catch (err: any) {
      setOutput(`Failed to communicate with the server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="monorepo-container animate-fade-in" style={{ display: 'flex', minHeight: '97vh', gap: '12px' }}>
      <Sidebar activeTab="toolkit" />

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Header title="AI Teacher’s Toolkit" />

        {/* Action / Search Bar */}
        <section style={{
          background: 'var(--color-bg-white)',
          borderRadius: 'var(--border-radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: 'var(--color-success)', borderRadius: '50%', border: '4px solid rgba(75, 194, 109, 0.2)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: '16px', color: 'var(--color-text-primary)' }}>
                Teacher Utilities
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Quick generation tools powered by VedaAI for daily classroom administrative tasks
              </span>
            </div>
          </div>
        </section>

        {/* Toolkit Workspace Layout */}
        <div style={{ display: 'flex', gap: '16px', flexGrow: 1, height: 'calc(100vh - 200px)', minHeight: '500px' }}>
          
          {/* Left panel - Tool Selector & Form Inputs */}
          <div style={{
            width: '380px',
            background: 'var(--color-bg-white)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            flexShrink: 0,
            overflowY: 'auto'
          }}>
            {/* Tool tabs selector */}
            <div style={{ display: 'flex', background: 'var(--color-bg-off-white)', borderRadius: '12px', padding: '4px' }}>
              <button
                onClick={() => { setActiveTool('lesson'); setOutput(''); }}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '10px 0',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeTool === 'lesson' ? '#FFF' : 'transparent',
                  color: activeTool === 'lesson' ? 'var(--color-orange)' : 'var(--color-text-secondary)',
                  fontWeight: activeTool === 'lesson' ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-bricolage)',
                  boxShadow: activeTool === 'lesson' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <BookOpen size={16} />
                Lesson Plan
              </button>
              <button
                onClick={() => { setActiveTool('rubric'); setOutput(''); }}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '10px 0',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeTool === 'rubric' ? '#FFF' : 'transparent',
                  color: activeTool === 'rubric' ? 'var(--color-orange)' : 'var(--color-text-secondary)',
                  fontWeight: activeTool === 'rubric' ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-bricolage)',
                  boxShadow: activeTool === 'rubric' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <Table size={16} />
                Rubric Maker
              </button>
              <button
                onClick={() => { setActiveTool('comment'); setOutput(''); }}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '10px 0',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeTool === 'comment' ? '#FFF' : 'transparent',
                  color: activeTool === 'comment' ? 'var(--color-orange)' : 'var(--color-text-secondary)',
                  fontWeight: activeTool === 'comment' ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-bricolage)',
                  boxShadow: activeTool === 'comment' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <FileText size={16} />
                Comments
              </button>
            </div>

            {/* Dynamic tool form */}
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              
              {activeTool === 'lesson' && (
                <>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Topic of Lesson *</label>
                    <input
                      type="text"
                      className="veda-input"
                      placeholder="e.g. Photosynthesis vs Cellular Respiration"
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      required
                    />
                  </div>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Target Grade Level</label>
                    <input
                      type="text"
                      className="veda-input"
                      placeholder="e.g. 10th Grade / IB Biology"
                      value={grade}
                      onChange={e => setGrade(e.target.value)}
                    />
                  </div>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Lesson Duration</label>
                    <input
                      type="text"
                      className="veda-input"
                      placeholder="e.g. 60 Minutes"
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                    />
                  </div>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Additional Instructions / Objectives</label>
                    <textarea
                      className="veda-input"
                      style={{ minHeight: '80px', resize: 'vertical' }}
                      placeholder="e.g. Focus on light-dependent reactions; include a hands-on activity."
                      value={objectives}
                      onChange={e => setObjectives(e.target.value)}
                    />
                  </div>
                </>
              )}

              {activeTool === 'rubric' && (
                <>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Assessment Activity Name *</label>
                    <input
                      type="text"
                      className="veda-input"
                      placeholder="e.g. Science Lab Report or Debate"
                      value={task}
                      onChange={e => setTask(e.target.value)}
                      required
                    />
                  </div>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Target Grade Level</label>
                    <input
                      type="text"
                      className="veda-input"
                      placeholder="e.g. 10th Grade"
                      value={rubricGrade}
                      onChange={e => setRubricGrade(e.target.value)}
                    />
                  </div>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Evaluation Criteria (Comma Separated)</label>
                    <textarea
                      className="veda-input"
                      style={{ minHeight: '80px', resize: 'vertical' }}
                      placeholder="Understanding, Methodology, Writing style, Citation"
                      value={criteria}
                      onChange={e => setCriteria(e.target.value)}
                    />
                  </div>
                </>
              )}

              {activeTool === 'comment' && (
                <>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Student Name *</label>
                    <input
                      type="text"
                      className="veda-input"
                      placeholder="e.g. Rahul Sharma"
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Subject / Class Focus</label>
                    <input
                      type="text"
                      className="veda-input"
                      placeholder="e.g. Physics A"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Key Strengths</label>
                    <input
                      type="text"
                      className="veda-input"
                      placeholder="e.g. analytical thinking, group project leadership"
                      value={strengths}
                      onChange={e => setStrengths(e.target.value)}
                    />
                  </div>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Areas for Growth</label>
                    <input
                      type="text"
                      className="veda-input"
                      placeholder="e.g. turning assignments in on time"
                      value={improvements}
                      onChange={e => setImprovements(e.target.value)}
                    />
                  </div>
                  <div className="veda-input-group">
                    <label className="veda-input-label">Tone</label>
                    <select
                      className="veda-input"
                      value={tone}
                      onChange={e => setTone(e.target.value)}
                      style={{ appearance: 'auto' }}
                    >
                      <option value="supportive and constructive">Supportive & Constructive</option>
                      <option value="highly encouraging and enthusiastic">Encouraging & Enthusiastic</option>
                      <option value="formal and direct">Formal & Direct</option>
                    </select>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 0',
                  borderRadius: '100px',
                  border: 'none',
                  background: 'var(--color-dark)',
                  color: '#FFF',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
                className="veda-btn"
              >
                {loading ? (
                  <div style={{ width: '16px', height: '16px', border: '2px solid #FFF', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Sparkles size={16} />
                )}
                <span>Generate with AI</span>
              </button>
            </form>
          </div>

          {/* Right panel - Generated Output Display */}
          <div style={{
            flexGrow: 1,
            background: 'var(--color-bg-white)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '14px' }}>
              <h3 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>
                Generated Output Workspace
              </h3>
              {output && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleCopy}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: '#FFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {copied ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setOutput('')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: '#FFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>

            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: output ? 'start' : 'center', alignItems: output ? 'stretch' : 'center' }}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', border: '4px solid var(--color-bg-off-white-darker)', borderTop: '4px solid var(--color-orange)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <p style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--color-text-secondary)' }}>Compiling parameters & running generative prompt...</p>
                </div>
              ) : output ? (
                <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-inter)', fontSize: '15px', lineHeight: '160%', color: 'var(--color-text-primary)' }}>
                  {output}
                </div>
              ) : (
                <div style={{ textAlign: 'center', maxWidth: '380px', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <Sparkles size={40} color="var(--color-text-muted)" style={{ opacity: 0.5 }} />
                  <h4 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>Ready to Assist</h4>
                  <p style={{ fontSize: '13px', lineHeight: '140%' }}>
                    Fill out the class settings on the left panel and click generate. AI will compile a formatted draft right here in real time.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
