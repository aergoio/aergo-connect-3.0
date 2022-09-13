<template>
  <ScrollView class="page">
    <template #header>
      <!--      <AccountHeader back-route-name="balanceListRoute"></AccountHeader>-->
      <AccountHeader></AccountHeader>
    </template>
    <RouteTransition>
      <router-view></router-view>
    </RouteTransition>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import RouteTransition from '@aergo-connect/lib-ui/src/nav/RouteTransition.vue';
import AccountHeader from '../../components/AccountHeader.vue';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
  components: {
    ScrollView,
    Heading,
    AccountHeader,
    RouteTransition,
  },
})
export default class AccountFrame extends Vue {
  @Prop({ type: String, default: 'balance-list' }) readonly balanceListRoute!: string;
}
</script>

<style lang="scss"></style>
