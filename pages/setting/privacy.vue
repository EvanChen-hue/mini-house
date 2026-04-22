<template>
	<view class="container">
		<view class="title">隐私政策</view>
		<view class="section">
			<text>我们重视您的个人信息和隐私保护。本政策用于说明我们如何收集、使用、存储和保护您的个人信息。</text>
		</view>
		<view class="section">
			<text class="subtitle">一、我们收集的信息</text>
			<text>1. 登录信息：微信登录 code、手机号授权 code，用于完成身份识别与登录。</text>
			<text>2. 账号信息：昵称、头像、手机号，用于展示账户资料与联系服务。</text>
			<text>3. 订单信息：预约时间、地址、备注、订单状态，用于履约和售后服务。</text>
			<text>4. 位置信息：用于展示当前城市区县并优化服务匹配（经您授权后获取）。</text>
		</view>
		<view class="section">
			<text class="subtitle">二、信息使用目的</text>
			<text>用于用户登录、订单处理、客户服务、退款售后、风控与安全保障。</text>
		</view>
		<view class="section">
			<text class="subtitle">三、信息存储与保护</text>
			<text>我们采取合理的安全措施保护信息安全，并在实现业务目的所需期限内保存您的信息。</text>
		</view>
		<view class="section">
			<text class="subtitle">四、信息共享</text>
			<text>除法律法规要求或为完成服务所必需外，我们不会向无关第三方出售您的个人信息。</text>
		</view>
		<view class="section">
			<text class="subtitle">五、您的权利</text>
			<text>您可通过平台功能申请查看、更正、删除部分信息，或撤回授权。撤回授权后可能影响部分功能使用。</text>
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
