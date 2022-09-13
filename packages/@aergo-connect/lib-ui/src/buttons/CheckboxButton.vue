<template>
  <input type="checkbox" class="checkbox" :disabled="disabled" />
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {},
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
