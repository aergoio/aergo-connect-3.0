import { storiesOf } from "@storybook/vue";
import ScrollView from "./ScrollView.vue";
import NewHeader from "./NewHeader.vue";
import { boolean, text } from "@storybook/addon-knobs";

import HeaderLogo from "../icons/HeaderLogo.vue";
import Icon from "../icons/Icon.vue";
//import InvertedColors from '../theme/InvertedColors.vue';

storiesOf("Layouts/NewHeader", module).add("basic", () => ({
  components: { ScrollView, NewHeader, HeaderLogo, Icon },
  template: `
      <div style="width: 360px; height: 400px; border-radius: 8px; box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.08);">
        <ScrollView>
          <template #header>
            <NewHeader :title="title" :button="button" :buttonHide="buttonHide" :skip="skip" :refresh="refresh">
            </NewHeader>
          </template>
          <div style="padding: 16px">
            Scroll view content
            <div style="height: 545px"></div>
            Hello
          </div>
        </ScrollView>
      </div>
`,
  props: {
    button: {
      type: String,
      default: text("Button", "back"),
    },
    buttonHide: {
      type: Boolean,
      default: boolean("Button hide", false),
    },
    title: {
      type: String,
      default: text("Title", ""),
    },
    skip: {
      type: Boolean,
      default: boolean("Skip", false),
    },
    refresh: {
      type: Boolean,
      default: boolean("Refresh", false),
    },
  },
}));
