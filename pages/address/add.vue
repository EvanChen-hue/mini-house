<template>
	<view class="container">
		<view class="content">
			<form @submit="formSubmit">
				<view class="user">
					<view class="form-item">
						<view class="item-lable">我的姓名</view>
						<view class="item-input">
							<input name="name" v-model="form.name" placeholder="请输入我的姓名" />
						</view>
					</view>
					<view class="form-item">
						<view class="item-lable">手机号</view>
						<view class="item-input">
							<input name="phone" v-model="form.phone" placeholder="请输入手机号" />
						</view>
					</view>
				</view>

				<view class="address">
					<view class="form-item">
						<view class="item-lable">区县</view>
						<picker mode="selector" :range="districts" :value="selectedDistrictIndex" @change="onDistrictChange">
							<view class="item-input">
								<input name="address" :value="address" placeholder="请选择区县" readonly />
							</view>
						</picker>
					</view>
					<view class="form-item">
						<view class="item-lable">详细地址</view>
						<view class="item-input">
							<input name="house" v-model="form.house" placeholder="请输入详细地址" />
						</view>
					</view>
				</view>
				<view class="btn">
					<button form-type="submit">{{ isEdit ? '保存修改' : '提交' }}</button>
				</view>

		</form>
		</view>
	</view>
</template>

<script>
import api from '../../utils/http.js'

	export default {
		data() {
			return {
				id: 0,
				isEdit: false,
				address: '顺庆区',
				selectedDistrictIndex: 0,
				districts: ['顺庆区', '高坪区', '嘉陵区', '南部县', '西充县', '仪陇县', '蓬安县', '营山县'],
				form: {
					name: '',
					phone: '',
					house: ''
				},
				isDefault: 0,
				createTime: ''
			}
		},
		onLoad(options) {
			if (!options || !options.id) return;
			this.isEdit = true;
			this.id = Number(options.id) || 0;
			this.form.name = decodeURIComponent(options.consignee || '');
			this.form.phone = decodeURIComponent(options.phone || '');
			this.form.house = decodeURIComponent(options.detailAddress || '');
			this.address = decodeURIComponent(options.district || '顺庆区') || '顺庆区';
			this.isDefault = Number(options.isDefault || 0);
			this.createTime = decodeURIComponent(options.createTime || '');

			const index = this.districts.findIndex((item) => item === this.address);
			this.selectedDistrictIndex = index >= 0 ? index : 0;
			if (index < 0) {
				this.address = this.districts[0];
			}
		},
		methods: {
			// 区县选择
			onDistrictChange(e) {
				this.selectedDistrictIndex = e.detail.value;
				this.address = this.districts[this.selectedDistrictIndex];
			},
			// 表单提交
			async formSubmit() {
				const formdata = this.form;

				if (formdata.name == '') {
					this.$utils.toastTip('请输入姓名');
					return;
				}

				if (!this.$utils.checkPhone(formdata.phone)) {
					this.$utils.toastTip('手机号格式错误');
					return;
				}

				const district = this.address;
				if (!district) {
					this.$utils.toastTip('请选择区县');
					return;
				}

				if (formdata.house == '') {
					this.$utils.toastTip('请填写详细地址');
					return;
				}

				const payload = {
					id: this.isEdit ? this.id : 0,
					consignee: formdata.name,
					phone: formdata.phone,
					province: '四川省',
					city: '南充市',
					district: district,
					detailAddress: formdata.house,
					isDefault: this.isDefault,
					createTime: this.createTime
				};

				try {
					let token = uni.getStorageSync('Token');
					const url = this.isEdit ? '/house/address/update' : '/house/address/add';
					const res = await api.createRequest({
						url,
						method: this.isEdit ? 'put' : 'post',
						token
					}, payload);
					if (res && Number(res.code) === 200) {
						this.$utils.toastTip(res.msg || (this.isEdit ? '修改成功' : '添加成功'), 'success');
						setTimeout(() => {
							const pages = getCurrentPages();
							if (pages.length > 1) {
								uni.navigateBack({
									delta: 1
								});
								return;
							}
							uni.redirectTo({
								url: '/pages/address/address'
							});
						}, 1200);
						return;
					}
					this.$utils.toastTip(res.msg || (this.isEdit ? '修改失败，请重试' : '添加失败，请重试'));
				} catch (err) {
					console.error(this.isEdit ? '地址修改失败：' : '地址添加失败：', err);
					this.$utils.toastTip(this.isEdit ? '修改失败，请重试' : '添加失败，请重试');
				}
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
	.container {
		margin: 20rpx 30rpx;
	}

	.content {
		display: flex;
		align-items: center;

		.user {
			background: #FFFFFF;
			padding: 32rpx;
			border-radius: 20rpx;
			margin-bottom: 22rpx;
		}

		.form-item {
			display: inline-block;
			width: 100%;
			margin-bottom: 40rpx;

			.item-lable {
				font-size: 28rpx;
				font-weight: 600;
			}

			.item-input {
				margin-top: 10rpx;
				background: #F6F7F8;
				border-radius: 20rpx;

				input {
					font-size: 28rpx;
					padding: 28rpx 40rpx;
				}
			}
		}

		.address {
			background: #FFFFFF;
			padding: 32rpx;
			border-radius: 20rpx;
			margin-bottom: 22rpx;
		}

		.tags {
			margin-top: 34rpx;
			background: #FFFFFF;
			padding: 32rpx;
			border-radius: 20rpx;
			margin-bottom: 22rpx;

			text {
				font-size: 28rpx;
				width: 160rpx;
				margin-right: 24rpx;
				color: #333333;
				padding: 10rpx 50rpx;
				border-radius: 16rpx;
				background: #F8F9FA;
			}

			.tags-active {
				color: #333333;
				font-weight: 600;
				background: #D9EFD7;
			}
		}
	}

	.btn {
		margin-top: 70rpx;
		width: 100%;

		button {
			flex: 1;
			border-radius: 46rpx;
			background: #40AE36;
			color: #FFFFFF;
			font-size: 30rpx;
			padding: 12rpx 0rpx;
		}
	}
</style>