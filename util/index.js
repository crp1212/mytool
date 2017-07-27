var util = {} ,
	toString = Object.prototype.toString

util.isFunction = x => toString.call(x) == '[object Function]' 
util.isArray    = x => toString.call(x) == '[object Array]'  
util.isObject   = x => toString.call(x) == '[object Object]'  

module.exports = util