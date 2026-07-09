'use client';
import { useAppContext } from '@/contexts/AppContext';

export default function Dashboard() {
  const { importResult, setShowImportModal } = useAppContext();

  const totalImported = importResult?.imported_count ?? 0;
  const totalSkipped = importResult?.skipped_count ?? 0;
  const totalRows = importResult?.total ?? 0;

  const statusCounts: Record<string, number> = {};
  importResult?.imported.forEach((r: any) => {
    const s = r.crm_status || 'Unknown';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
    GOOD_LEAD_FOLLOW_UP: { label: 'Good Lead / Follow Up', color: '#059669', bg: '#ecfdf5' },
    DID_NOT_CONNECT:     { label: 'Did Not Connect',       color: '#d97706', bg: '#fffbeb' },
    BAD_LEAD:            { label: 'Bad Lead',              color: '#dc2626', bg: '#fef2f2' },
    SALE_DONE:           { label: 'Sale Done',             color: '#2563eb', bg: '#eff6ff' },
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your CSV import activity.</p>
        </div>
        <button className="btn-orange" onClick={() => setShowImportModal(true)}>+ Import CSV</button>
      </div>

      {/* Stats */}
      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-top">
            <span className="dash-lbl">Total Imported</span>
            <div className="dash-icon-sm" style={{ background: '#ecfdf5', color: '#059669' }}>✅</div>
          </div>
          <div className="dash-num">{totalImported}</div>
          <div className="dash-subtext">Leads mapped successfully</div>
        </div>
        
        <div className="dash-card">
          <div className="dash-card-top">
            <span className="dash-lbl">Total Skipped</span>
            <div className="dash-icon-sm" style={{ background: '#fef2f2', color: '#dc2626' }}>⚠️</div>
          </div>
          <div className="dash-num">{totalSkipped}</div>
          <div className="dash-subtext">Missing email/mobile</div>
        </div>
        
        <div className="dash-card">
          <div className="dash-card-top">
            <span className="dash-lbl">Rows Processed</span>
            <div className="dash-icon-sm" style={{ background: '#eff6ff', color: '#2563eb' }}>📋</div>
          </div>
          <div className="dash-num">{totalRows}</div>
          <div className="dash-subtext">Total lines from CSV</div>
        </div>
        
        <div className="dash-card">
          <div className="dash-card-top">
            <span className="dash-lbl">Success Rate</span>
            <div className="dash-icon-sm" style={{ background: '#fff4ee', color: '#f97316' }}>🚀</div>
          </div>
          <div className="dash-num">{totalRows > 0 ? Math.round((totalImported / totalRows) * 100) : 0}%</div>
          <div className="dash-subtext">AI accuracy score</div>
        </div>
      </div>

      {/* Status Breakdown */}
      {totalRows > 0 && (
        <div className="results-section" style={{ marginTop: '24px' }}>
          <div className="tab-bar">
            <span className="tab-btn active">Lead Status Breakdown</span>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {totalImported === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                <h3 style={{ fontSize: '16px', color: '#334155', marginBottom: '8px' }}>No Successful Imports</h3>
                <p style={{ fontSize: '14px', color: '#64748b' }}>All processed rows were skipped. Please check the 'Skipped' tab in Manage Leads for reasons.</p>
              </div>
            ) : (
              Object.entries(statusMeta).map(([key, meta]) => {
                const count = statusCounts[key] || 0;
                const pct = totalImported > 0 ? Math.round((count / totalImported) * 100) : 0;
                return (
                  <div key={key} className="status-row">
                    <div className="status-row-label">
                      <span className="badge" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                      <span style={{ fontSize: '13px', color: '#888' }}>{count} leads</span>
                    </div>
                    <div className="status-bar-bg">
                      <div className="status-bar-fill" style={{ width: `${pct}%`, background: meta.color }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#555', width: '36px', textAlign: 'right' }}>{pct}%</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {totalRows === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No data yet</h3>
          <p>Import a CSV file to see your dashboard stats.</p>
          <button className="btn-orange" onClick={() => setShowImportModal(true)}>Import CSV</button>
        </div>
      )}
    </>
  );
}
