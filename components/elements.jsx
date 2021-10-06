import ReactLoader from 'react-loader-spinner'
import ReactDOM from 'react-dom'

const PRIMARY = '#0e90a3' // Mysilio/Green TODO figure out if we can use tailwind
const SECONDARY = '#579f89' // Mysilio/Blue

export const Loader = (props) => {
  return (
    <ReactLoader
      type="MutatingDots"
      color={PRIMARY}
      secondaryColor={SECONDARY}
      height={120}
      width={120}
      {...props} />
  )
}

// This loader is soothing to look at, but slow, so only use for things with a long wait (like gate deploys)
export const PatientLoader = (props) => {
  return (
    <ReactLoader
      type="Rings"
      color={PRIMARY}
      secondaryColor={SECONDARY}
      height={120}
      width={120}
      {...props} />
  )
}

export const InlineLoader = (props) => {
  return (
    <ReactLoader
      type="ThreeDots"
      color={PRIMARY}
      secondaryColor={SECONDARY}
      {...props} />
  )
}

export const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body)
}
