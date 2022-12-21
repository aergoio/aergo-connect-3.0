<template>
  <ScrollView class="page">
    <!-- <Header :title="$store.state.accounts.network" network /> -->
    <div class="account_info_wrapper">
      <Icon :name="`back`" @click="handleGoBack" />
      <Identicon :text="$store.state.accounts.address" class="account_info_img" />
      <div class="account_info_content_wrapper">
        <div class="account_info_nickname_wrapper">
          <div class="account_info_nickname_text">
            {{ $store.state.accounts.nick }}
          </div>
          <div class="account_info_network_wrapper">
            <div :class="`account_info_network_circle ${$store.state.accounts.network}`" />
            <div class="account_info_network">
              {{ `AERGO ${$store.state.accounts.network.toUpperCase()}` }}
            </div>
          </div>
        </div>
        <div class="account_info_address_wrapper">
          <span class="account_info_address_text">{{
            `${$store.state.accounts.address.slice(0, 15)}...${$store.state.accounts.address.slice(
              -5,
            )}`
          }}</span>
        </div>
      </div>
    </div>
    <div class="request_content">
      <div class="icon-header">
        <Icon :name="`title-request`" :size="36" />
        <div class="title">Access public address</div>
      </div>
      <div class="description">
        The website at {{ request.origin }} wants to receive your active account's public address
        and chain ID.
      </div>
    </div>

    <template #footer>
      <Appear :delay="0.6">
        <ButtonGroup>
          <Button class="button" type="font-gradation" size="small" @click="cancel">
            <Icon class="button-icon" /><span>Cancel</span>
          </Button>
          <Button class="button" type="font-gradation" size="small" @click="confirm">
            <Icon class="button-icon" /><span>Confirm</span>
          </Button>
        </ButtonGroup>
      </Appear>
      <LoadingDialog
        :visible="statusDialogVisible"
        @close="statusDialogVisible = false"
        :state="dialogState"
      >
        <p v-if="dialogState !== 'error'">{{ statusText }}</p>
        <p v-else class="error">{{ statusText }}</p>
      </LoadingDialog>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { ScrollView, LoadingDialog } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup, ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { RequestMixin } from './mixin';
import Identicon from '@aergo-connect/lib-ui/src/content/Identicon.vue';
import { Header } from '@aergo-connect/lib-ui/src/layouts';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';
@Component({
  components: {
    ScrollView,
    LoadingDialog,
    Button,
    ContinueButton,
    ButtonGroup,
    Header,
    Heading,
    Icon,
    Identicon,
    Appear,
  },
})
export default class RequestAddress extends mixins(RequestMixin) {
  async confirmHandler() {
    const address = this.$store.state.accounts.address;
    let chainId = '';
    if (this.$store.state.accounts.network === 'mainnet') chainId = 'aergo.io';
    else chainId = `${this.$store.state.accounts.network}.aergo.io`;
    return {
      account: {
        address,
        chainId,
      },
    };
  }
  handleGoBack() {
    this.$router.push({ name: 'request-accounts-list' }).catch(() => {});
  }
}
</script>

<style lang="scss">
.request_content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .icon-header {
    display: flex;
    align-items: center;
  }
  .title {
    margin-top: 8px;
    margin-left: 10px;
    /* Headline/H3 */
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: -0.333333px;
    margin-bottom: 10px;

    /* Grey/08 */

    color: #231f20;
  }
  .description {
    margin-left: 24px;
    margin-right: 24px;
    /* Subtitle/S3 */

    font-family: 'Outfit';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    letter-spacing: -0.333333px;

    /* Grey/06 */

    color: #686767;
  }
}
.account_info_wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 375px;
  height: 104px;
  background: #ffffff;
  border: 1px solid #f6f6f6;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  .icon--back {
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 30px;
    cursor: pointer;
  }
  .account_info_img {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid transparent;
    border-radius: 8px;
    background-image: linear-gradient(#fff, #fff), linear-gradient(to right, #279ecc, #a13e99);
    background-origin: border-box;
    background-clip: content-box, border-box;
    svg {
      width: 44px;
      height: 44px;
    }
  }
  .account_info_content_wrapper {
    display: flex;
    flex-direction: column;
    .account_info_nickname_wrapper {
      display: flex;
      justify-content: space-between;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      margin-bottom: 8px;
      margin-left: 10px;
      /* width: 191px; */
      .account_info_network_wrapper {
        display: flex;
        align-items: center;
        .account_info_network_circle {
          background: #e4097d;
          width: 6px;
          height: 6px;
          margin-right: 5px;
          border-radius: 50%;
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
        .account_info_network {
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 300;
          font-size: 14px;
          line-height: 19px;
          text-align: center;
          letter-spacing: -0.333333px;
          color: #686767;
        }
      }
      .account_info_nickname_text {
        margin-right: 5px;
      }
      .account_info_nickname_input {
      }
      .account_info_nickname_button {
        cursor: pointer;
      }
    }
    .account_info_address_wrapper {
      width: 175px;
      height: 24px;
      background: #ecf8fd;
      border-radius: 25px;
      color: #279ecc;
      margin-left: 10px;
      .account_info_address_text {
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 300;
        font-size: 12px;
        line-height: 15px;
        /* identical to box height */
        letter-spacing: -0.333333px;
        width: 148.32px;
        height: 16px;
        margin-left: 7.9px;
      }
      .account_info_address_button {
        float: right;
        margin-right: 7.33px;
        cursor: pointer;
      }
    }
  }
}
</style>
