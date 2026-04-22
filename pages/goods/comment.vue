<template>
	<view class="container">
		<!-- 顶部商品信息 -->
		<view class="goods">
			<view class="goods-image">
				<image src="/static/one.png"></image>
			</view>
			<view class="goods-name"><text>四川眉山 爱媛38号果冻橙礼盒装</text></view>
		</view>
		<view class="content">
			<!-- 用户评价 -->
			<view class="comment">
				<view class="comment-info" v-for="(item, index) in list" :key="item.id">
					<view class="comment-avatar">
						<image :src="item.avatar"></image>
					</view>
					<view class="comment-right">
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
						<view class="comment-image" v-if="item.images.length > 0">
							<view class="comment-image-item" v-for="(image, index) in item.images" :key="index">
								<image :src="image" :lazy-load="true" @click="viewImage(item.id)"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部栏 -->
		<view class="bottombar">
			<view class="bottombar-content">
				<view class="bottombar-content-item">
					<image src="/static/one.png" @click="collect()" v-if="!collectState"></image>
					<image src="/static/one.png" @click="collect()" v-else></image>
					<text>收藏</text>
				</view>
				<view class="bottombar-content-item">
					<image src="/static/one.png"></image>
					<text>客服</text>
				</view>
			</view>
			<view class="bottombar-btn">
				<button>加入购物车</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						id: 1,
						avatar: "/static/one.png",
						nickname: "苦逼**员",
						date: "2021.12.27",
						star: 5,
						content: "入手很多，活动力度很大必须囤起来，苹果很脆，水分很足，甜度可口，没有酸感，大小很合适。",
						images: ["/static/one.png", "/static/one.png",
							"/static/one.png", "/static/one.png",
							"/static/one.png", "/static/one.png"
						]
					},
					{
						id: 2,
						avatar: "/static/one.png",
						nickname: "王**样",
						date: "2021.12.27",
						star: 1,
						content: "不甜，一般",
						images: ["/static/one.png"]
					},
					{
						id: 3,
						avatar: "/static/one.png",
						nickname: "飘**U",
						date: "2021.12.27",
						star: 4,
						content: "价格实惠，购买方便，品质非常好",
						images: []
					},
					{
						id: 4,
						avatar: "/static/one.png",
						nickname: "开着**猫",
						date: "2021.12.27",
						star: 4,
						content: "橙子很新鲜，鲜亮水嫩，包装无损坏",
						images: []
					}
				],
				// 收藏状态
				collectState: false,
				lastCollectAt: 0,
			}
		},
		methods: {
			// 点击放大图片
			viewImage(id) {
				let urls = [];
				let list = this.list;
				for (let i = 0; i < list.length; i++) {
					if (list[i]['id'] == id) {
						urls = list[i]['images'];
						break;
					}
				}

				uni.previewImage({
					urls: urls, //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
					current: '', // 当前显示图片的http链接，默认是第一个
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
			},
			// 收藏/取消收藏
			collect() {
				const now = Date.now();
				if (now - this.lastCollectAt < 2000) return;
				this.lastCollectAt = now;
				this.toCollect();
			},
			toCollect() {
				if (!this.collectState) {
					this.$utils.toastTip("收藏成功");
				} else {
					this.$utils.toastTip("已取消收藏");
				}
				this.collectState = !this.collectState;
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
	.goods {
		display: flex;
		align-items: center;
		background: #FFFFFF;
		padding: 10rpx 30rpx;

		.goods-image {
			image {
				width: 100rpx;
				height: 100rpx;
			}
		}

		.goods-name {
			margin-left: 10rpx;

			text {
				font-size: 26rpx;
				font-weight: 600;
				color: #333333;
			}
		}
	}

	.content {
		margin: 20rpx;
		padding-bottom: 120rpx;

		.comment {
			margin-top: 20rpx;

			.comment-avatar {
				image {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
				}
			}

			.comment-info {
				display: flex;
				background: #FFFFFF;
				padding: 30rpx 20rpx;
				border-radius: 20rpx;
				margin-bottom: 20rpx;

				.comment-right {
					width: 100%;
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

					.comment-image {
						display: flex;
						align-items: center;
						flex-wrap: wrap;

						.comment-image-item {
							margin-right: 20rpx;
							margin-top: 20rpx;
						}

						image {
							width: 112rpx;
							height: 112rpx;
						}
					}
				}

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
				width: 40rpx;
				height: 38rpx;
			}

			.bottombar-content-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 60rpx;
				min-width: 60rpx;

				text {
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

