import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { CookieBanner } from './components/CookieBanner';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Search = lazy(() => import('./pages/Search/Search'));
const PublicProfile = lazy(() => import('./pages/Search/PublicProfile'));
const AdminPanel = lazy(() => import('./pages/Admin/AdminPanel'));
const Contact = lazy(() => import('./pages/Info/Contact'));
const Rules = lazy(() => import('./pages/Info/Rules'));
const About = lazy(() => import('./pages/Info/About'));
const PrivacyPolicy = lazy(() => import('./pages/Info/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/Info/TermsOfService'));
const SuccessStories = lazy(() => import('./pages/Info/SuccessStories'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading Fallback UI
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center" style={{ background: 'linear-gradient(160deg, #FFFCF5 0%, #FFF8EB 50%, #FFFCF5 100%)' }}>
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-haldi-500/20 border-t-kumkum-500"></div>
      <p className="mt-5 font-display text-xs font-bold uppercase tracking-[0.3em] text-foreground/30">विवाहवेध</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
          <ScrollToTop />
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#2a1f1a',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'Mukta, sans-serif',
                border: '1px solid rgba(232, 163, 23, 0.12)',
                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.08)',
              },
            }} 
          />
          <Suspense fallback={<PageLoader />}>
            <CookieBanner />
            <Routes>
              <Route element={<MainLayout />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/search" element={<Search />} />
                <Route path="/profile/:id" element={<PublicProfile />} />
                <Route path="/success-stories" element={<SuccessStories />} />

                {/* Private Logged-In Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute adminOnly />}>
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
          </BrowserRouter>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
