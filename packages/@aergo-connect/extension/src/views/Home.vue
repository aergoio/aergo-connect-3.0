<template>
  <ScrollView>
    <Header
      button="hamburger"
      :title="$store?.state?.accounts?.network"
      refresh
      network
      @hamburgerClick="hamburgerClick"
      @networkModalClick="networkModalClick"
      @refreshClick="refreshClick"
    />
    <LoadingIndicator
      :style="{ position: 'absolute', zIndex: 10, top: 0, bottom: 0, left: 0, right: 0 }"
      v-if="isLoading"
      :size="56"
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
        <Identicon :text="$store?.state?.accounts?.address" class="account_info_img" />
        <Notification
          v-if="notification"
          :title="notificationText"
          :size="300"
          :icon="`warning2`"
        />
        <div class="account_info_content_wrapper">
          <div class="account_info_nickname_wrapper">
            <div v-if="!editNick" class="account_info_nickname_text">
              {{ $store?.state?.accounts?.nick }}
            </div>
            <input
              v-if="editNick"
              class="account_info_nickname_input"
              v-model="nick"
              autofocus
              @blur="changeNick"
              @keyup.enter="changeNick"
            />
            <Icon
              v-if="!editNick"
              class="account_info_nickname_button"
              :name="`edit`"
              :size="50"
              @click="handleEdit"
            />
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
            v-for="token in $store?.state?.session?.tokens"
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

        <ul
          v-if="tab === `nft`"
          :class="[
            nftCountNum > 4 || dropdownScroll || $store?.state?.ui?.dropdownClickNum > 1
              ? 'token_list_ul scroll'
              : 'token_list_ul',
          ]"
        >
          <li
            v-for="token in $store?.state?.session?.tokens"
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
                  v-for="(nftWalletItem, i) in $store?.state?.session?.tokens[token.hash].nftWallet"
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

          <div v-if="nftCountNum === 0 && !isLoading" class="nftNothing">
            <Icon :name="`nothing`" />
            <div class="text">No NFT</div>
          </div>
        </ul>

        <button
          class="token_list_button"
          @click="[tab === 'token' ? handleImportAsset('token') : handleImportAsset('nft')]"
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
    ScrollView,
    Appear,
    LoadingIndicator,
    Notification,
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
      network: 'aergo.io',
      tab: 'token',
      tokensCount: 0,
      nftCountNum: 0,
      editNick: false,
      nick: this.$store.state.accounts.nick,
      isLoading: false,
      tokens: [],
      dropdownScroll: false,
      dropdownClickNum: 0,
    };
  },
  beforeMount() {
    this.initAccount();
    this.tab = this.$store.state.session.option || 'token';
  },
  watch: {
    $route(to, from) {
      this.refreshClick();
    },

    '$store.state.accounts.network': function () {
      this.initAccount();
    },

    '$store.state.accounts.address': function () {
      this.initAccount();
    },

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
  },

  methods: {
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

    async initAccount() {
      this.isLoading = true;
      this.tokensCount = 0;
      this.nftCountNum = 0;
      if (this.$store.state.accounts.address) {
        await this.$store.dispatch('session/initState');
        await this.getNftDataInLocalStorage();
        this.nick = await this.$store.state.accounts.nick;
        await this.myNFTList();
        await this.checkIsUpdateNft();
        await this.$forceUpdate();
      } else {
        console.log('Other Account Loading ..');
        const succ = await this.$store.dispatch('accounts/loadAccount');

        if (!succ) {
          this.noAccountModal = true;
        } else await this.$store.dispatch('session/InitState');
      }
      this.isLoading = false;
    },

    async refreshClick() {
      this.isLoading = true;
      await this.$store.dispatch('session/updateBalances');
      await this.checkIsUpdateNft();
      this.$forceUpdate();
      this.isLoading = false;
    },

    hamburgerClick() {
      this.hamburgerModal = !this.hamburgerModal;
    },

    handleCancel(modalEvent: any) {
      if (modalEvent === 'noAccountModal') {
        this.$background.lock();
      }

      if (modalEvent === 'passwordModal') {
        this.passwordModal = false;
        this.hamburgerModal = false;
      }

      if (modalEvent === 'accountDetailModal') {
        this.accountDetailModal = false;
      }
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
      this.$store.commit('session/setToken', token.hash);
      this.$router.push({ name: 'token-detail' }).catch(() => {});
    },

    handleNft(nft: any) {
      this.$store.commit('session/setToken', nft.hash);
      this.$store.commit('session/handleDropdownState', nft.hash);

      if (this.$store.state.session.tokens[nft.hash].nftWallet.length > 3) {
        this.dropdownScroll = true;
      }
    },

    handleImportAsset(to: string) {
      if (to === 'token') {
        this.$store.commit('session/setOption', 'token');
        this.$router.push({ name: 'import-asset', params: { option: 'token' } }).catch(() => {});
      }
      if (to === 'nft') {
        this.$store.commit('session/setOption', 'nft');
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
      this.$store.commit('session/setOption', value);
    },

    formatBalance(balance) {
      if (Number.isInteger(balance)) {
        return balance;
      }
      return Number(balance).toFixed(3);
    },
    getNftDataInLocalStorage() {
      const myWalletAddress = this.$store.state.accounts.address;
      const myWalletNetwork = this.$store.state.accounts.network;
      const myTokenList =
        this.$store.state.accounts.accounts[myWalletAddress].token[myWalletNetwork];
      const myTokenListKeys = Object.keys(myTokenList);
      myTokenListKeys.map((myTokenKey) => {
        const getMyNftWalletLocalStorage = JSON.parse(
          localStorage.getItem(`${myWalletAddress}_${myWalletNetwork}_${myTokenKey}`) || '[]',
        );
        if (getMyNftWalletLocalStorage.length > 0) {
          this.$store.commit('accounts/setNftWallet', {
            nftWallet: getMyNftWalletLocalStorage,
            hash: myTokenKey,
          });
        } else {
          this.$store.commit('accounts/setNftWallet', { nftWallet: [], hash: myTokenKey });
        }
      });
    },
    myNFTCount(hash: any) {
      if (!this.$store.state.session.tokens[hash].nftWallet) {
        return null;
      } else {
        if (this.$store.state.session.tokens[hash].nftWallet.length > 3) {
          this.dropdownScroll = true;
        }
        return this.$store.state.session.tokens[hash].nftWallet.length;
      }
    },
    myNFTList() {
      Object.values(this.$store.state.session.tokens).map((token: any) => {
        if (token.nftWallet.length !== 0) {
          this.nftCountNum++;
        }
      });
    },
    handleGoNftInventory(nft: any) {
      // console.log(nft, 'nft2131293219372198');
      this.$store.commit('session/setToken', nft.token.hash);
      this.$router.push({ name: 'nft-detail', params: { id: nft.meta.token_id } }).catch(() => {});
    },

    checkIsUpdateNft() {
      const tokens = Object.values(this.$store.state.session.tokens);
      tokens.map((token: any) => {
        if (token.nftWallet.length > 0) {
          token.nftWallet.map(async (nft: any) => {
            try {
              if (nft.meta.token_uri && nft.meta.image_url) {
                const tokenUri = nft.meta.token_uri;
                const fetchData = await fetch(tokenUri);
                const jsonData = await fetchData.json();
                const imageUrl = jsonData.image_url;
                if (imageUrl !== nft.meta.image_url) {
                  const localStorageNftData = JSON.parse(
                    localStorage.getItem(
                      `${nft.meta.account}_${this.$store.state.accounts.network}_${nft.meta.address}`,
                    ) || '{}',
                  );
                  localStorageNftData.map((userNft: any) => {
                    if (nft.hash === userNft.hash) {
                      userNft.meta['img_url'] = imageUrl;
                    }
                  });
                  console.log(localStorageNftData, 'updatedUserNftDataInLocalStorage');
                  localStorage.setItem(
                    `${nft.meta.account}_${this.$store.state.accounts.network}_${nft.meta.address}`,
                    JSON.stringify(localStorageNftData),
                  );
                  console.log('end To Change WalletData');
                }
              }
            } catch (e) {
              console.error(e, 'error');
            }
          });
        }
      });
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
  height: 100%;
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
        margin-left: 10px;
        /* width: 191px; */
        .account_info_nickname_text {
          margin-right: 5px;
          word-break: break-all;
        }
        .account_info_nickname_input {
        }
        .account_info_nickname_button {
          cursor: pointer;
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
              margin-bottom: 10px;
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
    .token_list_button:hover {
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
