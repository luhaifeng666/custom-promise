/**
 * 手写实现apply
 * @param context 执行上下文
 * @param args 传入的参数数组
 */
Function.prototype.myApply = function (context, args) {
	try {
		// 如果传入的context是undefined/0/false/null/'', 则将执行上下文指向window
		context = context || window
		// 判断传入的args是不是数组，不是数组的话要抛出错误
		if (args && !Array.isArray(args)) throw new Error('参数列表必须是数组')
		// 如果不是函数，则需要抛出错误
		if (typeof (this) !== 'function') throw Error('调用apply的必须是函数！')
		// 在context上绑定需要执行的函数
		context._fn = this
		// 调用函数
		const res = context._fn(...(args || []))
		// 移除对象上的_fn
		delete context._fn
		// 返回结果
		return res
	} catch (e) {
		console.error(e)
	}
}
