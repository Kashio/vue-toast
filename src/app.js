import Vue from 'vue';
import './css/index.scss';

import { VueToast } from './index.js';

Vue.use(VueToast);

const vm = new Vue({
  el: '#app',
  render: h => h('button', {
    style: {
      position: 'relative',
      top: '20px',
      left: '20px'
    },
    on: {
      click() {
        vm.$toast({
          message: 'Test Toast'
        });
      }
    }
  }, 'Launch Toast')
});

export default vm;
