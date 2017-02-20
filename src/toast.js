import $ from "jquery";
import style from './css/toast.scss';

const TOAST_CLASS = style.toast;
const TOAST_CLOSE_BUTTON_CLASS = style['toast-close-button'];
const TOAST_DEFAULT_BORDER_RADIUS = 0;
const TOAST_DEFAULT_COLOR = 'white';
const TOAST_DEFAULT_BACKGROUND_COLOR = 'rgba(60,118,61,.9)';
const TOAST_DEFAULT_POSITION = 'bottom right';
const TOAST_DEFAULT_FADE_SPEED = 400;
const TOAST_DEFAULT_TIME = 3000;
const TOAST_MARGIN = 5;
const POSITION_FN = {
  'bottom left': positionToastBottomLeft,
  'bottom right': positionToastBottomRight,
  'top left': positionToastTopLeft,
  'top right': positionToastTopRight
};
const SHIFT_FN = {
  'bottom left': shiftUp,
  'bottom right': shiftUp,
  'top left': shiftDown,
  'top right': shiftDown
};

const kill = (toasts, index, options) => {
  const $toast = toasts[index];
  if ($toast.$closeButton) {
    $toast.$closeButton.off('click');
  }
  $toast
    .stop()
    .fadeOut(options.fade || TOAST_DEFAULT_FADE_SPEED, () => {
      $toast.detach();
    });
  toasts.splice(index, 1);
};

const create = (toasts, options) => {
  const $body = $('body');
  const $toast = $(document.createElement('div'));
  $toast.html(options.message);
  $toast.css({
    borderRadius: options.borderRadius || TOAST_DEFAULT_BORDER_RADIUS,
    color: options.color || TOAST_DEFAULT_COLOR,
    backgroundColor: options.backgroundColor || TOAST_DEFAULT_BACKGROUND_COLOR
  });
  if (options.fixedWidth) {
    $toast.css({
      width: options.fixedWidth,
      textOverflow: 'ellipsis'
    });
  }
  $toast.addClass(TOAST_CLASS);
  POSITION_FN[options.position || TOAST_DEFAULT_POSITION]($toast);
  $toast
    .hide()
    .appendTo($body)
    .fadeIn(options.fade || TOAST_DEFAULT_FADE_SPEED);
  $toast.toastIndex = toasts.length;
  if (options.closeButton) {
    const $closeButton = createCloseButton(options);
    $toast.$closeButton = $closeButton;
    const toastHeight = $toast.outerHeight();
    $closeButton.click(() => {
      kill(toasts, $toast.toastIndex, options);
      reverseShift(toasts, $toast.toastIndex, toastHeight, options);
    });
    $toast.append($closeButton);
  } else {
    setTimeout(() => {
      $toast
        .fadeOut(options.fade || TOAST_DEFAULT_FADE_SPEED, () => {
          $toast.detach();
          toasts.shift();
        });
    }, options.time || TOAST_DEFAULT_TIME);
  }
  toasts.push($toast);
};

const shift = (toasts, options) => {
  const latestToastHeight = toasts[toasts.length - 1].outerHeight();
  const shiftFn = SHIFT_FN[options.position || TOAST_DEFAULT_POSITION];
  for (let i = 0; i < toasts.length - 1; i++) {
    const $toast = toasts[i];
    shiftFn($toast, latestToastHeight + TOAST_MARGIN);
  }
};

function createCloseButton(options) {
  const $closeButton = $(document.createElement('span'));
  $closeButton.css({
    color: options.color || TOAST_DEFAULT_COLOR
  });
  $closeButton.addClass(TOAST_CLOSE_BUTTON_CLASS);
  return $closeButton;
}

function reverseShift(toasts, closedToastIndex, closedToastHeight, options) {
  const shiftFn = SHIFT_FN[options.position || TOAST_DEFAULT_POSITION];
  for (let i = closedToastIndex; i < toasts.length; i++) {
    const $toast = toasts[i];
    $toast.toastIndex--;
  }
  for (let i = closedToastIndex - 1; i >= 0; i--) {
    const $toast = toasts[i];
    shiftFn($toast, -(closedToastHeight + TOAST_MARGIN));
  }
}

function positionToastBottomLeft($toast) {
  $toast.css({
    bottom: 5,
    left: 5
  });
}

function positionToastBottomRight($toast) {
  $toast.css({
    bottom: 5,
    right: 5
  });
}

function positionToastTopLeft($toast) {
  $toast.css({
    top: 5,
    left: 5
  });
}

function positionToastTopRight($toast) {
  $toast.css({
    top: 5,
    right: 5
  });
}

function shiftUp($toast, shiftBy) {
  $toast.animate({
    bottom: `+=${shiftBy}px`
  });
}

function shiftDown($toast, shiftBy) {
  $toast.animate({
    top: `+=${shiftBy}px`
  });
}

export { create, kill, shift };