import { storiesOf } from "@storybook/vue";
import { boolean } from "@storybook/addon-knobs";
import FileUploadInput from "./FileUploadInput.vue";

storiesOf("Forms/FileInput", module).add("basic", () => ({
  components: { FileUploadInput },
  template: `
      <FileUploadInput :state="state" />
    `,
  props: {},
}));
