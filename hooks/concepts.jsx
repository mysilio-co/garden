import { useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { isNote, isBookmark, isImage, isFile } from 'garden-kit/items'
import { getTitle } from 'garden-kit/utils'

export function useConceptNamesMatching(search) {
  // TODO: get this working to re-enable concept name autocomplete
  return []
}

function fuseEntryFromGardenEntry(thing) {
  if (isNote(thing)) {
    return {
      thing: thing,
      type: 'note',
      name: getTitle(thing),
    }
  } else if (isImage(thing)) {
    return {
      thing: thing,
      type: 'image',
      name: thing && getTitle(thing),
    }
  } else if (isFile(thing)) {
    return {
      thing: thing,
      type: 'file',
      name: thing && getTitle(thing),
    }
  } else if (isBookmark(thing)) {
    return {
      thing: thing,
      type: 'link',
      name: thing && getTitle(thing),
    }
  }
  return {}
}

function fuseFromGarden(garden) {
  return garden && garden.map(fuseEntryFromGardenEntry)
}

export function useFuse(garden) {
  const options = {
    includeScore: true,
    threshold: 0.3,
    keys: ['name'],
  }
  const [fuse] = useState(new Fuse([], options))
  return useMemo(() => {
    fuse.setCollection(fuseFromGarden(garden) || [])
    return { fuse }
  }, [garden])
}

export function useFilteredGarden(webId, spaceSlug = 'default', search = '') {
  const { garden } = useGarden(webId, spaceSlug)
  const { fuse } = useFuse(garden)
  return useMemo(() => {
    if (search) {
      const result = fuse.search(search)
      return { garden: result.map(({ item }) => item.thing) }
    } else {
      return { garden }
    }
  }, [garden, search])
}
