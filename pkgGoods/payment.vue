<template>
	<view class="page">
		<view class="card countdown-card">
			<text class="countdown-label">请在 15 分钟内完成支付</text>
			<text class="countdown-value">{{ countdownText }}</text>
		</view>

		<view class="card goods-card">
			<view class="goods-main">
				<image class="goods-image" :src="posterImageUrl" mode="aspectFill"></image>
				<view class="goods-info">
					<text class="goods-name">{{ paymentInfo.name || '服务项目' }}</text>
					<text class="goods-spec">规格：{{ paymentInfo.specName || '默认规格' }}</text>
					<text class="goods-spec">人数：{{ paymentInfo.quantity || 1 }}</text>
					<text class="goods-spec">上门时间：{{ paymentInfo.serviceTime || '-' }}</text>
				</view>
			</view>
			<view class="summary-row">
				<text class="summary-label">服务地址</text>
				<text class="summary-value">{{ paymentInfo.addressText || '-' }}</text>
			</view>
			<view class="summary-row">
				<text class="summary-label">应付金额</text>
				<text class="amount-value">￥{{ paymentInfo.totalAmount || 0 }}</text>
			</view>
		</view>

		<view class="bottom-bar">
			<view class="bottom-left">
				<text class="bottom-tip">待支付</text>
				<text class="bottom-price">￥{{ paymentInfo.totalAmount || 0 }}</text>
			</view>
			<button class="pay-btn" :disabled="expired || paying" @click="handlePay">
				{{ expired ? '支付已超时' : (paying ? '支付中...' : '立即支付') }}
			</button>
		</view>
	</view>
</template>

<script>
import api from '../utils/http.js'
import utils from '../utils/utils.js'

export default {
	data() {
		return {
			paying: false,
			expired: false,
			remainingSeconds: 15 * 60,
			timerId: null,
			orderPayload: null,
			paymentInfo: {},
			createdOrder: null
		}
	},
	computed: {
		countdownText() {
			const minutes = String(Math.floor(this.remainingSeconds / 60)).padStart(2, '0')
			const seconds = String(this.remainingSeconds % 60).padStart(2, '0')
			return `${minutes}:${seconds}`
		},
		posterImageUrl() {
			return utils.resolveImageUrl(this.paymentInfo.posterImage, '/static/banner.png')
		}
	},
	onLoad() {
		const cache = uni.getStorageSync('reserve_payment_payload') || {}
		this.orderPayload = cache.orderPayload || null
		this.paymentInfo = cache.goodsInfo || {}
		if (!this.orderPayload) {
			uni.showToast({
				title: '下单信息缺失，请重新提交',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateBack({ delta: 1 })
			}, 800)
			return
		}
		this.startCountdown()
	},
	onUnload() {
		this.clearCountdown()
	},
	methods: {
		startCountdown() {
			this.clearCountdown()
			this.timerId = setInterval(() => {
				if (this.remainingSeconds <= 1) {
					this.remainingSeconds = 0
					this.expired = true
					this.clearCountdown()
					return
				}
				this.remainingSeconds -= 1
			}, 1000)
		},
		clearCountdown() {
			if (!this.timerId) return
			clearInterval(this.timerId)
			this.timerId = null
		},
		async createOrder() {
			if (this.createdOrder && this.createdOrder.orderNo) {
				return this.createdOrder
			}

			const token = uni.getStorageSync('Token') || ''
			if (!token) {
				uni.navigateTo({
					url: '/pages/login/index'
				})
				throw new Error('请先登录')
			}

			const res = await api.createRequest({
				url: '/house/order/create',
				method: 'post',
				token
			}, this.orderPayload)

			const orderData = res?.data
			if (!orderData || !orderData.orderNo) {
				throw new Error(res?.msg || '创建订单失败')
			}

			this.createdOrder = orderData
			return orderData
		},
		async handlePay() {
			if (this.expired || this.paying) return
			this.paying = true

			try {
				const token = uni.getStorageSync('Token') || ''
				const orderData = await this.createOrder()
				const prepayRes = await api.createRequest({
					url: `/house/pay/prepay/${orderData.orderNo}`,
					method: 'post',
					token
				}, {}, false)

				const payData = prepayRes?.data
				if (!payData || !payData.appId) {
					throw new Error(prepayRes?.msg || '获取支付信息失败')
				}

				await new Promise((resolve, reject) => {
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: payData.timeStamp,
						nonceStr: payData.nonceStr,
						package: payData.packageVal,
						signType: payData.signType,
						paySign: payData.paySign,
						success: resolve,
						fail: reject
					})
				})

				uni.removeStorageSync('reserve_payment_payload')
				uni.showToast({
					title: '支付成功',
					icon: 'success'
				})
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/order/order'
					})
				}, 1000)
			} catch (e) {
				const msg = e?.errMsg || e?.message || ''
				if (msg.includes('cancel')) {
					uni.showToast({
						title: '已取消支付',
						icon: 'none'
					})
				} else {
					uni.showToast({
						title: e?.message || '支付失败，请重试',
						icon: 'none'
					})
				}
			} finally {
				this.paying = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #f8f9fa;
	padding: 24rpx 24rpx 180rpx;
	box-sizing: border-box;
}

.card {
	background: #fff;
	border-radius: 20rpx;
	padding: 28rpx 24rpx;
	margin-bottom: 20rpx;
}

.countdown-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: linear-gradient(135deg, #fff4de 0%, #ffe0b0 100%);
}

.countdown-label {
	font-size: 28rpx;
	color: #7a5200;
	font-weight: 600;
}

.countdown-value {
	font-size: 42rpx;
	font-weight: 700;
	color: #d96c07;
}

.goods-main {
	display: flex;
	gap: 20rpx;
	margin-bottom: 24rpx;
}

.goods-image {
	width: 180rpx;
	height: 180rpx;
	border-radius: 16rpx;
	background: #f2f2f2;
	flex-shrink: 0;
}

.goods-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.goods-name {
	font-size: 30rpx;
	font-weight: 700;
	color: #222;
	line-height: 1.4;
}

.goods-spec {
	font-size: 24rpx;
	color: #666;
	line-height: 1.5;
}

.summary-row {
	display: flex;
	justify-content: space-between;
	gap: 20rpx;
	padding-top: 18rpx;
	border-top: 1rpx solid #f2f2f2;
	margin-top: 18rpx;
}

.summary-label {
	font-size: 26rpx;
	color: #666;
	flex-shrink: 0;
}

.summary-value {
	font-size: 26rpx;
	color: #222;
	text-align: right;
	line-height: 1.5;
}

.amount-value {
	font-size: 36rpx;
	font-weight: 700;
	color: #f23f3f;
}

.bottom-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom));
	background: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.06);
	box-sizing: border-box;
}

.bottom-left {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.bottom-tip {
	font-size: 24rpx;
	color: #666;
}

.bottom-price {
	font-size: 38rpx;
	font-weight: 700;
	color: #f23f3f;
}

.pay-btn {
	min-width: 260rpx;
	height: 84rpx;
	line-height: 84rpx;
	border-radius: 999rpx;
	background: #40ae36;
	color: #fff;
	font-size: 30rpx;
	padding: 0 28rpx;
}

.pay-btn[disabled] {
	background: #bdbdbd;
	color: #fff;
}
</style>