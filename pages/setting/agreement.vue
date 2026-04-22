<template>
	<view class="container">
		<view class="title">用户服务协议</view>
		<view class="section">
			<text>欢迎使用本小程序服务。您在注册、登录、下单和使用服务前，应仔细阅读并同意本协议。</text>
		</view>
		<view class="section">
			<text class="subtitle">一、服务内容</text>
			<text>本小程序提供家政服务展示、预约下单、订单管理、支付及售后相关功能。</text>
		</view>
		<view class="section">
			<text class="subtitle">二、账号与安全</text>
			<text>您应妥善保管账号信息，不得将账号用于违法违规行为。因您自身原因导致的账号损失由您承担。</text>
		</view>
		<view class="section">
			<text class="subtitle">三、订单与支付</text>
			<text>您提交订单后，请按照页面提示完成支付。订单取消、退款等规则以页面展示及平台规则为准。</text>
		</view>
		<view class="section">
			<text class="subtitle">四、责任限制</text>
			<text>在法律允许范围内，因不可抗力、网络故障等导致服务中断的，本平台将尽力恢复，但不承担超出法定范围的责任。</text>
		</view>
		<view class="section">
			<text class="subtitle">五、协议更新</text>
			<text>本协议可能根据业务调整进行更新，更新后将在页面公布，继续使用即表示您同意更新后的协议。</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {}
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 30rpx;
	background: #fff;
	min-height: 100vh;
}

.title {
	font-size: 36rpx;
	font-weight: 700;
	color: #222;
	margin-bottom: 24rpx;
}

.section {
	margin-bottom: 24rpx;
	line-height: 42rpx;
	font-size: 26rpx;
	color: #444;
	display: flex;
	flex-direction: column;
}

.subtitle {
	font-size: 28rpx;
	font-weight: 600;
	color: #222;
	margin-bottom: 8rpx;
}
</style>
