// 定义Promise构造函数
function Promise(executor) {
	this.promiseState = 'pending'
	this.promiseResult = null
	this.callbackList = []

	const self = this
	// 定义resolve函数
	function resolve (data) {
		// 如果当前Promise的状态不是pending，则不执行以下逻辑
		if (self.promiseState !== 'pending') return
		// 修改Promise的状态
		self.promiseState = 'fulfilled'
		// 保存结果值
		self.promiseResult = data
		// 如果当前callbackList中存在onResolved方法，取出来执行
		self.callbackList.forEach(item => {
			item.onResolved(data)
		})
	}

	// 定义reject函数
	function reject (data) {
		// 如果当前Promise的状态不是pending，则不执行以下逻辑
		if (self.promiseState !== 'pending') return
		// 修改Promise的状态
		self.promiseState = 'rejected'
		// 保存结果值
		self.promiseResult = data
		// 如果当前callbackList中存在onRejected方法，取出来执行
		self.callbackList.forEach(item => {
			item.onRejected(data)
		})
	}
	// 使用抛出异常打断Promise执行的处理
	try {
		executor(resolve, reject);
	} catch (e) {
		reject(e)
	}
}

Promise.prototype.then = function (onResolved, onRejected) {
	const self = this
	// 如果没有传入onResolved方法，需要指定默认值
	if (typeof onResolved !== 'function') {
		onResolved = res => res
	}
	// 如果没有传入onRejected方法，需要指定默认值
	if (typeof onRejected !== 'function') {
		onRejected = res => res
	}
	return new Promise((resolve, reject) => {
		// 封装函数调用
		function callback(type) {
			try {
				const result = type(self.promiseResult)
				if (result instanceof Promise) {
					// 如果返回值是promise，则将promise的结果作为返回值
					result.then(data => {
						resolve(data)
					}, err => {
						reject(err)
					})
				} else {
					// 否则直接返回
					resolve(result)
				}
			} catch (e) {
				reject(e)
			}
		}
		// 状态为fulfilled时调用onResolved方法
		if (this.promiseState === 'fulfilled') {
			callback(onResolved)
		}

		// 状态为rejected时调用onRejected方法
		if (this.promiseState === 'rejected') {
			callback(onRejected)
		}

		// 状态为pending时，需要保存回调
		if (this.promiseState === 'pending') {
			// 保存回调状态
			this.callbackList.push({
				onResolved: function () {
					callback(onResolved)
				},
				onRejected: function () {
					callback(onRejected)
				}
			})
		}
	})
}

// 实现catch方法
Promise.prototype.catch = function (onRejected) {
	this.then(undefined, onRejected)
}
