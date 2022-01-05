/**
 * 手写call
 * @param context 执行上下文
 */
Function.prototype.myCall = function (context) {
	try {
		// 如果传入的context是null/undefined, 将context指向window
		if ([undefined, null].includes(context)) context = window
		// 如果调用call的不是函数，则抛出错误
		if (typeof this !== 'function') throw new Error('调用call的必须是函数！')
		// 将调用call的函数添加到context上
		context._fn = this
		// 获取传进来的参数列表
		const args = Array.from(arguments).slice(1)
		// 执行函数
		const res = context._fn(...args)
		// 移除函数
		delete context._fn
		// 返回结果
		return res
	} catch (e) {
		console.error(e)
	}
}
