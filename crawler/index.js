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

/* var writerStream = fs.createWriteStream('new.json');

// 处理流事件 --> data, end, and error
writerStream.on('finish', function() {
    console.log("写入完成。");
});

writerStream.on('error', function(err){
   console.log(err.stack);
}); */

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

 module.exports = getBt