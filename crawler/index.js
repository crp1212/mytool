const http    = require('http'),
	  fs  	  = require('fs'),
	  cheerio = require('cheerio'),
	  request = require('request'),
	  axios   = require('axios') ,
	  iconv   = require('iconv-lite');
axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded';


function getSSQ (str) {
	var obj = {}
	var count = 0
	var initNum = 2017126
	async function gets (num) {
		var data = await axios.get(`http://caipiao.163.com/award/ssq/${num}.html`) 
		var arr = []
		var $ = cheerio.load(data.data)
		$('#zj_area').html().replace(/\>(\d+?)\</g, (num, $1) => arr.push($1))
		obj[num] = arr
		count ++
		writerStream.write(`"${num}":[${arr.join(',')}],`,'UTF8');
		if (count === 1000) {
			writerStream.end();
		}
	}
	for (var i = 0; i < 1000; i++) {
		gets(initNum--)
	}
}

async function getStockNum (stockNum) { // 爬取的是东方财富的股票信息
	var stockType = {
		'0': 2,
		'6': 1
	}
	var data = await axios.get(`http://nuff.eastmoney.com/EM_Finance2015TradeInterface/JS.ashx?id=${stockNum}${stockType[stockNum[0]]}`)
	var arr
	data.data.replace(/callback\((.+?)\)/, (str, result) => {
		arr = JSON.parse(result).Value
	})
	return arr
}

module.exports = {
	getStockNum
}