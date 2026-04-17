<template>
	<view class="container">
		<view class="banner">
			<u-swiper :list="banner" mode="number" indicator-pos="bottomRight" :autoplay=false height="600"></u-swiper>
		</view>
		<view class="content">
			<!-- 商品信息 -->
			<view class="info">
				<view class="goods-price">
					<view class="goods-price-left">
						<view class="new-price">
							￥<text class="goods-price-txt">{{goods.price}}<text
									class="goods-unit-txt">/{{goods.unit}}</text></text>
						</view>
						<view class="old-price">
							<text>￥{{goods.old_price}}</text>
						</view>
					</view>
					<view class="goods-price-right">
						<view v-for="(item, index) in goods.tags" :key="index">
							<text>{{item}}</text>
						</view>
					</view>
				</view>
				<view class="goods-name">
					<text>{{goods.name}}</text>
				</view>
				<view class="goods-label">
					<text class="goods-label-name">{{goods.label}}</text>
					<text class="goods-label-content">{{goods.lable_content}}</text>
				</view>
			</view>

			<!-- 商品服务 -->
			<view class="service">
				<view class="service-item">
					<text class="service-item-name">配送</text>
					<text class="service-item-content">上架24H发货，第三方物流配送，免运费</text>
				</view>
				<view class="service-item">
					<text class="service-item-name">服务</text>
					<text class="service-item-content">品质保证，生鲜不支持7天无理由退货</text>
				</view>
				<view class="service-item">
					<text class="service-item-name">优惠</text>
					<text class="service-item-content">特价商品每人限购2份</text>
				</view>
			</view>

			<!-- 已选规格 -->
			<view class="specs" @click="openSpecs()">
				<view class="specs-left">
					<text>已选</text>
					<text>0.5kg/份</text>
				</view>
				<view class="specs-right">
					<image src="/static/one.png"></image>
				</view>
			</view>
			<!-- 规格弹出层 -->
			<u-popup v-model="popupShow" mode="bottom" border-radius="14" :closeable="true">
				<view class="specs-popup">
					<view class="specs-popup-title">选择规格</view>
					<view class="specs-popup-weight">
						<text class="specs-popup-weight-txt">选择重量</text>
						<view class="specs-popup-weight-list">
							<text :class="[specsWeight === item.id ? 'specs-weight-active' : '']"
								v-for="(item,index) in goods.specs" :key="item.id"
								@click="changeSpecsWeight(item.id)">{{item.name}}</text>
						</view>
					</view>
					<view class="specs-popup-num">
						<text class="specs-popup-num-txt">选择数量</text>
						<view class="specs-popup-num-box">
							<u-number-box v-model="count" :min="1" :max="100"></u-number-box>
						</view>
					</view>
					<view class="specs-popup-btn">
						<button @click="popupAddCart()"><text>加入购物车</text></button>
					</view>
				</view>
			</u-popup>


			<!-- 用户评价 -->
			<view class="comment">
				<view class="comment-top">
					<view class="comment-top-left">
						<text>用户评价</text>
						<text>({{goods.comment_num}})</text>
					</view>
					<view class="comment-top-right" @click="toComment()">
						<text>查看全部</text>
						<image src="/static/one.png"></image>
					</view>
				</view>
				<view class="comment-bottom">
					<view class="comment-info" v-for="(item, index) in goods.comment_list" :key="index">
						<view class="comment-bottom-left">
							<image :src="item.avatar"></image>
						</view>
						<view class="comment-bottom-right">
							<view class="comment-nickname">
								<text>{{item.nickname}}</text>
								<text>{{item.date}}</text>
							</view>
							<view class="comment-star">
								<u-rate :count="5" v-model="item.star" inactive-color="#DCDEE0" active-color="#FBA808"
									:disabled="true" size="28"></u-rate>
							</view>
							<view class="comment-content">
								{{item.content}}
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 详细信息 -->
			<view class="detail">
				<view class="detail-title">规格信息</view>
				<view class="detail-table">
					<u-table>
						<u-tr class="u-tr">
							<u-th class="u-th">产地</u-th>
							<u-th class="u-th">规格</u-th>
							<u-th class="u-th">保质期</u-th>
						</u-tr>
						<u-tr class="u-tr">
							<u-td class="u-td">山东</u-td>
							<u-td class="u-td">189g</u-td>
							<u-td class="u-td">30天</u-td>
						</u-tr>
					</u-table>
				</view>
				<view v-for="(item, index) in goods.images" :key="index">
					<image :src="item"></image>
				</view>
			</view>
		</view>

		<!-- 底部栏 -->
		<view class="bottombar">
			<view class="bottombar-content">
				<view class="bottombar-content-item">
					<image src="/static/one.png"></image>
					<text>收藏</text>
				</view>
				<view class="bottombar-content-item">
					<image src="/static/one.png"></image>
					<text>客服</text>
				</view>
			</view>
			<view class="bottombar-btn">
				<button @click="addCart()">加入购物车</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popupShow: false,
				banner: ["/static/one.png"],
				goods: {
					name: "四川眉山 爱媛38号可吸的果冻橙礼盒装12粒(单果180g+)",
					old_price: "49.9",
					price: "19.9",
					unit: "份",
					tags: ["入口即化", "好吃不腻"],
					label: "产地量贩",
					lable_content: "基地优选 售后无忧",
					comment_num: 1680,
					comment_list: [{
						id: 1,
						avatar: "/static/one.png",
						nickname: "苦逼的***员",
						date: "2021.12.27",
						star: 4,
						content: "入手很多，活动力度很大必须囤起来，苹果很脆，水分很足，甜度可口，没有酸感，大小很合适。"
					}],
					images: ["/static/one.png", "/static/one.png"],
					specs: [{
							id: "1",
							name: "0.5kg"
						},
						{
							id: "2",
							name: "0.8kg"
						},
						{
							id: "3",
							name: "1.0kg"
						}
					],
				},
				count: 1,
				specsWeight: 1,
			};
		},
		methods: {
			// 弹窗状态
			openSpecs() {
				this.popupShow = !this.popupShow;
			},
			// 改变选中的规格
			changeSpecsWeight(i) {
				this.specsWeight = i;
			},
			// 弹出层加入购物车
			popupAddCart() {
				this.popupShow = false;
				this.$utils.toastTip("成功加入购物车");
			},
			// 打开弹出层
			addCart() {
				this.popupShow = true;
			},
			// 跳转用户评价
			toComment() {
				uni.navigateTo({
					url: "/pages/goods/comment"
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
	.banner {}

	.content {
		margin: 20rpx;

		.info {
			background: #FFFFFF;
			padding: 20rpx 20rpx 26rpx 20rpx;
			border-radius: 20rpx;

			.goods-price {
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #F55726;
				font-size: 22rpx;
				border-radius: 20rpx;

				.goods-price-left {
					display: flex;
					align-items: flex-end;

					.goods-price-txt {
						font-size: 42rpx;
						font-weight: 600;

						.goods-unit-txt {
							font-size: 22rpx;
							color: #999999;
							font-weight: normal;
						}
					}

					.old-price {
						color: #CCCCCC;
						text-decoration: line-through;
						margin-left: 8rpx;
					}
				}

				.goods-price-right {
					display: flex;
					align-items: center;

					text {
						border: 1rpx solid #CCCCCC;
						border-radius: 4rpx;
						margin-right: 10rpx;
						color: #CCCCCC;
						padding: 2rpx 4rpx;
					}
				}
			}

			.goods-name {
				font-size: 34rpx;
				font-weight: 600;
				color: #333333;
				margin-top: 10rpx;
			}

			.goods-label {
				margin-top: 20rpx;
				display: flex;
				align-items: center;

				.goods-label-name {
					background: #40AE36;
					border-radius: 6rpx;
					font-size: 22rpx;
					color: #FFFFFF;
					padding: 4rpx 10rpx;
				}

				.goods-label-content {
					font-size: 22rpx;
					color: #666666;
					margin-left: 10rpx;
				}
			}
		}

		.service {
			background: #FFFFFF;
			margin-top: 20rpx;
			padding: 20rpx;
			border-radius: 20rpx;

			.service-item {
				display: flex;
				align-items: center;
				line-height: 52rpx;

				.service-item-name {
					color: #999999;
					font-size: 24rpx;
				}

				.service-item-content {
					color: #333333;
					font-size: 24rpx;
					margin-left: 20rpx;
				}
			}
		}

		.specs {
			border-radius: 20rpx;
			background: #FFFFFF;
			margin-top: 20rpx;
			padding: 24rpx 10rpx 22rpx 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 26rpx;

			text:nth-child(1) {
				font-weight: bold;
				color: #333333;
			}

			text:nth-child(2) {
				margin-left: 16rpx;
			}

			image {
				width: 48rpx;
				height: 48rpx;
			}

		}

		.specs-popup {
			background: #FFFFFF;
			padding: 34rpx 56rpx 20rpx 56rpx;

			.specs-popup-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333333;
				text-align: center;
			}

			.specs-popup-weight {
				margin-top: 50rpx;

				.specs-popup-weight-txt {
					color: #333333;
					font-size: 28rpx;
				}

				.specs-popup-weight-list {
					margin-top: 34rpx;

					text {
						width: 160rpx;
						margin-right: 24rpx;
						color: #333333;
						padding: 10rpx 40rpx;
						border-radius: 16rpx;
						background: #F8F9FA;
					}

					.specs-weight-active {
						color: #40AE36;
					}
				}
			}

			.specs-popup-num {
				margin-top: 50rpx;
				margin-bottom: 100rpx;

				.specs-popup-num-txt {
					color: #333333;
					font-size: 28rpx;
				}

				.specs-popup-num-box {
					margin-top: 34rpx;
				}
			}


			.specs-popup-btn {
				width: 100%;
				padding: 24rpx 0rpx;

				button {
					flex: 1;
					border-radius: 46rpx;
					background: #40AE36;
					color: #FFFFFF;
					font-size: 26rpx;
					padding: 12rpx 0rpx;
				}
			}
		}

		.comment {
			background: #FFFFFF;
			margin-top: 20rpx;
			padding: 10rpx 10rpx 22rpx 20rpx;
			border-radius: 20rpx;

			.comment-top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10rpx 0rpx 22rpx 0rpx;
				border-bottom: 1rpx solid #EBEBEB;

				.comment-top-left {

					text:nth-child(1) {
						font-size: 26rpx;
						font-weight: bold;
						color: #333333;
					}

					text:nth-child(2) {
						font-size: 22rpx;
						color: #999999;
						margin-left: 4rpx;
					}
				}

				.comment-top-right {
					display: flex;
					align-items: center;

					text {
						font-size: 24rpx;
					}

					image {
						width: 48rpx;
						height: 48rpx;
					}
				}
			}

			.comment-bottom {
				padding-top: 30rpx;

				.comment-info {
					display: flex;

					.comment-bottom-right {
						padding: 0rpx 20rpx;

						.comment-nickname {
							display: flex;
							align-items: center;
							justify-content: space-between;

							text:nth-child(1) {
								font-size: 24rpx;
								font-weight: 600;
								color: #333333;
							}

							text:nth-child(2) {
								font-size: 22rpx;
								color: #999999;
							}
						}

						.comment-content {
							margin-top: 20rpx;
							color: #666666;
							font-size: 24rpx;
						}
					}

				}

				image {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
				}
			}
		}

		.detail {
			background: #FFFFFF;
			margin-top: 20rpx;
			padding: 10rpx 10rpx 120rpx 20rpx;
			border-radius: 20rpx;

			.detail-title {
				color: #333333;
				font-size: 26rpx;
				font-weight: 600;
				padding: 10rpx 20rpx 10rpx 0rpx;
			}

			.detail-table {
				margin-top: 20rpx;
			}
		}
	}

	.bottombar {
		position: fixed;
		bottom: var(--window-bottom, 0);
		width: 100%;
		background: #FFFFFF;
		display: flex;
		align-items: center;

		.bottombar-content {
			display: flex;
			align-items: center;
			padding: 20rpx;

			image {
				width: 36rpx;
				height: 36rpx;
			}

			.bottombar-content-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 60rpx;
				min-width: 60rpx;

				text {
					font-size: 18rpx;
					margin-top: 2rpx;
				}
			}
		}

		.bottombar-btn {
			display: flex;
			align-items: center;
			width: 100%;
			padding-right: 20rpx;

			button {
				flex: 1;
				border-radius: 36rpx;
				background: #40AE36;
				color: #FFFFFF;
				font-size: 26rpx;
			}
		}

	}
</style>

