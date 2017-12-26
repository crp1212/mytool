const fs = require('fs')
const path =require('path')
const cwd = process.cwd()

function match (str) {
    var index = 0
    var arr = str.split('/')
    var result = []
    var tem = ''
    arr.forEach((x, y) => {
        if (x === '.' || x === '..') {
            tem += x + '/'
        } else {
            tem += x
            result.push(tem)
            tem = ''
        }
    })
    return result
}

/* 
    如果前一个文件夹不存在,则后续的都是要创建的
*/

function createFolder (arr) {
    let target = ''
    let i = 0
    while (i < arr.length) {
        target = path.resolve(target, arr[i])
        fs.mkdirSync(target)
        i ++
    }
}



function needCreateFolderArr (arr) {
    let i = 0
    let str = cwd
    while (i < arr.length) {
        str = path.resolve(str, arr[i])
        if (!fs.existsSync(str)) {
            return [str].concat(arr.slice(i + 1))
        }
        i++
    }
    return []
}

function createNewFolder (str) {
    var result = match(str)
    console.log(result)
    createFolder(needCreateFolderArr(result))
} 
module.exports = createNewFolder




