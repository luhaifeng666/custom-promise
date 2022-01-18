/**
 * 节流函数
 * @param fn
 * @param delay
 */
function throttle (fn, delay) {
	// 上一次的调用时间
	let lastTime = 0

	// 将throttle结果以函数形式返回
	return function () {
		// 保存执行时上下文
		const context = this
		// 保存调用throttle结果函数时传入的参数
		const args = arguments
		// 本地调用的时间
		const time  = new Date()
		// 如果本次调用时间减去上一次的调用时间大于延迟时间，则触发传入的fn
		if (time - lastTime > delay) {
			lastTime = time
			fn.apply(context, args)
		}
	}
}
