<template>
  <ScrollView>
    <div class="registered_content">
      <Identicon :text="$route.params.address" class="circle" />
      <Heading class="big-title">Registered Account!</Heading>

      <span class="sub-title"> Address</span>
      <div class="address">
        <span class="address_hash">{{ $route.params.address }}</span>
      </div>

      <span class="sub-title">Nickname</span>
      <div class="user_nickname_wrapper">
        <div class="user_nickname_text">
          {{ $store.state.accounts.nick }}
        </div>
      </div>

      <ButtonGroup vertical class="buttonGroup-position">
        <Button type="primary-outline" size="large-outline" hover @click="goBackup">
          Backup Private Key
        </Button>
        <Button type="primary" size="large" :hover="true" @click="goHome">
          Home
        </Button>
      </ButtonGroup>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Component, { mixins } from 'vue-class-component';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import { Identicon } from '@aergo-connect/lib-ui/src/content';
@Component({
  components: {
    Identicon,
    ScrollView,
    Heading,
    ButtonGroup,
    Button,
    Icon,
  },
})
export default class Create extends mixins() {
  address = '';
  nick = '';
  key = '' ;

  async beforeMount() {
    const { address } = await this.$route.params;
    this.address = address;
    this.key = this.address.substr(0,5) + "_nick";
    this.nick = this.key ;
  }

  async goBackup() {
    localStorage.setItem(this.key,this.nick);

    this.$router.push({
      name: 'account-backup',
      params: { 
        address: this.address, 
      },
    });
  }

  async goHome() {
    localStorage.setItem(this.key,this.nick);

    this.$router.push({
      name: 'accounts-list-address',
      params: { 
        address: this.address, 
      },
    });
  }
}
</script>

<style lang="scss">
.registered_content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .circle {
    margin-top: 56px;
    width: 59px;
    height: 59px;
  }
  .address {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 283px;
    height: 60px;
    background: #eff5f7;
    opacity: 0.7;
    border-radius: 4px;
    .address_hash {
      width: 231px;
      word-break: break-all;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 19px;
      letter-spacing: -0.333333px;
      color: #279ecc;
    }
  }
  .sub-title {
    margin-top: 22px;
    margin-bottom: 7px;
  }
  .user_nickname_wrapper {
    display: flex;
    align-items: center;
    width: 283px;
    height: 41px;
    background: #eff5f7;
    opacity: 0.7;
    border-radius: 4px;
    margin-bottom: 67px;
    .user_nickname_text {
      margin-left: 20px;
      width: 200px;
      word-break: break-all;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 19px;
      letter-spacing: -0.333333px;
      color: #686767;
    }
  }
}
.buttonGroup-position {
  position: absolute;
  top: 448px;
}
</style>
