<template>
  <ScrollView class="page">
    <div class="account_info_wrapper">
      <Identicon :text="$store.state.accounts.address" class="account_info_img" />
      <div class="account_info_content_wrapper address">
        <div class="account_info_nickname_wrapper address">
          <div class="account_info_network_wrapper">
            <div class="account_info_network">
              {{ `${$store.state.accounts.chainId.toUpperCase()}` }}
            </div>
          </div>
          <div class="account_info_nickname_text">
            {{ $store.state.accounts.nick }}
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
      <div class="header">
        <div class="title">Do you want to allow custom network?</div>
      </div>

      <dl class="request_description">
        <dt>Network name</dt>
        <dd>{{ request?.data?.networkName }}</dd>
        <dt>Node Url</dt>
        <dd>{{ request?.data?.nodeUrl }}</dd>
        <dt>Chain ID</dt>
        <dd>{{ request?.data?.chainId }}</dd>
        <dt>Scan API Url</dt>
        <dd>{{ request?.data?.scanApiUrl }}</dd>
        <dt>Scan Explorer Url</dt>
        <dd>{{ request?.data?.scanExplorerUrl }}</dd>
      </dl>
    </div>

    <template #footer>
      <Appear :delay="0.6">
        <ButtonGroup>
          <Button class="button" type="font-gradation" size="small" @click="cancel">
            <span>Cancel</span>
          </Button>
          <Button class="button" type="font-gradation" size="small" @click="confirm">
            <span>Confirm</span>
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
  data() {
    return {
      request: this.$store.state.request.currentRequest,
      networks: {},
      isAddedNetwork: false,
    };
  }

  async mounted() {
    this.networks = await this.$background.getNetworks();
    this.isAddedNetwork = !!Object.values(this.networks).find(
      (network) => network.chainId === this.request?.data.chainId,
    );
  }

  async confirmHandler() {
    const networkPath = {
      label: this.request?.data.networkName,
      chainId: this.request?.data.chainId,
      nodeUrl: this.request?.data.nodeUrl,
      scanApiUrl: this.request?.data.scanApiUrl,
      scanExplorerUrl: this.request?.data.scanExplorerUrl,
    };

    try {
      if (!this.isAddedNetwork) {
        await this.$background.addNetwork(networkPath);
        this.$store.commit('accounts/setNetworkPath', networkPath);
      }
    } catch (e) {
      console.error(e, 'error');
    }
  }
}
</script>

<style lang="scss">
.request_content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .header {
    display: flex;
    height: 100%;
    flex-direction: column;
    text-align: center;
    color: #24272a;
    .title {
      /* font-size: 0.75rem; */
    }
    .title2 {
      /* font-size: 0.75rem; */
      line-height: 140%;
    }
  }
  .request_description {
    width: 70%;
    border: solid 1px #d6d9dc;
    border-radius: 8px;
    padding: 20px;
    dt {
      font-weight: bold;
      font-size: 0.9rem;
    }
    dd {
      margin: 0;
      font-weight: normal;
      overflow-wrap: break-word;
      line-height: 140%;
      color: #535a61;
      margin-bottom: 5px;
    }
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
    margin-left: 15px;
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
    &.address {
      margin-left: 10px;
    }
    .account_info_nickname_wrapper {
      &.address {
        flex-direction: column;
      }
      display: flex;
      justify-content: space-between;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
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
