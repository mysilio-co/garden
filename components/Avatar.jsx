export default function Avatar({ src, className }) {
  return (
    <img src={src} className={`rounded-full border-2 border-white ${className}`} />
  )
}