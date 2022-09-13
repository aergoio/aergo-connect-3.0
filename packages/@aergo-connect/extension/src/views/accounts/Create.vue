<template>
  <ScrollView>
    <img src="../../assets/img/dummy-logo.svg" alt="" />
    <Heading class="big-title">Registered Account!</Heading>

    <div>
      <span>Address</span>
      <div>
        <span>{{ address }}</span>
      </div>
    </div>

    <div>
      <div>
        <span>Nickname</span>
        <!-- <img src="@aergo-connect/lib-ui/src/icons/img/edit.svg" alt="" /> -->
        <!-- <Icon :name=" ? 'logo' : 'network-other'" :size="36" /> -->
        <div>
          <span>ACCOUNT 1</span>
        </div>
      </div>
    </div>
    <ButtonGroup vertical>
      <Button
        type="primary-outline"
        size="large"
        :to="{ name: 'setup', params: { next: 'account-import' } }"
      >
        Import
      </Button>
      <Button @click="create" type="primary" size="large">
        Create
      </Button>
    </ButtonGroup>
  </ScrollView>
</template>

<script lang="ts">
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Component, { mixins } from 'vue-class-component';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import { isPublicChainId } from '../../config';

@Component({
  components: {
    ScrollView,
    Heading,
    ButtonGroup,
    Button,
    Icon,
  },
})
export default class Create extends mixins() {
  address = '';
  chainId = '';
  chainIdUrl = '';
  async beforeMount() {
    const { address, chainId } = await this.$route.params;
    this.address = address;
    this.chainId = chainId;
    console.log(isPublicChainId(chainId), 'hellow world');
  }
}
</script>

<style lang="scss"></style>
