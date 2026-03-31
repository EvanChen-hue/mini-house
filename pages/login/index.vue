<template>
	<view class="container">
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
	</view>
</template>

<script>
import api from '../../utils/http.js'

export default {
	data() {
		return {
			loading: false,
			lastCode: ''
		}
	},
	methods: {
		async wxQuickLogin() {
			if (this.loading) return
			this.loading = true

			try {
				const userInfo = await this.getWxUserProfile()
				const code = await this.getWxCode()
				this.lastCode = code

				const loginRes = await this.callLoginApi({
					code,
				})

				const token = loginRes?.data || ''
				if (!token) {
					throw new Error('后端未返回 token')
				}
				console.log(userInfo, 'usefr');
				

				uni.setStorageSync('Token', token)
				uni.setStorageSync('userInfo', loginRes?.data?.userInfo || userInfo || {})

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
					title: e?.message || '登录失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		getWxUserProfile() {
			return new Promise((resolve, reject) => {
				uni.getUserProfile({
					desc: '用于完善会员资料',
					success: res => resolve(res.userInfo || {}),
					fail: err => reject(err)
				})
			})
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

.wx-login-btn {
	margin-top: 80rpx;
	border-radius: 45rpx;
	background: #40ae36;
	color: #fff;
	font-size: 32rpx;
}

.tips {
	margin-top: 28rpx;
	font-size: 24rpx;
	color: #666;
	word-break: break-all;
}
</style>
