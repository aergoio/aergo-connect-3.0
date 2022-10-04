<template>
  <ScrollView>
    <Header button="back" title="Send" @backClick="handleBack" />
    <div class="send_content">
      <div class="account_info_wrapper">
        <div class="network_wrapper">
          <div class="network_status" />
          <div class="network_name">
            {{ this.$store.state.accounts.network || `AERGO Mainnet` }}
          </div>
        </div>
        <div class="account_info">
          <Identicon />
          <div class="account_name">{{ this.$store.state.accounts.nick }}</div>
          <div class="account_wrapper">
            <div>{{ this.$store.state.accounts.address }}</div>
          </div>
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
export default Vue.extend({
  components: { ScrollView, Header },
  methods: {
    handleBack() {
      this.$router.push({
        name: 'accounts-list-address',
        params: {
          address: this.$store.state.accounts.address,
        },
      });
    },
  },
});
</script>

<style lang="scss"></style>
