import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import OnboardingPage from '../pages/onboarding/OnboardingPage';
import HomePage from '../pages/home/HomePage';
import LikesPage from '../pages/likes/LikesPage';
import MessagesPage from '../pages/messages/MessagesPage';
import ProfilePage from '../pages/profile/ProfilePage';
import EditProfilePage from '../pages/profile/EditProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ChatPage from '../pages/chat/ChatPage';
import AppLayout from '../components/layout/AppLayout';

const ProtectedRoute = ({ children, requireOnboarded = true, requireAdmin = false }) => {
  const { session, profile, loading } = useAuth();

  if (loading) return null;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requireOnboarded && profile && !profile.is_onboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/app/home" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute requireOnboarded={false}>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/home" replace />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'likes',
        element: <LikesPage />,
      },
      {
        path: 'messages',
        element: <MessagesPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'profile/edit',
        element: <EditProfilePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'chat/:matchId',
        element: <ChatPage />,
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
