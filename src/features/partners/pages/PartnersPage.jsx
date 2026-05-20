import { useEffect } from 'react';
import { Navbar, Footer } from '../../../shared/components/layout';
import { PartnersHero } from '../components/PartnersHero';
import { PartnersBenefits } from '../components/PartnersBenefits';
import { PartnersProcess } from '../components/PartnersProcess';
import { PartnersForm } from '../components/PartnersForm';
import { PartnersFAQ } from '../components/PartnersFAQ';

export const PartnersPage = () => {
  useEffect(() => {
    document.title = 'Registra tu restaurante · Express';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main className="relative bg-transparent min-h-screen font-sans">
      <div className="relative z-10">
        <Navbar />
        <PartnersHero />
        <PartnersBenefits />
        <PartnersProcess />
        <PartnersForm />
        <PartnersFAQ />
        <Footer />
      </div>
    </main>
  );
};
