module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nr_locales_htmllint: {
      options: {
        force: true,
        'indent-width': false,
        'tag-bans': [],
        'attr-bans': [],
        'link-req-noopener': false,
        'spec-char-escape': false,
        'line-no-trailing-whitespace': false,
      },
      src: ['./nodes/**/locales/**/*.html'],
    },
    inlinelint: {
      html: [
        './nodes/**/*.html',
        '!node_modules/*/*.html',
        '!*/node_modules/*.html',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },
    copy: {
      fire: {
        files: [
          {
            expand: true,
            cwd: './lib/',
            src: ['**'],
            dest: './packages/fire/lib/',
          },
          {
            expand: true,
            cwd: './nodes/in-app-browser/',
            src: ['**'],
            dest: './packages/fire/nodes/in-app-browser/',
          },
          {
            expand: true,
            cwd: './nodes/intent/',
            src: ['**'],
            dest: './packages/fire/nodes/intent/',
          },
          {
            expand: true,
            cwd: './nodes/notifications/alert/',
            src: ['**'],
            dest: './packages/fire/nodes/notifications/alert/',
          },
          {
            expand: true,
            cwd: './nodes/notifications/beep/',
            src: ['**'],
            dest: './packages/fire/nodes/notifications/beep/',
          },
          {
            expand: true,
            cwd: './nodes/notifications/confirm/',
            src: ['**'],
            dest: './packages/fire/nodes/notifications/confirm/',
          },
          {
            expand: true,
            cwd: './nodes/notifications/prompt/',
            src: ['**'],
            dest: './packages/fire/nodes/notifications/prompt/',
          },
          {
            expand: true,
            cwd: './nodes/sensors/battery/',
            src: ['**'],
            dest: './packages/fire/nodes/sensors/battery/',
          },
          {
            expand: true,
            cwd: './nodes/sensors/db/',
            src: ['**'],
            dest: './packages/fire/nodes/sensors/db/',
          },
          {
            expand: true,
            cwd: './nodes/sensors/motion/',
            src: ['**'],
            dest: './packages/fire/nodes/sensors/motion/',
          },
          {
            expand: true,
            cwd: './nodes/sensors/subscribe/',
            src: ['**'],
            dest: './packages/fire/nodes/sensors/subscribe/',
          },
          {
            expand: true,
            cwd: './nodes/sensors/unsubscribe/',
            src: ['**'],
            dest: './packages/fire/nodes/sensors/unsubscribe/',
          },
          {
            expand: true,
            cwd: './nodes/serial/',
            src: ['**'],
            dest: './packages/fire/nodes/serial/',
          },
          {
            expand: true,
            cwd: './nodes/volume/',
            src: ['**'],
            dest: './packages/fire/nodes/volume/',
          },
          {
            expand: true,
            cwd: './nodes/sqlite/',
            src: ['**'],
            dest: './packages/fire/nodes/sqlite/',
          },
          {
            expand: true,
            cwd: './nodes/ble/',
            src: ['**'],
            dest: './packages/fire/nodes/ble/',
          },
          {
            expand: true,
            cwd: './nodes/clipboard/',
            src: ['**'],
            dest: './packages/fire/nodes/clipboard/',
          },
          {
            expand: true,
            cwd: './nodes/camera/',
            src: ['**'],
            dest: './packages/fire/nodes/camera/',
          },
          {
            expand: true,
            cwd: './nodes/mlkit/',
            src: ['**'],
            dest: './packages/fire/nodes/mlkit/',
          },
          {
            expand: true,
            cwd: './examples/',
            src: [
              'sqlite.json',
              'ble.json',
              'mlkit.json',
              'startActivity.json',
            ],
            dest: './packages/fire/examples/',
          },
          {
            expand: true,
            cwd: './nodes/',
            src: ['*.js'],
            dest: './packages/fire/nodes/',
          },
        ],
      },
      android: {
        files: [
          {
            expand: true,
            cwd: './lib/',
            src: ['**'],
            dest: './packages/android/lib/',
          },
          {
            expand: true,
            cwd: './nodes/',
            src: ['**'],
            dest: './packages/android/nodes/',
          },
          {
            expand: true,
            cwd: './examples/',
            src: ['**'],
            dest: './packages/android/examples/',
          },
        ],
      },
    },
    clean: {
      fire: ['./packages/fire/nodes/', './packages/fire/examples/'],
      android: ['./packages/android/nodes/', './packages/android/examples/'],
    },
  });

  grunt.loadNpmTasks('grunt-lint-inline');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-nr-locales-htmllint');

  grunt.registerTask('default', ['inlinelint:html', 'nr_locales_htmllint']);
  grunt.registerTask('android', ['clean:android', 'copy:android']);
  grunt.registerTask('fire', ['clean:fire', 'copy:fire']);
};
