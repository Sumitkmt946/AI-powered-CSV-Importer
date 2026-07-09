'use client';
import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import LeadsTable from '@/components/LeadsTable';

export default function ManageLeads() {
  const { importResult, setShowImportModal } = useAppContext();
  const [activeTab, setActiveTab] = useState<'imported' | 'skipped'>('imported');

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ fontSize: '24px', fontWeight: 700, color: '#111' }}>Manage Your Leads</h1>
          <p className="page-subtitle" style={{ color: '#666' }}>Monitor lead status, assign tasks, and close deals faster.</p>
        </div>
        {/* Placeholder for header actions if needed, like the search bar in the screenshot, though for this assignment we focus on the import output */}
      </div>

      {importResult ? (
        <>
          <div className="stats-row">
            <div className="stat-pill green">✅ {importResult.imported_count} Imported</div>
            <div className="stat-pill red">⚠️ {importResult.skipped_count} Skipped</div>
            <div className="stat-pill blue">📋 {importResult.total} Total</div>
          </div>

          <div className="results-section">
            <div className="tab-bar">
              <button className={`tab-btn ${activeTab === 'imported' ? 'active' : ''}`} onClick={() => setActiveTab('imported')}>
                ✅ Imported Leads ({importResult.imported_count})
              </button>
              <button className={`tab-btn ${activeTab === 'skipped' ? 'active' : ''}`} onClick={() => setActiveTab('skipped')}>
                ⚠️ Skipped ({importResult.skipped_count})
              </button>
              <button className="btn-outline-sm" onClick={() => setShowImportModal(true)}>+ Import Another</button>
            </div>
            {activeTab === 'imported' && <LeadsTable rows={importResult.imported} type="imported" />}
            {activeTab === 'skipped'  && <LeadsTable rows={importResult.skipped}  type="skipped"  />}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No leads yet</h3>
          <p>Import a CSV file to see your leads here.</p>
          <button className="btn-orange" onClick={() => setShowImportModal(true)}>Import CSV</button>
        </div>
      )}
    </>
  );
}
