<template>
  <div class="network_modal_backdrop" @click="(event) => networkModalClick(event)">
    <div class="relative">
      <div class="network_modal_wrapper">
        <div class="network_modal_title">Select Network</div>
        <div class="network_modal_line" />
        <ul :class="chains.length > 10 ? `network_modal_ul scroll` : `network_modal_ul`">
          <li
            class="network_modal_li"
            v-for="(chain, idx) in chains"
            v-bind:key="chain.label"
            @click="setChainId(chain)"
          >
            <div
              :class="
                $store.state.accounts.chainLabel === chain.label ? `flex-row selected` : `flex-row`
              "
            >
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <Icon
                  :class="idx !== 0 ? `network-icon opacity` : `network-icon`"
                  :name="idx < 3 ? `aergo` : `network-other`"
                  :size="36"
                />
                <span>{{
                  idx < 3
                    ? `AERGO ${chain.label.toLocaleUpperCase()}`
                    : `${chain.label.toLocaleUpperCase()}`
                }}</span>

                <span v-if="idx > 2" class="custom-tag">CUSTOM CHAIN</span>
              </div>
              <!-- <Icon
                v-if="$store.state.accounts.chainLabel === chain.label"
                class="checkmark-icon"
                name="checkmark"
              /> -->
            </div>
            <div class="list_line" />
          </li>
        </ul>
        <Button class="configure_button" type="primary" size="large" @click="addNetworkClick" hover
          >Configure Network</Button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../icons/Icon.vue';
import Button from '../buttons/Button.vue';
import { ChainConfigs } from '@aergo-connect/extension/src/config';
import { Account, serializeAccountSpec } from '@herajs/wallet';

export default Vue.extend({
  components: {
    Icon,
    Button,
  },
  data() {
    return {
      options: [],
      chains: [...ChainConfigs],
    };
  },
  created() {
    this.fetchNetworks();
  },

  methods: {
    networkModalClick(event) {
      if (event.eventPhase === 2) {
        this.$emit('networkModalClick');
      }
    },

    async setChainId(chain) {
      const activeAccount = await this.$background.getActiveAccount();
      const accounts = await this.$background.getAccounts();
      await this.$store.commit('accounts/setChain', {
        chainId: chain.chainId,
        chainLabel: chain.label,
      });

      if (activeAccount?.data.type === 'ledger') {
        // const path = "m/44'/441'/0'/0/" + 1;
        const spec = {
          address: `${activeAccount.data.spec.address}`,
          chainId: chain.chainId,
        };
        const ledgerAccount = new Account(
          serializeAccountSpec(spec),
          Account.getDefaultData({
            spec,
            type: 'ledger',
            derivationPath: activeAccount.data.derivationPath,
          }),
        );

        const checkAlreadyAddedAccounts = accounts.filter(
          (account) => account.key === `${chain.chainId}/${activeAccount.data.spec.address}`,
        );
        console.log(checkAlreadyAddedAccounts, 'checkAlreadyAddedAccounts');
        console.log(ledgerAccount, 'ledgerAccount');
        if (checkAlreadyAddedAccounts.length === 0) {
          await this.$background.addAccount(ledgerAccount.data);
          await this.$store.dispatch('accounts/addAccount', ledgerAccount.data.spec.address);
        }
      } else {
        await this.$store.commit('accounts/setActiveAccount', this.$store.state.accounts.address);
      }

      this.$emit('networkModalClick');
    },

    addNetworkClick() {
      this.$router.push({ name: 'networks-list' });
    },

    async fetchNetworks() {
      const chains = Object.values(await this.$background.getNetworks()) as any;
      if (chains) {
        this.chains.push(...chains);
      }
      // if (chains) {
      //   const optionArray = [...chains.map((item: any) => [item.chainId, item.chainId])] as never[];
      //   this.options = optionArray;
      // }
    },
  },
});
</script>

<style lang="scss">
@import '../styles/variables';

.network_modal_backdrop {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  .relative {
    position: relative;
    .network_modal_wrapper {
      max-width: fit-content;
      position: fixed;
      bottom: 0%;
      background: #ffffff;
      box-shadow: 0px -6px 12px rgba(0, 0, 0, 0.1);
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      .network_modal_title {
        margin-top: 16px;
        margin-bottom: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        /* identical to box height, or 125% */

        color: #0d0d0d;
      }
      .network_modal_line {
        width: 375px;
        height: 1px;
        background: #d8d8d8;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
      }
      .network_modal_ul {
        &.scroll {
          overflow-y: scroll;
        }
        .button {
          margin-top: 14px;
          margin-left: 20px;
        }

        .network_modal_li {
          cursor: pointer;
          .custom_line {
            margin-left: 24px;
            width: 327px;
            height: 1px;
            background: $gradation05;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
          }

          .list_line {
            margin-left: 24px;
            width: 327px;
            height: 1px;
            background: #f0f0f0;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
          }

          .flex-row {
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &.selected {
              background: var(--primary-lightsky, #eff5f6);
            }
            .custom-tag {
              margin-left: 5px;
              display: inline-block;
              vertical-align: text-bottom;
              text-transform: uppercase;
              font-size: 0.75em;
              background-color: #eee;
              line-height: 1.5;
              padding: 0 0.4em;
              border-radius: 4px;
            }
            .network-icon {
              margin-left: 22px;
              margin-right: 10px;

              &.opacity {
                opacity: 0.7;
              }
            }
            .icon--network-other {
              opacity: 1 !important;
            }

            .checkmark-icon {
              margin-right: 10px;
            }
          }
          /* .network_modal_circle {
          margin-left: 34px;
          margin-right: 10px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          &1 {
            background: linear-gradient(133.72deg, #9a449c 0%, #e30a7d 100%);
          }
          &2 {
            background: linear-gradient(124.51deg, #279ecc -11.51%, #a13e99 107.83%);
          }
          &3 {
            background: linear-gradient(133.72deg, #84ceeb 0%, #f894c8 100%);
          }
        } */

          .network_modal_name {
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            display: flex;
            align-items: center;
            letter-spacing: -0.333333px;
            color: #0d0d0d;
          }
          .network_modal_icon {
            margin-left: 158px;
          }
        }
        .network_modal_li:hover {
          /* Grey/00 */

          background: #f6f6f6;
        }
      }

      .configure_button {
        margin-top: 15px;
        margin-bottom: 20px;
        margin-left: 24px;
      }
    }
  }
}
</style>
