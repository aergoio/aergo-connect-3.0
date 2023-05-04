<template>
  <div class="removeToken_backdrop">
    <div class="removeToken_modal_wrapper">
      <Icon :name="`warning`" :size="50" />
      <div class="removeToken_title">
        Are you sure to hide <br />
        {{
          $store.state.accounts.option === `nft`
            ? userNft.meta.token_id
            : getTokens[$store.state.accounts.selectedToken].meta.name
        }}
        ?
      </div>
      <ButtonGroup class="button_wrapper" vertical>
        <ButtonVue type="secondary" size="medium" hover @click="handleConfirm">Confirm</ButtonVue>
        <ButtonVue type="secondary-outline" hover size="medium-outline" @click="handleCancel"
          >Cancel</ButtonVue
        >
      </ButtonGroup>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import ButtonGroup from '@aergo-connect/lib-ui/src/buttons/ButtonGroup.vue';
import ButtonVue from '@aergo-connect/lib-ui/src/buttons/Button.vue';
export default Vue.extend({
  components: { Icon, ButtonGroup, ButtonVue },
  data() {
    return {};
  },
  computed: {
    getTokens() {
      return this.$store.getters[`accounts/getTokens`];
    },
  },
  props: {
    userNft: {
      type: Object,
      default: [],
    },
  },

  methods: {
    handleConfirm() {
      // console.log('delete Token');

      if (this.$store.state.accounts.option === 'nft') {
        this.$store.commit('accounts/deleteNftInLocalStorage', this.userNft);
      } else {
        this.$store.dispatch('accounts/deleteToken', this.$store.state.accounts.selectedToken);
      }
      this.$router.push({
        name: 'accounts-list',
      });
    },
    handleCancel() {
      this.$emit('cancel', false);
    },
  },
});
</script>

<style lang="scss">
.removeToken_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  .removeToken_modal_wrapper {
    width: 317px;
    height: 350px;
    position: absolute;
    left: 28px;
    top: 110px;
    background: #ffffff;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .removeToken_title {
      width: 255px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      text-align: center;
      letter-spacing: -0.333333px;
      overflow: hidden;
      text-overflow: ellipsis;
      /* Primary/Pink01 */

      color: #e4097d;
    }
    .removeToken_text {
      width: 259px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      text-align: center;
      letter-spacing: -0.333333px;

      /* Grey/07 */

      color: #454344;

      .highlight {
        color: #e4097d;
      }
    }

    .button_wrapper {
      margin-top: 35px;
    }
    .button-group {
      .button {
        width: 289px;
      }
    }
  }
}
</style>
