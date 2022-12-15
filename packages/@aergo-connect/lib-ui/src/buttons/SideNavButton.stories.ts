import { storiesOf } from '@storybook/vue';
import SideNavButton from './SideNavButton.vue';
// import { boolean, select } from "@storybook/addon-knobs";
// import { InputVariants, InputStates } from "./types";
// import { Address } from "@herajs/common";

storiesOf('Buttons/SideNavButton', module).add('basic', () => ({
  components: { SideNavButton },
  template: `
      <SideNavButton :disabled="disabled"/>
    `,
  props: {},
}));
