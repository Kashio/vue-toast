import $ from "jquery";
import style from './css/toast.scss';

const TOAST_CLASS = style.toast;
const TOAST_DEFAULT_BORDER_RADIUS = 0;
const TOAST_DEFAULT_COLOR = 'white';
const TOAST_DEFAULT_BACKGROUND_COLOR = 'rgba(60,118,61,.9)';
const TOAST_DEFAULT_POSITION = 'bottom right';
const TOAST_DEFAULT_FADE_SPEED = 400;
const TOAST_DEFAULT_TIME = 3000;
const POSITION_FN = {
  'bottom left': positionToastBottomLeft,
  'bottom right': positionToastBottomRight,
  'top left': positionToastTopLeft,
  'top right': positionToastTopRight
};

const create = (toasts, options) => {
  const $body = $('body');
  const $toast = $(document.createElement('div'));
  $toast.html(options.message);
  $toast.css({
    borderRadius: TOAST_DEFAULT_BORDER_RADIUS,
    color: options.color || TOAST_DEFAULT_COLOR,
    backgroundColor: options.backgroundColor || TOAST_DEFAULT_BACKGROUND_COLOR
  });
  $toast.addClass(TOAST_CLASS);
  POSITION_FN[options.position || TOAST_DEFAULT_POSITION]($toast);
  const toastIndex = toasts.length;
  $toast
    .hide()
    .appendTo($body)
    .fadeIn(options.fade || TOAST_DEFAULT_FADE_SPEED);
  setTimeout(() => {
    $toast
      .fadeOut(options.fade || TOAST_DEFAULT_FADE_SPEED, () => {
        $toast.detach();
        toasts.splice(toastIndex, 1);
      });
  }, options.time || TOAST_DEFAULT_TIME);
  toasts.push($toast);
};

const kill = (toasts, index, options) => {
  const $toast = toasts[index];
  $toast
    .stop()
    .fadeOut(options.fade || TOAST_DEFAULT_FADE_SPEED, () => {
      $toast.detach();
      toasts.splice(index, 1);
    });
};

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

export { create, kill };
