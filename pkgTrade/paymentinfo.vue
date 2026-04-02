<template>
	<view class="container">
		<view class="state">
			<image src="/static/one.png"></image>
			<text>付款成功</text>
		</view>
		<view class="info">
			<view class="item">
				<text class="label">接收方</text>
				<text class="value">生鲜</text>
			</view>
			<view class="item">
				<text class="label">订单编号</text>
				<text class="value">8283894949838</text>
			</view>
			<view class="item">
				<text class="label">支付方式</text>
				<text class="value">微信</text>
			</view>
			<view class="item">
				<text class="label">积分券奖励</text>
				<text class="value">50.00</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

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
	}

	.state {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 100rpx 0rpx 60rpx 0rpx;

		image {
			width: 120rpx;
			height: 120rpx;
		}

		text {
			font-size: 30rpx;
			font-weight: 600;
			margin-top: 28rpx;
		}
	}

	.info {
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 0rpx 30rpx;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 28rpx 0rpx;

			.label {
				font-size: 30rpx;
				color: #999999;
			}

			.value {
				font-size: 30rpx;
				color: #333333;
			}
		}

		.item:not(:last-child) {
			border-bottom: 1rpx solid #ECECEC;
		}
	}
</style>
