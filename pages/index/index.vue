<<<<<<< HEAD
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

				<view class="header-address" @click="getCurrentAddress">
					<image class="address-icon" src="/static/point.png"></image>
					<text class="address-text">{{address}}</text>
					<text class="address-refresh">重新定位</text>
				</view>
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
=======
﻿<template>
	<view class="container">
		<!-- 头部选择位置 -->
		<view class="header">
			<view class="header-address">
				<view class="header-address-left">
					<image src="/static/point.png"></image>
					<text>{{address}}</text>
					<image class="header-address-down-icon" src="/static/point.png"></image>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="middle">
				<!-- 轮播图 -->
				<view class="banner">
					<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay"
						:interval="interval" :duration="duration">
						<swiper-item v-for="item in banner" :key="item.id">
							<image :src="item.image"></image>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<view class="category">
				<view class="category-item" @click="call">
					<image src="/static/kf.png" style="width: 100%;" mode=""></image>
				</view>
				<view class="category-item">
					<image src="/static/tt1.png" @click="toCate" mode=""></image>
					<image src="/static/tt2.png" @click="toCate" mode=""></image>
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
				</view>
			</view>
			<!-- 列表 -->
			<view class="bottom" v-if="list.length > 0">
				<view class="goods">
					<view class="goods-item" v-for="item in list" :key="item.id" @click="toDetail(item)">
						<view class="left-item">
							<image class="goods-item-image" :src="'https://requests.taiyang.chat' + item.avatar"></image>
						</view>
						<view class="right-item">
							<view class="goods-item-name">
								{{item.name || ''}}
							</view>
							<view class="goods-item-tags">
								<text class="goods-item-tag" v-if="item.categoryName">{{item.categoryName}}</text>
								<text class="goods-item-age" v-if="item.age">{{item.age}}岁</text>
							</view>
							<view class="goods-item-intro">
								{{item.intro || ''}}
							</view>
							<view class="goods-item-price">
								￥{{item.price || '0.00'}}
							</view>
						</view>
				<!-- 		<view class="goods-item-price">
							<text class="goods-item-price-txt">￥{{item.price}}<text class="goods-item-price-unit">
									/{{item.unit}}</text></text>
							<image class="goods-item-shopcar-icon" src="/static/one.png"></image>
						</view> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import api from '../../utils/http.js'
export default {
  data() {
    return {
<<<<<<< HEAD
			statusBarHeight: 20,
=======
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
      address: '定位中...',
      latitude: null,
      longitude: null,
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
  onLoad() {
<<<<<<< HEAD
		const systemInfo = uni.getSystemInfoSync()
		this.statusBarHeight = systemInfo?.statusBarHeight || 20
=======
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
    this.getCurrentAddress()
    this.getData()
  },
  onReachBottom() {
    this.loadStatus = 'loading'
    setTimeout(() => {
      this.loadStatus = 'loadmore'
    }, 1000)
  },
  methods: {
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
    async getData() {
      let res = await api.createRequest({
        url: '/house/worker/list',
        method: 'get'
      })
			const records = Array.isArray(res?.data?.records) ? res.data.records : []
			this.list = records.filter(item => {
				const shelfStatus = typeof item.status !== 'undefined' ? Number(item.status) : Number(item.statue)
				return shelfStatus !== 0
			})
    },
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    guid() {
      return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    },
    toDetail(item) {
      const goods = encodeURIComponent(JSON.stringify(item || {}))
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
<<<<<<< HEAD
		background: linear-gradient(180deg, #f3ebff 0%, #ffffff 72%);
=======
		background: #F8F9FA;
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
	}
</style>

<style lang="scss" scoped>
<<<<<<< HEAD
	.container {
		min-height: 100vh;
		
	}

	.middle{
		width: 100vw;
	}

	.header-wrap {
		background: linear-gradient(180deg, #eee3ff 0%, #f7f2ff 60%, #ffffff 100%);
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
=======
	.content {
		padding: 40rpx;
	}

	.header {
		padding: 30rpx 40rpx;
		background-color: #FED12F;
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d

		.header-address {
			display: flex;
			align-items: center;
<<<<<<< HEAD
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
=======
			justify-content: space-between;

			.header-address-left {
				display: flex;
				align-items: center;

				.header-address-down-icon {
					width: 16rpx;
					height: 10rpx;
					margin-left: 10rpx;
				}

				image {
					width: 48rpx;
					height: 48rpx;
				}

				text {
					font-size: 30rpx;
					color: #333;
					margin-left: 6rpx;
				}
			}

			.header-address-right {
				display: flex;
				align-items: center;

				.header-address-scan-icon {
					margin-right: 20rpx;
				}

				image {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
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

<<<<<<< HEAD
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
		margin: 10rpx 40rpx 20rpx;
		border-radius: 20rpx;
=======
	.category {
		display: flex;
		flex-wrap: wrap;
		margin-top: 40rpx;
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d

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
<<<<<<< HEAD
			height: 200rpx;
=======
			height: 300rpx;
>>>>>>> b82c8976e75deb4638d7c2d0dbfdc908a3704f8d
			border-radius: 30rpx;
		}

		text {
			font-size: 24rpx;
			color: #666666;
			margin-top: 16rpx;
		}
	}

	.goods {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.goods-item {
			display: flex;
			align-items: flex-start;
			border-radius: 20rpx;
			position: relative;
			background: #FFFFFF;
			padding: 20rpx 20rpx 30rpx 20rpx;
			margin-top: 30rpx;
			width: 100%;
			gap: 20rpx;
			.left-item{
				width: 180rpx;
				height: 180rpx;
				border-radius: 4px;
			}
			.right-item{
				width: 380rpx;
			}
		}

		.goods-item-image {
			width: 100%;
			height: 100%;
			border-radius: 10rpx;
			overflow: hidden;
		}

		.goods-item-intro{
			font-size: 24rpx;
			color: #666666;
			margin-top: 12rpx;
			width: 100%;
			line-height: 28rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.goods-item-name {
			font-size: 32rpx;
			font-weight: 700;
			width: 100%;
			color: #333333;
			margin-top: 10rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			overflow: hidden;
		}

		.goods-item-tags {
			display: flex;
			align-items: center;
			gap: 12rpx;
			margin-top: 10rpx;

			.goods-item-tag {
				font-size: 20rpx;
				color: #40AE36;
				background: #EEF9ED;
				padding: 4rpx 12rpx;
				border-radius: 16rpx;
			}

			.goods-item-age {
				font-size: 22rpx;
				color: #666666;
			}
		}
		.goods-item-price {
			margin-top: 14rpx;
			color: #F55726;
			font-size: 32rpx;
			font-weight: 600;
			text-align: right;
			position: absolute;
			right: 20rpx;
			bottom: 30rpx;
		}
	}
</style>


