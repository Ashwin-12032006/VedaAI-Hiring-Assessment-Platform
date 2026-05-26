'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Mail, Lock, School, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('Delhi Public School');
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const authState = localStorage.getItem('veda_auth');
    if (authState === 'true') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // Listen for custom logout events
    const handleLogout = () => {
      localStorage.removeItem('veda_auth');
      setIsLoggedIn(false);
    };
    window.addEventListener('veda-logout', handleLogout);
    return () => window.removeEventListener('veda-logout', handleLogout);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    // Simulate API authorization response
    setTimeout(() => {
      if (rememberMe) {
        localStorage.setItem('veda_auth', 'true');
        if (schoolName) {
          localStorage.setItem('veda_school_name', schoolName);
        }
      }
      setIsLoggedIn(true);
      setLoading(false);
    }, 1000);
  };

  // While checking status, render a black loading sheet to avoid FOUC
  if (isLoggedIn === null) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        background: '#011625',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--color-orange)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#F9FAFB',
      fontFamily: 'var(--font-inter)'
    }}
    className="animate-fade-in"
    >
      {/* 1. LEFT SIDE - HERO PANELS */}
      <div style={{
        flex: '1.2',
        background: '#011625',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        color: '#FFFFFF'
      }}
      className="desktop-only"
      >
        {/* Glow effect circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229, 104, 32, 0.15) 0%, rgba(229, 104, 32, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(23, 203, 158, 0.1) 0%, rgba(23, 203, 158, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        {/* Brand header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(180deg, #E56820 0%, #D45E3E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#FFF',
            fontSize: '22px',
            fontFamily: 'var(--font-bricolage)'
          }}>
            V
          </div>
          <span style={{
            fontFamily: 'var(--font-bricolage)',
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.06em'
          }}>
            VedaAI
          </span>
        </div>

        {/* Hero message details */}
        <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '520px', margin: 'auto 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '100px',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-orange)'
          }}>
            <Sparkles size={14} />
            <span>AI-Driven Education Suite</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-bricolage)',
            fontSize: '52px',
            fontWeight: 800,
            lineHeight: '110%',
            letterSpacing: '-0.04em',
            margin: 0
          }}>
            Assessments generated in <span style={{ color: 'var(--color-orange)' }}>seconds</span>.
          </h1>
          <p style={{
            fontSize: '18px',
            lineHeight: '160%',
            color: '#A0AEC0',
            fontWeight: 400
          }}>
            Upload text slides or syllabus PDFs. Our AI analyzes the material to construct aligned, high-fidelity exam papers instantly.
          </p>
        </div>

        {/* Footer info stats */}
        <div style={{ display: 'flex', gap: '40px', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '32px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-bricolage)', color: 'var(--color-orange)' }}>10k+</span>
            <span style={{ fontSize: '13px', color: '#718096' }}>Quizzes Compiled</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-bricolage)', color: 'var(--color-orange)' }}>99.4%</span>
            <span style={{ fontSize: '13px', color: '#718096' }}>Success Rate</span>
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE - DYNAMIC CARD FORM */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)',
          border: '1px solid rgba(0,0,0,0.03)'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em', margin: 0 }}>
              Welcome to VedaAI
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              Sign in or create a school developer account.
            </p>
          </div>

          {/* Form switch tabs */}
          <div style={{ display: 'flex', background: 'var(--color-bg-off-white)', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
            <button
              onClick={() => setActiveTab('signin')}
              style={{
                flex: 1,
                padding: '10px 0',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'signin' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'signin' ? 'var(--color-navy)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === 'signin' ? 700 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'var(--font-bricolage)',
                boxShadow: activeTab === 'signin' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              style={{
                flex: 1,
                padding: '10px 0',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'signup' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'signup' ? 'var(--color-navy)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === 'signup' ? 700 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'var(--font-bricolage)',
                boxShadow: activeTab === 'signup' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeTab === 'signup' && (
              <div className="veda-input-group">
                <label className="veda-input-label">Institution / School Name</label>
                <div style={{ position: 'relative' }}>
                  <School size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="veda-input"
                    placeholder="e.g. Delhi Public School"
                    value={schoolName}
                    onChange={e => setSchoolName(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>
            )}

            <div className="veda-input-group">
              <label className="veda-input-label">School Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="veda-input"
                  placeholder="name@school.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <div className="veda-input-group">
              <label className="veda-input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="veda-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            {/* Remember me & Keep me logged in checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--color-orange)', width: '15px', height: '15px' }}
                />
                Keep me logged in
              </label>
              <span style={{ fontSize: '13px', color: 'var(--color-orange)', fontWeight: 600, cursor: 'pointer' }}>Forgot Password?</span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 0',
                borderRadius: '100px',
                border: 'none',
                background: 'var(--color-orange)',
                color: '#FFF',
                fontWeight: 700,
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-bricolage)'
              }}
              className="veda-btn"
            >
              {loading ? (
                <div style={{ width: '18px', height: '18px', border: '2.5px solid #FFF', borderTop: '2.5px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <span>{activeTab === 'signin' ? 'Sign In to Workspace' : 'Create Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Guarantee badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            marginTop: '28px',
            fontSize: '12px',
            color: 'var(--color-text-muted)'
          }}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>Secured with School Domain Access</span>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .desktop-only {
            display: none !important;
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
