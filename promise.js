// 定义Promise构造函数
function Promise(executor) {
	this.promiseState = 'pending'
	this.promiseResult = null

	const self = this
	// 定义resolve函数
	function resolve (data) {
		// 如果当前Promise的状态不是pending，则不执行以下逻辑
		if (self.promiseState !== 'pending') return
		// 修改Promise的状态
		self.promiseState = 'fulfilled'
		// 保存结果值
		self.promiseResult = data
	}

	// 定义reject函数
	function reject (data) {
		// 如果当前Promise的状态不是pending，则不执行以下逻辑
		if (self.promiseState !== 'pending') return
		// 修改Promise的状态
		self.promiseState = 'rejected'
		// 保存结果值
		self.promiseResult = data
	}
	// 使用抛出异常打断Promise执行的处理
	try {
		executor(resolve, reject);
	} catch (e) {
		reject(e)
	}
}

Promise.prototype.then = function (onResolved, onRejected) {}
