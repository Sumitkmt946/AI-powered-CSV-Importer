'use client';

const crmFields = [
  { field: 'created_at',                   description: 'Lead creation date',              example: '2026-05-13 14:20:48', required: false },
  { field: 'name',                          description: 'Full name of the lead',           example: 'John Doe',            required: false },
  { field: 'email',                         description: 'Primary email address',           example: 'john@example.com',    required: true  },
  { field: 'country_code',                  description: 'Country dialing code',            example: '+91',                 required: false },
  { field: 'mobile_without_country_code',   description: 'Mobile number (no country code)', example: '9876543210',          required: true  },
  { field: 'company',                       description: 'Company or organization name',    example: 'GrowEasy',            required: false },
  { field: 'city',                          description: 'City name',                       example: 'Mumbai',              required: false },
  { field: 'state',                         description: 'State or province',               example: 'Maharashtra',         required: false },
  { field: 'country',                       description: 'Country name',                    example: 'India',               required: false },
  { field: 'lead_owner',                    description: 'Person responsible for lead',     example: 'test@gmail.com',      required: false },
  { field: 'crm_status',                    description: 'Lead status (AI-mapped)',         example: 'GOOD_LEAD_FOLLOW_UP', required: false },
  { field: 'crm_note',                      description: 'Notes, remarks, extra info',      example: 'Wants to reschedule', required: false },
  { field: 'data_source',                   description: 'Source of the lead',              example: 'sarjapur_plots',      required: false },
  { field: 'possession_time',               description: 'Property possession time',        example: '6 months',            required: false },
  { field: 'description',                   description: 'Additional description',          example: 'Interested in 2BHK',  required: false },
];

const allowedStatus = [
  { value: 'GOOD_LEAD_FOLLOW_UP', color: '#059669', bg: '#ecfdf5', desc: 'Interested, warm lead, follow up needed' },
  { value: 'DID_NOT_CONNECT',     color: '#d97706', bg: '#fffbeb', desc: 'No response, missed call, busy' },
  { value: 'BAD_LEAD',            color: '#dc2626', bg: '#fef2f2', desc: 'Not interested, wrong number, junk' },
  { value: 'SALE_DONE',           color: '#2563eb', bg: '#eff6ff', desc: 'Deal closed, sale completed' },
];

const allowedSources = ['leads_on_demand','meridian_tower','eden_park','varah_swamy','sarjapur_plots'];

export default function CrmFields() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">CRM Fields</h1>
          <p className="page-subtitle">All fields the AI extracts and maps from your CSV file.</p>
        </div>
      </div>

      {/* Fields Table */}
      <div className="results-section" style={{ marginBottom: '24px' }}>
        <div className="tab-bar"><span className="tab-btn active">📋 Field Definitions</span></div>
        <div className="leads-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>FIELD NAME</th>
                <th>DESCRIPTION</th>
                <th>EXAMPLE VALUE</th>
                <th>REQUIRED</th>
              </tr>
            </thead>
            <tbody>
              {crmFields.map((f) => (
                <tr key={f.field}>
                  <td><code style={{ background: '#f5f6fa', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', color: '#f97316' }}>{f.field}</code></td>
                  <td style={{ color: '#555' }}>{f.description}</td>
                  <td style={{ color: '#888', fontStyle: 'italic', fontSize: '12px' }}>{f.example}</td>
                  <td>
                    {f.required
                      ? <span className="badge badge-red">⚡ At least one</span>
                      : <span className="badge badge-gray">Optional</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allowed Status Values */}
      <div className="results-section" style={{ marginBottom: '24px' }}>
        <div className="tab-bar"><span className="tab-btn active">🏷️ Allowed CRM Status Values</span></div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {allowedStatus.map((s) => (
            <div key={s.value} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 14px', borderRadius: '8px', background: s.bg, border: `1px solid ${s.color}22` }}>
              <code style={{ fontFamily: 'monospace', fontWeight: 700, color: s.color, fontSize: '13px' }}>{s.value}</code>
              <span style={{ fontSize: '13px', color: '#555' }}>— {s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Allowed Data Sources */}
      <div className="results-section">
        <div className="tab-bar"><span className="tab-btn active">🔗 Allowed Data Source Values</span></div>
        <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {allowedSources.map((s) => (
            <span key={s} style={{ background: '#f5f6fa', border: '1px solid #e0e0e0', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontFamily: 'monospace', color: '#555', fontWeight: 600 }}>{s}</span>
          ))}
          <span style={{ padding: '8px 16px', fontSize: '13px', color: '#aaa', fontStyle: 'italic', alignSelf: 'center' }}>— or leave blank if unsure</span>
        </div>
      </div>
    </>
  );
}
