import Vue, { VueConstructor } from 'vue';
import { ApiMethods } from '../background/api';

export default class Background {
  static install(Vue: VueConstructor, { background }: any) {
    console.log(background, 'background1');
    Vue.prototype.$background = background;
    Vue.prototype.$setBackground = (background: any) => {
      console.log(background, 'background2?');
      Vue.prototype.$background = background;
    };
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $background: ApiMethods & NodeJS.EventEmitter;
    $setBackground(background: any): void;
  }
}
