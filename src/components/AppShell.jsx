import { NavLink } from 'react-router-dom';
import Icon from './Icon';

const EMAIL = 'santhosh.m@provassure.com';
const initials = (e) => (e ? e.slice(0, 2).toUpperCase() : 'NG');

const NAV = [
  { key: 'catalog', label: 'Catalog', icon: 'catalog' },
  { key: 'inventory', label: 'Inventory', icon: 'inventory' },
  { key: 'media', label: 'Media', icon: 'media' },
  { key: 'promotions', label: 'Promotions', icon: 'percent' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

export default function AppShell({ storeName, onReset, onLogout, children }) {
  return (
    <div className="shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="logo" size={20} />
          </span>
          <span className="brand-name">ProductHub</span>
        </div>
        <div className="header-right">
          <span className="store-chip">
            <Icon name="chevronRight" size={13} />
            {storeName}
          </span>
          {onReset && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
              Reset data
            </button>
          )}
          {onLogout && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onLogout}>
              Log out
            </button>
          )}
          <span className="env-pill">Admin</span>
          <span className="user-chip" title={EMAIL}>
            {initials(EMAIL)}
          </span>
        </div>
      </header>

      <div className="shell-body">
        <nav className="sidenav">
          {NAV.map((n) => (
            <NavLink
              key={n.key}
              to={`/${n.key}`}
              className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
            >
              <span className="nav-item-icon">
                <Icon name={n.icon} size={17} />
              </span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <main className="shell-main">
          {children}
        </main>
      </div>
    </div>
  );
}
