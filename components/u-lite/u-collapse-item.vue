<template>
  <view class="u-collapse-item">
    <view class="head" @click="open = !open">{{ title }}</view>
    <view v-if="open" class="body"><slot></slot></view>
  </view>
</template>

<script>
export default {
  name: 'ULiteCollapseItem',
  props: { title: { type: String, default: '' } },
  data() { return { open: false } }
}
</script>

<style scoped>
.u-collapse-item { background: #fff; border-radius: 12rpx; margin-bottom: 16rpx; }
.head { padding: 20rpx 24rpx; font-weight: 600; }
.body { padding: 0 24rpx 20rpx; color: #666; }
</style>
