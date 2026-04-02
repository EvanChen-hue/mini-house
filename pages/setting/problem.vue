<template>
	<view class="container">
		<view class="title">常见问题</view>
		<u-collapse :item-style="itemStyle">
			<u-collapse-item :title="item.head" v-for="(item, index) in itemList" :key="index">
				<view class="collapse-item">
					{{item.body}}
				</view>
			</u-collapse-item>
		</u-collapse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemStyle: {
					background: "#FFFFFF",
					marginBottom: "22rpx",
					borderRadius: "20rpx",
					padding: "20rpx 40rpx",
					fontSize: "28rpx",
					fontWeight: "600"
				},
				itemList: [{
					head: "我们的服务流程是什么？",
					body: "只要我们正确择取一个合适的参照物乃至稍降一格去看待他人，值得赏识的东西便会扑面而来",
					open: true,
				}, {
					head: "费用是如何计算的？",
					body: "我们有一个计时器供我们的工作人员与您确认他们的开始时间和结束时间。我们有一个计时器供我们的工作人员。",
					open: false,
				}, {
					head: "我该如何投诉",
					body: "但是据说雕刻大卫像所用的这块大理石，曾被多位雕刻家批评得一无是处，有些人认为这块大理石采凿得不好，有些人嫌它的纹路不够美",
					open: false,
				}],
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
		margin: 40rpx;
	}

	.title {
		font-size: 28rpx;
		font-weight: 600;
		color: #333333;
		margin-bottom: 42rpx;
	}

	.collapse-item {
		font-size: 28rpx;
		font-weight: normal;
		color: #1F1F39;
		padding: 30rpx 20rpx 30rpx 0rpx;
	}
</style>