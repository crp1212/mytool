const createServerFolder = require('./createServerFolder.js')
const path = require('path')
const Watch = require('./watchFile.js')
const createServer = require('./server.js')
const co = require('../util/co_async.js')
const fs = require('fs')

async function debugFile (main, cb) { // 参数  需要监听的文件的路径
    var isTem = false // 判断是否为临时文件
    var content = await co(fs.readFile, main)
    if (!main || content === void 0) {// 文件不存在的时候,当前路径直接生成
        var htmlStr = await co(fs.readFile, path.resolve(__dirname, '../tem/html/tem.html'))
        fs.writeFileSync(main, htmlStr)
        isTem = true
    }
    await createServerFolder(main)
    var inject = await co(fs.readFile, path.resolve(__dirname, './inject.js'))
    var ws = createServer()
    new Watch(main, inject.toString(), ws)
    cb && cb()
    process.on('SIGINT', function() {
        if (isTem) { // 是临时文件的时候进行删除操作
            fs.unlinkSync(main)
            console.log('已删除临时文件')
        }
        process.exit()
    })
}

module.exports = debugFile
