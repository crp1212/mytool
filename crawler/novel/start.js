const fs = require('fs')
const getCheerio = require('../getCheerio.js')
const path = require('path')
const { URL } = require('url')
const createFolder = require('../../tool/mkdir.js')
const linkDB = require('../../db')
const DBNAME = 'noveltest'

async function start (host, bookName) {
    var db = createDB(bookName)
    host = host.replace('www', 'wap')
    var $ = await getCheerio(host)
    console.log('开始爬取   ' + bookName)
    await writeChapterInDB(host, bookName, $, db)
    var list = await battchWrite(bookName, db)
    console.log(list)
    
    // 新建一个对应名字的文件夹
    console.log('创建文件夹')
    createFolder(bookName)
    // 开启文件读写的流
    console.log('新建文件写入内容')
    var writerStream = stream(bookName)
    console.log('写入开始')
    var result = await generateTxt(writerStream, db, bookName) 
    console.log(result)
    db.end()
}

async function battchWrite (bookName, db) {
    var list = await queryCharter(bookName, db, 'isNULL(content)')
    var len = list.length
    console.log(len)
    var i = 0
    while (i < len) {
        var obj = list[i]
        await writeContentToDB(bookName, obj.href, db, 'id=' + obj.id)
        i++
    }
    return '内容写入数据库完成'
}

async function writeChapterInDB (host, bookName, $, db) {
    console.log('开始写入章节到数据库')
    var arr = await getChapterList(host, $)
    db.insertList(bookName, arr)
    console.log('写入章节完成')
}

async function queryCharter (bookName, db, condition) {
    var list = await db.searchTable({
        table: bookName,
        key: 'id, href',
        condition: condition
    })
    return list
}

async function writeContentToDB (bookName, url, db, condition) {
    var $ = await getCheerio(url)
    var content = $('#chaptercontent').html().replace(/\<script>(.+)<\/script>/g,'').replace(/\<p(.+)\<\/p>/g, '').replace(/<br>/g,'\n')
    console.log($('.title').html())
    await db.update(bookName, { content, condition })
    return 1
}
function createDB (name) {
    var db = linkDB(DBNAME)
    db.createTable(name, {// 创建表
        id: 'int auto_increment',
        href: 'varchar(255)',
        content: 'Text',
        title: 'varchar(255)',
        primary: 'id'
    })
    return db
}

function stream (name = 'new') {
    var writerStream = fs.createWriteStream(path.resolve(process.cwd(), name, name + '.txt'))
    writerStream.on('finish', function() {
        console.log("写入完成。");
    })
    writerStream.on('error', function(err){
        console.log(err.stack);
    })
    return writerStream
}

async function generateTxt (writerStream, db, bookName) {
    var id = 1
    var len = await db.count(bookName)
    len = len['count(*)']
    while (id <= len) {
        var obj = await db.searchTable({
            table: bookName,
            condition: 'id=' + id,
            key: 'content,title'
        })
        var content = ''
        content +=  '               ' + obj.title + '\n'
        content += obj.content
        writerStream.write(content, 'UTF8')
        id++
    }
    return '写入完成'
}

async function getChapterList (host, $, arr=[]) { // 获取章节
    var prefix = $('meta[property="og:url"]').attr('content')
    var list = $('.directoryArea').eq(1).find('a')
    var len = list.length
    var i = 0
    while (i < len) {
        var obj = list.eq(i)
        arr.push({
            title: obj.text(),
            href: prefix + obj.attr('href')
        })
        i++
    }
    var next = $('.right a').attr('href')
    if (!next) { 
        return arr
    } // 不存在下一页的时候停止
    var url = new URL(next, host).href
    console.log(url)
    $ = await getCheerio(url)
    return getChapterList(host, $, arr)
}

module.exports = start
