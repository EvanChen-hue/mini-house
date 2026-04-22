<template>
	<view class="container">
		<view class="amount">
			余额：<text>{{amount}}</text>元
		</view>
		<view v-if="list.length > 0">
			<view class="items" v-for="(item, index) in list" :key="item.id">
				<view class="item-left">
					<text class="goods-name">购买商品：{{item.goods_name}}</text>
					<text class="time">{{item.time}}</text>
				</view>
				<view class="item-right">
					<text class="price">{{item.price}}</text>
				</view>
			</view>
		</view>
		<!-- 内容为空 -->
		<view class="empty" v-else>
			<u-empty text="暂无数据" mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount: 100,
				list: [{
					id: 1,
					goods_name: "彩食鲜菠菜",
					order_no: "ST992152486423762138",
					time: "2024-11-13 08:30",
					address: "北京市海淀区恒大新宏福苑西区21号楼2单元301",
					price: "-49.9"
				}, {
					id: 2,
					goods_name: "彩食鲜菠菜",
					order_no: "ST992152486423762138",
					time: "2024-11-13 08:30",
					address: "北京市海淀区恒大新宏福苑西区21号楼2单元301",
					price: "-19.9"
				}, {
					goods_name: "彩食鲜菠菜",
					order_no: "ST992152486423762138",
					time: "2024-11-13 08:30",
					address: "北京市海淀区恒大新宏福苑西区21号楼2单元301",
					price: "-49.9"
				}]
			}
		},
		methods: {
			add() {
				uni.navigateTo({
					url: "/pages/address/add"
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
		margin: 20rpx 30rpx;
	}

	.amount {
		display: flex;
		align-items: baseline;
		margin: 80rpx 0rpx;
		font-size: 30rpx;

		text {
			font-size: 96rpx;
			font-weight: bold;
		}
	}

	.items {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 32rpx 20rpx;
		margin-bottom: 22rpx;

		.item-left {
			display: flex;
			flex-direction: column;

			.goods-name {
				font-size: 30rpx;
				font-weight: 600;
			}

			.time {
				margin-top: 10rpx;
			}
		}

		.item-right {
			display: flex;
			flex-direction: column;

			.price {
				font-size: 32rpx;
				font-weight: 600;
				color: #F55726;
			}
		}
	}
	
	.empty {
		margin-top: 200rpx;
	}
</style>