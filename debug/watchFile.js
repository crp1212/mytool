const fs = require('fs')
const co = require('../util/co_async.js')
const path = require('path')
const chokidar = require('chokidar')

class Watch {
    constructor (file, inject, e) {
        this.inject = inject
        this.file = file
        this.cacheFile = {}
        this.resultFile = {}
        this.init(file, e)
    }
    async init (file, e) {
        this.resultFile[file] = await this.getFile(this.file)
        var str = await this.transfrom(file)
        var watcher = chokidar.watch(file)
        watcher.on('change', async (path) => {
            this.resultFile[file] = await this.getFile(file)
            if (!this.compareFile(file)) {
                await this.transfrom(file)
                e.ws.send('update')
            }
        })
    }
    async transfrom (file) {
        this.cacheFile[file] = this.resultFile[file]
        var content = this.resultFile[file].toString().replace(/(<\/body>)/, `<script>${ this.inject }</script>$1`)
        var bool = await co(fs.writeFile, path.resolve(__dirname, './dist/index.html'), content)
        return 'success'
    }
    async getFile (file) {
        return await co(fs.readFile, file)
    }
    compareFile (file) {
        return this.cacheFile[file].toString() === this.resultFile[file].toString()
    }
    getUuid () {
        return Date.now() + '' + Math.floor(Math.random() * 100000)
    }
}
module.exports = Watch