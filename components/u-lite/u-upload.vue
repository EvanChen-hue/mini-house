<template>
  <view class="u-upload">
    <image v-for="(f, i) in fileList" :key="i" :src="f.url || '/static/one.png'" class="img" mode="aspectFill"></image>
  </view>
</template>

<script>
export default {
  name: 'ULiteUpload',
  props: {
    action: { type: String, default: '' },
    fileList: { type: Array, default: () => [] },
    maxCount: { type: [String, Number], default: 9 },
    width: { type: [String, Number], default: 160 },
    height: { type: [String, Number], default: 160 }
  }
}
</script>

<style scoped>
.u-upload { display: flex; gap: 12rpx; flex-wrap: wrap; }
.img { width: 120rpx; height: 120rpx; border-radius: 8rpx; }
</style>
