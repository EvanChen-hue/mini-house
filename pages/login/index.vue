<template>
	<view class="container">
<<<<<<< HEAD
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
=======
		<view class="title">微信授权登录</view>
		<view class="desc">
			点击下方按钮授权手机号，系统会获取微信登录 code + 手机号 code 发送给后端换取真实手机号与登录态。
		</view>

		<button class="wx-login-btn" :loading="loading" @click="wxQuickLogin">
			{{ loading ? '登录中...' : '微信手机号一键登录' }}
		</button>

		<view class="tips">
			<text>login code：{{ lastCode || '未获取' }}</text>
		</view>
>>>>>>> 3adfa6b8ae169024cf18cd11a3e1a9ebbc8aa859
	</view>
</template>

<script>
import api from '../../utils/http.js'

export default {
	data() {
		return {
			loading: false,
<<<<<<< HEAD
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

			const errMsg = e?.detail?.errMsg || ''
			if (!errMsg.includes(':ok')) {
				uni.showToast({
					title: '未授权手机号，无法登录',
					icon: 'none'
				})
				return
			}

			const phoneCode = e?.detail?.code || ''
			await this.wxQuickLogin(phoneCode)
		},
		async wxQuickLogin(phoneCode = '') {
=======
			lastCode: ''
		}
	},
	methods: {
		async wxQuickLogin() {
>>>>>>> 3adfa6b8ae169024cf18cd11a3e1a9ebbc8aa859
			if (this.loading) return
			this.loading = true

			try {
<<<<<<< HEAD
=======
				const userInfo = await this.getWxUserProfile()
>>>>>>> 3adfa6b8ae169024cf18cd11a3e1a9ebbc8aa859
				const code = await this.getWxCode()
				this.lastCode = code

				const loginRes = await this.callLoginApi({
					code,
<<<<<<< HEAD
					phoneCode,
					agreePolicy: this.agreed ? 1 : 0
				})

				const token = loginRes?.data?.token || loginRes?.data || ''
				if (!token) {
					throw new Error('后端未返回 token')
				}

				uni.setStorageSync('Token', token)
				uni.setStorageSync('userInfo', loginRes?.data?.userInfo || {})
=======
				})

				const token = loginRes?.data || ''
				if (!token) {
					throw new Error('后端未返回 token')
				}
				console.log(userInfo, 'usefr');
				

				uni.setStorageSync('Token', token)
				uni.setStorageSync('userInfo', loginRes?.data?.userInfo || userInfo || {})
>>>>>>> 3adfa6b8ae169024cf18cd11a3e1a9ebbc8aa859

				uni.showToast({
					title: '登录成功',
					icon: 'success'
				})

				setTimeout(() => {
					uni.switchTab({
						url: '/pages/mine/mine'
					})
				}, 300)
			} catch (e) {
				uni.showToast({
<<<<<<< HEAD
					title: e?.message || e?.msg || '登录失败，请稍后再试',
=======
					title: e?.message || '登录失败',
>>>>>>> 3adfa6b8ae169024cf18cd11a3e1a9ebbc8aa859
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
<<<<<<< HEAD
=======
		getWxUserProfile() {
			return new Promise((resolve, reject) => {
				uni.getUserProfile({
					desc: '用于完善会员资料',
					success: res => resolve(res.userInfo || {}),
					fail: err => reject(err)
				})
			})
		},
>>>>>>> 3adfa6b8ae169024cf18cd11a3e1a9ebbc8aa859
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
		async callLoginApi(payload) {
			// 你后续替换成自己的后端地址即可
			// 后端可使用 payload.code 换取 openid/session_key，并保存昵称头像
			return await api.createRequest(
				{
					url: '/house/user/wx/login',
					method: 'post'
				},
				payload,
				true,
				'application/x-www-form-urlencoded'
			)
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

<<<<<<< HEAD
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

=======
>>>>>>> 3adfa6b8ae169024cf18cd11a3e1a9ebbc8aa859
.wx-login-btn {
	margin-top: 80rpx;
	border-radius: 45rpx;
	background: #40ae36;
	color: #fff;
	font-size: 32rpx;
}

<<<<<<< HEAD
.review-link {
	margin-top: 22rpx;
	font-size: 24rpx;
	color: #40ae36;
	text-align: center;
}

=======
>>>>>>> 3adfa6b8ae169024cf18cd11a3e1a9ebbc8aa859
.tips {
	margin-top: 28rpx;
	font-size: 24rpx;
	color: #666;
	word-break: break-all;
}
</style>
