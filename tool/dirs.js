/* 
    文件为空时返回
*/
const fs = require('fs')
const co = require('../util/co_async.js')

async function dirs (paths) {
    var files = await co(fs.readdir, paths)
    return files.length > 0 ? files : false
} 
module.exports = dirs