/**
 * 冒泡排序
 * @param arr
 * @returns {*[]}
 */
function bubbleSort (arr) {
	// 如果不是数组，或者是空数组，返回空
	if (!Array.isArray(arr) || !arr.length) return []
	const len = arr.length
	for (let i = 0; i < len - 1; i++) {
		for (let n = 0; n < len - 1 - i; n++) {
			if (arr[n] > arr[n + 1]) {
				const temp = arr[n]
				arr[n] = arr[n + 1]
				arr[n + 1] = temp
			}
		}
	}
}
