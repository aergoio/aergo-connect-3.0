<template>
  <ScrollView>
    <div class="content">
      <Identicon :text="address" class="circle" />
      <Heading class="big-title">Registered Account!</Heading>
      <span>Address</span>

      <div class="address">
        <span class="address_hash">{{ address }}</span>
      </div>
      <span class="nickname">Nickname</span>

      <div class="user_nickname">
        <span class="user_nickname_text">ACCOUNT 1</span>
      </div>
      <ButtonGroup vertical>
        <Button type="primary-outline" size="large" :to="{ name: 'account-backup' }">
          Backup Private Key
        </Button>
        <Button :to="{ name: 'accounts-list' }" type="primary" size="large">
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
  chainId = '';
  mnemonic = '';
  async beforeMount() {
    const { address, chainId } = await this.$route.params;
    this.address = address;
    this.chainId = chainId;
  }
}
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .circle {
    margin-top: 56px;
    width: 59px;
    height: 59px;
  }
  .big-title {
    margin-top: 15px;
    margin-bottom: 30px;
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
  .nickname {
    margin-top: 22px;
    margin-bottom: 7px;
  }
  .user_nickname {
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
</style>
