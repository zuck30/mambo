import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import OnboardingPage from '../pages/onboarding/OnboardingPage';

// Info Pages
import ProductsPage from '../pages/info/ProductsPage';
import LearnPage from '../pages/info/LearnPage';
import SafetyPage from '../pages/info/SafetyPage';
import SupportPage from '../pages/info/SupportPage';
import PrivacyPage from '../pages/info/PrivacyPage';
import TermsPage from '../pages/info/TermsPage';
import CookiePolicyPage from '../pages/info/CookiePolicyPage';
import CareersPage from '../pages/info/CareersPage';
import TechBlogPage from '../pages/info/TechBlogPage';
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
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/learn',
    element: <LearnPage />,
  },
  {
    path: '/safety',
    element: <SafetyPage />,
  },
  {
    path: '/support',
    element: <SupportPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },
  {
    path: '/cookie-policy',
    element: <CookiePolicyPage />,
  },
  {
    path: '/careers',
    element: <CareersPage />,
  },
  {
    path: '/tech-blog',
    element: <TechBlogPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
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
