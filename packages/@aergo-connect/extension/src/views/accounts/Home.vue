<template>
  <ScrollView>
    <Header
      button="hamburger"
      :title="$store.state.accounts.network"
      refresh
      network
      @hamburgerClick="hamburgerClick"
      @networkModalClick="networkModalClick"
    />
    <NoAccountModal v-if="noAccountModal" @cancel="handleCancel" />
    <RemoveAccountModal v-if="removeAccountModal" @cancel="handleCancel" />

    <div v-if="!noAccountModal" class="home_content">
      <List
        v-if="hamburgerModal"
        removeAccountModal
        @removeModalClick="handleRemoveModalClick"
        @select="handleSelect"
        @listModalOff="hamburgerClick"
      />
      <div class="account_info_wrapper">
        <Identicon :text="$store.state.accounts.address" class="account_info_img" />
        <div class="account_info_content_wrapper">
          <div class="account_info_nickname_wrapper">
            <span class="account_info_nickname_text">{{ $store.state.accounts.nick }}</span>
            <Icon
              class="account_info_nickname_button"
              :name="`edit`"
              :size="50"
              @click="handleEdit"
            />
          </div>
          <div class="account_info_address_wrapper">
            <span class="account_info_address_text">{{
              `${$store.state.accounts.address.slice(
                0,
                15,
              )}...${$store.state.accounts.address.slice(-5)}`
            }}</span>
            <Icon
              class="account_info_address_button"
              :name="`next`"
              :size="50"
              @click="handleDetailAddress"
            />
          </div>
        </div>
      </div>
      <NetworkModal v-if="networkModal" @networkModalClick="networkModalClick" />

      <div class="token_content_wrapper">
        <ButtonGroup>
          <Button
            :class="[tab === `tokens` ? `token-button` : `token-button unclicked`]"
            type="primary"
            size="small"
            @click="handleChangeTab('tokens')"
            >Tokens</Button
          >
          <Button
            :class="[tab === `nft` ? `token-button` : `token-button unclicked`]"
            type="primary"
            size="small"
            @click="handleChangeTab('nft')"
            >NFT</Button
          >
        </ButtonGroup>
        <ul class="token_list_ul" v-if="tab === `tokens`">
          <li class="token_list_li" @click="handleAergo">
            <div class="token_list_wrapper">
              <Icon :name="`aergo`" class="token_list_icon" />
              <span class="token_list_text">AERGO</span>
              <span class="token_list_balance"> {{ $store.state.session.aergoBalance }} </span>
              <span> aergo </span>
              <Icon class="token_list_nextbutton" :name="`next_grey`" />
            </div>
            <div class="line" />
          </li>
          <li
            v-for="token in $store.state.session.tokens"
            class="token_list_li"
            :key="token.hash"
            @click="handleToken(token)"
          >
            <div class="token_list_wrapper">
              <!-- <Identicon :text="token.hash" class="list_icon" /> -->
              <img class="token_list_icon" :src="token.meta.image" alt="404" />
              <span class="token_list_text"> {{ token.meta.name }} </span>
              <span class="token_list_balance"> {{ token.balance }} </span>
              <Icon class="token_list_nextbutton" :name="`next_grey`" />
            </div>
            <div class="line" />
          </li>
        </ul>

        <ul class="token_list_ul" v-if="tab === `nft`">
          <!-- <li class="token_list_li" @click="handleToken">
            <Icon class="token_list_icon" />
            <span>CCCV</span>
            <span> {{ $store.state.session.aergoBalance }} </span>
            <Icon class="next" :name="`next_grey`" />
          </li> -->
          <li v-for="token in $store.state.session.tokens" class="token_list_li" :key="token.hash" @click="handleToken">
            <div class="token_list_wrapper">
              <!-- <Identicon :text="token.hash" class="list_icon" /> -->
              <div class="token_list_icon">
                <img :src="token.meta.image" alt="404" />
              </div>
              <span class="token_list_text"> {{ token.meta.name }} </span>
              <span class="token_list_balance"> {{ token.balance }} </span>
              <Icon class="token_list_nextbutton" :name="`next_grey`" />
            </div>
            <div class="line" />
          </li>
        </ul>

        <button class="token_list_button" @click="handleImportAsset">
          <Icon name="plus" class="token_list_button_img" /><span class="token_list_button_text"
            >Import Asset</span
          >
        </button>
      </div>
      <div class="content_footer">
        <ButtonGroup>
          <Button class="button" type="font-gradation" size="small" @click="handleSend"
            ><Icon class="button-icon" :name="`send`" />send</Button
          >
          <Button class="button" type="font-gradation" size="small" @click="handleReceive"
            ><Icon class="button-icon" :name="`send`" />receive</Button
          >
        </ButtonGroup>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Header } from '@aergo-connect/lib-ui/src/layouts';
import List from './List.vue';
import ButtonGroup from '@aergo-connect/lib-ui/src/buttons/ButtonGroup.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import Identicon from '../../../../lib-ui/src/content/Identicon.vue';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import NoAccountModal from '@aergo-connect/lib-ui/src/modal/NoAccountModal.vue';
import RemoveAccountModal from '@aergo-connect/lib-ui/src/modal/RemoveAccountModal.vue';
import NetworkModal from '@aergo-connect/lib-ui/src/modal/NetworkModal.vue';
import { AccountSpec } from '@herajs/wallet/dist/types/models/account';
import { Account } from '@herajs/wallet';
import { Amount } from '@herajs/common';

export default Vue.extend({
  components: {
    RemoveAccountModal,
    NoAccountModal,
    NetworkModal,
    Icon,
    Heading,
    Identicon,
    Button,
    ButtonGroup,
    List,
    Header,
    ScrollView,
  },
  data() {
    return {
      hamburgerModal: false,
      removeAccountModal: false,
      networkModal: false,
      importAssetModal: false,
      noAccountModal: false,
      network: 'aergo.io',
      tab: 'tokens',
    };
  },

  beforeMount() {
    this.initAccount();
  },

  watch: {

    $route(to, from) {
      this.initAccount();
    },

    '$store.state.accounts.network': function () {
      this.initAccount();
    },

    '$store.state.accounts.address': function () {
      this.initAccount();
    },
  },

  methods: {

    async initAccount() {

      console.log('Address', this.$store.state.accounts.address);
      this.$store.commit('ui/setIdleTimeout', 100000) ;

      if (this.$store.state.accounts.address) {
        await this.$store.dispatch('session/initState') ;
        console.log('aergoBalance', this.$store.state.session.aergoBalance);
      }
      else {
        console.log('Other Account Loading ..');
        const succ = await this.$store.dispatch('accounts/loadAccount');

        if (!succ) {
          console.log('Need Register');
          this.noAccountModal = true;
        }
        else await this.$store.dispatch('session/InitState') ;
      }

    },

    async updateBalance() {
    },

    hamburgerClick() {
      this.hamburgerModal = !this.hamburgerModal;
    },

    handleCancel(modalEvent: string) {
      if (modalEvent === 'noAccountModal') {
        this.$background.lock();
      }

      if (modalEvent === 'removeAccountModal') {
        this.removeAccountModal = false;
      }
    },

    handleRemoveModalClick() {
      this.hamburgerModal = false;
      this.removeAccountModal = true;
    },
    handleSelect() {
      this.hamburgerModal = false;
    },
    networkModalClick() {
      this.networkModal = !this.networkModal;
    },
    handleEdit() {
      console.log('edit');
    },
    handleDetailAddress() {
      console.log('handleDetailAddress');
    },

    handleAergo() {
      this.$router
        .push({
          name: 'token-detail-aergo',
          params: {
            address: this.$store.state.accounts.address,
            balance: this.$store.state.session.aergoBalance,
          },
        })
        .catch(() => {});
    },

    handleToken(token: any) {
      this.$store.commit('session/setToken', token) ;
      this.$router
        .push({
          name: 'token-detail',
          params: {
            address: this.$store.state.accounts.address,
            token: token,
            balance: token.balance,
          },
        })
        .catch(() => {});
    },

    handleImportAsset() {
      this.$router
        .push({
          name: 'import-asset',
          params: { address: this.$store.state.accounts.address },
        })
        .catch(() => {});
    },
    handleSend(token: any) {
      this.$router
        .push({
          name: 'send',
          params: {
            address: this.$store.state.accounts.address,
          },
        })
        .catch(() => {});
    },
    handleReceive() {
      console.log('receive');
    },
    handleChangeTab(value: string) {
      console.log(value);
      this.tab = value;
    },
  },
});
</script>
<style lang="scss">
.header {
  z-index: 2;
}
.home_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  .account_info_wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 319px;
    height: 104px;
    background: #ffffff;
    border: 1px solid #f6f6f6;
    box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-top: 10px;
    .account_info_img {
      width: 44px;
      height: 44px;
      margin-left: 20px;
    }
    .account_info_content_wrapper {
      display: flex;
      flex-direction: column;
      .account_info_nickname_wrapper {
        display: flex;
        flex-direction: row;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        margin-bottom: 8px;
        margin-left: 30px;
        .account_info_nickname_text {
          margin-right: 76px;
        }
        .account_info_nickname_button {
          cursor: pointer;
        }
      }
      .account_info_address_wrapper {
        width: 191px;
        height: 24px;
        background: #ecf8fd;
        border-radius: 25px;
        color: #279ecc;
        margin-left: 25px;
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
  .token_content_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    .token-button {
      width: 153px;
      height: 39px;
      background: #279ecc;
      border-radius: 8px;
      &.unclicked {
        background: #f6f6f6;
        box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.05);
      }
    }
    .token_list_ul {
      width: 375px;
      height: 252px;
      overflow-x: hidden;
      overflow-y: scroll;
      .token_list_li {
        cursor: pointer;
      }
      .token_list_wrapper {
        width: 375px;
        height: 62px;
        display: flex;
        /* justify-content: space-around; */
        align-items: center;
        .token_list_icon {
          margin-left: 32px;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1px solid #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .token_list_text {
          margin-left: 18px;
          width: 192.5px;
        }
        .token_list_balance {
          margin-left: 20px;
        }
        .token_list_nextbutton {
          margin-left: 10px;
        }
      }
      .line {
        /* Grey/01 */
        width: 311px;
        height: 1px;
        background: #f0f0f0;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
        margin-left: 32px;
      }
    }
    .token_list_button {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      align-items: center;
      padding: 5px 10px 5px 8px;
      gap: 4px;
      width: 124px;
      height: 30px;
      background: #ffffff;
      border: 1px solid #f6f6f6;
      box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1);
      border-radius: 28px;
      text-align: center;
      letter-spacing: -0.333333px;
      cursor: pointer;
      margin-top: 10px;
      .token_list_button_img {
        position: relative;
        bottom: 2px;
      }
      .token_list_button_text {
        width: 76px;
        height: 18px;
        /* Caption/C3 */
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        /* identical to box height */
        text-align: center;
        letter-spacing: -0.333333px;
        /* Primary/Blue01 */
        color: #279ecc;
        /* Inside auto layout */
        flex: none;
        order: 1;
        flex-grow: 0;
      }
    }
  }
  .content_footer {
    margin-top: 10px;
    .button {
      box-shadow: 0px 4px 13px rgba(119, 153, 166, 0.25);
      border-radius: 4px;
      .button-icon {
        margin-right: 9.49px;
      }
      /* &.button-type-font-gradation:hover {
        background: #ffffff;
      } */
    }
    /* .button:hover {
    } */
  }
}
</style>
