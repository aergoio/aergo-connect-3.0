<template>
  <div class="nav__button" @click="navigate">
    <div class="nav-button-icon">
      <Icon :name="`${img}`" />
    </div>
    <span class="address">{{ title }}</span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Icon from '../icons/Icon.vue';
import { RawLocation } from 'vue-router';
import Button from './Button.vue';

export default Vue.extend({
  components: { Icon, Button },
  props: {
    img: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    to: {
      type: [String, Object] as PropType<RawLocation>,
    },
  },
  methods: {
    navigate() {
      if (this.to) {
        this.$router.push(this.to).catch(() => {});
      } else {
        this.$emit('click');
      }
    },
  },
});
</script>

<style lang="scss">
@import '../styles/variables';
.nav__button {
  display: flex;
  align-items: center;
  height: 44px;
  cursor: pointer;
  max-width: 233px;
  &:hover {
    background: #f6f6f6;
    border-radius: 4px;
    color: #279ecc;
    svg {
      filter: invert(59%) sepia(89%) saturate(1935%) hue-rotate(163deg) brightness(87%)
        contrast(82%);
    }
  }
  .nav-button-icon {
    margin: 0 13px 0 13px;
  }
}
</style>
