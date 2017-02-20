import Vue from 'vue';
import './css/index.scss';

import { VueToast } from './index.js';

Vue.use(VueToast);

function randomMessage() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const numberOfCharacters = Math.floor(Math.random() * 100);
  for (let i = 0; i < numberOfCharacters; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

Vue.maxToasts = 10;

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
          message: randomMessage(),
          borderRadius: 7,
          color: 'black',
          backgroundColor: '#e2eef9',
          fixedWidth: 300,
          closeButton: true,
          time: 5000
        });
      }
    }
  }, 'Launch Toast')
});

export default vm;
