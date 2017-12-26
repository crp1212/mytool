const _c = require('copy')
const cwd = process.cwd()
const path = require('path')

_c(path.resolve(cwd, 'tool/*.js'), path.resolve(cwd, 'foo'), () => {
    console.log('复制完成')
})