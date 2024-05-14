import React from 'react'

const PrimaryLabel: React.FC<IPrimaryLabelProps> = ({ ...item }: IPrimaryLabelProps) => {
  return (
    <>
      <label className={`${item.className} w-4 h-8`}>{item.title}</label>
    </>
  )
}

export default PrimaryLabel
