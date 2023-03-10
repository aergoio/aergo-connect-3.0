<template>
  <component :is="tag" class="section-heading" :class="{ 'is-animated': animated }">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    tag: {
      type: String,
      default: 'h1',
    },
    animated: Boolean,
  },
});
</script>

<style lang="scss">
.section-heading {
  &.is-animated {
    animation: heading-appear 0.5s forwards 0.3s;
    opacity: 0;
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
@keyframes heading-appear {
  0% {
    transform: translateX(10px);
    opacity: 0.25;
  }
  100% {
    transform: translateX(0px);
    opacity: 1;
  }
}

.big-title {
  font-size: 1.5em;
  font-weight: 600;
  display: flex;
  justify-content: center;
}
.semi-big-title {
  font-size: calc(2 / 16) * 1rem;
  font-weight: 600;
}
</style>
