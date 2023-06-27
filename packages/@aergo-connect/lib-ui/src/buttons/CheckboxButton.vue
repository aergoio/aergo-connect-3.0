<template>
  <input
    type="checkbox"
    class="checkbox"
    :checked="checked"
    @click="checkboxFunc"
    @keyup.enter="enterKeyup"
  />
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {
    checkboxFunc() {
      this.$emit('check', !this.checked);
    },
    enterKeyup() {
      this.$emit('enterKeyup');
    },
  },
});
</script>

<style lang="scss">
@import '../styles/variables';

.checkbox {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #c9c9c9;
  cursor: pointer;
  accent-color: $Blue01;
  border-radius: 2pt;
}
</style>
