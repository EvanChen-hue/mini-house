<template>
	<view class="container">
		<view class="item" @click="toUserinfo()">
			<view class="item-left">
				<image src="/static/one.png"></image>
			</view>
			<view class="item-right">
				<text>个人信息</text>
				<text>头像、昵称、收货地址等</text>
			</view>
		</view>
		<view class="item">
			<view class="item-left">
				<image src="/static/one.png"></image>
			</view>
			<view class="item-right">
				<text>账户与安全</text>
				<text>修改密码、修改手机号、账号绑定管理</text>
			</view>
		</view>
		<view class="item">
			<view class="item-left">
				<image src="/static/one.png"></image>
			</view>
			<view class="item-right">
				<text>支付设置</text>
			</view>
		</view>
		<view class="item">
			<view class="item-left">
				<image src="/static/one.png"></image>
			</view>
			<view class="item-right">
				<text>开启通知</text>
			</view>
		</view>
		<view class="item" @click="toProblem()">
			<view class="item-left">
				<image src="/static/one.png"></image>
			</view>
			<view class="item-right">
				<text>常见问题</text>
			</view>
		</view>
		<view class="item" @click="toAgreement()">
			<view class="item-left">
				<image src="/static/one.png"></image>
			</view>
			<view class="item-right">
				<text>用户服务协议</text>
				<text>查看平台服务条款</text>
			</view>
		</view>
		<view class="item" @click="toPrivacy()">
			<view class="item-left">
				<image src="/static/one.png"></image>
			</view>
			<view class="item-right">
				<text>隐私政策</text>
				<text>查看个人信息处理规则</text>
			</view>
		</view>
		<view class="item" @click="toReview()">
			<view class="item-left">
				<image src="/static/one.png"></image>
			</view>
			<view class="item-right">
				<text>提审自检清单</text>
				<text>审核路径与功能点快速核对</text>
			</view>
		</view>
		<view class="btn">
			<button>退出登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			toUserinfo() {
				uni.navigateTo({
					url: "/pkgUser/info"
				})
			},
			toProblem() {
				uni.navigateTo({
					url: "/pages/setting/problem"
				})
			},
			toAgreement() {
				uni.navigateTo({
					url: "/pages/setting/agreement"
				})
			},
			toPrivacy() {
				uni.navigateTo({
					url: "/pages/setting/privacy"
				})
			},
			toReview() {
				uni.navigateTo({
					url: "/pages/setting/review"
				})
			}
		}
	}
</script>

<style>
	page {
		background: #F8F9FA;
	}
</style>

<style lang="scss" scoped>
	.container {
		margin: 30rpx;

		.item {
			background: #FFFFFF;
			border-radius: 20rpx;
			display: flex;
			align-items: center;
			padding: 40rpx 0rpx 40rpx 20rpx;
			margin-bottom: 22rpx;

			.item-left {
				display: flex;

				image {
					width: 80rpx;
					height: 80rpx;
				}
			}

			.item-right {
				display: flex;
				flex-direction: column;
				line-height: 46rpx;

				text:nth-child(1) {
					font-size: 30rpx;
					font-weight: 600;
					color: #333333;
				}

				text:nth-child(2) {
					font-size: 24rpx;
					color: #999999;
				}
			}
		}

		.btn {
			margin-top: 70rpx;
			width: 100%;

			button {
				flex: 1;
				border-radius: 46rpx;
				background: #40AE36;
				color: #FFFFFF;
				font-size: 30rpx;
				padding: 12rpx 0rpx;
			}
		}
	}
</style>

