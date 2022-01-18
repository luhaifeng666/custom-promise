/**
 * 防抖
 * @param fn
 * @param delay
 */
function debounce (fn, delay) {
	// 保存延时
	let timer = null
	// 将debounce的处理结果以函数形式返回
	return function () {
		// 保存执行时上下文
		const context = this
		// 保存执行时传入的参数
		const args = arguments
		// 如果存在定时器，则将其清除
		timer && clearTimeout(timer)
		// 设置新的定时器
		timer = setTimeout(() => {
			fn.apply(context, args)
		}, delay)
	}
}
