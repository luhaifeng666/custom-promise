/**
 * 手写bind函数
 * @param context 传入的执行上下文
 */
Function.prototype.myBind = function (context) {
	try {
		// 如果传入的context是null/undefined, 将context指向window
		if ([undefined, null].includes(context)) context = window
		// 如果执行bind的不是函数，则报错
		if (typeof this !== 'function') throw new Error('调用bind的必须是函数！')
		// 获取传入的其他参数
		const args = [...arguments].slice(1)
		// 缓存this
		const _this = this
		// 返回函数
		return function F() {
			// 如果返回的函数当做构造函数使用，需要判断下是否可以实例化
			if (this instanceof F) {
				return new _this(...args, ...arguments)
			}
			return _this.apply(context, args.concat(...arguments))
		}
	} catch (e) {
		console.error(e)
	}
}
