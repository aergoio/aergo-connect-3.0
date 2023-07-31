<template>
  <ScrollView>
    <Header
      button="hamburger"
      :title="$store.state.accounts.chainLabel"
      refresh
      network
      @hamburgerClick="hamburgerClick"
      @networkModalClick="networkModalClick"
      @refreshClick="refreshClick"
      :isNetworkError="errorMessage !== ''"
      @mouseEnter="handleMouseEnter"
    />
    <LoadingIndicator
      :style="{ position: 'absolute', zIndex: 10, top: 0, bottom: 0, left: 0, right: 0 }"
      v-if="isLoading"
      :size="56"
    />
    <ErrorModal
      v-if="errorModal"
      :errorMessage="errorMessage"
      @cancel="handleCancel"
      @refresh="handleRefresh"
    />
    <NoAccountModal v-if="noAccountModal" @cancel="handleCancel" />
    <PasswordModal v-if="passwordModal" @cancel="handleCancel" @confirm="handleConfirm" />
    <AccountDetailModal v-if="accountDetailModal" @cancel="(e) => handleCancel(e)" />
    <div v-if="!noAccountModal" class="home_content">
      <List
        v-if="hamburgerModal"
        removeAccountModal
        @removeModalClick="handleRemoveModalClick"
        @select="handleSelect"
        @listModalOff="hamburgerClick"
        @securityClick="handleSecurity"
      />
      <div class="account_info_wrapper">
        <span>
          <!-- <Identicon :text="account.data.spec.address" class="circle" /> -->
          <Identicon :text="$store?.state?.accounts?.address" class="account_info_img" />

          <!-- <span v-else-if="isNew(account)" class="account-label account-label-new">new</span> -->
        </span>

        <Notification
          v-if="notification"
          :title="notificationText"
          :size="300"
          :icon="`warning2`"
        />
        <div class="account_info_content_wrapper">
          <div class="account_info_nickname_wrapper">
            <div class="account_info_nickname_text">
              {{ $store?.state?.accounts?.nick }}
            </div>
            <div :style="{ display: 'flex' }">
              <span v-if="account?.data?.type === 'ledger'" class="account-label account-label-usb"
                ><Icon name="usb" :size="17"
              /></span>
            </div>
          </div>
          <div class="account_info_address_wrapper" @click="handleDetailAddress">
            <span class="account_info_address_text">{{
              `${$store?.state?.accounts?.address.slice(
                0,
                15,
              )}...${$store?.state?.accounts?.address.slice(-5)}`
            }}</span>
            <Icon class="account_info_address_button" :name="`next`" :size="50" />
          </div>
        </div>
      </div>
      <NetworkModal v-if="networkModal" @networkModalClick="networkModalClick" />

      <div class="token_content_wrapper">
        <ButtonGroup class="token_nft_button_wrapper">
          <Button
            :class="[tab === `token` ? `token-button` : `token-button unclicked`]"
            type="primary"
            size="small"
            @click="handleChangeTab('token')"
            >Tokens</Button
          >
          <Button
            :class="[tab === `nft` ? `token-button` : `token-button unclicked`]"
            type="primary"
            size="small"
            @click="handleChangeTab('nft')"
            >NFT</Button
          >
        </ButtonGroup>
        <ul
          v-if="tab === `token`"
          :class="[tokensCount > 4 ? 'token_list_ul scroll' : 'token_list_ul']"
        >
          <li
            v-for="token in getTokens"
            class="token_list_li"
            :key="token.hash"
            @click="handleToken(token)"
          >
            <div v-if="token?.meta?.type !== 'ARC2'" class="token_list_wrapper">
              <div class="token_list_row">
                <Icon
                  v-if="token?.meta?.type === 'AERGO'"
                  class="token_list_icon"
                  :name="`aergo`"
                />
                <img
                  v-else-if="token?.meta?.image"
                  class="token_list_icon"
                  :src="token?.meta?.image"
                  alt="404"
                />
                <Icon v-else class="token_list_icon" :name="`defaultToken`" />
                <div class="token_list_amount">
                  <div>
                    <span
                      :class="[
                        token?.meta?.name.length > 12
                          ? 'token_list_text wordbreak'
                          : 'token_list_text',
                      ]"
                    >
                      {{ token?.meta?.name }}
                    </span>
                  </div>
                  <div :style="{ display: 'flex' }">
                    <span class="token_list_balance">{{
                      token?.balance ? formatBalance(token?.balance) : 0
                    }}</span>
                    <span class="token_list_symbol"> {{ token?.meta?.symbol }}</span>
                  </div>
                  <span v-if="token?.meta?.name !== 'AERGO'" class="token_list_text hash">{{
                    `[${token?.hash.slice(0, 6)}...${token?.hash.slice(-6)}]`
                  }}</span>
                </div>
              </div>
              <Icon class="token_list_nextbutton" :name="`next_grey`" />
            </div>
            <div
              v-if="token?.meta?.type === 'ARC1' || token?.meta?.type === 'AERGO'"
              class="line"
            />
          </li>
        </ul>
        <ul v-if="tab === `nft`" class="token_list_ul nft scroll">
          <li
            v-for="token in getTokens"
            :class="[myNFTCount(token?.hash) ? `token_list_li` : `token_list_li none`]"
            :key="token?.hash"
          >
            <div
              v-if="token?.meta?.type === 'ARC2'"
              class="token_list_wrapper"
              @click="handleNft(token)"
            >
              <div class="token_list_row">
                <img
                  v-if="token?.meta?.image"
                  class="token_list_icon"
                  :src="token?.meta?.image"
                  alt="404"
                />
                <Icon v-else class="token_list_icon" :name="`defaultToken`" />
                <div class="token_list_amount">
                  <div>
                    <span class="token_list_text wordbreak">
                      {{ token?.meta?.name }}
                    </span>
                  </div>
                  <div :style="{ display: 'flex' }">
                    <span class="token_list_balance">{{ myNFTCount(token?.hash) }}</span>
                    <span class="token_list_symbol"> EA </span>
                  </div>
                  <span class="token_list_text hash">{{
                    `[${token?.hash.slice(0, 6)}...${token?.hash.slice(-6)}]`
                  }}</span>
                </div>
              </div>
              <Icon
                class="token_list_nextbutton"
                :name="token?.dropdownState ? `arrow-up` : `arrow-down`"
              />
            </div>
            <div v-if="token?.meta?.type === 'ARC2'" class="line" />

            <ul class="nft_inventory_list_wrapper" v-if="token?.dropdownState">
              <div class="row">
                <li
                  v-for="(nftWalletItem, i) in token?.nftWallet"
                  :key="`${i + nftWalletItem?.hash}`"
                  class="nft_inventory_list_wrapper_list"
                  @click="handleGoNftInventory(nftWalletItem)"
                >
                  <div v-if="nftWalletItem?.meta?.img_url" class="nft_img_wrapper">
                    <img class="img" :src="nftWalletItem?.meta?.img_url" alt="404" />
                    <div :style="{ textAlign: 'center' }">
                      {{ `#${nftWalletItem?.meta?.token_id}` }}
                    </div>
                  </div>
                  <div class="frame" v-else>
                    <div class="token_name">{{ nftWalletItem?.token?.meta?.name }}</div>
                    <div class="nft_id">{{ `#${nftWalletItem?.meta?.token_id}` }}</div>
                  </div>
                </li>
              </div>
            </ul>
          </li>

          <div v-if="getNftList.length === 0 && !isLoading" class="nftNothing">
            <Icon :name="`nothing`" />
            <div class="text">No NFT</div>
          </div>
        </ul>

        <button
          class="token_list_button"
          @click="[tab === 'token' ? handleImportAsset('token') : handleImportAsset('nft')]"
          :disabled="!getScanApi"
        >
          <Icon name="plus" class="token_list_button_img" />
          <span class="token_list_button_text">{{
            tab === 'token' ? `Import Asset` : `Import NFT`
          }}</span>
        </button>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Header } from '@aergo-connect/lib-ui/src/layouts';
import List from './List.vue';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import ButtonGroup from '@aergo-connect/lib-ui/src/buttons/ButtonGroup.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import Identicon from '@aergo-connect/lib-ui/src/content/Identicon.vue';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import LoadingIndicator from '@aergo-connect/lib-ui/src/icons/LoadingIndicator.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import NoAccountModal from '@aergo-connect/lib-ui/src/modal/NoAccountModal.vue';
import NetworkModal from '@aergo-connect/lib-ui/src/modal/NetworkModal.vue';
import PasswordModal from '@aergo-connect/lib-ui/src/modal/PasswordModal.vue';
import AccountDetailModal from '@aergo-connect/lib-ui/src/modal/AccountDetailModal.vue';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';
import Notification from '@aergo-connect/lib-ui/src/modal/Notification.vue';
import ErrorModal from '@aergo-connect/lib-ui/src/modal/ErrorModal.vue';
// @ts-ignore
import AergoClient, { GrpcWebProvider } from '@herajs/client';

export default Vue.extend({
  components: {
    NoAccountModal,
    NetworkModal,
    PasswordModal,
    AccountDetailModal,
    Icon,
    Heading,
    Identicon,
    Button,
    ButtonGroup,
    List,
    Header,
    Icon,
    ScrollView,
    Appear,
    LoadingIndicator,
    Notification,
    ErrorModal,
  },
  data() {
    return {
      hamburgerModal: false,
      networkModal: false,
      passwordModal: false,
      importAssetModal: false,
      noAccountModal: false,
      accountDetailModal: false,
      notification: false,
      notificationText: '',
      chainId: this.$store?.state?.accounts?.chainId,
      address: this.$store?.state?.accounts?.address,
      tab: 'token',
      tokensCount: 0,
      editNick: false,
      isLoading: false,
      tokens: [],
      errorModal: false,
      errorMessage: '',
      isAddedNft: false,
      account: {},
    };
  },

  created() {
    this.$store.dispatch('accounts/updateAccount', this.accountSpec);
  },

  async beforeMount() {
    this.initAccount();
    this.tab = this.$store.state.accounts.option || 'token';
  },

  watch: {
    '$store.state.accounts.chainId': function () {
      this.initAccount();
    },

    '$store.state.accounts.address': function () {
      this.initAccount();
    },

    notification(notificationState) {
      if (notificationState) {
        setTimeout(() => {
          const time = (this.notification = !notificationState);
          return () => {
            clearTimeout(time);
          };
        }, 2000);
      }
    },
  },

  computed: {
    getTokens() {
      return this.$store.getters[`accounts/getTokens`];
    },
    getScanApi() {
      const scanApiUrl = this.$store.state.accounts.networksPath.filter(
        (network) => network.label === this.$store.state.accounts.chainLabel,
      )[0]?.scanApiUrl;
      return scanApiUrl;
    },
    getNodeUrl() {
      const nodeUrl = this.$store.state.accounts.networksPath.filter(
        (network) => network.label === this.$store.state.accounts.chainLabel,
      )[0]?.nodeUrl;
      return nodeUrl;
    },
    getNetwork() {
      const network = this.$store.state.accounts.networksPath.filter(
        (network) => network.label === this.$store.state.accounts.chainLabel,
      )[0];
      return network;
    },
    getNftList() {
      return Object.values(this.$store.getters[`accounts/getTokens`]).filter((data: any) => {
        if (data?.nftWallet?.length > 0) {
          return data.nftWallet;
        }
      });
    },
    accountSpec() {
      // const aergoChainIds = ['aergo.io', 'testnet.aergo.io', 'alpha.aergo.io'];
      // const chainId = aergoChainIds.includes(this.$store.state.accounts.chainId)
      //   ? this.$store.state.accounts.chainId
      //   : this.$store.state.accounts.chainLabel;
      return {
        address: this.$store.state.accounts.address,
        chainId: this.$store.state.accounts.chainId,
      };
    },
  },

  methods: {
    async initAccount() {
      try {
        this.account = await this.$background.getActiveAccount();
        this.isLoading = true;
        if (this.$store.state.accounts.address) {
          await this.$store.dispatch('accounts/initState');
          await this.checkIsUpdateNft();
          await this.myTokenCount();
          await this.$forceUpdate();
          this.errorMessage = '';
          this.isLoading = false;
        } else {
          const succ = await this.$store.dispatch('accounts/loadAccount');
          console.log(succ, 'succ');
          this.errorMessage = '';
          if (!succ || !this.getTokens) {
            this.noAccountModal = true;
          }
          //  else {
          //   await this.$store.dispatch('accounts/initState');
          // }
        }
      } catch (e) {
        if (!this.getTokens) {
          this.noAccountModal = true;
        } else {
          this.errorModal = true;
          this.errorMessage = `CONNECTION_TIMED_OUT: ${e}`;
        }
      } finally {
        this.isLoading = false;
      }
    },

    async refreshClick() {
      this.isLoading = true;
      try {
        await this.initAccount();
        await this.checkIsUpdateNft();
        this.$forceUpdate();
      } catch (e: any) {
        console.error(e, 'error');
        this.errorModal = true;
        this.errorMessage = e;
      } finally {
        this.isLoading = false;
      }
    },

    hamburgerClick() {
      this.hamburgerModal = !this.hamburgerModal;
    },

    handleCancel(modalEvent: any) {
      switch (modalEvent) {
        case 'noAccountModal':
          this.$background.lock();
          break;
        case 'passwordModal':
          this.passwordModal = false;
          this.hamburgerModal = false;
          break;
        case 'accountDetailModal':
          this.accountDetailModal = false;
          break;
        case 'errorModal':
          this.errorModal = false;
          break;
        default:
        // handle default case here
      }
    },

    handleRefresh() {
      this.refreshClick();
    },
    handleConfirm() {
      this.passwordModal = false;
      this.hamburgerModal = false;
      this.$router.push({ name: 'security' }).catch(() => {});
    },

    handleRemoveModalClick() {
      this.hamburgerModal = false;
    },
    handleSelect() {
      this.hamburgerModal = false;
    },
    handleMouseEnter() {
      this.notification = true;
      this.notificationText = this.errorMessage;
    },
    networkModalClick() {
      this.networkModal = !this.networkModal;
    },

    handleDetailAddress() {
      this.accountDetailModal = true;
    },

    handleSecurity() {
      this.hamburgerModal = false;
      this.passwordModal = true;
    },

    handleToken(token: any) {
      this.$store.commit('accounts/setSelectedToken', token.hash);
      this.$router.push({ name: 'token-detail' }).catch(() => {});
    },

    handleNft(token) {
      const dropdownState = !this.getTokens[token.hash][`dropdownState`];
      this.$store.commit('accounts/setSelectedToken', token.hash);
      this.$store.commit('accounts/handleDropdownState', { hash: token.hash, dropdownState });
      this.$forceUpdate();
    },

    handleImportAsset(to: string) {
      if (to === 'token') {
        this.$store.commit('accounts/setOption', 'token');
        this.$router.push({ name: 'import-asset', params: { option: 'token' } }).catch(() => {});
      }
      if (to === 'nft') {
        this.$store.commit('accounts/setOption', 'nft');
        this.$router.push({ name: 'import-asset', params: { option: 'nft' } }).catch(() => {});
      }
    },

    handleSend(token: any) {
      this.$router.push({ name: 'send' }).catch(() => {});
    },
    handleReceive() {
      this.accountDetailModal = true;
    },
    handleChangeTab(value: string) {
      this.tab = value;
      this.$store.commit('accounts/setOption', value);
    },

    formatBalance(balance) {
      if (Number.isInteger(balance)) {
        return balance;
      }
      return Number(balance).toFixed(3);
    },
    myTokenCount() {
      const tokens = Object.values(this.getTokens);
      tokens.map((token: any) => {
        if (token.meta.type === 'ARC1') {
          this.tokensCount++;
        }
      });
    },
    myNFTCount(hash: any) {
      if (!this.getTokens[hash].nftWallet) {
        return null;
      } else {
        return this.getTokens[hash].nftWallet.length;
      }
    },

    handleGoNftInventory(nft: any) {
      this.$store.commit('accounts/setSelectedToken', nft.token.hash);
      this.$router.push({ name: 'nft-detail', params: { id: nft.meta.token_id } }).catch(() => {});
    },

    async checkIsUpdateNft() {
      const tokens = await Object.values(this.getTokens);
      tokens.map((token: any) => {
        if (token?.nftWallet) {
          token.nftWallet.map(async (nft: any) => {
            try {
              //1. 서버에서 nft를 찾을수 없는 경우.
              const getTokenBalanceUrl = `${this.getScanApi}/tokenBalance?q=${this.$store.state.accounts.address}&size=10000`;
              const resp = await fetch(getTokenBalanceUrl);
              const response = await resp.json();

              const filteredARC2 = response.hits.filter((tokenData) => {
                return (
                  tokenData.token.meta.type === 'ARC2' && tokenData.token.hash === nft.token.hash
                );
              });
              filteredARC2.map(async (tokenData) => {
                if (tokenData.token.meta.type === 'ARC2') {
                  const checkNftHash = tokenData.token.hash;
                  const getNftDataUrl = `${this.getScanApi}/nftInventory?q=address:${checkNftHash} AND (account:${this.$store.state.accounts.address})&sort=blockno:desc&from=0&size=100`;
                  const resp = await fetch(getNftDataUrl);
                  const response = await resp.json();
                  const isFindNft = response.hits.find((nftData) => nftData.hash === nft.hash);
                  if (!isFindNft) {
                    await this.$store.commit('accounts/deleteNftInLocalStorage', nft);
                    await this.$forceUpdate();
                  }
                }
              });

              // 2. 서버에서 가져온 이미지가 바뀔 경우
              // if (nft.meta.token_uri && nft.meta.image_url) {
              //   const tokenUri = nft.meta.token_uri;
              //   const fetchData = await fetch(tokenUri);
              //   const jsonData = await fetchData.json();
              //   const imageUrl = jsonData.image_url;
              //   if (imageUrl !== nft.meta.image_url) {
              //     // const localStorageNftData = await this.$store.getters.getNftInLocalStorage({
              //     //   account: nft.meta.account,
              //     //   chainId: this.$store.state.accounts.chainId,
              //     //   contractAddress: nft.meta.address,
              //     // });
              //     const localStorageNftData = this.getTokens[nft.meta.address];
              //     console.log(localStorageNftData, 'localStorageNftData');
              //     localStorageNftData.map((userNft: any) => {
              //       if (nft.hash === userNft.hash) {
              //         userNft.meta['img_url'] = imageUrl;
              //       }
              //     });
              //     console.log(localStorageNftData, 'updatedUserNftDataInLocalStorage');
              //     // this.$store.commit('accounts/updateNftInLocalstorage', localStorageNftData);
              //     console.log('end To Change WalletData');
              //   }
              // }
            } catch (e: any) {
              console.error(e, 'checkIsupdateNft Error');
              // this.errorModal = true;
              // this.errorMessage = e;
            }
          });
        }
      });
    },

    async testNodeConnection() {
      const aergo = new AergoClient({}, new GrpcWebProvider({ url: this.getNodeUrl }));
      try {
        const aergoChainIds = ['aergo.io', 'testnet.aergo.io', 'alpha.aergo.io'];
        const chainId = aergoChainIds.includes(this.$store.state.accounts.chainId);
        console.log(chainId);
        await aergo.blockchain();
        const chainIdInfo = await aergo.getChainInfo();
        const chainIdMagic = chainIdInfo.chainid.magic;
        console.log(this.getNodeUrl, 'getNodeUrl');
        console.log(chainIdMagic, 'chainIdMagic');
        console.log(this.$store.state.accounts.chainId, 'this.$store.state.accounts.chainId');
        if (chainIdMagic !== this.$store.state.accounts.chainId) {
          console.log(
            this.getNetwork,
            `need to change ChainId ${this.$store.state.accounts.chainId} -> ${chainIdMagic}`,
          );
          const newChainId = { chainId: chainIdMagic };
          const networkPath = {
            ...this.getNetwork,
            ...newChainId,
          };
          console.log(networkPath, 'networkPath');
          // await this.$background.addNetwork(networkPath);
          console.log('changed ChainId', this.getNetwork.chainId);
        }
      } catch (e) {
        console.log(e);
        // this.nodeUrlError = `${e}`;
      }
    },
  },
});
</script>
<style lang="scss">
@import '../../../lib-ui/src/styles/variables';
.header {
  z-index: 2;
}
.home_content {
  display: flex;
  flex-direction: column;
  align-items: center;
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
    .account_info_img {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid transparent;
      border-radius: 8px;
      background-image: linear-gradient(#fff, #fff), linear-gradient(to right, #279ecc, #a13e99);
      background-origin: border-box;
      background-clip: content-box, border-box;
      svg {
        width: 44px;
        height: 44px;
      }
    }

    .account_info_content_wrapper {
      display: flex;
      flex-direction: column;
      .account_info_nickname_wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        margin-bottom: 8px;
        margin-left: 14px;
        /* width: 191px; */
        .account_info_nickname_text {
          margin-right: 5px;
          word-break: break-all;
        }
      }
      .account-label {
        margin-top: 10px;
        display: block;
        border-radius: 10px;
        width: 36px;
        line-height: 20px;
        text-align: center;
        transform: translateY(-5px);
      }

      .account-label-new {
        background-color: #ff4f9f;
        font-size: (calc(8 / 16)) * 1rem;
        text-transform: uppercase;
        color: #fff;
      }

      .account-label-usb {
        background-color: #6f6f6f;

        .icon {
          line-height: 14px;
          height: 16px;
          transform: translateY(-1px);
        }
      }
      .account_info_address_wrapper {
        cursor: pointer;
        width: 191px;
        height: 24px;
        background: #ecf8fd;
        border-radius: 25px;
        color: #279ecc;
        margin-left: 10px;
        .account_info_address_text {
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 300;
          font-size: 12px;
          line-height: 15px;
          /* identical to box height */
          letter-spacing: -0.333333px;
          width: 148.32px;
          height: 16px;
          margin-left: 7.9px;
        }
        .account_info_address_button {
          float: right;
          margin-right: 7.33px;
          cursor: pointer;
        }
      }
    }
  }
  .token_content_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
    .token_nft_button_wrapper {
      justify-content: center;
      margin-left: 8px;
      margin-bottom: 4px;
    }
    .token-button {
      margin-right: 10px;
      width: 153px;
      height: 39px;
      background: #279ecc;
      border-radius: 8px;
      &.unclicked {
        background: #f6f6f6;
        color: #bababa;
        box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.05);
      }
      /* &.unclicked:hover {
        background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
        color: #ffffff;
      } */
    }
    .token_list_ul {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 375px;
      height: 19.8rem;
      overflow-x: hidden;
      overflow-y: hidden;
      &.nft {
        margin-left: 14px;
        width: 405px;
      }
      &.scroll {
        overflow-y: scroll;
      }
      .nftNothing {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .text {
          margin-top: 10px;
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 400;
          font-size: 15px;
          line-height: 19px;
          text-align: center;
          letter-spacing: -0.333333px;
          color: #bababa;
        }
      }
      .token_list_li {
        width: 315px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        &.none {
          display: none;
        }
        .nft_inventory_list_wrapper {
          margin-top: 4px;
          margin-bottom: 10px;
          width: 325px;
          .row {
            display: grid;
            grid-template-columns: 1fr 1fr;

            .nft_inventory_list_wrapper_list {
              cursor: pointer;

              border-radius: 4px;
              background: #f6f6f6;
              height: 115px;
              width: 150px;
              margin-bottom: 25px;
              margin-right: 10px;
              border: solid 0.01em #d0d0d0;

              .frame {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.19);
                -webkit-box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.19);
                -moz-box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.19);
                .nft_id {
                  margin: 4px;
                  font-size: calc(14 / 16) * 1rem;
                  word-break: break-all;
                }
                .token_name {
                  font-size: calc(12 / 16) * 1rem;
                  word-break: break-all;
                }
              }
              .nft_img_wrapper {
                height: 100%;
                .img {
                  width: -webkit-fill-available;
                  box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.19);
                  -webkit-box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.19);
                  -moz-box-shadow: 7px 5px 6px 1px rgba(0, 0, 0, 0.19);
                  height: 100%;
                }
              }
            }
            .nft_inventory_list_wrapper_list:hover {
              transform: scale(1.1);
              transition: 0.4s;
            }
          }
        }
        .token_list_wrapper {
          height: 62px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          .token_list_row {
            display: flex;
            align-items: center;
          }
          .token_list_icon {
            background: #ffffff;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            border: 1px solid #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .token_list_amount {
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            /* align-items: center; */
            /* justify-content: flex-end; */
            .token_list_balance {
              font-weight: 400;
              margin-right: 4px;
              color: #686767;
            }
            .token_list_symbol {
              font-weight: 400;
              width: max-content;
              color: #686767;
            }
          }
          .token_list_text {
            font-weight: 400;
            &.wordbreak {
              word-break: break-all;
            }
            &.hash {
              color: #757575;
              font-size: 13px;
              display: none;
              font-weight: 200;
            }
          }
          .token_list_balance {
            width: max-content;
          }
          .token_list_nextbutton {
          }
        }
        /* .token_list_wrapper:hover {
          background: #f6f6f6;
        } */
      }
      .token_list_wrapper:hover {
        background: #f6f6f6;
        .token_list_text {
          &.hash {
            display: flex;
          }
        }
      }
      .line {
        /* Grey/01 */
        height: 1px;
        background: #f0f0f0;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
        &.none {
          display: none;
        }
      }
    }
    .token_list_button {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      align-items: center;
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
      cursor: pointer;
      margin-top: 10px;
      margin-bottom: 10px;

      &[disabled] {
        cursor: not-allowed;
        background: $Grey02;
        color: #fff;
        outline-color: #fff;
        opacity: 0.3;
      }
      .token_list_button_text {
        /* Caption/C3 */
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
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
    .token_list_button:not([disabled]):hover {
      background: #279ecc;

      .token_list_button_text {
        color: #ffffff;
      }
      .icon--plus {
        path {
          fill: #fff;
        }
      }
    }
  }
}
</style>
