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
    path = require('path')
async function rename (targetPath, reg, result) {
    var item = await co(fs.readdir, targetPath)
    item.forEach(
        async (names) => {
            var oldPath = path.resolve(targetPath, names)
            var bool = await isFile(oldPath)
            if (reg.test(oldPath) && bool) {
                var newPath = path.resolve(targetPath, names.replace(reg, result))
                co(fs.rename, oldPath, newPath)
            }
        }
    )
}
async function isFolder (path) {
    var stat = await co(fs.stat, path)
    return stat.isDirectory()
}
async function isFile (path) {
    var stat = await co(fs.stat, path)
    return stat.isFile()
}
module.exports = rename