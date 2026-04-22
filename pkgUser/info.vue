<template>
	<view class="container">
		<view class="userinfo">
			<view class="item">
				<view class="item-left">
					<text>头像</text>
				</view>
				<view class="item-right">
					<image class="avatar" :src="displayAvatar"></image>
					<image class="righticon" src="/static/one.png"></image>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<text>昵称</text>
				</view>
				<view class="item-right">
					<text>{{ displayName }}</text>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<text>ID</text>
				</view>
				<view class="item-right">
					<text>{{ displayId }}</text>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<text>手机号</text>
				</view>
				<view class="item-right">
					<text>{{ displayPhone }}</text>
				</view>
			</view>
		</view>
		<view class="address">

		</view>
	</view>
</template>

<script>
	import api from '../utils/http.js'

	export default {
		data() {
			return {
				userInfo: {
					id: '',
					username: '微信用户',
					phone: '',
					avatar: ''
				}
			}
		},
		onShow() {
			this.fetchUserInfo();
		},
		computed: {
			displayAvatar() {
				if (!this.userInfo.avatar) return '/static/one.png';
				if (this.userInfo.avatar.indexOf('http') === 0) return this.userInfo.avatar;
				return `${api.baseUrl}${this.userInfo.avatar}`;
			},
			displayName() {
				return this.userInfo.username || '微信用户';
			},
			displayId() {
				return this.userInfo.id || '--';
			},
			displayPhone() {
				return this.userInfo.phone || '未绑定手机号';
			}
		},
		methods: {
			async fetchUserInfo() {
				try {
					const res = await api.httpTokenRequest('/house/user/wx/me', {}, 'get');
					this.userInfo = {
						...this.userInfo,
						...(res?.data || {})
					};
				} catch (e) {
					uni.showToast({
						title: '获取个人信息失败',
						icon: 'none'
					});
				}
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
	.userinfo {
		border-radius: 20rpx;
		background: #FFFFFF;
		margin-top: 20rpx;
		margin: 20rpx 30rpx 30rpx 30rpx;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #ECECEC;
			padding: 0rpx 30rpx;

			.item-left {
				padding: 30rpx 0rpx;
				text {
					font-size: 30rpx;
					color: #333333;
				}
			}

			.item-right {
				display: flex;
				align-items: center;

				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}

				.righticon {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
	}
</style>
