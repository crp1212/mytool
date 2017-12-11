const fs = require('fs')
const co = require('./util/co_async.js')
const getStat = require('./tool/stat.js')
const root = process.cwd()
const path = require('path')
const dirs = require('./tool/dirs.js')

var count = 0 

async function rm (rootPath) { // file or folder
    var val = await getStat(rootPath)
    if (val === 0) { // 文件时候直接删除
        await co(fs.unlink, rootPath, (err) => { if (err) { console.error(err) } })
    } else if (val === 1) {
        var bool = await dirs(rootPath)
        if (!bool) { // 空的,直接删除文件夹
            await co(fs.rmdir, rootPath, (err) => { if (err) { console.error(err) } })
        } else { // 非空的时候,读取文件进行递归
            for (var i = 0; i < bool.length; i++) {
                await rm(path.resolve(rootPath, bool[i]))
            }
            await co(fs.rmdir, rootPath, (err) => { if (err) { console.error(err) } })
        }
    }
    return rootPath
}
rm(path.resolve(root, 'test'))


