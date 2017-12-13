const createServerFolder = require('./createServerFolder.js')
const path = require('path')
const Watch = require('./watchFile.js')
const createServer = require('./server.js')
const co = require('../util/co_async.js')
const fs = require('fs')

async function debugFile (main) { // 参数  需要监听的文件的路径
    if (!main) {
        console.log('文件不存在')
        return
    }
    await createServerFolder(main)
    var inject = await co(fs.readFile, path.resolve(__dirname, './inject.js'))
    var ws = createServer()
    new Watch(main, inject.toString(), ws)
}

module.exports = debugFile
