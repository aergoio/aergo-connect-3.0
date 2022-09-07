import { storiesOf } from "@storybook/vue";
import { boolean } from "@storybook/addon-knobs";

import CheckboxButton from "./CheckboxButton.vue";
// import { boolean, select } from "@storybook/addon-knobs";
// import { InputVariants, InputStates } from "./types";
// import { Address } from "@herajs/common";

storiesOf("Forms/CheckboxButton", module).add("basic", () => ({
  components: { CheckboxButton },
  template: `
    <div style="max-width: 360px">
      <CheckboxButton :disabled="disabled"/>
    </div>`,
  props: {
    disabled: {
      type: Boolean,
      default: boolean("Disabled", false),
    },
  },
}));
