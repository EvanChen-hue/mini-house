<template>
	<view class="container">
		<!-- 顶部商品信息 -->
		<view class="goods">
			<view class="goods-image">
				<image src="/static/one.png"></image>
			</view>
			<view class="goods-name"><text>四川眉山 爱媛38号果冻橙礼盒装</text></view>
		</view>
		<view class="comment">
			<view class="item star">
				<view class="label">评分</view>
				<view>
					<u-rate :count="5" v-model="star" inactive-color="#DCDEE0" active-color="#FBA808" :disabled="true"
						size="40"></u-rate>
				</view>
			</view>
			<view class="item image">
				<view class="label">图片</view>
				<view>
					<u-upload :action="action" :file-list="fileList" max-count="6" width="160" height="160"></u-upload>
				</view>
			</view>
			<view class="item content">
				<view class="label">评价</view>
				<view class="content-txt">
					<textarea name="" id="" cols="30" rows="10" :value="content"></textarea>
				</view>
			</view>
		</view>
		<view class="btn">
			<button>提交评价</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				star: 2,
				// 演示地址，请勿直接使用
				action: 'http://www.example.com/upload',
				fileList: [{
					url: '/static/one.png',
				}, {
					url: '/static/one.png',
				}],
				content: "入手很多，活动力度很大必须囤起来，橙子很好，水分足，甜度可口，没有酸感，大小很合适。"
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
	.goods {
		display: flex;
		align-items: center;
		background: #FFFFFF;
		padding: 10rpx 30rpx;

		.goods-image {
			image {
				width: 100rpx;
				height: 100rpx;
			}
		}

		.goods-name {
			margin-left: 10rpx;

			text {
				font-size: 26rpx;
				font-weight: 600;
				color: #333333;
			}
		}
	}

	.comment {
		background: #FFFFFF;
		border-radius: 20rpx;
		margin: 30rpx;
		padding: 40rpx 30rpx;

		.item {
			margin-bottom: 50rpx;
		}

		.label {
			font-size: 28rpx;
			color: #333333;
			margin-bottom: 20rpx;
		}

		.content-txt {
			border-radius: 20rpx;
			background: #F6F7F8;
			padding: 30rpx;

			textarea {
				font-size: 28rpx;
			}
		}
	}

	.btn {
		display: flex;
		align-items: center;
		margin: 30rpx;

		button {
			flex: 1;
			border-radius: 46rpx;
			background: #40AE36;
			color: #FFFFFF;
			font-size: 30rpx;
			line-height: 90rpx;
		}
	}
</style>
