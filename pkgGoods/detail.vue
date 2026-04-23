<template>
	<view class="page">
		<view class="hero">
			<image class="hero-image" :src="posterImageUrl" mode="aspectFill"></image>
			<view class="hero-sales">已售{{ goods.salesVolume || 0 }}</view>
		</view>

		<view class="card info-card">
			<view class="price-row">
				<view class="price-wrap">
					<text class="price-symbol">￥</text>
					<text class="price-value">{{ goods.price || 0 }}</text>
					<text class="origin-price" v-if="Number(goods.originalPrice) > Number(goods.price)">￥{{ goods.originalPrice }}</text>
				</view>
				<text class="sales">销量{{ goods.salesVolume || 0 }}</text>
			</view>
			<view class="name">{{ goods.name || '服务项目' }}</view>
			<view class="desc">{{ goods.description || '暂无服务简介' }}</view>
			<view class="area" v-if="goods.serviceArea">服务地区：{{ goods.serviceArea }}</view>
		</view>

		<view class="card row-card" @click="openSpecPopup">
			<text class="row-label">选择</text>
			<text class="row-value">{{ selectedSpecText }}</text>
			<text class="row-arrow">›</text>
		</view>

		<view class="card row-card">
			<text class="row-label">保障</text>
			<text class="row-value">明码标价 · 极速退款 · 服务保证 · 售后无忧</text>
		</view>

		<view class="card review-card" v-if="reviewList.length > 0">
			<view class="review-header">
				<view class="review-title-wrap">
					<text class="review-title">用户评价</text>
					<text class="review-count">({{ reviewDisplayCount }})</text>
				</view>
				<text class="review-more" @click="goReviewPage">查看更多 ></text>
			</view>
			<scroll-view class="review-scroll" scroll-x>
				<view class="review-list">
					<view class="review-item" v-for="item in reviewList" :key="item.id">
						<view class="review-user">{{ item.visitorName }}</view>
						<view class="review-tags" v-if="item.tagList.length > 0">
							<text class="review-tag" v-for="(tag, idx) in item.tagList" :key="idx">{{ tag }}</text>
						</view>
						<text class="review-content">{{ item.content }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="card detail-card">
			<view class="section-title">图文详情</view>
			<image class="detail-image" :src="detailImageUrl" mode="widthFix"></image>
		</view>

		<view class="card notice-card">
			<view class="section-title">服务须知</view>
			<view class="notice-item" v-for="(item, idx) in serviceNoticeList" :key="idx">
				<text class="notice-dot">•</text>
				<text class="notice-text">{{ item }}</text>
			</view>
		</view>

		<u-popup v-model="specPopupVisible" mode="bottom" border-radius="20" :closeable="true">
			<view class="spec-popup">
				<view class="spec-head">
					<image class="spec-image" :src="posterImageUrl" mode="aspectFill"></image>
					<view class="spec-head-right">
						<view class="spec-price">￥{{ selectedSpecPrice }}</view>
						<view class="spec-origin" v-if="Number(goods.originalPrice) > Number(selectedSpecPrice)">￥{{ goods.originalPrice }}</view>
						<view class="spec-name">{{ goods.name || '服务项目' }}</view>
						<view class="spec-current">已选: {{ selectedSpecText }}</view>
					</view>
				</view>

				<view class="spec-block">
					<view class="spec-title">可选规格</view>
					<view class="spec-list">
						<view
							class="spec-line"
							:class="selectedSpecId === item.id ? 'spec-line-active' : ''"
							v-for="item in specList"
							:key="item.id"
							@click="selectSpec(item)"
						>
							<text class="spec-line-name">{{ item.specName }}</text>
							<text class="spec-line-price">￥{{ item.price }}</text>
						</view>
					</view>
				</view>

				<view class="count-row">
					<text class="count-label">人数</text>
					<u-number-box v-model="quantity" :min="1" :max="99"></u-number-box>
				</view>

				<button class="confirm-btn" @click="confirmSpecAndReserve">立即下单</button>
			</view>
		</u-popup>

		<view class="action-bar">
			<button class="btn warn" @click="openSpecPopup">预约</button>
			<button class="btn plain" @click="goService">客服</button>
		</view>
	</view>
</template>

<script>
import api from '../utils/http.js'
import utils from '../utils/utils.js'

export default {
	data() {
		return {
			goods: {},
			specPopupVisible: false,
			specList: [],
			selectedSpecId: 0,
			quantity: 1,
			reviewList: [],
			reviewTotal: 0,
			serviceNoticeList: [
				'家电内部清洁不在服务范围内，此类需求请另行预约家电清洗服务。',
				'室外玻璃、纱窗、百叶窗、防护窗或网清洁不在服务范围内。',
				'装修后未入住新房不在服务范围内，此类需求请预约新居开荒服务。',
				'超过1个月未居住房、自建房、重油污房屋不在日常保洁范围内。',
				'窗帘、古董字画、宗教陈设、花草绿植、天花板、灯具清洗家具概不在服务范围内。',
				'深度保洁不携带吸尘器等特殊工具，如需携带请下单备注额外收费。',
				'若服务超时或有以下情况需要现场加时，请按实际时长在线补差价。',
				'户型或建筑面积超出套餐额定标准；房屋较脏乱或油污较重；需要洗碗或清洁厨具、除胶渍或漆渍。',
				'服务完成后请线上交易，避免与服务人员线下交易。',
				'下单后2小时内取消订单通常收取一定违约金，以平台规则为准。'
			]
		}
	},
	computed: {
		posterImageUrl() {
			return this.formatImage(this.goods.posterImage || this.goods.avatar, '/static/banner.png')
		},
		detailImageUrl() {
			return this.formatImage(this.goods.detailImage || this.goods.posterImage, '/static/banner.png')
		},
		reviewDisplayCount() {
			const total = Number(this.reviewTotal || this.reviewList.length || 0)
			if (total <= 0) return '0'
			if (total >= 1000) return '999+'
			return `${total}+`
		},
		selectedSpec() {
			return this.specList.find(item => Number(item.id) === Number(this.selectedSpecId)) || null
		},
		selectedSpecText() {
			if (this.selectedSpec) return this.selectedSpec.specName || '请选择服务规格'
			if (this.goods.serviceSpec) return this.goods.serviceSpec
			return '请选择服务规格'
		},
		selectedSpecPrice() {
			if (this.selectedSpec) return this.selectedSpec.price || this.goods.price || 0
			return this.goods.price || 0
		}
	},
	onLoad(options) {
		this.initGoods(options)
		if (this.goods.id) {
			this.fetchSpecList()
			this.fetchReviewList()
		}
	},
	methods: {
		initGoods(options) {
			try {
				const parsed = JSON.parse(decodeURIComponent(options.goods || '{}'))
				this.goods = parsed && parsed.id ? parsed : {}
				if (this.goods.id) {
					uni.setStorageSync('package_detail_cache', this.goods)
					return
				}
			} catch (e) {
				this.goods = {}
			}

			const cache = uni.getStorageSync('package_detail_cache') || {}
			if (cache && cache.id) {
				this.goods = cache
			}
		},
		formatImage(url, fallback = '/static/banner.png') {
			return utils.resolveImageUrl(url, fallback)
		},
		normalizeName(name) {
			const str = String(name || '').trim()
			if (!str) return '匿名用户'
			if (/^1\d{10}$/.test(str)) {
				return `${str.slice(0, 3)}****${str.slice(-4)}`
			}
			if (str.length <= 2) return `${str[0]}*`
			if (str.length <= 4) return `${str[0]}*${str[str.length - 1]}`
			return `${str.slice(0, 2)}***${str.slice(-1)}`
		},
		normalizeTags(tags) {
			if (!tags) return []
			return String(tags)
				.split(/[,，|\s]+/)
				.map(item => item.trim())
				.filter(Boolean)
				.slice(0, 3)
		},
		async fetchSpecList() {
			try {
				const token = uni.getStorageSync('Token') || ''
				const res = await api.createRequest({
					url: `/house/package/spec/list/${this.goods.id}`,
					method: 'get',
					token
				})
				const list = Array.isArray(res?.data) ? res.data : []
				this.specList = list
				if (list.length > 0) {
					this.selectedSpecId = Number(list[0].id)
				}
			} catch (e) {
				this.specList = []
			}
		},
		async fetchReviewList() {
			try {
				const token = uni.getStorageSync('Token') || ''
				const res = await api.createRequest({
					url: '/house/review/page',
					method: 'get',
					token
				}, {
					packageId: this.goods.id,
					page: 1,
					pageSize: 10
				}, false)

				const pageData = res?.data || {}
				const records = Array.isArray(pageData.records) ? pageData.records : []
				this.reviewTotal = Number(pageData.total || records.length || 0)
				this.reviewList = records.map((item, idx) => ({
					id: item.id || idx,
					visitorName: this.normalizeName(item.visitorName),
					content: item.content || '用户未填写评价内容',
					tagList: this.normalizeTags(item.tags)
				}))
			} catch (e) {
				this.reviewList = []
				this.reviewTotal = 0
			}
		},
		openSpecPopup() {
			this.specPopupVisible = true
		},
		selectSpec(item) {
			this.selectedSpecId = Number(item.id)
		},
		confirmSpecAndReserve() {
			if (!this.selectedSpec && this.specList.length > 0) {
				this.selectedSpecId = Number(this.specList[0].id)
			}
			this.specPopupVisible = false
			this.goReserve()
		},
		goReviewPage() {
			if (!this.goods.id) return
			uni.navigateTo({
				url: `/pkgGoods/review?packageId=${this.goods.id}`
			})
		},
		goReserve() {
			const name = encodeURIComponent(this.goods.name || '')
			const workerId = Number(this.goods.id || 0)
			const categoryId = Number(this.goods.categoryId || uni.getStorageSync('category_tab_id') || 1)
			const specId = Number(this.selectedSpecId || 0)
			const count = Number(this.quantity || 1)
			uni.navigateTo({
				url: `/pkgGoods/reserve?name=${name}&workerId=${workerId}&categoryId=${categoryId}&specId=${specId}&count=${count}`
			})
		},
		goService() {
			uni.navigateTo({
				url: '/pkgGoods/service'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #f4f4f6;
	padding-bottom: 170rpx;
}

.hero {
	position: relative;
	width: 100%;
	height: 520rpx;
	overflow: hidden;
}

.hero-image {
	width: 100%;
	height: 100%;
}

.hero-sales {
	position: absolute;
	right: 24rpx;
	top: 24rpx;
	font-size: 22rpx;
	color: #fff;
	background: rgba(0, 0, 0, 0.4);
	padding: 8rpx 14rpx;
	border-radius: 20rpx;
}

.card {
	margin: 16rpx 20rpx 0;
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
}

.price-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
}

.price-wrap {
	display: flex;
	align-items: baseline;
	color: #f23f3f;
}

.price-symbol {
	font-size: 30rpx;
	font-weight: 600;
}

.price-value {
	font-size: 52rpx;
	line-height: 1;
	font-weight: 700;
}

.origin-price {
	margin-left: 14rpx;
	font-size: 26rpx;
	color: #999;
	text-decoration: line-through;
}

.sales {
	font-size: 24rpx;
	color: #888;
}

.name {
	margin-top: 12rpx;
	font-size: 38rpx;
	font-weight: 600;
	color: #222;
}

.desc {
	margin-top: 10rpx;
	font-size: 26rpx;
	line-height: 38rpx;
	color: #666;
}

.area {
	margin-top: 10rpx;
	font-size: 24rpx;
	color: #888;
}

.row-card {
	display: flex;
	align-items: center;
}

.row-label {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	min-width: 80rpx;
}

.row-value {
	flex: 1;
	margin-left: 20rpx;
	font-size: 26rpx;
	color: #555;
	line-height: 36rpx;
}

.row-arrow {
	font-size: 34rpx;
	color: #bbb;
}

.review-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.review-title-wrap {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.review-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #222;
}

.review-count {
	font-size: 24rpx;
	color: #888;
}

.review-more {
	font-size: 24rpx;
	color: #7b7b7b;
}

.review-scroll {
	white-space: nowrap;
	margin-top: 20rpx;
}

.review-list {
	display: inline-flex;
	gap: 16rpx;
	padding-bottom: 6rpx;
}

.review-item {
	width: 420rpx;
	background: #f7f8fa;
	border-radius: 16rpx;
	padding: 18rpx;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.review-user {
	font-size: 24rpx;
	font-weight: 600;
	color: #333;
}

.review-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.review-tag {
	font-size: 20rpx;
	color: #ff6f3d;
	background: #fff1ea;
	padding: 2rpx 10rpx;
	border-radius: 12rpx;
}

.review-content {
	font-size: 24rpx;
	color: #555;
	line-height: 34rpx;
	max-height: 68rpx;
	overflow: hidden;
}

.section-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #222;
	margin-bottom: 18rpx;
}

.detail-image {
	width: 100%;
	border-radius: 16rpx;
	background: #f6f6f6;
}

.notice-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.notice-dot {
	font-size: 24rpx;
	line-height: 36rpx;
	color: #6cb7f8;
	margin-right: 8rpx;
}

.notice-text {
	flex: 1;
	font-size: 24rpx;
	line-height: 36rpx;
	color: #666;
}

.spec-popup {
	background: #fff;
	padding: 24rpx;
}

.spec-head {
	display: flex;
	align-items: center;
}

.spec-image {
	width: 130rpx;
	height: 130rpx;
	border-radius: 16rpx;
	background: #f0f0f0;
}

.spec-head-right {
	margin-left: 16rpx;
	flex: 1;
}

.spec-price {
	font-size: 46rpx;
	font-weight: 700;
	color: #f23f3f;
}

.spec-origin {
	margin-top: 4rpx;
	font-size: 24rpx;
	color: #999;
	text-decoration: line-through;
}

.spec-name {
	margin-top: 6rpx;
	font-size: 30rpx;
	color: #222;
}

.spec-current {
	margin-top: 6rpx;
	font-size: 24rpx;
	color: #777;
}

.spec-block {
	margin-top: 26rpx;
}

.spec-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 14rpx;
}

.spec-list {
	max-height: 420rpx;
	overflow-y: auto;
	padding-bottom: 6rpx;
}

.spec-line {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #f7f7f8;
	border-radius: 12rpx;
	padding: 16rpx;
	margin-bottom: 10rpx;
	border: 2rpx solid transparent;
}

.spec-line-active {
	color: #ff4f4f;
	border-color: #ff7a7a;
	background: #fff4f4;
}

.spec-line-name {
	flex: 1;
	font-size: 28rpx;
	color: inherit;
}

.spec-line-price {
	font-size: 30rpx;
	color: inherit;
	font-weight: 600;
}

.count-row {
	margin-top: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.count-label {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}

.confirm-btn {
	margin-top: 28rpx;
	border-radius: 44rpx;
	background: linear-gradient(120deg, #ff4d5f 0%, #ff5e3a 100%);
	color: #fff;
	font-size: 32rpx;
}

.action-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: var(--window-bottom, 0);
	display: flex;
	gap: 14rpx;
	padding: 20rpx 24rpx;
	background: #fff;
	box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.06);
}

.btn {
	flex: 1;
	border-radius: 44rpx;
	font-size: 30rpx;
}

.warn {
	background: linear-gradient(120deg, #ff4d5f 0%, #ff5e3a 100%);
	color: #fff;
}

.plain {
	background: #f1f3f6;
	color: #333;
}
</style>
