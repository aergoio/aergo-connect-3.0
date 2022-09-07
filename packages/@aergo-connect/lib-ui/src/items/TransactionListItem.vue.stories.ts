import { storiesOf } from "@storybook/vue";
import TransactionListItem from "./TransactionListItem.vue";

storiesOf("items/TransactionListItem", module).add("basic", () => ({
  components: { TransactionListItem },
  template: `
      <TransactionListItem/>
    `,
  props: {},
}));
