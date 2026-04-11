import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/20">
      <Header />
      <main className="flex-grow flex flex-col pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
