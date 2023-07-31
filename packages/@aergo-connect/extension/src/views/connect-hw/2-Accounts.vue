<template>
  <ScrollView class="page">
    <!-- <template #header> -->
    <div class="content">
      <Header button="back" title="Connect Ledger" :to="{ name: `register` }" />
      <p style="margin-bottom: 0; display: flex; justify-content: center">
        <div v-if="!accounts.length" class="ledger-description">
        <ol>
          <li>Connect your wallet directly to your computer.</li>
          <div class="img">
            <img :style="{width:'207px', height:'59px'}":src="ledger1" alt="ledger1"/>
          </div>

          <li>Enter PIN on your ledger and press the two buttons on the top together.</li>
          <div class="img">
            <img :style="{width:'218px', height:'44px'}" :src="ledger2" alt="ledger2"/>
          </div>

          <li class="third">Select the ‘Aergo App’, and then press the buttons in the pending status.</li>
          <li>You can continue if this phrase appears.</li>
          <div class="img">
            <img :style="{width:'114px', height:'42px'}" :src="ledger3" alt="ledger3"/>
          </div>
        </ol>

        </div>
        <span v-else>Select one account from your device.</span>
        <Button :style="{marginLeft:'24px'}" type="primary" size="large" @click="connect" hover>Continue</Button>
      </p>
    </div>
    <!-- </template> -->

    <div class="ledger-account-list-wrap">
      <AccountList
        v-if="accounts.length"
        :accounts="accounts"
        :groupByChain="false"
        :highlightNew="false"
        accountRoute="account-imported"
        @select="selectAccount"
      />
    </div>

    <!-- <template #footer> -->
    <!-- <div class="content" v-if="!accounts.length"> -->
        
    <!-- </div> -->
    <LoadingDialog
      :visible="connectDialogVisible"
      @close="connectDialogVisible = false"
      title="Ledger"
      :state="dialogState"
    >
      <p v-if="dialogState !== 'error'">{{ connectStatus }}</p>
      <p v-else class="error">{{ error }}</p>
    </LoadingDialog>
    <!-- </template> -->
  </ScrollView>
</template>

<script lang="ts">
import { BackButton, ContinueButton, Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView, LoadingDialog } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { Header } from '@aergo-connect/lib-ui/src/layouts';
import SelectField from '@aergo-connect/lib-ui/src/forms/SelectField.vue';
import { PersistInputsMixin } from '../../store/ui';
import AccountList from '../../components/accounts/AccountList.vue';
import SelectNetwork from '../../components/accounts/SelectNetwork.vue';
import Component, { mixins } from 'vue-class-component';
import { timedAsync } from 'timed-async/index.js';
import { Account, serializeAccountSpec } from '@herajs/wallet';
import Transport from '@ledgerhq/hw-transport-webusb';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';

@Component({
  components: {
    Header,
    ScrollView,
    BackButton,
    Heading,
    SelectField,
    ContinueButton,
    Button,
    ButtonGroup,
    LoadingDialog,
    AccountList,
    SelectNetwork,
  },
})
export default class Import extends mixins(PersistInputsMixin) {
  persistFields = ['chainId'];
  persistFieldsKey = 'account-connect-hw';

  accounts: Account[] = [];
  loading = false;
  error = '';
  connectStatus = '';
  connectDialogVisible = false;
  dialogState: 'loading' | 'success' | 'error' = 'loading';

  ledger1 = require('@/assets/img/ledger1.png')
  ledger2 = require('@/assets/img/ledger2.png')
  ledger3 = require('@/assets/img/ledger3.png')

  async connect() {
    this.connectDialogVisible = true;
    this.dialogState = 'loading';
    this.error = '';
    this.connectStatus = 'Connecting to Ledger device...';
    try {
      const transport = await timedAsync(Transport.create(), { fastTime: 1000 });
      const app = new LedgerAppAergo(transport);
      this.connectStatus = 'Loading accounts...';
      const accounts = await this.loadAccounts(app, 0, 5);
      console.log(accounts, 'accounts updated');
      this.accounts.push(...accounts);
      this.dialogState = 'success';
      this.connectStatus = 'Done!';
      setTimeout(() => {
        this.connectDialogVisible = false;
      }, 1000);
    } catch (e) {
      if (`${e}`.match(/No device selected/)) {
        this.error = "You didn't select a compatible USB device.";
      } else if (`${e}`.match(/CLA_NOT_SUPPORTED/)) {
        this.error = `Make sure to activate the Aergo app on your device and try again.`;
      } else {
        this.error = `Make sure the device is connected and not used by another desktop appplication. ${e}`;
      }
      this.dialogState = 'error';
    }
  }

  async loadAccounts(app: LedgerAppAergo, from: number, to: number): Promise<Account[]> {
    const accounts: Account[] = [];
    const statePromises = [];
    for (let i = from; i < to; i++) {
      const path = "m/44'/441'/0'/0/" + i;
      const address = await app.getWalletAddress(path);
      const aergoChainIds = ['aergo.io', 'testnet.aergo.io', 'alpha.aergo.io'];
      // const chainId = aergoChainIds.includes(this.$store.state.accounts.chainId)
      //   ? this.$store.state.accounts.chainId
      //   : this.$store.state.accounts.chainLabel;
      const spec = {
        address: `${address}`,
        chainId: this.$store.state.accounts.chainId,
      };
      const account = new Account(
        serializeAccountSpec(spec),
        Account.getDefaultData({
          spec,
          type: 'ledger',
          derivationPath: path,
        }),
      );
      accounts.push(account);
      statePromises.push(
        this.$background.getAccountState(spec).then((state) => {
          account.data.balance = `${state.balance}`;
        }),
      );
      console.log(statePromises, 'statePromises');
    }
    // Wait for remaining state promises to resolve
    await Promise.all(statePromises);
    return accounts;
  }

  async selectAccount(account: Account): Promise<void> {
    try {
      await this.$background.addAccount(account.data);
      await this.$store.dispatch('accounts/addAccount', account.data.spec.address);
      alert('Account added success!');
    } catch (e) {
      alert(e);
    } finally {
      await window.close();
    }
  }
}
</script>

<style lang="scss">
.connect-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 100%;
  .loading-indicator {
    margin-bottom: 15px;
  }
  p {
    font-size: (calc(13 / 16)) * 1rem;
    max-width: 260px;
  }
  p.error {
    color: #ee4648;
    margin-top: 1em;
  }
}
.ledger-account-list-wrap {
  border-radius: 2px;
  box-shadow: 0 12px 20px 0 rgba(34, 34, 34, 0.08);
  margin: 0 10px 25px 20px;
}

  .ledger-description{
    margin-left:30px;
    margin-right:30px;


  >ol {
    counter-reset: item; /* 카운터 초기화 */
    list-style-type: none; /* 기본 리스트 마커 숨김 */
    padding-left: 1em; /* 왼쪽 여백을 주어 마커와 아이템 간의 공간을 만듦 */
    display: flex;
    flex-direction: column;
    li{
      counter-increment: item; /* 카운터를 1씩 증가시킴 */
      position: relative; /* 부모 요소를 기준으로 카운터 위치 지정 */
      padding-left: 1.5em; /* 아이템의 왼쪽 여백을 줘서 마커를 표시할 공간 확보 */
      color: var(--grey-06, #686767);
      font-family: Outfit;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.333px;
      margin-bottom:12px;
    }
    li:before{
      content: counter(item) ". "; /* 카운터 값을 표시함 */
      position: absolute; /* 절대 위치로 지정하여 아이템 텍스트와 겹치지 않도록 함 */
      left: 0; /* 아이템 왼쪽에 위치 */
      color: var(--grey-06, #686767);
    }
    li.third{
      margin-bottom:26px;
    }
    .img{
      text-align: right;
      img{
        
        flex-shrink: 0;
        margin-bottom:16px;
      }
    }
  }
}

</style>
