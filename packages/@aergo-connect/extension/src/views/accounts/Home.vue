<template>
  <ScrollView class="page">
    <Header button="hamburger" title="AERGO Mainnet" refresh @hamburgerClick="hamburgerClick" />
    <NoAccountModal v-if="noAccountModal" @cancel="handleCancel" />
    <RemoveAccountModal v-if="removeAccountModal" @cancel="handleCancel" />
    <List v-if="hamburgerModal" removeAccountModal @removeModalClick="handleRemoveModalClick" />
    <div class="home_content">
      <div class="account_info_wrapper">
        <Identicon :text="address" class="account_info_img" />
        <div class="account_info_content_wrapper">
          <div class="account_info_nickname_wrapper">
            <span class="account_info_nickname_text">ACCOUNT1</span>
            <Icon class="account_info_nickname_button" :name="`edit`" :size="50" />
          </div>
          <div class="account_info_address_wrapper">
            <span class="account_info_address_text">{{ address }}</span>
            <Icon class="account_info_address_button" :name="`next`" :size="50" />
          </div>
        </div>
      </div>

      <div class="token_content_wrapper">
        <ButtonGroup>
          <Button type="primary" size="small">Tokens</Button>
          <Button type="primary" size="small">NFT</Button>
        </ButtonGroup>
        <ul class="token_list_ul">
          <li class="token_list_li">
            <Icon class="token_list_icon" />
            <span>AERGO</span>
            <span>0.000AERGO</span>
            <Icon :name="`next_grey`" />
          </li>
          <li class="token_list_li">
            <Icon class="token_list_icon" />
            <span>AERGO</span>
            <span>0.000AERGO</span>
            <Icon :name="`next_grey`" />
          </li>
          <li class="token_list_li">
            <Icon class="token_list_icon" />
            <span>AERGO</span>
            <span>0.000AERGO</span>
            <Icon :name="`next_grey`" />
          </li>
        </ul>
        <button class="token_list_button">
          <Icon name="plus" class="token_list_button_img" /><span class="token_list_button_text"
            >Import Asset</span
          >
        </button>
      </div>

      <div class="content_footer">
        <ButtonGroup>
          <Button type="font-gradation" size="small"><Icon :name="`send`" />send</Button>
          <Button type="font-gradation" size="small"><Icon :name="`send`" />receive</Button>
        </ButtonGroup>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Header } from '@aergo-connect/lib-ui/src/layouts';
import Component, { mixins } from 'vue-class-component';
import List from './List.vue';
import ButtonGroup from '@aergo-connect/lib-ui/src/buttons/ButtonGroup.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import Identicon from '../../../../lib-ui/src/content/Identicon.vue';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { Account } from '@herajs/wallet';
import { Watch } from 'vue-property-decorator';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import NoAccountModal from '@aergo-connect/lib-ui/src/modal/NoAccountModal.vue';
import RemoveAccountModal from '@aergo-connect/lib-ui/src/modal/RemoveAccountModal.vue';
@Component({
  components: {
    ScrollView,
    Header,
    List,
    ButtonGroup,
    Button,
    Identicon,
    Heading,
    Icon,
    NoAccountModal,
    RemoveAccountModal,
  },
})
export default class Home extends mixins() {
  hamburgerModal = false;
  noAccountModal = false;
  removeAccountModal = false;
  address = '';

  @Watch('address')
  public exampleMethod(value: string) {
    console.log(value);
  }
  hamburgerClick() {
    this.hamburgerModal = !this.hamburgerModal;
  }
  handleCancel(modalEvent: string) {
    if (modalEvent === 'noAccountModal') {
      this.noAccountModal = false;
    }
    if (modalEvent === 'removeAccountModal') {
      this.removeAccountModal = false;
    }
  }
  handleRemoveModalClick() {
    this.hamburgerModal = false;
    this.removeAccountModal = true;
  }
  get accounts(): Account[] {
    if (this.$store.state.accounts.keys.length) {
      return Object.values(this.$store.state.accounts.accounts);
    }
    return [];
  }
  get account(): Account {
    return this.$store.getters['accounts/getAccount'](this.accountSpec);
  }
  get accountSpec() {
    return { address: this.$route.params.address, chainId: this.$route.params.chainId };
  }
  mounted() {
    if (this.account) {
      this.noAccountModal = false;
    } else {
      this.noAccountModal = true;
    }
  }
}
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
      }
      .account_info_address_wrapper {
        width: 191px;
        height: 24px;
        background: #ecf8fd;
        border-radius: 25px;
        color: #279ecc;
        margin-left: 30px;
        .account_info_address_text {
          width: 148.32px;
          height: 16px;
        }
        .account_info_address_button {
          float: right;
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
    .token_list_button {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
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
      .token_list_button_img {
        position: relative;
        bottom: 2px;
        left: 5px;
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
  }
}
</style>
