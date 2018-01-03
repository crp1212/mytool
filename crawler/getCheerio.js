const fs = require('fs')
const cheerio = require('cheerio')
const axios = require('axios') 
const query = require('querystring')
const AXIOS_BASE_CONFIG = require('./config.js').AXIOS_BASE_CONFIG
const url = require('url')

var obj = AXIOS_BASE_CONFIG

function getAxiosObj (path) {
    var arr = path.split('?')
    var querystr = arr[1]
    obj.url = arr[0]
    obj.params = query.parse(querystr)
    return obj
}

async function getCheerio (path) {
    var data = await axios(getAxiosObj(path))
    var $ = cheerio.load(data.data,{decodeEntities: false})
    return $ 
}

module.exports = getCheerio