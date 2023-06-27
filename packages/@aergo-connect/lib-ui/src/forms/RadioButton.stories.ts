import { storiesOf } from "@storybook/vue";
import { boolean } from "@storybook/addon-knobs";
import RadioButton from "./RadioButton.vue";

storiesOf("Forms/RadioButton", module).add("basic", () => ({
  components: { RadioButton },
  template: `
    <div style="max-width: 360px">
      <RadioButton :disabled="disabled"/>
    </div>`,
  props: {
    disabled: {
      type: Boolean,
      default: boolean("Disabled", false),
    },
  },
}));
