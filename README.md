# Vue.js toast plugin
[![NPM](https://nodei.co/npm/@kashio/vue-toast.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/@kashio/vue-toast/)

[![Build status](https://api.travis-ci.org/Kashio/vue-toast.svg?branch=master)](https://travis-ci.org/Kashio/vue-toast)
[![Coverage Status](https://coveralls.io/repos/github/Kashio/vue-toast/badge.svg?branch=master)](https://coveralls.io/github/Kashio/vue-toast?branch=master)
[![Dependency Status](https://david-dm.org/kashio/vue-toast.svg)](https://david-dm.org/Kashio/vue-toast)
[![devDependency Status](https://david-dm.org/Kashio/vue-toast/dev-status.svg)](https://david-dm.org/Kashio/vue-toast?type=dev)

## Basic usage
```js
import Vue from 'vue';

import { VueToast } from '@kashio/vue-toast';
import '@kashio/vue-toast/dist/index.css';

Vue.use(VueToast);

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
          message: 'Hello World',
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
```

## Table of contents
- [Options](#options)

---

## Options
#### Values
* `fade` - Fade speed (`Number` | `String`). Defaults to `slow` (see [jQuery fade values](http://api.jquery.com/fadein/)).
* `position` - Toast position (`String`). Either `bottom left`, `bottom right`, `top left`, or `top right`. Defaults to `bottom right`.
* `borderRadius` - Toast border radius (`Number` | `String`). Defaults to `0`.
* `message` - Toast message (`string`).
* `color` - Toast message color (`string`). Defaults to `rgb(255, 255, 255)`.
* `backgroundColor` - Toast background color (`string`). Defaults to `rgba(60, 118, 61, 0.9)`.
* `closeButton` - Show close button (`Boolean`). Takes priority over `time`.
* `time` - Time in milliseconds before toast disappears (`Number`). Defaults to `3000`.
* `fixedWidth` - Width of the toast (`Number` | `String`).

## Tests
Run tests with <br/>
`$ npm test`

## License
vue-toast is licensed under the [GPL V3 License](https://raw.githubusercontent.com/Kashio/vue-toast/master/LICENSE).
