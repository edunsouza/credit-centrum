#!/usr/bin/env zx
import fs from 'fs'

const [action] = process.argv.slice(3);
const websiteUrl = 'http://gabrielpereira.infinityfreeapp.com'
const rootPath = `${__dirname}/../src`
const indexPath = `${rootPath}/index.html`
const assetsPath = `${rootPath}/assets`;
const userAgent = 'some-user-agent';
const cookie = '__test=1cc524907c7e9805d51d13e6cdf56e18'

const sources = [
  { ext: 'js', file: 'jquery-core', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-includes/js/jquery/jquery.min.js?ver=3.6.1' },
  { ext: 'js', file: 'jquery-migrate', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.3.2' },
  { ext: 'js', file: 'hello-theme-frontend', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/themes/hello-elementor/assets/js/hello-frontend.min.js?ver=1.0.0' },
  { ext: 'js', file: 'jquery-numerator', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/jquery-numerator/jquery-numerator.min.js?ver=0.2.1' },
  { ext: 'js', file: 'elementor-webpack-runtime', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js?ver=3.11.0' },
  { ext: 'js', file: 'elementor-frontend-modules', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=3.11.0' },
  { ext: 'js', file: 'elementor-waypoints', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/waypoints/waypoints.min.js?ver=4.0.2' },
  { ext: 'js', file: 'jquery-ui-core', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-includes/js/jquery/ui/core.min.js?ver=1.13.2' },
  { ext: 'js', file: 'elementor-frontend', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/js/frontend.min.js?ver=3.11.0' },

  // requested internally by JS scripts
  { ext: 'js', file: 'text-editor.2c35aafbe5bf0e127950.bundle.min', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/js/text-editor.2c35aafbe5bf0e127950.bundle.min.js' },
  { ext: 'js', file: 'counter.02cef29c589e742d4c8c.bundle.min', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/js/counter.02cef29c589e742d4c8c.bundle.min.js' },
  { ext: 'js', file: 'toggle.31881477c45ff5cf9d4d.bundle.min', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/js/toggle.31881477c45ff5cf9d4d.bundle.min.js' },

  { ext: 'js', file: 'wp-emoji-release.min', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-includes/js/wp-emoji-release.min.js?ver=6.1.1' },

  { ext: 'jpeg', file: '2023_02_cliente-02', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/cliente-02.jpeg' },
  { ext: 'jpeg', file: '2023_02_cliente-02-300x300', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/cliente-02-300x300.jpeg' },
  { ext: 'jpeg', file: '2023_02_cliente-02-150x150', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/cliente-02-150x150.jpeg' },
  { ext: 'jpeg', file: '2023_02_cliente-03', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/cliente-03.jpeg' },
  { ext: 'jpeg', file: '2023_02_cliente-03-300x300', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/cliente-03-300x300.jpeg' },
  { ext: 'jpeg', file: '2023_02_cliente-03-150x150', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/cliente-03-150x150.jpeg' },

  { ext: 'png', file: '2023_02_LOGO-LETRA-BRANCA-Copia', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/LOGO-LETRA-BRANCA-Copia.png' },
  { ext: 'png', file: '2023_02_LOGO-LETRA-BRANCA-Copia-300x125', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/LOGO-LETRA-BRANCA-Copia-300x125.png' },
  { ext: 'png', file: '2023_02_LOGO-LETRA-BRANCA-Copia-768x320', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/LOGO-LETRA-BRANCA-Copia-768x320.png' },
  { ext: 'png', file: '2023_02_logo-somente-simbolo-fundo-preto-150x150', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/logo-somente-simbolo-fundo-preto-150x150.png' },
  { ext: 'png', file: '2023_02_logo-somente-simbolo-fundo-preto-300x300', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/logo-somente-simbolo-fundo-preto-300x300.png' },
  { ext: 'png', file: '2023_02_logo-somente-simbolo-fundo-preto', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/logo-somente-simbolo-fundo-preto.png' },
  { ext: 'png', file: '2023_02_1-1', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/1-1.png' },
  { ext: 'png', file: '2023_02_elementor_thumbs_1-1-q2myg6a4f1nxqandunjx3wg0kof3v6nmdckvm0x7zs', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a4f1nxqandunjx3wg0kof3v6nmdckvm0x7zs.png' },
  { ext: 'png', file: '2023_02_1-1-150x150', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/1-1-150x150.png' },
  { ext: 'png', file: '2023_02_elementor_thumbs_1-1-q2myg6a14mxkdomaxl7rehkfrv1phfz6hi6x08mpws', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a14mxkdomaxl7rehkfrv1phfz6hi6x08mpws.png' },
  { ext: 'png', file: '2023_02_elementor_thumbs_1-1-q2myg6a6ur8syayuoha9c24qncud6p324xr7wtvo20', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a6ur8syayuoha9c24qncud6p324xr7wtvo20.png' },
  { ext: 'png', file: '2023_02_elementor_thumbs_1-1-q2myg6a68tul5avzh0uoa0pk4oqjuth771gmu4n21g', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a68tul5avzh0uoa0pk4oqjuth771gmu4n21g.png' },
  { ext: 'png', file: '2023_02_elementor_thumbs_1-1-q2myg6a376vi4ahnfqoqztlnjc7h7ffwhjzpgmfzyo', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a376vi4ahnfqoqztlnjc7h7ffwhjzpgmfzyo.png' },
  { ext: 'png', file: '2023_02_elementor_thumbs_1-1-q2myg6a3kcifloxrrey3mn95ujgysyem93d9b1l5z0', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a3kcifloxrrey3mn95ujgysyem93d9b1l5z0.png' },
  { ext: 'png', file: '2023_02_3', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/3.png' },
  { ext: 'png', file: '2023_02_3-300x300', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/3-300x300.png' },
  { ext: 'png', file: '2023_02_3-1024x1024', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/3-1024x1024.png' },
  { ext: 'png', file: '2023_02_3-150x150', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/3-150x150.png' },
  { ext: 'png', file: '2023_02_3-768x768', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/3-768x768.png' },
  { ext: 'png', file: '2023_02_4', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/4.png' },
  { ext: 'png', file: '2023_02_4-300x300', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/4-300x300.png' },
  { ext: 'png', file: '2023_02_4-1024x1024', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/4-1024x1024.png' },
  { ext: 'png', file: '2023_02_4-150x150', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/4-150x150.png' },
  { ext: 'png', file: '2023_02_4-768x768', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/4-768x768.png' },
  { ext: 'png', file: '2023_02_5', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/5.png' },
  { ext: 'png', file: '2023_02_5-300x300', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/5-300x300.png' },
  { ext: 'png', file: '2023_02_5-150x150', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/5-150x150.png' },
  { ext: 'png', file: '2023_02_1-1-300x300', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/1-1-300x300.png' },
  { ext: 'png', file: '2023_02_2-1-300x300', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/2-1-300x300.png' },
  { ext: 'png', file: '2023_02_2-1-150x150', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/2-1-150x150.png' },
  { ext: 'png', file: '2023_02_2-1', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/2-1.png' },
  { ext: 'png', file: '2023_02_3-1-300x300', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/3-1-300x300.png' },
  { ext: 'png', file: '2023_02_3-1-150x150', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/3-1-150x150.png' },
  { ext: 'png', file: '2023_02_3-1', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/3-1.png' },
  { ext: 'png', file: '2023_02_cliente-01', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/cliente-01.png' },
  { ext: 'png', file: '2023_02_cliente-01-300x259', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/02/cliente-01-300x259.png' },
  { ext: 'png', file: '2023_03_100-300x300', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/03/100-300x300.png' },
  { ext: 'png', file: '2023_03_100-150x150', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/03/100-150x150.png' },
  { ext: 'png', file: '2023_03_100', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/2023/03/100.png' },

  { ext: 'css', file: 'wp-includes_css_dist_block-library_style', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-includes/css/dist/block-library/style.min.css?ver=6.1.1' },
  { ext: 'css', file: 'wp-includes_css_classic-themes', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-includes/css/classic-themes.min.css?ver=1' },
  { ext: 'css', file: 'wp-content_plugins_header-footer-elementor_assets_css_header-footer-elementor', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/header-footer-elementor/assets/css/header-footer-elementor.css?ver=1.6.13' },
  { ext: 'css', file: 'wp-content_plugins_elementor_assets_lib_eicons_css_elementor-icons', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.min.css?ver=5.18.0' },
  { ext: 'css', file: 'wp-content_plugins_elementor_assets_css_frontend-lite', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/css/frontend-lite.min.css?ver=3.11.0' },
  { ext: 'css', file: 'wp-content_plugins_elementor_assets_lib_swiper_v8_css_swiper', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css?ver=8.4.5' },
  { ext: 'css', file: 'wp-content_uploads_elementor_css_post-4', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/elementor/css/post-4.css?ver=1676343251' },
  { ext: 'css', file: 'wp-content_uploads_elementor_css_global', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/elementor/css/global.css?ver=1676343251' },
  { ext: 'css', file: 'wp-content_uploads_elementor_css_post-7', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/uploads/elementor/css/post-7.css?ver=1677848968' },
  { ext: 'css', file: 'wp-content_plugins_header-footer-elementor_inc_widgets-css_frontend', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/header-footer-elementor/inc/widgets-css/frontend.css?ver=1.6.13' },
  { ext: 'css', file: 'wp-content_themes_hello-elementor_style', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/themes/hello-elementor/style.min.css?ver=2.6.1' },
  { ext: 'css', file: 'wp-content_themes_hello-elementor_theme', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/themes/hello-elementor/theme.min.css?ver=2.6.1' },
  { ext: 'css', file: 'wp-content_plugins_elementor_assets_lib_font-awesome_css_fontawesome', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/css/fontawesome.min.css?ver=5.15.3' },
  { ext: 'css', file: 'wp-content_plugins_elementor_assets_lib_font-awesome_css_solid', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/css/solid.min.css?ver=5.15.3' },
  { ext: 'css', file: 'wp-content_plugins_elementor_assets_lib_font-awesome_css_brands', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/css/brands.min.css?ver=5.15.3' },
  { ext: 'css', file: 'wp-content_plugins_elementor_assets_lib_animations_animations', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/animations/animations.min.css?ver=3.11.0' },

  { ext: 'eot', file: 'eicons', dir: 'fonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.eot?5.18.0' },
  { ext: 'eot', file: 'eicons', dir: 'fonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.eot?5.18.0#iefix' },
  { ext: 'woff2', file: 'eicons', dir: 'fonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.woff2?5.18.0' },
  { ext: 'woff', file: 'eicons', dir: 'fonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.woff?5.18.0' },
  { ext: 'ttf', file: 'eicons', dir: 'fonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.ttf?5.18.0' },
  { ext: 'svg', file: 'eicons', dir: 'fonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.svg?5.18.0#eicon' },

  { ext: 'eot', file: 'fa-brands-400', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-brands-400.eot' },
  { ext: 'eot', file: 'fa-brands-400', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-brands-400.eot?#iefix' },
  { ext: 'woff2', file: 'fa-brands-400', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-brands-400.woff2' },
  { ext: 'woff', file: 'fa-brands-400', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-brands-400.woff' },
  { ext: 'ttf', file: 'fa-brands-400', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-brands-400.ttf' },
  { ext: 'svg', file: 'fa-brands-400', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-brands-400.svg#fontawesome' },
  { ext: 'eot', file: 'fa-solid-900', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.eot' },
  { ext: 'eot', file: 'fa-solid-900', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.eot?#iefix' },
  { ext: 'woff2', file: 'fa-solid-900', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.woff2' },
  { ext: 'woff', file: 'fa-solid-900', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.woff' },
  { ext: 'ttf', file: 'fa-solid-900', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.ttf' },
  { ext: 'svg', file: 'fa-solid-900', dir: 'webfonts', origin: 'http://gabrielpereira.infinityfreeapp.com/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.svg#fontawesome' },
];

const getFolderName = (extension, customDir) => {
  const dir = customDir
    ? customDir
    : { png: 'img', jpeg: 'img', svg: 'img' }[extension] || extension;

  return `assets/${dir}`;
}

if (action === 'load') {
  await $`mkdir -p ${assetsPath}/js ${assetsPath}/css ${assetsPath}/img ${assetsPath}/fonts ${assetsPath}/webfonts`;
}

const websiteContent = await $`curl -s ${websiteUrl} -H 'Cookie: ${cookie}' -H 'User-Agent: ${userAgent}'`
let indexContent = websiteContent.stdout;

await Promise.all(
  sources.map(async ({ file, origin, ext, dir }) => {
    const folderName = getFolderName(ext, dir);
    const fileName = [file, ext].join('.');
    const dest = [folderName, fileName].join('/');

    if (action === 'load') {
      await $`curl ${origin} -H 'Cookie: ${cookie}' -H 'User-Agent: ${userAgent}' > ${rootPath}/${dest}`;
    }

    indexContent = indexContent.replaceAll(origin, dest);
  })
);

// manual replaces
indexContent = indexContent.replaceAll('http:\\/\\/gabrielpereira.infinityfreeapp.com\\/wp-includes\\/js\\/wp-emoji-release.min.js', 'assets/js/wp-emoji-release.min.js');
indexContent = indexContent.replaceAll('http:\\/\\/gabrielpereira.infinityfreeapp.com\\/wp-content\\/plugins\\/elementor\\/assets\\/', 'assets/');

fs.writeFileSync(indexPath, indexContent, { encoding: 'utf-8' });
