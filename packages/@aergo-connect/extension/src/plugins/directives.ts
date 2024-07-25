import Vue from 'vue';

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    // @ts-ignore
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        // @ts-ignore
        vnode.context[binding.expression](event);
      }
    };
    // @ts-ignore
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unbind: function (el) {
    // @ts-ignore
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
});
