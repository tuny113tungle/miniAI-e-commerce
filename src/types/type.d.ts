interface ICategoriesProps {}

interface IPrimaryLabelProps {
  className: string
  title: string
}

interface IPrimaryButtonProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode
  className: string
  subClassName?: string
  onClick: () => void
}

interface ISecondaryButtonProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode
  className: string
  subClassName?: string
  onClick: () => void
}

interface IPrimaryTextProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode
  className: string
}

interface IProductCardProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode
  className: string
  src: string
  alt: string
  title: string
  description: string
  price: number
  discount?: number
}
