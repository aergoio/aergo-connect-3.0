<template>
  <ScrollView>
    <Identicon :text="address" class="circle" />
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
      <Button type="primary-outline" size="large" :to="{ name: 'account-backup' }">
        Backup Private Key
      </Button>
      <Button :to="{ name: 'accounts-list' }" type="primary" size="large">
        Home
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
import { Identicon } from '@aergo-connect/lib-ui/src/content';
@Component({
  components: {
    Identicon,
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
  mnemonic = '';
  async beforeMount() {
    const { address, chainId } = await this.$route.params;
    this.address = address;
    this.chainId = chainId;
    console.log(this.$store);
    console.log(isPublicChainId(chainId), 'hellow world');
  }
}
</script>

<style lang="scss"></style>
