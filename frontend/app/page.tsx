'use client';
import { useAppContext } from '@/contexts/AppContext';
import ImportModal from '@/components/ImportModal';
import LeadsTable from '@/components/LeadsTable';

export default function Home() {
  const { importResult, setImportResult, showImportModal, setShowImportModal } = useAppContext();

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Import CSV</h1>
          <p className="page-subtitle">Upload any CSV — AI will intelligently map columns to CRM fields.</p>
        </div>
        <button className="btn-orange" onClick={() => setShowImportModal(true)}>
          + Import CSV
        </button>
      </div>

      {importResult ? (
        <>
          <div className="stats-row">
            <div className="stat-pill green">✅ {importResult.imported_count} Imported</div>
            <div className="stat-pill red">⚠️ {importResult.skipped_count} Skipped</div>
            <div className="stat-pill blue">📋 {importResult.total} Total Rows</div>
          </div>
          <div className="results-section">
            <div className="tab-bar">
              <span className="tab-btn active">Your Leads ({importResult.imported_count})</span>
              <button className="btn-outline-sm" onClick={() => { setImportResult(null); setShowImportModal(true); }}>
                + Import Another CSV
              </button>
            </div>
            <LeadsTable rows={importResult.imported} type="imported" />
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📥</div>
          <h3>No leads imported yet</h3>
          <p>Upload a CSV file — our AI will map any column structure to CRM fields.</p>
          <button className="btn-orange" onClick={() => setShowImportModal(true)}>
            Import Leads via CSV
          </button>
        </div>
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onResult={(r) => { setImportResult(r); setShowImportModal(false); }}
        />
      )}
    </>
  );
}
