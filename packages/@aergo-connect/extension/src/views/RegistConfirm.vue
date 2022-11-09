<template>
  <ScrollView>
    <div class="registered_content">
      <Identicon :text="$store.state.accounts.address" class="circle" />
      <Heading class="big-title">Registered Account!</Heading>

      <span class="sub-title"> Address</span>
      <div class="address">
        <span class="address_hash">{{ $store.state.accounts.address }}</span>
      </div>

      <div class="flex-row-nick">
        <span class="sub-title">Nickname</span>
        <Icon :name="`edit`" @click="handleEdit" />
      </div>
      <div class="user_nickname_wrapper">
        <div v-if="!editNick" class="user_nickname_text">{{ nick }}</div>
        <input
          v-if="editNick"
          class="user_nickname_text"
          v-model="nick"
          autofocus
          @blur="changeNick"
          @keyup.enter="changeNick"
        />
      </div>

      <ButtonGroup vertical class="buttonGroup_position">
        <Button
          :disabled="!$store.state.accounts.lastSeedPhrase"
          type="primary"
          size="large-outline"
          :hover="$store.state.accounts.lastSeedPhrase ? true : false"
          @click="goBackup"
        >
          Backup Private Key
        </Button>
        <Button class="button_outline" type="primary-outline" size="large" @click="goHome">
          <span>Home</span>
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
import { Identicon } from '@aergo-connect/lib-ui/src/content';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
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
export default class RegistConfirm extends mixins() {
  address = '';
  nick = '';
  key = '';
  editNick = false;

  async beforeMount() {
    this.address = await this.$store.state.accounts.address;
    this.nick = await this.$store.state.accounts.nick;

    console.log('created in ', this.nick, this.address);
  }
  async goBackup() {
    this.$store.commit('accounts/setNick', this.nick);
    this.$router.push({ name: 'account-backup', params: { from: 'register' } });
  }

  handleEdit() {
    this.editNick = true;
  }

  async changeNick() {
    this.$store.commit('accounts/setNick', this.nick);
    this.editNick = false;
  }

  async goHome() {
    console.log('created', this.$store.state.accounts.nick);
    this.$store.commit('accounts/setNick', this.nick);
    this.$router.push({ name: 'accounts-list' });
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
      margin-left: 38px;
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
  .buttonGroup_position {
    position: absolute;
    top: 448px;
    .button_outline:hover {
      border: 2px solid #512da8;
      span {
        background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    .button {
      width: 327px;
    }
  }
}

.flex-row-nick {
  margin-top: 22px;
  display: flex;
  align-items: center;
  .sub-title {
    margin-top: 0;
  }
  .icon {
    margin-left: 11px;
    margin-bottom: 11px;
    cursor: pointer;
  }
  path {
    fill: #279ecc;
  }
}
</style>
