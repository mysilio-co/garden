import { jsx } from 'slate-hyperscript'

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const deserialize = el => {

  if (el.nodeType === 3) {
    return el.textContent
  } else if (el.nodeType !== 1) {
    return null
  }

  let children = Array.from(el.childNodes).map(deserialize)
  if (children.length === 0) {
    children = [{ text: '' }]
  }

  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, jsx('element', {}, children))
    case 'BR':
      return '\n'
    case 'BLOCKQUOTE':
      return jsx('element', { type: 'quote' }, children)
    case 'P':
      return jsx('element', { type: 'p' }, children)
    case 'DIV':
      return jsx('element', { type: 'p' }, children)
    case 'ARTICLE':
      return jsx('element', { type: 'p' }, children)
    case 'A':
      return jsx(
        'element',
        { type: 'link', url: el.getAttribute('href') },
        children
      )
    default:
      console.log("can't process ", el.nodeName, " returning text content")
      return el.textContent
  }
}