<template>
  <ScrollView class="page">
    <Header
      button="hamburger"
      title="AERGO Mainnet"
      refresh
      network
      @hamburgerClick="hamburgerClick"
      @networkModalClick="networkModalClick"
    />
    <NoAccountModal v-if="noAccountModal" @cancel="handleCancel" />
    <RemoveAccountModal v-if="removeAccountModal" @cancel="handleCancel" />
    <List
      v-if="hamburgerModal"
      removeAccountModal
      @removeModalClick="handleRemoveModalClick"
      @select="handleSelect"
    />

    <div v-if="!noAccountModal" class="home_content">
      <div class="account_info_wrapper">
        <Identicon :text="$route.params.address" class="account_info_img" />
        <div class="account_info_content_wrapper">
          <div class="account_info_nickname_wrapper">
            <span class="account_info_nickname_text">{{ nick($route.params.address) }}</span>
            <Icon
              class="account_info_nickname_button"
              :name="`edit`"
              :size="50"
              @click="handleEdit"
            />
          </div>
          <div class="account_info_address_wrapper">
            <span class="account_info_address_text">{{
              `${$route.params.address.slice(0,15)}...${$route.params.address.slice(-5)}`
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
          <Button class="token-button" type="primary" size="small">Tokens</Button>
          <Button class="token-button unclicked" type="primary" size="small">NFT</Button>
        </ButtonGroup>
        <ul class="token_list_ul">
          <li class="token_list_li">
            <Icon class="token_list_icon" />
            <span>AERGO</span>
            <span>0.000AERGO</span>
            <Icon class="next" :name="`next_grey`" @click="handleToken" />
          </li>
          <li class="token_list_li">
            <Icon class="token_list_icon" />
            <span>AERGO</span>
            <span>0.000AERGO</span>
            <Icon class="next" :name="`next_grey`" @click="handleToken" />
          </li>
          <li class="token_list_li">
            <Icon class="token_list_icon" />
            <span>AERGO</span>
            <span>0.000AERGO</span>
            <Icon class="next" :name="`next_grey`" @click="handleToken" />
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
import { Account } from '@herajs/wallet';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import NoAccountModal from '@aergo-connect/lib-ui/src/modal/NoAccountModal.vue';
import RemoveAccountModal from '@aergo-connect/lib-ui/src/modal/RemoveAccountModal.vue';
import { AccountSpec } from '@herajs/wallet/dist/types/models/account';
import NetworkModal from '@aergo-connect/lib-ui/src/modal/NetworkModal.vue';
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
    };
  },

  computed: {

/*
    accounts(): Account[] {
      if (this.$store.state.accounts.keys.length) {
        return Object.values(this.$store.state.accounts.accounts);
      }
      return [];
    },
    accountSpec(): AccountSpec {
      return {
        address: this.address,
        chainId: 'aergo.io',
      };
    },
    account(): Account {
      return this.$store.getters['accounts/getAccount'](this.accountSpec);
    },
*/
    noAccountModal() {
      if (!this.$route.params.address) {
        return true;
      }
      return false;
    }
  },

  methods: {

    hamburgerClick() {
      this.hamburgerModal = !this.hamburgerModal;
    },

    handleCancel(modalEvent: string) {
      if (modalEvent === 'noAccountModal') {
        this.noAccountModal = false;
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
    handleToken(token: any) {
      console.log(token);
      console.log('handleToken');
    },
    handleImportAsset() {
      this.$router.push({ name: 'import-asset', params: { address: this.$route.params.address } });
    },
    handleSend() {
      console.log('send');
    },
    handleReceive() {
      console.log('receive');
    },

/*
    async getAccounts() {
      const accountsData = await this.$background.getAccounts();
      this.account = accountsData[0];
      if (accountsData.length !== 0) {
        this.noAccountModal = false;
      } else {
        this.noAccountModal = true;
      }
    },

*/
    nick(address: string) {
      // get nick
      const key = address.substr(0,5) + "_nick";
      var nick = "" ;
      try {
          nick = localStorage.getItem(key);
      } catch (error) {
          nick = key;
          console.log("STORE_ERRORS", error);
      }
      if (!nick) nick = key ;
      console.log("Nick", nick);

      return nick ;
    }
  },
});

</script>

<style lang="scss">
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
    margin-bottom: 12px;

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
    height: 253px;
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
      margin-top: 5px;
      .token_list_li {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 375px;
        height: 62px;
      }
    }
    .next {
      cursor: pointer;
    }
    .token_list_button {
      margin-top: 20px;
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
    margin-top: 40px;
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
