<template>
	<view class="container">
		<view class="header">
			<view class="header-title">
				<view class="header-icon">
					<image src="/static/one.png"></image>
				</view>
				<view class="header-status">
					<text>待付款</text>
				</view>
			</view>
			<view class="header-content">
				<text>9分钟后订单关闭，请及时付款哦</text>
			</view>
			<view class="header-empty"></view>
		</view>
		<view class="content">
			<!-- 地址信息 -->
			<view class="address">
				<view class="address-left">
					<image src="/static/one.png"></image>
				</view>
				<view class="address-right">
					<view class="address-info">
						<view class="address-info-top">
							北京市海淀区恒大新宏福苑西区20号楼2单元301
						</view>
						<view class="address-info-bottom">
							<text class="address-name">丢丢</text>
							<text class="address-phone">15800000000</text>
						</view>
					</view>
					<view class="address-righticon">
						<image src="/static/one.png"></image>
					</view>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="goods">
				<view class="goods-left">
					<image src="/static/one.png"></image>
				</view>
				<view class="goods-center">
					<text class="goods-name">彩食有机鲜菠菜彩食新鲜的菠菜 1kg/份</text>
					<text class="goods-spec">规格：1kg/份</text>
					<text class="goods-num">数量：2份</text>
				</view>
				<view class="goods-right">
					￥<text class="goods-price">38.8</text>
				</view>
			</view>
			<!-- 价格信息 -->
			<view class="price">
				<view class="price-top">
					<view class="price-top-xiaoji">
						<text class="price-top-left">商品小计</text>
						<view class="price-top-right">
							￥<text class="xiaoji-price">38.8</text>
						</view>
					</view>
					<view class="price-top-youhui">
						<text class="price-top-left">活动优惠</text>
						<text class="youhui-price">-￥7</text>
					</view>
				</view>
				<view class="price-bottom">
					<text class="price-bottom-left">应付金额合计</text>
					<view class="price-bottom-right">
						￥<text class="xiaoji-price">38.8</text>
					</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="order">
				<view class="order-item">
					<text class="order-item-left">下单时间</text>
					<text class="order-item-right">2021.12.27 12:22:35</text>
				</view>
				<view class="order-item">
					<text class="order-item-left">订单编号</text>
					<text class="order-item-right">8283894949838</text>
				</view>
				<view class="order-item">
					<text class="order-item-left">支付方式</text>
					<text class="order-item-right">支付宝</text>
				</view>
				<view class="order-item">
					<text class="order-item-left">交易流水号</text>
					<text class="order-item-right">183772889499495885993884</text>
				</view>
			</view>
		</view>

		<!-- 底部栏 -->
		<view class="bottom">
			<view class="btns">
				<button class="cancel" v-if="order.status=='待付款' || order.status=='待发货'"
					@click="cancelOrder()">取消订单</button>
				<button class="cancel" v-if="order.status=='待收货' || order.status=='待评价'">再来一单</button>
				<button class="pay" v-if="order.status=='待付款'" @click="payment()">支付</button>
				<button class="pay" v-if="order.status=='待发货'" @click="remind()">提醒发货</button>
				<button class="pay" v-if="order.status=='待收货'">确认收货</button>
				<button class="cancel" v-if="order.status=='待评价'">退款/售后</button>
				<button class="pay" v-if="order.status=='待评价'" @click="goComment()">去评价</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: {
					status: "待付款"
				}
			}
		},
		methods: {
			// 跳转去评价页面
			goComment() {
				uni.navigateTo({
					url: "/pages/order/comment"
				})
			},
			// 支付
			payment() {
				uni.navigateTo({
					url: "/pkgTrade/payment"
				})
			},
			// 提醒发货
			remind() {
				this.$utils.toastTip("已向商家发送发货提醒");
			},
			// 取消订单
			cancelOrder() {
				this.$utils.showConfirm("确定要取消订单吗？").then(res => {
					if (res.confirm) {
						this.$utils.toastTip("取消成功！");
					}
				});
				
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
	.header {
		border-bottom-left-radius: 60% 15%;
		border-bottom-right-radius: 60% 15%;
		background: linear-gradient(#40AE36, #7AC158);
		color: #FEFFFE;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 50rpx 0rpx;


		.header-title {
			display: flex;
			align-items: center;

			.header-icon {
				image {
					width: 34rpx;
					height: 34rpx;
				}
			}

			.header-status {
				font-size: 36rpx;
				margin-left: 16rpx;
			}
		}

		.header-content {
			margin-top: 16rpx;
		}

		.header-empty {
			padding-bottom: 100rpx;
		}

	}

	.content {
		margin: 0rpx 30rpx;

		.address {
			display: flex;
			background: #FFFFFF;
			border-radius: 20rpx;
			padding: 32rpx 20rpx;
			margin-top: -100rpx;

			.address-left {

				image {
					width: 48rpx;
					height: 48rpx;
				}
			}

			.address-right {
				display: flex;
				align-items: center;

				.address-info {
					display: flex;
					flex-direction: column;
					padding: 0rpx 40rpx 0rpx 20rpx;

					.address-info-top {
						font-size: 30rpx;
						font-weight: 600;
						color: #333333;
					}

					.address-info-bottom {
						font-size: 24rpx;
						color: #999999;
						margin-top: 6rpx;
					}
				}

				.address-righticon {

					image {
						width: 48rpx;
						height: 48rpx;
					}
				}
			}
		}

		.goods {
			display: flex;
			background: #FFFFFF;
			border-radius: 20rpx;
			padding: 32rpx 30rpx;
			margin-top: 22rpx;

			.goods-left {

				image {
					width: 130rpx;
					height: 130rpx;
				}
			}

			.goods-center {
				display: flex;
				flex-direction: column;
				padding: 0rpx 60rpx 0rpx 30rpx;

				.goods-name {
					font-size: 26rpx;
					font-weight: 600;
					color: #333333;
				}

				.goods-spec {
					font-size: 22rpx;
					color: #999999;
					margin-top: 10rpx;
				}

				.goods-num {
					font-size: 22rpx;
					color: #999999;
				}
			}

			.goods-right {
				font-size: 22rpx;
				font-weight: 600;

				.goods-price {
					font-size: 32rpx;
					color: #333333;
				}
			}

		}

		.price {
			background: #FFFFFF;
			border-radius: 20rpx;
			padding: 32rpx 30rpx;
			margin-top: 22rpx;

			.price-top {
				display: flex;
				flex-direction: column;
				line-height: 40rpx;
				padding: 10rpx 0rpx;
				border-bottom: 1rpx solid #ECECEC;

				.price-top-left {
					font-size: 24rpx;
					color: #666666;
				}

				.price-top-xiaoji {
					display: flex;
					justify-content: space-between;

					.price-top-right {
						font-weight: 600;
						font-size: 22rpx;

						.xiaoji-price {
							font-size: 32rpx;
						}
					}

				}

				.price-top-youhui {
					display: flex;
					justify-content: space-between;

					.youhui-price {
						font-size: 24rpx;
						color: #333333;
					}
				}
			}

			.price-bottom {
				margin-top: 16rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.price-bottom-left {
					font-size: 24rpx;
					font-weight: 600;
					color: #333333;
				}

				.price-bottom-right {
					font-weight: 600;
					font-size: 22rpx;
					color: #F55726;

					.xiaoji-price {
						font-size: 32rpx;
					}
				}
			}
		}

		.order {
			background: #FFFFFF;
			border-radius: 20rpx;
			padding: 32rpx 30rpx;
			margin-top: 22rpx;

			.order-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				line-height: 50rpx;

				.order-item-left {
					font-size: 24rpx;
					color: #999999;
				}

				.order-item-right {
					font-size: 24rpx;
					color: #333333;
				}
			}
		}
	}

	.bottom {
		position: fixed;
		bottom: var(--window-bottom, 0);
		width: 100%;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 22rpx 0rpx;

	}

	.btns {
		display: flex;
		margin-right: 30rpx;

		button {
			border-radius: 24rpx;
			background-color: #FFFFFF;
			margin: 0;
		}

		button::after {
			border: none;
		}

		.cancel {
			font-size: 24rpx;
			color: #333333;
			border: 1rpx solid #999999;
			margin-right: 20rpx;
		}

		.pay {
			font-size: 24rpx;
			color: #40AE36;
			border: 1rpx solid #40AE36;
		}
	}
</style>

