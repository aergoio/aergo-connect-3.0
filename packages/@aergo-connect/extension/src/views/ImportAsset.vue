<template>
  <ScrollView orientation="horizontal">
    <Header button="back" title="Import Asset" @backClick="handleBack" />
    <div class="tab_content">
      <div class="tab_wrapper">
        <div
          :class="[state === `search` ? `tab_active` : `tab_disable`]"
          @click="handleChangeState('search')"
        >
          <div class="tab_text">Search</div>
          <div class="tab_line" />
        </div>
        <div
          :class="[state === `custom` ? `tab_active` : `tab_disable`]"
          @click="handleChangeState('custom')"
        >
          <div class="tab_text">Custom</div>
          <div class="tab_line" />
        </div>
      </div>
      <ImportAssetModal v-if="importAssetModal" :token="token" />
      <div v-if="state === `search`" class="search_wrapper">
        <Notification
          v-if="notification"
          :title="notificationText"
          :size="300"
          :icon="`warning2`"
        />
        <div class="network_wrapper">
          <div class="network_circle" />
          <div class="network_text">{{ $store.state.accounts.network.toUpperCase() }}</div>
        </div>
        <TextField placeholder="Name / Symbol" class="network_textField" @input="search" />

        <ul class="select_token_content">
          <div v-if="results.length">
            <div class="select_token_text">Select the token or NFT.</div>
            <ul>
              <li
                v-for="result in results"
                :key="result.hash"
                class="select_token_list"
                @click="select(result)"
              >
                <div class="token_list_wrapper">
                  <img v-if="result.meta.image" class="list_icon" :src="result.meta.image" />
                  <Icon v-else class="list_icon" :name="`defaultToken`" />
                  <div :style="{ width: '240px', display: 'flex', 'flex-direction': 'column' }">
                    <span class="list_text">
                      {{ `${result.meta.name} (${result.meta.symbol})` }}
                    </span>
                    <span class="list_text hash">{{
                      `[${result.hash.slice(0, 11)}........${result.hash.slice(-11)}]`
                    }}</span>
                  </div>
                  <div>
                    <span class="list_button">
                      {{ result.meta.type }}
                    </span>
                    <Icon v-if="hasTokenCheck" :name="`check`" />
                  </div>
                </div>
                <div class="line" />
              </li>
            </ul>
          </div>
        </ul>
      </div>

      <div v-if="state === `custom`">
        <div class="custom_wrapper">
          <div class="network_wrapper">
            <div class="network_circle" />
            <div class="network_text">{{ $store.state.accounts.network.toUpperCase() }}</div>
          </div>
          <div class="custom_detail_wrapper">
            <Notification
              v-if="notification"
              :title="notificationText"
              :size="300"
              :icon="`warning2`"
            />
            <div v-if="!check">
              <div>Contract Address</div>
              <TextField
                placeholder="Enter the address"
                class="contract_address"
                :value="value"
                @input="handleInput"
                :error="error.value"
              />
            </div>
            <div v-if="check">
              <div class="custom_element_wrapper">
                <div>Contract Address</div>
                <TextField disabled :placeholder="value" class="asset_type" />
              </div>

              <div class="custom_element_wrapper">
                <div>Asset Type</div>
                <TextField disabled :placeholder="token.meta.type" class="asset_type" />
              </div>
              <div class="custom_element_wrapper">
                <div>Symbol</div>
                <TextField disabled v-model="token.meta.symbol" class="asset_type" />
              </div>
              <div v-if="token.meta.type !== 'ARC2'" class="custom_element_wrapper">
                <div>Decimal</div>
                <TextField disabled :placeholder="token.meta.decimals" class="asset_type" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <!-- <Button v-if="state === `search`" type="primary" size="large" @click="handleImport"
        >Import</Button
      > -->
      <Button
        v-if="state === `custom` && !check"
        type="primary"
        size="large"
        @click="handleCheck"
        :disabled="!value"
        hover
        >Check
      </Button>
      <Button
        v-else-if="state === `custom` && check"
        type="primary"
        size="large"
        @click="customSubmit"
        hover
        >Import</Button
      >
    </template>
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import TextField from '@aergo-connect/lib-ui/src/forms/TextField.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import Identicon from '@aergo-connect/lib-ui/src/content/Identicon.vue';
import ImportAssetModal from '@aergo-connect/lib-ui/src/modal/ImportAssetModal.vue';
import Notification from '@aergo-connect/lib-ui/src/modal/Notification.vue';
export default Vue.extend({
  components: {
    Icon,
    Header,
    ScrollView,
    TextField,
    Button,
    Identicon,
    ImportAssetModal,
    Notification,
  },
  data() {
    return {
      importAssetModal: false,
      notification: false,
      notificationText: '',
      results: [],
      state: 'search',
      error: {
        state: true,
        value: '',
      },
      value: '',
      check: false,
      token: {},
      hasTokenCheck: false,
    };
  },
  watch: {
    notification(state) {
      if (state) {
        setTimeout(() => {
          const time = (this.notification = !state);
          return () => {
            clearTimeout(time);
          };
        }, 2000);
      }
    },
    /*
    value() {
      if (this.value === this.$store.state.accounts.address) {
        this.error = { state: false, value: '' };
      } else {
        this.error = { state: true, value: 'Please check the address again.' };
      }
    },
*/
  },
  methods: {
    handleBack() {
      this.$router.push({
        name: 'accounts-list',
        params: {},
      });
    },

    async search(query) {
      const prefix = this.$store.state.accounts.network === 'alpha' ? 'api-alpha' : 'api';

      if (this.$store.state.session.option === 'token') {
        await fetch(
          `https://${prefix}.aergoscan.io/${this.$store.state.accounts.network}/v2/token?q=(name:*${query}* OR symbol:*${query}*) AND type:ARC1`,
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            this.results = [...data.hits];
          });
        if (this.results) return;
      } else {
        await fetch(
          `https://${prefix}.aergoscan.io/${this.$store.state.accounts.network}/v2/nft?q=(name:*${query}* OR symbol:*${query}*) AND type:ARC2`,
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            this.results = [...data.hits];
          });

        console.log('Results', this.results);
      }
    },

    async select(token) {
      console.log('Selected', token.meta);

      console.log(token, 'token!!!!!!!!!!!!!!!!!!!!!');
      if (this.$store.state.session.tokens[token.hash]?.hash) {
        this.notification = true;
        this.notificationText = `Token already added.`;
      } else {
        this.token = token;
        await this.$store.dispatch('accounts/addToken', token);
        await this.$store.dispatch('session/initState');
        this.importAssetModal = true;
      }
    },

    async custom() {
      console.log('custom');
    },
    handleChangeState(state) {
      this.state = state;
    },
    handleImport() {
      this.importAssetModal = true;
    },
    handleInput(value) {
      this.value = value;
    },

    async handleCheck() {
      let results = [];
      console.log('fetch', this.value);

      const prefix = this.$store.state.accounts.network === 'alpha' ? 'api-alpha' : 'api';
      if (this.$store.state.session.option === 'token') {
        await fetch(
          `https://${prefix}.aergoscan.io/${this.$store.state.accounts.network}/v2/token?q=_id:${this.value}`,
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            results = [...data.hits];
          });
      } else {
        await fetch(
          `https://${prefix}.aergoscan.io/${this.$store.state.accounts.network}/v2/nft?q=_id:${this.value}`,
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            results = [...data.hits];
          });
      }

      console.log('custum result', results);

      this.token = results[0];
      if (results.length > 0) {
        this.check = true;
      } else {
        this.check = false;
        this.notification = true;
        this.notificationText = `Please Check Contract Address.`;
      }
    },

    async customSubmit() {
      await this.$store.dispatch('accounts/addToken', this.token);
      await this.$store.dispatch('session/initState');

      this.importAssetModal = true;
    },
  },
});
</script>

<style lang="scss">
.header {
  z-index: 1;
}
.tab_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  .select_token_content {
    width: 375px;
    margin-top: 15px;
    ul {
      overflow-y: scroll;
      overflow-x: hidden;
      height: 380px;
    }
    .select_token_text {
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 300;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: -0.333333px;

      /* Grey/06 */

      color: #686767;
    }
    .select_token_list {
      cursor: pointer;
      width: 327px;
      .token_list_wrapper {
        width: 327px;
        height: 62px;
        display: flex;
        align-items: center;
        .list_icon {
          width: 46px;
          height: 46px;
          border-radius: 50%;
        }
        .list_text {
          display: flex;
          /* Subtitle/S3 */

          font-family: 'Outfit';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: -0.333333px;
          margin-left: 10px;
          /* Grey/07 */

          color: #454344;
          &.hash {
            color: #757575;
            font-size: 13px;
            display: none;
            font-weight: 200;
          }
        }
        .list_button {
          margin-right: 5px;
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          line-height: 18px;
          /* identical to box height */

          text-align: right;
          letter-spacing: -0.333333px;

          /* Primary/Blue02 */

          color: #84ceeb;
        }
      }

      .line {
        /* Grey/01 */
        width: 311px;
        height: 1px;
        background: #f0f0f0;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
        margin-left: 10px;
      }
    }
    .select_token_list:hover {
      background: #eff5f7;
      /* opacity: 0.5; */
      .token_list_wrapper {
        .list_text {
          &.hash {
            display: flex;
          }
        }
      }
    }
  }
  .tab_wrapper {
    width: 375px;
    height: 35px;
    display: flex;
    cursor: pointer;
    .tab_active {
      height: 35px;
      .tab_text {
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 7px;
        color: #279ecc;
      }
      .tab_line {
        width: 187px;
        align-items: flex-start;
        border: 2px solid #279ecc;
      }
    }
    .tab_disable {
      .tab_text {
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 7px;
        color: #9c9a9a;
      }
      .tab_line {
        width: 187px;
        color: #9c9a9a;
        border: 1px solid #f0f0f0;
      }
    }
  }
  .search_wrapper {
    width: 327px;
    display: flex;
    flex-direction: column;
    .network_textField {
      width: 327px;
      height: 48px;
      border-radius: 4px;
    }
  }
}
.input-error-text {
  height: 0;
}
.custom_wrapper {
  .custom_detail_wrapper {
    .custom_element_wrapper {
      margin-top: 10px;
    }
  }
}
.network_wrapper {
  margin-top: 20px;
  width: 327px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .network_circle {
    border-radius: 50%;
    background: #e4097d;
    width: 6px;
    height: 6px;
    margin-right: 2px;
  }
  .network_text {
    color: #686767;
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    text-align: center;
    letter-spacing: -0.333333px;
  }
}
</style>
