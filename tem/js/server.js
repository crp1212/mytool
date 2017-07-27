var http=require('http');
var fs=require('fs');
var url=require('url');
var querystring=require('querystring');//node内置
var server=http.createServer(function(req,res){//创建服务器，req是客户端请求，res是服务端响应对象;
	/*
		req即request的属性:
			req.method:客户端请求使用的方法
			req.url:客户端使用的url字符串,即hostname:port之后的部分,例如127.0.0.1：1591/test的url为/test
			req.headers:客户端发送的请求头信息(包括cookie信息以及浏览器信息)
			req.httpVersion:HTTP版本,可能值为1.1和1.0

	*/
	/*
		res即response,发送服务器端响应流
		res.writeHead(status,[reasonPhrase],[headers])
			status:状态码
			reasoonPhrase:描述状态码信息的字符串,可选
			headers:服务器端创建的响应头对象
				content-type:用于指定内容信息,例如text/html将指定浏览器解析html文件而不是直接显示为字符串
				location:用于将客户端重定向到另一个地址
				set-cookie:用于在客户端创建一个cookie
				Access-Control-Allow-Origin:允许跨域的地址
	*/
	var datas;
	if(req.url!=='/favicon.ico'){//浏览器会默认的为页面在收藏夹的显示图标请求一次,默认为favicon.ico
		var out=fs.createWriteStream('./request.log')
		out.write('客户端请求方法: '+req.method+'\r\n')
		out.write('客户端请求url字符串: '+req.url+'\r\n')
		out.write('经过url模块更改的url： '+JSON.stringify(url.parse(req.url))+'\r\n')
		out.write('客户端请求头对象: '+JSON.stringify(req.headers)+'\r\n')
		out.write('客户端请求所用http版本: '+req.httpVersion+'\r\n')
		req.on('data',function(data){//监听客户端的发送过来的数据
			//console.log(data)//Buffer数据
			//console.log(data.toString())//转化为utf-8
			datas=data.toString();
		});
		req.on('end',function(){//可以读取到trailers的信息

		})
		res.writeHead(200,{//编写请求头对象
			'Content-Type':'text/html',
			'Access-Control-Allow-Origin':'http://127.0.0.1:1592',//允许跨域的域名+端口号
			'location':'http://www.baidu.com',
		})
		//var pathname=url.parse(req.url).pathname
		/*res.write('<html><head></head><body>')//每一次write都是叠加的
		if(req.url=='/index.html'){//这种方法可以针对不同的url做处理了
			res.write('<div>is index啊实打实的</div></body></html>');
			console.log('yes index.html')
		}*/
		switch(req.url){
			case '/index.html':
				var data = fs.readFileSync('./test.html');//同步读取
				res.write(data.toString());
			break;
			case '/sel.js':
				var data = fs.readFileSync('./sel.js');
				res.write(data.toString())
			break;
			default:console.log(datas)
		}
		
		res.on('close',function(){

		})
	}
	res.end()
})
server.listen('1591',function(){//在服务起开启时响应
	console.log('this is good')
})
/*server.listen(port,host,backlog,function(){
	host和backlog可选;
	存在host时,服务器将监听来自host的请求,其他的不接收;不设置时，默认监听所有IPV4地址的客户端链接

})*/
/*server.setTimeout(3000,function(){//暂时功能不明
	console.log('服务器超时')
})*/
/*server.on('connection',function(socket){//客户端连接时响应,每当有一个http请求时响应一次
	console.log('this')
})*/
/*server.on('request',function(req,res){
	//如果不在createServer的时候插入回调函数,可以使用事件监听,监听客户端请求
})*/
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
//console.log(querystring.stringify({username:'11'}))
