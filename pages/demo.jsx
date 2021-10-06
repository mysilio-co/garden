import Link from 'next/link'
import Image from 'next/image'
import { Loader } from '../components/elements'
import Nav from '../components/nav'

const scale = 1 / 3;
const H = 1950 * scale;
const W = 4050 * scale;

export const StoragePrefix =
  "https://ian.myunderstory.com/public/demo/ImageMap/demo/";
export const DemoPath = "/demo";
export const DemoPrefix = `${DemoPath}/`;

export const MountainDashboard = {
  src: `${StoragePrefix}00-mountains-dashboard.jpg`,
  areas: [
    {
      href: `${DemoPrefix}vision`,
      coords: [0, 0, W, H/3],
    },
    {
      href: `${DemoPrefix}pitch`,
      coords: [0, (H * 2) / 3, W, H],
    },
    {
      href: `${DemoPrefix}library`,
      coords: [0, H / 3, W, (H * 2) / 3],
    },
  ],
};

export const PathPitch = {
  src: `${StoragePrefix}01-path-pitch.jpg`,
  areas: [
    {
      href: DemoPath,
      coords: [0, 0, W, H],
    },
  ],
};
export const ForestLibrary = {
  src:`${StoragePrefix}02-forest-library.jpg`,
  areas: [
    {
      href: DemoPath,
      coords: [0, 0, W, H],
    },
  ],
 }

export const SkyVision = {
  src:`${StoragePrefix}03-sky-vision.jpg`,
  areas: [
    {
      href: DemoPath,
      coords: [0, 0, W, H],
    },
  ],
 }

export const DemoImageMaps = {
  dashboard: MountainDashboard,
  pitch: PathPitch,
  library: ForestLibrary,
  vision: SkyVision,
}

function useWindowSize() {
  // taken from: https://usehooks.com/useWindowSize/
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

export function AreaLink({ coords, href}) {
  const [x1, y1, x2, y2] = coords;
  return (
    <Link href={href}>
      <a
        className={`bg-storm absolute top-${y1} left-${x1} block`}
        height={y2 - y1}
        width={x2 - x1}
        href={href}
      >
        <area shape="rect" coords={`${x1},${y1},${x2},${y2}`} href={href} />
      </a>
    </Link>
  );
 }

export function ImageMap({ name, src, areas }) {
  return (
    <div className="flex flex-col justify-center items-center overflow-hidden">
      <h1 className="text-3xl m-6 text-lagoon-dark">
        Click around to explore our Garden Map prototype
      </h1>
      <map name={name}>
        {areas.map(({ coords, href }) => (
          <AreaLink coords={coords} href={href} />
        ))}
      </map>
      <Image
        width={W}
        height={H}
        layout="fixed"
        usemap={`#${name}`}
        src={src}
      />
    </div>
  );
}

export function Demo({name="dashboard"}) {
  console.log(name)
  const {src, areas} = DemoImageMaps[name]
  return (
    <div className="page" id="page" className="bg-aquamarine h-screen">
      <Nav />
      <ImageMap key={name} name={name} src={src} areas={areas} />
    </div>
  );
}

export default function Dashboard() {
  return <Demo name="dashboard"></Demo>;
}
