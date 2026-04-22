<template>
	<view class="page">
		<view class="card">
			<view class="title">在线客服</view>
			<view class="desc">如需帮助可点击下方按钮联系客服。</view>
			<button class="call-btn" @click="callService">拨打客服电话</button>
		</view>
	</view>
</template>

<script>
export default {
	methods: {
		callService() {
			uni.makePhoneCall({
				phoneNumber: '0817-6125226'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #f8f9fa;
	padding: 24rpx;
}

.card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx 24rpx 40rpx;
}

.title {
	font-size: 34rpx;
	font-weight: 600;
	color: #222;
}

.desc {
	margin-top: 16rpx;
	font-size: 28rpx;
	color: #666;
	line-height: 42rpx;
}

.call-btn {
	margin-top: 40rpx;
	border-radius: 40rpx;
	background: #40ae36;
	color: #fff;
	font-size: 30rpx;
}
</style>
