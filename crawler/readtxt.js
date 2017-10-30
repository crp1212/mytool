var fs = require('fs')
function fsPro (fsFn) {
	var arg=[].slice.call(arguments, 1)
	return new Promise(
		(resolve, reject) => {
			arg.push(function(err, data){
                errFn(err)
                if (err) {
                    reject(err)
                }
				resolve(data)
			})
			fsFn.apply(null, arg)
		}				
	)
}

function errFn(err){
	err ? console.error(err) : ""
}

async function getContent () {
    var data = await fsPro(fs.readFile, 'test.txt')
    var obj = {}
    var arr = data.toString().split(';')
    console.log(arr.length)
    arr.forEach(
        x => {
            if (!x) {return}
            var arr = x.split(':')
            var key = arr[0]
            obj[key] = arr[1].split(',')
        }
    )
    fs.writeFile('test.json', JSON.stringify(obj), err => console.error(err))
    
}

getContent()