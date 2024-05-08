import React from 'react';
import { Page } from 'zmp-ui';
import MobileLayout from '../components/shared/empty-layout';
import { useColor } from '../hooks/useColor';
import MobileBannerCarousel from '../components/shared/banner-carousel';
import BottomNavigator from '../components/shared/bottom-navigator';
import HeaderSearch from '../components/shared/header-search';

const HomePage = () => {
  const { } = useColor();

  return (
    <Page className="flex items-center bg-[#ffffff]">
      <MobileLayout className="space-y-4" >
        <HeaderSearch/>
        <MobileBannerCarousel/>
        <BottomNavigator/>
      </MobileLayout>
    </Page>
  );
}

export default HomePage;