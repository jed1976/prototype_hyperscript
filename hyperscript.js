// Copyright 2020 Hyperspaces. All rights reserved. MIT license.
import { emptyElements } from './empty_elements.js'
import jsonLogic from './json_logic.js'
import { keypath } from './keypath.js'
import { templateLiteral } from './template_literal.js'

/** HTML indentation level */
let indentationLevel = 0

/** Mutable options */
let outputOptions = {}

/** Default options */
const defaults = {
  minify: true,
  spaces: 2
}

/** Array.flat() requires a depth value for the number of levels to recurse. */
const depth = 20

/** HTML tag/attribute symbols. */
const tag = {
  close: '>',
  end: '</',
  equal: '=',
  open: '<',
  quote: '"'
}

/** Whitespace characters. https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace */
const whitespace = {
  cr: "\r",
  lf: "\n",
  space: " ",
  tab: "\t"
}

/** Generates the appropriate line feed based on the offset and number of spaces specified. */
function lineFeed () {
  const output = []

  for (let level = 0; level < indentationLevel; level++) {
    for (let space = 0; space < outputOptions.spaces; space++) {
      output.push(whitespace.space)
    }
  }

  return output.join('')
}

/** Generates new line/carriage return characters. */
function newLine () {
  return outputOptions.minify ? '' : whitespace.cr + whitespace.lf
}

/**
 * Generates a string from the specified template and data.
 * @param template The hyperscript template.
 * @param data The data to be bound to the hyperscript template.
 * @param options Output options.
 */
export function hyperscript (template, data = {}, options = defaults) {
  outputOptions = options
  outputOptions.spaces = options.minify ? 0 : options.spaces || defaults.spaces

  const output = []

  switch (template.constructor.name.toLowerCase()) {
    case 'array': {
      for (let index = 0, length = template.length; index < length; index++) {
        output.push(hyperscript(template[index], data, outputOptions))

        if ((index + 1) < length) {
          output.push(newLine())
          output.push(lineFeed())
        }
      }
      break
    }

    case 'boolean': {
      output.push(new Boolean(template).valueOf())
    }

    case 'object': {
      if (template.element) {
        const { attribute, element, collection, content } = template

        // Element open
        output.push(tag.open)
        output.push(hyperscript(element, data, outputOptions))

        // Attribute
        if (attribute) {
          Object.entries(attribute).sort().map(entry => {
            const value = hyperscript(entry[1], data, outputOptions)

            // Do not display the attribute name if the value if false or empty
            // Examples: checked, selected, open, aria-hidden
            if (value !== 'false' && value !== '') {
              output.push(whitespace.space)
              output.push(new String(entry[0]).toLowerCase())
            }

            // Do not display the attribute value if it is a boolean string value or empty
            if (value !== 'false' && value !== 'true' && value !== '') {
              output.push(tag.equal)
              output.push(tag.quote)
              output.push(hyperscript(value, data, outputOptions))
              output.push(tag.quote)
            }
          })
        }

        output.push(tag.close)

        // Collection
        if (collection) {
          const { keypath:collectionKeypath, template:collectionTemplate } = collection
          const collectionData = keypath(collectionKeypath, data) || []

          collectionData.map((collectionItem) => {
            indentationLevel++
            output.push(newLine())
            output.push(lineFeed())
            output.push(hyperscript(collectionTemplate, collectionItem, outputOptions))
            indentationLevel--
          })

          output.push(newLine())
          output.push(lineFeed())
        }

        // Content
        if (content && content !== '') {
          indentationLevel++
          output.push(newLine())
          output.push(lineFeed())
          output.push(hyperscript(content, data, outputOptions))
          indentationLevel--
          output.push(newLine())
          output.push(lineFeed())
        }

        // Element close
        if (emptyElements.includes(element) === false) {
          output.push(tag.end)
          output.push(hyperscript(element, data, outputOptions))
          output.push(tag.close)
        }
      } else if (jsonLogic.is_logic(template)) {
        output.push(hyperscript(jsonLogic.apply(template, data), data, outputOptions))
      }
      break
    }

    case 'string': {
      output.push(templateLiteral(template, { escapeHTML: true }).set(data).get())
      break
    }
  }

  return output.flat(depth).join('')
}
