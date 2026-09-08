import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import AppShell from './components/AppShell';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import LoginPage from './pages/LoginPage';
import CatalogPage from './pages/CatalogPage';
import InventoryPage from './pages/InventoryPage';
import MediaPage from './pages/MediaPage';
import PromotionsPage from './pages/PromotionsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const { authed, logout, settings, resetAll, setConfirmState } = useStore();

  if (!authed) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const onReset = () =>
    setConfirmState({
      open: true,
      title: 'Reset demo data?',
      message: 'Discards every change and restores the original sample store.',
      confirmLabel: 'Reset',
      onConfirm: () => {
        resetAll();
        setConfirmState({ open: false });
      },
    });

  return (
    <>
      <AppShell storeName={settings.storeName} onReset={onReset} onLogout={logout}>
        <Routes>
          <Route path="/" element={<Navigate to="/catalog" replace />} />
          <Route path="/login" element={<Navigate to="/catalog" replace />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/catalog" replace />} />
        </Routes>
      </AppShell>
      <Toast />
      <ConfirmDialog />
    </>
  );
}
