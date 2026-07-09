'use client';
import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import type { ImportResult } from '@/contexts/AppContext';

type Step = 1 | 2 | 3;

interface CsvRow { [key: string]: string; }

interface Props {
  onClose: () => void;
  onResult: (r: ImportResult) => void;
}

function parseCSV(text: string): { headers: string[]; rows: CsvRow[] } {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(line => {
    // Simple CSV split (handles basic quoted fields)
    const vals: string[] = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inQ = !inQ; }
      else if (c === ',' && !inQ) { vals.push(cur.trim()); cur = ''; }
      else cur += c;
    }
    vals.push(cur.trim());
    const obj: CsvRow = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
    return obj;
  });
  return { headers, rows };
}

export default function ImportModal({ onClose, onResult }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<CsvRow[]>([]);
  const [allRows, setAllRows] = useState<CsvRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.csv')) { setError('Please upload a valid .csv file'); return; }
    setError('');
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCSV(text);
      setHeaders(headers);
      setPreviewRows(rows.slice(0, 8));
      setAllRows(rows);
      setStep(2);
    };
    reader.readAsText(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleConfirm = async () => {
    if (!file) return;
    setStep(3); setLoading(true); setProgress(0); setError('');
    const interval = setInterval(() => {
      setProgress(p => (p < 85 ? p + Math.random() * 12 : p));
    }, 700);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const resp = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => onResult(resp.data), 500);
    } catch (err: any) {
      clearInterval(interval);
      setError(err?.response?.data?.error || 'Server error. Make sure backend is running and Gemini API key is set in backend/.env');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if ((e.target as HTMLElement).classList.contains('modal-backdrop')) onClose(); }}>
      <div className="modal-box">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Import Leads via CSV</h2>
            <p className="modal-sub">Upload a CSV file to bulk import leads into your system.</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* STEP 1 – Drop Zone */}
        {step === 1 && (
          <div className="modal-body">
            <div
              className={`dropzone-modal ${isDragging ? 'dragging' : ''}`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileRef.current?.click()}
            >
              <div className="dz-upload-icon">⬆</div>
              <p className="dz-main-text">Drop your CSV file here</p>
              <p className="dz-sub-text">or click to browse files</p>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
            <p className="dz-hint">
              Supported file: .csv (max 5MB) — Any column structure supported. AI will map fields automatically.
            </p>
            {error && <p className="error-msg">{error}</p>}
          </div>
        )}

        {/* STEP 2 – Preview */}
        {step === 2 && (
          <div className="modal-body no-pad">
            {/* File chip */}
            <div className="file-chip">
              <span className="file-icon">📄</span>
              <div>
                <div className="file-name">{file?.name}</div>
                <div className="file-size">{((file?.size || 0) / 1024).toFixed(1)} KB · {allRows.length} rows</div>
              </div>
              <button className="file-remove" onClick={() => { setFile(null); setStep(1); }}>✕</button>
            </div>

            {/* Preview table */}
            <div className="preview-table-wrap">
              <table className="crm-table">
                <thead>
                  <tr>
                    {headers.map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i}>
                      {headers.map(h => <td key={h}>{row[h]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {error && <p className="error-msg" style={{ padding: '0 20px 12px' }}>{error}</p>}
          </div>
        )}

        {/* STEP 3 – Processing */}
        {step === 3 && (
          <div className="modal-body center-body">
            <div className="ai-icon-spin">🤖</div>
            <h3 style={{ margin: '12px 0 4px', color: '#111' }}>AI is processing your data…</h3>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
              Gemini is intelligently mapping your columns to CRM fields.
            </p>
            <div className="prog-bg">
              <div className="prog-fill" style={{ width: `${progress}%` }} />
            </div>
            <p style={{ color: '#aaa', fontSize: '13px', marginTop: '8px' }}>{Math.round(progress)}%</p>
          </div>
        )}

        {/* Modal Footer */}
        {step !== 3 && (
          <div className="modal-footer">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            {step === 1 && (
              <button className="btn-orange" disabled style={{ opacity: 0.5 }}>Upload File</button>
            )}
            {step === 2 && (
              <button className="btn-orange" onClick={handleConfirm}>Upload File</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
