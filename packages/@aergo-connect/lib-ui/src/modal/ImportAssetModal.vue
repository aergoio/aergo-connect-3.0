<template>
  <div class="import_asset_backdrop">
    <div class="import_asset_wrapper">
      <div class="import_asset_header">
        Imported {{ token?.meta?.type === 'ARC1' ? `Asset` : `NFT` }} Successfully!
      </div>
      <div class="import_asset_icon_wrapper">
        <img v-if="token?.meta?.image" class="import_asset_icon" :src="token?.meta?.image" />
        <Icon v-else :name="`defaultToken`" class="import_asset_icon" />
        <div class="import_asset_title">
          {{ `${token?.meta?.name}` + ' ' + '(' + `${token?.meta?.symbol}` + ')' }}
        </div>
        <div v-if="nftData?.token_id" class="import_asset_title inventory_id">
          {{ nftData?.token_id }}
        </div>
      </div>

      <div class="import_asset_detail_wrapper">
        <div class="detail_wrapper">
          <div class="network_title">Network</div>
          <div class="network_state_wrapper">
            <div :class="`network_state ${$store.state.accounts.network}`" />
            <div class="network_text">
              {{ `AERGO ${$store.state.accounts.network.toUpperCase()}` }}
            </div>
          </div>
        </div>

        <div class="token_type_detail_wrapper">
          <div>
            <div class="title">Type</div>
            <div class="content">{{ token?.meta?.type }}</div>
          </div>
          <div>
            <div class="title">Symbol</div>
            <div class="content">{{ token?.meta?.symbol }}</div>
          </div>
          <div>
            <div class="title">Decimal</div>
            <div class="content">{{ token?.meta?.decimals }}</div>
          </div>
        </div>

        <div class="address_wrapper">
          <div class="address_title">Address</div>
          <div class="address_content">{{ token?.hash }}</div>
        </div>
      </div>

      <Button type="primary" class="button" size="medium" @click="handleClick" hover>OK</Button>
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
    nftData: {
      type: Object,
      default: {},
    },
  },
  methods: {
    handleClick() {
      this.$store.commit('ui/clearInput', { key: 'importAsset' });
      this.$router.push({
        name: 'accounts-list',
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
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  .import_asset_wrapper {
    padding-top: 20px;
    padding-bottom: 20px;
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
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        /* identical to box height, or 150% */

        text-align: center;

        /* Grey/07 */

        color: #454344;
        &.inventory_id {
          background: linear-gradient(133.72deg, #279ecc 0%, #e4097d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          word-break: break-all;
        }
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
            width: 6px;
            height: 6px;
            background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
            border-radius: 50%;
            margin-right: 2px;
            &.mainnet {
              background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
            }
            &.testnet {
              background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
            }
            &.alpha {
              background: linear-gradient(133.72deg, #84ceeb 0%, #f894c8 100%);
            }
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
