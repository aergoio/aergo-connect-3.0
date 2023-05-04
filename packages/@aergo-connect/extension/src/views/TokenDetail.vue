<template>
  <ScrollView class="page">
    <HeaderVue
      button="back"
      title="Token Detail"
      refresh
      :to="{ name: 'accounts-list' }"
      @refreshClick="refreshClick"
    />
    <!-- <LoadingIndicator v-if="isLoading" /> -->
    <SendFinishModal
      v-if="receiptModal"
      :asset="$store.state.accounts.selectedToken"
      :txHash="selectedData[`hash`]"
      :receipt="selectedData[`meta`][`to`]"
      :amount="amount"
      :symbol="token.meta.symbol"
      :tokenType="token.meta.type"
      :fee="fee"
      :balance="+token.balance"
      @clickOk="handleViewReceiptClose"
    />
    <RemoveModal v-if="removeModal" @cancel="handleDelete" />
    <AccountDetailModal v-if="accountDetailModal" @cancel="(e) => handleCancel(e)" />
    <div class="token_detail_content">
      <div class="account_detail">
        <div class="direction-row">
          <!-- <div :class="`circle ${$store.state.accounts.chainId}`" /> -->
          <div class="network">{{ networkName }}</div>
        </div>
        <div class="account">
          <Identicon :text="$store.state.accounts.address" class="account_icon" />
          <div class="account_title">
            {{
              $store.state.accounts.nick.length > 17
                ? `${$store.state.accounts.nick.slice(0, 17)}...`
                : $store.state.accounts.nick
            }}
          </div>
          <div class="account_title_wrapper">
            <div class="account_address" @click="handleDetailAddress">
              {{
                `${$store.state.accounts.address.slice(
                  0,
                  6,
                )}...${$store.state.accounts.address.slice(-6)}`
              }}
            </div>
            <Icon
              v-if="token.meta.symbol !== 'aergo'"
              class="account_button"
              :name="`delete2`"
              @click="handleDelete(true)"
            />
          </div>
        </div>
      </div>
      <div v-if="token.meta.symbol === 'aergo'" class="token_detail aergo">
        <div class="flex-row">
          <Icon class="icon" :name="'aergo'" />
          <div class="balance_wrapper">
            <div class="balance">
              {{ token.balance ? formatBalance(token.balance) : 0 }}
            </div>
            <div class="dollor">
              <span>$ </span>
              <span>{{ aergoPrice ? formatBalance(aergoPrice) : 0 }} </span>
            </div>
          </div>
          <div class="token_symbol">{{ token.meta.symbol }}</div>
        </div>
        <div class="line" />
        <div class="detail_wrapper">
          <div :style="{ display: 'flex', flexDirection: 'column', marginTop: '5px' }">
            <div class="detail_title">Staked Balance</div>
            <div class="detail_title staking">
              {{ staking }}
              <span class="dollor">{{
                stakingPrice ? `[$ ${formatBalance(stakingPrice)}]` : `[$ 0]`
              }}</span>
            </div>
          </div>
          <Button
            type="font-gradation"
            v-if="$store.state.accounts.chainId === 'aergo.io'"
            hover
            @click="gotoStake()"
            :style="{ height: '24px', marginRight: '8px', padding: '12px' }"
            ><span>Manage</span></Button
          >
        </div>
      </div>
      <div v-else class="token_detail others">
        <div class="flex-row">
          <img v-if="token.meta.image" class="icon" :src="token.meta.image" />
          <Icon class="icon_center" v-else :name="`defaultToken`" />
          <div class="balance_wrapper">
            <div class="balance">
              {{ token.meta.name }}
            </div>
          </div>
          <div :style="{ display: 'flex' }">
            <span :style="{ marginRight: '5px', fontWeight: '500' }">
              {{ token.balance ? formatBalance(token.balance) : 0 }}
            </span>
            <span class="token_symbol">{{ token.meta.symbol }}</span>
          </div>
        </div>
      </div>
      <div class="select_token">
        <div class="title">Transaction History</div>
        <select class="select_tokenDetail" v-model="filter">
          <option class="option" selected value="All">All</option>
          <option class="option" value="Received">Received</option>
          <option class="option" value="Sent">Sent</option>
        </select>
      </div>
      <div id="history" :class="[token.meta.symbol === 'aergo' ? 'history' : 'history others']">
        <ul
          :class="[
            token.meta.symbol === 'aergo' ? 'history_list ' : 'history_list others',
            data.length === 0 ? 'history_list nothing' : 'history_list',
            data.length > 1 ? 'history_list scroll' : 'history_list',
          ]"
        >
          <li v-for="(item, index) in data" :key="item.meta.tx_id" class="item_wrapper">
            <div class="row">
              <span class="time">{{ item.meta.ts.slice(0, 16) }}</span>
              <div v-if="index === 0">
                <span
                  v-if="lastestTransactionState === `PENDING` && getScanApi"
                  class="status pending"
                  >PENDING</span
                >
                <span v-else class="status complete" @click="handleViewReceipt(item)"
                  >COMPLETE</span
                >
              </div>
              <div v-else>
                <span class="status complete" @click="handleViewReceipt(item)">COMPLETE</span>
              </div>
            </div>
            <!-- <div :style="{ display: 'flex', alignItems: 'center' }">
                <div class="tx_id" @click="gotoScanTx(item.hash)">
                  {{
                    item.hash.split('-0').length === 2
                      ? `TX_ID: ${item.hash.slice(0, 6)}......${item.hash.slice(-6, -2)}`
                      : `TX_ID: ${item.hash.slice(0, 6)}......${item.hash.slice(-6)}`
                  }}
                </div>
              </div> -->
            <div class="direction_row mt4">
              <div v-if="item.meta.from === $store.state.accounts.address" class="sent">Sent</div>
              <div v-else class="received">Received</div>
              <div class="direction_row">
                <div v-if="item.meta.from === $store.state.accounts.address" class="balance sent">
                  {{
                    getScanApi
                      ? item.meta.amount_float === 0
                        ? `${getBalance(item.meta.amount_float)}`
                        : `- ${getBalance(item.meta.amount_float)}`
                      : `- ${bigIntToString(BigInt(item.meta.amount), 18)}`
                  }}
                </div>
                <div v-else class="balance received">
                  {{
                    getScanApi
                      ? item.meta.amount_float === 0
                        ? `${getBalance(item.meta.amount_float)}`
                        : `+ ${getBalance(item.meta.amount_float)}`
                      : `+ ${bigIntToString(BigInt(item.meta.amount), 18)}`
                  }}
                </div>
                <div class="token_symbol">{{ token.meta.symbol }}</div>
              </div>
            </div>
            <div class="line"></div>
            <div class="direction_row">
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <div
                  type="button"
                  class="tx_id"
                  @click="getScanExplorerApi ? gotoScanTx(item.hash) : copyToClipboard(item.hash)"
                >
                  {{
                    item.hash.split('-0').length === 2
                      ? `TX_ID: ${item.hash.slice(0, 6)}......${item.hash.slice(-6, -2)}`
                      : `TX_ID: ${item.hash.slice(0, 6)}......${item.hash.slice(-6)}`
                  }}
                </div>
              </div>
              <!-- <div
                v-if="item.meta.from === $store.state.accounts.address"
                class="address"
                @click="gotoScanAccount(item.meta.to)"
              >
                {{ `To: ${item.meta.to.slice(0, 6)}...${item.meta.to.slice(-6)}` }}
              </div>
              <div v-else class="address" @click="gotoScanAccount(item.meta.to)">
                {{ `From: ${item.meta.to.slice(0, 6)}...${item.meta.to.slice(-6)}` }}
              </div> -->
              <div class="direction_row">
                <div v-if="token.meta.symbol === 'aergo'" class="address type">
                  {{ getTokenType(item) }}
                </div>
                <!-- <Icon :name="'pointer'" @click="gotoScanTx(item.hash)" /> -->
              </div>
            </div>
          </li>
          <div v-if="data.length === 0" class="history_nothing aergo">
            <Icon class="icon" :name="`nothing`" />
            <div class="nothing_text">No Transaction Details.</div>
          </div>
        </ul>
        <div v-if="!isLoading" class="footer">
          <ButtonGroup>
            <div :style="{ background: '#fff', width: '157px', borderRadius: '4px' }">
              <Button class="button" type="font-gradation" size="small" @click="handleSend"
                ><Icon class="button-icon" :name="`send`" /><span>Send</span></Button
              >
            </div>
            <div :style="{ background: '#fff', width: '157px', borderRadius: '4px' }">
              <Button class="button" type="font-gradation" size="small" @click="handleReceive"
                ><Icon class="button-icon" :name="`receive`" /><span>Receive</span></Button
              >
            </div>
          </ButtonGroup>
        </div>
      </div>
    </div>
    <Notification v-if="clipboardNotification" :title="`Copied!`" :icon="`check`" />
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import HeaderVue from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import Identicon from '@aergo-connect/lib-ui/src/content/Identicon.vue';
import RemoveModal from '@aergo-connect/lib-ui/src/modal/RemoveTokenModal.vue';
import AccountDetailModal from '@aergo-connect/lib-ui/src/modal/AccountDetailModal.vue';
import SendFinishModal from '@aergo-connect/lib-ui/src/modal/SendFinishModal.vue';
import Notification from '@aergo-connect/lib-ui/src/modal/Notification.vue';
import { bigIntToString } from '@aergo-connect/extension/src/utils/checkDecimals';
import { getScanApiUrl, getScanExplorerUrl } from '../utils/chain-urls';
import { Transaction } from '@herajs/wallet';
import { TxTypes } from '@herajs/common';

interface Data {
  hash: string;
  meta: {
    amount?: string;
    amount_float?: number;
    blockno?: number;
    category?: string;
    from?: string;
    method?: string;
    status?: string;
    to?: string;
    token_transfers?: number;
    ts?: string;
    type?: string;
    payload?: object;
  };
}

export default Vue.extend({
  components: {
    ScrollView,
    ButtonGroup,
    Button,
    Icon,
    HeaderVue,
    Identicon,
    RemoveModal,
    Notification,
    AccountDetailModal,
    SendFinishModal,
  },

  data() {
    return {
      removeModal: false,
      clipboardNotification: false,
      accountDetailModal: false,
      receiptModal: false,
      error: '',
      allData: [] as Data[],
      data: [] as Data[],
      txData: [] as Transaction[],
      filter: 'All',
      staking: '0',
      aergoPrice: 0,
      stakingPrice: 0,
      isLoading: false,
      token: {
        hash: 'AERGO',
        meta: {
          name: 'AERGO',
          symbol: 'aergo',
          image: '',
          type: 'AERGO',
          decimals: 0,
        },
        balance: '0',
        nftWallet: [],
      },
      sendStatus: {},
      selectedData: {},
      lastestTransactionState: 'PENDING',
    };
  },
  computed: {
    getTokens() {
      return this.$store.getters[`accounts/getTokens`];
    },
    fee() {
      return this.sendStatus[`fee`]
        ? // eslint-disable-next-line no-undef
          bigIntToString(BigInt(this.sendStatus[`fee`].split(' ')[0]), 18)
        : '0';
    },
    amount() {
      // eslint-disable-next-line no-undef
      return bigIntToString(BigInt(this.selectedData[`meta`][`amount`]), 18);
    },
    networkName() {
      const chainId = this.$store.state.accounts.chainId;
      if (chainId === ('aergo.io' || 'testnet.aergo.io' || 'alpha.aergo.io')) {
        return `AERGO ${chainId.toUpperCase()}`;
      } else {
        return `${chainId.toUpperCase()}`;
      }
    },
    getScanExplorerApi() {
      const network = this.$store.state.accounts.networksPath.filter(
        (network) => network.chainId === this.$store.state.accounts.chainId,
      )[0].scanExplorerUrl;
      return network;
    },
    getScanApi() {
      const scanApiUrl = this.$store.state.accounts.networksPath.filter(
        (network) => network.chainId === this.$store.state.accounts.chainId,
      )[0].scanApiUrl;
      return scanApiUrl;
    },
  },

  async beforeMount() {
    this.token = await this.getTokens[this.$store.state.accounts.selectedToken];
    await this.getTokenHistory();
    if (this.token.meta.symbol == 'aergo') {
      await this.getAergoInfo();
    }
  },

  watch: {
    filter: function () {
      if (this.filter === 'All') {
        this.getTokenHistory();
      } else if (this.filter === 'Sent') {
        this.data = this.allData.filter((item) => {
          if (item.meta.from === this.$store.state.accounts.address) {
            return item;
          }
        });
      } else if (this.filter === 'Received') {
        this.data = this.allData.filter((item) => {
          if (item.meta.from !== this.$store.state.accounts.address) {
            return item;
          }
        });
      }
    },
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
    staking() {
      this.stakingPrice = this.getStakingAergoInfo(this.staking.split(' ')[0]);
    },
    async selectedData() {
      this.sendStatus = await this.getSendStatus(this.selectedData);
    },
    // txData() {
    //   console.log(this.txData, 'txData');
    // },
    // data() {
    //   console.log(this.data, 'data?');
    // },
  },

  methods: {
    bigIntToString(bigInt, decimals) {
      return bigIntToString(bigInt, decimals);
    },
    async aergoStaking(): Promise<void> {
      const staking = await this.$background.getStaking({
        chainId: this.$store.state.accounts.chainId,
        address: this.$store.state.accounts.address,
      });

      if (!staking) this.staking = '0';
      else {
        // eslint-disable-next-line no-undef
        this.staking = `${bigIntToString(BigInt(staking.amount.split(' ')[0]), 18) || 0} aergo`;
      }
    },

    gotoStake() {
      window.open('https://voting.aergo.io/about', '_blank');
    },
    gotoScanTx(hash: string) {
      const scanExplorerUrl = getScanExplorerUrl(this.$store.state.accounts);
      const url = `${scanExplorerUrl}/transaction/${hash.split('-')[0]}/`;
      window.open(url, '_blank');
    },

    gotoScanAccount(address: string) {
      const scanExplorerUrl = getScanExplorerUrl(this.$store.state.accounts);
      const url = `${scanExplorerUrl}/account/${address}/`;
      window.open(url, '_blank');
    },

    async getAergoInfo() {
      await this.$background.getTokenPrice('aergo.io').then((priceInfo) => {
        this.aergoPrice = this.token.balance * priceInfo.price;
      });
      if (
        this.$store.state.accounts.chainId === 'aergo.io' ||
        this.$store.state.accounts.chainId === 'testnet.aergo.io'
      ) {
        this.aergoStaking();
      }
    },

    async getStakingAergoInfo(staking: any) {
      await this.$background.getTokenPrice('aergo.io').then((priceInfo) => {
        // console.log(staking);
        this.stakingPrice = staking * priceInfo.price;
      });
    },
    getBalance(value: number) {
      const noDecimalValue = value / Math.pow(10, this.token.meta.decimals);
      return this.formatBalance(noDecimalValue);
    },

    getTitle() {
      return this.token.meta.name;
    },

    async refreshClick() {
      // console.log('refresh');
      this.isLoading = true;
      await this.getTokenHistory();
      await this.getAergoInfo();
      await this.$forceUpdate();
      this.isLoading = false;
    },

    async getTokenHistory(): Promise<void> {
      if (!this.getScanApi) {
        // console.log('here have to get History');
        const accountTx = await this.$background.getAccountTx({
          address: this.$store.state.accounts.address,
          chainId: this.$store.state.accounts.chainId,
        });

        //transaction Receipt and Make Data Type
        accountTx.map(async (txData) => {
          // console.log(txData, 'txData');
          const hash = txData.data.hash;
          const data = {
            hash,
            meta: {
              amount: txData.data.amount.split(' ')[0],
              from: txData.data.from,
              to: txData.data.to,
              type: String(txData.data.type),
              ts: txData.data.ts,
              status: txData.data.status,
              payload: txData.txBody?.payload,
            },
          };
          this.data.push(data);
        });

        // this.data = accountTx;
      } else {
        const scanApiUrl = getScanApiUrl(this.$store.state.accounts);
        const getTransactionUrl = `${scanApiUrl}/transactions?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address})&size=10000&sort=ts:desc`;
        const getTokenTransferUrl = `${scanApiUrl}/tokenTransfers?q=(from:${this.$store.state.accounts.address} OR to:${this.$store.state.accounts.address}) AND address:${this.token.hash}&size=10000&sort=ts:desc`;

        let resp;
        if (this.token.meta.symbol === 'aergo') {
          resp = await fetch(getTransactionUrl);
        } else {
          resp = await fetch(getTokenTransferUrl);
        }

        const response = await resp.json();
        // this.accountState = await this.getAccountTx();
        // this.transactionState = await this.getSendTransaction();

        if (response.error) {
          this.data = [];
          this.allData = [];
          console.error(response.error);
        } else {
          this.data = response.hits;
          this.allData = response.hits;
          if (this.$store.state.accounts.lastestSendHash === this.data[0][`hash`]) {
            const result = await this.$background.getTransactionReceipt(
              this.$store.state.accounts.chainId,
              this.data[0][`hash`],
            );
            if (result[`status`] !== 'SUCCESS') {
              this.lastestTransactionState = 'PENDING';
            } else {
              this.lastestTransactionState = 'COMPLETE';
              this.$store.commit('accounts/getLastestSendHash', '');
            }
          } else {
            this.lastestTransactionState = 'COMPLETE';
          }
        }
      }
    },
    handleDelete(state: boolean) {
      this.removeModal = state;
    },

    handleSend() {
      this.$router.push({ name: 'send', params: { id: 'ARC1' } }).catch(() => {});
    },
    handleReceive() {
      this.$router.push({ name: 'receive' }).catch(() => {});
    },
    handleDetailAddress() {
      this.accountDetailModal = true;
    },
    handleCancel(modalEvent: any) {
      if (modalEvent === 'accountDetailModal') {
        this.accountDetailModal = false;
      }
    },
    async handleViewReceipt(item) {
      this.selectedData = item;
      // console.log(item, 'item');
      // this.sendStatus = await this.getSendStatus(item);
      this.receiptModal = true;
    },
    handleViewReceiptClose() {
      this.receiptModal = false;
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      this.clipboardNotification = true;
    },
    getTokenType(item) {
      if (!item.meta.category && !item.meta.method && item.meta.type) {
        // console.log(TxTypes, 'txTypes');

        return `Type : ${TxTypes[item.meta.type].toUpperCase()}`;
      } else if (!item.meta.category && !item.meta.method && !item.meta.type) {
        return `Type : CALL`;
      } else {
        return `Type: ${item.meta.category.toUpperCase()}`;
      }
    },
    formatBalance(balance) {
      if (Number.isInteger(balance)) {
        return balance;
      }
      return Number(balance).toFixed(3);
    },
    async getSendStatus(data) {
      return await this.$background.getTransactionReceipt(
        this.$store.state.accounts.chainId,
        data[`hash`],
      );
    },
    // async getSendTransaction() {
    //   return await this.$background.getTransaction(
    //     this.$store.state.accounts.chainId,
    //     this.$store.state.accounts.lastestSendHash,
    //   );
    // },
    async getAccountTx() {
      return await this.$background.getAccountTx({
        chainId: this.$store.state.accounts.chainId,
        address: this.$store.state.accounts.address,
      });
    },
  },
});
</script>

<style lang="scss">
.token_detail_content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .footer {
    position: absolute;
    bottom: 0;
    margin-bottom: 25px;
    .button.button-type-font-gradation {
      border: none;
    }
    &.aergo {
      top: 40px;
    }
  }
  .account_detail {
    display: flex;
    flex-direction: column;
    .direction-row {
      margin-top: 18px;
      margin-left: 36px;
      display: flex;
      align-items: center;
      .circle {
        border-radius: 50%;
        background: #e4097d;
        width: 4px;
        height: 4px;
        margin-right: 4px;
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
      .network {
        width: 100px;
        height: 15px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 300;
        font-size: 12px;
        line-height: 15px;
        letter-spacing: -0.333333px;

        /* Grey/06 */

        color: #686767;
      }
    }
    .account {
      display: flex;
      align-items: center;
      margin-top: 8px;
      .account_icon {
        margin-left: 38px;

        width: 20px;
        height: 20px;
      }
      .account_title {
        margin-left: 12px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: -0.333333px;

        /* Grey/07 */

        color: #454344;
      }
      .account_title_wrapper {
        display: flex;
        align-items: center;
        margin-left: 10px;

        width: 120px;
        height: 22px;
        background: #eff5f7;
        border-radius: 25px;
        .account_address {
          cursor: pointer;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 300;
          font-size: 12px;
          line-height: 15px;
          text-align: right;
          letter-spacing: -0.333333px;
          /* Primary/Blue01 */

          color: #279ecc;
        }
      }
      .account_button {
        cursor: pointer;
        margin-left: 35px;
      }
    }
  }
  .token_detail {
    margin-top: 10px;
    margin-left: 24px;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 327px;
    height: 61px;
    background: #ffffff;
    /* Grey/00 */

    border: 1px solid #f6f6f6;
    /* 05 */

    box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    &.aergo {
      height: 118px;
    }
    &.others {
      flex-direction: row;
      justify-content: space-evenly;
      .icon {
        margin-top: 0;
      }
    }

    .flex-row {
      margin: 10px;
      display: flex;
      justify-content: space-evenly;
      width: 100%;
      align-items: center;
      .token_symbol {
        margin-right: 13px;
      }
      .icon_center {
        justify-content: center;
        align-items: center;
      }
    }

    .line {
      background: #f0f0f0;
      width: 299px;
      height: 1px;
    }
    &.detail {
      margin-top: 6px;
    }
    .detail_wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .detail_title {
        /* Caption/C1 */

        margin-left: 14px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 19px;
        /* identical to box height */

        letter-spacing: -0.333333px;

        /* Grey/06 */

        color: #686767;
        &.staking {
          display: flex;
          align-items: center;
          font-weight: 500;
          .dollor {
            /* Caption/C3 */
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            /* identical to box height */

            letter-spacing: -0.333333px;

            /* Grey/04 */

            color: #9c9a9a;
            margin-left: 8px;
            word-break: break-all;
          }
        }
      }
      .detail_content {
        margin-right: 14px;
        /* Caption/C1 */
        float: right;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 19px;
        /* identical to box height */

        text-align: right;
        letter-spacing: -0.333333px;

        /* Grey/07 */

        color: #454344;
      }
    }
    .icon {
      border: 1px solid #d8d8d8;
      width: 46px;
      height: 46px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
    }
    .balance_wrapper {
      word-break: break-all;
      margin-right: 50px;
      .dollor {
        /* Caption/C3 */
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        /* identical to box height */

        letter-spacing: -0.333333px;

        /* Grey/04 */

        color: #9c9a9a;
        /* margin-left: 15px; */
        word-break: break-all;
      }
    }
    .balance {
      height: 25px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 17px;
      line-height: 25px;
      letter-spacing: -0.333333px;
      word-break: break-all;
      text-overflow: ellipsis;
      &.sent {
        color: #231f20;
      }
      &.received {
        color: #279ecc;
      }
    }
    .token_name {
      /* Subtitle/S3 */
      margin-right: 8px;
      margin-top: 18px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      text-align: right;
      letter-spacing: -0.333333px;

      /* Grey/08 */

      color: #231f20;
    }
  }
  .select_token {
    display: flex;
    margin-top: 24px;
    .title {
      margin-left: 24px;
      width: 150px;
      height: 20px;
      /* Button/Btn3 */

      font-family: 'Outfit';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      display: flex;
      align-items: center;

      /* Grey/06 */

      color: #686767;
    }
    .checkbox {
      margin-left: 108px;
      margin-right: 24px;
      width: 80px;
      height: 28px;
    }
  }
  .history {
    margin-top: 10px;
    background: #eff5f7;
    box-shadow: inset 0px 21px 17px -19px rgba(0, 0, 0, 0.05);
    height: 48vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    &.others {
      height: 57.8vh;
    }
    .history_list {
      flex-direction: column;
      display: flex;
      align-items: center;
      height: 12.9rem;
      overflow-y: hidden;
      &.nothing {
        overflow: hidden;
      }
      &.scroll {
        margin-left: 10px;
        overflow-y: scroll;
      }
      &.others {
        height: 16rem;
      }
      .history_nothing {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .nothing_text {
          /* Caption/C1 */
          margin-top: 10px;
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 400;
          font-size: 15px;
          line-height: 19px;
          /* identical to box height */

          text-align: center;
          letter-spacing: -0.333333px;

          /* Grey/03 */

          color: #bababa;
        }
      }
      .line {
        margin-left: 16px;
        margin-top: 6px;
        width: 295px;
        height: 1px;
        background: #eff5f7;
      }
      .item_wrapper {
        margin-top: 10px;
        width: 327px;
        height: 100px;
        background: #ffffff;
        border-radius: 8px;
        &.hide {
          display: none;
        }
        .row {
          display: flex;
          justify-content: space-between;
          .time {
            width: 200px;
            margin-left: 16px;
            margin-top: 8px;
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 300;
            font-size: 12px;
            line-height: 15px;
            letter-spacing: -0.333333px;

            /* Grey/04 */

            color: #9c9a9a;
          }
          .status {
            margin-top: 6px;
            margin-right: 10px;
            display: inline-block;
            min-width: 10px;
            padding: 3px 7px;
            font-size: 12px;
            font-weight: 700;
            line-height: 1;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            border-radius: 10px;
            &.pending {
              background-color: #5c3ce0;
            }

            &.complete {
              background-color: #11d899;
              cursor: pointer;
            }
          }
        }

        .tx_id {
          margin-top: 10px;
          margin-bottom: 10px;
          margin-left: 16px;
          font-size: 12.5px;
          text-decoration-line: underline;
          cursor: pointer;
          word-break: break-all;
          color: #686767;
        }
        .received {
          margin-left: 16px;
          /* Button/Btn2 */

          font-family: 'Outfit';
          font-style: normal;
          font-weight: 500;
          font-size: 17px;
          line-height: 21px;

          /* Primary/Blue01 */

          color: #279ecc;
        }
        .sent {
          margin-left: 16px;
          font-family: 'Outfit';
          font-style: normal;
          font-weight: 500;
          font-size: 17px;
          line-height: 21px;

          /* Grey/07 */

          color: #454344;
        }
        .direction_row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          &.mt4 {
            margin-top: 4px;
          }
          .icon {
            cursor: pointer;
            margin-right: 10px;
          }
          .balance {
            margin-left: 16px;
            margin-right: 8px;
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 500;
            font-size: 17px;
            line-height: 21px;
            text-align: right;
          }
          .token_symbol {
            margin-right: 16px;
          }
          .address {
            margin-left: 16px;
            /* Caption/C3_line */

            font-family: 'Outfit';
            font-style: normal;
            font-weight: 400;
            font-size: 12.5px;
            line-height: 18px;
            letter-spacing: -0.333333px;
            text-decoration-line: underline;
            cursor: pointer;
            /* Grey/06 */

            color: #686767;
            &.type {
              margin-right: 16px;
              cursor: text;
              text-decoration-line: none;
            }
          }
          .button {
            width: 22px;
            height: 22px;
          }
        }
      }
    }
  }
}
.select_tokenDetail {
  margin-left: 90px;
  padding: 3px;
  background: #ffffff;
  /* Grey/02 */
  width: 90px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;

  font-family: 'Outfit';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 19px;
  /* identical to box height */

  letter-spacing: -0.333333px;

  /* Grey/06 */

  color: #686767;
}

.button-group {
  width: 328px;
  display: flex;
  justify-content: space-between;
  .button {
    box-shadow: 0px 4px 13px rgba(119, 153, 166, 0.25);
    width: 157px;
    /* margin-right: 10px; */
    .button-icon {
      margin-top: 5px;
    }
  }
}
</style>
