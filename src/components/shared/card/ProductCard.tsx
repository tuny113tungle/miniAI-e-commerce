import React from 'react'

const ProductCard: React.FC<IProductCardProps> = ({ src, alt, className, Children }) => {
  return (
    <div className=''>
      <div className=''>
        <img className='' src={src} alt={alt} />
      </div>
    </div>
  )
}

export default ProductCard
