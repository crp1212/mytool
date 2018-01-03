const exec = require('child_process').exec
function ww () {
    exec('start D:\\MongoDB\\Server\\3.4\\bin\\mongo.exe')
}
ww()
module.exports = ww
