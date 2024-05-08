import React from 'react';
import { Page } from 'zmp-ui';
import MobileLayout from '../components/shared/empty-layout';
import { useColor } from '../hooks/useColor';
import MobileBannerCarousel from '../components/shared/banner-carousel';

const HomePage = () => {
  const { } = useColor();

  return (
    <Page className="flex items-center bg-[#ffffff]">
      <MobileLayout >
        <MobileBannerCarousel/>
      </MobileLayout>
    </Page>
  );
}

export default HomePage;