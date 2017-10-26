const http    = require('http'),
	  fs  	  = require('fs'),
	  cheerio = require('cheerio'),
	  request = require('request'),
	  axios   = require('axios') ,
	  iconv   = require('iconv-lite');
axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded';

function getBt (str) {
	axios.get('http://www.zhaonima.com/magnet/'+str+'.html')
		.then(
			x => {
				var $ = cheerio.load(x.data)
				var arr = []
				$('.btsowlist').html().replace(/\/(\w+?)\.html/g,function(x,y){arr.push('magnet:?xt=urn:btih:'+y)})
				console.log(arr)
			}
		)
}

module.exports = getBt