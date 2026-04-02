<template>
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
		background: #F8F9FA;
	}
</style>

<style lang="scss" scoped>
	.content {
		padding: 40rpx;
	}

	.header {
		padding: 30rpx 40rpx;
		background-color: #FED12F;

		.header-address {
			display: flex;
			align-items: center;
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

	.category {
		display: flex;
		flex-wrap: wrap;
		margin-top: 40rpx;

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
			height: 300rpx;
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


