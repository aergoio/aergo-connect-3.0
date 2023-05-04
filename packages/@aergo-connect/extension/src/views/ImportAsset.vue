<template>
  <ScrollView orientation="horizontal">
    <LoadingIndicator
      :style="{ position: 'absolute', zIndex: 10, top: 0, bottom: 0, left: 0, right: 0 }"
      v-if="isLoading"
      :size="56"
    />
    <Header
      button="back"
      :title="$store.state.accounts.option === 'token' ? `Import Asset` : `Import NFT`"
      @backClick="handleBack"
    />
    <div class="tab_content">
      <div class="tab_wrapper">
        <div
          :class="[tabState === `search` ? `tab_active` : `tab_disable`]"
          @click="handleChangeState('search')"
        >
          <div class="tab_text">Search</div>
          <div class="tab_line" />
        </div>
        <div
          :class="[tabState === `custom` ? `tab_active` : `tab_disable`]"
          @click="handleChangeState('custom')"
        >
          <div class="tab_text">Custom</div>
          <div class="tab_line" />
        </div>
      </div>
      <ImportAssetModal v-if="importAssetModal" :token="token" />
      <div v-if="tabState === `search`" class="search_wrapper">
        <Notification
          v-if="notification"
          :title="notificationText"
          :size="300"
          :icon="`warning2`"
        />
        <div class="network_wrapper">
          <!-- <div :class="`network_circle ${$store.state.accounts.chainId}`" /> -->
          <div class="network_text">
            {{ `${$store.state.accounts.chainId.toUpperCase()}` }}
          </div>
        </div>

        <div>{{ $store.state.accounts.option === 'nft' ? `Step1: Search NFT Group` : `` }}</div>
        <TextField
          placeholder="Name / Symbol"
          class="network_textField"
          @input="search"
          :value="inputTextField"
        />

        <ul class="select_token_content">
          <div v-if="results.length > 0">
            <ul v-if="!importNftStep2">
              <div class="select_token_text">
                {{
                  $store.state.accounts.option === 'token'
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
              <TextField
                placeholder="NFT ID"
                class="network_textField"
                @input="inputNftId"
                :value="userInputNftId"
              />
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
          <div
            v-else-if="results.length === 0 && inputTextField && !importNftStep2"
            :style="{ color: 'red' }"
          >
            {{ `No Searched Data` }}
          </div>
        </ul>
      </div>

      <div v-if="tabState === `custom`">
        <div class="custom_wrapper">
          <div class="network_wrapper">
            <!-- <div :class="`network_circle ${$store.state.accounts.chainId}`" /> -->
            <div class="network_text">
              {{ `${$store.state.accounts.chainId.toUpperCase()}` }}
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
                :value="contractAddress"
                @input="handleInput"
                :error="error.value"
                identicon
              />
            </div>
            <div v-if="check">
              <div class="custom_element_wrapper">
                <div>Check Contract Address</div>
                <TextField
                  placeholder="Contract Address"
                  class="asset_type"
                  :value="contractAddress"
                  identicon
                />
              </div>
              <div v-if="$store.state.accounts.option === 'token'" :style="{ marginTop: '15px' }">
                <div :style="{ display: 'flex', flexDirection: 'column' }">
                  <div>Asset Type</div>
                  <TextField disabled :value="token.meta.type" />
                  <div :style="{ marginTop: '10px' }">Symbol</div>
                  <TextField disabled :value="token.meta.symbol" />
                  <div :style="{ marginTop: '10px' }">Decimals</div>
                  <TextField disabled :value="token.meta.decimals" />
                </div>
                <!-- <TextField placeholder="NFT ID" class="network_textField" @input="inputNftId" />
                <ImportAssetModal v-if="importSuccessNft" :token="token" :nftData="nftData" /> -->
                <Notification
                  v-if="notification"
                  :title="notificationText"
                  :size="300"
                  :icon="`warning2`"
                />
              </div>
              <div v-if="$store.state.accounts.option === 'nft'" :style="{ marginTop: '15px' }">
                <div>Step2: Input NFT ID</div>
                <TextField
                  placeholder="NFT ID"
                  class="network_textField"
                  @input="inputNftId"
                  :value="customInputNftId"
                />
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
        v-if="tabState === `custom` && !check"
        class="token_content_button"
        type="primary"
        size="large"
        @click="handleCheck"
        :disabled="!contractAddress"
        hover
        >Check
      </Button>

      <Button
        v-else-if="tabState === `custom` && check && $store.state.accounts.option === 'token'"
        class="token_content_button"
        type="primary"
        size="large"
        @click="importAsset"
        hover
        >Import Asset
      </Button>

      <Button
        v-else-if="tabState === `custom` && check && $store.state.accounts.option === 'nft'"
        class="token_content_button"
        type="primary"
        size="large"
        @click="importNFT"
        hover
        >Import NFT
      </Button>
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
import { getContractMethodResult } from '../utils/getContractMethodResult';
import { Identicon } from '@aergo-connect/lib-ui/src/content';
import { isPublicChainId, PublicChainData } from '../config';
import { debounce } from 'lodash';
import { getScanApiUrl } from '../utils/chain-urls';

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
    Identicon,
  },
  data() {
    return {
      importAssetModal: false,
      notification: false,
      notificationText: '',
      results: [],
      tabState: 'search',
      error: {
        state: true,
        value: '',
      },
      contractAddress: '',
      check: false,
      token: {},
      hasTokenCheck: false,
      importNftStep2: false,
      inputTextField: '',
      userInputNftId: '',
      customInputNftId: '',
      nftData: {},
      importSuccessNft: false,
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
    inputTextField() {
      if (!this.importNftStep2) {
        this.search(this.inputTextField);
      }
    },
    // userInputNftId() {
    //   this.token = this.checkScanApi(network, `nft`, this.contractAddress)[0];
    // },
  },
  beforeMount() {
    if (this.$store.state.ui.input[`importAsset`][`tab`]) {
      this.tabState = this.$store.state.ui.input[`importAsset`][`tab`];
    }
    if (this.$store.state.ui.input[`importAsset`][`contractAddress`]) {
      this.contractAddress = this.$store.state.ui.input[`importAsset`][`contractAddress`];
      this.check = this.$store.state.ui.input[`importAsset`][`isContractAddressChecked`];
    }
    if (this.$store.state.ui.input[`importAsset`][`searchQuery`]) {
      this.inputTextField = this.$store.state.ui.input[`importAsset`][`searchQuery`];
      this.importNftStep2 = this.$store.state.ui.input[`importAsset`][`importNftStep2`];
    }
    if (this.$store.state.ui.input[`importAsset`][`results`]) {
      this.results = this.$store.state.ui.input[`importAsset`][`results`];
    }
    if (this.$store.state.ui.input[`importAsset`][`nftId`]) {
      this.userInputNftId = this.$store.state.ui.input[`importAsset`][`nftId`];
    }
    if (this.$store.state.ui.input[`importAsset`][`customNftId`]) {
      this.customInputNftId = this.$store.state.ui.input[`importAsset`][`customNftId`];
    }
    if (this.$store.state.ui.input[`importAsset`][`importedToken`]) {
      this.token = JSON.parse(this.$store.state.ui.input[`importAsset`][`importedToken`]);
    }
  },
  updated() {
    this.$store.commit('ui/setInputs', {
      key: 'importAsset',
      data: {
        contractAddress: this.contractAddress,
        isContractAddressChecked: this.check,
        tab: this.tabState,
        searchQuery: this.inputTextField,
        importNftStep2: this.importNftStep2,
        results: this.results,
        nftId: this.userInputNftId,
        customNftId: this.customInputNftId,
        importedToken: JSON.stringify(this.token),
      },
    });
  },
  computed: {
    getTokens() {
      return this.$store.getters[`accounts/getTokens`];
    },
    getNodeUrl() {
      const nodeUrl = this.$store.state.accounts.networksPath.filter(
        (network) => network.chainId === this.$store.state.accounts.chainId,
      )[0].nodeUrl;
      return nodeUrl;
    },
  },
  methods: {
    handleBack() {
      this.$store.commit('ui/clearInput', { key: 'importAsset' });
      this.$router.push({
        name: 'accounts-list',
        params: {},
      });
    },

    fetchToScan: debounce(function (query, tokenType) {
      this.inputTextField = query;
      const scanApiUrl = getScanApiUrl(this.$store.state.accounts);
      const searchTokenListUrl = `${scanApiUrl}/token?q=(name_lower:*${query.toLowerCase()}* OR symbol_lower:*${query.toLowerCase()}*) AND type:${tokenType}`;

      fetch(searchTokenListUrl)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // console.log(data, 'data?');
          this.results = [...data.hits];
          // console.log(this.results, 'this.results');
        });
    }, 500),

    search(query) {
      this.importNftStep2 = false;
      this.userInputNftId = '';

      if (this.$store.state.accounts.option === 'token') {
        this.fetchToScan(query, 'ARC1');
      } else {
        this.fetchToScan(query, 'ARC2');
      }
    },
    async select(token) {
      this.token = token;
      this.inputTextField = token.meta.name;
      this.contractAddress = token.hash;
      if (token.meta.type === 'ARC1') {
        if ([token.hash]?.hash) {
          this.notification = true;
          this.notificationText = `Already Added ARC1 Token`;
        } else {
          await this.$store.dispatch('accounts/addToken', token);
          this.importAssetModal = true;
        }
      } else if (token.meta.type === 'ARC2') {
        this.importNftStep2 = true;
      }
    },
    inputNftId(nftId) {
      if (this.tabState === 'search') {
        this.userInputNftId = nftId;
      }
      if (this.tabState === 'custom') {
        this.customInputNftId = nftId;
      }
    },
    handleChangeState(tab) {
      this.tabState = tab;
    },
    handleImport() {
      this.importAssetModal = true;
    },
    handleInput(contractAddress) {
      this.contractAddress = contractAddress;
    },

    checkScanApi(tokenType, contractAddress) {
      const scanApiUrl = getScanApiUrl(this.$store.state.accounts);
      const checkScanApiUrl = `${scanApiUrl}/${tokenType}?q=_id:${contractAddress}`;
      fetch(checkScanApiUrl)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          return data.hits[0];
        });
    },

    async handleCheck() {
      try {
        if (this.$store.state.accounts.option === 'token') {
          this.token = await this.checkScanApi(`token`, this.contractAddress);
        } else {
          this.token = await this.checkScanApi(`nft`, this.contractAddress);
        }
        this.check = true;
      } catch (e) {
        console.error(e, 'errorlog');
        this.check = false;
        this.notification = true;
        this.notificationText = `Please Check Contract Address.`;
      }
    },
    async importNFT() {
      this.isLoading = true;

      try {
        const scanApiUrl = getScanApiUrl(this.$store.state.accounts);
        const getNftInventoryUrl = `${scanApiUrl}/nftInventory?q=address:${this.contractAddress} AND (account:${this.$store.state.accounts.address})&sort=blockno:desc&from=0&size=100`;
        const resp = await fetch(getNftInventoryUrl);
        const response = await resp.json();
        const filteredNft = response.hits.filter(
          (nft) =>
            nft.meta.token_id ===
            (this.tabState === 'search' ? this.userInputNftId : this.customInputNftId),
        );
        console.log(filteredNft, 'filteredNft');
        if (filteredNft.length === 0) {
          this.notification = true;
          this.notificationText = `Check Your NFT ID`;
        } else {
          const nftId = filteredNft[0].meta.token_id;
          console.log(nftId, 'nftId');
          const img_url = await this.getNftImageUrl('get_metadata', filteredNft[0].meta.address, [
            nftId,
            'image_url',
          ]);
          console.log(img_url, 'img_url');
          const addImgNft = { ...filteredNft[0], meta: { ...filteredNft[0].meta, img_url } };
          this.token = addImgNft.token;
          this.nftData = addImgNft.meta;
          const checkLocalStorageNftId = this.getTokens[this.contractAddress]?.nftWallet || [];
          if (checkLocalStorageNftId.some((myNft) => myNft.meta.token_id === nftId)) {
            this.notification = true;
            this.notificationText = `Already Added ARC2 NFT`;
          } else {
            if (checkLocalStorageNftId.length === 0) {
              // console.log(addImgNft, 'addImgNft');
              await this.$store.dispatch('accounts/addToken', {
                ...addImgNft.token,
                dropdownState: true,
                nftWallet: [],
              });
              // await this.$store.dispatch('accounts/initState');
            }
            await this.$store.commit('accounts/addNftToLocalStorage', addImgNft);
            this.importSuccessNft = true;
          }
        }
      } catch (error) {
        console.error(error);
        this.nftData = {};
        this.notification = true;
        this.notificationText = `Error: ${JSON.stringify(error)}`;
      } finally {
        this.isLoading = false;
      }
    },
    // async importNFT() {
    //   this.isLoading = true;

    //   try {
    //     const scanApiUrl = getScanApiUrl(this.$store.state.accounts);
    //     const getNftInventoryUrl = `${scanApiUrl}/nftInventory?q=address:${this.contractAddress} AND (account:${this.$store.state.accounts.address})&sort=blockno:desc&from=0&size=100`;
    //     const resp = await fetch(getNftInventoryUrl);
    //     const response = await resp.json();
    //     if (response.hits.length === 0) {
    //       this.notification = true;
    //       this.notificationText = `No Nft in this Wallet`;
    //       this.isLoading = false;
    //       return;
    //     }

    //     const filteredNft = response.hits.filter((nft) => {
    //       if (this.tabState === 'search') {
    //         if (nft.meta.token_id === this.userInputNftId) {
    //           return nft;
    //         }
    //       } else {
    //         if (nft.meta.token_id === this.customInputNftId) {
    //           return nft;
    //         }
    //       }
    //     });

    //     if (!this.getTokens[this.contractAddress]) {
    //       await this.$store.dispatch('accounts/addToken', {
    //         ...filteredNft[0].token,
    //         nftWallet: [],
    //       });
    //       await this.$store.dispatch('accounts/initState');
    //     }

    //     const checkLocalStorageNftId = await this.getTokens[this.contractAddress][`nftWallet`];

    //     if (checkLocalStorageNftId.length > 0) {
    //       const isAddedNft = checkLocalStorageNftId.find((myNft) => {
    //         if (this.tabState === 'search') {
    //           if (this.userInputNftId === myNft.meta.token_id) {
    //             return myNft;
    //           }
    //         } else {
    //           if (this.customInputNftId === myNft.meta.token_id) {
    //             return myNft;
    //           }
    //         }
    //       });
    //       if (isAddedNft?.meta?.token_id) {
    //         this.notification = true;
    //         this.notificationText = `Already Added ARC2 NFT`;
    //         this.isLoading = false;
    //         return;
    //       }
    //     }
    //     if (filteredNft.length === 0) {
    //       this.notification = true;
    //       this.notificationText = `Check Your NFT ID`;
    //       this.isLoading = false;
    //       return;
    //     } else {
    //       const args = [filteredNft[0].meta.token_id, 'image_url'].flat();
    //       const img_url = await this.getNftDataInHera(
    //         'get_metadata',
    //         filteredNft[0].meta.address,
    //         args,
    //       );
    //       console.log(img_url, 'img_url?');
    //       if (img_url) {
    //         const addImgNft = {
    //           ...filteredNft[0],
    //           meta: { ...filteredNft[0].meta, img_url },
    //         };
    //         console.log(addImgNft, 'addImgNft?');
    //         this.token = addImgNft.token;
    //         this.nftData = addImgNft.meta;
    //         await this.$store.commit('accounts/addNftToLocalStorage', addImgNft);
    //       } else {
    //         console.log('here', filteredNft[0]);
    //         this.token = filteredNft[0].token;
    //         this.nftData = filteredNft[0].meta;
    //         await this.$store.commit('accounts/addNftToLocalStorage', filteredNft[0]);
    //       }
    //       this.isLoading = false;
    //       this.importSuccessNft = true;
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     this.nftData = {};
    //     this.notification = true;
    //     this.notificationText = `Error: ${JSON.stringify(error)}`;
    //     this.isLoading = false;
    //     return;
    //   }
    //   this.isLoading = false;
    // },

    async importAsset() {
      if (this.getTokens[this.token.hash]?.hash) {
        this.notification = true;
        this.notificationText = `Already Added ARC1 Token`;
      } else {
        await this.$store.dispatch('accounts/addToken', this.token);
        this.importAssetModal = true;
      }
    },

    async getNftImageUrl(method, contractAddress, args) {
      try {
        const imgUrl = await getContractMethodResult(
          this.getNodeUrl,
          method,
          contractAddress,
          args,
        );
        return imgUrl;
      } catch (e) {
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
  .select_token_content {
    width: 375px;
    margin-top: 15px;
    .token_content_button {
      margin-top: 220px;
    }
    .import_nft_button {
      margin-top: 219px;
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
      /* margin-top: 5px; */
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
