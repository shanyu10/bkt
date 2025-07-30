import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const noNavFooter = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!noNavFooter && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!noNavFooter && <Footer />}
    </>
  );
}
