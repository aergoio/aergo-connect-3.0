<template>
  <div class="import_asset_backdrop">
    <div class="import_asset_wrapper">
      <div class="import_asset_header">Imported Asset Successfully!</div>
      <div class="import_asset_icon_wrapper">
        <img v-if="token.meta.image" class="import_asset_icon" :src="token.meta.image" />
        <Icon v-else :name="`defaultToken`" class="import_asset_icon" />
        <div class="import_asset_title">
          {{ `${token.meta.name}` + ' ' + '(' + `${token.meta.symbol}` + ')' }}
        </div>
      </div>

      <div class="import_asset_detail_wrapper">
        <div class="detail_wrapper">
          <div class="network_title">Network</div>
          <div class="network_state_wrapper">
            <div class="network_state" />
            <div class="network_text">{{ $store.state.accounts.network }}</div>
          </div>
        </div>

        <div class="token_type_detail_wrapper">
          <div>
            <div class="title">Type</div>
            <div class="content">{{ token.meta.type }}</div>
          </div>
          <div>
            <div class="title">Symbol</div>
            <div class="content">{{ token.meta.symbol }}</div>
          </div>
          <div>
            <div class="title">Decimal</div>
            <div class="content">{{ token.meta.decimals }}</div>
          </div>
        </div>

        <div class="address_wrapper">
          <div class="address_title">Address</div>
          <div class="address_content">{{ token.hash }}</div>
        </div>
      </div>

      <Button type="gradation" class="button" size="medium" @click="handleClick">OK</Button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Icon from '../icons/Icon.vue';
import Button from '../buttons/Button.vue';
import Identicon from '../content/Identicon.vue';
export default Vue.extend({
  components: { Icon, Button, Identicon },
  props: {
    token: {
      type: Object,
      default: {},
    },
  },
  mounted() {
    console.log(this.token);
  },
  methods: {
    handleClick() {
      this.$router.push({
        name: 'accounts-list',
        params: {
          address: this.$store.state.accounts.address,
        },
      });
    },
  },
});
</script>

<style lang="scss">
@import '../styles/mixin';

.import_asset_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
  .import_asset_wrapper {
    position: absolute;
    width: 317px;
    height: 400px;
    left: 29px;
    top: 78px;
    /* Grey/White */

    background: #ffffff;

    /* 05 */

    box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    @include flex__column__center;
    .import_asset_header {
      @include header__title;
    }
    .import_asset_icon_wrapper {
      @include flex__column__center;
      .import_asset_icon {
        margin-top: 21px;
        margin-bottom: 8px;
      }
      .import_asset_title {
        width: 269px;
        height: 24px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        /* identical to box height, or 150% */

        text-align: center;

        /* Grey/07 */

        color: #454344;
      }
    }
    .import_asset_detail_wrapper {
      width: 231px;
      .detail_wrapper {
        @include flex__row__center;
        justify-content: space-between;
        margin-top: 12px;
        .network_title {
          @include title__font;
        }
        .network_state_wrapper {
          @include flex__row__center;
          .network_state {
            @include network__active__state;
          }
          .network_text {
            @include network__text;
          }
        }
      }
    }
    .token_type_detail_wrapper {
      @include flex__row__center;
      justify-content: space-between;
      margin-top: 12px;
      .title {
        margin-top: 6px;
        @include title__font;
      }
      .content {
        @include content__font;
        margin-left: 0;
      }
    }

    .address_wrapper {
      margin-top: 12px;
      .address_title {
        @include title__font;
      }
      .address_content {
        @include content__font;
        word-break: break-all;
      }
    }
    .button {
      margin-top: 33px;
    }
  }
}
</style>
