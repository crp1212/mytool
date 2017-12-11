/* 
    判断是文件还是文件夹，文件为0 , 文件夹为 1
*/
const fs = require('fs')
const co = require('../util/co_async.js')

async function getStat (path) {
    if (!path) {
        console.log('无效的路径')
        return 
    }
    var stats = await co(fs.stat, path)
    return stats.isDirectory() ? 1 : (stats.isFile() ? 0 : console.log('未知类型'))    
}

module.exports = getStat
