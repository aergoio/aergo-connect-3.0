<template>
  <div class="content">Redirecting...</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ExternalRequest } from '../../background/request';
@Component
export default class RequestSelect extends Vue {
  mounted() {
    if (!this.$store.state.accounts.accounts[this.$store.state.accounts.address]) {
      console.log('No Account');
    } else {
      this.redirectToRequest();
    }
  }
  async redirectToRequest() {
    const { action } = (await this.$store.dispatch('request/getRequest')) as ExternalRequest;
    const actionToRouteName: Record<typeof action, string> = {
      ACTIVE_ACCOUNT: 'request-address',
      SIGN: 'request-sign',
      SIGN_TX: 'request-sign-tx',
      SEND_TX: 'request-send',
      ADD_NETWORK: 'request-add-network',
    };

    const routeName = actionToRouteName[action];
    // Check that we're still on the correct route
    if (this.$router.currentRoute.name === 'request-select-action') {
      this.$router.push({ name: routeName });
    }
  }
}
</script>

<style lang="scss"></style>
