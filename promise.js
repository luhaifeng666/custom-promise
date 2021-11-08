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

// 实现resolve方法
Promise.resolve = function (value) {
  // 返回Promise对象
	return new Promise((resolve, reject) => {
		if (value instanceof Promise) {
			value.then(res => {
				resolve(res)
			}, err => {
				reject(err)
			})
		} else {
			resolve(value)
		}
	})
}

// 实现reject方法
Promise.reject = function (value) {
	return new Promise((resolve, reject) => {
		reject(value)
	})
}

// 实现all方法
Promise.all = function(arr) {
	if (!isPromiseArray(arr)) return Promise.reject(arr)
	return new Promise((resolve, reject) => {
		// 添加resolve数量标记
		let count = 0
		// 添加返回值数组
		let resArr = []
		// 遍历arr数组
		arr.forEach((item, index) => {
			item.then(res => {
				// 增加resolve的数量
				count ++
				// 将结果按照原先的顺序存入数组
				resArr[index] = res
				// 如果全部都是resolve的状态，则返回结果
				if (count === arr.length) {
					resolve(resArr)
				}
			}, err => {
				reject(err)
			})
		})
	})
}

// 实现race方法
Promise.race = function(arr) {
	if (!isPromiseArray(arr)) return Promise.reject(arr)
	return new Promise((resolve, reject) => {
		arr.forEach(item => {
			item.then(res => {
				// 第一个执行完成后是成功状态，race的结果就是成功，直接改变状态为resolved
				resolve(res)
			}, err => {
				// 第一个执行完成后是失败状态，则race的结果就是失败，直接改变为rejected状态
				reject(err)
			})
		})
	})
}

// 判断arr是否是个Promise数组
function isPromiseArray (arr) {
	return Array.isArray(arr) && arr.every(item => item instanceof Promise)
}
