import { create, kill, shift } from './toast';

const install = function (Vue, options = {maxToasts: 6}) {
  if (this.installed) {
    return;
  }
  this.installed = true;
  Vue.toasts = [];
  Vue.maxToasts = options.maxToasts;
  Vue.prototype.$toast = function (options) {
    if (Vue.toasts.length >= Vue.maxToasts) {
      kill(Vue.toasts, Vue.toasts[0], options);
    }
    create(Vue.toasts, options);
    if (Vue.toasts.length > 1) {
      shift(Vue.toasts, options);
    }
  };
};

const VueToast = {
  install
};

export { VueToast };
