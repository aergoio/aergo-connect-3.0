import { storiesOf } from '@storybook/vue';
import AccountItem from './AccountItem.vue';

storiesOf('items/AccountItem', module).add('basic', () => ({
  components: { AccountItem },
  template: `
      <AccountItem/>
    `,
  props: {},
}));
