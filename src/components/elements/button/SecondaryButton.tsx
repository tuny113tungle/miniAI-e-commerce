import React from 'react'

const SecondaryButton: React.FC<ISecondaryButtonProps> = ({ className, subClassName, onClick, children }) => {
  return (
    <>
      <button className={`${className}text-black py-2 px-4 rounded-lg`} onClick={onClick}>
        <p className={`font-medium ${subClassName}`}>{children}</p>
      </button>
    </>
  )
}

export default SecondaryButton
