import { storiesOf } from '@storybook/vue';
import WarningInBox from './WarningInBox.vue';
import { text } from '@storybook/addon-knobs';

storiesOf('items/WarningInBox', module).add('basic', () => ({
  components: { WarningInBox },
  template: `
      <WarningInBox :error='error'/>
    `,
  props: {
    error: {
      type: String,
      default: text('Error', ''),
    },
  },
}));
