<template>
  <Button @click="handleClick" :to="to" type="icon" class="back-button">
    <Icon :name="`back`" :size="36" />
  </Button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Button from './Button.vue';
import { RawLocation } from 'vue-router';
import Icon from '../icons/Icon.vue';

export default Vue.extend({
  components: {
    Button,
    Icon,
  },
  props: {
    to: {
      type: [String, Object] as PropType<RawLocation>,
    },
    onClick: {
      type: Function,
    },
  },
  methods: {
    handleClick() {
      if (typeof this.onClick === 'function') {
        this.onClick();
        return;
      }
      // Default action, can be overridden with custom route by passing `to`
      if (typeof this.$router !== 'undefined') {
        this.$router.go(-1);
        /*if (this.$store.state.ui.route.previousPath) {
          this.$router.push(this.$store.state.ui.route.previousPath);
        } else {
          this.$router.push({ name: 'home' });
        }*/
      }
    },
  },
});
</script>

<style lang="scss">
.back-button {
  margin-left: -10px;
  justify-content: flex-start;
}
.button-group-horizontal .back-button {
  margin-left: 0px;
}
.header .back-button {
  margin-left: -7px;
}
</style>
