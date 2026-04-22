<template>
	<view class="container">
		<view class="header-wrap">
			<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header">
				<view class="header-top">
					<view class="brand-block">
						<text class="brand-title">大拇指到家</text>
					</view>
				</view>

				<!-- <view class="header-address" @click="getCurrentAddress">
					<image class="address-icon" src="/static/point.png"></image>
					<text class="address-text">{{address}}</text>
					<text class="address-refresh">重新定位</text>
				</view> -->
			</view>
			<view class="header-fade"></view>
		</view>
		<view class="content">
			<view class="middle">
				<image src="/static/banner.png" style="width: 100%;height: 600rpx;" mode=""></image>
			</view>
			<view class="hot-box">
				<view class="hot-item">
					<view class="hot-img">
						<image src="/static/icon6.png" mode=""></image>
					</view>
					<text class="hot-text">换新大扫除</text>
				</view>
				<view class="hot-item">
					<view class="hot-img" style="background: #6FDBA6;">
						<image src="/static/icon7.png" mode=""></image>
					</view>
					<text class="hot-text">深度保洁</text>
				</view>
				<view class="hot-item">
					<view class="hot-img" style="background: #ACB3FB;">
						<image src="/static/icon3.png" mode=""></image>
					</view>
					<text class="hot-text">新居开荒</text>
				</view>
				<view class="hot-item">
					<view class="hot-img" style="background: #63B8F8;">
						<image src="/static/icon8.png" mode=""></image>
					</view>
					<text class="hot-text">玻璃清洁</text>
				</view>

				<view class="hot-item">
					<view class="hot-img">
						<image src="/static/icon2.png" mode=""></image>
					</view>
					<text class="hot-text">家电清洁</text>
				</view>
				<view class="hot-item">
					<view class="hot-img" style="background: #6FDBA6;">
						<image src="/static/icon4.png" mode=""></image>
					</view>
					<text class="hot-text">家具养护</text>
				</view>
				<view class="hot-item">
					<view class="hot-img" style="background: #ACB3FB;">
						<image src="/static/icon5.png" mode=""></image>
					</view>
					<text class="hot-text">收纳整理</text>
				</view>
				<view class="hot-item">
					<view class="hot-img" style="background: #63B8F8;">
						<image src="/static/hot.png" mode=""></image>
					</view>
					<text class="hot-text">热门推荐</text>
				</view>

			</view>
			<view class="category">
				<view class="category-item">
					<image src="/static/huodong1.png" @click="toCate" mode=""></image>
					<image src="/static/kefu.png" @click="toCate" mode=""></image>
				</view>
			</view>
			<view class="hot-service">
				<view class="hot-service-header">
					<text class="hot-service-title">热卖服务</text>
					<text class="hot-service-more" @click="toCate">查看更多 ></text>
				</view>
				<view class="hot-service-grid">
					<view class="hot-service-card" v-for="item in hotServices" :key="item.id" @click="toCate">
						<image class="hot-service-image" :src="item.image" mode="aspectFill"></image>
						<text class="hot-service-name">{{ item.name }}</text>
						<view class="hot-service-price-row">
							<text class="hot-service-price">￥{{ item.price }}</text>
							<text class="hot-service-origin">￥{{ item.originPrice }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="review-section" v-if="reviewList.length > 0">
				<view class="review-header">
					<view class="review-title-wrap">
						<text class="review-title">用户评价</text>
						<text class="review-count">({{ reviewDisplayCount }})</text>
					</view>
				</view>
				<scroll-view class="review-scroll" scroll-x>
					<view class="review-list">
						<view class="review-card" v-for="item in reviewList" :key="item.id">
							<view class="review-user-row">
								<view class="review-avatar">大拇指</view>
								<text class="review-name">{{ item.visitorName }}</text>
							</view>
							<view class="review-tags" v-if="item.tagList.length > 0">
								<text class="review-tag" v-for="(tag, idx) in item.tagList" :key="idx">{{ tag }}</text>
							</view>
							<text class="review-content">{{ item.content }}</text>
							<view class="review-images" v-if="item.imageList.length > 0">
								<image class="review-image" v-for="(img, imgIdx) in item.imageList" :key="imgIdx" :src="img" mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import api from '../../utils/http.js'
export default {
  data() {
    return {
			statusBarHeight: 20,
      address: '定位中...',
      latitude: null,
      longitude: null,
      hotServices: [
				{ id: 1, name: '空调清洗', image: '/static/pack1.png', price: 138, originPrice: 158 },
				{ id: 2, name: '宠物保洁', image: '/static/pack2.png', price: 90, originPrice: 99 },
				{ id: 3, name: '日常保洁', image: '/static/pack3.png', price: 50, originPrice: 80 },
				{ id: 4, name: '深度保洁', image: '/static/pack4.png', price: 70, originPrice: 99 },
				{ id: 5, name: '新居开荒', image: '/static/pack5.png', price: 85, originPrice: 120 },
				{ id: 6, name: '公司保洁', image: '/static/pack6.png', price: 70, originPrice: 80 }
			],
      reviewList: [],
      indicatorDots: true,
      autoplay: true,
      interval: 10000,
      duration: 500,
      banner: [
        { id: 1, image: '/static/1.png' },
        { id: 2, image: '/static/2.png' }
      ],
      loadStatus: 'loadmore',
      flowList: [],
      list: []
    }
  },
	computed: {
		reviewDisplayCount() {
			const count = this.reviewList.length
			if (count <= 0) return '0'
			if (count >= 1000) return '999+'
			return `${count}+`
		}
	},
  onLoad() {
		const systemInfo = uni.getSystemInfoSync()
		this.statusBarHeight = systemInfo?.statusBarHeight || 20
		this.getCurrentAddress()
		this.getHomeReviewList()
  },
  onReachBottom() {
    this.loadStatus = 'loading'
    setTimeout(() => {
      this.loadStatus = 'loadmore'
    }, 1000)
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
			const list = String(tags)
				.split(/[,，|\s]+/)
				.map(item => item.trim())
				.filter(Boolean)
			return list.slice(0, 3)
		},
		normalizeImages(item) {
			const raw = item?.images || item?.imageUrls || item?.pics || item?.pictures || ''
			if (!raw) return []
			const list = Array.isArray(raw) ? raw : String(raw).split(/[,，]/)
			return list
				.map(url => String(url || '').trim())
				.filter(Boolean)
				.slice(0, 3)
		},
		async getHomeReviewList() {
			try {
				const token = uni.getStorageSync('Token') || '';
				const body = await api.createRequest({
					url: '/house/review/home/list',
					method: 'get',
					token
				})

				const list = Array.isArray(body?.data) ? body.data : []
				this.reviewList = list.slice(0, 8).map((item, idx) => ({
					id: item.id || idx,
					visitorName: this.normalizeName(item.visitorName),
					content: item.content || '用户未填写评价内容',
					tagList: this.normalizeTags(item.tags),
					imageList: this.normalizeImages(item)
				}))
			} catch (err) {
				console.error('获取首页评价失败:', err)
			}
		},
    async getCurrentAddress() {
      const timeoutId = setTimeout(() => {
        if (this.address === '定位中...') {
          this.address = '已定位'
        }
      }, 4000)
      try {
        const location = await this.getLocationWithPermission()
        this.latitude = location.latitude
        this.longitude = location.longitude
        const parsed = this.extractCityDistrict(location)
		console.log(parsed, 'parsed');
		
        this.address = parsed || '已定位'
      } catch (e) {
        this.address = '南充市-顺庆区'
      } finally {
        clearTimeout(timeoutId)
      }
    },
	toCate(){
		uni.switchTab({
			url: '/pages/category/category'
		})
	},
    getLocationWithPermission() {
      return new Promise((resolve, reject) => {
        const tryGetLocation = () => {
          this.getLocationInfo().then(resolve).catch(err => {
            if (String(err?.errMsg || '').indexOf('auth') !== -1 || String(err?.errMsg || '').indexOf('deny') !== -1) {
              uni.authorize({
                scope: 'scope.userLocation',
                success: () => this.getLocationInfo().then(resolve).catch(reject),
                fail: () => {
                  uni.openSetting({
                    success: openRes => {
                      if (openRes?.authSetting?.['scope.userLocation']) {
                        this.getLocationInfo().then(resolve).catch(reject)
                      } else {
                        reject(new Error('user denied location permission'))
                      }
                    },
                    fail: openErr => reject(openErr)
                  })
                }
              })
              return
            }
            reject(err)
          })
        }

        uni.getSetting({
          success: settingRes => {
            const auth = settingRes?.authSetting || {}
            if (auth['scope.userLocation'] === false) {
              uni.openSetting({
                success: openRes => {
                  if (openRes?.authSetting?.['scope.userLocation']) {
                    tryGetLocation()
                  } else {
                    reject(new Error('user denied location permission'))
                  }
                },
                fail: err => reject(err)
              })
              return
            }
            tryGetLocation()
          },
          fail: () => {
            tryGetLocation()
          }
        })
      })
    },
    getLocationInfo() {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: 'gcj02',
          geocode: true,
          isHighAccuracy: true,
          highAccuracyExpireTime: 5000,
          success: res => resolve(res),
          fail: err => reject(err)
        })
      })
    },
    parseCityDistrict(fullAddress) {
      if (!fullAddress) return ''
      const cleaned = String(fullAddress).replace(/\s/g, '')
      const match = cleaned.match(/(.*?市)(.*?(区|县|市))/)
      if (match && match[1] && match[2]) {
        return `${match[1]}-${match[2]}`
      }
      return ''
    },
    extractCityDistrict(location) {
      if (!location) return ''
      const city =
        location.city ||
        location?.address?.city ||
        location?.address_component?.city ||
        location?.ad_info?.city ||
        ''
      const district =
        location.district ||
        location?.address?.district ||
        location?.address_component?.district ||
        location?.ad_info?.district ||
        ''
      if (city && district) return `${city}-${district}`
      const full = location.address || location?.formattedAddress || location?.address?.formattedAddress || ''
      return this.parseCityDistrict(full)
    },
    call() {
      uni.makePhoneCall({ phoneNumber: '0817-6125226' })
    },
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    guid() {
      return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    },
		buildDetailCache(item) {
			const data = item || {}
			return {
				id: Number(data.id || 0),
				categoryId: Number(data.categoryId || 0),
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
    toDetail(item) {
			const payload = this.buildDetailCache(item)
			uni.setStorageSync('package_detail_cache', payload)
			const goods = encodeURIComponent(JSON.stringify(payload))
      uni.navigateTo({
        url: `/pkgGoods/detail?goods=${goods}`
      })
    },
    goCategory(id) {
      this.$utils.setStorage('category_tab_id', id)
      uni.switchTab({
        url: '/pages/category/category'
      })
    }
  }
}
</script>

<style>
	page {
		background: linear-gradient(180deg, #fff2d4 0%, #ffffff 72%);
	}
</style>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		
	}

	.middle{
		width: 100vw;
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
			color: #7a6e97;
		}

		.header-action {
			height: 56rpx;
			padding: 0 24rpx;
			border-radius: 28rpx;
			background: rgba(255, 255, 255, 0.8);
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4rpx 12rpx rgba(102, 85, 153, 0.08);

			text {
				font-size: 24rpx;
				color: #5f4a9e;
				font-weight: 600;
			}
		}

		.header-address {
			display: flex;
			align-items: center;
			margin-top: 26rpx;
			padding: 16rpx 20rpx;
			border-radius: 20rpx;
			background: rgba(255, 255, 255, 0.68);
			backdrop-filter: blur(6rpx);
		}

		.address-icon {
			width: 34rpx;
			height: 34rpx;
		}

		.address-text {
			margin-left: 12rpx;
			max-width: 360rpx;
			font-size: 24rpx;
			color: #4d4d4d;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.address-refresh {
			margin-left: auto;
			font-size: 22rpx;
			color: #7a6e97;
		}

		.header-search {
			margin-top: 18rpx;
			height: 74rpx;
			border-radius: 37rpx;
			background: #ffffff;
			display: flex;
			align-items: center;
			padding: 0 26rpx;
			box-shadow: 0 10rpx 24rpx rgba(91, 72, 138, 0.08);
		}

		.search-placeholder {
			font-size: 24rpx;
			color: #9c93b8;
		}
	}

	.header-fade {
		height: 40rpx;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
	}


	.banner {
		margin-top: 24rpx;

		image {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;
		}

		.swiper {
			height: 300rpx;
		}

		.swiper-item {
			display: block;
			height: 300rpx;
			line-height: 300rpx;
			text-align: center;
		}

		.swiper-list {
			margin-top: 40rpx;
			margin-bottom: 0;
		}

		.uni-common-mt {
			margin-top: 60rpx;
			position: relative;
		}

		.info {
			position: absolute;
			right: 20rpx;
		}

		.uni-padding-wrap {
			width: 550rpx;
			padding: 0 100rpx;
		}
	}

	.content{
		background: #f3f3f3;

		border-radius: 20rpx;
		.hot-box{
			margin: 0 auto;
			width: 90%;
			padding: 10rpx;
			background: #fff;
			display: flex;
			border-radius: 20rpx;
			align-items: center;
			flex-wrap: wrap;
			margin-top: -100rpx;
			z-index: 1;
			position: relative;
			justify-content: space-between;
			.hot-item{
				width: 24%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-top: 20rpx;
				.hot-img{
					width: 100rpx;
					height: 100rpx;
					border-radius: 40rpx;
					background: #FF6F74;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.hot-text{
					font-size: 24rpx;
					color: #333;
					margin-top: 12rpx;
				}
				image{
					width: 60rpx;
					height: 60rpx;
				}
			}
		}
	}

	.category {
		display: flex;
		flex-wrap: wrap;
		margin: 20rpx auto;
		width: 90%;

		.category-item {
			display: flex;
			align-items: center;
			width: 100%;
			margin-bottom: 20rpx;
			gap: 30rpx;
		}

		.category-item-info {
			display: flex;
			flex-direction: column;
		}


		image {
			width: 50%;
			height: 180rpx;
			border-radius: 30rpx;
		}

		text {
			font-size: 24rpx;
			color: #666666;
			margin-top: 16rpx;
		}
	}

	.hot-service {
		width: 90%;
		margin: 10rpx auto 20rpx;
		padding: 20rpx;
		background: #ffffff;
		border-radius: 20rpx;

		.hot-service-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 18rpx;
		}

		.hot-service-title {
			font-size: 34rpx;
			font-weight: 700;
			color: #222;
		}

		.hot-service-more {
			font-size: 24rpx;
			color: #888;
		}

		.hot-service-grid {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			gap: 18rpx 0;
		}

		.hot-service-card {
			width: 31.5%;
		}

		.hot-service-image {
			width: 100%;
			height: 150rpx;
			border-radius: 12rpx;
		}

		.hot-service-name {
			display: block;
			margin-top: 10rpx;
			font-size: 28rpx;
			color: #111;
			font-weight: 500;
		}

		.hot-service-price-row {
			display: flex;
			align-items: baseline;
			margin-top: 4rpx;
		}

		.hot-service-price {
			font-size: 34rpx;
			font-weight: 700;
			color: #ff2f4f;
		}

		.hot-service-origin {
			margin-left: 8rpx;
			font-size: 22rpx;
			color: #999;
			text-decoration: line-through;
		}
	}

	.review-section {
		width: 90%;
		margin: 10rpx auto 20rpx;
		padding: 20rpx;
		background: #ffffff;
		border-radius: 20rpx;

		.review-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 16rpx;
		}

		.review-title-wrap {
			display: flex;
			align-items: baseline;
		}

		.review-title {
			font-size: 34rpx;
			font-weight: 700;
			color: #222;
		}

		.review-count {
			margin-left: 8rpx;
			font-size: 24rpx;
			color: #8f8f8f;
		}

		.review-more {
			font-size: 24rpx;
			color: #888;
		}

		.review-scroll {
			width: 100%;
			overflow: hidden;
		}

		.review-list {
			display: inline-flex;
			gap: 18rpx;
			padding-bottom: 4rpx;
		}

		.review-card {
			width: 560rpx;
			min-width: 560rpx;
			flex: 0 0 560rpx;
			flex-shrink: 0;
			padding: 18rpx;
			background: #f7f7f7;
			border-radius: 14rpx;
			box-sizing: border-box;
		}

		.review-user-row {
			display: flex;
			align-items: center;
		}

		.review-avatar {
			width: 66rpx;
			height: 66rpx;
			border-radius: 50%;
			background: linear-gradient(180deg, #ffb3b8 0%, #ef8f96 100%);
			color: #fff;
			font-size: 16rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.review-name {
			margin-left: 14rpx;
			font-size: 30rpx;
			color: #111;
			font-weight: 600;
		}

		.review-tags {
			display: flex;
			gap: 10rpx;
			margin-top: 14rpx;
			flex-wrap: wrap;
		}

		.review-tag {
			padding: 6rpx 12rpx;
			font-size: 20rpx;
			color: #666;
			background: #ececec;
			border-radius: 6rpx;
		}

		.review-content {
			display: block;
			margin-top: 12rpx;
			font-size: 28rpx;
			color: #1f1f1f;
			line-height: 40rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 5;
			line-clamp: 5;
			height: 160rpx;
			overflow: hidden;
		}

		.review-images {
			display: flex;
			gap: 10rpx;
			margin-top: 14rpx;
		}

		.review-image {
			width: 160rpx;
			height: 120rpx;
			border-radius: 10rpx;
			background: #efefef;
			flex-shrink: 0;
		}
	}

	.bottom {
		width: 90%;
		margin: 0 auto;
	}


</style>


