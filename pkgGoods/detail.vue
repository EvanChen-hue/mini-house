<template>
	<view class="page">
		<view class="card">
			<image class="cover" :src="imageUrl"></image>
			<view class="name">{{ goods.name || '服务项目' }}</view>
			<view class="meta" v-if="goods.categoryName || goods.age">
				<text class="meta-tag" v-if="goods.categoryName">{{ goods.categoryName }}</text>
				<text class="meta-age" v-if="goods.age">{{ goods.age }}岁</text>
			</view>
			<view class="intro">{{ goods.intro || '暂无详情介绍' }}</view>
			<view class="price">￥{{ goods.price || '0.00' }}</view>
		</view>

		<view class="action-bar">
			<button class="btn warn" @click="goReserve">预约</button>
			<button class="btn plain" @click="goService">客服</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			goods: {}
		}
	},
	computed: {
		imageUrl() {
			if (!this.goods.avatar) {
				return '/static/1.png'
			}
			if (this.goods.avatar.indexOf('http') === 0) {
				return this.goods.avatar
			}
			return `https://requests.taiyang.chat${this.goods.avatar}`
		}
	},
	onLoad(options) {
		try {
			this.goods = JSON.parse(decodeURIComponent(options.goods || '{}'))
		} catch (e) {
			this.goods = {}
		}
	},
	methods: {
		goOrder() {
			uni.navigateTo({
				url: '/pkgTrade/payment'
			})
		},
		goReserve() {
			const name = encodeURIComponent(this.goods.name || '')
			const workerId = Number(this.goods.id || this.goods.workerId || 0)
			const categoryId = Number(this.goods.categoryId || this.goods.category_id || uni.getStorageSync('category_tab_id') || 1)
			uni.navigateTo({
				url: `/pkgGoods/reserve?name=${name}&workerId=${workerId}&categoryId=${categoryId}`
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
	padding: 24rpx;
	padding-bottom: 180rpx;
	background: #f8f9fa;
	min-height: 100vh;
}

.card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
}

.cover {
	width: 100%;
	height: 420rpx;
	border-radius: 16rpx;
}

.name {
	font-size: 36rpx;
	font-weight: 600;
	color: #222;
	margin-top: 20rpx;
}

.intro {
	margin-top: 12rpx;
	font-size: 26rpx;
	line-height: 40rpx;
	color: #666;
}

.meta {
	margin-top: 12rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.meta-tag {
	font-size: 22rpx;
	color: #40ae36;
	background: #eef9ed;
	padding: 4rpx 14rpx;
	border-radius: 16rpx;
}

.meta-age {
	font-size: 24rpx;
	color: #666;
}

.price {
	margin-top: 16rpx;
	font-size: 40rpx;
	color: #f55726;
	font-weight: 700;
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
}

.btn {
	flex: 1;
	border-radius: 40rpx;
	font-size: 28rpx;
}

.primary {
	background: #40ae36;
	color: #fff;
}

.warn {
	background: #fed12f;
	color: #333;
}

.plain {
	background: #f4f5f7;
	color: #333;
}
</style>
