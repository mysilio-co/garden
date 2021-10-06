export default function Avatar({ className, ...rest }) {
  return (
    <img className={`rounded-full border-2 border-white ${className}`} {...rest} />
  )
}