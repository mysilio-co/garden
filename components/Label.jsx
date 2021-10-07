export default function Label({className="", ...rest}){
  return (
    <span className={`whitespace-nowrap text-sm px-3 py-2 rounded-full ring-1 ring-inset ring-gray-300 hover:ring-my-orange hover:shadow-label ${className}`} {...rest} />
  )
}