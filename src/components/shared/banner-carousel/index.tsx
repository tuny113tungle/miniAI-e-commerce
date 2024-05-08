import React from 'react';
import classNames from 'classnames';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ensureMediaPath } from '../../utils/ensureMediaPaths';
import { useShopSetting } from '@/src/hooks/useShopSetting';

export declare interface MobileBannerCarouselProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  className?: string;
  [x: string]: any;
}

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true, // Thêm thuộc tính autoplay và đặt giá trị thành true
  autoplaySpeed: 1900,
};

export default function MobileBannerCarousel(props: MobileBannerCarouselProps): JSX.Element {
  const { className, children } = props;
    const {data: shopSetting} = useShopSetting()
    console.log("🚀 ~ MobileBannerCarousel ~ shopSetting:", shopSetting)
  return (
    <>
      <div className={classNames('w-full mt-2 flex justify-center rounded-[10px]', className)}>
        <div className='w-11/12'>
        {children}
        <Slider {...settings}>
        {shopSetting?.banners?.map((banner: string, index: number) => ( 
          <img
            key={index} 
            src={ensureMediaPath(banner)} 
            alt={`banner-${index}`} 
            className="w-full h-[calc(15vh)] object-fill rounded-[10px]" 
          />
        ))}
        </Slider>
        </div>
      </div>
    </>
  );
}
