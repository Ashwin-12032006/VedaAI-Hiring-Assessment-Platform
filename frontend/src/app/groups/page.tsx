'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Users, Plus, BookOpen, Clock, Trash2, Search, GraduationCap } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  subject: string;
  studentsCount: number;
  lastActive: string;
  grade: string;
}

const INITIAL_GROUPS: Group[] = [
  { id: '1', name: 'Grade 10 - Physics A', subject: 'Physics', studentsCount: 6, lastActive: '2 hours ago', grade: '10th Grade' },
  { id: '2', name: 'Grade 11 - Advanced Chemistry', subject: 'Chemistry', studentsCount: 4, lastActive: 'Yesterday', grade: '11th Grade' },
  { id: '3', name: 'Class 9B - World History', subject: 'History', studentsCount: 4, lastActive: '3 days ago', grade: '9th Grade' },
  { id: '4', name: 'Grade 12 - Calculus BC', subject: 'Mathematics', studentsCount: 3, lastActive: '1 week ago', grade: '12th Grade' },
];

interface Student {
  name: string;
  email: string;
  rollNumber: string;
}

const MOCK_STUDENTS: Record<string, Student[]> = {
  '1': [
    { name: 'Aarav Sharma', email: 'aarav.sharma@school.edu', rollNumber: 'PHY-10-01' },
    { name: 'Aditya Patel', email: 'aditya.patel@school.edu', rollNumber: 'PHY-10-02' },
    { name: 'Ananya Iyer', email: 'ananya.iyer@school.edu', rollNumber: 'PHY-10-03' },
    { name: 'Diya Sen', email: 'diya.sen@school.edu', rollNumber: 'PHY-10-04' },
    { name: 'Ishaan Nair', email: 'ishaan.nair@school.edu', rollNumber: 'PHY-10-05' },
    { name: 'Kavya Reddy', email: 'kavya.reddy@school.edu', rollNumber: 'PHY-10-06' },
  ],
  '2': [
    { name: 'Aditi Verma', email: 'aditi.verma@school.edu', rollNumber: 'CHM-11-01' },
    { name: 'Kabir Kapoor', email: 'kabir.kapoor@school.edu', rollNumber: 'CHM-11-02' },
    { name: 'Meera Deshmukh', email: 'meera.deshmukh@school.edu', rollNumber: 'CHM-11-03' },
    { name: 'Rahul Joshi', email: 'rahul.joshi@school.edu', rollNumber: 'CHM-11-04' },
  ],
  '3': [
    { name: 'Arjun Mehta', email: 'arjun.mehta@school.edu', rollNumber: 'HIS-09-01' },
    { name: 'Nisha Pillai', email: 'nisha.pillai@school.edu', rollNumber: 'HIS-09-02' },
    { name: 'Rohan Gupta', email: 'rohan.gupta@school.edu', rollNumber: 'HIS-09-03' },
    { name: 'Siddharth Rao', email: 'siddharth.rao@school.edu', rollNumber: 'HIS-09-04' },
  ],
  '4': [
    { name: 'Dev Mukherjee', email: 'dev.m@school.edu', rollNumber: 'MTH-12-01' },
    { name: 'Karan Singhal', email: 'karan.s@school.edu', rollNumber: 'MTH-12-02' },
    { name: 'Riya Malhotra', email: 'riya.m@school.edu', rollNumber: 'MTH-12-03' },
  ],
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Roster Modal State
  const [rosterGroup, setRosterGroup] = useState<Group | null>(null);
  const [groupRosters, setGroupRosters] = useState<Record<string, Student[]>>(MOCK_STUDENTS);

  // New Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentRoll, setStudentRoll] = useState('');

  // New Group Form State
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newStudents, setNewStudents] = useState(30);

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSubject.trim()) return;

    const newGroup: Group = {
      id: Date.now().toString(),
      name: newName.trim(),
      subject: newSubject.trim(),
      studentsCount: Number(newStudents) || 25,
      lastActive: 'Just now',
      grade: newGrade || 'General Class',
    };

    setGroups([newGroup, ...groups]);
    setShowAddModal(false);

    // Clear form
    setNewName('');
    setNewSubject('');
    setNewGrade('');
    setNewStudents(30);
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('Are you sure you want to remove this group? This will archive all their reports.')) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="monorepo-container animate-fade-in" style={{ display: 'flex', minHeight: '97vh', gap: '12px' }}>
      <Sidebar activeTab="groups" />

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Header title="My Groups" />

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
                Classroom Directories
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Manage groups, view roster sizes, and assign assessment papers
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search groups..."
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

            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'var(--color-dark)',
                color: '#FFF',
                border: 'none',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-bricolage)'
              }}
              className="veda-btn"
            >
              <Plus size={16} />
              <span>Add Group</span>
            </button>
          </div>
        </section>

        {/* Groups Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
          alignContent: 'start',
          flexGrow: 1,
          overflowY: 'auto'
        }}>
          {filteredGroups.map(group => (
            <div
              key={group.id}
              style={{
                background: 'var(--color-bg-white)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
                border: '1px solid rgba(0,0,0,0.04)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-orange)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {group.grade}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
                    {group.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '50%'
                  }}
                  title="Delete Group"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', background: 'var(--color-bg-off-white)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={16} /> Roster Size:
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{group.studentsCount} Students</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={16} /> Subject Focus:
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{group.subject}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} /> Last Activity:
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{group.lastActive}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setRosterGroup(group)}
                  style={{
                    flex: 1,
                    padding: '9px 0',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: '#FFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-bricolage)'
                  }}
                >
                  View Roster
                </button>
                <button
                  onClick={() => window.location.href = `/create?group=${group.id}`}
                  style={{
                    flex: 1,
                    padding: '9px 0',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--color-dark)',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-bricolage)'
                  }}
                >
                  Create Quiz
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for adding group */}
        {showAddModal && (
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
            <form
              onSubmit={handleAddGroup}
              style={{
                background: '#FFF',
                padding: '32px',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div>
                <h3 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '20px', fontWeight: 800 }}>Create Class Group</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Define a class roster to easily distribute assignment tasks.</p>
              </div>

              <div className="veda-input-group">
                <label className="veda-input-label">Group Name *</label>
                <input
                  type="text"
                  className="veda-input"
                  placeholder="e.g. Grade 10 - Chemistry Section C"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="veda-input-group">
                <label className="veda-input-label">Subject *</label>
                <input
                  type="text"
                  className="veda-input"
                  placeholder="e.g. Organic Chemistry"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="veda-input-group" style={{ flex: 1 }}>
                  <label className="veda-input-label">Grade / Level</label>
                  <input
                    type="text"
                    className="veda-input"
                    placeholder="e.g. 10th Grade"
                    value={newGrade}
                    onChange={e => setNewGrade(e.target.value)}
                  />
                </div>
                <div className="veda-input-group" style={{ flex: 1 }}>
                  <label className="veda-input-label">Number of Students</label>
                  <input
                    type="number"
                    className="veda-input"
                    value={newStudents}
                    onChange={e => setNewStudents(Number(e.target.value))}
                    min={1}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '100px',
                    border: '1.5px solid rgba(0,0,0,0.1)',
                    background: '#FFF',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '100px',
                    border: 'none',
                    background: 'var(--color-orange)',
                    color: '#FFF',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal for View Roster (Interactive) */}
        {rosterGroup && (
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
              maxWidth: '600px',
              maxHeight: '90vh',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-orange)', textTransform: 'uppercase' }}>
                    {rosterGroup.grade} • {rosterGroup.subject}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', marginTop: '4px' }}>
                    {rosterGroup.name} Roster
                  </h3>
                </div>
                <button
                  onClick={() => setRosterGroup(null)}
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

              {/* Student Table */}
              <div style={{ overflowX: 'auto', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-off-white)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Roll Number</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Student Name</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Email Address</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(groupRosters[rosterGroup.id] || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          No students in this class roster yet. Add one below!
                        </td>
                      </tr>
                    ) : (
                      (groupRosters[rosterGroup.id] || []).map((student, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-orange)' }}>{student.rollNumber}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 600 }}>{student.name}</td>
                          <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{student.email}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <button
                              onClick={() => {
                                const currentList = groupRosters[rosterGroup.id] || [];
                                const updatedList = currentList.filter((_, sIdx) => sIdx !== idx);
                                setGroupRosters({ ...groupRosters, [rosterGroup.id]: updatedList });
                                // Update count in groups
                                setGroups(groups.map(g => g.id === rosterGroup.id ? { ...g, studentsCount: updatedList.length } : g));
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-error)',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Student Form */}
              <div style={{ background: 'var(--color-bg-off-white)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h4 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '15px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-navy)' }}>
                  Add Student to Class
                </h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    style={{ flex: '2', padding: '8px 12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', fontSize: '13px' }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={studentEmail}
                    onChange={e => setStudentEmail(e.target.value)}
                    style={{ flex: '2', padding: '8px 12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', fontSize: '13px' }}
                  />
                  <input
                    type="text"
                    placeholder="Roll No (e.g. PHY-01)"
                    value={studentRoll}
                    onChange={e => setStudentRoll(e.target.value)}
                    style={{ flex: '1', minWidth: '100px', padding: '8px 12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', fontSize: '13px' }}
                  />
                  <button
                    onClick={() => {
                      if (!studentName.trim() || !studentEmail.trim() || !studentRoll.trim()) {
                        alert('Please fill out all fields');
                        return;
                      }
                      const newStudent = { name: studentName.trim(), email: studentEmail.trim(), rollNumber: studentRoll.trim() };
                      const currentList = groupRosters[rosterGroup.id] || [];
                      const updatedList = [...currentList, newStudent];
                      setGroupRosters({ ...groupRosters, [rosterGroup.id]: updatedList });
                      setGroups(groups.map(g => g.id === rosterGroup.id ? { ...g, studentsCount: updatedList.length } : g));
                      
                      // Clear inputs
                      setStudentName('');
                      setStudentEmail('');
                      setStudentRoll('');
                    }}
                    style={{
                      background: 'var(--color-orange)',
                      color: '#FFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setRosterGroup(null)}
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
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
