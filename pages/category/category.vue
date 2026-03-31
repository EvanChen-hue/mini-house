<template>
	<view class="u-wrap">
		<view class="header">
			<view class="search-box">
				<image src="/static/one.png"></image>
				<view class="search-input">
					<input
						type="text"
						v-model.trim="keyword"
						placeholder="输入名字搜索"
						confirm-type="search"
						@confirm="onSearch"
					/>
				</view>
				<text class="search-btn" @click="onSearch">搜索</text>
			</view>
		</view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view
					v-for="item in list"
					:key="item.id"
					class="u-tab-item"
					:class="[current === item.id ? 'u-tab-item-active' : '']"
					@tap.stop="swichMenu(item.id)"
				>
					<text class="u-line-1">{{ item.name }}</text>
				</view>
			</scroll-view>

			<scroll-view
				scroll-y
				class="right-box"
				@scrolltolower="loadMore"
				:lower-threshold="80"
			>
				<view class="page-view" v-if="currentTab.goods.length > 0">
					<view class="class-item">
						<view class="thumb-box" v-for="goods in currentTab.goods" :key="goods.id">
							<view class="goods-left" @click="goodsDetail(goods)">
								<image :src="formatAvatar(goods.avatar)"></image>
							</view>
							<view class="goods-right">
								<view class="goods-name" @click="goodsDetail(goods)">
									<text>{{ goods.name || '' }}</text>
								</view>
								<view class="goods-meta" @click="goodsDetail(goods)">
									<text class="goods-tag" v-if="goods.categoryName">{{ goods.categoryName }}</text>
									<text class="goods-age" v-if="goods.age">{{ goods.age }}岁</text>
								</view>
								<view class="goods-intro" @click="goodsDetail(goods)">
									<text>{{ goods.intro || '暂无介绍' }}</text>
								</view>
								<view class="goods-price">
									<text class="goods-price-txt" @click="goodsDetail(goods)">￥{{ goods.price || '0.00' }}</text>
									<view @click="addCart(goods.id)">
										<image class="goods-shopcar-icon" src="/static/one.png"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="load-more">{{ loadMoreText }}</view>
				</view>
				<view v-else style="margin-top: 200rpx;">
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
			list: [
				{ id: 1, name: '月嫂', goods: [] },
				{ id: 2, name: '保洁', goods: [] }
			],
			keyword: '',
			pageNo: 1,
			pageSize: 10,
			total: 0,
			loading: false,
			finished: false,
			scrollTop: 0,
			current: 1,
			menuHeight: 0,
			menuItemHeight: 0
		}
	},
	computed: {
		currentTab() {
			return this.list.find(item => item.id === this.current) || { goods: [] }
		},
		loadMoreText() {
			if (this.loading) {
				return '加载中...'
			}
			if (this.finished) {
				return '没有更多了'
			}
			return '上拉加载更多'
		}
	},
	onShow() {
		this.initData()
	},
	onReachBottom() {
		this.loadMore()
	},
	methods: {
		async initData() {
			const savedId = Number(uni.getStorageSync('category_tab_id') || 1)
			this.current = savedId === 2 ? 2 : 1
			await this.resetAndFetch(this.current)
		},
		async resetAndFetch(categoryId) {
			const target = this.list.find(item => item.id === categoryId)
			if (!target) return

			target.goods = []
			this.pageNo = 1
			this.total = 0
			this.finished = false
			await this.fetchCategoryGoods(categoryId, true)
		},
		async fetchCategoryGoods(categoryId, reset = false) {
			const target = this.list.find(item => item.id === categoryId)
			if (!target) return
			if (this.loading) return

			const current = reset ? 1 : this.pageNo
			this.loading = true

			const params = {
				categoryId,
				current,
				size: this.pageSize
			}

			if(this.keyword) {
				params.name = this.keyword
			}

			try {
				const res = await api.createRequest(
					{
						url: '/house/worker/list',
						method: 'get'
					},
					params
				)
				const pageData = res?.data || {}
				const records = Array.isArray(pageData.records) ? pageData.records : []
				this.total = Number(pageData.total) || 0
				target.goods = reset ? records : target.goods.concat(records)
				this.pageNo = current + 1
				this.finished = target.goods.length >= this.total || records.length < this.pageSize
			} catch (e) {
				if (reset) {
					target.goods = []
				}
				uni.showToast({
					title: '获取分类数据失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		async swichMenu(index) {
			if (index === this.current) return
			this.current = index
			this.$utils.setStorage('category_tab_id', index)

			if (this.menuHeight === 0 || this.menuItemHeight === 0) {
				await this.getElRect('menu-scroll-view', 'menuHeight')
				await this.getElRect('u-tab-item', 'menuItemHeight')
			}
			const tabIndex = this.list.findIndex(item => item.id === index)
			const safeTabIndex = tabIndex < 0 ? 0 : tabIndex
			this.scrollTop = safeTabIndex * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2
			await this.resetAndFetch(index)
		},
		onSearch() {
			this.resetAndFetch(this.current)
		},
		loadMore() {
			if (this.loading || this.finished) {
				return
			}
			this.fetchCategoryGoods(this.current)
		},
		getElRect(elClass, dataVal) {
			return new Promise(resolve => {
				const query = uni.createSelectorQuery().in(this)
				query.select('.' + elClass).fields({ size: true }, res => {
					if (!res) {
						setTimeout(() => {
							this.getElRect(elClass, dataVal).then(resolve)
						}, 10)
						return
					}
					this[dataVal] = res.height
					resolve()
				}).exec()
			})
		},
		formatAvatar(avatar) {
			if (!avatar) return '/static/1.png'
			if (avatar.indexOf('http') === 0) return avatar
			return `https://requests.taiyang.chat${avatar}`
		},
		addCart() {
			this.$utils.toastTip('已加入购物车')
		},
		goodsDetail(goods) {
			const data = encodeURIComponent(JSON.stringify(goods || {}))
			uni.navigateTo({
				url: `/pkgGoods/detail?goods=${data}`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.u-wrap {
	height: calc(100vh);
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 30rpx;
	background: #f8f9fa;

	.search-box {
		background: #ffffff;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		padding: 14rpx 40rpx;
		width: 100%;

		.search-input {
			margin-left: 20rpx;

			input {
				color: #999999;
				font-size: 28rpx;
			}
		}

		image {
			width: 32rpx;
			height: 32rpx;
		}
	}
}

.u-menu-wrap {
	flex: 1;
	display: flex;
	overflow: hidden;
}

.u-tab-view {
	width: 200rpx;
	height: 100%;
	background: #f8f9fa;
}

.u-tab-item {
	height: 110rpx;
	background: #f6f6f6;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #444;
	font-weight: 400;
	line-height: 1;
}

.u-tab-item-active {
	position: relative;
	color: #000;
	font-size: 30rpx;
	font-weight: 600;
	background: #fff;
}

.u-line-1 {
	padding: 20rpx 10rpx;
}

.right-box {
	flex: 1;
	background-color: rgb(250, 250, 250);
	padding: 0 16rpx;
	height: 100%;
}

.class-item {
	margin-bottom: 30rpx;
	background-color: #fff;
	padding: 16rpx;
	border-radius: 8rpx;
}

.thumb-box {
	display: flex;
	align-items: center;
	padding: 20rpx 0rpx;

	.goods-left {
		max-width: 180rpx;
		max-height: 180rpx;

		image {
			width: 180rpx;
			height: 180rpx;
			border-radius: 4px;
		}
	}

	.goods-right {
		flex: 1;
		border-bottom: 1rpx solid #ebebeb;
		padding-bottom: 22rpx;
		margin: 0rpx 24rpx;
	}
}

.goods-name {
	font-size: 26rpx;
	font-weight: 700;
	line-height: 34rpx;
	color: #333333;
	margin-top: 10rpx;

	text {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}
}

.goods-intro {
	font-size: 22rpx;
	color: #999999;
	margin-top: 8rpx;
	line-height: 32rpx;
	width: 100%;

	text {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

.goods-meta {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-top: 8rpx;
}

.goods-tag {
	font-size: 20rpx;
	color: #40ae36;
	background: #eef9ed;
	padding: 4rpx 12rpx;
	border-radius: 16rpx;
}

.goods-age {
	font-size: 22rpx;
	color: #666666;
}

.goods-price {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 12rpx;
}

.goods-price-txt {
	color: #f55726;
	font-size: 32rpx;
	font-weight: 600;
}

.goods-shopcar-icon {
	width: 44rpx;
	height: 44rpx;
	margin-right: 10rpx;
}

.search-btn {
	font-size: 24rpx;
	color: #40ae36;
	margin-left: 16rpx;
	white-space: nowrap;
}

.load-more {
	text-align: center;
	font-size: 24rpx;
	color: #999999;
	padding: 10rpx 0 30rpx;
}
</style>
