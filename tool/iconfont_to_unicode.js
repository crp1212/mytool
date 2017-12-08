var co = require('../util/co_async.js')
var fs = require('fs')
async function getUnicodeJson () {
    var data = await co(fs.readFile ,'../iconfont.css')
    var content = data.toString()
    var arr = content.match(/(\w+)(?=\:b)|(\w+)(?=\"\;)/g)
    var jsonStr = ''
    var len = arr.length - 2
    arr.slice(1).map((key, index) => { // 第一个会是不需要的iconfont, 这里直接跳过
        if (index % 2 === 0) {
            jsonStr += '"'+key+'" : '
        } else {
            console.log(key, index, len)
            jsonStr += parseInt(key, 16) + (index === len ? '' : ', ')
        }
    })
    fs.writeFile('../iconfont.json', '{'+jsonStr+'}', (err) => console.log(err))
}
getUnicodeJson()