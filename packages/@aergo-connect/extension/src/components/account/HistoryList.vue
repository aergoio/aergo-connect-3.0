<template>
  <div class="tx-list" :class="{ hasFewItems: transactions && transactions.length <= 6 }">
    <LoadingIndicator v-if="state === 'loading'" :size="50" />
    <div v-if="state === 'loaded' && transactions.length === 0" class="empty-state">
      No transactions found.
    </div>
    <div v-if="state === 'loaded' && transactions.length">
      <div
        class="tx-list-item"
        v-for="tx in transactions"
        :key="tx.hash"
        :class="'status-' + tx.data.status"
        @click="goToExplorer(tx)"
      >
        <span class="tx-direction">
          <Icon :name="getIcon(tx)" :size="24" />
        </span>

        <span class="tx-info">
          <span class="address-amount">
            <span class="address">
              <Identicon
                :text="address == tx.data.from ? tx.data.to : tx.data.from"
                :emptyIcon="tx.data.type === 7 ? 'multicall' : 'deploy'"
              />
              <span v-if="tx.data.to == tx.data.from">self-transfer</span>
              <span v-if="tx.data.to == '' && tx.data.type === 7">Multiple Calls</span>
              <span v-if="tx.data.to == '' && tx.data.type !== 7">Contract Creation</span>
              <Elide
                v-else
                class="address"
                :text="address == tx.data.from ? tx.data.to : tx.data.from"
                mode="middle-fixed-tail"
                expect-ellipsis
              />
            </span>
            <FormattedToken
              :class="['amount', address == tx.data.from ? 'negative' : 'positive']"
              :prefix="tx.data.from == tx.data.to ? '' : address == tx.data.to ? '+' : '-'"
              :value="`${tx.data.amount} aer`"
              :forced-unit="'ARG'"
              v-if="arg && tx.data.amount.length >= 18"
            />
            <FormattedToken
              :class="['amount', address == tx.data.from ? 'negative' : 'positive']"
              :prefix="tx.data.from == tx.data.to ? '' : address == tx.data.to ? '+' : '-'"
              :value="`${formatArgAmount(tx.data.amount)}`"
              :forced-unit="'ARG'"
              :just-display="true"
              v-else-if="arg && tx.data.amount.length < 18"
            />
            <FormattedToken
              :class="['amount', address == tx.data.from ? 'negative' : 'positive']"
              :prefix="tx.data.from == tx.data.to ? '' : address == tx.data.to ? '+' : '-'"
              :value="`${tx.data.amount} aer`"
              v-else
            />
          </span>
          <span class="date-category">
            <span class="date">{{ formatTimestamp(tx.data.ts) }}</span>
            <span class="catgeory">{{ getCategory(tx) }}</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { FormattedToken, Identicon } from '@aergo-connect/lib-ui/src/content';
import { LoadingIndicator, Icon } from '@aergo-connect/lib-ui/src/icons';
import { Elide } from '@aergo-connect/lib-ui/src/content';

import Vue from 'vue';
import Component from 'vue-class-component';
import { Transaction } from '@herajs/wallet';
// @ts-ignore
import { TxTypes } from '@herajs/common';
import { Prop } from 'vue-property-decorator';

import { getExplorerUrl } from '../../utils/chain-urls';

import { formatTokenAmount } from '@/utils/format-tokens';

@Component({
  components: {
    FormattedToken,
    LoadingIndicator,
    Elide,
    Icon,
    Identicon,
  },
})
export default class HistoryList extends Vue {
  @Prop({ type: Array, required: true }) readonly transactions!: Transaction[];
  @Prop({ type: String, required: true }) readonly state!:
    | 'initial'
    | 'loading'
    | 'loaded'
    | 'error';
  @Prop({ type: String, required: true }) readonly address!: string;
  @Prop({ type: Boolean, default: false }) readonly arg!: boolean;

  formatTimestamp(ts: number): string {
    // @ts-ignore
    const rtf = new Intl.RelativeTimeFormat('en');
    const diff = +new Date(ts) - +new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    if (-diff < 60 * 1000) return 'a moment ago';
    if (-diff < millisecondsPerDay / 60)
      return rtf.format(Math.round(diff / (millisecondsPerDay * 60)), 'minute');
    if (-diff < millisecondsPerDay)
      return rtf.format(Math.round(diff / (millisecondsPerDay / 24)), 'hour');
    return rtf.format(Math.round(diff / millisecondsPerDay), 'day');
  }

  goToExplorer(tx: Transaction): void {
    const url = getExplorerUrl(this.$route.params.chainId, `transaction/${tx.data.hash}`);
    if (url) window.open(url);
    else {
      alert(`Hash: ${tx.data.hash}`);
    }
  }

  getCategory(tx: Transaction): string {
    return TxTypes[tx.data.type];
  }

  getIcon(tx: Transaction): string {
    if (tx.data.to == tx.data.from) return 'tx-self';
    if (this.address != tx.data.from) return 'tx-in';
    return 'tx-out';
  }

  formatArgAmount(amount: string) {
    return formatTokenAmount(amount, '', 18);
  }
}
</script>

<style lang="scss">
.tx-list {
  padding-left: 20px;
  min-height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  &.hasFewItems {
    /* compensate for probably missing scrollbar */
    padding-right: 20px;
  }

  .loading-indicator,
  .empty-state {
    margin: auto;
  }
  .empty-state {
    color: #666;
  }

  .tx-list-item {
    background-color: #fff;
    border-bottom: 1px solid #eee;
    display: flex;
    cursor: pointer;
    font-size: calc((12 / 16) * 1rem);
    padding: 12px 8px;

    &:last-child {
      border-bottom: 0;
    }
    .tx-direction {
      margin-right: 8px;
    }
    .tx-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .address-amount,
    .date-category {
      display: flex;
      align-items: center;
      > :last-child {
        margin-left: auto;
      }

      .address {
        overflow: hidden;
      }

      > .address {
        margin-right: 1em;
        font-weight: 500;

        display: flex;
        align-items: center;

        .identicon {
          width: 28px;
          height: 28px;
          margin-top: -2px;
          margin-right: 5px;
          flex-shrink: 0;
        }
      }
    }

    .amount {
      white-space: nowrap;
      font-weight: 500;
      &.negative {
        color: #f3a354;
      }
      &.positive {
        color: #00c789;
      }
    }
    .date-category {
      margin-top: 0.4em;
      color: #666;
    }
  }
}
</style>
