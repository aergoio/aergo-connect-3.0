<template>
  <ScrollView class="page">
    <Header button="hamburger" title="AERGO Mainnet" refresh @hamburgerClick="hamburgerClick" />
    <List v-if="hamburgerModal" />
    <div class="home_content">
      <div class="account_info_wrapper">
        <Identicon :text="address" class="account_info_img" />
        <div class="account_info_content_wrapper">
          <div class="account_info_nickname_wrapper">
            <Heading class="account_info_nickname_text">ACCOUNT1</Heading>
            <button class="account_info_nickname_button">edit</button>
          </div>
          <div class="account_info_address_wrapper">
            <span class="account_info_address_text">{{ address }}</span>
            <button class="account_info_address_button">></button>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="content">
        <ButtonGroup>
          <Button type="font-gradation" size="small">send</Button>
          <Button type="font-gradation" size="small">receive</Button>
        </ButtonGroup>
      </div>
    </template>
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

@Component({
  components: {
    ScrollView,
    Header,
    List,
    ButtonGroup,
    Button,
    Identicon,
    Heading,
  },
})
export default class Home extends mixins() {
  hamburgerModal = false;
  address = '';

  hamburgerClick() {
    this.hamburgerModal = !this.hamburgerModal;
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
    console.log(this.accounts);
    console.log(this.account);
    console.log(this.accountSpec);
  }
}
</script>

<style lang="scss">
.home_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #f6f6f6;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  .account_info_wrapper {
    display: flex;
    flex-direction: row;
    .account_info_nickname_wrapper {
      display: flex;
      flex-direction: row;
    }
    .account_info_content_wrapper {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
