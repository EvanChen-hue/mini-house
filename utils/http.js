/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2026-03-24 21:52:41
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2026-03-30 23:30:16
 * @FilePath: \生鲜商城前端模板\utils\http.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const baseUrl = 'https://requests.taiyang.chat';
let loginRedirecting = false;

const redirectToLogin = () => {
	if (loginRedirecting) return;
	const pages = getCurrentPages();
	const currentRoute = pages.length ? pages[pages.length - 1].route : '';
	if (currentRoute === 'pages/login/index') return;

	loginRedirecting = true;
	uni.showToast({
		title: '登录已失效，请重新登录',
		duration: 1500,
		icon: 'none'
	});
	setTimeout(() => {
		uni.navigateTo({
			url: '/pages/login/index'
		});
		loginRedirecting = false;
	}, 300);
};

const createRequest = (opts, data, showLoading = true, type = 'application/json') => {
	if (showLoading) {
		uni.showLoading({
			title: '加载中...'
		});
	}
	const httpDefaultOpts = {
		url: baseUrl + opts.url,
		data: data,
		method: opts.method,
		header: {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': type ? type : 'application/json',
			...(opts.method === 'get' ? {
				Accept: 'application/json'
			} : {}),
			...(opts.token ? {
				authorization: opts.token
			} : {})
		},
		dataType: 'json'
	};

	return new Promise((resolve, reject) => {
		uni.request(httpDefaultOpts).then((res) => {
			if (showLoading) {
				uni.hideLoading();
			}

			const httpOk = res.statusCode === 200;
			const bizCode = res && res.data && typeof res.data.code !== 'undefined' ? Number(res.data.code) : 200;
			const bizOk = bizCode === 200;
			const bizMsg = res && res.data && res.data.msg ? res.data.msg : '';

			if (httpOk && bizOk) {
				resolve(res.data);
				return;
			}

			if (bizMsg) {
				uni.showToast({
					title: bizMsg,
					icon: 'none'
				});
			}

			if (res.statusCode === 401 || bizCode === 401) {
				redirectToLogin();
			}

			reject(res);
		}).catch((response) => {
			if (showLoading) {
				uni.hideLoading();
			}
			uni.showToast({
				title: (response && response.errMsg) || '网络异常，请稍后重试',
				icon: 'none'
			});
			reject(response);
		});
	});
};

const httpRequest = (opts, data, loading = true, method = 'post') => {
	return createRequest({
		url: opts,
		method: method
	}, data, loading);
};

const httpTokenRequest = (opts, data, method = 'post') => {
	const token = uni.getStorageSync('Token') || '';
	if (!token) {
		redirectToLogin();
		return Promise.reject(new Error('no token'));
	}
	return createRequest({
		url: opts,
		method: method,
		token
	}, data);
};

export default {
	baseUrl,
	httpRequest,
	httpTokenRequest,
	createRequest
};
