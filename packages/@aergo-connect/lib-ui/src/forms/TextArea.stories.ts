import { storiesOf } from "@storybook/vue";
import { boolean, select } from "@storybook/addon-knobs";
import TextArea from "./TextArea.vue";
import { InputStates } from "./types";

storiesOf("Forms/Textarea", module).add("basic", () => ({
  components: { TextArea },
  template: `
    <div style="max-width: 360px">
      <TextArea :state="state" />
    </div>`,
  props: {
    disabled: {
      type: Boolean,
      default: boolean("Disabled", false),
    },
    state: {
      type: String,
      default: select("State", InputStates, InputStates[0]),
    },
  },
}));
