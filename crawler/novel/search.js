const fs = require('fs')
const getCheerio = require('../getCheerio.js')
const readline = require('readline')
const start = require('./start.js')



const BASE_PATH_LIST = [
    {
        path: 'http://zhannei.baidu.com/cse/search?s=5199337987683747968&q=#str#&submit=',
    }
]

function replaceSearchStr (str, val) {
    return str.replace('#str#', val)
}

function trim (str) {
    return str.replace(/\s/g, '')
}

function log (arr) {
    arr.forEach((val, index) => {
        console.log(index + '.' + val.join(','))
    })
}

async function search (val) {
    var path = replaceSearchStr(BASE_PATH_LIST[0].path, val)
    var $ = await getCheerio(path)
    //var target = // 目标链接
    var parents = $('.result-game-item')
    var len = parents.length
    var i = 0
    var arr = []
    while (i < len) {
        arr[i] = [
            trim(parents.eq(i).find($('.result-game-item-title')).text()),
            trim(parents.eq(i).find($('.result-game-item-info-tag')).eq(0).text())
        ]
        i++
    }
    log(arr)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '请输入> '
      });
    rl.question('您想要哪一本:   ', val => {
        var url = $('.result-game-item').eq(val).children().first().attr('onclick').match(/\'(.+?)\'/)[0]
        console.log('已选择   ' + arr[val][0])
        start(url.replace(/\'/g, ''), arr[val][0]) 
        rl.close()
    })
}

module.exports = search