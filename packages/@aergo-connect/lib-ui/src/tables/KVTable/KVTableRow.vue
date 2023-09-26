<template>
  <div class="tableItemwrapper">
    <dt>{{ label }}</dt>
    <dd :class="{ textEllipsis: textEllipsis }">
      <slot></slot>
    </dd>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'kv-table-row',
  props: {
    label: {
      type: String,
      required: true,
    },
    textEllipsis: Boolean,
  },

  mounted() {
    console.log(this.label, 'label,');
  },
});
</script>

<style lang="scss">
.tableItemwrapper {
  display: grid;
}
</style>
