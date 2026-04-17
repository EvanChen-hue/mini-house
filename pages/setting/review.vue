<template>
	<view class="container">
		<view class="hero">
			<view class="title">提审自检清单</view>
			<view class="subtitle">给审核员快速体验的固定路径，避免因为找不到入口导致误判</view>
		</view>

		<view class="card">
			<view class="card-title">建议审核路径</view>
			<view class="path">1. 登录页 -> 勾选协议 -> 手机号授权登录</view>
			<view class="path">2. 设置页 -> 用户服务协议 / 隐私政策</view>
			<view class="path">3. 我的订单 -> 查看订单状态、取消与删除逻辑</view>
		</view>

		<view class="card">
			<view class="card-title">快速跳转验证</view>
			<view class="actions">
				<button class="btn" @click="goLogin">登录页</button>
				<button class="btn" @click="goAgreement">用户服务协议</button>
				<button class="btn" @click="goPrivacy">隐私政策</button>
				<button class="btn" @click="goOrder">我的订单</button>
				<button class="btn" @click="goSetting">设置页</button>
			</view>
		</view>

		<view class="card">
			<view class="card-title">审核关键点</view>
			<view class="check-item">登录前需勾选协议，未勾选会明确提示</view>
			<view class="check-item">点击手机号登录后会弹出微信授权，不是无响应</view>
			<view class="check-item">协议与隐私政策可从登录页和设置页双入口访问</view>
			<view class="check-item">订单取消后状态改为已取消，保留在列表且不允许支付</view>
		</view>

		<view class="card">
			<view class="card-title">提审录屏建议</view>
			<view class="tip">录屏建议 30-60 秒，包含以下动作：</view>
			<view class="tip">1. 进入登录页，点击协议与隐私链接可正常打开</view>
			<view class="tip">2. 勾选协议后点击手机号登录，展示授权弹窗</view>
			<view class="tip">3. 登录后进入订单页，演示取消订单后状态变化</view>
		</view>
	</view>
</template>

<script>
export default {
	methods: {
		goLogin() {
			uni.navigateTo({
				url: '/pages/login/index'
			})
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
		goOrder() {
			uni.navigateTo({
				url: '/pages/order/order'
			})
		},
		goSetting() {
			uni.navigateTo({
				url: '/pages/setting/setting'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 24rpx;
	background: #f5f7fa;
	min-height: 100vh;
}

.hero {
	background: linear-gradient(135deg, #e6f7e5, #f2fbf2);
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;

	.title {
		font-size: 34rpx;
		font-weight: 700;
		color: #223;
	}

	.subtitle {
		margin-top: 10rpx;
		font-size: 24rpx;
		line-height: 36rpx;
		color: #5e6b63;
	}
}

.card {
	background: #fff;
	border-radius: 16rpx;
	padding: 22rpx;
	margin-bottom: 16rpx;
}

.card-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1f2a20;
	margin-bottom: 12rpx;
}

.path,
.check-item,
.tip {
	font-size: 24rpx;
	line-height: 38rpx;
	color: #4a4a4a;
}

.actions {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.btn {
	min-width: 200rpx;
	height: 72rpx;
	line-height: 72rpx;
	font-size: 24rpx;
	background: #40ae36;
	color: #fff;
	border-radius: 36rpx;
	padding: 0 20rpx;
}

.btn::after {
	border: none;
}
</style>
