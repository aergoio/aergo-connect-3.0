

import Vue from 'vue'
import { formatToken } from './format';

export default Vue.extend({
  functional: true,
  props: {
    value: {
      type: String,
      required: true,
    },
    unit: String,
    prefix: String,
    decimalsIfAergo: {
      type: Number,
      default: -1,
    },
    forcedUnit: String,
    justDisplay: Boolean,
  },
  render(h, ctx) {
    const innerHTML = formatToken(ctx.props.value, ctx.props.unit, ctx.props.prefix, ctx.props.decimalsIfAergo, ctx.props.forcedUnit, ctx.props.justDisplay);
    return h('span', { ...ctx.data, domProps: { innerHTML } })
  }
})
