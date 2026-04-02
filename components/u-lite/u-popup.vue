<template>
  <view v-if="value" class="u-popup-mask" @click="close">
    <view class="u-popup" :class="modeClass" @click.stop>
      <view v-if="closeable" class="close" @click="close">x</view>
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ULitePopup',
  props: {
    value: { type: Boolean, default: false },
    mode: { type: String, default: 'center' },
    closeable: { type: Boolean, default: false },
    borderRadius: { type: [String, Number], default: '' }
  },
  computed: {
    modeClass() { return this.mode === 'bottom' ? 'bottom' : 'center' }
  },
  methods: {
    close() { this.$emit('input', false) }
  }
}
</script>

<style scoped>
.u-popup-mask { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 9999; }
.u-popup { position: absolute; left: 50%; transform: translateX(-50%); background: #fff; min-width: 70%; }
.u-popup.center { top: 50%; transform: translate(-50%, -50%); border-radius: 12rpx; }
.u-popup.bottom { left: 0; right: 0; bottom: 0; transform: none; width: 100%; border-radius: 20rpx 20rpx 0 0; }
.close { position: absolute; right: 20rpx; top: 10rpx; color: #999; }
</style>
