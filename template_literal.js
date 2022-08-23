// Copyright 2020 Hyperspaces. All rights reserved. MIT license.
import { escapeHTML } from './escape_html.js'
import { keypath } from './keypath.js'

const defaultOptions = {
  escapeHTML: false
}

/** Template literal
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
 *
 *         const template = "<h1>${content.title}</h1>"
 *
 *         const data = {
 *           content: {
 *             title: 'hey, world'
 *           }
 *         }
 *
 *         const tpl = templateLiteral(str)
 *         const output = tpl.set(data).get()
 *
 *         ////
 *
 *         <h1>hey, world</h1>
 */
export function templateLiteral (string = '', options = {}) {
  options = Object.assign(defaultOptions, options)

  const each = data => data.map(item => set(item)).join('')

  const get = () => string

  const set = data => {
    let transform = string.replace(/\${(.*?)}/g, (_, key) => {
      let value = keypath(key, data)

      if (options.escapeHTML) {
        value = escapeHTML(value)
      }

      return value
    })

    string = transform

    return api
  }

  const api = { each, get, set }

  return api
}
