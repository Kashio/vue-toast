import { create, kill } from './toast';

const install = function (Vue, options = {maxToasts: 6}) {
  if (this.installed) {
    return;
  }
  this.installed = true;
  Vue.toasts = [];
  Vue.maxToasts = options.maxToasts;
  Vue.prototype.$toast = function (options) {
    if (Vue.toasts.length >= Vue.maxToasts) {
      kill(Vue.toasts, Vue.toasts.length - 1, options);
    }
    create(Vue.toasts, options);
  };
};

const VueToast = {
  install
};

export { VueToast };
