<template>
  <ScrollView class="page">
    <div class="content">
      <Header button="back" />
      <Heading>{{ $route.name || $route.path }}</Heading>
      <Button type="primary-outline" size="large" :to="{ name: 'account-backup-mnemonic' }">
        Mnemonic Seed Phrase
      </Button>
      <Button type="primary-outline" size="large" :to="{ name: 'account-backup-encrypted' }">
        Encrypted Private Key
      </Button>
      <Button type="primary-outline" size="large" :to="{ name: 'account-backup-keystore' }">
        Keystore File
      </Button>
      <router-view></router-view>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import { Button } from '@aergo-connect/lib-ui/src/buttons';
export default Vue.extend({
  components: {
    ScrollView,
    Heading,
    Header,
    Button,
  },
});
</script>
