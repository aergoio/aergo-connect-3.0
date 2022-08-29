import { storiesOf } from "@storybook/vue";
import HeaderLogo from "./HeaderLogo.vue";

storiesOf("Icons/HeaderLogo", module).add("Header logo", () => ({
  components: { HeaderLogo },
  template: `
    <HeaderLogo />
    `,
}));
