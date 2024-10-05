import { cva } from 'class-variance-authority'
import { LoaderCircle, type LucideProps } from 'lucide-react'

export type Icon = LucideProps

const Menu = (props: Icon) => (
  <svg
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 5H11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M3 12H16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M3 19H21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
)

const Spinner = (props: Icon) => <LoaderCircle {...props} />

const Icons = {
  Menu,
  Spinner,
}

const iconVariants = cva('', {
  variants: {
    size: {
      xs: 'size-3',
      sm: 'size-4',
      md: 'size-6',
      lg: 'size-8',
      xl: 'size-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export { Icons, iconVariants }
