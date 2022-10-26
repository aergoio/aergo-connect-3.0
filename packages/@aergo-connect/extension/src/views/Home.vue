<template>
  <ScrollView>
    <Header
      button="hamburger"
      :title="$store.state.accounts.network"
      refresh
      network
      @hamburgerClick="hamburgerClick"
      @networkModalClick="networkModalClick"
      @refreshClick="refreshClick"
    />
    <NoAccountModal v-if="noAccountModal" @cancel="handleCancel" />
    <!-- <RemoveAccountModal v-if="removeAccountModal" @cancel="handleCancel" /> -->
    <!-- <NotificationModal v-if="notificationModal" @cancel="handleCancel" /> -->
    <PasswordModal v-if="passwordModal" @cancel="handleCancel" @confirm="handleConfirm" />
    <AccountDetailModal v-if="accountDetailModal" @cancel="handleCancel" />
    <div v-if="!noAccountModal" class="home_content">
      <List
        v-if="hamburgerModal"
        removeAccountModal
        @removeModalClick="handleRemoveModalClick"
        @select="handleSelect"
        @listModalOff="hamburgerClick"
        @securityClick="handleSecurity"
        @notificationModalClick="handleNotificationModalClick"
      />
      <div class="account_info_wrapper">
        <Identicon :text="$store.state.accounts.address" class="account_info_img" />
        <div class="account_info_content_wrapper">
          <div class="account_info_nickname_wrapper">
            <div v-if="!editNick" class="account_info_nickname_text">
              {{ $store.state.accounts.nick }}
            </div>
            <input
              v-if="editNick"
              class="account_info_nickname_input"
              v-model="nick"
              autofocus
              @blur="changeNick"
              @keyup.enter="changeNick"
            />
            <Icon
              class="account_info_nickname_button"
              :name="`edit`"
              :size="50"
              @click="handleEdit"
            />
          </div>
          <div class="account_info_address_wrapper" @click="handleDetailAddress">
            <span class="account_info_address_text">{{
              `${$store.state.accounts.address.slice(
                0,
                15,
              )}...${$store.state.accounts.address.slice(-5)}`
            }}</span>
            <Icon class="account_info_address_button" :name="`next`" :size="50" />
          </div>
        </div>
      </div>
      <NetworkModal v-if="networkModal" @networkModalClick="networkModalClick" />

      <div class="token_content_wrapper">
        <ButtonGroup class="token_nft_button_wrapper">
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
          <li
            v-for="token in $store.state.session.tokens"
            class="token_list_li"
            :key="token.hash"
            @click="handleToken(token)"
          >
            <div v-if="token.meta.type !== 'ARC2'" class="token_list_wrapper">
              <div class="token_list_row">
                <Icon v-if="token.meta.type === 'AERGO'" class="token_list_icon" :name="`aergo`" />
                <img
                  v-else-if="token.meta.image"
                  class="token_list_icon"
                  :src="token.meta.image"
                  alt="404"
                />
                <Icon v-else class="token_list_icon" :name="`defaultToken`" />
                <span class="token_list_text"> {{ token.meta.name }} </span>
              </div>
              <div class="token_list_amount">
                <span class="token_list_balance">{{ tokenBalanceFormat(token) }}</span>
                <span> {{ token.meta.symbol }}</span>
                <Icon class="token_list_nextbutton" :name="`next_grey`" />
              </div>
            </div>
            <div class="line" />
          </li>
        </ul>

        <ul class="token_list_ul" v-if="tab === `nft`">
          <li
            v-for="token in $store.state.session.tokens"
            class="token_list_li"
            :key="token.hash"
            @click="handleNft(token)"
          >
            <div v-if="token.meta.type === 'ARC2'" class="token_list_wrapper">
              <img
                v-if="token.meta.image"
                class="token_list_icon"
                :src="token.meta.image"
                alt="404"
              />
              <Icon v-else class="token_list_icon" :name="`defaultToken`" />
              <span class="token_list_text"> {{ token.meta.name }} </span>
              <div class="token_list_amount">
                <span class="token_list_balance">{{ tokenBalanceFormat(token) }}</span>
                <span> EA </span>
                <Icon class="token_list_nextbutton" :name="`next_grey`" />
              </div>
            </div>
            <div class="line" />
          </li>
        </ul>

        <button
          class="token_list_button"
          @click="[tab === 'tokens' ? handleImportAsset('token') : handleImportAsset('nft')]"
        >
          <Icon name="plus" class="token_list_button_img" /><span class="token_list_button_text"
            >Import Asset</span
          >
        </button>
      </div>
      <div class="footer">
        <Appear :delay="0.6">
          <ButtonGroup>
            <Button class="button" type="font-gradation" size="small" @click="handleSend"
              ><Icon class="button-icon" :name="`send`" /><span>Send</span></Button
            >
            <Button class="button" type="font-gradation" size="small" @click="handleReceive"
              ><Icon class="button-icon" :name="`send`" /><span>Receive</span></Button
            >
          </ButtonGroup>
        </Appear>
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
import Identicon from '../../../lib-ui/src/content/Identicon.vue';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import NoAccountModal from '@aergo-connect/lib-ui/src/modal/NoAccountModal.vue';
// import RemoveAccountModal from '@aergo-connect/lib-ui/src/modal/RemoveAccountModal.vue';
// import NotificationModal from '@aergo-connect/lib-ui/src/modal/NotificationModal.vue';
import NetworkModal from '@aergo-connect/lib-ui/src/modal/NetworkModal.vue';
import PasswordModal from '@aergo-connect/lib-ui/src/modal/PasswordModal.vue';
import AccountDetailModal from '@aergo-connect/lib-ui/src/modal/AccountDetailModal.vue';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';

export default Vue.extend({
  components: {
    // RemoveAccountModal,
    // NotificationModal,
    NoAccountModal,
    NetworkModal,
    PasswordModal,
    AccountDetailModal,
    Icon,
    Heading,
    Identicon,
    Button,
    ButtonGroup,
    List,
    Header,
    ScrollView,
    Appear,
  },
  data() {
    return {
      hamburgerModal: false,
      // removeAccountModal: false,
      // notificationModal: false,
      networkModal: false,
      passwordModal: false,
      importAssetModal: false,
      noAccountModal: false,
      accountDetailModal: false,
      network: 'aergo.io',
      tab: 'tokens',
      editNick: false,
      nick: this.$store.state.accounts.nick,
    };
  },

  beforeMount() {
    this.initAccount();
  },

  watch: {
    $route(to, from) {
      this.refreshClick();
    },

    '$store.state.accounts.network': function () {
      this.initAccount();
    },

    '$store.state.accounts.address': function () {
      this.initAccount();
    },
  },

  methods: {
    async changeNick() {
      this.$store.commit('accounts/setNick', this.nick);
      this.editNick = false;
    },

    handleEdit() {
      this.editNick = true;
      console.log('edit nick');
    },

    async initAccount() {
      console.log('Address', this.$store.state.accounts.address);
      //      console.log("List", this.$background.getAccounts()) ;

      if (this.$store.state.accounts.address) {
        await this.$store.dispatch('session/initState');
        await this.$forceUpdate();
        this.nick = await this.$store.state.accounts.nick;
      } else {
        console.log('Other Account Loading ..');
        const succ = await this.$store.dispatch('accounts/loadAccount');

        if (!succ) {
          console.log('Need Register');
          this.noAccountModal = true;
        } else await this.$store.dispatch('session/InitState');
      }
    },

    async refreshClick() {
      await this.$store.dispatch('session/updateBalances');
      this.$forceUpdate();

      console.log('regresh', this.$store.state.session.tokens);
    },

    /*
    async autoUpdateBalances(time) {
      try {
        console.log('UpdateBalances');
        this.$store.dispatch('session/updateBalances');
        setTimeout(() => this.updateBalances(), time);
      } catch (e) {
        console.error(e);
      }
    },
*/

    hamburgerClick() {
      this.hamburgerModal = !this.hamburgerModal;
    },

    handleCancel(modalEvent: string) {
      console.log(modalEvent);
      if (modalEvent === 'noAccountModal') {
        this.$background.lock();
      }

      if (modalEvent === 'removeAccountModal') {
        this.removeAccountModal = false;
      }

      if (modalEvent === 'passwordModal') {
        this.passwordModal = false;
        this.hamburgerModal = false;
      }

      if (modalEvent === 'accountDetailModal') {
        this.accountDetailModal = false;
      }
      if (modalEvent === 'notificationModal') {
        this.notificationModal = false;
      }
    },

    handleConfirm() {
      this.passwordModal = false;
      this.hamburgerModal = false;
      this.$router.push({ name: 'security' }).catch(() => {});
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
    handleNotificationModalClick() {
      this.notificationModal = true;
    },
    handleDetailAddress() {
      console.log('handleDetailAddress');
      this.accountDetailModal = true;
    },

    handleSecurity() {
      this.hamburgerModal = false;
      this.passwordModal = true;
    },

    handleToken(token: any) {
      this.$store.commit('session/setToken', token);
      this.$router
        .push({
          name: 'token-detail',
        })
        .catch(() => {});
    },
    handleNft(nft: any) {
      this.$store.commit('session/setToken', nft);
      this.$router
        .push({
          name: 'nft-detail',
        })
        .catch(() => {});
    },
    handleImportAsset(to: string) {
      if (to === 'token') {
        this.$router
          .push({
            name: 'import-asset',
            params: { option: 'token' },
          })
          .catch(() => {});
      }
      if (to === 'nft') {
        this.$router
          .push({
            name: 'import-asset',
            params: { option: 'nft' },
          })
          .catch(() => {});
      }
    },
    handleSend(token: any) {
      this.$router
        .push({
          name: 'send',
          params: {},
        })
        .catch(() => {});
    },
    handleReceive() {
      this.$router
        .push({
          name: 'receive',
          params: {},
        })
        .catch(() => {});
    },
    handleChangeTab(value: string) {
      this.tab = value;
    },
    tokenBalanceFormat(token) {
      console.log('token', token);
      if (token.balance) {
        if (Number.isInteger(+token.balance)) {
          return token.balance;
        } else {
          return Number(+token.balance).toFixed(3);
        }
      } else {
        return '0';
      }
    },
  },
});
</script>
<style lang="scss">
@import '../../../lib-ui/src/styles/variables';
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
        margin-left: 25px;
        width: 191px;
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
        cursor: pointer;
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
    .token_nft_button_wrapper {
      justify-content: center;
    }
    .token-button {
      width: 153px;
      height: 39px;
      background: #279ecc;
      border-radius: 8px;
      &.unclicked {
        background: #f6f6f6;
        color: #bababa;
        box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.05);
      }
    }
    .token_list_ul {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 375px;
      height: 15.8rem;
      overflow-x: hidden;
      overflow-y: scroll;
      .token_list_li {
        cursor: pointer;
        width: 290px;
      }
      .token_list_wrapper {
        height: 62px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .token_list_row {
          display: flex;
          align-items: center;
        }
        .token_list_icon {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1px solid #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .token_list_amount {
          display: flex;
          align-items: center;
          width: 100px;
          justify-content: flex-end;
          .token_list_balance {
            margin-right: 4px;
          }
        }
        .token_list_text {
          width: 120px;
          margin-left: 18px;
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
        height: 1px;
        background: #f0f0f0;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
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
      margin-bottom: 10px;
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
}
</style>
