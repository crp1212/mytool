var Lib = require('./lib.js')
function mix (...mixins) {
    class Mix { }

    for (let mixin of mixins) {
        copyProperties(Mix, mixin)
        copyProperties(Mix.prototype, mixin.prototype)
    }

    return Mix
}

function copyProperties (target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
            let desc = Object.getOwnPropertyDescriptor(source, key)
            Object.defineProperty(target, key, desc)
        }
    }
}
class Util extends mix(Lib) {
    constructor (str) {
        super()
        this.str = str
    }
}
module.exports = new Util()
