<template>
  <ScrollView orientation="horizontal">
    <LoadingIndicator
      :style="{ position: 'absolute', zIndex: 10, top: 0, bottom: 0, left: 0, right: 0 }"
      v-if="isLoading"
      :size="56"
    />
    <Header
      button="back"
      :title="$store.state.session.option === 'token' ? `Import Asset` : `Import NFT`"
      @backClick="handleBack"
    />
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
          <div :class="`network_circle ${$store.state.accounts.network}`" />
          <div class="network_text">
            {{ `AERGO ${$store.state.accounts.network.toUpperCase()}` }}
          </div>
        </div>

        <div>{{ $store.state.session.option === 'nft' ? `Step1: Search NFT Group` : `` }}</div>
        <TextField
          placeholder="Name / Symbol"
          class="network_textField"
          @input="search"
          :value="inputTextField"
        />

        <ul class="select_token_content">
          <div v-if="results.length">
            <ul v-if="!importNftStep2">
              <div class="select_token_text">
                {{
                  $store.state.session.option === 'token'
                    ? `Select the Token Asset`
                    : `Select the NFT Group`
                }}
              </div>
              <li
                v-for="result in results"
                :key="result.hash"
                class="select_token_list"
                @click="() => select(result)"
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
            <div :style="{ marginTop: '10px' }" v-if="importNftStep2">
              <div>Step2: Input NFT ID</div>
              <TextField placeholder="NFT ID" class="network_textField" @input="inputNftId" />
              <Button class="import_nft_button" @click="importNFT" type="primary" hover size="large"
                >Import NFT</Button
              >
              <ImportAssetModal v-if="importSuccessNft" :token="token" :nftData="nftData" />
              <Notification
                v-if="notification"
                :title="notificationText"
                :size="300"
                :icon="`warning2`"
              />
            </div>
          </div>
          <div v-else-if="results.length === 0 && inputTextField">{{ `No Searched Data` }}</div>
        </ul>
      </div>

      <div v-if="state === `custom`">
        <div class="custom_wrapper">
          <div class="network_wrapper">
            <div :class="`network_circle ${$store.state.accounts.network}`" />
            <div class="network_text">
              {{ `AERGO ${$store.state.accounts.network.toUpperCase()}` }}
            </div>
          </div>
          <div class="custom_detail_wrapper">
            <Notification
              v-if="notification"
              :title="notificationText"
              :size="300"
              :icon="`warning2`"
            />
            <div v-if="!check">
              <div>Step1: Check Contract Address</div>
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
                <div>Step1: Check Contract Address</div>
                <TextField placeholder="Contract Address" class="asset_type" :value="value" />
              </div>
              <div :style="{ marginTop: '10px' }">
                <div>Step2: Input NFT ID</div>
                <TextField placeholder="NFT ID" class="network_textField" @input="inputNftId" />
                <ImportAssetModal v-if="importSuccessNft" :token="token" :nftData="nftData" />
                <Notification
                  v-if="notification"
                  :title="notificationText"
                  :size="300"
                  :icon="`warning2`"
                />
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
        class="token_content_button"
        type="primary"
        size="large"
        @click="handleCheck"
        :disabled="!value"
        hover
        >Check
      </Button>
      <Button
        v-else-if="state === `custom` && check"
        class="token_content_button"
        type="primary"
        size="large"
        @click="importNFT"
        hover
        >Import NFT</Button
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
import ImportAssetModal from '@aergo-connect/lib-ui/src/modal/ImportAssetModal.vue';
import Notification from '@aergo-connect/lib-ui/src/modal/Notification.vue';
import LoadingIndicator from '@aergo-connect/lib-ui/src/icons/LoadingIndicator.vue';
import { useQueryContract } from '../utils/useQueryContract';
import { isPublicChainId, PublicChainData } from '../config';

export default Vue.extend({
  components: {
    Icon,
    Header,
    ScrollView,
    TextField,
    Button,
    ImportAssetModal,
    Notification,
    LoadingIndicator,
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
      importNftStep2: false,
      inputTextField: '',
      userInputNftId: '',
      nftData: {},
      importSuccessNft: false,
      isAddedNft: {},
      imgUrl: '',
      isLoading: false,
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
    importNftStep2() {
      this.inputTextField = this.token.meta.name;
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
  updated() {
    console.log(this.results, 'results');
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
      this.importNftStep2 = false;
      if (this.$store.state.session.option === 'token') {
        await fetch(
          `https://${prefix}.aergoscan.io/${
            this.$store.state.accounts.network
          }/v2/token?q=(name_lower:*${query.toLowerCase()}* OR symbol_lower:*${query.toLowerCase()}*) AND type:ARC1`,
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
          `https://${prefix}.aergoscan.io/${
            this.$store.state.accounts.network
          }/v2/nft?q=(name_lower:*${query.toLowerCase()}* OR symbol_lower:*${query.toLowerCase()}*) AND type:ARC2`,
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
      console.log(token.meta);
      this.token = token;
      await this.$store.dispatch('accounts/addToken', token);
      if (token.meta.type === 'ARC1') {
        this.importAssetModal = true;
      } else if (token.meta.type === 'ARC2') {
        this.importNftStep2 = true;
      }
    },
    inputNftId(nftId) {
      this.userInputNftId = nftId;
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
    async importNFT() {
      this.isLoading = true;
      const resp = await fetch(
        `https://api.aergoscan.io/${this.$store.state.accounts.network}/v2/nftInventory?q=address:${this.token.hash} AND (account:${this.$store.state.accounts.address})&sort=blockno:desc&from=0&size=100`,
      );

      const response = await resp.json();
      const checkLocalStorageNftId = JSON.parse(
        localStorage.getItem(
          `${this.$store.state.accounts.address}_${this.$store.state.accounts.network}_${this.token.hash}`,
        ) || '[]',
      );
      this.isAddedNft = checkLocalStorageNftId.find((myNft) => {
        if (this.userInputNftId === myNft.meta.token_id) {
          return myNft;
        }
      });
      if (response.error) {
        this.nftData = {};
        this.notification = true;
        this.notificationText = `Error: ${JSON.stringify(response.error)}`;
        return;
      } else {
        if (response.hits.length === 0) {
          this.notification = true;
          this.notificationText = `No Nft in this Wallet`;
          this.isLoading = false;
          return;
        }
        if (this.isAddedNft?.meta?.token_id) {
          this.notification = true;
          this.notificationText = `Already Added NFT`;
          this.isLoading = false;
          return;
        }
        const filteredNft = response.hits.filter((nftData) => {
          if (this.userInputNftId === nftData.meta.token_id) {
            return nftData;
          }
        });
        if (filteredNft.length === 0) {
          this.notification = true;
          this.notificationText = `Check Your NFT ID`;
          this.isLoading = false;
          return;
        } else {
          const args = [filteredNft[0].meta.token_id, 'image_url'].flat();
          const img_url = await this.getNftDataInHera(
            'get_metadata',
            filteredNft[0].meta.address,
            args,
          );
          if (img_url) {
            const addImgNft = {
              ...filteredNft[0],
              meta: { ...filteredNft[0].meta, img_url },
            };
            console.log(addImgNft, 'addImgNft!@#!@#@!#@!#');
            await this.$store.commit('session/addNftToLocalStorage', addImgNft);
            this.token = addImgNft.token;
            this.nftData = addImgNft.meta;
            this.isLoading = false;
            this.importSuccessNft = true;
            return;
          } else {
            await this.$store.commit('session/addNftToLocalStorage', filteredNft[0]);
            this.token = filteredNft[0].token;
            this.nftData = filteredNft[0].meta;
            this.isLoading = false;
            this.importSuccessNft = true;
          }
        }
      }

      // this.isLoading = false;
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

    // async customSubmit() {
    //   await this.$store.dispatch('accounts/addToken', this.token);
    //   await this.$store.dispatch('session/initState');

    //   this.importAssetModal = true;
    // },
    async getNftDataInHera(method, contractAddress, args) {
      try {
        const isPublic = await isPublicChainId(this.$store.state.accounts.network);
        const nodeURL = await PublicChainData[this.$store.state.accounts.network]['nodeUrl'];
        const imgUrl = isPublic
          ? await useQueryContract(nodeURL, method, contractAddress, args)
          : null;
        return imgUrl;
      } catch (e) {
        console.log(this.token, 'token!!');
        console.error(e, 'error Log');
      }
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
    .token_content_button {
      margin-top: 220px;
    }
    .import_nft_button {
      margin-top: 220px;
    }
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
    &.mainnet {
      background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
    }
    &.testnet {
      background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
    }
    &.alpha {
      background: linear-gradient(133.72deg, #84ceeb 0%, #f894c8 100%);
    }
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
