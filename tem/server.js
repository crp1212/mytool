var http=require('http');
var fs=require('fs');
var url=require('url');
var querystring=require('querystring');//node内置
var server=http.createServer(function(req,res){
	if(req.url!=='/favicon.ico'){
		var out=fs.createWriteStream('./request.log')
		out.write('客户端请求方法: '+req.method+'\r\n')
		out.write('客户端请求url字符串: '+req.url+'\r\n')
		out.write('经过url模块更改的url： '+JSON.stringify(url.parse(req.url))+'\r\n')
		out.write('客户端请求头对象: '+JSON.stringify(req.headers)+'\r\n')
		out.write('客户端请求所用http版本: '+req.httpVersion+'\r\n')
		req.on('data',function(data){//监听客户端的发送过来的数据
			console.log(data.toString())
		})
		req.on('end',function(){//可以读取到trailers的信息

		})
		res.writeHead(200,{//编写请求头对象
			'Content-Type':'text/plain',
			'Access-Control-Allow-Origin':'http://127.0.0.1:1592'//允许跨域的域名+端口号
		})
		//var pathname=url.parse(req.url).pathname
		res.write('<html><head></head><body>')//每一次write都是叠加的
		if(req.url=='/index.html'){//这种方法可以针对不同的url做处理了
			res.write('<div>is index啊实打实的</div></body></html>');
			console.log('yes index.html')
		}
		res.on('close',function(){

		})
	}
	res.end()
})
server.listen('1591',function(){//在服务起开启时响应
	console.log('this is good')
})
server.on('connection',function(socket){//客户端连接时响应
	console.log('this')
})
/*server.setTimeout(10000,function(socket){//客户端的请求响应超时时触发
	console.log('响应超时')
	console.log(socket)
})*/

var getIp=function(){
	var os=require('os'),
	 	ipStr,
		infaces=os.networkInterfaces(),
	 	bool=false;
	for(var i in infaces){
		infaces[i].some(function(x){
			if((x.family=='IPv4')&&(x.internal == false)){
				ipStr=x.address;
				bool=true;
				return true
			} 
		})
		if(bool){break}
	}
	return ipStr
}
console.log(getIp())
console.log(querystring.stringify({username:'11'}))
