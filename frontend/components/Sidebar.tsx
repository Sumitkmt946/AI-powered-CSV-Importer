'use client';

const mainNav = [
  { icon: '🏠', label: 'Dashboard' },
  { icon: '📥', label: 'Import CSV', active: true },
  { icon: '👥', label: 'Manage Leads' },
];

const steps = [
  { num: '1', label: 'Upload CSV' },
  { num: '2', label: 'Preview Data' },
  { num: '3', label: 'Confirm Import' },
  { num: '4', label: 'View Results' },
];

const settings = [
  { icon: '🔗', label: 'CRM Fields' },
  { icon: '⚙️', label: 'API Center' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-box">
          <span className="logo-leaf">🌱</span>
          <div>
            <div className="logo-name">GrowEasy</div>
            <div className="logo-tagline">CRM Importer</div>
          </div>
        </div>
        <div className="user-chip">
          <div className="user-avatar">VK</div>
          <div>
            <div className="user-name">VK Test</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="sidebar-nav">
        <div className="nav-label">MAIN</div>
        {mainNav.map((item) => (
          <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        {/* Import Steps */}
        <div className="nav-label" style={{ marginTop: '16px' }}>IMPORT STEPS</div>
        <div className="steps-nav">
          {steps.map((s) => (
            <div key={s.num} className="step-nav-item">
              <div className="step-nav-num">{s.num}</div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="nav-label" style={{ marginTop: '16px' }}>SETTINGS</div>
        {settings.map((item) => (
          <div key={item.label} className="nav-item">
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* Empty footer to maintain layout spacing if needed, or can be removed completely */}
      </div>
    </aside>
  );
}
