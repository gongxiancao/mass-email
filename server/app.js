'use strict';
process.chdir(__dirname);
var framework = require('framework')(); // jshint ignore:line

module.exports = framework
.use('framework-env')
.use('framework-config')
.use('framework-model')
.use('framework-service')
.use('framework-controller')
.use('framework-express')
.use('framework-express-policy')
.use('framework-express-route')
.lift()
.listen()
.on('error', function (err) {
  console.error(err);
  return process.exit(1);
})
.on('listened', function () {
  /*jshint multistr: true */
  console.log('\n\
                        .:/+ossssoo/:.            \n\
                     ./ssssoo+//+oossss/.         \n\
                   .+sss+-`        `-+sss+.       \n\
            ``..``:sss/.              `/sss:      \n\
         .:+ossssssss:                  :sss:     \n\
       `/ssso/:::+os/         ./+/`      /sss`    \n\
      `osso.      `-`        :ssss-      -sss.    \n\
     `:sss.                `+ssso-       -sss`    \n\
   ./ossss.   `.-----------osss+.       `osss:.   \n\
 .+sss+:-.`   :+oossssssssssss/`        `-/osss/` \n\
.oss+.          ``..-:/ossssss+`           `.+sso.\n\
oss+                  -ssssssss/              +sso\n\
sss/                .+ssso-./sss/             /sso\n\
/sso`             `/ssss:`   -oss:           .oss:\n\
`+sso-         `-/ssso:`      `:ss-      `-:+sss: \n\
  -osso/:---:/+ssso/-           `:`      :+++:-`  \n\
    .:+ossssso+/-.                                \n\
====================================================\n\
Mass Email started at port ' + framework.config.port + ', env=' + framework.environment);
});
