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
    if (!activeAccount) {
      return this.$router.push({ name: 'request-accounts-list' }).catch(() => {});
    }
    const aergoChainIds = ['aergo.io', 'testnet.aergo.io', 'alpha.aergo.io'];
    const chainId = aergoChainIds.includes(this.$store.state.accounts.chainId)
      ? this.$store.state.accounts.chainId
      : this.$store.state.accounts.chainLabel;
    this.$router
      .push({
        name: 'request-select-action',
        params: {
          chainId,
          address: activeAccount.data.spec.address,
        },
      })
      .catch(() => {});
  }
}
</script>

<style lang="scss"></style>
