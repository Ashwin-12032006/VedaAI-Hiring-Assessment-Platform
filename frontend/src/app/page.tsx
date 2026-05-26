'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAssignmentStore, IAssignment } from '../store/useAssignmentStore';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  MoreVertical, 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Sparkles, 
  Library, 
  CreditCard, 
  Settings,
  Bell,
  ChevronDown,
  Calendar,
  AlertTriangle,
  RotateCw,
  FileCheck
} from 'lucide-react';


export default function Dashboard() {
  const { 
    assignments, 
    loading, 
    error, 
    fetchAssignments, 
    deleteAssignment,
    connectWebSocket 
  } = useAssignmentStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Load assignments and connect ws
  useEffect(() => {
    fetchAssignments();
    connectWebSocket();
  }, [fetchAssignments, connectWebSocket]);

  // Handle outside click for assignment action menu
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this assignment?')) {
      await deleteAssignment(id);
    }
    setActiveMenuId(null);
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // Filter assignments based on search query
  const filteredAssignments = assignments.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.instructions && item.instructions.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="monorepo-container animate-fade-in" style={{ display: 'flex', minHeight: '97vh', gap: '12px' }}>
      
      {/* ================= FIGMA SIDEBAR ================= */}
      <Sidebar activeTab="assignments" />

      {/* ================= MAIN CONTENT AREA ================= */}
      <main style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        
        {/* ================= FIGMA HEADER ================= */}
        <Header title="Dashboard & Assessments" />

        {/* ================= STATS DASHBOARD GRID ================= */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          width: '100%'
        }}>
          {/* Card 1: Total Assignments */}
          <div style={{
            background: 'var(--color-bg-white)',
            borderRadius: 'var(--border-radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(0, 0, 0, 0.04)'
          }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Assessments</span>
              <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 0 0' }}>
                {assignments.length}
              </h2>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(229, 104, 32, 0.1)',
              color: 'var(--color-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={24} />
            </div>
          </div>

          {/* Card 2: Students Reached */}
          <div style={{
            background: 'var(--color-bg-white)',
            borderRadius: 'var(--border-radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(0, 0, 0, 0.04)'
          }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Students Reached</span>
              <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 0 0' }}>
                17
              </h2>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(75, 194, 109, 0.1)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={24} />
            </div>
          </div>

          {/* Card 3: AI Compile Success Rate (Unique radial graph percentage!) */}
          <div style={{
            background: 'var(--color-bg-white)',
            borderRadius: 'var(--border-radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(0, 0, 0, 0.04)'
          }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>AI Success Rate</span>
              <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 0 0' }}>
                95.8%
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>↑ +2.4% this week</span>
            </div>
            {/* Visual SVG Progress Ring */}
            <div style={{ position: 'relative', width: '56px', height: '56px' }}>
              <svg width="56" height="56" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#EFEFEF"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-success)"
                  strokeWidth="3.5"
                  strokeDasharray="96, 100"
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-success)'
              }}>
                96%
              </div>
            </div>
          </div>

          {/* Card 4: Credits Used Gauge */}
          <div style={{
            background: 'var(--color-bg-white)',
            borderRadius: 'var(--border-radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(0, 0, 0, 0.04)'
          }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Credits Used</span>
              <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 0 0' }}>
                720 / 1000
              </h2>
              <div style={{ width: '120px', background: '#EFEFEF', height: '6px', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ width: '72%', background: 'var(--color-orange)', height: '100%', borderRadius: '3px' }} />
              </div>
            </div>
            {/* Visual SVG Credit Gauge */}
            <div style={{ position: 'relative', width: '56px', height: '56px' }}>
              <svg width="56" height="56" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#EFEFEF"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-orange)"
                  strokeWidth="3.5"
                  strokeDasharray="72, 100"
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-orange)'
              }}>
                72%
              </div>
            </div>
          </div>
        </section>

        {/* ================= FIGMA SEARCH & FILTERS BAR ================= */}
        <section style={{
          background: 'var(--color-bg-white)',
          borderRadius: 'var(--border-radius-md)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: 'var(--shadow-card)'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: 'var(--color-success)',
              borderRadius: '50%',
              border: '4px solid rgba(75, 194, 109, 0.4)'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: 'var(--font-bricolage)',
                fontWeight: 700,
                fontSize: '16px',
                color: 'var(--color-text-primary)'
              }}>
                Assignments
              </span>
              <span style={{
                fontSize: '12px',
                color: 'var(--color-text-muted)'
              }}>
                Manage and create assessments for your classes
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1, maxWidth: '480px', justifyContent: 'flex-end' }}>
            
            {/* Search Box */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '300px'
            }}>
              <Search size={16} color="var(--color-text-muted)" style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
              <input
                type="text"
                placeholder="Search Assignment"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px 9px 36px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '100px',
                  outline: 'none',
                  fontSize: '13px',
                  fontFamily: 'var(--font-inter)'
                }}
              />
            </div>

            {/* Filter Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              gap: '6px',
              borderRadius: '100px',
              border: '1px solid rgba(0,0,0,0.12)',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-bricolage)',
              fontWeight: 700,
              fontSize: '13px'
            }}>
              <Filter size={14} />
              <span>Filter By</span>
            </div>

          </div>

        </section>

        {/* ================= DYNAMIC BODY AREA ================= */}
        <div style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'transparent',
          width: '100%'
        }}>
          
          {loading && assignments.length === 0 ? (
            /* Loading State */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-bg-off-white-darker)', borderTop: '4px solid var(--color-orange)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--color-text-secondary)' }}>Loading assignments...</p>
            </div>
          ) : error && assignments.length === 0 ? (
            /* Error State */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '400px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
              <AlertTriangle size={48} color="var(--color-error)" />
              <h3 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '18px', fontWeight: 700 }}>Connection Error</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{error}</p>
              <button className="veda-btn veda-btn-primary" onClick={fetchAssignments} style={{ marginTop: '12px' }}>
                <RotateCw size={16} /> Retry Connection
              </button>
            </div>
          ) : assignments.length === 0 ? (
            
            /* ================= FIGMA EMPTY STATE SCREEN ================= */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '32px',
              padding: '40px',
              maxWidth: '486px',
              textAlign: 'center'
            }}>
              
              {/* Sleek SVG Illustration reproducing the magnifying lens, page, cloud and stars */}
              <div style={{ width: '300px', height: '260px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Soft Background circles */}
                  <circle cx="150" cy="120" r="100" fill="url(#bg-grad)" />
                  
                  {/* Document page behind */}
                  <rect x="90" y="50" width="100" height="130" rx="12" fill="#FFFFFF" filter="drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.08))" />
                  <rect x="105" y="70" width="40" height="8" rx="4" fill="var(--color-navy)" />
                  <rect x="105" y="90" width="70" height="6" rx="3" fill="#D5D5D5" />
                  <rect x="105" y="105" width="70" height="6" rx="3" fill="#D5D5D5" />
                  <rect x="105" y="120" width="70" height="6" rx="3" fill="#D5D5D5" />
                  <rect x="105" y="135" width="70" height="6" rx="3" fill="#D5D5D5" />
                  
                  {/* Cloud details */}
                  <g filter="drop-shadow(0px 4px 10px rgba(27, 119, 139, 0.09))">
                    <path d="M210 70C210 64.5 214.5 60 220 60C225.5 60 230 64.5 230 70C230 70.3 230 70.6 230 70.9C231.2 70.3 232.6 70 234 70C238.4 70 242 73.6 242 78C242 82.4 238.4 86 234 86H214C211.8 86 210 84.2 210 82C210 79.8 211.8 78 214 78C214.3 78 214.6 78 214.9 78.1C212 77.1 210 74.3 210 70Z" fill="#FFFFFF" />
                  </g>
                  <rect x="220" y="73" width="16" height="5" rx="2.5" fill="#D5D5D5" />
                  <circle cx="214" cy="75.5" r="2.5" fill="#CCC6D9" />

                  {/* Magnifying Glass */}
                  {/* Lens handle */}
                  <line x1="172" y1="165" x2="205" y2="198" stroke="#E1DCEB" strokeWidth="16" strokeLinecap="round" transform="rotate(-10 188.5 181.5)" />
                  <line x1="172" y1="165" x2="205" y2="198" stroke="#CCC6D9" strokeWidth="8" strokeLinecap="round" transform="rotate(-10 188.5 181.5)" />
                  {/* Outer Ring */}
                  <circle cx="140" cy="130" r="45" stroke="#CCC6D9" strokeWidth="10" fill="none" />
                  <circle cx="140" cy="130" r="45" stroke="#17CB9E" strokeWidth="8" strokeLinecap="round" fill="rgba(255, 255, 255, 0.25)" style={{ backdropFilter: 'blur(3px)' }} />
                  
                  {/* Red cancel cross indicator inside the magnifying lens */}
                  <circle cx="140" cy="130" r="22" fill="#FF4040" />
                  <path d="M132 122L148 138M148 122L132 138" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Decorative stars */}
                  <path d="M45 90L48 95L54 96L50 100L51 106L45 102L39 106L40 100L36 96L42 95L45 90Z" fill="#011625" />
                  <circle cx="250" cy="140" r="6" fill="#417BA4" />
                  
                  <defs>
                    <linearGradient id="bg-grad" x1="150" y1="20" x2="150" y2="220" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#F2F2F2" />
                      <stop offset="100%" stopColor="#EFEFEF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-bricolage)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#303030',
                  letterSpacing: '-0.04em'
                }}>
                  No assignments yet
                </h2>
                <p style={{
                  fontFamily: 'var(--font-bricolage)',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: 'var(--color-text-secondary)',
                  lineHeight: '140%',
                  letterSpacing: '-0.04em'
                }}>
                  Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
                </p>
              </div>

              {/* Call to action button */}
              <Link href="/create" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'var(--color-dark)',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '48px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-bricolage)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-button)'
                }}
                className="veda-btn"
                >
                  <Plus size={18} color="#FFF" strokeWidth={3} />
                  <span>Create Your First Assignment</span>
                </button>
              </Link>

            </div>

          ) : (
            
            /* ================= FIGMA FILLED LIST VIEW ================= */
            <div style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
              gap: '16px',
              padding: '4px',
              alignContent: 'start',
              flexGrow: 1,
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 170px)'
            }}>
              
              {filteredAssignments.map((assignment) => (
                <div 
                  key={assignment.id}
                  style={{
                    background: 'var(--color-bg-white)',
                    borderRadius: '20px',
                    padding: '24px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '24px',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    // Navigate only if the job is completed
                    if (assignment.status === 'completed') {
                      window.location.href = `/paper/${assignment.id}`;
                    }
                  }}
                  className="assignment-card-hover"
                >
                  
                  {/* Card Title & More actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className={`badge badge-${assignment.status}`}>
                        {assignment.status}
                      </span>
                      <h3 style={{
                        fontFamily: 'var(--font-bricolage)',
                        fontSize: '20px',
                        fontWeight: 800,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.04em',
                        marginTop: '8px'
                      }}>
                        {assignment.title}
                      </h3>
                    </div>

                    {/* Popover actions menu */}
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={(e) => toggleMenu(e, assignment.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-text-muted)'
                        }}
                      >
                        <MoreVertical size={20} />
                      </button>

                      {activeMenuId === assignment.id && (
                        <div style={{
                          position: 'absolute',
                          right: '0',
                          top: '28px',
                          background: '#FFFFFF',
                          boxShadow: 'var(--shadow-realistic)',
                          borderRadius: '12px',
                          padding: '6px',
                          zIndex: 99,
                          minWidth: '140px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          border: '1px solid rgba(0,0,0,0.06)'
                        }}>
                          {assignment.status === 'completed' && (
                            <Link href={`/paper/${assignment.id}`} style={{ textDecoration: 'none' }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                fontSize: '13px',
                                color: 'var(--color-text-primary)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-bricolage)',
                                fontWeight: 500
                              }}
                              className="menu-item-hover"
                              >
                                <Eye size={14} />
                                <span>View Assignment</span>
                              </div>
                            </Link>
                          )}
                          <div 
                            onClick={(e) => handleDelete(e, assignment.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              fontSize: '13px',
                              color: 'var(--color-error)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-bricolage)',
                              fontWeight: 500
                            }}
                            className="menu-item-hover-err"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* In progress Live indicator */}
                  {assignment.status === 'processing' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px',
                      background: 'rgba(255, 86, 35, 0.05)',
                      borderRadius: '12px',
                      border: '1px dashed rgba(255, 86, 35, 0.2)'
                    }}>
                      <div className="shimmer-circle" style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid rgba(255, 86, 35, 0.2)',
                        borderTop: '2px solid var(--color-orange)',
                        borderRadius: '50%',
                        animation: 'spin 1.0s linear infinite'
                      }} />
                      <span style={{ fontSize: '13px', color: 'var(--color-orange)', fontWeight: 600, fontFamily: 'var(--font-bricolage)' }}>
                        AI is compiling questions in the background...
                      </span>
                    </div>
                  )}

                  {/* Failed job error alert */}
                  {assignment.status === 'failed' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      background: 'var(--color-error-bg)',
                      borderRadius: '12px',
                      fontSize: '13px',
                      color: 'var(--color-error)',
                      fontWeight: 500
                    }}>
                      <AlertTriangle size={16} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Error: {assignment.error || 'Failed to generate questions.'}
                      </span>
                    </div>
                  )}

                  {/* Completed sections count preview */}
                  {assignment.status === 'completed' && assignment.sections && (
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'var(--color-bg-off-white-darker)',
                        padding: '6px 12px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 600
                      }}>
                        <FileCheck size={14} color="var(--color-success)" />
                        <span>{assignment.sections.length} Sections Generated</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'var(--color-bg-off-white-darker)',
                        padding: '6px 12px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 600
                      }}>
                        <span>{assignment.numQuestions} Questions</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'var(--color-bg-off-white-darker)',
                        padding: '6px 12px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 600
                      }}>
                        <span>{assignment.totalMarks} Marks</span>
                      </div>
                    </div>
                  )}

                  {/* Date & Meta Info Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                    paddingTop: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-bricolage)' }}>
                      <Calendar size={14} />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      {assignment.questionTypes.map((type) => (
                        <span key={type} style={{
                          background: 'rgba(1, 22, 37, 0.05)',
                          color: 'var(--color-navy)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>

      {/* Embedded CSS for hover items and animations */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .nav-item {
          transition: all 0.2s ease;
        }
        .nav-item:hover:not(.active) {
          background: var(--color-bg-off-white);
          color: var(--color-text-primary) !important;
        }
        
        .assignment-card-hover {
          transition: all 0.3s ease !important;
        }
        .assignment-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-realistic) !important;
          border-color: rgba(255, 86, 35, 0.15) !important;
        }
        
        .menu-item-hover {
          transition: background 0.15s ease;
        }
        .menu-item-hover:hover {
          background: var(--color-bg-off-white);
        }
        
        .menu-item-hover-err {
          transition: background 0.15s ease;
        }
        .menu-item-hover-err:hover {
          background: var(--color-error-bg);
        }
      `}</style>

    </div>
  );
}
