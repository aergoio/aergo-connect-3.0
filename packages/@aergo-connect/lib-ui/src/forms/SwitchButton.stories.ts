import { storiesOf } from "@storybook/vue";
import SwitchButton from "./SwitchButton.vue";
import { boolean, select } from "@storybook/addon-knobs";
import { InputVariants } from "./types";

storiesOf("Forms/Switch button", module).add("basic", () => ({
  components: { SwitchButton },
  template: `
      <div>
        <p>Selected value is <strong>{{someOption}}</strong>.</p>
        <SwitchButton v-model="someOption" :variant="variant" :disabled="disabled" :label="someOption ? 'Turn it off' : 'Turn it on'" />
      </div>
    `,
  data: () => ({
    someOption: true,
  }),
  props: {
    disabled: {
      type: Boolean,
      default: boolean("Disabled", false),
    },
    variant: {
      type: String,
      default: select("Variant", InputVariants, InputVariants[0]),
    },
  },
}));
