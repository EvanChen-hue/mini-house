<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="user">
			<view class="user-top">
				<view class="user-top-left" @click="handleProfileClick()">
					<image :src="displayAvatar"></image>
					<view class="user-info">
						<text class="nickname">{{ displayName }}</text>
						<text class="phone">{{ displayPhone }}</text>
					</view>
				</view>
				<view class="user-top-right">
					<image @click="toSetting()" src="/static/one.png"></image>
					<image class="kefu-icon" src="/static/one.png"></image>
				</view>
			</view>
			<!-- <view class="user-bottom">
				<view class="user-bottom-item" @click="goBalance()">
					<text class="user-bottom-num">100</text>
					<text class="user-bottom-txt">余额(元)</text>
				</view>
				<view class="user-bottom-item">
					<text class="user-bottom-num">10</text>
					<text class="user-bottom-txt">优惠券</text>
				</view>
				<view class="user-bottom-item">
					<text class="user-bottom-num">5</text>
					<text class="user-bottom-txt">电子券</text>
				</view>
				<view class="user-bottom-item" @click="goScore()">
					<text class="user-bottom-num">999</text>
					<text class="user-bottom-txt">积分</text>
				</view>
			</view> -->

		</view>
		<view class="content">
			<!-- 订单 -->
			<view class="order">
				<view class="order-top">
					<text class="order-top-txt">我的订单</text>
					<view class="order-top-all" @click="toOrder()">
						<text>全部订单</text>
					</view>
				</view>
				<view class="order-bottom" @click="toOrder()">
					<view class="order-bottom-item">
						<image src="/static/dingdan.png"></image>
						<text>我的订单</text>
					</view>
				</view>
			</view>

			<!-- 我的服务 -->
			<view class="service">
				<view class="service-top">
					<text class="service-top-txt">我的服务</text>
				</view>
				<view class="service-bottom">
					<view class="service-bottom-item" @click="toAddress()">
						<text>我的地址</text>
					</view>
					<view class="service-bottom-item" @click="call">
						<text>在线客服</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../utils/http.js'

	export default {
		data() {
			return {
				userInfo: {
					id: '',
					username: '微信用户',
					phone: '',
					avatar: ''
				},
				list: []
			};
		},
		onShow() {
			// this.ensureLogin();
			this.fetchUserInfo();
		},
		computed: {
			displayAvatar() {
				if (!this.userInfo.avatar) return '/static/user.png';
				if (this.userInfo.avatar.indexOf('http') === 0) return this.userInfo.avatar;
				return `${api.baseUrl}${this.userInfo.avatar}`;
			},
			displayName() {
				return this.userInfo.username || '微信用户';
			},
			displayPhone() {
				return this.userInfo.phone || '未绑定手机号';
			}
		},
		methods: {
			call() {
				uni.makePhoneCall({ phoneNumber: '0817-6125226' })
			},
			hasToken() {
				return !!(uni.getStorageSync('Token') || '')
			},
			ensureLogin() {
				if (this.hasToken()) return true;
				uni.navigateTo({
					url: '/pages/login/index'
				});
				return false;
			},
			async fetchUserInfo() {
				const cache = uni.getStorageSync('userInfo') || {};
				this.userInfo = {
					...this.userInfo,
					...cache
				};

				const token = uni.getStorageSync('Token') || '';
				if (!token) return;

				try {
					const res = await api.httpTokenRequest('/house/user/wx/me', {}, 'get');
					this.userInfo = res?.data || {};
					uni.setStorageSync('userInfo', this.userInfo);	
				} catch (e) {
					uni.showToast({
						title: '获取个人信息失败',
						icon: 'none'
					});
				}
			},
			// 跳转我的订单页面
			toOrder() {
				uni.navigateTo({
					url: '/pages/order/order'
				})
			},
			// 跳转地址页面
			toAddress() {
				uni.navigateTo({
					url: '/pages/address/address'
				})
			},
			// 跳转收藏页面
			toCollect() {
				uni.navigateTo({
					url: '/pkgUser/collect'
				})
			},
			handleProfileClick() {
				if (!this.hasToken()) {
					uni.navigateTo({
						url: '/pages/login/index'
					})
					return
				}
				uni.navigateTo({
					url: '/pkgUser/update'
				})
			},
			toSetting() {
				if (!this.ensureLogin()) return
				uni.navigateTo({
					url: '/pages/setting/setting'
				})
			},
		}
	}
</script>

<style>
	page {
			background: linear-gradient(180deg, #fff2d4 0%, #ffffff 72%);
	}
</style>

<style lang="scss" scoped>
	.content {
		padding: 30rpx;
	}

	.user {
		border-bottom-left-radius: 60% 15%;
		border-bottom-right-radius: 60% 15%;
		background: linear-gradient(180deg, #fff2d4 0%, #ffdca1 100%);
		opacity: 1;
		margin-bottom: 200rpx;
	}

	.user-top {
		padding: 30rpx;
		display: flex;
		justify-content: space-between;

		.user-top-left {
			display: flex;
			align-items: center;

			image {
				width: 110rpx;
				height: 110rpx;
				border-radius: 50%;
			}

			.user-info {
				display: flex;
				flex-direction: column;
				margin-left: 30rpx;

				.nickname {
					font-size: 32rpx;
					color: #FFFFFF;
				}

				.phone {
					font-size: 24rpx;
					color: #FFFFFF;
					margin-top: 6rpx;
					opacity: 0.8;
				}
			}
		}

		.user-top-right {
			image {
				width: 48rpx;
				height: 48rpx;
			}

			.kefu-icon {
				margin-left: 20rpx;
			}
		}
	}

	.user-bottom {
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding-bottom: 160rpx;

		.user-bottom-item {
			display: flex;
			flex-direction: column;
			text-align: center;

			.user-bottom-num {
				font-size: 36rpx;
				color: #FFFFFF;
			}

			.user-bottom-txt {
				font-size: 24rpx;
				color: #FFFFFF;
				opacity: 0.8;
			}

		}
	}

	.order {
		border-radius: 20rpx;
		background: #FFFFFF;
		margin-top: -160rpx;

		.order-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx;

			.order-top-txt {
				font-size: 28rpx;
				font-weight: 600;
				color: #333333;
			}

			.order-top-all {
				display: flex;
				align-items: center;

				text {
					font-size: 24rpx;
					color: #666666;
				}

				image {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}

		.order-bottom {
			display: flex;
			align-items: center;
			padding-top: 20rpx;
			padding-bottom: 30rpx;
			padding:  30rpx;

			.order-bottom-item {
				display: flex;
				flex-direction: column;
				align-items: center;

				image {
					width: 52rpx;
					height: 52rpx;
				}

				text {
					font-size: 22rpx;
					color: #666666;
					margin-top: 20rpx;
				}
			}
		}
	}

	.service {
		border-radius: 20rpx;
		background: #FFFFFF;
		margin-top: 20rpx;

		.service-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 30rpx 20rpx 30rpx;

			.service-top-txt {
				font-size: 28rpx;
				font-weight: 600;
				color: #333333;
			}

			.service-top-all {
				display: flex;
				align-items: center;

				text {
					font-size: 24rpx;
					color: #666666;
				}

				image {
					width: 70rpx;
					height: 70rpx;
				}
			}
		}

		.service-bottom {
			display: flex;
			justify-content: space-around;
			padding-top: 20rpx;
			padding-bottom: 30rpx;
			flex-direction: column;

			.service-bottom-item {
				display: flex;
				flex-direction: column;
				padding: 20rpx;

				text {
					font-size: 28rpx;
					color: #666666;
					margin-top: 20rpx;
				}
			}
		}
	}

	.recommend {
		margin-top: 50rpx;

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

			.goods {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				border-radius: 20rpx;
				background: #FFFFFF;
				padding: 0rpx 30rpx 30rpx 30rpx;
				margin-top: 30rpx;
			}

			.goods-image {
				width: 280rpx;
				height: 280rpx;
				border-radius: 4px;
			}

			.goods-name {
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
</style>


