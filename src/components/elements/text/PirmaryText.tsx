import React from 'react'

const PirmaryText: React.FC<IPrimaryTextProps> = ({ className, children }) => {
  return <p className={`${className} text-white bg-black bg-opacity-50 p-2 rounded`}>{children}</p>
}

export default PirmaryText
