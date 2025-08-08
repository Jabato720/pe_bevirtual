import React, { useState } from 'react';
import { Search, Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';

const BracketHeader = ({ 
  title = "Plan Financiero", 
  subtitle = "Dashboard Profesional",
  onMenuToggle,
  user 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, message: "Proyección actualizada correctamente", time: "2 min", read: false },
    { id: 2, message: "Nuevo KPI disponible", time: "5 min", read: false },
    { id: 3, message: "Cálculo completado", time: "10 min", read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="br-header">
      {/* Left Section */}
      <div className="d-flex align-items-center">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="br-btn bg-transparent border-0 d-md-none me-3"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title Section */}
        <div>
          <div className="br-header-title">{title}</div>
          <div className="br-header-subtitle">{subtitle}</div>
        </div>
      </div>

      {/* Right Section */}
      <div className="d-flex align-items-center gap-3">
        {/* Search */}
        <div className="d-none d-md-flex" style={{ position: 'relative' }}>
          <div className="input-group" style={{ width: '300px' }}>
            <input
              type="text"
              className="br-form-control"
              placeholder="Buscar en el dashboard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="br-btn br-btn-outline" type="button">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="br-btn bg-transparent border-0 position-relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span 
                className="position-absolute bg-danger rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  top: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div 
              className="position-absolute bg-white rounded shadow"
              style={{
                top: '100%',
                right: '0',
                width: '300px',
                marginTop: '0.5rem',
                border: '1px solid var(--sidebar-border)',
                zIndex: 1000
              }}
            >
              <div className="pd-15 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mg-b-0 tx-bold">Notificaciones</h6>
                  <span className="tx-11 tx-muted">{unreadCount} nuevas</span>
                </div>
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`pd-15 border-bottom ${!notification.read ? 'bg-light-primary' : ''}`}
                  >
                    <div className="d-flex">
                      {!notification.read && (
                        <div 
                          className="bg-primary rounded-circle"
                          style={{ width: '8px', height: '8px', marginTop: '6px', marginRight: '8px' }}
                        />
                      )}
                      <div className="flex-1">
                        <p className="mg-b-5 tx-13">{notification.message}</p>
                        <span className="tx-11 tx-muted">Hace {notification.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pd-15 text-center border-top">
                <button 
                  className="br-btn br-btn-outline tx-11"
                  onClick={() => setShowNotifications(false)}
                >
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="br-btn bg-transparent border-0 d-flex align-items-center gap-2"
          >
            <div className="d-none d-md-block text-end">
              <div className="tx-12 tx-bold">{user?.name || 'Usuario'}</div>
              <div className="tx-11 tx-muted">{user?.email || 'usuario@email.com'}</div>
            </div>
            <div 
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px', color: 'white' }}
            >
              <User className="w-4 h-4" />
            </div>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div 
              className="position-absolute bg-white rounded shadow"
              style={{
                top: '100%',
                right: '0',
                width: '200px',
                marginTop: '0.5rem',
                border: '1px solid var(--sidebar-border)',
                zIndex: 1000
              }}
            >
              <div className="pd-15 border-bottom">
                <div className="tx-13 tx-bold">{user?.name || 'Usuario'}</div>
                <div className="tx-11 tx-muted">{user?.company_name || 'Empresa'}</div>
              </div>
              
              <div className="py-2">
                <button className="br-btn bg-transparent border-0 w-100 text-start pd-10 d-flex align-items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="tx-12">Mi Perfil</span>
                </button>
                <button className="br-btn bg-transparent border-0 w-100 text-start pd-10 d-flex align-items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="tx-12">Configuración</span>
                </button>
                <hr className="my-2" />
                <button className="br-btn bg-transparent border-0 w-100 text-start pd-10 d-flex align-items-center gap-2 tx-danger">
                  <LogOut className="w-4 h-4" />
                  <span className="tx-12">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default BracketHeader;