<template>
  <ScrollView>
    <Header button="back" title="send" @backClick="handleBack" />
    <div class="_content"></div>
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
        name: 'accounts-list',
        params: {
          address: this.$store.state.accounts.address,
        },
      });
    },
  },
});
</script>

<style lang="scss"></style>
