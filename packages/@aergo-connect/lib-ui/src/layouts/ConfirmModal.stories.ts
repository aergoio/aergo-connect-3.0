import { storiesOf } from "@storybook/vue";
import ConfirmModal from "./ConfirmModal.vue";
import { Button } from "../buttons";
import { ButtonGroup } from "../buttons";
import { text } from "@storybook/addon-knobs";

storiesOf("Layouts/ConfirmModal", module).add("basic", () => ({
  components: { ConfirmModal, Button, ButtonGroup },

  template: `
  <ConfirmModal :name="name" :title="title">
   <Button type="primary" size="medium">Add</Button>
  <ConfirmModal/> 
`,

  props: {
    title: {
      type: String,
      default: text("Title", ""),
    },
  },
}));

// <ButtonGroup vertical="true">
// <Button type="primary" size="medium">Add</Button>
// <Button type="primary-outline" size="medium">Cancel</Button>
// <ButtonGroup/>
