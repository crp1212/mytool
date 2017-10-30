function co (cb) { // 适用于文件操作的异步
	var arg = [].slice.call(arguments, 1)
	return new Promise(
		(resolve, reject) => {
			arg.push(function (err, data) {
                errFn(err)
                if (err) {
                    reject(err)
                }
				resolve(data)
			})
			cb.apply(null, arg)
		}				
	)
}

function errFn (err) { // 错误统一处理
	err ? console.error(err) : ""
}
module.exports = co
