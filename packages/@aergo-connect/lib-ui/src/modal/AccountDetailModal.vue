<template>
  <div class="account_detail_backdrop" @click="handleBack">
    <div class="account_detail_wrapper">
      <div class="title">Account Address</div>
      <div class="flex-row">
        <div :style="{ display: 'flex', alignItems: 'center', minWidth: '120px' }">
          <Identicon :text="$store.state.accounts.address" />
          <div class="account_info_nickname_text" v-if="!editNick">
            {{ $store.state.accounts.nick }}
          </div>
          <input
            v-if="editNick"
            class="account_info_nickname_input"
            v-model="nick"
            autofocus
            @keyup.enter="changeNick"
          />
        </div>
        <Icon
          v-if="!editNick"
          class="account_info_nickname_button"
          :name="`edit`"
          :size="50"
          @click="handleEdit"
        />
        <Icon
          v-if="editNick"
          class="account_info_nickname_button"
          :name="`checkmark`"
          :size="50"
          @click="changeNick"
        />
      </div>
      <VueQRCodeComponent :text="$store.state.accounts.address" :size="123"></VueQRCodeComponent>
      <div class="address_wrapper">
        <div class="address" @click="copyToClipboard($store.state.accounts.address)">
          {{ $store.state.accounts.address }}
        </div>
      </div>
      <ButtonGroup vertical>
        <Button type="primary" @click="handleReceive" hover>Receive</Button>
      </ButtonGroup>
    </div>
    <Notification v-if="clipboardNotification" :title="`Copied!`" :icon="`check`" />
    <Notification v-if="notification" :title="notificationText" :size="300" :icon="`warning2`" />
  </div>
</template>

<script>
import Vue from 'vue';
import VueQRCodeComponent from 'vue-qrcode-component';
import Notification from './Notification.vue';
import Identicon from '../content/Identicon.vue';
import Button from '../buttons/Button.vue';
import ButtonGroup from '../buttons/ButtonGroup.vue';
import Icon from '../icons/Icon.vue';

export default Vue.extend({
  components: { Identicon, ButtonGroup, Button, VueQRCodeComponent, Notification, Icon },
  data() {
    return {
      clipboardNotification: false,
      notification: false,
      notificationText: '',
      editNick: false,
      nick: this.$store.state.accounts.nick,
    };
  },

  watch: {
    clipboardNotification(state) {
      if (state) {
        setTimeout(() => {
          const time = (this.clipboardNotification = !state);
          return () => {
            clearTimeout(time);
          };
        }, 2000);
      }
    },
  },
  methods: {
    handleBack(event) {
      if (event.eventPhase === 2) {
        this.$emit('cancel', 'accountDetailModal');
      }
    },
    handleButtonOK() {
      this.$emit('cancel', 'accountDetailModal');
    },
    handleReceive() {
      this.$router.push({ name: 'receive' });
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      this.clipboardNotification = true;
    },
    async changeNick() {
      if (this.nick.length < 12 && this.nick.length !== 0) {
        this.$store.commit('accounts/setNick', this.nick);
        this.editNick = false;
      } else if (this.nick.length < 1) {
        this.notification = true;
        this.notificationText = `Nickname must be at least 1 `;
      } else {
        this.notification = true;
        this.notificationText = `Nickname must be less than 12`;
      }
    },
    handleEdit() {
      this.editNick = true;
    },
  },
});
</script>

<style lang="scss">
.account_detail_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  .account_detail_wrapper {
    width: 317px;
    height: 410px;
    position: absolute;
    left: 28px;
    top: 85px;
    background: #ffffff;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      margin-top: 20px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 500;
      font-size: 17px;
      line-height: 21px;
      display: flex;
      align-items: center;
      text-align: center;

      color: #000000;
    }
    .flex-row {
      display: flex;
      margin-top: 25px;
      margin-bottom: 15px;
      align-items: center;

      .account_info_nickname_text {
        margin-left: 5px;
        word-break: break-all;
      }
      .account_info_nickname_input {
        border-width: 0.1px;
        padding: 4px;
        width: 110px;
        border-radius: 4px;
      }
      .account_info_nickname_input:focus {
        border-width: 1px;
      }
      .account_info_nickname_button {
        margin-left: 4px;
        cursor: pointer;
      }
    }
    .address_wrapper {
      margin-top: 15px;
      margin-bottom: 15px;
      width: 251px;
      /* Primary/Blue02 */
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ecf8fd;
      border-radius: 8px;
      .address {
        padding: 12px;
        cursor: pointer;
        word-break: break-all;
        /* Caption/C1_line */

        font-family: 'Outfit';
        font-style: normal;
        font-weight: 300;
        font-size: 14.5px;
        line-height: 19px;
        letter-spacing: -0.333333px;
        text-decoration-line: underline;

        /* Primary/Blue01 */

        color: #279ecc;
      }
    }
    .button {
      width: 289px;
    }
    .button-group-vertical {
    }
  }
}
</style>
