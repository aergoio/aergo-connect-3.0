<template>
  <div class="account-list-view">
    <ScrollView>
      <Header
        button="back"
        :title="`${chainIdReadonly ? 'Update' : 'Add'} Custom Network`"
        @backClick="backClick"
      />
      <div class="content">
        <TextField
          label="Network Name"
          v-model="networkName"
          :state="availableNetwork && networkName ? 'valid' : !networkName ? 'initial' : 'invalid'"
        />
        <TextField
          label="Node URL (http://... or https://...)"
          v-model="nodeUrl"
          :state="nodeUrlUiState"
          :error="nodeUrlError"
          :style="{ marginTop: '10px' }"
        />
        <TextField
          v-if="nodeUrlTested"
          label="Chain ID"
          :value="chainInfo?.chainid?.magic"
          :state="chainIdValid ? 'valid' : 'invalid'"
          :disabled="chainIdReadonly"
          :style="{ marginTop: '10px' }"
        />
        <TextField
          v-if="nodeUrlTested"
          label="ScanApi URL (Optional)"
          v-model="scanApiUrl"
          :state="scanApiUiState"
          :style="{ marginTop: '10px' }"
        />
        <TextField
          v-if="nodeUrlTested"
          label="ScanExplorer URL (Optional)"
          v-model="scanExplorerUrl"
          :state="scanExplorerUiState"
          :style="{ marginTop: '10px' }"
        />
      </div>
      <template #footer>
        <div class="content">
          <Button
            :style="{ marginLeft: '-9px', width: '336px' }"
            type="primary"
            :disabled="!canSave"
            @click="save"
            :hover="canSave"
            >Save</Button
          >
        </div>
      </template>
      <Notification v-if="notification" :title="notificationText" :size="300" :icon="`warning2`" />
    </ScrollView>
  </div>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { Button, BackButton, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { TextField } from '@aergo-connect/lib-ui/src/forms';
import Notification from '@aergo-connect/lib-ui/src/modal/Notification.vue';

import { Vue, Component, Watch } from 'vue-property-decorator';
// @ts-ignore
import AergoClient, { GrpcWebProvider } from '@herajs/client';
import { ChainInfo } from '@herajs/client/types/rpc_pb';

@Component({
  components: {
    ScrollView,
    Header,
    Heading,
    ButtonGroup,
    Button,
    BackButton,
    TextField,
    Notification,
  },
})
export default class NetworkUpdate extends Vue {
  networkName = '';
  // paramsNetworkName = '';
  chainId = '';
  chainIdReadonly = false;
  paramsName = '';
  nodeUrl = '';
  scanApiUrl = '';
  scanExplorerUrl = '';
  nodeTestTimeout: NodeJS.Timeout | null = null;
  nodeUrlTested = false;
  nodeUrlError = '';
  scanApiUrlTested = false;
  scanExplorerUrlTested = false;
  availableNetwork = true;
  chainInfo: ChainInfo | null | any = null;
  notification = false;
  notificationText = '';

  get chainIdValid() {
    return (
      this.chainInfo?.chainid?.magic.length > 0 &&
      this.chainInfo?.chainid?.magic.match(/^[a-z0-9._-]+$/i)
    );
  }
  get nodeUrlValid() {
    const urlRegexWithNoTrailingSlash =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)(?<!\/)$/;
    return this.nodeUrl.length > 0 && this.nodeUrl.match(urlRegexWithNoTrailingSlash);
  }
  get scanApiUrlValid() {
    const urlRegexWithV2AndNoTrailingSlash =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*\/v2)(?<!\/)$/;
    return this.scanApiUrl.length > 0 && this.scanApiUrl.match(urlRegexWithV2AndNoTrailingSlash);
  }
  get scanExplorerUrlValid() {
    const regex = /^(?:https?:\/\/)?[\w.-]+(?:\.[\w]{2,}){1,}(?:\/)?$/;
    return (
      this.scanExplorerUrl.length > 0 &&
      this.scanExplorerUrl.slice(-1) !== '/' &&
      regex.test(this.scanExplorerUrl)
    );
  }
  get canSave() {
    if (this.scanApiUrl || this.scanExplorerUrl) {
      return (
        this.chainIdValid &&
        this.nodeUrlTested &&
        this.availableNetwork &&
        this.scanApiUrlTested &&
        this.scanExplorerUrlTested &&
        this.scanExplorerUrlValid
      );
    } else {
      return this.chainIdValid && this.nodeUrlTested && this.availableNetwork;
    }
  }

  get nodeUrlUiState() {
    if (this.nodeUrlTested) {
      return 'valid';
    } else {
      if (this.nodeUrlValid && !this.nodeUrlError) {
        return 'loading';
      } else if (this.nodeUrlError) {
        return 'invalid';
      } else {
        return 'initial';
      }
    }
  }

  get scanApiUiState() {
    if (!this.scanApiUrl) {
      return 'initial';
    } else {
      if (this.scanApiUrlValid && this.scanApiUrlTested) {
        return 'valid';
      } else {
        return 'invalid';
      }
    }
  }
  get scanExplorerUiState() {
    if (!this.scanExplorerUrl) {
      return 'initial';
    } else {
      if (this.scanExplorerUrlValid && this.scanExplorerUrlTested) {
        return 'valid';
      } else {
        return 'invalid';
      }
    }
  }

  beforeMount() {
    if (this.$store.state.ui.input[`networks`][`networkName`]) {
      this.networkName = this.$store.state.ui.input[`networks`][`networkName`];
    }
    if (this.$store.state.ui.input[`networks`][`nodeUrl`]) {
      this.nodeUrl = this.$store.state.ui.input[`networks`][`nodeUrl`];
    }
    if (this.$store.state.ui.input[`networks`][`chainId`]) {
      this.chainId = this.$store.state.ui.input[`networks`][`chainId`];
    }
    if (this.$store.state.ui.input[`networks`][`scanApiUrl`]) {
      this.scanApiUrl = this.$store.state.ui.input[`networks`][`scanApiUrl`];
    }
    if (this.$store.state.ui.input[`networks`][`scanExplorerUrl`]) {
      this.scanExplorerUrl = this.$store.state.ui.input[`networks`][`scanExplorerUrl`];
    }
    if (this.$store.state.ui.input[`networks`][`paramsName`]) {
      this.paramsName = this.$store.state.ui.input[`networks`][`paramsName`];
    }
  }

  async mounted() {
    if (this.$route.params.chainId) {
      // Load existing chain data for update
      this.networkName = this.$route.params.label;
      this.chainId = this.$route.params.chainId;
      this.nodeUrl = 'Loading...';
      const chains = await this.$background.getNetworks();
      const chain = chains[this.chainId] as any;
      this.nodeUrl = chain['nodeUrl'];
      this.scanApiUrl = chain['scanApiUrl'];
      this.scanExplorerUrl = chain['scanExplorerUrl'];
      this.chainIdReadonly = true;
      this.paramsName = this.$route.params.label;
    }
    if (this.paramsName) {
      this.chainIdReadonly = true;
    }
  }

  updated() {
    this.$store.commit('ui/setInputs', {
      key: 'networks',
      data: {
        chainId: this.chainId,
        networkName: this.networkName,
        nodeUrl: this.nodeUrl,
        scanApiUrl: this.scanApiUrl,
        scanExplorerUrl: this.scanExplorerUrl,
        paramsName: this.paramsName,
      },
    });
  }

  @Watch('networkName')
  onChangeNetworkName() {
    if (
      this.networkName === 'mainnet' ||
      this.networkName === 'testnet' ||
      this.networkName === 'alpha' ||
      this.networkName.length === 0
    ) {
      this.availableNetwork = false;
    } else {
      this.availableNetwork = true;
    }
  }

  @Watch('nodeUrl')
  async onNodeUrlChanged() {
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
      this.chainInfo = await aergo.getChainInfo();
      this.nodeUrlTested = true;
      this.chainId = this.chainInfo.chainid.magic;
    } catch (e) {
      // console.log(e);
      this.nodeUrlError = `${e}`;
    }
  }

  @Watch('scanApiUrl')
  async onScanApiUrlChanged() {
    if (this.scanApiUrlValid) {
      const aergo = new AergoClient({}, new GrpcWebProvider({ url: this.nodeUrl }));
      const url = `${this.scanApiUrl}/chainInfo`;
      const res = await fetch(url);
      const response = await res.json();
      try {
        //TODO: '여기있는 데이터에 chainId를 가져와서 chainId 유효성 검사 해야함.'
        // console.log(
        //   response[0].hash,
        //   '여기있는 데이터에 chainId를 가져와서 chainId 유효성 검사 해야함.',
        // );
        await aergo.blockchain();
        this.chainInfo = await aergo.getChainInfo();
        if (response[0].hash === this.chainInfo.chainid.magic && this.scanApiUrlValid) {
          this.scanApiUrlTested = true;
        } else {
          this.scanApiUrlTested = false;
        }
      } catch (e) {
        this.scanApiUrlTested = false;
        console.error(e, 'error');
      }
    }
  }

  @Watch('scanExplorerUrl')
  async onScanExplorerUrlChanged() {
    // if (this.scanExplorerUrl) {
    try {
      const consensusUrl = `${this.scanExplorerUrl}/consensus`;
      const accountUrl = `${this.scanExplorerUrl}/account/${this.$store.state.accounts.address}`;
      const consensusRes = await fetch(consensusUrl);
      const accountRes = await fetch(accountUrl);

      // const [consensusRes, accountRes] = await Promise.all([
      //   axios.get(consensusUrl),
      //   axios.get(accountUrl),
      // ]);
      if (consensusRes.status === 200 && accountRes.status === 200) {
        this.scanExplorerUrlTested = true;
      } else {
        this.scanExplorerUrlTested = false;
      }
    } catch (e) {
      this.scanExplorerUrlTested = false;
      console.error(e);
    } finally {
      if (this.scanExplorerUrlTested === undefined) {
        this.scanExplorerUrlTested = false;
      }
    }
    // }
  }

  @Watch('notification')
  notificationMethod(state: boolean) {
    if (state) {
      const timeoutId = setTimeout(() => {
        this.notification = !state;
      }, 2000);
      clearTimeout(timeoutId);
    }
  }

  async save() {
    if (!this.nodeUrlValid || !this.chainIdValid || !this.availableNetwork) {
      return;
    }

    const networkPath = {
      label: this.networkName,
      chainId: this.chainId,
      nodeUrl: this.nodeUrl,
      scanApiUrl: this.scanApiUrl,
      scanExplorerUrl: this.scanExplorerUrl,
    };

    if (this.chainIdReadonly) {
      // update network
      const updateObject = {
        updateNetworkName: this.paramsName,
        networkPath: networkPath,
      };
      await this.$background.removeNetwork({ chainId: networkPath.chainId });
      await this.$background.addNetwork(networkPath);

      this.$store.commit('accounts/updateNetworkPath', updateObject);
    } else {
      // add network
      const alreadyAddedNetwork = this.$store.state.accounts.networksPath.filter((network) => {
        if (network.label === this.networkName) {
          return network;
        }
      });
      if (alreadyAddedNetwork.length > 0) {
        this.notification = true;
        this.notificationText = `This Network is already added. [${this.networkName}]`;
        return;
      } else {
        await this.$background.addNetwork(networkPath);
        this.$store.commit('accounts/setNetworkPath', networkPath);
      }
    }

    this.$store.commit('ui/clearInput', { key: 'networks' });
    this.$router.push({ name: 'networks-list' });
    await this.$store.commit('accounts/setActiveAccount', this.$store.state.accounts.address);
    await this.$store.commit('accounts/setChain', {
      chainId: this.chainId,
      chainLabel: this.networkName,
    });
  }

  backClick() {
    this.$store.commit('ui/clearInput', { key: 'networks' });
    this.$router.push({
      name: 'networks-list',
      params: {},
    });
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
