'use client';
import type { CrmRecord } from '@/contexts/AppContext';

const STATUS_COLORS: Record<string, string> = {
  GOOD_LEAD_FOLLOW_UP: 'badge-green',
  SALE_DONE: 'badge-blue',
  DID_NOT_CONNECT: 'badge-yellow',
  BAD_LEAD: 'badge-red',
};

const STATUS_LABELS: Record<string, string> = {
  GOOD_LEAD_FOLLOW_UP: 'Good Lead',
  SALE_DONE: 'Sale Done',
  DID_NOT_CONNECT: 'Not Dialled',
  BAD_LEAD: 'Bad Lead',
};

interface Props {
  rows: CrmRecord[];
  type: 'imported' | 'skipped';
}

export default function LeadsTable({ rows, type }: Props) {
  if (!rows.length) {
    return <p style={{ color: '#888', padding: '32px', textAlign: 'center' }}>No records to show.</p>;
  }

  if (type === 'imported') {
    return (
      <div className="leads-table-wrap" style={{ border: 'none', background: 'transparent' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#111' }}>Your Leads</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Enter email or phone number..." style={{ padding: '8px 12px', paddingRight: '40px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', width: '280px', outline: 'none' }} />
              <button style={{ position: 'absolute', right: 0, top: 0, bottom: 0, background: '#1e40af', color: 'white', border: 'none', borderRadius: '0 6px 6px 0', padding: '0 12px', cursor: 'pointer' }}>🔍</button>
            </div>
            <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>↻</button>
          </div>
        </div>
        <table className="crm-table leads-view" style={{ border: '1px solid #f1f5f9', borderRadius: '8px', borderCollapse: 'collapse', width: '100%' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>LEAD NAME</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EMAIL</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CONTACT</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DATE CREATED</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>COMPANY</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>STATUS</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>QUALITY</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>LEAD...</th>
              <th style={{ padding: '16px', fontSize: '11px', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: 'white' }}>
                <td className="td-name" style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>{row.name || '—'}</td>
                <td className="td-email" style={{ padding: '16px', fontSize: '13px', color: '#475569' }} title={row.email}>{row.email || '—'}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: '#475569' }}>
                  {row.country_code && row.mobile_without_country_code
                    ? `${row.country_code}${row.mobile_without_country_code}`
                    : row.mobile_without_country_code || '—'}
                </td>
                <td style={{ whiteSpace: 'nowrap', fontSize: '12px', color: '#64748b', padding: '16px' }}>
                  {row.created_at ? new Date(row.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : '—'}
                </td>
                <td style={{ padding: '16px', fontSize: '13px', color: '#475569' }}>{row.company || '—'}</td>
                <td style={{ padding: '16px' }}>
                  {row.crm_status ? (
                    <span className={`badge ${STATUS_COLORS[row.crm_status] ?? 'badge-gray'}`} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {STATUS_LABELS[row.crm_status] ?? row.crm_status}
                    </span>
                  ) : '—'}
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>—</span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>A</span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>More &gt;</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Skipped table
  const keys = Object.keys(rows[0]).filter(k => k !== 'skip_reason');
  return (
    <div className="leads-table-wrap">
      <table className="crm-table leads-view">
        <thead>
          <tr>
            {keys.map(k => <th key={k}>{k}</th>)}
            <th>REASON SKIPPED</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: '#fff8f8' }}>
              {keys.map(k => <td key={k} title={String(row[k as keyof CrmRecord] ?? '')}>{String(row[k as keyof CrmRecord] ?? '—')}</td>)}
              <td><span className="badge badge-red">{row.skip_reason || 'Skipped'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
