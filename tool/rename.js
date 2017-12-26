/* 
*  功能: 批量修改文件名
*  参数说明 :
*       1. 文件所在的路径
*       2. 匹配规则(通过将字符串转化为正则)
*       3. 匹配结果(转化后的结果)
*/
var util = require('../util/index.js'),
    fs = require('fs'),
    co = require('../util/co_async.js'),
    path = require('path'),
    getStat = require('./stat.js')
async function rename (targetPath, reg, result, type = 0) { // 默认情况从前往后匹配的,当是特别指定匹配后缀的时候,加一个参数tyoe = 1
    var item = await co(fs.readdir, targetPath)
    item.forEach(
        async (names) => {
            var oldPath = path.resolve(targetPath, names)
            var bool = await isFile(oldPath)
            regs = new RegExp(type === 1 ? reg + '$ ' : reg)
            if (regs.test(names) && bool) {
                var newPath = path.resolve(targetPath, names.replace(regs, result))
                co(fs.rename, oldPath, newPath)
            }
        }
    )
}
async function isFolder (path) {
    return await getStat(path) === 1
}
async function isFile (path) {
    return await getStat(path) === 0
}


module.exports = rename