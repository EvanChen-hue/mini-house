<template>
	<view class="container">
		<view class="titile">
			<text>注册</text>
		</view>

		<view class="form">
			<form @submit="">
				<view class="form-item">
					<input class="username" name="input" placeholder="请输入用户名" placeholder-class="input-placeholder"
						v-model="username" />
				</view>
				<view class="form-item">
					<input class="phone" name="input" placeholder="请输入手机号" placeholder-class="input-placeholder"
						v-model="phone" />
				</view>
				<view class="form-item code">
					<input class="code" name="input" placeholder="请输入手机验证码" placeholder-class="input-placeholder"
						v-model="code" />
					<text :class="tipsStyle" @click="getCode()">{{ tips }}</text>
				</view>
				<view class="register" @click="register()">
					<button :class="registerBtnStyle" form-type="submit">注册</button>
				</view>
			</form>

			<view class="login" @click="login()">
				<text>已注册，去登录</text>
				<image src="/static/one.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				tips: '获取验证码',
				tipsStatus: 0, //0=可以获取,1=正在倒计时,2=重复获取
				tipsStyle: 'tipsStyle',
				seconds: 60,
				username: '',
				phone: '',
				code: '',
				registerBtnStyle: 'registerBtnStyle close',
			};
		},
		onLoad() {

		},
		watch: {
			// 如果表单正常输入则可以点击注册
			username(newVal, oldVal) {
				if (newVal !== '' && this.$utils.checkPhone(this.phone) && this.code.length >= 4) {
					this.registerBtnStyle = 'registerBtnStyle open'
				} else {
					this.registerBtnStyle = 'registerBtnStyle close'
				}
			},
			phone(newVal, oldVal) {
				if (this.username !== '' && this.$utils.checkPhone(newVal) && this.code.length >= 4) {
					this.registerBtnStyle = 'registerBtnStyle open'
				} else {
					this.registerBtnStyle = 'registerBtnStyle close'
				}
			},
			code(newVal, oldVal) {
				if (this.username !== '' && this.$utils.checkPhone(this.phone) && newVal.length >= 4) {
					this.registerBtnStyle = 'registerBtnStyle open'
				} else {
					this.registerBtnStyle = 'registerBtnStyle close'
				}
			}
		},
		methods: {
			// 获取验证码
			getCode() {
				let valid = this.$utils.checkPhone(this.phone);
				if (!valid) {
					this.$utils.toastTip('手机号格式错误', 'error');
					return;
				}
				// 修改样式
				this.tipsStyle = 'tipsStyle1'
				if (this.tipsStatus == 1) {
					return
				};
				uni.showLoading({
					title: '正在获取验证码'
				});
				setTimeout(() => {
					uni.hideLoading();
					this.$utils.toastTip('获取成功', 'success')
				}, 2000);
				this.tipsStatus = 1;
				// 开始倒计时
				this.timer = setInterval(() => {
					this.seconds -= 1;
					this.tips = this.seconds + 's后重新获取';
					if (this.seconds < 1) {
						this.clearTimer();
						this.tipsStatus = 0;
						this.tips = '重新获取';
						this.seconds = 10;
						this.tipsStyle = 'tipsStyle2'
					}
				}, 1000);
			},
			clearTimer() {
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
			},
			// 跳转首页
			register() {
				let valid = this.$utils.checkPhone(this.phone);
				if (!valid) {
					this.$utils.toastTip('手机号格式错误', 'error');
					return;
				}
				if (this.username.length < 1) {
					this.$utils.toastTip('请填写用户名', 'error');
					return;
				}
				if (this.code.length < 1) {
					this.$utils.toastTip('请填写验证码', 'error');
					return;
				}
				// 绑定注册接口
				this.$utils.toastTip('注册成功', 'success')
				setTimeout(() => {
					uni.hideLoading();
					uni.redirectTo({
						url: '/pages/index/index'
					})
				}, 2000);
			},
			// 跳转登录页面
			login() {
<<<<<<< HEAD
				const pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack({
						delta: 1
					});
					return;
				}
				uni.redirectTo({
					url: '/pages/login/index'
				});
=======
				uni.navigateBack()
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
			}
		},
		onUnload() {
			// clearTime
			this.clearTimer();
		},
	}
</script>

<style>
	.input-placeholder {
		font-size: 28rpx;
		color: #CCC8C8;
	}
</style>

<style lang="scss" scoped>
	.container {
		padding: 56rpx;
	}

	.titile {
		margin-top: 100rpx;

		text {
			font-size: 48rpx;
			font-weight: bold;
			color: #262424;
		}
	}

	.form {
		margin-top: 100rpx;
	}

	.form-item {
		margin: 30rpx 0rpx;
		border-bottom: 1rpx solid #F0F0F0;

		input {
			padding: 16rpx 0rpx;
		}
	}

	.form-item.code {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tipsStyle {
		font-size: 24rpx;
		color: #E9B921;
	}

	.tipsStyle1 {
		font-size: 24rpx;
		color: #CCC8C8;
	}

	.tipsStyle2 {
		font-size: 24rpx;
		color: #40AE36;
	}

	.register {
		margin-top: 50rpx;

		.registerBtnStyle {
			display: inline-block;
			width: 100%;
			color: #FFFFFF;
			font-size: 30rpx;
			border-radius: 45rpx;
			opacity: 1;
			line-height: 90rpx;
		}

		.registerBtnStyle.open {
			background: #40AE36;
		}

		.registerBtnStyle.close {
			background: #8CCE86;
		}
	}

	.login {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #666262;
		margin-top: 40rpx;

		image {
			width: 10rpx;
			height: 22rpx;
			margin-left: 8rpx;
		}
	}
</style>
