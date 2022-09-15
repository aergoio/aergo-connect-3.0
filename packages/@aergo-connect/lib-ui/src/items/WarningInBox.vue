<template>
  <div class="warningInBox-wrapper">
    <img src="../icons/img/danger.svg" alt="" width="24px" />
    <p>{{ error }}</p>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
export default Vue.extend({
  props: {
    error: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
});
</script>

<style lang="scss">
@import '../styles/variables';
.warningInBox-wrapper {
  display: flex;
  align-items: center;
  width: 327px;
  min-height: 60px;
  background: $Pink03;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
  img {
    margin: 0px 10px;
  }
  p {
    font-weight: 300;
    font-size: 14px;
    line-height: 18px;
    color: #e4097d;
    // width: 277px;
    margin: 0;
  }
}
</style>
