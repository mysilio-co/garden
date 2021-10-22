import Link from 'next/link'
import Image from 'next/image'
import { Loader } from '../components/elements'
import Nav from '../components/nav'

const Scale = 3/4;
const W = 1920;
const H = 924;

export const StoragePrefix =
  "https://ian.mysilio.me/public/demo/ImageMap/demo/";
export const DemoPath = "/demo";
export const DemoPrefix = `${DemoPath}/`;


export const MountainDashboard = {
  src: `${StoragePrefix}00-mountains-dashboard.jpg`,
  areas: [
    {
      // Sun
      href: `${DemoPrefix}sky`,
      coords: [600, 0, 1400, 300],
    },
    {
      // READ ME
      href: "/u/tani.mysilio.me/default/5LSGKY1KZn",
      coords: [950, 400, 1200, 600],
    },
    {
      // Left Arrow
      href: `${DemoPrefix}path`,
      coords: [0, 725, 500, H],
    },
    {
      // Right Arrow
      href: "https://mysilio.garden",
      coords: [1150,725, W, H],
    },
    {
      // Tree
      href: "https://mysilio.com",
      coords: [225,300, 750, 725],
    },
    {
      // Plants
      href: `${DemoPrefix}forest`,
      coords: [1300, 450, 1700, 725],
    },
  ],
};

export const PathPitch = {
  src: `${StoragePrefix}01-path-pitch.jpg`,
  areas: [
    {
      // Funding
      href: "/u/tani.mysilio.me/default/VcgmBzxsm5ZasszycqkMTenHMP4BQ4",
      coords: [700, 50, 1000, 275],
    },
    {
      // Team
      href: "/u/tani.mysilio.me/default/271EUcxT76uHPAgVroyvdM4C",
      coords: [1000, 100, 1350, 350],
    },
    {
      // Market Size
      href: "/u/tani.mysilio.me/default/44VHTqLcTKDP6KQVHYsro",
      coords: [600, 275, 900, 550],
    },
    {
      // Why Now?
      href: "/u/tani.mysilio.me/default/LyQfwzaipmL",
      coords: [1100, 0, 1400, 700],
    },
    {
      // Product vision
      href: "/u/tani.mysilio.me/default/pFcGoTnHLbR6vXHZdEVW89bZYgmJesMkyK",
      coords: [450, 550, 900, H],
    },
    {
      // Garden Soil
      href: "/u/tani.mysilio.me/default/E2NKVij",
      coords: [200, 300, 550, 600],
    },
  ],
};
export const ForestLibrary = {
  src: `${StoragePrefix}02-forest-library.jpg`,
  areas: [
    {
      //  Butterfly // Infinite rooms for thought
      href: "/u/tani.mysilio.me/default/jRZ5QCkALH1Z2MW1xHsBdKGvbwLVVzubXq",
      coords: [200, 370, 380, 600],
    },
    {
      // Normal Bee // Building the Creator economy
      href: " /u/tani.mysilio.me/default/21jdcZML2hG1YXioHasgSxujziGBMSWk3FHvCuW",
      coords: [480, 0, 780, 500],
    },
    {
      // Plants // Digital Gardens
      href: "/u/tani.mysilio.me/default/dv4H3AEmdZk6zUNbmuw",
      coords: [840, 0, 1500, 600],
    },
    {
      // Cartoon Bee // Metaverse
      href: "/u/tani.mysilio.me/default/2PmGzU397iuQQ",
      coords: [1600, 140, 1750, 320],
    },
    {
      // Two Shroom Snail // Platform Coops
      href: "/u/tani.mysilio.me/default/iLBJkb92sXiECbA9cvv",
      coords: [0, 650, 420, H],
    },
    {
      // Single Shroom // Mysilio Reading Room
      href: "/u/tani.mysilio.me/default/3AD3JFXpdDPRKP4z8",
      coords: [700, 610, 970, H],
    },
    {
      // Triple Shroom // Social Knowledge Graphs
      href: "/u/tani.mysilio.me/default/3PHaBYD9kMsF8kdvk1mHKpohYZkpRb3g",
      coords: [1140, 610, 1390, H],
    },
    {
      // Gnome // Worldbuilding
      href: "/u/tani.mysilio.me/default/6RUdmJM9BtHedkV8wzrzFvQmg7VeZ4RVQBMcdw37",
      coords: [1610, 710, W, H],
    },
  ],
};

export const SkyVision = {
  src: `${StoragePrefix}03-sky-vision.jpg`,
  areas: [
    {
      // Left Cloud  // Mysilio Brand
      href: "/u/tani.mysilio.me/default/FW445yWvwojgTfQJBjQUFu",
      coords: [0, 0, 530, 650],
    },
    {
      // Sun // Vision
      href: "/u/tani.mysilio.me/default/21jdcZML2hG1YXioHasxihdiw6feEENXejepjdt",
      coords: [530, 0, 980, 500],
    },
    {
      // Blue Bird // Tani
      href: "/u/tani.mysilio.me/default/3yYHoe",
      coords: [980, 250, 1280, 550],
    },
    {
      // Orange Bird // Ian
      href: "/u/ian.mysilio.me/default/HHkbwnJkxhr",
      coords: [1280, 520, 1620, H],
    },
    {
      // Yellow Bird // Travis
      href: "/u/travis.mysilio.me/default/HHkbwnJkxhr",
      coords: [820, 550, 1150, H],
    },
    {
      // Right Cloud  // Art n' D
      href: "/u/tani.mysilio.me/default/BzfF7kX",
      coords: [1300, 0, W, 550],
    },
  ],
};

export const DemoImageMaps = {
  dashboard: MountainDashboard,
  pitch: PathPitch,
  library: ForestLibrary,
  vision: SkyVision,
  mountain: MountainDashboard,
  path: PathPitch,
  forest: ForestLibrary,
  sky: SkyVision,
}

export function AreaLink({ coords, href }) {
  const [x1, y1, x2, y2] = coords;
  return (
    <Link href={href}>
      <a href={href}>
        <area shape="rect" coords={`${x1*Scale},${y1*Scale},${x2*Scale},${y2*Scale}`} href={href} />
      </a>
    </Link>
  );
 }

export function ImageMap({ name, src, areas }) {
  return (
    <div className="flex flex-col justify-center items-center overflow-hidden">
      <h1 className="text-3xl m-6 text-lagoon-dark">
        Click around to explore our Garden Map prototype:
        <Link href={DemoPath}>
          <a href={DemoPath}> Mountain </a>
        </Link>{" "}
        |
        <Link href={`${DemoPrefix}path`}>
          <a href={`${DemoPrefix}path`}> Path </a>
        </Link>{" "}
        |
        <Link href={`${DemoPrefix}sky`}>
          <a href={`${DemoPrefix}sky`}> Sky </a>
        </Link>{" "}
        |
        <Link href={`${DemoPrefix}forest`}>
          <a href={`${DemoPrefix}forest`}> Forest </a>
        </Link>
      </h1>
      <map name={name}>
        {areas.map(({ coords, href }) => (
          <AreaLink coords={coords} href={href} />
        ))}
      </map>
      <Image
        width={W * Scale}
        height={H * Scale}
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
