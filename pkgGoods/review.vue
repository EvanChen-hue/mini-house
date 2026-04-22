<template>
	<view class="page">
		<view class="goods-head">
			<image class="goods-image" :src="posterImageUrl" mode="aspectFill"></image>
			<view class="goods-info">
				<view class="goods-name">{{ goods.name || '服务评价' }}</view>
				<view class="goods-sub">共{{ total }}条评价</view>
			</view>
		</view>

		<view class="list-wrap" v-if="reviews.length > 0">
			<view class="review-item" v-for="item in reviews" :key="item.id">
				<view class="review-top">
					<text class="review-user">{{ item.visitorName }}</text>
					<text class="review-time">{{ item.createTime }}</text>
				</view>
				<view class="review-tags" v-if="item.tagList.length > 0">
					<text class="review-tag" v-for="(tag, idx) in item.tagList" :key="idx">{{ tag }}</text>
				</view>
				<view class="review-content">{{ item.content }}</view>
			</view>
			<view class="load-text">{{ loadText }}</view>
		</view>

		<view class="empty-wrap" v-else-if="!loading">
			<u-empty></u-empty>
		</view>
	</view>
</template>

<script>
import api from '../utils/http.js'

export default {
	data() {
		return {
			goods: {},
			packageId: 0,
			reviews: [],
			page: 1,
			pageSize: 10,
			total: 0,
			loading: false,
			finished: false
		}
	},
	computed: {
		posterImageUrl() {
			const url = this.goods.posterImage || ''
			if (!url) return '/static/banner.png'
			if (String(url).indexOf('http') === 0) return url
			return `${api.baseUrl}${url}`
		},
		loadText() {
			if (this.loading) return '加载中...'
			if (this.finished) return '没有更多了'
			return '上拉加载更多'
		}
	},
	onLoad(options) {
		const cache = uni.getStorageSync('package_detail_cache') || {}
		this.goods = cache || {}
		this.packageId = Number(options.packageId || cache.id || 0)
		if (!this.packageId) {
			uni.showToast({
				title: '缺少套餐信息',
				icon: 'none'
			})
			return
		}
		this.fetchReviews(true)
	},
	onReachBottom() {
		if (this.loading || this.finished) return
		this.fetchReviews(false)
	},
	methods: {
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
				.slice(0, 4)
		},
		formatTime(raw) {
			if (!raw) return ''
			const text = String(raw)
			if (text.length >= 10) return text.slice(0, 10)
			return text
		},
		async fetchReviews(reset) {
			if (this.loading) return
			if (!this.packageId) return
			const currentPage = reset ? 1 : this.page
			this.loading = true
			try {
				const token = uni.getStorageSync('Token') || ''
				const res = await api.createRequest({
					url: '/house/review/page',
					method: 'get',
					token
				}, {
					packageId: this.packageId,
					page: currentPage,
					pageSize: this.pageSize
				}, false)
				const pageData = res?.data || {}
				const records = Array.isArray(pageData.records) ? pageData.records : []
				const mapped = records.map((item, idx) => ({
					id: item.id || `${currentPage}_${idx}`,
					visitorName: this.normalizeName(item.visitorName),
					createTime: this.formatTime(item.createTime),
					content: item.content || '用户未填写评价内容',
					tagList: this.normalizeTags(item.tags)
				}))
				this.total = Number(pageData.total || 0)
				this.reviews = reset ? mapped : this.reviews.concat(mapped)
				this.page = currentPage + 1
				this.finished = mapped.length < this.pageSize || this.reviews.length >= this.total
			} catch (e) {
				if (reset) {
					this.reviews = []
				}
				uni.showToast({
					title: '获取评价失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #f6f7f8;
	padding: 20rpx;
}

.goods-head {
	background: #fff;
	border-radius: 18rpx;
	padding: 18rpx;
	display: flex;
	align-items: center;
}

.goods-image {
	width: 110rpx;
	height: 110rpx;
	border-radius: 12rpx;
}

.goods-info {
	margin-left: 14rpx;
	flex: 1;
}

.goods-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #222;
}

.goods-sub {
	margin-top: 6rpx;
	font-size: 24rpx;
	color: #888;
}

.list-wrap {
	margin-top: 16rpx;
}

.review-item {
	background: #fff;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 14rpx;
}

.review-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.review-user {
	font-size: 26rpx;
	font-weight: 600;
	color: #333;
}

.review-time {
	font-size: 22rpx;
	color: #999;
}

.review-tags {
	margin-top: 10rpx;
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.review-tag {
	font-size: 20rpx;
	color: #ff6f3d;
	background: #fff1ea;
	padding: 2rpx 10rpx;
	border-radius: 10rpx;
}

.review-content {
	margin-top: 12rpx;
	font-size: 24rpx;
	line-height: 36rpx;
	color: #555;
}

.load-text {
	text-align: center;
	font-size: 24rpx;
	color: #999;
	padding: 14rpx 0 24rpx;
}

.empty-wrap {
	margin-top: 100rpx;
}
</style>
