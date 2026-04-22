<template>
  <view v-if="value" class="u-picker-mask" @click="close">
    <view class="u-picker" @click.stop>
      <view class="actions">
        <text @click="close">取消</text>
        <text class="ok" @click="confirm">确定</text>
      </view>
      <view class="body">请选择地区</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ULitePicker',
  props: {
    value: { type: Boolean, default: false },
    mode: { type: String, default: 'selector' }
  },
  methods: {
    close() { this.$emit('input', false) },
    confirm() {
      this.$emit('confirm', {
        province: { label: '北京市' },
        city: { label: '北京市' },
        area: { label: '海淀区' }
      })
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped>
.u-picker-mask { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 9999; }
.u-picker { position: absolute; left: 0; right: 0; bottom: 0; background: #fff; border-radius: 20rpx 20rpx 0 0; }
.actions { display: flex; justify-content: space-between; padding: 20rpx 24rpx; }
.ok { color: #40ae36; }
.body { padding: 30rpx 24rpx 40rpx; color: #666; }
</style>
