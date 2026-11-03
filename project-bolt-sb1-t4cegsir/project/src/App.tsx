import SiteHeader from '@/components/SiteHeader';
import HeroSection from '@/components/HeroSection';
import ProcessSection from '@/components/ProcessSection';
import TrustSection from '@/components/TrustSection';
import SiteFooter from '@/components/SiteFooter';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader />
      <main>
        <HeroSection />
        <ProcessSection />
        <TrustSection />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
