<template>
  <div class="content">Redirecting...</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class RequestSelectAccount extends Vue {
  mounted() {
    this.redirectToRequest();
  }

  async redirectToRequest() {
    const activeAccount = await this.$background.getActiveAccount();
    console.log(activeAccount, 'activeAccount');
    if (!activeAccount) {
      const address = this.$store.state.accounts.address;
      const chainId = this.$store.state.accounts.chainId;
      if (address && chainId) {
        return this.$router.push({
          name: 'request-select-action',
          params: { address, chainId },
        });
      } else {
        return this.$router.push({ name: 'request-accounts-list' });
      }
    }
    // const aergoChainIds = ['aergo.io', 'testnet.aergo.io', 'alpha.aergo.io'];
    // const chainId = aergoChainIds.includes(this.$store.state.accounts.chainId)
    //   ? this.$store.state.accounts.chainId
    //   : this.$store.state.accounts.chainLabel;
    this.$router.push({
      name: 'request-select-action',
      params: activeAccount.data.spec,
    });
  }
}
</script>

<style lang="scss"></style>
