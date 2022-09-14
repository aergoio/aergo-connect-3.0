import { storiesOf } from '@storybook/vue';
import WarningInBox from './WarningInBox.vue';

storiesOf('items/WarningInBox', module).add('basic', () => ({
  components: { WarningInBox },
  template: `
      <WarningInBox/>
    `,
  props: {},
}));
