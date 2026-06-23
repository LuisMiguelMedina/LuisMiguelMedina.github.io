import { useState, type MouseEvent } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import { menuItemsForLevel, levelName, levelColor } from './permissions';
import { PORTAL_BASE } from './constants';
import './Layout.scss';

export function Layout() {
  const navigate = useNavigate();
  const { session, level, logout } = useAuth();

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = menuItemsForLevel(level);

  const toggleSidebar = (): void => setSidebarOpen((v) => !v);
  const closeSidebar = (): void => setSidebarOpen(false);

  // Close sidebar on nav click (mobile only)
  const onNavClick = (event: MouseEvent<HTMLElement>): void => {
    const target = event.target as HTMLElement;
    if (target.closest('.nav-link') && window.innerWidth < 768) {
      closeSidebar();
    }
  };

  const handleLogout = (): void => {
    logout();
    navigate(`${PORTAL_BASE}/login`);
  };

  return (
    <div id="wrapper" className="matrix-dashboard" onClick={onNavClick}>
      {/* Mobile Toggle Button */}
      <button
        className={`mobile-menu-toggle${sidebarOpen ? ' active' : ''}`}
        onClick={toggleSidebar}
      >
        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`} />
      </button>

      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' active' : ''}`}
        onClick={closeSidebar}
      />

      {/* Matrix Sidebar */}
      <nav
        className={`navbar align-items-start p-0 sidebar matrix-sidebar accordion navbar-dark${sidebarOpen ? ' open' : ''}`}
      >
        <div className="container-fluid d-flex flex-column p-0">
          {/* Brand Logo */}
          <a
            className="navbar-brand d-flex justify-content-center align-items-center m-0 sidebar-brand"
            href="#"
          >
            <div className="sidebar-brand-icon rotate-n-15">
              <i className="fas fa-shield-alt" />
            </div>
            <div className="mx-3 sidebar-brand-text">
              <span>ZRK Intranet</span>
            </div>
          </a>
          <hr className="my-0 sidebar-divider" />

          {/* Admin Level Badge */}
          {session && (
            <div className="admin-level-badge">
              <span
                className={`level-indicator level-${level}`}
                style={{ color: levelColor(level) }}
              >
                <i className="fas fa-shield-alt level-icon" />
                LVL {level} - {levelName(level)}
              </span>
            </div>
          )}

          {/* Dynamic Navigation based on permissions */}
          <ul className="navbar-nav text-light" id="accordionSidebar">
            {menuItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? ' active' : ''}`
                  }
                  to={item.to}
                >
                  <i className={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}

            {/* Logout always visible */}
            <li className="nav-item mt-3">
              <a
                className="nav-link"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
                <i className="fas fa-sign-out-alt" />
                <span>Cerrar Sesión</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Content Wrapper */}
      <div
        className="d-flex flex-column"
        id="content-wrapper"
        style={{ background: 'var(--terminal-bg)' }}
      >
        <div id="content">
          {/* Page Content */}
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>

        {/* Matrix Footer */}
        <footer className="sticky-footer matrix-footer">
          <div className="container my-auto">
            <div className="text-center my-auto">
              <span>ZRK INTRANET v2.4.1 // © 2025 CIUDADELA ZAREK</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
