// Set up this file, so that others files using config don't need to care about the physical location of config file
import * as assign from "assign-deep";

let config = require('../data/config.json')

// You should call this function only once
export function setStage(stage) {
    if (stage === 'prd') {
        return
    }
    assign(config, require('../data/config.' + stage + '.json'))
}

export default config
