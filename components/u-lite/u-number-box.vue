<template>
  <view class="u-number-box">
    <button size="mini" class="btn" @click="change(-step)">-</button>
    <text class="num">{{ innerValue }}</text>
    <button size="mini" class="btn" @click="change(step)">+</button>
  </view>
</template>

<script>
export default {
  name: 'ULiteNumberBox',
  props: {
    value: { type: Number, default: 1 },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 99 },
    step: { type: Number, default: 1 },
    index: { type: [String, Number], default: '' },
    bgColor: { type: String, default: '' }
  },
  data() { return { innerValue: this.value } },
  watch: { value(v) { this.innerValue = Number(v) || this.min } },
  methods: {
    change(delta) {
      let next = this.innerValue + delta
      if (next < this.min) next = this.min
      if (next > this.max) next = this.max
      this.innerValue = next
      this.$emit('input', next)
      this.$emit('change', { value: next, index: this.index })
    }
  }
}
</script>

<style scoped>
.u-number-box { display: flex; align-items: center; }
.btn { width: 48rpx; height: 48rpx; line-height: 48rpx; padding: 0; margin: 0; }
.num { margin: 0 16rpx; min-width: 36rpx; text-align: center; }
</style>
