import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChangePassword from './pages/auth/ChangePassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageStores from './pages/admin/ManageStores';

import UserDashboard from './pages/user/UserDashboard';
import StoreDetail from './pages/user/StoreDetail';

import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerStoreDetail from './pages/owner/OwnerStoreDetail';

import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
            
            <Route path="change-password" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STORE_OWNER', 'NORMAL_USER']}>
                <ChangePassword />
              </ProtectedRoute>
            } />
          </Route>

          {/* Normal User routes */}
          <Route path="/user" element={
            <ProtectedRoute allowedRoles={['NORMAL_USER']}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="stores/:id" element={<StoreDetail />} />
          </Route>


          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="stores" element={<ManageStores />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* Store Owner routes */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="stores/:id" element={<OwnerStoreDetail />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
