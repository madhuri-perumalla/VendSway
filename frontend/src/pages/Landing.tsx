import React from 'react';
import {
  HeroSection,
  ProblemStatement,
  SolutionFlow,
  MarketplaceIntelligence,
  SellerDiscoveryFlow,
  RegionalPersonalization,
  PlatformEcosystem,
  CTASection
} from '@/components/landing';
import PageNavigator from '@/components/layout/PageNavigator';

const Landing: React.FC = () => {
  return (
    <>
      <PageNavigator />
      <div className="bg-gradient-to-br from-[#E8E3F5]/80 via-[#EDE9F7]/60 to-[#DFD9F0]/70">
        <HeroSection />
        <ProblemStatement />
        <SolutionFlow />
        <MarketplaceIntelligence />
        <SellerDiscoveryFlow />
        <RegionalPersonalization />
        <PlatformEcosystem />
      </div>
    </>
  );
};

export default Landing;