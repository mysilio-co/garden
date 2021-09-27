import { Map } from "immutable";

export enum Orientation {
  PointyTop = "pointy",
  FlatTop = "flat",
}

export enum Direction {
  West = "w", // invalid for FlatTop orientation
  Northwest = "nw",
  North = "n", // invalid for PointyTop orientation
  Northeast = "ne",
  East = "e", // invalid for FlatTop orientation
  Southeast = "se",
  South = "s", // invalid for PointyTop orientation
  Southwest = "sw",
}

export type HexValue = any;

export class HexTile {
  // https://www.redblobgames.com/grids/hexagons/#coordinates-doubled
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    if ((x + y) % 2 !== 0) {
      throw new Error(
        `Invalid Coordinates: (x + y) % 2 = (${x} + ${y}) % 2 !== 0`
      );
    }
    this.x = x;
    this.y = y;
  }

  nearestNeighbor(dir: Direction): HexTile {
    switch (dir) {
      case Direction.West:
        return new HexTile(this.x - 2, this.y);
      case Direction.Northwest:
        return new HexTile(this.x - 1, this.y - 1);
      case Direction.North:
        return new HexTile(this.x, this.y - 2);
      case Direction.Northeast:
        return new HexTile(this.x + 1, this.y - 1);
      case Direction.East:
        return new HexTile(this.x + 2, this.y);
      case Direction.Southeast:
        return new HexTile(this.x + 1, this.y + 1);
      case Direction.South:
        return new HexTile(this.x, this.y + 2);
      case Direction.Southwest:
        return new HexTile(this.x - 1, this.y + 1);
      default:
        throw new Error(
          `I don't know how to find neighbors in an unknown Direction: ${dir}`
        );
    }
  }
}

export class HexMap {
  orientation: Orientation;
  start: HexTile;
  populate: () => HexValue;
  values: Map<HexTile, HexValue>;

  constructor(populate: () => HexValue) {
    this.populate = populate;
    this.orientation = Orientation.PointyTop;
    this.start = new HexTile();
    this.values = Map();
    this.values = this.values.set(this.start, this.populate());
  }

  lookupHexValue(hex: HexTile) {
    return this.values.get(hex);
  }

  setHexValue(hex: HexTile, value: HexValue) {
    this.values = this.values.set(hex, value);
    return this;
  }

  populateHex(hex: HexTile) {
    let v = this.populate();
    return this.setHexValue(hex, v);
  }

  exploreHex(hex: HexTile) {
    let v = this.lookupHexValue(hex);
    if (!v) {
      this.populateHex(hex);
      v = this.lookupHexValue(hex);
    }
    return v;
  }
}

export class Walker {
  hexmap: HexMap;
  location: HexTile;
  facing: Direction;

  constructor(hexmap: HexMap, location: HexTile) {
    this.hexmap = hexmap;
    this.location = location || hexmap.start;
  }

  validDirection(dir: Direction): boolean {
    if (
      (this.hexmap.orientation === Orientation.FlatTop &&
        (dir === Direction.West || dir === Direction.East)) ||
      (this.hexmap.orientation === Orientation.PointyTop &&
        (dir === Direction.North || dir === Direction.South))
    ) {
      return false;
    }
    return true;
  }

  walk(dir: Direction): Walker {
    if (!this.validDirection(dir)) {
      throw new Error(
        `Cannot walk in that Direction: ${dir}, ${this.hexmap.orientation}`
      );
    }
    return new Walker(this.hexmap, this.location.nearestNeighbor(dir));
  }

  explore(): HexValue {
    return this.hexmap.exploreHex(this.location);
  }

  look(dir: Direction): HexValue {
    if (!this.validDirection(dir)) {
      throw new Error(
        `Cannot look in that Direction: ${dir}, ${this.hexmap.orientation}`
      );
    }

    return this.hexmap.exploreHex(this.location.nearestNeighbor(dir));
  }
}
