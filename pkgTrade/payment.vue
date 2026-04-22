<template>
	<view class="container">
		<view class="content">
			<!-- 地址信息 -->
			<view class="address" @click="goAddress()">
				<view class="address-left">
					<image src="/static/one.png"></image>
				</view>
				<view class="address-right">
					<view class="address-info">
						<view class="address-info-top">
							{{address.address}}
						</view>
						<view class="address-info-bottom">
							<text class="address-name">{{address.name}}</text>
							<text class="address-phone">{{address.phone}}</text>
						</view>
					</view>
					<view class="address-righticon">
						<image src="/static/one.png"></image>
					</view>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="goods">
				<view class="goods-info" v-for="(item,index) in goods" :key="item.id">
					<view class="logistics">
						<text class="logistics-left">生鲜快递发货</text>
						<text class="logistics-right">上架24H发货，第三方物流配送</text>
					</view>
					<view class="goods-item">
						<view class="goods-left">
							<image :src="item.image"></image>
						</view>
						<view class="goods-center">
							<text class="goods-name">{{item.name}}</text>
							<text class="goods-spec">规格：{{item.specs}}</text>
							<text class="goods-num">数量：{{item.num}} {{item.unit}}</text>
						</view>
						<view class="goods-right">
							￥<text class="goods-price">{{item.price}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 优惠券 -->
			<view class="coupon">
				<view class="coupon-left">
					优惠券
				</view>
				<view class="coupon-right">
					<text>-￥10</text>
					<image src="/static/one.png"></image>
				</view>
			</view>

		</view>
		<!-- 底部栏 -->
		<view class="bottombar">
			<view class="bottombar-content">
				<text>共2件，合计：</text>
				<text class="bottombar-label">￥<text class="bottombar-price">76.9</text></text>
				<button @click="submit()">提交订单</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address: {
					id: 1,
					name: "小明",
					phone: "15800123213",
					address: "北京市海淀区恒大新宏福苑西区21号楼2单元301",
					tag: "家"
				},
				goods: [{
					id: 1,
					name: "彩食有机鲜菠菜彩食新鲜的菠菜",
					image: "/static/one.png",
					price: "19.9",
					unit: "份",
					specs: "0.5kg",
					num: 2
				}, {
					id: 2,
					name: "四川眉山 爱媛38号果冻橙礼盒装",
					image: "/static/one.png",
					price: "30.9",
					unit: "盒",
					specs: "1kg",
					num: 1
				}]
			}
		},
		methods: {
			// 跳转地址管理页面
			goAddress() {
				uni.navigateTo({
					url: "/pages/address/address"
				})
			},
			// 提交订单
			submit() {
				this.$utils.toastTip("支付成功", 'success');
				setTimeout(() => {
					uni.navigateTo({
						url: "/pkgTrade/paymentinfo"
					})
				}, 1000);
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
	.content {
		margin: 20rpx 30rpx;
	}

	.address {
		display: flex;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 32rpx 20rpx;

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

					.address-phone {
						margin-left: 16rpx;
					}
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
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-top: 22rpx;
		display: flex;
		flex-direction: column;
		gap: 44rpx;

		.logistics {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24rpx;
			padding-bottom: 30rpx;

			.logistics-left {
				font-weight: 600;
			}

			.logistics-right {
				color: #40AE36;
			}
		}

		.goods-item {
			display: flex;
			padding: 10rpx 0rpx;

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
	}

	.coupon {
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-top: 22rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.coupon-left {
			font-size: 30rpx;
		}

		.coupon-right {
			display: flex;
			align-items: center;

			text {
				font-size: 28rpx;
				color: #F55726;
			}

			image {
				width: 48rpx;
				height: 48rpx;
			}
		}
	}

	.bottombar {
		position: fixed;
		bottom: var(--window-bottom, 0);
		width: 100%;
		background: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;

		.bottombar-content {
			padding: 16rpx 30rpx 20rpx 16rpx;
			display: flex;
			align-items: center;
			text-align: right;

			text {
				color: #333333;
				font-size: 24rpx;
			}

			.bottombar-label {
				font-size: 22rpx;
				color: #F55726;
			}

			.bottombar-price {
				font-size: 32rpx;
				font-weight: 600;
				color: #F55726;
				margin-right: 28rpx;
			}

		}

		button {
			border-radius: 36rpx;
			background: #40AE36;
			color: #FFFFFF;
			font-size: 24rpx;
		}
	}
</style>

