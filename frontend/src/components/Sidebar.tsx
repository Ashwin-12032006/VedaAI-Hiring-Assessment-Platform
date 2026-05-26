'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Plus, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Sparkles, 
  Library, 
  CreditCard, 
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'groups' | 'assignments' | 'toolkit' | 'library' | 'credits';
}

export default function Sidebar({ activeTab }: SidebarProps) {
  const [schoolName, setSchoolName] = React.useState('Delhi Public School');
  React.useEffect(() => {
    const saved = localStorage.getItem('veda_school_name');
    if (saved) {
      setSchoolName(saved);
    }
  }, []);

  return (
    <aside style={{
      width: '304px',
      background: 'var(--color-bg-white)',
      boxShadow: 'var(--shadow-realistic)',
      borderRadius: 'var(--border-radius-md)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* Logo VedaAI */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(180deg, #E56820 0%, #D45E3E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#FFF',
            fontSize: '20px',
            fontFamily: 'var(--font-bricolage)'
          }}>
            V
          </div>
          <span style={{
            fontFamily: 'var(--font-bricolage)',
            fontSize: '28px',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.06em'
          }}>
            VedaAI
          </span>
        </Link>

        {/* Create Assignment Button */}
        <Link href="/create" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 24px',
            gap: '10px',
            background: 'var(--color-dark)',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-button)',
            borderRadius: '100px',
            fontFamily: 'var(--font-inter)',
            fontSize: '16px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          className="veda-btn"
          >
            <Plus size={18} color="#FFF" strokeWidth={3} />
            <span>Create Assignment</span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '9px 12px',
              gap: '12px',
              borderRadius: 'var(--border-radius-sm)',
              background: activeTab === 'dashboard' ? 'var(--color-bg-off-white-darker)' : 'transparent',
              color: activeTab === 'dashboard' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'dashboard' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'var(--font-bricolage)'
            }}>
              <LayoutDashboard size={20} color={activeTab === 'dashboard' ? 'var(--color-orange)' : 'currentColor'} />
              <span>Dashboard</span>
            </div>
          </Link>

          <Link href="/groups" style={{ textDecoration: 'none' }}>
            <div className={`nav-item ${activeTab === 'groups' ? 'active' : ''}`} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '9px 12px',
              gap: '12px',
              borderRadius: 'var(--border-radius-sm)',
              background: activeTab === 'groups' ? 'var(--color-bg-off-white-darker)' : 'transparent',
              color: activeTab === 'groups' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'groups' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'var(--font-bricolage)'
            }}>
              <Users size={20} color={activeTab === 'groups' ? 'var(--color-orange)' : 'currentColor'} />
              <span>My Groups</span>
            </div>
          </Link>

          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className={`nav-item ${activeTab === 'assignments' ? 'active' : ''}`} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '9px 12px',
              gap: '12px',
              borderRadius: 'var(--border-radius-sm)',
              background: activeTab === 'assignments' ? 'var(--color-bg-off-white-darker)' : 'transparent',
              color: activeTab === 'assignments' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'assignments' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'var(--font-bricolage)'
            }}>
              <FileText size={20} color={activeTab === 'assignments' ? 'var(--color-orange)' : 'currentColor'} />
              <span>Assignments</span>
            </div>
          </Link>

          <Link href="/toolkit" style={{ textDecoration: 'none' }}>
            <div className={`nav-item ${activeTab === 'toolkit' ? 'active' : ''}`} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '9px 12px',
              gap: '12px',
              borderRadius: 'var(--border-radius-sm)',
              background: activeTab === 'toolkit' ? 'var(--color-bg-off-white-darker)' : 'transparent',
              color: activeTab === 'toolkit' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'toolkit' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'var(--font-bricolage)'
            }}>
              <Sparkles size={20} color={activeTab === 'toolkit' ? 'var(--color-orange)' : 'currentColor'} />
              <span>AI Teacher’s Toolkit</span>
            </div>
          </Link>

          <Link href="/library" style={{ textDecoration: 'none' }}>
            <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '9px 12px',
              gap: '12px',
              borderRadius: 'var(--border-radius-sm)',
              background: activeTab === 'library' ? 'var(--color-bg-off-white-darker)' : 'transparent',
              color: activeTab === 'library' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'library' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'var(--font-bricolage)'
            }}>
              <Library size={20} color={activeTab === 'library' ? 'var(--color-orange)' : 'currentColor'} />
              <span>My Library</span>
            </div>
          </Link>

          <Link href="/credits" style={{ textDecoration: 'none' }}>
            <div className={`nav-item ${activeTab === 'credits' ? 'active' : ''}`} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '9px 12px',
              gap: '12px',
              borderRadius: 'var(--border-radius-sm)',
              background: activeTab === 'credits' ? 'var(--color-bg-off-white-darker)' : 'transparent',
              color: activeTab === 'credits' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'credits' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'var(--font-bricolage)'
            }}>
              <CreditCard size={20} color={activeTab === 'credits' ? 'var(--color-orange)' : 'currentColor'} />
              <span>Credit Report</span>
            </div>
          </Link>
        </nav>

      </div>

      {/* Profile Card Bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          gap: '8px',
          borderRadius: 'var(--border-radius-sm)',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer'
        }}>
          <Settings size={20} />
          <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: '16px' }}>Settings</span>
        </div>

        <div 
          onClick={() => {
            if (confirm('Are you sure you want to log out?')) {
              window.dispatchEvent(new Event('veda-logout'));
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            gap: '8px',
            borderRadius: 'var(--border-radius-sm)',
            color: 'var(--color-orange)',
            cursor: 'pointer'
          }}
        >
          <LogOut size={20} />
          <span style={{ fontFamily: 'var(--font-bricolage)', fontSize: '16px', fontWeight: 600 }}>Log Out</span>
        </div>

        <div style={{
          display: 'flex',
          padding: '12px',
          gap: '12px',
          background: 'var(--color-bg-off-white-darker)',
          borderRadius: 'var(--border-radius-md)',
          alignItems: 'center'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#FFADAD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-bricolage)',
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--color-navy)'
          }}>
            {schoolName.split(' ').length >= 2 
              ? (schoolName.split(' ')[0][0] + schoolName.split(' ')[1][0]).toUpperCase()
              : schoolName.slice(0, 2).toUpperCase()
            }
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
            <span style={{
              fontFamily: 'var(--font-bricolage)',
              fontWeight: 700,
              fontSize: '15px',
              color: 'var(--color-text-primary)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>
              {schoolName}
            </span>
            <span style={{
              fontFamily: 'var(--font-bricolage)',
              fontSize: '13px',
              color: 'var(--color-text-secondary)'
            }}>
              Bokaro Steel City
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
