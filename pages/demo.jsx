import { useState } from "react";
import { Walker, HexMap, HexTile, Direction, Orientation } from "../model/hex";
import Nav from "../components/nav";

const Colors = [
  "bg-passionflower",
  "bg-lagoon",
  "bg-echeveria",
  "bg-chanterelle",
  "bg-coral",
  "bg-ember",
  "bg-ocean",
  "bg-aloe",
  "bg-kelp",
  "bg-apricot",
  "bg-salmon",
];

const DemoImages = [
  {
    name: "sagfam",
    src: "https://www.lapedrera.com/sites/default/files/2019-11/home-la-pedrera-terrat-azotea-rooftop.jpg",
    areas: [
      {
        url: "https://cdn.casabatllo.es/wp-content/uploads/2018/01/fachada-590x760.png",
        coords: [0, 0, 600, 600],
      },
      {
        url: "https://www.catalannews.com/images/cna/images/2020/09/sagfam.jpg",
        coords: [600, 600, 1200, 1200],
      },
    ],
  },
];


export function AreaLink({ coords,  url }) {
  const [x1,x2,y1,y2] = coords
  return <area shape="rect" coords={`${x1},${y1},${x2},${y2}`} href={url} />;
}

export function ImageMap({ name, src, areas }) {
  return (
    <>
      <map name={name}>
        {areas.map(({ coords, url }) => (
          <AreaLink coords={coords} url={url} />
        ))}
      </map>
      <img usemap={`#${name}`} src={src} />
    </>
  );
}

export default function Demo() {
  return (
    <div className="page" id="page">
      <Nav />
      {DemoImages.map(({ name, src, areas }) => {
        <ImageMap name={name} src={src} areas={areas} />;
      })}
    </div>
  );
}
