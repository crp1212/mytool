#! /usr/bin/env node
/* 
    通过async await方式重写
*/
var fs = require('fs'),
    path = require('path'),
    program = require('commander'),
    exec = require('child_process').exec,
    fileTypeArr = ['js', 'css', 'html', 'vue', 'py', 'jsx', 'java'],//可以有模板的文件后缀
    opn = require('opn') ,
    chalk = require('chalk'),
    commonpath = require('../commonpath.json') ,
    websitepath = require('../website.json')
    util = require('../util/index.js'),
    {getBt, getStockNum} = require('../crawler') ,
    rename = require('../tool/rename.js'),
    stockDefault = require('../stock-default.json'),
    rm = require('rimraf'),
    debugFile = require('../debug/index.js'),
    createNewFolder = require('../tool/mkdir.js'),
    downloadNovel = require('../crawler/novel/search.js')

program
    .version(require('../package.json').version)
    .usage('[options] [project name]')
    .option('-o, --openfloder', 'open a floder with the specified name')
    .option('-f, --createfloder', 'create a new floder with the template')
    .option('-t, --createfile', 'create a new file in specified floder')
    .option('-w, --debugFile', 'debug a file with hot reload')
    .option('-b, --bts', 'open website which my appoint')
    .option('-r, --rename', 'rename the file suffix in the folder; p.js => p.html  --- crp -r js html')
    .option('-s, --getStock', 'get the stock information')
    .option('-d, --del', 'delete folder or file')
    .option('-m, --mkdir', 'create a folder with long path')
    .option('-n, --novel', 'get novel')
    .parse(process.argv);

var bool = false,//判断是否有同名文件或者文件夹
	fileName,
    pname = program.args[0],
    temPath = path.resolve(__dirname, "../tem"),//得到tem文件夹所在的路径
    cmdpath = process.cwd() ;//cmd执行命令时所在路径
   
var fileMap = { // 复杂后缀名的简称
	'.g': ".gitignore",
	'.b': ".babelrc",	
}

function errFn (err) { // 错误统一处理
	err ? console.error(err) : ""
}

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

switch (true) {
	case program.openfloder: 
		openfolder()
	break
	case program.createfloder: 
		newFolder()
	break
    case program.debugFile:
        debugFile(path.resolve(cmdpath, pname), () => {
            exec('subl ' + path.resolve(cmdpath, pname), (err) => errFn(err))
        })
	break
	case program.bts:
		getBt(pname)
    break
    case program.rename:
        if (program.args[0] === undefined || program.args[0] === undefined) {
            console.log('用法错误, 用法类似于 crp -r js html')
        }
        rename(cmdpath, new RegExp(program.args[0]), program.args[1], program.args[2])
    break
    case program.getStock:
        getStock()
    break
    case program.del:
        delFn()
    break
    case program.mkdir:
        batchCreateFolder()
    break
    case program.novel:
        downloadNovel(program.args[0])
    break
    default :
		pname.split(',').forEach(x => newFile(x))
}

function newFolder () { // 生成新文件夹
	var target = program.args[1] || 'tem' 
		pname = pname || 'myProject' 
	var paths = addstr(temPath, 'folder', target),
		aims = addstr(cmdpath, pname)
    fsPro(fs.mkdir, aims)
    createFloder(paths, aims) 
}

function delFn () { // 删除指定文件或者文件夹
    rm(path.resolve(cmdpath, pname), () => {
        console.log('success')
    })
}

function openWebsite () { // 打开指定的一些网站
	if(pname){
		var pp = opn(websitepath[pname], {app: ['D:/web/SogouExplorer/SogouExplorer.exe']})
		return
	}
	var list = [websitepath.zhihu, websitepath.seg]
	list.forEach(x => opn(x, {app: ['D:/web/SogouExplorer/SogouExplorer.exe']}))
}

async function createFloder (target, aims) {//target是要复制的目录,aims是要生成的目录名
    var files = await fsPro(fs.readdir, target)
    files.forEach(
        x => {
            fileOrFolderExist(addstr(target, x), addstr(aims, x))
        }
    )
}

async function fileOrFolderExist (path, str, cb) {
    var stats = await fsPro(fs.stat, path)
    if (stats.isDirectory()) {
        fsPro(fs.mkdir, str)
        createFloder(path, str)
    } else if (stats.isFile()) {
        var data = await fsPro(fs.readFile, path)
        fsPro(fs.writeFile, str, data.toString())
    }
}

async function newFile (str) { // 生成新文件
    var arr = str.split("."),
        suffix = arr.slice(-1)[0],
        type = arr[arr.length - 1] // 得到文件后缀,判断生成的文件
    switch (true) {
        case hasFile(str):
            openfile(str)
            break;
        case !!fileMap[str]:
            writeFileHandle(fileMap[str], "")
            break;
        case !sameFileOrFolder(fileTypeArr, suffix):
            writeFileHandle(str, "")
            break;
        default:
            var paths = addstr(temPath, suffix)
            var files = await fsPro(fs.readdir, paths)
            var hasSameFileOrFolder = sameFileOrFolder(files, str)
            var readName = hasSameFileOrFolder ? addstr(paths, str) : addstr(paths, addstr(program.args[1] || 'tem', suffix, { ps: "." }))
            var data = await fsPro(fs.readFile, readName)
            var content = fileNameReplace(data.toString())
            var num = str.lastIndexOf('/')
            if (num !== -1) { // src/inec/ll.js  文件名有文件夹的时候要先判断是否存在
                createNewFolder(str.slice(0, num))
            }  
            if (suffix === 'java') {
                str = firstWordUpper(str)
            }
            writeFileHandle(str, content,  program.args[2])
    }
}

function fileNameReplace (str) { // 处理特定格式的文件,把文件名替换进去
    var arr = pname.split(".")
    var result = arr[0].split('/').slice(-1)[0]
    var bool = program.args[1] === 'rn' || arr.slice(-1)[0] === 'java' || arr.slice(-1)[0] === 'jsx'
    if (bool) {
        return str.replace(/\$/g, result[0].toUpperCase() + result.slice(1))
    } else {
        return str
    }
}

function firstWordUpper (str) { // 首字母大写
    return str.split('').map((x,y) => y === 0 ? x.toUpperCase() : x).join('')
}

function sameFileOrFolder(arr, name) { // 判断是否存在同名文件或者文件夹
    // arr中存在对应的name时,会返回索引+1 避免0时判断为false
    return arr.indexOf(name) !== -1
}

function openfile (pname, bool) { // bool判断是否用浏览器打开,个人默认是谷歌
    var subl = 'code ' + pname
    bool ? opn(path.resolve(cmdpath, pname), { app: ['chrome'] }) : ""
    exec(subl, (error, stdout, stderr) => {
        if (error) { console.log(error) }
        else { return "" }
    })
}

function openfolder(){
	var str = program.args[0] || 'cwd'
	if (commonpath[str] === void 0) {
		console.log(chalk.bgYellowBright.black('param ERR: ')+'  '+chalk.bgRed.white('such folder is no exist'));
		return ''
	}
	if(str === 'cwd'){
		commonpath[str] = cmdpath 	
	}
	var commandStr = 'start ' + commonpath[str] 
    if (program.args[1]) {
        exec('code ' + commonpath[str], (error, stdout, stderr) => {
            errFn(error)
        })
        return ''
    }
	exec(commandStr,(error,stdout,stderr)=>{
		errFn(error)
	})
}

function addstr() {
    var arr = [].slice.call(arguments)
    var str = arr.slice(-1)[0]
    return util.isObject(str)
        ? arr.slice(0, -1).join(str.ps)
        : arr.join('/')
}

function hasFile (filename) { //if has same filename in this folder
    var files = fs.readdirSync(cmdpath)
    return sameFileOrFolder(files, filename)
}

function writeFileHandle (names, data, bool) {
    if (program.createfile) {
        names = path.resolve(commonpath['tem'], names)
    }
    fs.writeFile(names, data, err => err ? console.error(err) : openfile(names, bool));
}

async function getStock () { // 获取股票中需要的信息 (名字 当前价格 涨跌幅(相对于昨天) 涨跌幅(相对于自己购买时) 自己的盈亏)
    // console.log(arr[2], arr[25], arr[29])
    // 获取的股票信息数组中 2是股票名字 25是当前价格 29是相对于昨天涨跌幅 
    var isSelfStock = !program.args[0]
    var arr = isSelfStock ? Object.keys(stockDefault) : program.args 
    arr.forEach(
        async (num) => {
            var result = await getStockNum(num)
            if (isSelfStock) {
                // 是自己的股票的时候显示出自己利润百分比和具体值
                var stockBuyPrice = stockDefault[num][0]
                var stockCount = stockDefault[num][1]
                var selfProfitPercent = ((result[25] - stockBuyPrice) * 100 / stockBuyPrice).toFixed(2)
                var selfProfitMoney = parseInt(selfProfitPercent * stockCount * stockBuyPrice / 100)
                result.push(selfProfitPercent >= 0 ? ` ${selfProfitPercent}%` : `${selfProfitPercent}%`)
                result.push(selfProfitMoney)
                arrLog(result, 2, 25, 29, -2, -1)
            } else {
                arrLog(result, 2, 25, 29)
            }
        }
    )

}

function batchCreateFolder (str = pname) {
    var num = str.lastIndexOf('/')
    if (num === -1) {
        createNewFolder(str)
    } else {
        var prefix = str.slice(0, num)
        var result = str.slice(num+1)
        result.split(',').map(key => '/' + key).forEach(key => {
            createNewFolder(prefix + key)
        })
    }
}


function arrLog (arr) { // 打印同一个数组的多个索引
    var arg = [].slice.call(arguments, 1)
    var str = arg.map(index => util.getInd(arr, index)).join('  ')
    console.log(str)
}