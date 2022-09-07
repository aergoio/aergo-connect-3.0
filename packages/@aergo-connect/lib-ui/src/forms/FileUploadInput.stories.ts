import { storiesOf } from "@storybook/vue";
import FileUploadInput from "./FileUploadInput.vue";

storiesOf("Forms/FileInput", module).add("basic", () => ({
  components: { FileUploadInput },
  template: `
      <FileUploadInput/>
    `,
  props: {},
}));
