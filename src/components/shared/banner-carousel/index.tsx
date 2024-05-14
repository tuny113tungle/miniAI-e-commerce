import React from 'react'
import classNames from 'classnames'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ensureMediaPath } from '../../utils/ensureMediaPaths'
import { useShopSetting } from '@/src/hooks/useShopSetting'
import PrimaryButton from '../../elements/button/PrimaryButton'
import PirmaryText from '../../elements/text/PirmaryText'

export declare interface MobileBannerCarouselProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode
  className?: string
  [x: string]: any
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true, // Thêm thuộc tính autoplay và đặt giá trị thành true
  autoplaySpeed: 1900
}

export default function MobileBannerCarousel(props: MobileBannerCarouselProps): JSX.Element {
  const { className, children } = props
  const { data: shopSetting } = useShopSetting()
  console.log('🚀 ~ MobileBannerCarousel ~ shopSetting:', shopSetting)
  return (
    <>
      <div className={classNames('w-full mt-2 flex justify-center rounded-xl', className)}>
        <div className='w-11/12'>
          {children}
          <Slider {...settings}>
            {shopSetting?.banners?.map((banner: string, index: number) => (
              <div className='relative w-full h-60'>
                <img src={ensureMediaPath(banner)} alt='banner' className='w-full h-full object-cover rounded-xl' />
                <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
                  <PirmaryText className='' children='Spring Discounts Up To 30% Off [Banner]' />
                </div>
                <div className='absolute inset-0 flex items-end justify-start mx-4 py-4'>
                  <PrimaryButton
                    className='bg-primary-100 text-white py-2 px-4 rounded-lg'
                    children='show all'
                    onClick={() => {
                      alert('hello world')
                    }}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  )
}
