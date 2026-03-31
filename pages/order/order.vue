<template>
	<view class="container">
		<view class="content">
			<view class="order" v-for="item in orderList" :key="item.id">
				<view>
					<view class="order-top">
						<text class="time">{{item.time}}</text>
						<view class="status-wrap">
							<text class="pay-status" :class="item.payStatusClass">{{item.payStatusText}}</text>
							<text :class="item.statusClass">{{item.status}}</text>
						</view>
					</view>
					<view class="shopname">{{item.shopname}}</view>
					<view class="orderno-row">
						<text class="orderno">订单号：{{item.orderNo || '-'}}</text>
						<text class="copy-btn" @click.stop="copyOrderNo(item.orderNo)">复制</text>
					</view>
					<view class="remark" v-if="item.remark">备注：{{item.remark}}</view>
					<view class="contact-row">
						<text class="contact-text">联系电话：{{item.phone || '暂无'}}</text>
						<text class="contact-text">师傅电话：{{item.workerPhone || '暂无'}}</text>
					</view>
					<view class="logistics" v-if="item.address">
						<view class="logistics-left">
							<image src="/static/one.png"></image>
							<view class="logistics-info">
								<text class="logistics-address">{{item.address}}</text>
							</view>
						</view>
						<view class="logistics-right">
							<image src="/static/one.png"></image>
						</view>
					</view>
					<view class="order-middle">
						<view class="image">
							<image src="/static/one.png"></image>
						</view>
						<view class="info">
							<text class="num">共{{item.num}}件</text>
							<text>合计:<text class="price">￥{{item.price}}</text></text>
						</view>
					</view>
					<view class="order-bottom">
						<view class="btns">
							<button class="cancel" @click.stop="removeOrder(item)">删除订单</button>
							<button class="cancel" v-if="item.status !== '已取消'" @click.stop="cancelOrder(item)">取消订单</button>
							<button class="pay" v-if="item.canPay" @click.stop="goPay(item)">去支付</button>
						</view>
					</view>
				</view>
			</view>

			<!-- 内容为空 -->
			<view class="empty" v-if="orderList.length == 0">
				<u-empty text="抱歉，没有订单数据" mode="order"></u-empty>
			</view>

			<view v-if="orderList.length > 0" class="load-more">{{ loadMoreText }}</view>

		</view>
	</view>
</template>

<script>
	import api from '../../utils/http.js'

	export default {
		data() {
			return {
				orderList: [],
				pageNo: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				finished: false
			};
		},
		onLoad() {
			this.fetchOrderList(true)
		},
		onPullDownRefresh() {
			this.fetchOrderList(true)
		},
		onReachBottom() {
			if (this.loading || this.finished) {
				return
			}
			this.fetchOrderList()
		},
		computed: {
			loadMoreText() {
				if (this.loading) {
					return '加载中...'
				}
				if (this.finished) {
					return '没有更多订单了'
				}
				return '上拉加载更多'
			}
		},
		methods: {
			async fetchOrderList(reset = false) {
				const token = uni.getStorageSync('Token') || ''
				if (!token) {
					uni.navigateTo({
						url: '/pages/login/index'
					})
					return
				}

				if (this.loading) {
					return
				}

				const current = reset ? 1 : this.pageNo
				this.loading = true

				try {
					const res = await api.createRequest({
						url: '/house/order/my',
						method: 'get',
						token
					}, {
						current,
						size: this.pageSize
					}, false)

					const pageData = res?.data || {}
					const records = Array.isArray(pageData.records) ? pageData.records : []
					const list = records.map(item => this.normalizeOrder(item))

					this.total = Number(pageData.total) || 0
					this.orderList = reset ? list : this.orderList.concat(list)
					this.pageNo = current + 1
					this.finished = this.orderList.length >= this.total || records.length < this.pageSize
				} catch (e) {
					if (!reset) {
						this.pageNo = Math.max(1, this.pageNo - 1)
					}
				} finally {
					this.loading = false
					uni.stopPullDownRefresh()
				}
			},
			normalizeOrder(item) {
				const status = this.formatStatus(item)
				const payStatusText = this.formatPayStatus(item)
				return {
					id: item.id,
					orderNo: item.orderNo || '',
					time: this.formatTime(item.createTime || item.serviceStartDate || ''),
					status,
					statusClass: this.statusClass(status),
					payStatusText,
					payStatusClass: this.payStatusClass(payStatusText),
					shopname: item.workerName || item.username || '上门服务订单',
					num: 1,
					price: this.formatAmount(item.payAmount || item.totalAmount || 0),
					phone: item.phone || item.workerPhone || '',
					workerPhone: item.workerPhone || '',
					address: item.fullAddress || '',
					remark: item.remark || '',
				canPay: Number(item.status) === 1 && Number(item.payStatus) === 0,
					raw: item
				}
			},
			formatTime(value) {
				if (!value) {
					return ''
				}

				if (typeof value === 'number') {
					const date = new Date(value)
					if (Number.isNaN(date.getTime())) {
						return ''
					}
					const pad = n => String(n).padStart(2, '0')
					return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
				}

				const normalized = String(value).replace('T', ' ').split('.')[0]
				return normalized.length >= 19 ? normalized.slice(0, 19) : normalized
			},
			formatPayStatus(item) {
				const payStatusMap = {
					0: '未支付',
					1: '已支付',
					2: '已退款',
					5: '已取消',
					6: '退款中'
				}
				return payStatusMap[Number(item.payStatus)] || '支付处理中'
			},
			formatStatus(item) {
				const status = Number(item.status)
				const statusMap = {
					1: '待付款',
					2: '待服务',
					3: '服务中',
					4: '已完成',
					5: '已取消',
					6: '退款中'
				}

				return statusMap[status] || '订单处理中'
			},
			statusClass(status) {
				if (status === '待付款') {
					return 'status-nopay'
				}
				if (status === '待评价' || status === '已完成') {
					return 'status-comment'
				}
				if (status === '已取消' || status === '退款中') {
					return 'status-cancel'
				}
				return 'status-pay'
			},
			payStatusClass(payStatusText) {
				if (payStatusText === '未支付') {
					return 'status-nopay'
				}
				if (payStatusText === '已退款' || payStatusText === '退款中' || payStatusText === '已取消') {
					return 'status-cancel'
				}
				return 'status-comment'
			},
			formatAmount(amount) {
				return Number(amount || 0).toFixed(2)
			},
			copyOrderNo(orderNo) {
				if (!orderNo) {
					uni.showToast({
						title: '订单号为空',
						icon: 'none'
					})
					return
				}
				uni.setClipboardData({
					data: String(orderNo),
					success: () => {
						uni.showToast({
							title: '订单号已复制',
							icon: 'none'
						})
					}
				})
			},
			removeOrder(item) {
				uni.showModal({
					title: '提示',
					content: '确定删除该订单吗？',
					success: async (res) => {
						if (!res.confirm) {
							return
						}
						const token = uni.getStorageSync('Token') || ''
						if (!token) {
							uni.navigateTo({
								url: '/pages/login/index'
							})
							return
						}
						try {
							await api.createRequest({
								url: `/house/order/remove/${item.id}`,
								method: 'delete',
								token
							}, {}, true)
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
							this.fetchOrderList(true)
						} catch (e) {}
					}
				})
			},
			async goPay(item) {
				const token = uni.getStorageSync('Token') || ''
				if (!token) {
					uni.navigateTo({
						url: '/pages/login/index'
					})
					return
				}

				if (!item.orderNo) {
					uni.showToast({
						title: '订单号缺失',
						icon: 'none'
					})
					return
				}

				uni.showLoading({ title: '支付中...' })
				let prepayRes
				try {
					prepayRes = await api.createRequest({
						url: `/house/pay/prepay/${item.orderNo}`,
						method: 'post',
						token
					}, {}, false)
				} catch (e) {
					uni.hideLoading()
					uni.showToast({ title: '获取支付信息失败', icon: 'none' })
					return
				}

				const payData = prepayRes?.data
				if (!payData || !payData.appId) {
					uni.hideLoading()
					uni.showToast({
						title: prepayRes?.msg || '获取支付信息失败',
						icon: 'none'
					})
					return
				}

				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: payData.timeStamp,
					nonceStr: payData.nonceStr,
					package: payData.packageVal,
					signType: payData.signType,
					paySign: payData.paySign,
					success: async () => {
						uni.hideLoading()
						uni.showToast({ title: '支付成功', icon: 'success' })
						this.fetchOrderList(true)
					},
					fail: (err) => {
						uni.hideLoading()
						const msg = (err && err.errMsg) || ''
						if (msg.includes('cancel')) {
							uni.showToast({ title: '已取消支付', icon: 'none' })
						} else {
							uni.showToast({ title: '支付失败，请重试', icon: 'none' })
						}
					}
				})
			},
			
			async cancelOrder(item) {
				uni.showModal({
					title: '提示',
					content: '确定要取消该订单吗？',
					success: async (res) => {
						if (!res.confirm) {
							return
						}
						const token = uni.getStorageSync('Token') || ''
						if (!token) {
							uni.navigateTo({
								url: '/pages/login/index'
							})
							return
						}
						try {
							await api.createRequest({
								url: `/house/order/cancel/${item.id}`,
								method: 'post',
								token
							}, {}, true)
							uni.showToast({
								title: '订单已取消',
								icon: 'success'
							})
							// 更新列表中的订单状态为已取消
							const orderIndex = this.orderList.findIndex(o => o.id === item.id)
							if (orderIndex >= 0) {
								this.orderList[orderIndex].status = '已取消'
								this.orderList[orderIndex].statusClass = this.statusClass('已取消')
								this.orderList[orderIndex].canPay = false
							}
						} catch (e) {
							uni.showToast({
								title: '取消订单失败，请重试',
								icon: 'none'
							})
						}
					}
				})
			},
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
		margin: 0;
		display: flex;
		flex-direction: column;
	}

	.content {
		padding: 30rpx;
	}

	.order {
		border-radius: 20rpx;
		background: #FFFFFF;
		padding: 24rpx 30rpx 30rpx 30rpx;
		margin-bottom: 22rpx;

		.order-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #ECECEC;
			padding-bottom: 22rpx;

			.time {
				font-size: 26rpx;
				color: #999999;
			}

			.status-nopay {
				font-size: 26rpx;
				color: #F55726;
			}

			.status-pay {
				font-size: 26rpx;
				color: #26ACF5;
			}

			.status-comment {
				font-size: 26rpx;
				color: #40AE36;
			}

			.status-cancel {
				font-size: 26rpx;
				color: #999999;
			}

			.status-wrap {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				line-height: 34rpx;
			}

			.pay-status {
				font-size: 22rpx;
			}
		}

		.shopname {
			font-size: 26rpx;
			color: #333333;
			margin: 20rpx 0rpx;
		}

		.orderno-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 12rpx;

			.orderno {
				font-size: 22rpx;
				color: #666666;
			}

			.copy-btn {
				font-size: 22rpx;
				color: #26ACF5;
				padding: 2rpx 10rpx;
				border: 1rpx solid #26ACF5;
				border-radius: 20rpx;
			}
		}

		.remark {
			font-size: 22rpx;
			color: #666666;
			line-height: 34rpx;
			margin-bottom: 12rpx;
		}

		.contact-row {
			display: flex;
			flex-direction: column;
			gap: 4rpx;
			margin-bottom: 12rpx;

			.contact-text {
				font-size: 22rpx;
				color: #666666;
			}
		}

		.logistics {
			border-radius: 20rpx;
			background: #F8F9FA;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 20rpx 0rpx;
			padding: 20rpx;

			.logistics-left {
				display: flex;
				align-items: center;

				image {
					width: 48rpx;
					height: 48rpx;
				}

				.logistics-info {
					display: flex;
					flex-direction: column;
					margin-left: 20rpx;
					line-height: 40rpx;

					.logistics-address {
						font-size: 24rpx;
						color: #333333;
					}

					.logistics-time {
						font-size: 22rpx;
						color: #999393;
					}
				}
			}

			.logistics-right {
				image {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}

		.order-middle {
			display: flex;
			align-items: flex-end;
			justify-content: space-between;

			.info {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				font-size: 22rpx;
				color: #333333;

				.num {
					font-size: 22rpx;
					color: #999999;
					margin-bottom: 6rpx;
				}

				.price {
					font-size: 32rpx;
					font-weight: 600;
					color: #333333;
				}
			}

			image {
				width: 130rpx;
				height: 130rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}
		}

		.order-bottom {
			margin-top: 30rpx;

			.btns {
				display: flex;
				justify-content: flex-end;

				button {
					border-radius: 24rpx;
					background-color: #FFFFFF;
					margin: 0;
				}

				button::after {
					border: none;
				}

				.cancel {
					font-size: 24rpx;
					color: #333333;
					border: 1rpx solid #999999;
					margin-right: 20rpx;
				}

				.pay {
					font-size: 24rpx;
					color: #40AE36;
					border: 1rpx solid #40AE36;
				}
			}

		}
	}

	.empty {
		margin-top: 200rpx;
	}

	.load-more {
		text-align: center;
		font-size: 24rpx;
		color: #999999;
		padding: 10rpx 0 30rpx;
	}
</style>

