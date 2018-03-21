// Set up this file, so that others files using config don't need to care about the physical location of config file
import * as assign from "assign-deep";

const base = require('../data/config.json')

const configs = {
    prd: assign({}, base),
    dev: assign({}, base, require('../data/config.dev.json'))
}

export default function getConfig(stage = 'prd') {
    let config = configs[stage]
    if (!config) {
        throw new Error('No configuration found for stage ' + stage)
    }
    return config
}