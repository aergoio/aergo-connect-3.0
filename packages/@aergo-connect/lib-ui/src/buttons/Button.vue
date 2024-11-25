<template>
  <button
    class="button"
    :class="classes"
    :disabled="disabled"
    :hover="hover"
    :size="size"
    @click="handleClick"
    @keyup.enter="handleClick"
  >
    <template v-if="loading">
      <LoadingIndicator />
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ButtonType, ButtonTypes, ButtonSize, ButtonSizes } from './types';
import LoadingIndicator from '../icons/LoadingIndicator.vue';
import { RawLocation } from 'vue-router';

/**
 * Either handle click event by `@click` or pass a router location into the `to` prop.
 */
export default Vue.extend({
  name: 'Button',
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: ButtonTypes[0],
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: ButtonSizes[0],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    to: {
      type: [String, Object] as PropType<RawLocation>,
    },
    hover: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LoadingIndicator,
  },
  beforeUpdate() {
    if (this.loading) {
      // Animate into the loading state
      const $el = this.$el as HTMLElement;
      $el.style.minWidth = $el.clientWidth + 'px';
      $el.style.width = $el.clientWidth + 'px';
      setTimeout(() => {
        // $el.style.minWidth = '50px';
        // $el.style.width = 'auto';
      }, 300);
    }
  },
  computed: {
    classes(): string[] {
      return [
        `button-type-${this.type}`,
        `button-size-${this.size}`,
        this.loading ? `button-loading` : '',
        this.type.match(/^primary/) ? 'inverted-colors' : '',
        this.hover ? `hover` : '',
      ];
    },
  },
  methods: {
    handleClick() {
      if (typeof this.to !== 'undefined' && this.to && typeof this.$router !== 'undefined') {
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

.button {
  /* Typography */
  font-weight: 500;
  font-size: calc((17 / 16) * 1em);
  /* Sizing */
  box-sizing: border-box;
  min-height: 30px;
  line-height: 3em;
  //  padding: 0.5em 2.5em;
  height: 48px;
  /* Borders and background */
  outline: none;
  border: 0;
  /* border-radius: 3px; */
  background-color: transparent;
  border-radius: 8px;
  /* border-radius: 4px; */
  /* Content alignment */
  display: flex;
  text-decoration: none;
  text-align: center;
  align-items: center;
  // justify-content: space-around;
  justify-content: center;
  /* Behavior */
  cursor: pointer;
  transition: min-width 0.35s ease-in;

  img {
    margin-right: 13px;
  }
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.75;
  }
  &.button-size-small {
    width: 140px;
  }
  &.button-size-medium {
    width: 289px;
    height: 44px;
  }
  &.button-size-medium-outline {
    width: 285px;
    height: 40px;
  }
  &.button-size-large {
    width: 327px;
    height: 48px;
  }
  &.button-size-large-outline {
    width: 323px;
    height: 44px;
  }
  &.button-type-primary {
    background-color: $Blue01;
    color: #fff;

    &[disabled] {
      background: $Grey04;
      opacity: 0.3;
    }
    &.hover:hover {
      background: $gradation04;
    }
  }

  .button-type-primary-outline {
    position: relative;
    color: $Blue01;
    border: 2px solid transparent; // 기본 보더를 투명하게 설정
    border-radius: 8px;
    background-color: transparent;
    overflow: hidden;
    cursor: pointer;

    // 그라데이션 보더 구현을 위한 ::before 가상 요소
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
      z-index: -2;
      border-radius: inherit;
    }

    // 버튼 내부 배경을 위한 ::after 가상 요소
    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      background-color: #fff; // 버튼 내부 색상
      z-index: -1;
      border-radius: 6px; // 보더 두께를 뺀 값
      transition: background-color 0.3s;
    }

    // 텍스트 스타일
    span {
      position: relative;
      z-index: 1;
      color: $Blue01;
    }

    // 호버 시 효과
    &:hover {
      &::after {
        background-color: transparent; // 내부 배경을 투명하게
      }

      span {
        background: linear-gradient(124.51deg, #279ecc, #a13e99);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  &.button-type-primary-outline {
    color: $Blue01;
    border-radius: 8px;
    background: linear-gradient(#fff, #fff) padding-box,
      linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%) border-box;
    border: 2px solid transparent;
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;

    &.hover:hover {
      span {
        background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  &.button-type-secondary {
    background-color: $Pink01;
    color: #fff;
    box-shadow: none;
    &.hover:hover {
      background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
    }
  }
  &.button-type-gradation {
    background: $gradation01;
    color: #fff;
    box-shadow: none;
  }
  &.button-type-font-gradation {
    background: $white;
    color: $gradation04;
    box-shadow: none;
  }
  &.button-type-secondary-outline {
    color: $Pink01;
    border: 2px solid $Pink01;
    &.hover:hover {
      border: 2px solid transparent;
      /* border-radius: 4px; */
      border-image: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
      border-image-slice: 1;
      background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  &.button-type-gradation {
    background: $gradation04;
    color: #fff;
  }
  &.button-type-font-gradation {
    background: $gradation04;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    /* background: #ffffff; */
    /* Primary/Blue03 */

    border: 1px solid #ecf8fd;
    /* shadow/02 */

    box-shadow: 0px 4px 13px rgba(119, 153, 166, 0.25);
    /* border-radius: 4px; */
    &.hover:hover {
      background: $gradation04;
    }
    &.hover:hover span {
      color: #fff;
      -webkit-text-fill-color: #fff;
    }
    &.hover:hover path {
      color: #fff;
      fill: #fff;
      -webkit-text-fill-color: #fff;
    }
  }
  &.button-type-next {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 18px 8px 24px;
    background-color: #eff5f6;
    color: #1085b2;
  }
  &.button-type-next:hover {
    background-color: #d9e9ef;
  }
  &.button-type-icon,
  &.button-type-primary-icon {
    box-shadow: none;
    padding: 0;
    line-height: initial;
    min-height: 0;
  }
  &.button-type-primary-icon {
    background-color: #ff337f;
    border-radius: 100%;
    line-height: 56px;
    min-height: 56px;
    width: 56px !important;
    &[disabled] {
      opacity: 0.5;
    }
  }
  &[disabled] {
    // cursor: not-allowed;
    background: $Grey02;
    color: #fff;
    outline-color: #fff;
    opacity: 0.3;
  }
}
</style>
