<template>
  <ScrollView class="page">
    <div class="content">
      <Header button="back" title="Connect Hardware Wallet" :to="{ name: `register` }" />
      <!-- <Heading animated>Connect Hardware Wallet</Heading> -->
      <p>
        Please select the network for which you want to import an account from a connected Ledger
        Nano S.
      </p>
      <SelectNetwork v-model="chainId" />
    </div>
    <template #footer>
      <div class="content">
        <ContinueButton :to="{ name: 'account-connect-hw-accounts' }" />
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { BackButton, ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { Header } from '@aergo-connect/lib-ui/src/layouts';
import SelectNetwork from '../../components/accounts/SelectNetwork.vue';
import { PersistInputsMixin } from '../../store/ui';
import { PublicChainIds, PublicChainData } from '../../config';

import Component, { mixins } from 'vue-class-component';

const publicChainOptions = PublicChainIds.map((chainId) => [
  chainId,
  PublicChainData[chainId].label,
]);

@Component({
  components: {
    Header,
    ScrollView,
    BackButton,
    Heading,
    SelectNetwork,
    ContinueButton,
  },
})
export default class Import extends mixins(PersistInputsMixin) {
  chainId = 'aergo.io';
  persistFields = ['chainId'];
  persistFieldsKey = 'account-connect-hw';
  options = publicChainOptions;
}
</script>

<style lang="scss"></style>
