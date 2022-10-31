<template>
  <div class="side-nav-backdrop fade-in-right" @click="(event) => handleListModalOff(event)">
    <div class="side-nav-wrap">
      <section class="side-nav-accounts">
        <img class="side-nav-logo" src="@aergo-connect/lib-ui/src/icons/img/nav-logo.svg" />
        <div class="accounts-dropDown" @click="(event) => handleAccountsDropDown(event)">
          <span>Accounts</span>
          <img
            v-if="isAccountsListOpened"
            src="@aergo-connect/lib-ui/src/icons/img/arrow-down.svg"
          />
          <img v-else src="@aergo-connect/lib-ui/src/icons/img/arrow-up.svg" />
        </div>
        <AccountList
          :accounts="$store.state.accounts.accounts"
          v-if="isAccountsListOpened"
          canDelete
          @select="handleSelect"
        />
        <AccountList
          v-else
          :account="$store.state.accounts.accounts[$store.state.accounts.address]"
        />
        <SideNavButton img="add" title="Add Account" :to="{ name: 'register' }" />
        <!-- <SideNavButton
          class="remove"
          :disabled="!$store.state.accounts.accounts[$store.state.accounts.address].backup"
          img="delete"
          title="Remove Account"
          @click="
            [
              $store.state.accounts.accounts[$store.state.accounts.address].backup
                ? handleRemoveModal()
                : handleAlert(),
            ]
          "
        /> -->
      </section>
      <section class="nav-footer">
        <div>
          <SideNavButton img="sign-message" title="Sign Message" :to="{ name: 'sign-message' }" />
          <SideNavButton img="security" title="Security" @click="handleSecurity" />
          <SideNavButton img="lock" title="Lock" />
        </div>
        <div class="side-nav-version" @click="handleVersion">
          <span>Version</span>
          <span>3.0</span>
          <img src="@aergo-connect/lib-ui/src/icons/img/arrow-right.svg" />
        </div>
      </section>
    </div>
  </div>

  <!-- <AddAccountDialog :visible="addAccountDialogVisible" @close="addAccountDialogVisible = false" /> -->
</template>

<script lang="ts">
import AccountList from '../components/accounts/AccountList.vue';
import { SideNavButton } from '@aergo-connect/lib-ui/src/buttons';
import Vue from 'vue';

export default Vue.extend({
  components: { AccountList, SideNavButton },
  data() {
    return {
      isAccountsListOpened: true,
      nick: '',
    };
  },
  props: {},
  computed: {
    accounts(): any[] {
      // const accounts = this.$store.state.accounts.accounts;
      // console.log('List ORG', accounts);
      // const ac = Object.values(this.$store.state.accounts.accounts);
      // console.log('List ORG', ac);
      return Object.values(this.$store.state.accounts.accounts);
    },
    /*
      const accounts = Object.values(this.$background.getAccounts()) ;
      console.log("List", accounts);
      console.log("List", this.$background.getAccounts()) ;
*/
  },

  methods: {
    handleListModalOff(event: any) {
      event.stopPropagation();
      this.$emit('listModalOff');
    },
    handleAccountsDropDown(event: any) {
      event.stopPropagation();
      this.isAccountsListOpened = !this.isAccountsListOpened;
    },

    // handleRemoveModal() {
    //   this.$emit('removeModalClick');
    // },
    // handleAlert() {
    //   console.log('notification');
    //   this.$emit('notificationModalClick');
    // },

    async handleSelect(account: any) {
      const address = account.address;
      await this.$store.commit('accounts/setActiveAccount', address);

      this.$emit('select', account);
      this.$router.push({ name: 'accounts-list' }).catch(() => {});
    },

    handleLock() {
      this.$background.lock();
    },

    handleSecurity() {
      this.$emit('securityClick');
    },
    handleVersion() {
      this.$router.push({ name: 'version' }).catch(() => {});
    },
  },
  mounted() {
    //    this.$store.dispatch('accounts/fetchAccounts');
  },
});
</script>

<style lang="scss">
.fade-in-right {
  display: inline-block;
  padding: 10px;
  animation: fadeInRight 0.5s;
}
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translate3d(20%, 0, 0);
  }
  to {
    opacity: 1;
    transform: translateZ(100);
  }
}

.side-nav-backdrop {
  position: absolute;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .side-nav-wrap {
    position: absolute;
    left: 0;
    bottom: 0;

    height: 546px;
    box-sizing: border-box;
    width: 270px;
    background: #ffffff;
    box-shadow: 3px 0px 18px rgb(0 0 0 / 15%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;
    padding-left: 16px;
    z-index: 1;
    .side-nav-logo {
      margin-left: 14px;
    }

    .accounts-dropDown {
      display: flex;
      z-index: 2;
      justify-content: space-between;
      margin: 12px 20px 12px 6px;
      cursor: pointer;
    }

    .side-nav-accounts {
      margin-top: 26px;
      .remove {
        color: red;
        font-size: smaller;
        rect {
          fill: red;
        }
        &:hover {
          svg {
            filter: invert(20%) sepia(68%) saturate(6664%) hue-rotate(355deg) brightness(97%)
              contrast(126%);
          }
        }
      }
    }

    .nav-footer {
      .side-nav-version {
        margin-left: 10px;
        font-weight: 300;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: -0.333333px;
        color: #9c9a9a;
        display: flex;
        padding: 18px 0 33px 0;
        cursor: pointer;
        span {
          &:nth-child(2) {
            margin: 0px 24px 0 110px;
            color: #279ecc;
          }
        }
      }
    }
  }
}
</style>
