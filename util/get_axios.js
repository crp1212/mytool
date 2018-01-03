const axios = require('axios')
const query = require('querystring')

class GetAxios {
    constructor () {
        
    }
    get (path) {
        var params = query.parse(path.split('?')[1])
    }
}
console.log()