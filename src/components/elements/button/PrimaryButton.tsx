import React from 'react'

const PrimaryButton: React.FC<IPrimaryButtonProps> = ({ className, subClassName, onClick, children }) => {
  return (
    <>
      <button className={`${className}text-white py-2 px-4 rounded-lg`} onClick={onClick}>
        <p className={`font-medium ${subClassName}`}>{children}</p>
      </button>
    </>
  )
}

export default PrimaryButton
