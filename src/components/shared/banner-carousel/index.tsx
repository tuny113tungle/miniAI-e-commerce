import React from 'react';
import classNames from 'classnames';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ensureMediaPath } from '@/components/utils/ensureMediaPaths';
import { useShopSetting } from '@/hooks/useShopSetting';

export declare interface MobileBannerCarouselProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  className?: string;
  [x: string]: any;
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function MobileBannerCarousel(props: MobileBannerCarouselProps): JSX.Element {
  const { className, children } = props;
    const {data: shopSetting} = useShopSetting()
    console.log("🚀 ~ MobileBannerCarousel ~ shopSetting:", shopSetting)
  return (
    <>
      <div className={classNames('', className)}>
        {children}
        <Slider {...settings}>
          {shopSetting?.banners?.[0] ? (
            <img
              src={ensureMediaPath(shopSetting?.banners?.[0])}
              alt="banner"
              className="w-24 py-[-14px] h-auto shadow-lg shadow-y-500/50 object-cover mt-[-1px]"
            />
          ) : (
            <img src={''} alt="banner" className="w-24 h-auto py-[-14px] shadow-lg shadow-y-500/50 object-cover mt-[-1px]" />
          )}
        </Slider>
      </div>
    </>
  );
}
