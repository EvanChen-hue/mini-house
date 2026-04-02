<template>
  <view class="u-empty"><text>{{ text || '暂无数据' }}</text></view>
</template>

<script>
export default {
  name: 'ULiteEmpty',
  props: {
    text: { type: String, default: '' },
    mode: { type: String, default: '' }
  }
}
</script>

<style scoped>
.u-empty { padding: 24rpx; text-align: center; color: #999; }
</style>
