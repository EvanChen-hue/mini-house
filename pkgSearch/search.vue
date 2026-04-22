 <template>
 	<view class="container">
 		<view class="header">
 			<view class="search-box">
 				<image src="/static/one.png"></image>
 				<view class="search-input">
 					<input type="text" placeholder="吃出美好生活" v-model="searchStr" />
 				</view>
 			</view>
 			<view class="search-txt" v-show="goods.length == 0" @click="search()">搜索</view>
 			<view class="cancel-txt" v-show="goods.length > 0" @click="cancel()">取消</view>
 		</view>
 		<view class="content" v-if="goods.length == 0">
 			<view class="history" v-if="historyData.length > 0">
 				<view class="history-top">
 					<text>历史搜索</text>
 					<image src="/static/one.png" @click="del()"></image>
 				</view>
 				<view class="history-bottom">
 					<view class="history-item" v-for="(item, index) in historyData" :key="index">
 						<text @click="copy(item)">{{item}}</text>
 					</view>
 				</view>
 			</view>
 			<view class="hot">
 				<view class="hot-top">
 					<text>实时热搜</text>
 				</view>
 				<view class="hot-bottom">
 					<view class="hot-item" v-for="(item, index) in hotData" :key="index">
 						<text @click="copy(item.name)">{{item.id}} {{item.name}}</text>
 					</view>
 				</view>
 			</view>
 		</view>
 		<view class="content" v-if="goods.length > 0">
 			<view class="goods">
 				<view class="goods-item" v-for="(item, index) in goods" :key="item.id">
 					<view class="image-section">
 						<image :src="item.image"></image>
 					</view>
 					<view class="text-section">
 						<view class="goods-title">
 							{{item.name}}
 						</view>
 						<view class="goods-tag">
 							<text v-for="(i, index) in item.service" :key="index">
 								{{i}}
 							</text>
 						</view>
 						<view class="goods-price">
 							<text class="goods-price-txt">￥{{item.price}}
 								<text class="goods-price-unit">/{{item.unit}}</text>
 								<text class="goods-old-price">￥{{item.old_price}}</text>
 							</text>

 							<image class="goods-shopcar-icon" src="/static/one.png"></image>
 						</view>
 					</view>
 				</view>
 			</view>
 		</view>
 	</view>
 </template>

 <script>
 	export default {
 		data() {
 			return {
 				searchStr: '',
 				historyData: ['果冻橙', '芒果', '有机水果卷心菜', '水果萝卜', '熟冻帝王蟹', '赣南脐橙'],
 				hotData: [{
 						id: 1,
 						name: '车厘子'
 					},
 					{
 						id: 2,
 						name: '草莓'
 					},
 					{
 						id: 3,
 						name: '火锅到家'
 					},
 					{
 						id: 4,
 						name: '精选红酒'
 					},
 					{
 						id: 5,
 						name: '馋嘴零食暖热饮'
 					},
 					{
 						id: 6,
 						name: '精美平安果'
 					},
 					{
 						id: 7,
 						name: '高颜值好口味'
 					},
 					{
 						id: 8,
 						name: '生菜'
 					},
 					{
 						id: 9,
 						name: '新鲜大虾仁'
 					},
 					{
 						id: 10,
 						name: '冬季小食'
 					}
 				],
 				goods: [],
 				goodsData: [{
 						id: 1,
 						name: "四川爱媛38号可吸果冻橙",
 						image: "/static/one.png",
 						price: 19.8,
 						old_price: 19.9,
 						unit: "份",
 						service: ["特价", "24H发货"]
 					},
 					{
 						id: 2,
 						name: "四川眉山 爱媛38号可吸果冻橙礼盒装12",
 						image: "/static/one.png",
 						price: 19.8,
 						old_price: 19.9,
 						unit: "份",
 						service: ["特价", "24H发货"]
 					},
 					{
 						id: 3,
 						name: "四川眉山爱媛38号果冻橙",
 						image: "/static/one.png",
 						price: 19.8,
 						old_price: 19.9,
 						unit: "份",
 						service: ["特价", "7天保价"]
 					},
 					{
 						id: 4,
 						name: "江苏无锡 爱媛38号果冻橙",
 						image: "/static/one.png",
 						price: 19.8,
 						old_price: 19.9,
 						unit: "份",
 						service: ["特价", "24H发货"]
 					},
 					{
 						id: 5,
 						name: "浙江象山 爱媛红美人礼盒",
 						image: "/static/one.png",
 						price: 19.8,
						old_price: 19.9,
 						unit: "份",
 						service: ["特价", "24H发货"]
 					}
 				],
 			};
 		},
 		methods: {
 			// 返回首页
 			back() {
<<<<<<< HEAD
				const pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack({
						delta: 1
					});
					return;
				}
				uni.switchTab({
					url: '/pages/index/index'
				});
=======
 				uni.navigateBack();
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
 			},
 			// 复制文字
 			copy(value) {
 				this.searchStr = value;
 			},
 			// 删除历史搜索
 			del() {
 				let that = this;
				this.$utils.showConfirm("确定要删除历史搜索吗？").then(res => {
					if (res.confirm) {
						that.historyData = [];
					}
				});
 			},
 			// 搜索商品
 			search() {
 				this.goods = this.goodsData;
 			},
 			cancel() {
 				this.goods = [];
 			}
 		}
 	}
 </script>

 <style lang="scss" scoped>
 	.content {
 		padding: 30rpx;
 	}

 	.header {
 		display: flex;
 		align-items: center;
 		justify-content: space-between;
 		padding: 30rpx 30rpx;
 		background: #F8F9FA;

 		.search-box {
 			width: 90%;
 			background: #FFFFFF;
 			border-radius: 40rpx;
 			display: flex;
 			align-items: center;
 			padding: 14rpx 40rpx;

 			.search-input {
 				margin-left: 20rpx;

 				input {
 					color: #999999;
 					font-size: 28rpx;
 				}
 			}

 			image {
 				width: 32rpx;
 				height: 32rpx;
 			}
 		}

 		.search-txt {
 			min-width: 60rpx;
 			font-size: 28rpx;
 			color: #666666;
 		}

 		.cancel-txt {
 			min-width: 60rpx;
 			font-size: 28rpx;
 			color: #666666;
 		}
 	}

 	.history {
 		margin-bottom: 70rpx;

 		.history-top {
 			display: flex;
 			align-items: center;
 			justify-content: space-between;

 			text {
 				font-size: 30rpx;
 				font-weight: 600;
 				color: #333333;
 			}

 			image {
 				width: 26rpx;
 				height: 30rpx;
 			}
 		}

 		.history-bottom {
 			display: flex;
 			flex-wrap: wrap;
 			margin-top: 20rpx;

 			.history-item {
 				border-radius: 28rpx;
 				background: #F8F9FA;
 				padding: 12rpx 28rpx;
 				margin-right: 20rpx;
 				margin-top: 24rpx;
 				line-height: 22rpx;

 				text {
 					font-size: 22rpx;
 					color: #666666;
 				}
 			}
 		}
 	}

 	.hot {
 		.hot-top {

 			text {
 				font-size: 30rpx;
 				font-weight: 600;
 				color: #333333;
 			}
 		}

 		.hot-bottom {
 			display: flex;
 			flex-wrap: wrap;
 			margin-top: 20rpx;

 			.hot-item {
 				border-radius: 28rpx;
 				background: #F8F9FA;
 				padding: 10rpx 28rpx;
 				margin-right: 20rpx;
 				margin-top: 24rpx;

 				text {
 					font-size: 22rpx;
 					color: #666666;
 				}
 			}
 		}
 	}

 	.goods {
 		display: flex;
 		flex-direction: column;

 		.goods-item {
 			display: flex;
 			align-items: center;
 			margin-bottom: 10rpx;
 		}

 		.image-section {
 			flex: 1;

 			image {
 				max-width: 240rpx;
 				max-height: 240rpx;
 				border-radius: 8rpx;
 			}
 		}

 		.text-section {
 			flex: 2;
 			border-bottom: 1rpx solid #EBEBEB;
 			padding-bottom: 30rpx;
 			margin-left: 30rpx;
 			width: 100%;

 			.goods-title {
 				font-size: 26rpx;
 				font-weight: 700;
 				line-height: 34rpx;
 				color: #333333;
 				margin-top: 10rpx;
 			}

 			.goods-tag {
 				display: flex;
 				align-items: center;
 				margin-top: 30rpx;
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
 						margin-left: 6rpx;
 					}

 					.goods-old-price {
 						font-size: 22rpx;
 						color: #CCCCCC;
 						text-decoration: line-through;
 						margin-left: 10rpx;
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
 </style>
