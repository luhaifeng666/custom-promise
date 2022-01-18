/**
 * 更健壮的节流，融合了防抖的思想
 * @param fn
 * @param delay
 */
function strongerThrottle (fn, delay) {
	// 保存计时器与最后一次调用时间
	let timer = null
	let lastTime = 0
	// 将调用strongerThrottle的结果以函数形式返回
	return function () {
		// 保存执行上下文
		const context = this
		// 保存传入的参数
		const args = arguments
		// 保存当前调用时间
		const time = new Date()
		// 如果当前调用的时间减去最后一次调用的时间小于延迟时间，则设置定时器
		if (time - lastTime < delay) {
			// 如果存在定时器，则先清空
			timer && clearTimeout(timer)
			// 设置新的定时器
			timer = setTimeout(function () {
				lastTime = time
				fn.apply(context, args)
			}, delay)
		} else {
			// 如果超出时间，则给出响应
			lastTime = time
			fn.apply(context, args)
		}
	}
}
