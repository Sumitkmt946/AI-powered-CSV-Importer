'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ApiCenter() {
  const [health, setHealth] = useState<{ status: string; gemini_key_set: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/health', { timeout: 3000 })
      .then(r => setHealth(r.data))
      .catch(() => setHealth(null))
      .finally(() => setLoading(false));
  }, []);

  const apis = [
    { method: 'POST', path: '/api/upload', desc: 'Upload a CSV file for AI processing', body: 'multipart/form-data — field: file (.csv)' },
    { method: 'GET',  path: '/api/health', desc: 'Check if backend is running',         body: 'No body required' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">API Center</h1>
          <p className="page-subtitle">Backend API status and endpoint documentation.</p>
        </div>
      </div>

      {/* Backend Status */}
      <div className="results-section" style={{ marginBottom: '24px' }}>
        <div className="tab-bar"><span className="tab-btn active">🖥️ Backend Status</span></div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#555', minWidth: '140px' }}>Backend URL:</span>
            <code style={{ background: '#f5f6fa', padding: '4px 12px', borderRadius: '6px', fontSize: '13px', color: '#333' }}>http://localhost:5000</code>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#555', minWidth: '140px' }}>Status:</span>
            {loading ? (
              <span className="badge badge-gray">Checking…</span>
            ) : health ? (
              <span className="badge badge-green">✅ Online</span>
            ) : (
              <span className="badge badge-red">❌ Offline — run: node server.js</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#555', minWidth: '140px' }}>Gemini API Key:</span>
            {loading ? (
              <span className="badge badge-gray">Checking…</span>
            ) : health?.gemini_key_set ? (
              <span className="badge badge-green">✅ Set</span>
            ) : (
              <span className="badge badge-red">❌ Not set — add to backend/.env</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#555', minWidth: '140px' }}>AI Model:</span>
            <code style={{ background: '#f5f6fa', padding: '4px 12px', borderRadius: '6px', fontSize: '13px', color: '#f97316' }}>gemini-1.5-flash-latest</code>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="results-section" style={{ marginBottom: '24px' }}>
        <div className="tab-bar"><span className="tab-btn active">🔌 API Endpoints</span></div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {apis.map((api) => (
            <div key={api.path} style={{ border: '1px solid #e8eaf0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#fafbfc', borderBottom: '1px solid #f0f1f5' }}>
                <span className={`badge ${api.method === 'POST' ? 'badge-blue' : 'badge-green'}`}>{api.method}</span>
                <code style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: '#333' }}>{api.path}</code>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p style={{ fontSize: '14px', color: '#444' }}>{api.desc}</p>
                <p style={{ fontSize: '12px', color: '#888' }}>Body: <code style={{ background: '#f5f6fa', padding: '2px 6px', borderRadius: '4px' }}>{api.body}</code></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="results-section">
        <div className="tab-bar"><span className="tab-btn active">⚙️ Tech Stack</span></div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {[
            { icon: '⚛️', name: 'Next.js 15', role: 'Frontend' },
            { icon: '🟩', name: 'Node.js', role: 'Backend Runtime' },
            { icon: '🚂', name: 'Express.js', role: 'API Server' },
            { icon: '🤖', name: 'Gemini 1.5', role: 'AI Model' },
            { icon: '📄', name: 'csv-parser', role: 'CSV Parsing' },
            { icon: '📦', name: 'multer', role: 'File Upload' },
          ].map((t) => (
            <div key={t.name} style={{ padding: '16px', border: '1px solid #e8eaf0', borderRadius: '10px', textAlign: 'center', background: '#fafbfc' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{t.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#222' }}>{t.name}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
