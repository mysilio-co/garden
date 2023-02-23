import { Avatar as AvatarIcon } from './icons'

export default function Avatar({ src, className, border = true, ...rest }) {
  const borderClasses = border
    ? border === true
      ? 'border-2 border-white'
      : border
    : ''
  if (src) {
    return (
      <img
        src={src}
        className={`rounded-full ${borderClasses} ${className}`}
        {...rest}
      />
    )
  } else {
    return (
      <span
        className={`inline-block rounded-full overflow-hidden bg-gray-100 cursor-pointer ${borderClasses} ${className}`}
        {...rest}
      >
        <AvatarIcon className="h-full w-full text-gray-300" />
      </span>
    )
  }
}
