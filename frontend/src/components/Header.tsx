'use client';

import React from 'react';
import { Bell, ChevronDown, BookOpen } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header style={{
      height: '56px',
      background: 'var(--color-bg-white)',
      borderRadius: 'var(--border-radius-md)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-card)'
    }}>
      
      {/* Breadcrumb Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BookOpen size={20} color="var(--color-text-muted)" />
        <span style={{
          fontFamily: 'var(--font-bricolage)',
          fontWeight: 600,
          fontSize: '16px',
          color: 'var(--color-text-muted)'
        }}>
          {title}
        </span>
      </div>

      {/* User Widget */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Bell notification */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'var(--color-bg-off-white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <Bell size={18} color="var(--color-text-primary)" />
          <div style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: 'var(--color-orange)',
            borderRadius: '50%',
            top: '1px',
            right: '1px',
            border: '2px solid var(--color-bg-white)'
          }} />
        </div>

        {/* User Profile dropdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 12px',
          gap: '8px',
          background: 'var(--color-bg-off-white)',
          borderRadius: '12px',
          cursor: 'pointer'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--color-navy)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700
          }}>
            JD
          </div>
          <span style={{
            fontFamily: 'var(--font-bricolage)',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--color-text-primary)'
          }}>
            John Doe
          </span>
          <ChevronDown size={16} />
        </div>

      </div>

    </header>
  );
}
