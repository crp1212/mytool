#! /usr/bin/env node
/* 
    通过async await方式重写
*/
var fs = require('fs'),
    path = require('path'),
    program = require('commander'),
    exec = require('child_process').exec,
    fileTypeArr = ['js','css','html','vue','py','jsx'],//可以有模板的文件后缀
    opn = require('opn') ,
    chalk = require('chalk'),
    commonpath = require('../commonpath.json') ,
    websitepath = require('../website.json')
    util = require('../util/index.js'),
    getBt = require('../crawler') ,
    rename = require('../tool/rename.js')

program
    .version(require('../package.json').version)
    .usage('[options] [project name]')
    .option('-o, --openfloder', 'open a floder with the specified name')
    .option('-f, --createfloder', 'create a new floder with the template')
    .option('-t, --createfile', 'create a new file in specified floder')
    .option('-w, --openwebsite', 'open website which my appoint')
    .option('-b, --bts', 'open website which my appoint')
    .option('-r, --rename', 'rename the file in the folder')
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
	case program.openwebsite:
		openWebsite()
	break
	case program.bts:
		getBt(pname)
    break
    case program.rename:
        rename(cmdpath, new RegExp(program.args[0]), program.args[1])
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
    var arr = pname.split("."),
        suffix = arr.slice(-1)[0],
        type = arr[arr.length - 1] // 得到文件后缀,判断生成的文件
    switch (true) {
        case hasFile(pname):
            openfile(pname)
            break;
        case !!fileMap[pname]:
            writeFileHandle(fileMap[pname], "")
            break;
        case !sameFileOrFolder(fileTypeArr, suffix):
            writeFileHandle(pname, "")
            break;
        default:
            var paths = addstr(temPath, suffix)
            var files = await fsPro(fs.readdir, paths)
            var hasSameFileOrFolder = sameFileOrFolder(files, pname)
            var readName = hasSameFileOrFolder ? addstr(paths, pname) : addstr(paths, addstr(program.args[2] || 'tem', suffix, { ps: "." }))
            var data = await fsPro(fs.readFile, readName)
            writeFileHandle(pname, data.toString(), program.args[1])
    }
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