export default function Avatar({ src, className }) {
  return (
    <img src={src} className={`w-12 h-12 rounded-full ring ring-2 ring-white`} />
  )
}