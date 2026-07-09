'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';

const mainNav = [
  { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
  { icon: '📥', label: 'Import CSV', href: '/' },
  { icon: '👥', label: 'Manage Leads', href: '/manage-leads' },
];

const importSteps = [
  { num: '1', label: 'Upload CSV', href: '/?step=1' },
  { num: '2', label: 'Preview Data', href: '/?step=2' },
  { num: '3', label: 'Confirm Import', href: '/?step=3' },
  { num: '4', label: 'View Results', href: '/manage-leads' },
];

const settingsNav = [
  { icon: '📋', label: 'CRM Fields', href: '/crm-fields' },
  { icon: '⚙️', label: 'API Center', href: '/api-center' },
];

export default function SidebarWrapper() {
  const pathname = usePathname();
  const { setShowImportModal, importResult } = useAppContext();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

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
          <div className="user-avatar">SD</div>
          <div>
            <div className="user-name">Sumit Demo</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
      </div>

      {/* MAIN nav */}
      <nav className="sidebar-nav">
        <div className="nav-label">MAIN</div>
        {mainNav.map((item) => (
          <Link key={item.href} href={item.href} className={`nav-item ${isActive(item.href) ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        {/* IMPORT STEPS */}
        <div className="nav-label" style={{ marginTop: '16px' }}>IMPORT STEPS</div>
        <div className="steps-nav">
          {importSteps.map((s) => (
            <Link key={s.num} href={s.href} className="step-nav-item">
              <div className={`step-nav-num ${s.num === '4' && importResult ? 'step-done' : ''}`}>
                {s.num === '4' && importResult ? '✓' : s.num}
              </div>
              <span>{s.label}</span>
            </Link>
          ))}
        </div>

        {/* SETTINGS */}
        <div className="nav-label" style={{ marginTop: '16px' }}>SETTINGS</div>
        {settingsNav.map((item) => (
          <Link key={item.href} href={item.href} className={`nav-item ${isActive(item.href) ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* Empty footer to maintain layout spacing if needed, or can be removed completely */}
      </div>
    </aside>
  );
}
