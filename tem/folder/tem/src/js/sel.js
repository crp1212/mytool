var sel=(function(){
	var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	//已有的原型函数封装
	var hasOwnproperty=function(obj,key){
		return Obejct.prototype.hasOwnproperty.call(obj,key)
	}
	//定义常用函数
	var isArraylike=function(collection){
		var length = collection != null && collection.length;
   		return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	};
	var isObject=function(obj){
    	return Object.prototype.toString.call(obj)=='[object Object]'
	};
	var isArray=function(arr){
		return Object.prototype.toString.call(arr)=='[object Array]'	
	}
	var isString=function(str){
		if(arguments.length>1){
			return _.every(arguments,function(x){return isString(x)})
		}else{
			return typeof str=='string'	
		}
		
	}
	var _=function(ele){
		var list=document.querySelectorAll(ele);
		return new List(list)
	};
	//定义工具函数
	_.each=function(obj,fn,jud){
		if(isArray(obj)||isArraylike(obj)||isString(obj)){
			for(var i=0,len=obj.length;i<len;i++){
				var bool=fn.call(obj,obj[i],i,obj);
				if(bool==jud&&bool!=void 0){return bool}//得到回调函数的值并做判断
				if(jud==false&&bool==void 0){return false}//every在bool=undefined时也触发
			}
		}else if(isObject(obj)){
			for(var i in obj){
				var bool=fn.call(obj,obj[i],i,obj);
				if(bool==jud&&bool!=void 0){return bool}//得到回调函数的值并做判断
				if(jud==false&&bool==void 0){return false}//every在bool=undefined时也触发
			}
		}
	};
	_.some=function(obj,fn){
		var bool=_.each(obj,fn,true);
		return  bool==void 0?false:bool;
	};
	_.every=function(obj,fn){
		var bool=_.each(obj,fn,false);
		return  bool==void 0?true:bool;//在全都满足时each返回的是undefined,所以做一下判断改为true
	}
	_.keys=function(obj){
		if(Object.keys){return Object.keys(obj)}
		else{
			var arr=[];
			for(var i in obj){if(hasOwnproperty(obj,i)){arr.push(i)}}
			return arr
		}
	};
	_.newArr=(num,fn)=>{
		var arr=[];
		for(var i=0;i<num;i++){
			fn.call(arr,i);
		}
		return arr
	}
	_.isObject=isObject;
	_.isString=isString;
	
	return _
})()
