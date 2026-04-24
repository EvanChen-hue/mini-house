<template>
	<view class="page">
		<view class="card">
			<view class="title">预约信息</view>
			<view class="row">
				<text class="label">服务项目</text>
				<text class="value">{{ serviceName || '上门服务' }}</text>
			</view>
			<view class="row">
				<text class="label">服务规格</text>
				<text class="value">{{ selectedSpecName || '默认规格' }}</text>
			</view>
			<view class="row">
				<text class="label">服务人数</text>
				<text class="value">{{ quantity }}</text>
			</view>
			<view class="row">
				<text class="label">服务地址</text>
				<view v-if="addressList.length === 0" class="picker-input">
					<text class="add-address-btn" @click="goAddAddress">暂无地址，点击去添加 ›</text>
				</view>
				<view v-else class="picker-input" @click="openAddressPopup">
					<text :class="selectedAddress ? 'value-text' : 'placeholder-text'">
						{{ selectedAddress ? selectedAddressText : '请选择服务地址' }}
					</text>
				</view>
			</view>
			<view class="row">
				<text class="label">上门时间</text>
				<view class="picker-input" @click="openDateTimePopup">
					<text :class="timeText ? 'value-text' : 'placeholder-text'">
						{{ timeText || '请选择预约日期和时间' }}
					</text>
				</view>
			</view>
			<view class="row">
				<text class="label">费用小计</text>
				<text class="price-text">￥{{ totalAmount }}</text>
			</view>
			<view class="row">
				<text class="label">备注</text>
				<textarea class="remark-input" v-model="remark" placeholder="可填写注意事项（选填）" maxlength="200" />
			</view>
			<button class="submit" @click="submitReserve">去支付</button>
		</view>

		<u-popup v-model="showDateTimePopup" mode="bottom" border-radius="18" :closeable="true">
			<view class="datetime-popup">
				<view class="popup-title">选择预约时间</view>
				<view class="popup-row">
					<text class="popup-label">日期</text>
					<picker mode="date" :value="dateValue" @change="onDateChange">
						<view class="picker-btn">{{ dateValue }}</view>
					</picker>
				</view>
				<view class="popup-row">
					<text class="popup-label">时间</text>
					<picker mode="time" :value="timeValue" @change="onTimeChange">
						<view class="picker-btn">{{ timeValue }}</view>
					</picker>
				</view>
				<button class="confirm-btn" @click="confirmDateTime">确定</button>
			</view>
		</u-popup>

		<u-popup v-model="showAddressPopup" mode="bottom" border-radius="18" :closeable="true">
			<view class="address-popup">
				<view class="popup-title">选择服务地址</view>
				<view class="address-list" v-if="addressList.length">
					<view
						class="address-item"
						v-for="item in addressList"
						:key="item.id"
						@click="chooseAddress(item)"
					>
						<view class="address-item-main">
							<view class="address-item-top">
								<text class="address-name">{{ item.consignee }}</text>
								<text class="address-phone">{{ item.phone }}</text>
							</view>
							<view class="address-detail">{{ formatAddress(item) }}</view>
						</view>
						<text class="address-check" v-if="selectedAddress && selectedAddress.id === item.id">已选</text>
					</view>
				</view>
				<view class="empty-tip" v-else>
					<text>暂无可用地址</text>
					<button class="go-add-btn" @click="goAddAddress">去添加地址</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import api from '../utils/http.js'
import utils from '../utils/utils.js'

export default {
	data() {
		const now = new Date()
		const pad = n => String(n).padStart(2, '0')
		const dateValue = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
		const timeValue = `${pad(now.getHours())}:${pad(now.getMinutes())}`
		return {
			serviceName: '',
			packageId: 0,
			specId: 0,
			selectedSpecName: '',
			quantity: 1,
			unitPrice: 0,
			categoryId: 1,
			packageDetail: {},
			addressList: [],
			selectedAddress: null,
			showAddressPopup: false,
			remark: '',
			timeText: '',
			showDateTimePopup: false,
			dateValue,
			timeValue
		}
	},
	computed: {
		selectedAddressText() {
			if (!this.selectedAddress) return ''
			return `${this.selectedAddress.consignee} ${this.selectedAddress.phone} ${this.formatAddress(this.selectedAddress)}`
		},
		totalAmount() {
			return utils.numberFormat(Number(this.unitPrice || 0) * Number(this.quantity || 1))
		}
	},
	onLoad(options) {
		this.serviceName = decodeURIComponent(options.name || '')
		this.packageId = Number(options.packageId || 0)
		this.specId = Number(options.specId || 0)
		this.selectedSpecName = decodeURIComponent(options.specName || '')
		this.quantity = Number(options.quantity || 1)
		this.unitPrice = Number(options.unitPrice || 0)
		this.categoryId = Number(options.categoryId || 1)
		this.packageDetail = uni.getStorageSync('package_detail_cache') || {}
		if (!this.serviceName) {
			this.serviceName = this.packageDetail.name || ''
		}
		if (!this.selectedSpecName) {
			this.selectedSpecName = this.packageDetail.serviceSpec || ''
		}
		if (!this.unitPrice) {
			this.unitPrice = Number(this.packageDetail.price || 0)
		}
		this.fetchAddressList()
	},
	methods: {
		async fetchAddressList() {
			const token = uni.getStorageSync('Token') || ''
			if (!token) return

			try {
				const res = await api.createRequest({
					url: '/house/address/my',
					method: 'get',
					token
				}, {})
				const list = Array.isArray(res?.data) ? res.data : []
				this.addressList = list

				if (list.length === 0) {
					this.selectedAddress = null
					return
				}

				// 优先选 isDefault === 1 的地址
				const defaultItem = list.find(item => Number(item.isDefault) === 1)
				if (defaultItem) {
					this.selectedAddress = defaultItem
				} else {
					// 无默认地址，自动将第一条设为默认
					this.selectedAddress = list[0]
					try {
						await api.createRequest({
							url: '/house/address/update',
							method: 'put',
							token
						}, { 				id: list[0].id,
						isDefault: 1,
						consignee: list[0].consignee,
						phone: list[0].phone,
						province: '四川省',
						city: '南充市',
						district: list[0].district,
						detailAddress: list[0].detailAddress, })
					} catch (e) {
						console.error('自动设置默认地址失败：', e)
					}
				}
			} catch (e) {
				this.addressList = []
				this.selectedAddress = null
				uni.showToast({
					title: '获取地址失败',
					icon: 'none'
				})
			}
		},
		goAddAddress() {
			this.showAddressPopup = false
			uni.navigateTo({
				url: '/pages/address/address'
			})
		},
		formatAddress(item) {
			return [item.province, item.city, item.district, item.detailAddress].filter(Boolean).join('')
		},
		openAddressPopup() {
			this.showAddressPopup = true
		},
		async chooseAddress(item) {
			this.selectedAddress = item
			this.showAddressPopup = false

			const token = uni.getStorageSync('Token') || ''
			if (!token) return

			try {
				await api.createRequest({
					url: '/house/address/update',
					method: 'put',
					token
				}, { id: item.id, isDefault: 1, consignee: item.consignee, phone: item.phone, province: '四川省', city: '南充市', district: item.district, detailAddress: item.detailAddress })
			} catch (e) {
				console.error('设置默认地址失败：', e)
			}
		},
		openDateTimePopup() {
			this.showDateTimePopup = true
		},
		onDateChange(e) {
			this.dateValue = e.detail.value
		},
		onTimeChange(e) {
			this.timeValue = e.detail.value
		},
		confirmDateTime() {
			this.timeText = `${this.dateValue} ${this.timeValue}`
			this.showDateTimePopup = false
		},
		async submitReserve() {
			if (!this.selectedAddress || !this.selectedAddress.id) {
				uni.showToast({
					title: '请选择服务地址',
					icon: 'none'
				})
				return
			}
			if (!this.timeText) {
				uni.showToast({
					title: '请选择预约时间',
					icon: 'none'
				})
				return
			}

			if (!this.packageId) {
				uni.showToast({
					title: '服务信息缺失',
					icon: 'none'
				})
				return
			}

			if (!this.specId) {
				uni.showToast({
					title: '服务规格缺失，请重新选择',
					icon: 'none'
				})
				return
			}

			const token = uni.getStorageSync('Token') || ''
			if (!token) {
				uni.navigateTo({
					url: '/pages/login/index'
				})
				return
			}

			const reserveDateTime = `${this.dateValue} ${this.timeValue}`
			const payload = {
				packageId: this.packageId,
				specId: this.specId,
				quantity: this.quantity,
				categoryId: this.categoryId,
				addressId: this.selectedAddress.id,
				startDate: reserveDateTime,
				endDate: reserveDateTime,
				remark: this.remark || ''
			}

			const paymentPayload = {
				orderPayload: payload,
				goodsInfo: {
					name: this.serviceName,
					specName: this.selectedSpecName,
					quantity: this.quantity,
					unitPrice: this.unitPrice,
					totalAmount: this.totalAmount,
					posterImage: this.packageDetail.posterImage || '',
					serviceTime: reserveDateTime,
					addressText: this.selectedAddressText
				}
			}
			uni.setStorageSync('reserve_payment_payload', paymentPayload)
			uni.navigateTo({
				url: '/pkgGoods/payment'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #f8f9fa;
	padding: 24rpx;
}

.card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx 24rpx 40rpx;
}

.title {
	font-size: 32rpx;
	font-weight: 600;
	color: #222;
	margin-bottom: 20rpx;
}

.row {
	margin-bottom: 24rpx;
}

.label {
	display: block;
	font-size: 26rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.value {
	font-size: 30rpx;
	color: #333;
}

.price-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #f23f3f;
}

.input {
	height: 78rpx;
	border-radius: 12rpx;
	background: #f4f5f7;
	padding: 0 20rpx;
	font-size: 28rpx;
}

.picker-input {
	height: 78rpx;
	border-radius: 12rpx;
	background: #f4f5f7;
	padding: 0 20rpx;
	display: flex;
	align-items: center;
}

.placeholder-text {
	font-size: 28rpx;
	color: #999;
}

.value-text {
	font-size: 28rpx;
	color: #333;
}

.submit {
	margin-top: 16rpx;
	border-radius: 40rpx;
	background: #40ae36;
	color: #fff;
	font-size: 30rpx;
}

.remark-input {
	width: 100%;
	min-height: 140rpx;
	border-radius: 12rpx;
	background: #f4f5f7;
	padding: 18rpx 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.datetime-popup {
	background: #fff;
	padding: 30rpx 24rpx 40rpx;
}

.popup-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #222;
	text-align: center;
	margin-bottom: 28rpx;
}

.popup-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.popup-label {
	font-size: 28rpx;
	color: #666;
}

.picker-btn {
	min-width: 260rpx;
	text-align: center;
	background: #f4f5f7;
	padding: 16rpx 20rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	color: #333;
}

.confirm-btn {
	margin-top: 12rpx;
	border-radius: 40rpx;
	background: #40ae36;
	color: #fff;
	font-size: 30rpx;
}

.address-popup {
	background: #fff;
	padding: 30rpx 24rpx 40rpx;
}

.address-list {
	max-height: 700rpx;
	overflow-y: auto;
}

.address-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18rpx 0;
	border-bottom: 1px solid #f1f1f1;
}

.address-item-main {
	flex: 1;
	padding-right: 20rpx;
}

.address-item-top {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 8rpx;
}

.address-name {
	margin-right: 16rpx;
	font-weight: 600;
}

.address-phone {
	color: #666;
	font-size: 26rpx;
}

.address-detail {
	font-size: 24rpx;
	color: #999;
}

.address-check {
	font-size: 24rpx;
	color: #40ae36;
}

.empty-tip {
	text-align: center;
	font-size: 26rpx;
	color: #999;
	padding: 30rpx 0;

	.go-add-btn {
		margin-top: 16rpx;
		border-radius: 40rpx;
		background: #40ae36;
		color: #fff;
		font-size: 28rpx;
	}
}

.add-address-btn {
	font-size: 28rpx;
	color: #40ae36;
}
</style>
