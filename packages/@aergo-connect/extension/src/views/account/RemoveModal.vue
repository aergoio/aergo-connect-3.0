<template>
  <div class="removeModal_backdrop">
    <div class="removeModal_wrapper">
      <div class="icon-header">
        <Icon :name="`title-trash`" :size="36" />
      </div>
      <Heading>Remove account</Heading>
      <p>
        This will remove access to this account in this wallet. Make sure you have a backup or don't
        need this account anymore.
      </p>
      <ButtonGroup horizontal>
        <Button type="secondary" :to="{ name: 'accounts-list' }">Cancel</Button>
        <Button type="primary" @click="confirm">Confirm</Button>
      </ButtonGroup>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Button, ButtonGroup, ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

@Component({
  components: {
    Button,
    ContinueButton,
    ButtonGroup,
    Heading,
    Icon,
  },
})
export default class RequestAddress extends mixins() {
  async confirm() {
    // Better double check
    const nativeCheck = confirm(
      `Are you really sure you want to remove the account ${this.$route.params.address} from this wallet?`,
    );
    if (!nativeCheck) return;
    await this.$background.removeAccount({
      chainId: this.$route.params.chainId,
      address: this.$route.params.address,
    });
    this.$router.push({ name: 'accounts-list' });
  }
}
</script>

<style lang="scss">
.removeModal_backdrop {
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  .removeModal_wrapper {
    position: absolute;
    width: 317px;
    height: 400px;
    left: 32px;
    top: 100px;
    background: #ffffff;
    border-radius: 8px;
  }
}
</style>
