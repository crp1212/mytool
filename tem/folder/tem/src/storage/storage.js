import {sel} from "../js/sel.js"
var sto=(function(){
	var setFn=function(key,val){
		localStorage.setItem(key,val)
	}
	var getFn=function(key){
		return localStorage.getItem(key)
	}
	var fn=function(obj,str){
		if(sel.isString(obj)&&sel.isString(str)){//两个都是字符串时
			setFn(obj,str)
		}else if(sel.isString(obj)){
			return getFn(obj)
		}else if(sel.isObject(obj)){
			for(var i in obj){setFn(i,obj[i])}
		}else{
			console.log('no valid data')
		}
	}
	return fn
})()
export {sto} 