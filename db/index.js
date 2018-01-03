const crud = require('./crud.js')
var mysql      = require('mysql');

function linkDB (db) {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : db
    })
    connection.connect()
    console.log('数据库链接成功')
    return new crud(connection)
}

module.exports = linkDB