const fs = require('fs')
const co = require('../util/co_async.js')
const path = require('path')
const rm = require('rimraf')

async function createServerFolder (file) {
    await new Promise((res, rej) => {
        rm(path.resolve(__dirname, './dist'), function () {
            res(1)
        })
    })
    var bool = await co(fs.mkdir, path.resolve(__dirname, './dist'))
    return 
}
module.exports = createServerFolder