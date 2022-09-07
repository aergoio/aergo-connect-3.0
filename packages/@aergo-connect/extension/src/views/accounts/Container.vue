<template>
  <ScrollView class="page">
    <RouteTransition>
      <router-view></router-view>
    </RouteTransition>
  </ScrollView>
</template>

<script lang="ts">
import Vue from "vue";
import { ScrollView } from "@aergo-connect/lib-ui/src/layouts";
import RouteTransition from "@aergo-connect/lib-ui/src/nav/RouteTransition.vue";

export default Vue.extend({
  components: {
    ScrollView,
    RouteTransition,
  },
});
</script>

<style lang="scss"></style>
