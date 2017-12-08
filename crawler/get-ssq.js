const 
    util = require('../util/index.js'),
    fs = require('fs'),
    co = require('../util/co_async.js'),
    path = require('path'),
    cheerio = require('cheerio'),
    axios   = require('axios') 
const host = 'http://wap.xxbiquge.com'
var writerStream = fs.createWriteStream('new.txt')
writerStream.on('finish', function() {
    console.log("写入完成。");
})
writerStream.on('error', function(err){
    console.log(err.stack);
 })
 var count = 0
 var remindCount = 0
 var percent = 0
async function getNovel (path) {
    path = path || '/3_3078/7410604.html'
    var data = await axios.get(`${host}${path}`)
    var $ = cheerio.load(data.data,{decodeEntities: false})
    var content = ''
    content +=  '               ' + $('.title').html() + '\n'
    content += $('#chaptercontent').html().replace(/\<script>(.+)<\/script>/g,'').replace(/\<p(.+)\<\/p>/g, '').replace(/<br>/g,'\n')
    writerStream.write(content, 'UTF8')
    count++
    remindCount++
    if (remindCount === 40) {
        console.log('已完成' + percent + '%')
        percent += 4
        remindCount = 0
    }
    if (count === 500) {
        writerStream.end()
        return
    }
    getNovel($('#pt_next').attr('href'))
}
getNovel()