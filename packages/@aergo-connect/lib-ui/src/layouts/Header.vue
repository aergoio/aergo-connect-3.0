<template>
  <div class="header">
    <div class="header__button left" :class="[buttonHide ? `button__hide` : ``]" @click="goBack">
      <Icon :name="`${button}`" :to="to" />
    </div>
    <h3>{{ title }}</h3>
    <div class="header__button right" :class="[skip ? 'skip__on' : refresh ? 'refresh__on' : '']">
      <Icon class="refresh" name="refresh" />
      <a type="button" class="skip__btn">Skip</a>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Icon from '../icons/Icon.vue';
import { RawLocation } from 'vue-router';

export default Vue.extend({
  components: { Icon },

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
  },
  methods: {
    goBack() {
      if (typeof this.to !== 'undefined' && this.to && typeof this.$router !== 'undefined') {
        this.$router.push({ name: this.to, params: this.$router.history.current.params });
      } else {
        console.log(this.$router);
        console.log(this.$store.state.ui.route.previousPath);
        this.$router.push({
          path: this.$store.state.ui.route.previousPath,
          params: this.$router.history.current.params,
        });
      }
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
  height: 50px;
  background: #ffffff;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.05);
  position: relative;

  h3 {
    margin: 0;
    font-weight: 500;
    font-size: 20px;
    line-height: 20px;
    color: $Grey07;
    margin-left: 12px;
  }

  .header__button {
    width: 30px;
    height: 30px;
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
    }

    &.right {
      top: 60%;
      right: 20px;
      display: none;

      &.skip__on {
        display: inline;
        .refresh {
          display: none;
        }
        .skip__btn {
          visibility: visible;
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
