'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { CreditCard, Sparkles, AlertCircle, TrendingUp, Check, Coins } from 'lucide-react';

interface CreditLog {
  id: string;
  activity: string;
  type: 'generation' | 'grading' | 'toolkit' | 'purchase';
  credits: number;
  date: string;
}

const INITIAL_LOGS: CreditLog[] = [
  { id: '1', activity: 'Generated Quiz: Newton Laws of Motion', type: 'generation', credits: -20, date: '2026-05-24 14:32' },
  { id: '2', activity: 'Drafted Biology Lesson Plan', type: 'toolkit', credits: -5, date: '2026-05-24 10:15' },
  { id: '3', activity: 'Generated Rubric for Chemistry Lab', type: 'toolkit', credits: -5, date: '2026-05-22 18:40' },
  { id: '4', activity: 'Purchased Developer Promo Pack', type: 'purchase', credits: 500, date: '2026-05-20 09:00' },
  { id: '5', activity: 'Generated Quiz: World War 1 History', type: 'generation', credits: -15, date: '2026-05-18 11:24' },
];

export default function CreditsPage() {
  const [logs, setLogs] = useState<CreditLog[]>(INITIAL_LOGS);
  const [totalCredits, setTotalCredits] = useState(720);
  const limit = 1000;
  const percentUsed = Math.round((totalCredits / limit) * 100);

  return (
    <div className="monorepo-container animate-fade-in" style={{ display: 'flex', minHeight: '97vh', gap: '12px' }}>
      <Sidebar activeTab="credits" />

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Header title="Credit Report" />

        {/* Header summary */}
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
                Billing & AI Usage limits
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Review credits allocated to your institution, verify real-time consumption history and purchase additional allowances
              </span>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
          
          {/* Usage Chart widget (Unique Gauge Layout) */}
          <div style={{
            flex: '1.2',
            minWidth: '320px',
            background: 'var(--color-bg-white)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px'
          }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coins size={20} color="var(--color-orange)" />
                Usage Breakdown
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Track your active credits usage compared to your institutional cap limit.
              </p>
            </div>

            {/* Circular Gauge and Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              {/* SVG Ring */}
              <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                <svg width="120" height="120" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F2F2F2"
                    strokeWidth="3.2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--color-orange)"
                    strokeWidth="3.2"
                    strokeDasharray={`${percentUsed}, 100`}
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-bricolage)' }}>
                    {percentUsed}%
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ALLOCATED</span>
                </div>
              </div>

              {/* Data list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Remaining Balance:</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>{totalCredits} Credits</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Monthly Cap:</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>{limit} Credits</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Resetting In:</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}>14 Days</span>
                </div>
              </div>
            </div>

            {/* Warning Message if credits are running low */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              background: 'rgba(229, 104, 32, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(229, 104, 32, 0.1)',
              fontSize: '13px',
              color: 'var(--color-orange)'
            }}>
              <AlertCircle size={16} />
              <span>You have ample credits for typical class generation runs.</span>
            </div>
          </div>

          {/* Pricing Upgrade Card (Premium Options) */}
          <div style={{
            flex: '1',
            minWidth: '280px',
            background: 'var(--color-bg-white)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-orange)', textTransform: 'uppercase' }}>Available Packages</span>
              <h3 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', marginTop: '2px' }}>
                Purchase Top-Ups
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--color-bg-off-white)', borderRadius: '10px', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, display: 'block' }}>Standard Top-Up</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>+200 Credits</span>
                </div>
                <button
                  onClick={() => {
                    setTotalCredits(totalCredits + 200);
                    setLogs([{ id: Date.now().toString(), activity: 'Purchased Standard Top-Up', type: 'purchase', credits: 200, date: 'Just now' }, ...logs]);
                  }}
                  style={{
                    background: 'var(--color-dark)',
                    color: '#FFF',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  $19.99
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--color-bg-off-white)', borderRadius: '10px', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, display: 'block' }}>Pro Top-Up</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>+600 Credits</span>
                </div>
                <button
                  onClick={() => {
                    setTotalCredits(totalCredits + 600);
                    setLogs([{ id: Date.now().toString(), activity: 'Purchased Pro Top-Up', type: 'purchase', credits: 600, date: 'Just now' }, ...logs]);
                  }}
                  style={{
                    background: 'var(--color-dark)',
                    color: '#FFF',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  $49.99
                </button>
              </div>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              Billed securely to school account ending in 4920
            </p>
          </div>

        </div>

        {/* Transaction History log list */}
        <section style={{
          background: 'var(--color-bg-white)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>
            Usage & Transaction History
          </h3>

          <div style={{ overflowX: 'auto', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-off-white)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Activity Description</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Usage Type</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Date & Time</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Credits Impact</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{log.activity}</td>
                    <td style={{ padding: '12px 16px', textTransform: 'capitalize', color: 'var(--color-text-secondary)' }}>{log.type}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>{log.date}</td>
                    <td style={{
                      padding: '12px 16px',
                      fontWeight: 700,
                      color: log.credits > 0 ? 'var(--color-success)' : 'var(--color-orange)'
                    }}>
                      {log.credits > 0 ? `+${log.credits}` : log.credits}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
