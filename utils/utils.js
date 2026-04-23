import api from './http.js'

const normalizeBaseUrl = (url) => String(url || '').replace(/\/+$/, '')

const unwrapQuotedValue = (value) => {
	let nextValue = String(value || '').trim()
	while (nextValue.length >= 2) {
		const firstChar = nextValue.charAt(0)
		const lastChar = nextValue.charAt(nextValue.length - 1)
		const wrappedByDoubleQuotes = firstChar === '"' && lastChar === '"'
		const wrappedBySingleQuotes = firstChar === '\'' && lastChar === '\''
		if (!wrappedByDoubleQuotes && !wrappedBySingleQuotes) {
			break
		}
		nextValue = nextValue.slice(1, -1).trim()
	}
	return nextValue
}

export default {
	resolveImageUrl(url, fallback = '/static/banner.png') {
		const rawValue = Array.isArray(url) ? url[0] : String(url || '').split(',')[0]
		const value = unwrapQuotedValue(rawValue).replace(/\\/g, '/').trim()
		if (!value) return fallback
		if (/^https?:\/\//i.test(value)) return value

		const baseUrl = normalizeBaseUrl(api.baseUrl)
		if (!baseUrl) return value

		if (value.indexOf('/house/uploads/') === 0) {
			return `${baseUrl}${value}`
		}

		if (value.indexOf('/uploads/') === 0) {
			return `${baseUrl}${value}`
		}

		if (value.indexOf('house/uploads/') === 0) {
			return `${baseUrl}/${value}`
		}

		if (value.indexOf('uploads/') === 0) {
			return `${baseUrl}/${value}`
		}

		if (value[0] === '/') {
			return `${baseUrl}${value}`
		}

		return `${baseUrl}/house/uploads/${value}`
	},
	// toast提示框
	// 标题，图标，存在时间
	toastTip(title, icon, time) {
		uni.showToast({
			title: title || '网络连接超时,请稍后重试!',
			icon: icon || 'none',
			duration: time || 2000
		})
	},
	// 模态弹窗 
	// content：文字信息
	showConfirm(content) {
		return new Promise((resolve, reject) => {
			uni.showModal({
				title: '提示',
				content: content,
				cancelText: '取消',
				confirmText: '确定',
				success: function(res) {
					resolve(res)
				}
			})
		})
	},
	//  Loading加载提示框
	// 标题
	showLoading(title) {
		uni.showLoading({
			title: title
		})
	},
	// 数据缓存
	setStorage(key, data) {
		uni.setStorage({
			key: key,
			data: data,
		});
	},
	// 获取字符串的真实长度（字节长度）
	strLeng(str) {
		if (str) {
			let len = str.length,
				truelen = 0;
			for (let x = 0; x < len; x++) {
				if (str.charCodeAt(x) > 128) {
					truelen += 2;
				} else {
					truelen += 1;
				}
			}
			return truelen;
		} else {
			return 0;
		}
	},
	// 是否在数组内
	inArray(search, array) {
		for (var i in array) {
			if (array[i] == search) return true
		}
		return false
	},
	// 是否为空对象
	isEmptyObject(object) {
		return Object.keys(object).length === 0
	},
	//防抖
	debounce(fn, delay) {
		let timer
		return function() {
			const that = this
			const _args = arguments // 存一下传入的参数
			if (timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(function() {
				fn.apply(that, _args)
			}, delay)
		}
	},
	// 节流
	throttle(fn, gapTime) {
		if (gapTime == null || gapTime == undefined) {
			gapTime = 1500
		}
		let _lastTime = null
		// 返回新的函数
		return function() {
			let _nowTime = +new Date()
			if (_nowTime - _lastTime > gapTime || !_lastTime) {
				fn.apply(this, arguments) //将this和参数传给原函数
				_lastTime = _nowTime
			}
		}
	},
	// 校验手机号
	checkPhone(phone) {
		let phoneReg = /^1[3-9]\d{9}$/
		return phoneReg.test(phone)
	},
	// 校验邮箱
	checkEmail(email) {
		let emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
		return emailReg.test(email)
	},
	// 数值保留两位小数
	numberFormat(num) {
		return Math.round(num * 100) / 100;
	},
	// 乘法
	mathMul(num1, num2, scale = 2) {
		let num = parseFloat(num1) * parseFloat(num2);
		return this.numberFormat(num);
	},
	// 更多工具函数...
};