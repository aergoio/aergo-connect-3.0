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
        <div class="network_wrapper">
          <div class="network_circle" />
          <div class="network_text">{{ $store.state.accounts.network }}</div>
        </div>
        <TextField
          placeholder="Name / Symbol / Address"
          class="network_textField"
          @input="search"
        />

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
                  <Identicon :text="result.hash" class="list_icon" />
                  <span class="list_text">
                    {{ result.meta.name + '    ' + result.meta.symbol }}
                  </span>
                  <span class="list_button">
                    {{ result.meta.type }}
                  </span>
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
            <div class="network_text">{{ $store.state.accounts.network }}</div>
          </div>
          <div class="custom_detail_wrapper">
            <div>
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
                <div>Asset Type</div>
                <TextField placeholder="Token" class="asset_type" />
              </div>
              <div class="custom_element_wrapper">
                <div>Symbol</div>
                <TextField placeholder="BAL" class="asset_type" />
              </div>
              <div class="custom_element_wrapper">
                <div>Decimal</div>
                <TextField placeholder="18" class="asset_type" />
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
      <Button v-if="state === `custom` && !check" type="primary" size="large" @click="handleCheck"
        >Check
      </Button>
      <Button
        v-else-if="state === `custom` && check"
        type="primary"
        size="large"
        @click="customSubmit"
        >Import</Button
      >
    </template>
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import TextField from '@aergo-connect/lib-ui/src/forms/TextField.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import Identicon from '@aergo-connect/lib-ui/src/content/Identicon.vue';
import ImportAssetModal from '@aergo-connect/lib-ui/src/modal/ImportAssetModal.vue';

export default Vue.extend({
  components: {
    Header,
    ScrollView,
    TextField,
    Button,
    Identicon,
    ImportAssetModal,
  },
  data() {
    return {
      importAssetModal: false,
      results: {},
      state: 'search',
      error: {
        state: true,
        value: '',
      },
      value: '',
      check: false,
      token: [],
    };
  },
  watch: {
    value() {
      if (this.value === this.$store.state.accounts.address) {
        this.error = { state: false, value: '' };
      } else {
        this.error = { state: true, value: 'Please check the address again.' };
      }
    },
  },
  methods: {
    handleBack() {
      this.$router.push({
        name: 'accounts-list',
        params: {
          address: this.$store.state.accounts.address,
        },
      });
    },

    async search(query) {
      console.log('Search', query);
      await fetch(
        `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/token?q=*${query}*`,
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          this.results = data.hits;
        });

      console.log('Results', this.results);
    },

    async select(token) {
      console.log('Selected', token.meta);

      this.token = Object.values(token);

      this.$store.dispatch('accounts/addToken', token);
      this.$store.dispatch('session/initState');

      this.importAssetModal = true;
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
    handleCheck() {
      if (!this.error.state) {
        this.check = true;
      } else {
        console.log('Please check the address again.');
      }
    },
    // customSubmit() {
    //   console.log(this.value, 'submit');
    //   this.importAssetModal = true;
    // },
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
          width: 42px;
          height: 42px;
          border-radius: 50%;
        }
        .list_text {
          display: flex;
          /* Subtitle/S3 */
          width: 250px;
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: -0.333333px;
          margin-left: 12px;
          /* Grey/07 */

          color: #454344;
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
      opacity: 0.5;
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
