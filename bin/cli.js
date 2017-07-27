#! /usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    program = require('commander'),
    exec = require('child_process').exec,
    fileTypeArr = ['js','css','html','vue','py'],//可以有模板的文件后缀
    opn = require('opn') ,
    chalk = require('chalk'),
    commonpath = require('../commonpath.json') ,
    util = require('../util');

program.version(require('../package.json').version)
program.usage('[options] [project name]')
program.parse(process.argv);

var bool = false,//判断是否有同名文件或者文件夹
	fileName,
    pname = program.args[0],
    temPath = path.resolve(__dirname ,"../"),//得到tem文件夹所在的路径
    cmdpath = process.cwd() ;//cmd执行命令时所在路径
function errFn(err){
	err ? console.error(err) : ""
}
function fsPro(fsFn){
	var arg=[].slice.call(arguments,1)
	return new Promise(
		(resolve,reject) => {
			arg.push(function(err,data){
				errFn(err)
				resolve(data)
			})
			fsFn.apply(null,arg)
		}				
	)
}


switch(pname){
	case 'o' : 
		openfolder();
	break;
	case 'f' : 
		newFolder()
	break;
	default :
		pname.split(',').forEach(x=>newFile(x))
}


function newFolder(){
	if(program.args[1]){
		if(program.args[2]){
			createFloder(temPath+'/tem/folder/'+program.args[2],program.args[1])
		}else{
			createFloder(temPath+'/tem/folder/tem',program.args[1])	
		}
	}else{
		createFloder(temPath+'/tem/folder/tem','myProject')
	}
}
function createFloder(target,aims){//target是要复制的目录,aims是要生成的目录
	target = target.replace(/\\/g,'/')
	fsPro(fs.stat,target)
	.then((stats)=>{
		if(!stats){return ''}
		if(stats.isDirectory()){
			fsPro(fs.mkdir,aims) 
			.then(()=>{
				console.log(target)
				fsPro(fs.readdir,target)
			})
			.then((files)=>{
				if(files){
					console.log(files)
					files.forEach((x)=>{
						createFloder(target+'/'+x,aims+'/'+x)
					})
				}
			})
		}else if(stats.isFile()){
			fsPro(fs.readFile,target)
			.then((data)=>{
				fsPro(fs.writeFile,aims,data)
			})
		}
	}).catch(err=>console.log(err))
}
function newFile(pname){
	if(pname=='.git'){
	   		fs.writeFile('.gitignore','',function(err){if(err){console.log(err)}})
	   		return ''
	 }
	var arr=pname.split(".");
	var type=arr[arr.length-1];//得到文件后缀,判断生成的文件
	//如果不是存在模板的文件类型,直接就生成空文件
	if(!sameFileOrFolder(fileTypeArr,type)){
		fs.writeFile(pname,'',function(err){if(err){console.log(err)}});
		opnefile(pname);
		return ''
	}
	fsPro(fs.readdir,temPath+'/tem/'+type)
	.then((files)=>{
		bool=sameFileOrFolder(files,pname)
	   if(bool){//如果为true，则存在同名的文件，然后直接复制这个
			fileName=arr.slice(0,arr.length-1).join('.')
		}else{//如果不存在，查看是否有第二个参数指定需要复制的文件
			fileName=program.args[1]||'tem';//
		}
		var readPath=temPath+'/tem/'+type+'/'+fileName+'.'+type
		if(pname){
			fsPro(fs.readFile,readPath)
			.then((data)=>{
				fsPro(fs.writeFile,pname,data.toString())
			}).then(()=>{
				opnefile(pname,program.args[2])
			})
		}else{
			console.log('no file name')
		}
	})
}

function sameFileOrFolder(arr,name){
    var bool = arr.some( val => val === name)
    return bool
}

function opnefile(pname,bool){//bool判断是否用浏览器打开,个人默认是谷歌
	var subl='subl '+pname;
	bool ? opn(campath+'/'+pname,{app: ['chrome']}) : "" 
	exec(subl,(error,stdout,stderr) => {
		error ? console.error(error) : ""
	})
}

function openfolder(){//适用于window
	var str = program.args[1] ;
	if(commonpath[str] == void 0){
		console.log(chalk.bgYellowBright.black('param ERR: ')+'  '+chalk.bgRed.white('such folder is no exist'));
		return ''
	}
	var commandStr = 'start ' + commonpath[str] ;
	exec(commandStr,(error,stdout,stderr)=>{
		if(error){console.error(error)}
	})
}
function addstr(){
	var  arr = [].slice.call(arguments) ;
	var  str = arr.slice(-1) ;
	return util.isObject(str) 
		? arr.slice(0,-1).join(str.ps)
		:  arr.join('/') 
}