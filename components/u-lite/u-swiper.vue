<template>
  <swiper class="u-swiper" :style="{ height: addUnit(height) }" :autoplay="autoplay" :indicator-dots="true" circular>
    <swiper-item v-for="(item, idx) in list" :key="idx">
      <image :src="getSrc(item)" mode="aspectFill" class="img"></image>
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  name: 'ULiteSwiper',
  props: {
    list: { type: Array, default: () => [] },
    height: { type: [String, Number], default: 300 },
    autoplay: { type: Boolean, default: false },
    mode: { type: String, default: '' },
    indicatorPos: { type: String, default: '' }
  },
  methods: {
    addUnit(v) { return typeof v === 'number' ? `${v}rpx` : v },
    getSrc(item) {
      if (typeof item === 'string') return item
      return (item && (item.image || item.url)) || '/static/one.png'
    }
  }
}
</script>

<style scoped>
.u-swiper { width: 100%; }
.img { width: 100%; height: 100%; }
</style>
