<template>
	<view class="page-wrap">
		<view class="header-wrap">
			<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header">
				<view class="header-top">
					<view class="brand-block">
						<text class="brand-title">分类服务</text>
					</view>
				</view>
			</view>
			<view class="header-fade"></view>
		</view>

		<view class="menu-wrap">
			<scroll-view
				scroll-y
				scroll-with-animation
				class="left-scroll menu-scroll-view"
				:scroll-top="scrollTop"
			>
				<view
					v-for="item in categories"
					:key="item.id"
					class="left-item"
					:class="currentCategoryId === item.id ? 'left-item-active' : ''"
					@tap.stop="switchCategory(item.id)"
				>
					<text class="left-item-text">{{ item.name }}</text>
				</view>
			</scroll-view>

			<scroll-view
				scroll-y
				class="right-scroll"
				@scrolltolower="loadMore"
				:lower-threshold="80"
			>
				<view class="package-list" v-if="packages.length > 0">
					<view class="package-card" v-for="pkg in packages" :key="pkg.id" @click="goPackage(pkg)">
						<image class="package-image" :src="formatPackageImage(pkg.posterImage)"></image>
						<view class="package-info">
							<view class="package-name">
								<text>{{ pkg.name || '未命名服务' }}</text>
							</view>
							<view class="package-desc">
								<text>{{ pkg.description || '暂无服务说明' }}</text>
							</view>
							<view class="package-meta">
								<text class="package-sales">销量 {{ pkg.salesVolume || 0 }}</text>
								<text class="package-area" v-if="pkg.serviceArea">{{ pkg.serviceArea }}</text>
							</view>
							<view class="package-price-row">
								<text class="package-price">￥{{ pkg.price || 0 }}</text>
								<text class="package-origin" v-if="Number(pkg.originalPrice) > Number(pkg.price)">￥{{ pkg.originalPrice }}</text>
							</view>
						</view>
					</view>
					<view class="load-more">{{ loadMoreText }}</view>
				</view>
				<view class="empty-wrap" v-else>
					<u-empty></u-empty>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import api from '../../utils/http.js'

export default {
	data() {
		return {
			statusBarHeight: 20,
			categories: [],
			packages: [],
			currentCategoryId: 0,
			page: 1,
			pageSize: 10,
			total: 0,
			loading: false,
			finished: false,
			scrollTop: 0,
			menuHeight: 0,
			menuItemHeight: 0
		}
	},
	computed: {
		loadMoreText() {
			if (this.loading) return '加载中...'
			if (this.finished) return '没有更多了'
			return '上拉加载更多'
		}
	},
	onLoad() {
		const systemInfo = uni.getSystemInfoSync()
		this.statusBarHeight = systemInfo?.statusBarHeight || 20
		this.initPage()
	},
	onReachBottom() {
		this.loadMore()
	},
	methods: {
		async initPage() {
			await this.fetchCategories()
		},
		async fetchCategories() {
			try {
				const token = uni.getStorageSync('Token') || '';
				const res = await api.createRequest({
					url: '/house/category/list',
					method: 'get',
					token
				})

				const list = Array.isArray(res?.data) ? res.data : []
				const sorted = list
					.slice()
					.sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0))
					.map(item => ({
						id: Number(item.id),
						name: item.name || '未命名分类'
					}))

				this.categories = sorted
				if (!this.categories.length) {
					this.currentCategoryId = 0
					this.packages = []
					this.finished = true
					return
				}

				const savedId = Number(uni.getStorageSync('category_tab_id') || 0)
				const hasSaved = this.categories.some(item => item.id === savedId)
				this.currentCategoryId = hasSaved ? savedId : this.categories[0].id
				await this.resetAndFetchPackages(this.currentCategoryId)
			} catch (err) {
				this.categories = []
				this.packages = []
				this.finished = true
				uni.showToast({
					title: '获取分类失败',
					icon: 'none'
				})
			}
		},
		async resetAndFetchPackages(categoryId) {
			this.page = 1
			this.total = 0
			this.finished = false
			this.packages = []
			await this.fetchPackages(categoryId, true)
		},
		async fetchPackages(categoryId, reset = false) {
			if (!categoryId || this.loading) return

			const currentPage = reset ? 1 : this.page
			this.loading = true

			try {
				const token = uni.getStorageSync('Token') || '';
				const res = await api.createRequest({
					url: '/house/package/page',
					method: 'get',
					token
				}, {
					page: currentPage,
					pageSize: this.pageSize,
					categoryId
				})

				const pageData = res?.data || {}
				const records = Array.isArray(pageData.records) ? pageData.records : []
				const validRecords = records.filter(item => Number(item.status) !== 0)
				this.total = Number(pageData.total) || 0

				this.packages = reset ? validRecords : this.packages.concat(validRecords)
				this.page = currentPage + 1
				this.finished = validRecords.length < this.pageSize || this.packages.length >= this.total
			} catch (err) {
				if (reset) {
					this.packages = []
				}
				uni.showToast({
					title: '获取套餐失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		async switchCategory(categoryId) {
			if (categoryId === this.currentCategoryId) return
			this.currentCategoryId = categoryId
			uni.setStorageSync('category_tab_id', categoryId)

			if (this.menuHeight === 0 || this.menuItemHeight === 0) {
				await this.getElRect('menu-scroll-view', 'menuHeight')
				await this.getElRect('left-item', 'menuItemHeight')
			}
			const idx = this.categories.findIndex(item => item.id === categoryId)
			const safeIdx = idx < 0 ? 0 : idx
			this.scrollTop = safeIdx * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2

			await this.resetAndFetchPackages(categoryId)
		},
		loadMore() {
			if (this.loading || this.finished) return
			this.fetchPackages(this.currentCategoryId)
		},
		getElRect(elClass, dataVal) {
			return new Promise(resolve => {
				const query = uni.createSelectorQuery().in(this)
				query.select('.' + elClass).fields({ size: true }, res => {
					if (!res) {
						setTimeout(() => {
							this.getElRect(elClass, dataVal).then(resolve)
						}, 16)
						return
					}
					this[dataVal] = res.height
					resolve()
				}).exec()
			})
		},
		formatPackageImage(url) {
			if (!url) return '/static/banner.png'
			if (String(url).indexOf('http') === 0) return url
			return `${api.baseUrl}//house/uploads/${url}`
		},
		buildDetailCache(item) {
			const data = item || {}
			return {
				id: data.id,
				categoryId: data.categoryId,
				name: data.name || '',
				description: data.description || '',
				originalPrice: Number(data.originalPrice || 0),
				price: Number(data.price || 0),
				salesVolume: Number(data.salesVolume || 0),
				serviceArea: data.serviceArea || '',
				serviceSpec: data.serviceSpec || '',
				posterImage: data.posterImage || '',
				detailImage: data.detailImage || '',
				status: Number(data.status || 0)
			}
		},
		goPackage(pkg) {
			const payload = this.buildDetailCache(pkg)
			uni.setStorageSync('package_detail_cache', payload)
			const data = encodeURIComponent(JSON.stringify(payload))
			uni.navigateTo({
				url: `/pkgGoods/detail?goods=${data}`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page-wrap {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f7f7f7;
}

.header-wrap {
	background: linear-gradient(180deg, #fff2d4 0%, #fff7ea 60%, #ffffff 100%);
}

.status-bar {
	width: 100%;
}

.header {
	padding: 20rpx 30rpx 10rpx;

	.header-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.brand-block {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.brand-title {
		font-size: 42rpx;
		font-weight: 700;
		color: #333;
		line-height: 1.2;
	}

	.brand-subtitle {
		font-size: 22rpx;
		color: #8a846f;
	}
}

.header-fade {
	height: 26rpx;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f7f7f7 100%);
}

.menu-wrap {
	flex: 1;
	display: flex;
	overflow: hidden;
	padding-bottom: 12rpx;
}

.left-scroll {
	width: 210rpx;
	height: 100%;
	background: #f2f2f2;
	border-top-right-radius: 16rpx;
	border-bottom-right-radius: 16rpx;
}

.left-item {
	min-height: 110rpx;
	padding: 0 14rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #555;
	font-size: 26rpx;
	font-weight: 400;
	box-sizing: border-box;
}

.left-item-text {
	text-align: center;
	line-height: 36rpx;
}

.left-item-active {
	position: relative;
	background: #fff;
	color: #222;
	font-weight: 600;
}

.left-item-active::before {
	content: '';
	position: absolute;
	left: 0;
	top: 26rpx;
	width: 8rpx;
	height: 58rpx;
	border-radius: 0 8rpx 8rpx 0;
	background: #f1b14b;
}

.right-scroll {
	flex: 1;
	height: 100%;
	padding: 0 16rpx;
	box-sizing: border-box;
}

.package-list {
	padding-bottom: 30rpx;
}

.package-card {
	display: flex;
	padding: 18rpx;
	margin-bottom: 16rpx;
	border-radius: 16rpx;
	background: #fff;
	gap: 16rpx;
}

.package-image {
	width: 180rpx;
	height: 180rpx;
	border-radius: 12rpx;
	flex-shrink: 0;
	background: #f1f1f1;
}

.package-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.package-name {
	font-size: 30rpx;
	font-weight: 700;
	color: #222;

	text {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		overflow: hidden;
	}
}

.package-desc {
	margin-top: 8rpx;
	font-size: 24rpx;
	color: #999;
	line-height: 34rpx;

	text {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}
}

.package-meta {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-top: 10rpx;
}

.package-sales,
.package-area {
	font-size: 20rpx;
	color: #777;
	padding: 4rpx 10rpx;
	background: #f3f3f3;
	border-radius: 12rpx;
}

.package-price-row {
	margin-top: auto;
	display: flex;
	align-items: baseline;
}

.package-price {
	font-size: 34rpx;
	color: #f55726;
	font-weight: 700;
}

.package-origin {
	margin-left: 8rpx;
	font-size: 22rpx;
	color: #b0b0b0;
	text-decoration: line-through;
}

.load-more {
	text-align: center;
	font-size: 24rpx;
	color: #999;
	padding: 8rpx 0 20rpx;
}

.empty-wrap {
	margin-top: 220rpx;
}
</style>
