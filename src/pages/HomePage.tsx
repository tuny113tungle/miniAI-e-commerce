import React from 'react'
import { Page } from 'zmp-ui'
import MobileLayout from '../components/shared/empty-layout'
import { useColor } from '../hooks/useColor'
import MobileBannerCarousel from '../components/shared/banner-carousel'
import BottomNavigator from '../components/shared/bottom-navigator'
import HeaderSearch from '../components/shared/header-search'
import { PrimaryButton } from '../components/elements/button'
import { PrimaryLabel } from '../components/elements/label'
import { ProductCard } from '../components/shared/card'

const HomePage = () => {
  const {} = useColor()

  const product = [
    {
      className: '',
      src: 'https://via.placeholder.com/150',
      alt: 'Product Image',
      title: 'Product Title',
      description: 'This is a short description of the product.',
      price: 29.99
    },
    {
      className: '',
      src: 'https://via.placeholder.com/150',
      alt: 'Product Image',
      title: 'Product Title',
      description: 'This is a short description of the product.',
      price: 29.99
    },
    {
      className: '',
      src: 'https://via.placeholder.com/150',
      alt: 'Product Image',
      title: 'Product Title',
      description: 'This is a short description of the product.',
      price: 29.99
    }
  ]
  return (
    <Page className='flex items-center bg-[#ffffff]'>
      <MobileLayout className='space-y-4'>
        <MobileBannerCarousel />
        <HeaderSearch />
        <div>
          {product.map((item, index) => (
            <ProductCard key={index} item={{ ...item }} />
          ))}
        </div>

        <BottomNavigator />
      </MobileLayout>
    </Page>
  )
}

export default HomePage
