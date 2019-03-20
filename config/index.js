// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

/**
 * 时间版本
 * @param {Number} time 时间
 */
function timestamp(time) {
    var date = new Date(time);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());

    return Y + M + D;
}

/**
 * 随机数
 * @param {Object} digit 生成位数的随机数
 */
function MathRand(digit) {
    var num = '';
    for (var i = 0; i < digit; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
}
// 版本信息  年月日+ 五位随机数
var version = '_' + timestamp(new Date().getTime()) + '_' + getMinute() + '_' + MathRand(5);


function getMinute() {
    var date = new Date(),
        minute = date.getMinutes(),
        hours = date.getHours();

    return String(hours) + String(minute);

}

console.log('process:' + process.env.NODE_ENV)
console.info('index.js:' + process.argv[3])

var urlMap = {
    'prod': 'http://192.168.1.104/web/',
    'pre': 'http://192.168.1.104/web/',
    'sit': '/liveapp/'
}

console.info('urlMap:' + urlMap[process.env.NODE_ENV])

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist/'),
        assetsSubDirectory: 'static',
        assetsPublicPath: process.env.NODE_ENV ? urlMap[process.env.NODE_ENV] : '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 8081,
        autoOpenBrowser: true,
        assetsSubDirectory: '/static',
        assetsPublicPath: '/',
        proxyTable: {
            // proxy all requests starting with /api to jsonplaceholder
            '/cxb': {
                //target: 'http://sit.iris.com',
                target: 'http://sit.iris.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/cxb': ''
                }
            }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
