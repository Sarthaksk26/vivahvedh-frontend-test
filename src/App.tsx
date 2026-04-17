import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Search = lazy(() => import('./pages/Search/Search'));
const PublicProfile = lazy(() => import('./pages/Search/PublicProfile'));
const AdminPanel = lazy(() => import('./pages/Admin/AdminPanel'));
const Contact = lazy(() => import('./pages/Info/Contact'));
const Rules = lazy(() => import('./pages/Info/Rules'));
const About = lazy(() => import('./pages/Info/About'));
const SuccessStories = lazy(() => import('./pages/Info/SuccessStories'));

// Loading Fallback UI
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#F7F9FB]">
    <div className="flex flex-col items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
      <p className="mt-4 font-display text-xs font-black uppercase tracking-[0.2em] text-foreground/40">Loading</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/success-stories" element={<SuccessStories />} />

            {/* Private Logged-In Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
