'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Search, FileText, Download, Eye, Trash2, Calendar, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface LibraryItem {
  id: string;
  name: string;
  type: 'pdf' | 'txt' | 'quiz';
  size: string;
  dateAdded: string;
  category: string;
}

const INITIAL_ITEMS: LibraryItem[] = [
  { id: '1', name: 'Newton Laws of Motion Lecture Notes.pdf', type: 'pdf', size: '2.4 MB', dateAdded: '2026-05-24', category: 'Physics' },
  { id: '2', name: 'Organic Chemistry Reactions Summary.pdf', type: 'pdf', size: '4.1 MB', dateAdded: '2026-05-22', category: 'Chemistry' },
  { id: '3', name: 'World War 1 Timeline & Overview.txt', type: 'txt', size: '45 KB', dateAdded: '2026-05-18', category: 'History' },
  { id: '4', name: 'Calculus Limits Revision worksheet.pdf', type: 'pdf', size: '1.2 MB', dateAdded: '2026-05-15', category: 'Mathematics' },
  { id: '5', name: 'Grade 10 Physics Assessment - Term 1.quiz', type: 'quiz', size: '18 Questions', dateAdded: '2026-05-12', category: 'Physics' },
  { id: '6', name: 'World History Middle Ages Roster Quiz.quiz', type: 'quiz', size: '12 Questions', dateAdded: '2026-05-10', category: 'History' },
];

const MOCK_CONTENTS: Record<string, string> = {
  '1': `# Newton's Laws of Motion - Lecture Notes\n\n### 1. First Law (Law of Inertia)\nAn object at rest remains at rest, and an object in motion remains in motion at a constant velocity unless acted upon by a net external force.\n\n### 2. Second Law (F = ma)\nThe acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.\n\n### 3. Third Law (Action-Reaction)\nFor every action, there is an equal and opposite reaction.`,
  '2': `# Organic Chemistry Reactions Summary\n\n### 1. Nucleophilic Substitution (SN1 vs SN2)\n- **SN1**: Two-step mechanism, carbocation intermediate, favored by polar protic solvents.\n- **SN2**: One-step concerted mechanism, backside attack, favored by polar aprotic solvents.\n\n### 2. Elimination Reactions (E1 vs E2)\n- Follows Zaitsev's Rule: The most substituted alkene is the major product.`,
  '3': `World War 1 Timeline & Overview\n\n1914: Assassination of Archduke Franz Ferdinand, triggering alliances.\n1915: Sinking of the Lusitania, Italy joins the Allies.\n1916: Battle of the Somme, introduction of tanks.\n1917: United States enters the war.\n1918: Armistice signed, ending hostilities on November 11.`,
  '4': `# Calculus Limits Revision worksheet\n\n### Definition of a Limit\nThe value that a function approaches as the input approaches some value.\n\n### Special Limits:\n- lim (x -> 0) [sin(x) / x] = 1\n- lim (x -> 0) [(1 - cos(x)) / x] = 0`,
  '5': `# Grade 10 Physics Assessment - Term 1\n\n**Question 1:** What is the SI unit of Force?\n- A) Joule\n- B) Newton\n- C) Pascal\n- D) Watt\n*Correct Answer: B (Newton)*\n\n**Question 2:** Which of Newton's laws explains why seatbelts are needed?\n- A) First Law\n- B) Second Law\n- C) Third Law\n- D) Law of Gravitation\n*Correct Answer: A (First Law)*`,
  '6': `# World History Middle Ages Roster Quiz\n\n**Question 1:** Which empire collapsed in 476 AD, marking the start of the Middle Ages?\n- A) Byzantine Empire\n- B) Roman Empire\n- C) Ottoman Empire\n- D) Persian Empire\n*Correct Answer: B (Roman Empire)*`
};

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>(INITIAL_ITEMS);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'txt' | 'quiz'>('all');
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);
  
  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; subMessage: string; type: 'success' | 'info' } | null>(null);
  
  // Custom Delete Modal State
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<LibraryItem | null>(null);

  const showToast = (message: string, subMessage: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, subMessage, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleDeleteClick = (item: LibraryItem) => {
    setDeleteConfirmItem(item);
  };

  const executeDelete = () => {
    if (deleteConfirmItem) {
      setItems(items.filter(item => item.id !== deleteConfirmItem.id));
      showToast(
        "Resource Removed", 
        `"${deleteConfirmItem.name}" has been deleted from your library vault.`, 
        'info'
      );
      setDeleteConfirmItem(null);
    }
  };

  const handleDownload = (item: LibraryItem) => {
    const text = MOCK_CONTENTS[item.id] || `Resource content for ${item.name}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    
    const downloadName = item.name.endsWith('.pdf') 
      ? item.name.replace('.pdf', '_notes.txt') 
      : item.name.endsWith('.quiz') 
        ? item.name.replace('.quiz', '_questions.txt') 
        : item.name;
        
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Trigger premium Toast notification instead of browser alert!
    showToast(
      "Download Initialized", 
      `"${downloadName}" is downloading to your local device.`, 
      'success'
    );
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="monorepo-container animate-fade-in" style={{ display: 'flex', minHeight: '97vh', gap: '12px', position: 'relative' }}>
      <Sidebar activeTab="library" />

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Header title="My Library" />

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
            <div style={{ width: '12px', height: '12px', background: 'var(--color-orange)', borderRadius: '50%', border: '4px solid rgba(255, 86, 35, 0.2)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-bricolage)', fontWeight: 700, fontSize: '16px', color: 'var(--color-text-primary)' }}>
                Resource Vault
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Browse, search, and download your uploaded lecture notes, source materials, and generated quizzes
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Type Filter dropdown */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              style={{
                padding: '8px 12px',
                borderRadius: '100px',
                border: '1px solid rgba(0,0,0,0.12)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                outline: 'none',
                background: '#FFF'
              }}
            >
              <option value="all">All File Types</option>
              <option value="pdf">PDF Documents</option>
              <option value="txt">TXT Plain Texts</option>
              <option value="quiz">Generated Quizzes</option>
            </select>

            {/* Search */}
            <div style={{ position: 'relative', width: '200px' }}>
              <Search size={14} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '100px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </section>

        {/* Resources Grid/List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '16px',
          alignContent: 'start',
          flexGrow: 1,
          overflowY: 'auto'
        }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setPreviewItem(item)}
              style={{
                background: 'var(--color-bg-white)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'start',
                gap: '16px',
                border: '1px solid rgba(0,0,0,0.04)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
            >
              {/* File Icon */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: item.type === 'pdf' ? 'rgba(255, 64, 64, 0.08)' : item.type === 'txt' ? 'rgba(74, 144, 226, 0.08)' : 'rgba(255, 173, 173, 0.15)',
                color: item.type === 'pdf' ? '#FF4040' : item.type === 'txt' ? '#4A90E2' : 'var(--color-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText size={24} />
              </div>

              {/* Item Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1, minWidth: 0 }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-orange)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.category}
                </span>
                <h4 style={{
                  fontFamily: 'var(--font-bricolage)',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: 'var(--color-navy)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  margin: 0
                }}>
                  {item.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  <span>{item.size}</span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {item.dateAdded}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div 
                style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignSelf: 'stretch', justifyContent: 'space-between' }}
                onClick={(e) => e.stopPropagation()} // Stop click propagation to card when clicking buttons
              >
                <button
                  onClick={() => handleDeleteClick(item)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '50%',
                    alignSelf: 'flex-end',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setPreviewItem(item)}
                    style={{
                      background: 'var(--color-bg-off-white-darker)',
                      border: 'none',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: 'var(--color-navy)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    style={{
                      background: 'var(--color-dark)',
                      border: 'none',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Preview Modal */}
        {previewItem && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}>
            <div style={{
              background: '#FFF',
              padding: '32px',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '85vh',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-orange)', textTransform: 'uppercase' }}>
                    {previewItem.category} • {previewItem.type.toUpperCase()}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '20px', fontWeight: 800, color: 'var(--color-navy)', marginTop: '4px' }}>
                    {previewItem.name}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewItem(null)}
                  style={{
                    background: 'var(--color-bg-off-white-darker)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Viewer body */}
              <div style={{
                flexGrow: 1,
                overflowY: 'auto',
                background: 'var(--color-bg-off-white)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.05)',
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                lineHeight: '160%',
                color: 'var(--color-text-primary)'
              }}>
                {MOCK_CONTENTS[previewItem.id] || "No content preview available."}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => handleDownload(previewItem)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '100px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: '#FFF',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={16} />
                  <span>Download Resource</span>
                </button>
                <button
                  onClick={() => setPreviewItem(null)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '100px',
                    border: 'none',
                    background: 'var(--color-dark)',
                    color: '#FFF',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Premium Custom Delete Confirmation Modal */}
        {deleteConfirmItem && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(1, 22, 37, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#FFF',
              padding: '32px',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(229, 104, 32, 0.1)',
                color: 'var(--color-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={28} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h3 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '20px', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                  Remove Resource?
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0, padding: '0 12px' }}>
                  Are you sure you want to delete <strong style={{ color: 'var(--color-navy)' }}>"{deleteConfirmItem.name}"</strong>? This action cannot be undone.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '12px' }}>
                <button
                  onClick={() => setDeleteConfirmItem(null)}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    borderRadius: '100px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    background: '#FFF',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-bricolage)'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    borderRadius: '100px',
                    border: 'none',
                    background: 'var(--color-orange)',
                    color: '#FFF',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-bricolage)'
                  }}
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Premium Sliding Toast Notification */}
        {toast && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 12px 32px rgba(1, 22, 37, 0.12)',
            border: '1px solid rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1100,
            maxWidth: '360px',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: toast.type === 'success' ? 'rgba(75, 194, 109, 0.1)' : 'rgba(74, 144, 226, 0.1)',
              color: toast.type === 'success' ? 'var(--color-success)' : '#4A90E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {toast.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'var(--font-bricolage)' }}>
                {toast.message}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {toast.subMessage}
              </span>
            </div>
          </div>
        )}

        {/* global CSS keyframes for Toast entrance */}
        <style jsx global>{`
          @keyframes slideUp {
            from {
              transform: translateY(20px) scale(0.95);
              opacity: 0;
            }
            to {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </main>
    </div>
  );
}
