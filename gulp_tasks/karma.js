process.env.NODE_ENV = 'test';

const path = require('path');

const gulp = require('gulp');
const karma = require('karma');
const conf = require('../gulp.conf');

gulp.task('karma:single-run', karmaSingleRun);
gulp.task('karma:auto-run', karmaAutoRun);

function karmaFinishHandler(done) {
  return failCount => {
    done(failCount ? new Error(`Failed ${failCount} tests.`) : null);
  };
}

function karmaSingleRun(done) {
  const configFile = path.join(process.cwd(), conf.path.config('karma.conf.js'));
  const karmaServer = new karma.Server({configFile}, karmaFinishHandler(done));
  karmaServer.start();
}

function karmaAutoRun(done) {
  const configFile = path.join(process.cwd(), conf.path.config('karma-auto.conf.js'));
  const karmaServer = new karma.Server({configFile}, karmaFinishHandler(done));
  karmaServer.start();
}
