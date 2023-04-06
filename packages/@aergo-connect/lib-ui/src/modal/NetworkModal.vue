<template>
  <div class="network_modal_backdrop" @click="(event) => networkModalClick(event)">
    <div class="network_modal_wrapper">
      <div class="network_modal_title">Select Network</div>
      <div class="network_modal_line" />
      <ul :class="chains.length > 3 ? `network_modal_ul scroll` : `network_modal_ul`">
        <li
          class="network_modal_li"
          v-for="(chain, idx) in chains"
          v-bind:key="chain.chainId"
          @click="setNetwork(chain.chainId)"
        >
          <div class="flex-row">
            <div :style="{ display: 'flex', alignItems: 'center' }">
              <Icon class="network-icon" :name="idx < 3 ? `aergo` : `network-other`" :size="36" />
              <span>{{
                idx < 3
                  ? `AERGO ${chain.chainId.toLocaleUpperCase()}`
                  : `${chain.chainId.toLocaleUpperCase()}`
              }}</span>
            </div>
            <Icon
              v-if="$store.state.accounts.network === chain.chainId"
              class="checkmark-icon"
              name="checkmark"
            />
          </div>
          <div :class="idx === 2 && chains.length > 3 ? `custom_line` : `list_line`" />
        </li>
      </ul>
      <Button class="configure_button" type="primary" size="large" @click="addNetworkClick" hover
        >Configure Network</Button
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../icons/Icon.vue';
import Button from '../buttons/Button.vue';
import { ChainConfigs } from '@aergo-connect/extension/src/config';
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
  // computed: {
  //   proceedOptions() {
  //     return this.options.map((option) => {
  //       return {
  //         value: option[0],
  //         label: option[1],
  //       };
  //     });
  //   },
  // },
  methods: {
    networkModalClick(event) {
      if (event.eventPhase === 2) {
        this.$emit('networkModalClick');
      }
      // event.stopPropagation();
      // this.$emit('networkModalClick');
    },

    async setNetwork(network) {
      this.$store.commit('accounts/setNetwork', network);
      this.$emit('networkModalClick');

      if (this.$route.name === 'request-accounts-list') {
        return;
      } else {
        // reset account_data
        await this.$router
          .push({
            name: 'accounts-list',
            params: {
              address: this.$store.state.accounts.address,
            },
          })
          .catch(() => {});
      }
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
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  .network_modal_wrapper {
    position: absolute;
    width: 375px;
    height: 280px;
    top: 320px;
    left: 0px;
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
      height: 170px;
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
          .network-icon {
            margin-left: 22px;
            margin-right: 10px;
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
      margin-left: 24px;
    }
  }
}
</style>
