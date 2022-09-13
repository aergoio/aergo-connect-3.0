<template>
  <ScrollView class="page">
    <div>
      <Header button="add" :refresh="true" title="Register Account" />
      <Appear>
        <!-- <Heading class="big-title">Welcome to Aergo Connecttt</Heading> -->
      </Appear>
    </div>

    <template #footer>
      <div class="content">
        <Appear :delay="0.6">
          <ButtonGroup vertical>
            <Button type="primary" :to="{ name: 'setup', params: { next: 'account-create' } }"
              >Create new wallet</Button
            >
            <Button type="secondary" :to="{ name: 'setup', params: { next: 'account-import' } }"
              >Import your wallet</Button
            >
          </ButtonGroup>
        </Appear>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { Header, ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';
import Component, { mixins } from 'vue-class-component';
import { PersistInputsMixin } from '../../store/ui';

export default Vue.extend({
  components: {
    ScrollView,
    Button,
    ButtonGroup,
    Heading,
    Appear,
    Header,
  },
});
</script>

<style lang="scss">
.welcome-content {
  margin-top: 100px;
  padding: 20px;
}
</style>
