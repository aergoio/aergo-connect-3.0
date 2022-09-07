import { storiesOf } from "@storybook/vue";
import PasswordStrengthField from "./PasswordStrengthField.vue";
import { select, text } from "@storybook/addon-knobs";
import Vue, { PropType } from "vue";
import { InputVariant, InputVariants, InputStates, InputState } from "./types";

storiesOf("Forms/PasswordStrengthField", module).add("with options", () => ({
  components: { PasswordStrengthField },
  template: `
    <div style="max-width: 360px">
      <p>Please enter a good passphrase.</p>
      <PasswordStrengthField :variant="variant" :state="state" :placeholder="placeholder" v-model="password" :error = "error"/>
      <p>Value: {{password}}</p>
    </div>`,
  data: () => {
    return {
      password: "",
    };
  },
  props: {
    variant: {
      type: String,
      default: select("Variant", InputVariants, "main"),
    },
    placeholder: {
      type: String,
      default: text("Placeholder", ""),
    },
    error: {
      type: String,
      default: text("Error", "invalid password"),
    },
    state: {
      type: String as PropType<InputState>,
      default: select("State", InputStates, InputStates[0]),
    },
  },
}));
