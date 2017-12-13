const fs = require('fs')
const express = require('express')
const http = require('http')
const app = express()
const url = require('url')
const WebSocket = require('ws')
const opn = require('opn')
const chokidar = require('chokidar')
const path = require('path')

function createServer() {
	var event = {} 
    app.get('/', function(req, res){
        fs.readFile(path.resolve(__dirname, './dist/index.html'), function (err, data) {
            res.send(data.toString())
        })
    })
    app.use(function (req, res) {
        res.send({
            msg: "hello"
        });
    });
    app.use(express.static('dist'))

    const server = http.createServer(app);
    const wss = new WebSocket.Server({
        server
    });
    
    wss.on('connection', function connection(ws, req) {
		event.ws = ws
        const location = url.parse(req.url, true);
        // You might use location.query.access_token to authenticate or share sessions
		// or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
		ws.send('连接成功')
    });
    
    server.listen(8080, function listening() {
        console.log('Listening on %d', server.address().port)
        opn('http://localhost:8080')
	})
	return event
}

module.exports = createServer