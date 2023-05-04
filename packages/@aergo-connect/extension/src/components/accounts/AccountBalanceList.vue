<template>
  <ul class="account-list">
    <li :key="'coinId'" v-if="balanceOfCoin">
      <router-link
        :to="{
          name: accountRoute,
          params: {
            address: accountSpec.address,
            chainId: accountSpec.chainId,
            from: 'coin',
            contract: balanceOfCoin.address,
          },
        }"
      >
        <div class="account-group">
          <div style="display: flex; flex-direction: row">
            <div style="display: flex">
              <span class="account-icon">
                <Icon :name="'logo'" :size="36" />
              </span>
            </div>
            <!--            <div style="display: flex; flex-direction: column">-->
            <!--              &lt;!&ndash;            <span class="account-balance-amount">115.00571 AERGO</span>&ndash;&gt;-->
            <!--&lt;!&ndash;              <FormattedToken class="account-balance" :value="balanceOfCoin.meta.balance"/>&ndash;&gt;-->
            <!--&lt;!&ndash;              <span style="display: block; padding-bottom: 0px; margin-top: -10px">$35.2</span>&ndash;&gt;-->
            <!--            </div>-->
            <FormattedToken class="account-balance" :value="balanceOfCoin.meta.balance" />
          </div>
        </div>
      </router-link>
    </li>
    <li :key="object.token.contract" v-for="object in balanceOfGem">
      <router-link
        :to="{
          name: accountRoute,
          params: {
            address: accountSpec.address,
            chainId: accountSpec.chainId,
            from: 'arg',
            contract: contractAddress,
          },
        }"
      >
        <div class="account-group">
          <span class="account-icon">
            <Icon :name="'aergo-gem'" :size="36" />
          </span>
          <!--        <span class="account-balance-amount">200,000.00 GEM</span>-->
          <FormattedToken
            class="account-balance"
            :value="object.token.meta.balance + ' aer'"
            :forcedUnit="'ARG'"
          />
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import { FormattedToken, Identicon } from '@aergo-connect/lib-ui/src/content';

@Component({
  components: {
    Icon,
    Identicon,
    FormattedToken,
  },
})
export default class AccountBalanceList extends Vue {
  @Prop({ type: String, default: 'account-details' }) readonly accountRoute!: string;
  @Prop({ type: Boolean, default: false }) readonly canDelete!: boolean;

  mounted() {
    //this.activeAccount = await this.$background.getActiveAccount();
    this.$store.dispatch('accounts/fetchAccountBalances', { ...this.accountSpec });
  }

  get balances(): any {
    if (Object.keys(this.$store.state.accounts.balances).includes('coin')) {
      return this.$store.state.accounts.balances;
    }
    return {};
  }

  get balanceOfCoin() {
    // console.log('balanceOfCoin');
    return this.balances?.coin;
  }

  get balanceOfGem() {
    // console.log('balanceOfGem');
    return this.balances?.objects;
  }

  get contractAddress() {
    return this.balanceOfGem[0]?.token.contract;
  }

  get accountSpec() {
    return {
      address: this.$route.params.address,
      chainId: this.$route.params.chainId,
    };
  }
}
</script>

<style lang="scss">
.account-list,
.account-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.account-list {
  font-size: (calc(13 / 16)) * 1rem;

  .account-balance-amount,
  .account-address {
    font-weight: 500;
  }

  .account-group {
    line-height: 36px;
    border-bottom: 1px solid #f0f0f0;
  }

  .account-icon {
    width: 36px;
    margin-right: 14px;
  }

  li + li .account-group {
    border-top: 1px solid #f0f0f0;
  }

  .account-group,
  .account-item {
    padding: 16px 20px;
  }

  .account-item {
    padding-bottom: 0;
    display: flex;

    &.active {
      border: 1px solid rgba(#ff4f9f, 1);
      animation: activeFaceOut 0.4s 2 forwards ease-in-out;
    }
  }

  .account-address-balance {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #f0f0f0;
    padding: 3px 0 10px;
    margin-left: 14px;
    font-size: (calc(12 / 16)) * 1rem;
  }

  .account-item-li:last-child .account-address-balance {
    border-bottom: 0;
  }

  .account-balance {
    color: #666;
  }

  .balance-actions {
    display: flex;
    align-items: center;

    .account-balance {
      flex: 1;
    }
  }

  .delete-button {
    opacity: 0;
  }

  .account-item-li:hover .delete-button {
    opacity: 1;
  }

  .delete-button .icon {
    border-radius: 100%;
    width: 24px !important;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #d9d9d9;
    }
  }

  .account-address {
    word-break: break-all;
    padding-bottom: 5px;
    line-height: 1.3;
  }

  .account-label {
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
      line-height: 10px;
      height: 10px;
      transform: translateY(-1px);
    }
  }
}

@keyframes activeFaceOut {
  0% {
    border-color: rgba(#ff4f9f, 0.3);
  }
  50% {
    border-color: rgba(#ff4f9f, 1);
  }
  100% {
    border-color: rgba(#ff4f9f, 0.3);
  }
}
</style>
