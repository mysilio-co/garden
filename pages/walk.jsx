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

export function GardenTile() {
  return (
    <div>
      <div>
        <div className="flex flex-col justify-center items-center bg-night">
          {Math.random()}
        </div>
      </div>
    </div>
  );
}

export function GardenMap() {
  const populate = () => {
    return Colors[Math.floor(Math.random() * Colors.length)];
  };
  const [hexmap, setHexmap] = useState(new HexMap(populate));
  const [walker, setWalker] = useState(new Walker(hexmap));
  return (
    <div className="grid hex gap-6 p-6">{Array(30).fill().map(GardenTile)}</div>
  );
}

export default function GardenWalk() {
  return (
    <div className="page" id="page">
      <Nav />
      <div className="text-center">
        Go on a walk through your garden! Use the map below to navigate:
      </div>
      <GardenMap />
    </div>
  );
}
