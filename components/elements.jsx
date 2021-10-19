import ReactLoader from 'react-loader-spinner'
import ReactDOM from 'react-dom'
import Tippy from '@tippyjs/react';

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

export const Tooltip = ({ content, children }) => (
  <Tippy content={content}// visible={true}
    /*render={attrs => (
      <div {...attrs} className="w-28 bg-black text-white text-center text-xs rounded-lg py-2 z-10 bottom-full -left-1/2 ml-14 px-3 pointer-events-none">
        {content}
        <svg className="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon class="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
      </div>
    )}*/
  >
    {children}
  </Tippy>
);
