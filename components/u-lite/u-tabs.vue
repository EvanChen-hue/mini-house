<template>
  <scroll-view class="u-tabs" scroll-x>
    <view class="row">
      <view
        v-for="(item, i) in list"
        :key="i"
        class="tab"
        :class="{ active: i === current }"
        @click="$emit('change', i)"
      >{{ item.name || item }}</view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: 'ULiteTabs',
  props: {
    list: { type: Array, default: () => [] },
    current: { type: Number, default: 0 },
    isScroll: { type: Boolean, default: true }
  }
}
</script>

<style scoped>
.u-tabs { background: #fff; white-space: nowrap; }
.row { display: flex; }
.tab { padding: 20rpx 26rpx; color: #666; }
.tab.active { color: #40ae36; font-weight: 600; }
</style>
