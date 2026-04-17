<template>
	<view class="container">
		<view class="item" v-if="list.length > 0">
			<text class="item-lable">今日</text>
			<view class="goods">
				<view class="goods-item" v-for="(item, index) in list" :key="index">
					<image class="goods-image" :src="item.image"></image>
					<view class="goods-title">
						{{item.title}}
					</view>
					<view class="goods-tag">
						<view class="goods-tag-owner">
							特价
						</view>
						<view class="goods-tag-text">
							24H发货
						</view>
					</view>
					<view class="goods-price">
						<text class="goods-price-txt">￥{{item.price}}<text class="goods-price-unit">
								/{{item.unit}}</text></text>
						<image class="goods-shopcar-icon" src="/static/one.png"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 内容为空 -->
		<view class="empty" v-else>
			<u-empty text="抱歉，您还没有浏览过商品" mode="favor"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						price: '19.9',
						unit: '份',
						title: '彩食鲜菠菜 270g/份',
						image: '/static/one.png',
					},
					{
						price: '39.9',
						unit: '箱',
						title: '四川爱媛38号可吸果冻橙 1kg/份',
						image: '/static/one.png',
					},
					{
						price: '38.8',
						unit: '箱',
						title: '云南昆明 有机水果胡萝卜 1.5kg/份',
						image: '/static/one.png',
					},
					{
						price: '39.9',
						unit: '箱',
						title: '云南香格里拉 野生山核桃 原味150g*',
						image: '/static/one.png',
					},
					{
						price: '12.8',
						unit: '份',
						title: '彩食鲜菠菜 270g/份',
						image: '/static/one.png',
					},
				]
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
	}

	.item {
		padding-bottom: 60rpx;

		.item-lable {
			font-size: 28rpx;
			color: #666666;
		}

		.goods {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: 20rpx;

			.goods-item {
				border-radius: 20rpx;
				background: #FFFFFF;
				padding: 0rpx 30rpx 30rpx 30rpx;
				margin-bottom: 30rpx;
			}

			.goods-image {
				width: 280rpx;
				height: 280rpx;
				border-radius: 4px;
			}

			.goods-title {
				width: 274rpx;
				font-size: 26rpx;
				font-weight: 700;
				line-height: 34rpx;
				color: #333333;
				margin-top: 10rpx;
			}

			.goods-tag {
				display: flex;
				align-items: center;
				margin-top: 14rpx;
			}

			.goods-tag-owner {
				color: #F55726;
				font-size: 18rpx;
				border: 1px solid #F55726;
				border-radius: 4rpx;
				padding: 2rpx 10rpx;
				line-height: 22rpx;
			}

			.goods-tag-text {
				color: #40AE36;
				font-size: 18rpx;
				border: 1px solid #40AE36;
				border-radius: 4rpx;
				margin-left: 10rpx;
				padding: 2rpx 10rpx;
				line-height: 22rpx;
			}

			.goods-price {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 14rpx;

				.goods-price-txt {
					color: #F55726;
					font-size: 32rpx;
					font-weight: 600;

					.goods-price-unit {
						font-size: 22rpx;
						color: #999999;
						font-weight: normal;
					}
				}

				.goods-shopcar-icon {
					width: 44rpx;
					height: 44rpx;
					margin-right: 10rpx;
				}
			}
		}
	}

	.empty {
		margin-top: 200rpx;
	}
</style>
