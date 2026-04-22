<template>
  <view class="u-rate">
    <text
      v-for="i in count"
      :key="i"
      class="star"
      :style="{ color: i <= innerValue ? activeColor : inactiveColor, fontSize: addUnit(size) }"
      @click="onTap(i)"
    >★</text>
  </view>
</template>

<script>
export default {
  name: 'ULiteRate',
  props: {
    value: { type: Number, default: 0 },
    count: { type: Number, default: 5 },
    disabled: { type: Boolean, default: false },
    activeColor: { type: String, default: '#f7ba2a' },
    inactiveColor: { type: String, default: '#dcdfe6' },
    size: { type: [Number, String], default: 28 }
  },
  data() {
    return { innerValue: this.value }
  },
  watch: {
    value(v) { this.innerValue = Number(v) || 0 }
  },
  methods: {
    addUnit(v) { return typeof v === 'number' ? `${v}rpx` : v },
    onTap(v) {
      if (this.disabled) return
      this.innerValue = v
      this.$emit('input', v)
      this.$emit('change', v)
    }
  }
}
</script>

<style scoped>
.u-rate { display: flex; align-items: center; }
.star { margin-right: 4rpx; }
</style>
