<template>
	<view class="page-wrap">
		<view class="card">
			<view class="form-item">
				<text class="label">昵称</text>
				<input v-model="form.username" class="input" maxlength="20" placeholder="请输入昵称" />
			</view>
			<view class="form-item">
				<text class="label">手机号</text>
				<input v-model="form.phone" class="input" type="number" maxlength="11" placeholder="请输入手机号" />
			</view>
			<view class="form-item gender-item">
				<text class="label">性别</text>
				<radio-group class="gender-group" @change="handleGenderChange">
					<label class="gender-option" v-for="item in genderOptions" :key="item.value">
						<radio :value="String(item.value)" :checked="Number(form.gender) === item.value" color="#e39a34" />
						<text>{{ item.label }}</text>
					</label>
				</radio-group>
			</view>
		</view>
		<button class="submit-btn" type="primary" :loading="submitting" @click="submitForm">保存修改</button>
	</view>
</template>

<script>
	import api from '../utils/http.js'

	export default {
		data() {
			return {
				submitting: false,
				genderOptions: [
					{ label: '未知', value: 0 },
					{ label: '男', value: 1 },
					{ label: '女', value: 2 }
				],
				form: {
					username: '',
					phone: '',
					gender: 0
				}
			}
		},
		onShow() {
			if (!this.ensureLogin()) return
			this.fetchUserInfo()
		},
		methods: {
			ensureLogin() {
				const token = uni.getStorageSync('Token') || ''
				if (token) return true
				uni.redirectTo({
					url: '/pages/login/index'
				})
				return false
			},
			fillForm(userInfo = {}) {
				this.form = {
					username: userInfo.username || '',
					phone: userInfo.phone || '',
					gender: Number(userInfo.gender || 0)
				}
			},
			async fetchUserInfo() {
				if (!this.ensureLogin()) return
				const cache = uni.getStorageSync('userInfo') || {}
				this.fillForm(cache)
				try {
					const res = await api.httpTokenRequest('/house/user/wx/me', {}, 'get')
					const userInfo = res?.data || {}
					this.fillForm(userInfo)
					uni.setStorageSync('userInfo', userInfo)
				} catch (e) {
					uni.showToast({
						title: '获取个人信息失败',
						icon: 'none'
					})
				}
			},
			handleGenderChange(e) {
				this.form.gender = Number(e.detail.value || 0)
			},
			buildPayload() {
				return {
					username: String(this.form.username || '').trim(),
					phone: String(this.form.phone || '').trim(),
					gender: Number(this.form.gender || 0)
				}
			},
			validateForm(payload) {
				if (!payload.username) {
					uni.showToast({
						title: '请输入昵称',
						icon: 'none'
					})
					return false
				}
				if (payload.phone && !/^1\d{10}$/.test(payload.phone)) {
					uni.showToast({
						title: '请输入正确手机号',
						icon: 'none'
					})
					return false
				}
				return true
			},
			async submitForm() {
				if (!this.ensureLogin() || this.submitting) return
				const payload = this.buildPayload()
				if (!this.validateForm(payload)) return
				this.submitting = true
				try {
					await api.httpTokenRequest('/house/user/update', payload, 'put')
					const cachedUserInfo = uni.getStorageSync('userInfo') || {}
					uni.setStorageSync('userInfo', {
						...cachedUserInfo,
						...payload
					})
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 500)
				} catch (e) {
					// Toast is handled in request util when server returns a message.
				} finally {
					this.submitting = false
				}
			}
		}
	}
</script>

<style>
	page {
		background: linear-gradient(180deg, #fff2d4 0%, #ffffff 72%);
	}
</style>

<style lang="scss" scoped>
	.page-wrap {
		padding: 24rpx;
	}

	.card {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 0 24rpx;
		box-shadow: 0 12rpx 40rpx rgba(36, 38, 56, 0.06);
	}

	.form-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 112rpx;
		border-bottom: 1rpx solid #eef0f4;
		gap: 24rpx;
	}

	.gender-item {
		align-items: flex-start;
		padding: 30rpx 0;
	}

	.form-item:last-child {
		border-bottom: 0;
	}

	.label {
		width: 140rpx;
		font-size: 30rpx;
		color: #222426;
		flex-shrink: 0;
	}

	.input {
		flex: 1;
		height: 80rpx;
		font-size: 28rpx;
		text-align: right;
		color: #303133;
	}

	.gender-group {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 24rpx;
	}

	.gender-option {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #303133;
	}

	.submit-btn {
		margin-top: 40rpx;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		background: linear-gradient(135deg, #f2b544 0%, #e78b2f 100%);
		border: 0;
		font-size: 30rpx;
	}

	.submit-btn::after {
		border: 0;
	}
</style>
