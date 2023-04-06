<template>
  <div class="header">
    <div class="header__button left" :class="[buttonHide ? `button__hide` : ``]">
      <Button :to="to" @click="buttonClick">
        <Icon :name="`${button}`" class="button-icon" />
      </Button>
    </div>
    <h3 v-if="title && !network">{{ title }}</h3>
    <NetworkHeader
      :class="isNetworkError ? 'ml20' : ''"
      v-if="network"
      @networkModalClick="networkModalClick"
    />
    <Icon class="network-error" v-if="isNetworkError" :name="`warning2`" :size="30" />
    <div class="header__button right" :class="[skip ? 'skip__on' : refresh ? 'refresh__on' : '']">
      <Icon class="refresh" name="refresh" @click="refreshClick" />
      <a type="button" class="skip__btn" @click="skipClick">Skip</a>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Icon from '../icons/Icon.vue';
import { RawLocation } from 'vue-router';
import Button from '../buttons/Button.vue';
import NetworkHeader from '../layouts/NetworkHeader.vue';
export default Vue.extend({
  components: { Icon, Button, NetworkHeader },

  props: {
    button: {
      type: String,
      default: '',
    },
    buttonHide: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    skip: {
      type: Boolean,
      default: false,
    },
    refresh: {
      type: Boolean,
      default: false,
    },
    to: {
      type: [String, Object] as PropType<RawLocation>,
    },
    network: {
      type: Boolean,
      default: false,
    },
    isNetworkError: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    buttonClick() {
      if (this.button === 'hamburger') {
        this.$emit('hamburgerClick');
      }
      if (this.button === 'back') {
        this.$emit('backClick');
      }
    },
    networkModalClick() {
      this.$emit('networkModalClick');
    },
    refreshClick() {
      this.$emit('refreshClick');
    },
    skipClick() {
      this.$emit('skipClick');
    },
  },
});
</script>

<style lang="scss">
@import '../styles/variables';

.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  background: #ffffff;
  /* box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.05); */
  position: relative;
  z-index: 1;
  h3 {
    margin: 0;
    font-weight: 500;
    font-size: 20px;
    line-height: 20px;
    color: $Grey07;
    margin-left: 12px;
  }
  .ml20 {
    margin-left: 20px;
  }
  .header__button {
    width: 30px;
    /* height: 30px; */
    position: absolute;
    top: 50%;
    transform: translate(0%, -50%);
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &.left {
      left: 20px;
      &.button__hide {
        visibility: hidden;
      }

      .button-icon {
        &:hover {
          transform: scale(1.2);
          transition: 0.2s;
        }
      }
    }
    .icon--back {
      line-height: 0;
      &:hover {
        transform: scale(1.3);
        transition: 0.2s;
      }
    }
    &.right {
      /* top: 60%; */
      right: 20px;
      display: none;

      &.skip__on {
        display: inline;
        .refresh {
          display: none;
        }
        .skip__btn {
          visibility: visible;
          &:hover {
            transform: scale(1.3);
            transition: 0.4s;
          }
        }
      }

      &.refresh__on {
        display: inline;
        right: 10px;
        .right__icon {
          visibility: visible;
        }
        .refresh {
          display: inline;
          &:hover {
            transform: scale(1.3);
            transition: 0.4s;
          }
        }
        .skip__btn {
          display: none;
        }
      }
    }
  }

  .skip__btn {
    all: unset;
    font-weight: 400;
    font-size: 15px;
    line-height: 19px;
    color: #9c9a9a;
    cursor: pointer;
    visibility: hidden;
  }
}
</style>
