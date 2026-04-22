<script>
	export default {
		onLaunch: function() {
			// #ifdef MP-WEIXIN
			this.ensurePrivacyAgreement();
			// #endif
		},
		onShow: function() {

		},
		onHide: function() {

		},
		methods: {
			// 微信审核常见要求：首次进入展示隐私协议同意弹窗
			ensurePrivacyAgreement() {
				const agreed = uni.getStorageSync('privacy_agreed_v1');
				if (agreed) {
					this.requestWxPrivacyAuthorize();
					return;
				}
				uni.showModal({
					title: '服务与隐私协议',
					content: '欢迎使用本小程序。请阅读并同意《服务协议》与《隐私保护指引》后继续使用。',
					confirmText: '同意并继续',
					cancelText: '暂不同意',
					success: (res) => {
						if (res.confirm) {
							uni.setStorageSync('privacy_agreed_v1', true);
							this.requestWxPrivacyAuthorize();
							return;
						}
						uni.showToast({
							title: '需同意协议后方可使用',
							icon: 'none'
						});
					}
				});
			},
			requestWxPrivacyAuthorize() {
				// #ifdef MP-WEIXIN
				if (typeof wx === 'undefined') return;
				if (!wx.requirePrivacyAuthorize) return;
				wx.requirePrivacyAuthorize({
					success: () => {},
					fail: () => {}
				});
				// #endif
			}
		}
	}
</script>

<style lang="scss">
page {
	min-height: 100%;
	background: linear-gradient(180deg, #fff2d4 0%, #ffffff 72%);
	background-repeat: no-repeat;
	background-attachment: fixed;
}

uni-page-body {
	min-height: 100%;
	background: transparent;
}

/* #ifdef H5 */
body {
	background: linear-gradient(180deg, #fff2d4 0%, #ffffff 72%);
}
/* #endif */
</style>
