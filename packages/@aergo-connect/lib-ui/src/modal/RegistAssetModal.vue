<template>
  <div class="registAsset_backdrop">
    <div class="registAsset_modal_wrapper" v-if="!isNext">
      <div class="registAsset_title">Imported Asset Successfully!</div>
      <Identicon :text="result.hash" class="token_icon" />
      <p>
        {{ $route.params.result.meta.name }}
        {{ result.meta.symbol }}
        {{ result.meta.type }}
        {{ result.hash }}
      </p>
      <ButtonGroup class="button_wrapper" vertical>
        <ButtonVue type="secondary" size="medium" hover @click="register" @cancel="handleCancel"
          >Confirm</ButtonVue
        >
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

  methods: {
    handleCancel() {
      this.$emit('cancel', 'registAssetModal');
    },
    register() {
      this.isNext = true;
    },
  },
});
</script>

<style lang="scss">
.registAsset_backdrop {
  position: absolute;
  width: 375px;
  height: 600px;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  .registAsset_modal_wrapper {
    width: 317px;
    height: 400px;
    position: absolute;
    left: 28px;
    top: 110px;
    background: #ffffff;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .registAsset_title {
      width: 255px;
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      text-align: center;
      letter-spacing: -0.333333px;

      /* Primary/Pink01 */

      color: #e4097d;
    }
    .registAsset_text {
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
      margin-top: 53px;
    }
  }
}
</style>
