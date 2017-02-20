import $ from 'jquery';

import { create, kill, shift, __RewireAPI__ as ToastRewireAPI } from './toast';

describe('kill()', () => {
  const TEST_TOAST_CLASS = 'test_toast';
  beforeEach(() => {
    $.fx.off = true;
  });
  it('should remove click event listener from the close button, detach the toast from the dom, and adjust other toasts indices', () => {
    const $body = $('body');
    const toasts = [];
    const $toast1 = $(document.createElement('div'));
    $toast1.addClass(TEST_TOAST_CLASS);
    const $closeButton = $(document.createElement('div'));
    $closeButton.click(() => {});
    $toast1.$closeButton = $closeButton;
    $toast1.toastIndex = 0;
    const $toast2 = $(document.createElement('div'));
    $toast2.toastIndex = 1;
    toasts.push($toast1);
    toasts.push($toast2);
    const index = 0;
    const options = {};

    kill(toasts, index, options);

    expect($._data($closeButton.get()[0]).events).toBeUndefined();
    expect($body.children('.' + TEST_TOAST_CLASS).length === 0).toBeTruthy();
    expect(toasts.length === 1).toBeTruthy();
    expect($toast2.toastIndex === 0).toBeTruthy();
  });
  it('should detach the toast from the dom, and adjust other toasts indices', () => {
    const $body = $('body');
    const toasts = [];
    const $toast1 = $(document.createElement('div'));
    $toast1.addClass(TEST_TOAST_CLASS);
    $toast1.toastIndex = 0;
    const $toast2 = $(document.createElement('div'));
    $toast2.toastIndex = 1;
    toasts.push($toast1);
    toasts.push($toast2);
    const index = 0;
    const options = {};

    kill(toasts, index, options);

    expect($body.children('.' + TEST_TOAST_CLASS).length === 0).toBeTruthy();
    expect(toasts.length === 1).toBeTruthy();
    expect($toast2.toastIndex === 0).toBeTruthy();
  });
});
