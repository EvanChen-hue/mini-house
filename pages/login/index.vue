<template>
	<view class="container">
		<view class="title">手机号一键登录</view>

		<view class="agreement-row" @click="toggleAgreement">
			<view class="agreement-check" :class="agreed ? 'agreement-check-on' : ''"></view>
			<text class="agreement-text">我已阅读并同意</text>
			<text class="agreement-link" @click.stop="goAgreement">《用户服务协议》</text>
			<text class="agreement-text">与</text>
			<text class="agreement-link" @click.stop="goPrivacy">《隐私政策》</text>
		</view>

		<button
			class="wx-login-btn"
			:loading="loading"
			open-type="getPhoneNumber"
			@getphonenumber="onGetPhoneNumber"
		>
			{{ loading ? '登录中...' : '快捷键登录' }}
		</button>

		<!-- <view class="review-link" @click="goReview">提审自检清单</view> -->

		<!-- <view class="tips">
			<text>login code：{{ lastCode || '未获取' }}</text>
		</view> -->
	</view>
</template>

<script>
import api from '../../utils/http.js'

export default {
	data() {
		return {
			loading: false,
			lastCode: '',
			agreed: false
		}
	},
	methods: {
		toggleAgreement() {
			this.agreed = !this.agreed
		},
		goAgreement() {
			uni.navigateTo({
				url: '/pages/setting/agreement'
			})
		},
		goPrivacy() {
			uni.navigateTo({
				url: '/pages/setting/privacy'
			})
		},
		goReview() {
			uni.navigateTo({
				url: '/pages/setting/review'
			})
		},
		async onGetPhoneNumber(e) {
			if (!this.agreed) {
				uni.showToast({
					title: '请先勾选并同意协议',
					icon: 'none'
				})
				return
			}

			const detail = e?.detail || {}
			const phoneCode = detail.code || ''
			const errMsg = e?.detail?.errMsg || ''
			if (!errMsg.includes(':ok')) {
				const noQuota = Number(detail.errno) === 1400001
				uni.showToast({
					title: noQuota ? '手机号验证额度不足' : '未授权手机号，无法登录',
					icon: 'none'
				})
				return
			}

			if (!phoneCode) {
				uni.showToast({
					title: '当前环境未返回手机号 code，请用真机调试',
					icon: 'none'
				})
				return
			}

			try {
				await this.ensureLoginToken()
				await this.wxQuickLogin(phoneCode)
			} catch (e) {
				uni.showToast({
					title: e?.message || e?.msg || '登录失败，请稍后再试',
					icon: 'none'
				})
			}
		},
		async wxQuickLogin(phoneCode = '') {
			if (this.loading) return
			this.loading = true

			try {
				const loginRes = await this.callBindPhoneApi(phoneCode)
				const userInfo = loginRes?.data
				if (!userInfo || !userInfo.id) {
					throw new Error('后端未返回用户信息')
				}

				uni.setStorageSync('userInfo', userInfo)
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/mine/mine'
					})
				}, 300)
			} catch (e) {
				uni.showToast({
					title: e?.message || e?.msg || '登录失败，请稍后再试',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		async ensureLoginToken() {
			uni.removeStorageSync('Token')
			const code = await this.getWxCode()
			this.lastCode = code

			const loginRes = await this.callWxLoginApi(code)
			const token = loginRes?.data || ''
			if (!token) {
				throw new Error(loginRes?.msg || '后端未返回 Token')
			}

			uni.setStorageSync('Token', token)
			return token
		},
		getWxCode() {
			return new Promise((resolve, reject) => {
				uni.login({
					provider: 'weixin',
					success: res => {
						if (!res.code) {
							reject(new Error('获取登录 code 失败'))
							return
						}
						resolve(res.code)
					},
					fail: err => reject(err)
				})
			})
		},
		async callWxLoginApi(code) {
			if (!code) {
				throw new Error('登录 code 为空')
			}

			return await api.createRequest({
				url: '/house/user/wx/login',
				method: 'post'
			}, {
				code
			}, true, 'application/x-www-form-urlencoded')
		},
		async callBindPhoneApi(phoneCode) {
			const token = uni.getStorageSync('Token') || ''
			if (!token) {
				throw new Error('Token 不存在，请重新登录')
			}

			return await api.createRequest({
				url: '/house/user/wx/bindPhone',
				method: 'post',
				token
			}, { code: phoneCode })
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 56rpx;
}

.title {
	margin-top: 140rpx;
	font-size: 48rpx;
	font-weight: 700;
	color: #262424;
}

.desc {
	margin-top: 24rpx;
	font-size: 28rpx;
	color: #666;
	line-height: 40rpx;
}

.agreement-row {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	margin-top: 36rpx;

	.agreement-check {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		border: 2rpx solid #c7c7c7;
		margin-right: 10rpx;
	}

	.agreement-check-on {
		background: #40ae36;
		border-color: #40ae36;
	}

	.agreement-text {
		font-size: 24rpx;
		color: #666;
	}

	.agreement-link {
		font-size: 24rpx;
		color: #40ae36;
	}
}

.wx-login-btn {
	margin-top: 80rpx;
	border-radius: 45rpx;
	background: #40ae36;
	color: #fff;
	font-size: 32rpx;
}

.review-link {
	margin-top: 22rpx;
	font-size: 24rpx;
	color: #40ae36;
	text-align: center;
}

.tips {
	margin-top: 28rpx;
	font-size: 24rpx;
	color: #666;
	word-break: break-all;
}
</style>
