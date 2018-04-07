import $ from 'jquery';

import { create, kill, shift, __RewireAPI__ as ToastRewireAPI } from './toast';

const customMatchers = {
  toBeColorEqual: () => {
    return {
      compare: (actual, expected) => {
        const redRegex = /rgba?\(\s*(\d+)/;
        const greenRegex = /rgba?\(\s*\d+\s*,\s*(\d+)/;
        const blueRegex = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*(\d+)/;
        const actualRed = redRegex.exec(actual)[1];
        const actualGreen = greenRegex.exec(actual)[1];
        const actualBlue = blueRegex.exec(actual)[1];
        const expectedRed = redRegex.exec(expected)[1];
        const expectedGreen = greenRegex.exec(expected)[1];
        const expectedBlue = blueRegex.exec(expected)[1];
        const result = {};
        result.message = "Expected " + actual + " to be color equal to " + expected + " with exception for the alpha channel";
        result.pass = actualRed === expectedRed && actualGreen === expectedGreen && actualBlue === expectedBlue;
        return result;
      }
    };
  }
};

describe('kill()', () => {
  const TEST_TOAST_CLASS = 'test_toast';
  beforeEach(() => {
    $.fx.off = true;
  });
  it('should remove click event listener from the close button, and detach the toast from the dom', () => {
    const $body = $('body');
    const toasts = [];
    const $toast1 = $(document.createElement('div'));
    $toast1.addClass(TEST_TOAST_CLASS);
    const $closeButton = $(document.createElement('div'));
    $closeButton.click(() => {});
    $toast1.$closeButton = $closeButton;
    const $toast2 = $(document.createElement('div'));
    toasts.push($toast1);
    toasts.push($toast2);
    const options = {};

    kill(toasts, $toast1, options);

    expect($._data($toast1.get()[0]).events).toBeUndefined();
    expect($._data($closeButton.get()[0]).events).toBeUndefined();
    expect($body.children('.' + TEST_TOAST_CLASS).length).toEqual(0);
    expect(toasts.length).toEqual(1);
  });
  it('should detach the toast from the dom', () => {
    const $body = $('body');
    const toasts = [];
    const $toast1 = $(document.createElement('div'));
    $toast1.addClass(TEST_TOAST_CLASS);
    const $toast2 = $(document.createElement('div'));
    toasts.push($toast1);
    toasts.push($toast2);
    const options = {};

    kill(toasts, $toast1, options);

    expect($._data($toast1.get()[0]).events).toBeUndefined();
    expect($body.children('.' + TEST_TOAST_CLASS).length).toEqual(0);
    expect(toasts.length).toEqual(1);
  });
});

describe('create()', () => {
  const TEST_TOAST_CLASS = 'test_toast';
  const TOAST_INDEX = 0;
  const TOAST_HEIGHT = 5;
  let $toast;
  const createToastSpy = jasmine.createSpy('createToastSpy').and.callFake(() => {
    $toast.outerHeight = () => {
      return TOAST_HEIGHT;
    };
    return $toast;
  });
  beforeEach(() => {
    $toast = $(document.createElement('div'));
    $toast.addClass(TEST_TOAST_CLASS);
    $.fx.off = true;
    ToastRewireAPI.__Rewire__('createToast', createToastSpy);
  });
  afterEach(() => {
    ToastRewireAPI.__ResetDependency__('createToast');
  });
  it('should create toast with close button', () => {
    const toasts = [];
    const options = {
      closeButton: true
    };
    const TEST_TOAST_CLOSE_BUTTON_CLASS = 'test_toast_close_button';
    const $closeButton = $(document.createElement('span'));
    $closeButton.addClass(TEST_TOAST_CLOSE_BUTTON_CLASS);
    const createCloseButtonSpy = jasmine.createSpy('createCloseButtonSpy').and.callFake(() => {
      return $closeButton;
    });
    ToastRewireAPI.__Rewire__('createCloseButton', createCloseButtonSpy);
    const killSpy = jasmine.createSpy('killSpy');
    ToastRewireAPI.__Rewire__('kill', killSpy);
    const reverseShiftSpy = jasmine.createSpy('reverseShiftSpy');
    ToastRewireAPI.__Rewire__('reverseShift', reverseShiftSpy);

    create(toasts, options);

    expect($._data($toast.get()[0]).events.click.length).toEqual(1);
    expect($toast.$closeButton).toEqual($closeButton);
    expect($._data($closeButton.get()[0]).events.click.length).toEqual(1);
    expect($toast.children('.' + TEST_TOAST_CLOSE_BUTTON_CLASS).length).toEqual(1);
    expect(toasts.length).toEqual(1);

    $closeButton.trigger('click');

    expect(killSpy).toHaveBeenCalled();
    expect(killSpy).toHaveBeenCalledWith(toasts, $toast, options);
    expect(reverseShiftSpy).toHaveBeenCalled();
    expect(reverseShiftSpy).toHaveBeenCalledWith(toasts, TOAST_INDEX, TOAST_HEIGHT, options);

    ToastRewireAPI.__ResetDependency__('createCloseButton');
    ToastRewireAPI.__ResetDependency__('kill');
    ToastRewireAPI.__ResetDependency__('reverseShift');
  });
  it('should create toast with progress bar with custom time', () => {
    jasmine.clock().install();
    const $body = $('body');
    const toasts = [];
    const options = {
      time: 5000
    };
    const TEST_TOAST_PROGRESS_BAR_CLASS = 'test_toast_progress_bar';
    const $progressBar = $(document.createElement('div'));
    $progressBar.addClass(TEST_TOAST_PROGRESS_BAR_CLASS);
    const createProgressBarSpy = jasmine.createSpy('createProgressBarSpy').and.callFake(() => {
      return $progressBar;
    });
    ToastRewireAPI.__Rewire__('createProgressBar', createProgressBarSpy);

    create(toasts, options);

    expect($._data($toast.get()[0]).events.click.length).toEqual(1);
    expect($toast.$progressBar).toEqual($progressBar);
    expect($toast.children('.' + TEST_TOAST_PROGRESS_BAR_CLASS).length).toEqual(1);
    expect(toasts.length).toEqual(1);

    jasmine.clock().tick(options.time + 1);

    expect($body.children('.' + TEST_TOAST_CLASS).length).toEqual(0);
    expect(toasts.length).toEqual(0);

    ToastRewireAPI.__ResetDependency__('createProgressBar');
    jasmine.clock().uninstall();
  });
  it('should create toast with progress bar with default time', () => {
    jasmine.clock().install();
    const $body = $('body');
    const toasts = [];
    const options = {};
    const TEST_TOAST_PROGRESS_BAR_CLASS = 'test_toast_progress_bar';
    const $progressBar = $(document.createElement('div'));
    $progressBar.addClass(TEST_TOAST_PROGRESS_BAR_CLASS);
    const createProgressBarSpy = jasmine.createSpy('createProgressBarSpy').and.callFake(() => {
      return $progressBar;
    });
    ToastRewireAPI.__Rewire__('createProgressBar', createProgressBarSpy);

    create(toasts, options);

    expect($._data($toast.get()[0]).events.click.length).toEqual(1);
    expect($toast.$progressBar).toEqual($progressBar);
    expect($toast.children('.' + TEST_TOAST_PROGRESS_BAR_CLASS).length).toEqual(1);
    expect(toasts.length).toEqual(1);

    jasmine.clock().tick(ToastRewireAPI.__get__('TOAST_DEFAULT_TIME') + 1);

    expect($body.children('.' + TEST_TOAST_CLASS).length).toEqual(0);
    expect(toasts.length).toEqual(0);

    ToastRewireAPI.__ResetDependency__('createProgressBar');
    jasmine.clock().uninstall();
  });
});

describe('shift()', () => {
  const TOAST_HEIGHT = 5;
  let $toast;
  const shiftUpSpy = jasmine.createSpy('shiftUpSpy');
  beforeEach(() => {
    $toast = $(document.createElement('div'));
    $toast.outerHeight = () => {
      return TOAST_HEIGHT;
    };
    ToastRewireAPI.__Rewire__('SHIFT_FN', {'bottom right': shiftUpSpy});
  });
  afterEach(() => {
    ToastRewireAPI.__ResetDependency__('SHIFT_FN');
  });
  it('should shift the toasts with custom position', () => {
    const toasts = [];
    const options = {
      position: 'bottom right'
    };
    toasts.push($toast);
    toasts.push($toast);

    shift(toasts, options);

    expect(shiftUpSpy).toHaveBeenCalled();
    expect(shiftUpSpy).toHaveBeenCalledWith($toast, TOAST_HEIGHT + ToastRewireAPI.__get__('TOAST_MARGIN'));
  });
  it('should shift the toasts with default position', () => {
    const toasts = [];
    const options = {};
    toasts.push($toast);
    toasts.push($toast);

    shift(toasts, options);

    expect(shiftUpSpy).toHaveBeenCalled();
    expect(shiftUpSpy).toHaveBeenCalledWith($toast, TOAST_HEIGHT + ToastRewireAPI.__get__('TOAST_MARGIN'));
  });
});

describe('createToast()', () => {
  const createToast = ToastRewireAPI.__get__('createToast');
  const positionToastBottomRightSpy = jasmine.createSpy('positionToastBottomRightSpy');
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    $.fx.off = true;
    ToastRewireAPI.__Rewire__('POSITION_FN', {'bottom right': positionToastBottomRightSpy});
  });
  afterEach(() => {
    ToastRewireAPI.__ResetDependency__('POSITION_FN');
  });
  it('should create toast with custom values and fixed width', () => {
    const $body = $('body');
    const toasts = [];
    const options = {
      message: 'test',
      borderRadius: 5,
      color: 'rgb(255, 0, 0)',
      backgroundColor: 'rgb(255, 0, 0)',
      fixedWidth: 300,
      position: 'bottom right'
    };
    const TOAST_CLASS = ToastRewireAPI.__get__('TOAST_CLASS');

    const $toast = createToast(toasts, options);

    expect($toast.html()).toEqual(options.message);
    expect($toast.css('border-radius')).toEqual(options.borderRadius + 'px');
    expect($toast.css('color')).toBeColorEqual(options.color);
    expect($toast.css('background-color')).toBeColorEqual(options.backgroundColor);
    expect($toast.attr('title')).toEqual(options.message);
    expect($toast.css('width')).toEqual(options.fixedWidth + 'px');
    expect($toast.hasClass(TOAST_CLASS)).toBeTruthy();
    expect(positionToastBottomRightSpy).toHaveBeenCalled();
    expect(positionToastBottomRightSpy).toHaveBeenCalledWith($toast);
    expect($body.children('.' + TOAST_CLASS).length).toEqual(1);

    $toast.detach();
  });
  it('should create toast with default values and no fixed width', () => {
    const $body = $('body');
    const toasts = [];
    const options = {
      message: 'test'
    };
    const TOAST_CLASS = ToastRewireAPI.__get__('TOAST_CLASS');

    const $toast = createToast(toasts, options);

    expect($toast.html()).toEqual(options.message);
    expect($toast.css('border-radius')).toEqual(ToastRewireAPI.__get__('TOAST_DEFAULT_BORDER_RADIUS') + 'px');
    expect($toast.css('color')).toBeColorEqual(ToastRewireAPI.__get__('TOAST_DEFAULT_COLOR'));
    expect($toast.css('background-color')).toBeColorEqual(ToastRewireAPI.__get__('TOAST_DEFAULT_BACKGROUND_COLOR'));
    expect($toast.hasClass(TOAST_CLASS)).toBeTruthy();
    expect(positionToastBottomRightSpy).toHaveBeenCalled();
    expect(positionToastBottomRightSpy).toHaveBeenCalledWith($toast);
    expect($body.children('.' + TOAST_CLASS).length).toEqual(1);

    $toast.detach();
  });
});

describe('createCloseButton()', () => {
  const createCloseButton = ToastRewireAPI.__get__('createCloseButton');
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });
  it('should create close button with custom color', () => {
    const options = {
      color: 'rgb(255, 38, 78)'
    };
    const TOAST_CLOSE_BUTTON_CLASS = ToastRewireAPI.__get__('TOAST_CLOSE_BUTTON_CLASS');

    const $closeButton = createCloseButton(options);

    expect($closeButton.css('color')).toBeColorEqual(options.color);
    expect($closeButton.hasClass(TOAST_CLOSE_BUTTON_CLASS)).toBeTruthy();
  });
  it('should create close button with default color', () => {
    const options = {};
    const TOAST_CLOSE_BUTTON_CLASS = ToastRewireAPI.__get__('TOAST_CLOSE_BUTTON_CLASS');

    const $closeButton = createCloseButton(options);

    expect($closeButton.css('color')).toBeColorEqual(ToastRewireAPI.__get__('TOAST_DEFAULT_COLOR'));
    expect($closeButton.hasClass(TOAST_CLOSE_BUTTON_CLASS)).toBeTruthy();
  });
});

describe('createProgressBar()', () => {
  const createProgressBar = ToastRewireAPI.__get__('createProgressBar');
  const shadeColorSpy = jasmine.createSpy('shadeColorSpy').and.callFake(color => {
    return color;
  });
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    ToastRewireAPI.__Rewire__('shadeColor', shadeColorSpy);
  });
  afterEach(() => {
    ToastRewireAPI.__ResetDependency__('shadeColor');
  });
  it('should create progress bar with custom values', () => {
    const options = {
      backgroundColor: 'rgb(255, 38, 78)',
      borderRadius: 10
    };
    const TOAST_PROGRESS_BAR_CLASS = ToastRewireAPI.__get__('TOAST_PROGRESS_BAR_CLASS');

    const $progressBar = createProgressBar(options);

    expect($progressBar.css('background-color')).toBeColorEqual(options.backgroundColor);
    expect($progressBar.css('border-bottom-left-radius')).toEqual(options.borderRadius + 'px');
    expect($progressBar.hasClass(TOAST_PROGRESS_BAR_CLASS)).toBeTruthy();
  });
  it('should create progress bar with default values', () => {
    const options = {};
    const TOAST_PROGRESS_BAR_CLASS = ToastRewireAPI.__get__('TOAST_PROGRESS_BAR_CLASS');

    const $progressBar = createProgressBar(options);

    expect($progressBar.css('background-color')).toBeColorEqual(ToastRewireAPI.__get__('TOAST_DEFAULT_BACKGROUND_COLOR'));
    expect($progressBar.css('border-bottom-left-radius')).toEqual(ToastRewireAPI.__get__('TOAST_DEFAULT_BORDER_RADIUS') + 'px');
    expect($progressBar.hasClass(TOAST_PROGRESS_BAR_CLASS)).toBeTruthy();
  });
});

describe('shadeColor()', () => {
  const shadeColor = ToastRewireAPI.__get__('shadeColor');
  it('should shade color with rgb values greater than amount', () => {
    const color = '#ffffff';
    const amount = 50;

    const shadedColor = shadeColor(color, amount);

    expect(shadedColor).toEqual('#cdcdcd');
  });
  it('should shade color with rgb values lower than amount', () => {
    const color = '#282828';
    const amount = 50;

    const shadedColor = shadeColor(color, amount);

    expect(shadedColor).toEqual('#000000');
  });
});

describe('reverseShift()', () => {
  const reverseShift = ToastRewireAPI.__get__('reverseShift');
  const shiftUpSpy = jasmine.createSpy('shiftUpSpy');
  beforeEach(() => {
    ToastRewireAPI.__Rewire__('SHIFT_FN', {'bottom right': shiftUpSpy});
  });
  afterEach(() => {
    ToastRewireAPI.__ResetDependency__('SHIFT_FN');
  });
  it('should reverse shift toasts with custom position', () => {
    const toasts = [];
    const toast = 'toast';
    const closedToastHeight = 5;
    const options = {
      position: 'bottom right'
    };
    toasts.push(toast);
    toasts.push(toast);

    reverseShift(toasts, toasts.length, closedToastHeight, options);

    expect(shiftUpSpy).toHaveBeenCalled();
    expect(shiftUpSpy).toHaveBeenCalledWith(toast, -(closedToastHeight + ToastRewireAPI.__get__('TOAST_MARGIN')));
  });
  it('should reverse shift toasts with default position', () => {
    const toasts = [];
    const toast = 'toast';
    const closedToastHeight = 5;
    const options = {};
    toasts.push(toast);
    toasts.push(toast);

    reverseShift(toasts, toasts.length, closedToastHeight, options);

    expect(shiftUpSpy).toHaveBeenCalled();
    expect(shiftUpSpy).toHaveBeenCalledWith(toast, -(closedToastHeight + ToastRewireAPI.__get__('TOAST_MARGIN')));
  });
});

describe('positionToastBottomLeft()', () => {
  const positionToastBottomLeft = ToastRewireAPI.__get__('positionToastBottomLeft');
  let $toast;
  beforeEach(() => {
    $toast = $(document.createElement(('div')));
  });
  it('should position toast to bottom left', () => {
    positionToastBottomLeft($toast);

    expect($toast.css('bottom')).toEqual(5 + 'px');
    expect($toast.css('left')).toEqual(5 + 'px');
  });
});

describe('positionToastBottomRight()', () => {
  const positionToastBottomRight = ToastRewireAPI.__get__('positionToastBottomRight');
  let $toast;
  beforeEach(() => {
    $toast = $(document.createElement(('div')));
  });
  it('should position toast to bottom right', () => {
    positionToastBottomRight($toast);

    expect($toast.css('bottom')).toEqual(5 + 'px');
    expect($toast.css('right')).toEqual(5 + 'px');
  });
});

describe('positionToastTopLeft()', () => {
  const positionToastTopLeft = ToastRewireAPI.__get__('positionToastTopLeft');
  let $toast;
  beforeEach(() => {
    $toast = $(document.createElement(('div')));
  });
  it('should position toast to top left', () => {
    positionToastTopLeft($toast);

    expect($toast.css('top')).toEqual(5 + 'px');
    expect($toast.css('left')).toEqual(5 + 'px');
  });
});

describe('positionToastTopRight()', () => {
  const positionToastTopRight = ToastRewireAPI.__get__('positionToastTopRight');
  let $toast;
  beforeEach(() => {
    $toast = $(document.createElement(('div')));
  });
  it('should position toast to top right', () => {
    positionToastTopRight($toast);

    expect($toast.css('top')).toEqual(5 + 'px');
    expect($toast.css('right')).toEqual(5 + 'px');
  });
});

describe('shiftUp()', () => {
  const shiftUp = ToastRewireAPI.__get__('shiftUp');
  const INITIAL_BOTTOM = 10;
  let $toast;
  beforeEach(() => {
    $.fx.off = true;
    $toast = $(document.createElement(('div')));
    $toast.css('bottom', INITIAL_BOTTOM);
  });
  it('should shift toast up', () => {
    const shiftBy = 5;

    shiftUp($toast, shiftBy);

    expect($toast.css('bottom')).toEqual(shiftBy + INITIAL_BOTTOM + 'px');
  });
});

describe('shiftDown()', () => {
  const shiftDown = ToastRewireAPI.__get__('shiftDown');
  const INITIAL_TOP = 10;
  let $toast;
  beforeEach(() => {
    $.fx.off = true;
    $toast = $(document.createElement(('div')));
    $toast.css('top', INITIAL_TOP);
  });
  it('should shift toast down', () => {
    const shiftBy = 5;

    shiftDown($toast, shiftBy);

    expect($toast.css('top')).toEqual(shiftBy + INITIAL_TOP + 'px');
  });
});
