import React, { useState } from 'react';
import axios from 'axios';

interface CsvRecord {
  [key: string]: string;
}

const UploadWizard: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<CsvRecord[]>([]);
  const [result, setResult] = useState<{ imported: any[]; skipped: any[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    setFile(dropped);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const parsePreview = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').filter((r) => r.trim() !== '');
      const headers = rows[0].split(',');
      const data = rows.slice(1, 6).map((row) => {
        const values = row.split(',');
        const obj: CsvRecord = {};
        headers.forEach((h, i) => {
          obj[h.trim()] = values[i]?.trim() || '';
        });
        return obj;
      });
      setPreviewData(data);
      setStep(2);
    };
    reader.readAsText(file);
  };

  const handleConfirm = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const resp = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(resp.data);
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="upload-step">
            <h2>Upload CSV</h2>
            <div
              className="dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              Drag & drop CSV here or <input type="file" accept=".csv" onChange={handleFileChange} />
            </div>
            {file && (
              <button className="btn-primary" onClick={parsePreview}>
                Preview ({file.name})
              </button>
            )}
          </div>
        );
      case 2:
        return (
          <div className="preview-step">
            <h2>Data Preview (first 5 rows)</h2>
            <table className="preview-table">
              <thead>
                <tr>
                  {previewData[0] && Object.keys(previewData[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => (
                      <td key={i}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn-secondary" onClick={() => setStep(1)}>
              Change File
            </button>
            <button className="btn-primary" onClick={handleConfirm} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Import'}
            </button>
          </div>
        );
      case 4:
        return (
          <div className="result-step">
            <h2>Import Result</h2>
            {result && (
              <div>
                <p>Imported records: {result.imported.length}</p>
                <p>Skipped records: {result.skipped.length}</p>
              </div>
            )}
            <button className="btn-primary" onClick={() => setStep(1)}>
              Upload Another CSV
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="wizard-container">{renderStep()}</div>;
};

export default UploadWizard;
