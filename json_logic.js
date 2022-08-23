import jsonLogic from 'https://hyperspaces.app/assets/scripts/json_logic.js'

/** Overwrites the default `jsonLogic.is_logic` function to be more exhaustive. */
jsonLogic.is_logic = function (logic) {
  return (
    logic.constructor.name.toLowerCase() === 'object' &&
    logic !== null &&
    (!logic.element && !logic.attribute && !logic.collection && !logic.content)
  )
}

export default jsonLogic
