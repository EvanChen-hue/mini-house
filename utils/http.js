/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2026-03-24 21:52:41
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2026-03-30 23:30:16
 * @FilePath: \生鲜商城前端模板\utils\http.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const baseUrl = 'https://requests.taiyang.chat';
<<<<<<< HEAD
const REQUEST_TIMEOUT = 15000;
let loginRedirecting = false;

const parseUniRequestResult = (result) => {
	if (Array.isArray(result)) {
		return {
			err: result[0],
			res: result[1]
		};
	}
	return {
		err: null,
		res: result
	};
};

=======
let loginRedirecting = false;

>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
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
<<<<<<< HEAD
		timeout: REQUEST_TIMEOUT,
		header: {
=======
		header: {
			'X-Requested-With': 'XMLHttpRequest',
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
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
<<<<<<< HEAD
		uni.request(httpDefaultOpts).then((result) => {
=======
		uni.request(httpDefaultOpts).then((res) => {
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
			if (showLoading) {
				uni.hideLoading();
			}

<<<<<<< HEAD
			const {
				err: requestErr,
				res
			} = parseUniRequestResult(result);

			if (requestErr) {
				reject(requestErr);
				return;
			}

			if (!res) {
				reject(new Error('empty response'));
				return;
			}

			const httpOk = Number(res.statusCode) >= 200 && Number(res.statusCode) < 300;
=======
			const httpOk = res.statusCode === 200;
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
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
<<<<<<< HEAD
			const errMsg = (response && response.errMsg) || (response && response.message) || '';
			const isCode10 = String(errMsg).indexOf('code 10') !== -1 || String(errMsg).indexOf('Failed to fetch') !== -1;
			if (isCode10) {
				console.error('请求失败(code 10)，请检查微信小程序 request 合法域名、TLS 证书链、以及开发者工具代理设置。请求地址：', httpDefaultOpts.url);
			}
			uni.showToast({
				title: isCode10 ? '网络请求失败，请检查域名与证书' : (errMsg || '网络异常，请稍后重试'),
=======
			uni.showToast({
				title: (response && response.errMsg) || '网络异常，请稍后重试',
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
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
