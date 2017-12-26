function co (cb) { // 适用于文件操作的异步
	var arg = [].slice.call(arguments, 1)
	return new Promise(
		(resolve, reject) => {
			arg.push(function (err, data) {
                if (err) {
					reject(err)
                }
				resolve(data)
			})
			cb.apply(null, arg)
		}				
	).then(data => data ).catch(err => errFn(err))
}

function errFn (err) { // 错误统一处理
	err ? console.error(err) : ""
}
module.exports = co
