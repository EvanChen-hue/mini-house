<template>
	<view class="container">
		<view class="content">
			<view class="remark">
				<text>共 <text class="remark-num">{{cartList.length}}</text> 件商品</text>
				<text class="remark-edit" @click="edit()">编辑</text>
			</view>
			<!-- 空状态 -->
			<view class="empty" v-if="cartList.length == 0">
				<text class="empty-title">购物车空空如也</text>
				<text class="empty-content">赶紧慰劳一下自己吧</text>
				<button>去逛逛</button>
			</view>

			<!-- 购物车商品 -->
			<view class="cart" v-else>
				<view class="cart-goods">
					<checkbox-group @change="checkboxChange">
						<view class="cart-item" v-for="(item, index) in cartList" :key="item.id">
							<view>
								<label>
									<checkbox class="round red" :checked="item.checked" :value="item.id" color="#40AE36"
										active-border-color="#40AE36" active-background-color="#40AE36"
										icon-color="#FFFFFF" style="transform: scale(0.8)" />
								</label>
							</view>
							<view class="goods">
								<view class="goods-image">
									<image :src="item.image"></image>
								</view>
								<view class="goods-right">
									<view class="goods-name">
										{{item.name}}
									</view>
									<view class="goods-tag">
										<text v-for="(i, index) in item.service" :key="index">
											{{i}}
										</text>
									</view>
									<view class="goods-old-price"><text>￥{{item.old_price}}</text></text></view>
									<view class="goods-price">
										<view>
											￥<text class="goods-price-txt">{{item.price}}</text>
										</view>
										<view>
											<u-number-box v-model="item.num" bg-color="#FFFFFF" :min="1" :max="99"
												:step="1" :index="item.id"></u-number-box>
										</view>
									</view>
								</view>
							</view>
						</view>
					</checkbox-group>
				</view>
			</view>

			<!-- 为你推荐 -->
			<view class="recommend">
				<view class="recommend-title">
					<image class="recommend-title-l" src="/static/one.png"></image>
					<text>为你推荐</text>
					<image class="recommend-title-r" src="/static/one.png"></image>
				</view>
				<view class="recommend-goods">
					<view class="recommend-item" v-for="(item, index) in recommendList" :key="item.id">
						<image class="recommend-item-image" :src="item.image"></image>
						<view class="recommend-item-name">
							{{item.name}}
						</view>
						<view class="recommend-item-tag">
							<text v-for="(i, index) in item.service" :key="index">
								{{i}}
							</text>
						</view>
						<view class="recommend-item-price">
							<text class="recommend-item-price-txt">￥{{item.price}}<text
									class="recommend-item-price-unit">
									/{{item.unit}}</text></text>
							<image class="recommend-item-shopcar-icon" src="/static/one.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部栏 -->
		<view class="bottombar">
			<view class="bottombar-content">
				<view class="bottombar-left">
					<checkbox class="round red" value="全选" :checked="checkedAll" color="#40AE36"
						active-border-color="#40AE36" active-background-color="#40AE36" icon-color="#FFFFFF"
						style="transform: scale(0.8);" @click="selectAll()" />
					<text>全选</text>
				</view>
				<view class="bottombar-right" v-if="!editState">
					<text>合计：</text>
					<text class="bottombar-price">￥{{totalPrice}}</text>
					<button @click="goPayment()">去结算</button>
				</view>
				<view class="bottombar-right" v-else>
					<button class="del-btn" @click="delGoods()">删除</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cartList: [{
						id: '1',
						name: '彩食鲜菠菜 270g/份',
						image: '/static/one.png',
						old_price: '19.9',
						price: '19.9',
						num: 1,
						service: ["特价", "24H发货"],
						checked: false
					},
					{
						id: '2',
						name: '爱媛38号果冻橙礼盒装',
						image: '/static/one.png',
						old_price: '19.9',
						price: '19.9',
						num: 4,
						service: ["特价", "24H发货"],
						checked: false
					},
					{
						id: '3',
						name: '江苏洪泽湖南大闸蟹',
						image: '/static/one.png',
						old_price: '19.9',
						price: '29.9',
						num: 1,
						service: ["特价", "24H发货"],
						checked: false
					}
				],
				recommendList: [{
						id: 1,
						name: '彩食鲜菠菜 270g/份',
						price: '19.9',
						unit: '份',
						image: '/static/one.png',
						service: ["特价", "24H发货"],
					},
					{
						id: 2,
						name: '四川爱媛38号可吸果冻橙 1kg/份',
						price: '39.9',
						unit: '箱',
						image: '/static/one.png',
						service: ["特价", "24H发货"],
					},
					{
						id: 3,
						name: '云南昆明 有机水果胡萝卜 1.5kg/份',
						price: '38.8',
						unit: '箱',
						image: '/static/one.png',
						service: ["特价", "24H发货"],
					},
					{
						id: 4,
						name: '云南香格里拉 野生山核桃 原味150g*',
						price: '39.9',
						unit: '箱',
						image: '/static/one.png',
						service: ["特价", "24H发货"],
					},
					{
						id: 5,
						name: '彩食鲜菠菜 270g/份',
						price: '12.8',
						unit: '份',
						image: '/static/one.png',
						service: ["特价", "24H发货"],
					},
				],
				checkedAll: false,
				num: 1,
				price: 0,
				editState: false
			};
		},
		computed: {
			// 计算总价
			totalPrice() {
				let tprice = 0;
				var items = this.cartList;
				for (var i = 0, len = items.length; i < len; ++i) {
					const item = items[i];
					const price = this.$utils.mathMul(item.price, item.num);
					if (item.checked) {
						tprice += price;
					}
				}
				return this.$utils.numberFormat(tprice);
			}
		},
		methods: {
			checkboxChange: function(e) {
				let price = 0;
				var items = this.cartList,
					values = e.detail.value;
				var allState = true;

				// 对有复选框的数组集合进行遍历
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i];
					// 判断当前商品是否在选中的ID列表中
					if (values.includes(item.id)) {
						this.$set(item, 'checked', true); // 设置为选中
					} else {
						this.$set(item, 'checked', false); // 设置为未选中
						allState = false; // 如果有商品未选中，取消全选状态
					}
					if (item.checked == false) {
						allState = false;
					}
				}
				this.checkedAll = allState;
			},
			// 选中/取消选中全部
			selectAll() {
				let price = 0;
				var items = this.cartList;
				// 根据 checkedAll 的状态，决定是选中所有还是取消所有
				const newCheckedState = !this.checkedAll;
				for (var i = 0, len = items.length; i < len; ++i) {
					this.$set(items[i], 'checked', newCheckedState);
				}
				// 最后更新 checkedAll 的状态
				this.checkedAll = newCheckedState;
			},
			// 跳转结算页面
			goPayment() {
				if (this.totalPrice == 0.00) {
					this.$utils.toastTip("请先选择商品");
					return;
				}
				uni.navigateTo({
					url: "/pkgTrade/payment"
				})
			},
			// 编辑商品
			edit() {
				this.editState = !this.editState;
			},
			// 删除商品
			delGoods() {
				let arr = this.cartList;
				var newArr = arr.filter(item => item.checked !== true);
				let that = this;
				this.$utils.showConfirm("确定要删除选中的商品吗？").then(res => {
					if (res.confirm) {
						that.cartList = newArr;
						that.$utils.toastTip("删除成功！");
					}
				});
			}

		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F9FA;
		font-family: PingFangSC;
	}

	/*每个页面公共css */
	/* //设置圆角 */
	checkbox.round .wx-checkbox-input,
	checkbox.round .uni-checkbox-input {
		border-radius: 100upx;
		border: 2px solid #40AE36;
	}

	/* //设置背景色 */
	checkbox.red[checked] .wx-checkbox-input,
	checkbox.red.checked .uni-checkbox-input {
		background-color: #40AE36 !important;
		border-color: #40AE36 !important;
		color: #FFFFFF !important;
	}

	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
		content: '\2022';
	}

	.u-numberbox {

		.u-icon-minus,
		.u-icon-plus {
			width: 44rpx;
			height: 44rpx;
			background: #F8F9FA !important;
			border-radius: 50%;

			.u-icon {
				color: #333333;
			}
		}

		.u-icon-disabled {
			background: #F8F9FA !important;
		}
	}
</style>

<style lang="scss" scoped>
	.content {
		padding: 20rpx 30rpx;
	}

	.remark {
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx 20rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.remark-num {
			font-weight: 600;
		}

		.remark-edit {
			color: #40AE36;
		}
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 60rpx 30rpx;

		.empty-title {
			font-size: 32rpx;
			color: #333333;
		}

		.empty-content {
			font-size: 28rpx;
			color: #999999;
			margin-top: 10rpx;
		}

		button {
			border-radius: 36rpx;
			background-color: #FFFFFF;
			margin: 0;
			font-size: 24rpx;
			color: #40AE36;
			border: 1rpx solid #40AE36;
			margin-top: 30rpx;
		}

		button::after {
			border: none;
		}
	}

	.cart {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx 20rpx;

		.cart-goods {
			width: 100%;
		}
	}

	.recommend {
		margin-top: 50rpx;
		margin-bottom: 100rpx;

		.recommend-title {
			display: flex;
			align-items: center;
			justify-content: center;

			text {
				font-size: 30rpx;
				font-weight: 600;
				color: #333333;
			}

			image {
				width: 40rpx;
				height: 22rpx;
			}

			.recommend-title-l {
				margin-right: 30rpx;
			}

			.recommend-title-r {
				margin-left: 30rpx;
			}
		}

		.recommend-goods {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.recommend-item {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				border-radius: 20rpx;
				background: #FFFFFF;
				padding: 0rpx 30rpx 30rpx 30rpx;
				margin-top: 30rpx;
			}

			.recommend-item-image {
				width: 280rpx;
				height: 280rpx;
				border-radius: 4px;
			}

			.recommend-item-name {
				width: 274rpx;
				font-size: 26rpx;
				font-weight: 700;
				line-height: 34rpx;
				color: #333333;
				margin-top: 10rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}

			.recommend-item-tag {
				display: flex;
				align-items: center;
				margin-top: 14rpx;
				font-size: 18rpx;

				text:nth-child(1) {
					color: #F55726;
					border: 1px solid #F55726;
					border-radius: 4rpx;
					padding: 0rpx 4rpx;
				}

				text:nth-child(2) {
					color: #40AE36;
					border: 1px solid #40AE36;
					border-radius: 4rpx;
					margin-left: 10rpx;
					padding: 0rpx 4rpx;
				}
			}

			.recommend-item-price {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 14rpx;

				.recommend-item-price-txt {
					color: #F55726;
					font-size: 32rpx;
					font-weight: 600;

					.recommend-item-price-unit {
						font-size: 22rpx;
						color: #999999;
						font-weight: normal;
					}
				}

				.recommend-item-shopcar-icon {
					width: 44rpx;
					height: 44rpx;
					margin-right: 10rpx;
				}
			}
		}
	}

	.cart-item {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.goods {
		display: flex;
		align-items: center;
		padding: 0rpx 16rpx;
		width: 100%;

		.goods-right {
			margin-left: 24rpx;
			width: 100%;
		}

		.goods-image {
			image {
				width: 180rpx;
				height: 180rpx;
				border-radius: 4px;
			}
		}

		.goods-name {
			font-size: 26rpx;
			font-weight: 700;
			line-height: 34rpx;
			color: #333333;
			margin-top: 10rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		.goods-tag {
			display: flex;
			align-items: center;
			margin-top: 14rpx;
			font-size: 18rpx;

			text:nth-child(1) {
				color: #F55726;
				border: 1px solid #F55726;
				border-radius: 4rpx;
				padding: 0rpx 4rpx;
			}

			text:nth-child(2) {
				color: #40AE36;
				border: 1px solid #40AE36;
				border-radius: 4rpx;
				margin-left: 10rpx;
				padding: 0rpx 4rpx;
			}
		}

		.goods-old-price {
			font-size: 22rpx;
			color: #CCCCCC;
			text-decoration: line-through;
			margin: 20rpx 0rpx 4rpx 0rpx;
		}

		.goods-price {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			color: #F55726;
			font-size: 24rpx;

			.goods-price-txt {
				font-size: 32rpx;
				font-weight: 600;

				.goods-price-unit {
					font-size: 22rpx;
					color: #999999;
					font-weight: normal;
				}
			}
		}
	}

	.bottombar {
		position: fixed;
		bottom: var(--window-bottom, 0);
		width: 100%;
		background: #FFFFFF;

		.bottombar-content {
			padding: 16rpx 30rpx 20rpx 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.bottombar-left {

			text {
				font-size: 24rpx;
				color: #333333;
			}
		}

		.bottombar-right {
			display: flex;
			align-items: center;


			button {
				border-radius: 36rpx;
				background: #40AE36;
				color: #FFFFFF;
				font-size: 24rpx;
			}

			.del-btn {
				background: #F55726;
			}


			text {
				color: #333333;
				font-size: 24rpx;
			}

			.bottombar-price {
				font-size: 32rpx;
				font-weight: 600;
				margin-right: 30rpx;
			}
		}
	}
</style>

