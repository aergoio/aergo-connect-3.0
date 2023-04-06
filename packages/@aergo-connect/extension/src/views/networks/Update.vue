<template>
  <div class="account-list-view">
    <ScrollView>
      <Header
        button="back"
        :title="`${chainIdReadonly ? 'Update' : 'Add'} Custom Network`"
        :to="{ name: 'networks-list' }"
      />
      <div class="content">
        <TextField
          label="Chain ID"
          v-model="chainId"
          :state="chainIdValid ? 'valid' : 'initial'"
          :disabled="chainIdReadonly"
        />
        <TextField
          label="Node URL (http://... or https://...)"
          v-model="nodeUrl"
          :state="nodeUrlTested ? 'valid' : nodeUrlValid && !nodeUrlError ? 'loading' : 'initial'"
          :error="nodeUrlError"
          :style="{ marginTop: '10px' }"
        />
        <TextField
          label="ScanApi URL (Optional)"
          v-model="scanApiUrl"
          :state="scanApiUrlValid ? 'valid' : 'initial'"
          :style="{ marginTop: '10px' }"
        />
      </div>
      <template #footer>
        <div class="content">
          <ButtonGroup horizontal>
            <Button type="primary" :disabled="!canSave" @click="save" :hover="canSave">Save</Button>
          </ButtonGroup>
        </div>
      </template>
    </ScrollView>
  </div>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { Button, BackButton, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { TextField } from '@aergo-connect/lib-ui/src/forms';

import { Vue, Component, Watch } from 'vue-property-decorator';
// @ts-ignore
import AergoClient, { GrpcWebProvider } from '@herajs/client';

@Component({
  components: {
    ScrollView,
    Header,
    Heading,
    ButtonGroup,
    Button,
    BackButton,
    TextField,
  },
})
export default class NetworkUpdate extends Vue {
  chainId = '';
  chainIdReadonly = false;
  nodeUrl = '';
  scanApiUrl = '';
  nodeTestTimeout: NodeJS.Timeout | null = null;
  nodeUrlTested = false;
  nodeUrlError = '';

  get chainIdValid() {
    return this.chainId.length > 0 && this.chainId.match(/^[a-z0-9._-]+$/i);
  }
  get nodeUrlValid() {
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    return this.nodeUrl.length > 0 && this.nodeUrl.match(urlRegex);
  }
  get scanApiUrlValid() {
    const urlRegex =
      /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/;
    return this.scanApiUrl.length > 0 && this.scanApiUrl.match(urlRegex);
  }
  get canSave() {
    return this.chainIdValid && this.nodeUrlTested;
  }

  // beforeMount() {
  //   if (this.$store.state.ui.input[`networks`][`chainId`]) {
  //     this.chainId = this.$store.state.ui.input[`networks`][`chainId`];
  //   }
  // }

  async mounted() {
    if (this.$route.params.chainId) {
      // Load existing chain data for update
      this.chainId = this.$route.params.chainId;
      this.nodeUrl = 'Loading...';
      const chains = await this.$background.getNetworks();
      const chain = chains[this.chainId] as any;
      this.nodeUrl = chain['nodeUrl'];
      this.chainIdReadonly = true;
    }
  }

  updated() {
    // this.$store.commit('ui/setInputs', {
    //   key: 'networks',
    //   data: {
    //     chainId: this.chainId,
    //   },
    // });
    // console.log(this.chainId, 'chainId');
    // console.log(this.nodeUrl, 'nodeUrl');
    // console.log(this.chainIdValid, 'chainIdValid');
    // console.log(this.nodeUrlTested, 'nodeUrlTested');
    // console.log(this.scanApiUrl, 'scanApiUrl');
  }

  @Watch('nodeUrl')
  onNodeUrlChanged() {
    if (this.nodeTestTimeout) {
      clearTimeout(this.nodeTestTimeout);
    }
    this.nodeUrlTested = false;
    this.nodeUrlError = '';
    if (!this.nodeUrlValid) return;
    this.nodeTestTimeout = setTimeout(() => {
      this.testNodeConnection();
    }, 1000);
  }

  async testNodeConnection() {
    const aergo = new AergoClient({}, new GrpcWebProvider({ url: this.nodeUrl }));
    try {
      await aergo.blockchain();
      this.nodeUrlTested = true;
    } catch (e) {
      console.log(e);
      this.nodeUrlError = `${e}`;
    }
  }

  async save() {
    await this.$store.commit('accounts/setNetwork', this.chainId);
    if (this.scanApiUrlValid) {
      await this.$background.addNetwork({
        chainId: this.chainId,
        nodeUrl: this.nodeUrl,
        scanApiUrl: this.scanApiUrl,
      });
    } else {
      await this.$background.addNetwork({
        chainId: this.chainId,
        nodeUrl: this.nodeUrl,
      });
    }

    this.$router.push({ name: 'networks-list' });
  }
}
</script>

<style lang="scss">
.account-list-view {
  height: 100%;
  box-sizing: border-box;
  .content {
    width: 90vw;
    margin-left: 20px;
    margin-top: 10px;
  }
}
.account-list-header {
  border-bottom: 1px solid #f2f2f2;
  padding: 0 20px;
}
</style>
