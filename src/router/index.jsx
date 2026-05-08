import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import QueuePage from '../pages/queue/QueuePage';
import CustomersPage from '../pages/customers/CustomersPage';
import CustomerDetailPage from '../pages/customers/CustomerDetailPage';
import CarsPage from '../pages/cars/CarsPage';
import CarDetailPage from '../pages/cars/CarDetailPage';
import ServicesPage from '../pages/services/ServicesPage';
import PaymentsPage from '../pages/payments/PaymentsPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import ReportsPage from '../pages/reports/ReportsPage';
import TopCustomersPage from '../pages/reports/TopCustomersPage';
import ExpensesPage from '../pages/expenses/ExpensesPage';
import StaffPage from '../pages/staff/StaffPage';
import StaffFinancesPage from '../pages/staff/StaffFinancesPage';
import SettingsPage from '../pages/settings/SettingsPage';


import AppLayout from '../components/layout/AppLayout';

const ProtectedRoute = ({ children, roles }) => {
  const { session, profile, loading } = useAuth();

  if (loading) return null;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (roles && profile && !roles.includes(profile.role)) {
    if (profile.role === 'staff') {
      return <Navigate to="/queue" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute roles={['admin', 'manager', 'secretary']}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'staff/finances',
        element: (
          <ProtectedRoute roles={['admin', 'secretary']}>
            <StaffFinancesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'queue',
        element: <QueuePage />,
      },
      {
        path: 'customers',
        element: <CustomersPage />,
      },
      {
        path: 'customers/:id',
        element: <CustomerDetailPage />,
      },
      {
        path: 'cars',
        element: <CarsPage />,
      },
      {
        path: 'cars/:id',
        element: <CarDetailPage />,
      },
      {
        path: 'services',
        element: (
          <ProtectedRoute roles={['admin', 'manager', 'secretary']}>
            <ServicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports/top-customers',
        element: (
          <ProtectedRoute roles={['admin', 'manager']}>
            <TopCustomersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'payments',
        element: <PaymentsPage />,
      },
      {
        path: 'expenses',
        element: (
          <ProtectedRoute roles={['admin', 'manager']}>
            <ExpensesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'inventory',
        element: (
          <ProtectedRoute roles={['admin', 'manager', 'secretary']}>
            <InventoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute roles={['admin', 'manager']}>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'staff',
        element: (
          <ProtectedRoute roles={['admin', 'secretary']}>
            <StaffPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute roles={['admin']}>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const AppRouter = () => {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
};

export default AppRouter;
