// Set up this file, so that others files using config don't need to care about the physical location of config file
import * as assign from "assign-deep"
import { readFileSync } from "fs"
import * as path from 'path'

const base = require('../data/config.json')

const configs = {
    prd: assign({}, base),
    dev: assign({}, base, require('../data/config.dev.json'))
}

/**
 * 
 * @param {string} stage optional, if not specified
 */
export function getStageConfig(stage) {
    const config = configs[stage]
    if (!config) {
        throw new Error('No configuration found for stage ' + stage)
    }
    if (!config.privateKey) {
        config.privateKey = readFileSync(path.join(__dirname, '../data', config.privateKeyFile)).toString()
    }
    return config
}

let currentConfig;  // Will be set only once
/**
 * 
 * @param {string} stage if the cached config exists, the argument will be ignored
 */
export default function getCachedConfig(stage) {
    if (!currentConfig) {
        currentConfig = getStageConfig(stage)
    }
    return currentConfig
}