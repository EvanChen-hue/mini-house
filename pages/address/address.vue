<template>
	<view class="container">
		<view class="address" v-for="item in list" :key="item.id">
			<view class="address-info" >
				<view class="address-info-top">
					<text class="tag" v-if="item.tag">{{item.tag}}</text>
					<text class="name">{{item.name}}</text>
					<text class="phone">{{item.phone}}</text>
				</view>
				<view class="address-info-bottom">
					{{item.address}}
				</view>
			</view>
			<view class="address-actions">
				<text class="action-default" v-if="!item.isDefault" @click.stop="setDefaultAddress(item)">设为默认</text>
				<text class="action-default active" v-else>默认地址</text>
				<text class="action-edit" @click.stop="edit(item)">编辑</text>
				<text class="action-delete" @click.stop="deleteAddress(item)">删除</text>
			</view>
		</view>
		<view class="btn">
			<button @click="add()">添加新地址</button>
		</view>
	</view>
</template>

<script>
	import api from '../../utils/http.js'

	export default {
		data() {
			return {
				list: []
			}
		},
		onShow() {
			this.fetchAddressList();
		},
		methods: {
			async fetchAddressList() {
				const token = uni.getStorageSync('Token') || '';
				if (!token) {
					this.list = [];
					return;
				}

				try {
					const res = await api.createRequest({
						url: '/house/address/my',
						method: 'get',
						token
					}, {});

					const sourceList = Array.isArray(res?.data) ? res.data : [];
					this.list = sourceList.map((item, idx) => {
						const fullAddress = [item.province, item.city, item.district, item.detailAddress]
							.filter(Boolean)
							.join('');
						return {
							id: item.id || idx + 1,
							name: item.consignee || item.name || '',
							phone: item.phone || '',
							address: fullAddress || item.address || '',
							province: item.province || '四川省',
							city: item.city || '南充市',
							district: item.district || '',
							detailAddress: item.detailAddress || '',
							isDefault: Number(item.isDefault) === 1 ? 1 : 0,
							createTime: item.createTime || '',
							tag: Number(item.isDefault) === 1 ? '默认' : ''
						};
					});
				} catch (error) {
					console.error('获取地址列表失败：', error);
					this.$utils.toastTip('获取地址列表失败');
					this.list = [];
				}
			},
			add() {
				uni.navigateTo({
					url: "/pages/address/add"
				})
			},
			edit(item) {
				const query = [
					`id=${item.id}`,
					`consignee=${encodeURIComponent(item.name || '')}`,
					`phone=${encodeURIComponent(item.phone || '')}`,
					`province=${encodeURIComponent(item.province || '四川省')}`,
					`city=${encodeURIComponent(item.city || '南充市')}`,
					`district=${encodeURIComponent(item.district || '')}`,
					`detailAddress=${encodeURIComponent(item.detailAddress || '')}`,
					`isDefault=${item.isDefault || 0}`,
					`createTime=${encodeURIComponent(item.createTime || '')}`
				].join('&');

				uni.navigateTo({
					url: `/pages/address/add?${query}`
				});
			},
			async setDefaultAddress(item) {
				console.log(item);
				
				const token = uni.getStorageSync('Token') || '';
				if (!token) {
					uni.navigateTo({
						url: '/pages/login/index'
					});
					return;
				}

				try {
					const result = await api.createRequest({
						url: '/house/address/update',
						method: 'put',
						token
					}, {
						id: item.id,
						isDefault: 1,
						consignee: item.name,
						phone: item.phone,
						province: '四川省',
						city: '南充市',
						district: item.district,
						detailAddress: item.detailAddress,
					});

					if (Number(result?.code) === 200) {
						uni.showToast({
							title: result.msg || '设置默认地址成功',
							icon: 'success'
						});
						this.fetchAddressList();
					}
				} catch (error) {
					console.error('设置默认地址失败：', error);
				}
			},
			deleteAddress(item) {
				uni.showModal({
					title: '提示',
					content: '确定删除该地址吗？',
					success: async (res) => {
						if (!res.confirm) return;

						const token = uni.getStorageSync('Token') || '';
						if (!token) {
							uni.navigateTo({
								url: '/pages/login/index'
							});
							return;
						}

						try {
							const result = await api.createRequest({
								url: `/house/address/delete/${item.id}`,
								method: 'delete',
								token
							}, {});

							if (Number(result?.code) === 200) {
								uni.showToast({
									title: result.msg || '删除成功',
									icon: 'success'
								});
								this.fetchAddressList();
							}
						} catch (error) {
							console.error('删除地址失败：', error);
						}
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
	.container {
		margin: 20rpx 30rpx;
	}

	.address {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 32rpx 20rpx;
		margin-bottom: 22rpx;

		.address-info {
			display: flex;
			flex-direction: column;
			padding: 0rpx 40rpx 0rpx 20rpx;

			.address-info-top {
				font-size: 30rpx;
				font-weight: 600;
				color: #333333;

				.tag {
					background: #D5EBD3;
					border-radius: 10rpx;
					font-size: 16rpx;
					color: #40AE36;
					padding: 4rpx 8rpx;
					margin-right: 16rpx;
				}

				.name {
					margin-right: 16rpx;
				}
			}

			.address-info-bottom {
				font-size: 26rpx;
				color: #999999;
				margin-top: 10rpx;
			}
		}

		.address-actions {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			gap: 20rpx;

			text {
				font-size: 24rpx;
				line-height: 1;
			}

			.action-edit {
				color: #40AE36;
			}

			.action-default {
				color: #2B7AF8;
			}

			.action-default.active {
				color: #40AE36;
			}

			.action-delete {
				color: #FA5151;
			}
		}
	}

	.btn {
		margin-top: 70rpx;
		width: 100%;

		button {
			flex: 1;
			border-radius: 46rpx;
			background: #40AE36;
			color: #FFFFFF;
			font-size: 30rpx;
			padding: 12rpx 0rpx;
		}
	}
</style>
