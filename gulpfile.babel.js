import gulp from 'gulp'
import babel from 'gulp-babel'
import gru2 from 'gulp-rollup-2'

// const gru2 = require('gulp-rollup-2')

const requiredFiles = ['src/**/*.js']
gulp.task('build', () => 
  gulp.src('./src/**/*.js')
    .pipe(gru2.rollup({
           input: 'src/main.js',
        external: ['window'],
         // plugins: [plugin1(), plugin2()],
           cache: true,
          output: [
            {
                   file: 'index.js',
                   name: 'example', 
                 format: 'umd',
                globals: {window: 'window'}
            },
            {
                   file: 'index.esm.bundle.js',
                 format: 'es',
                globals: {window: 'window'}
            },
        ]}))
    .pipe(gulp.dest('./dist'))
)
