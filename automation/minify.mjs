#!/usr/bin/env zx

const assetsPath = `./build/assets`;
// const indexPath = `./build/index.html`;
const faviconPath = `./build/favicon.jpeg`

const tempFileSuffix = '.minified-temp';
const minifyOptions = JSON.stringify({
  html: {
    removeAttributeQuotes: false
  }
});

const assets = await $`
  echo ${minifyOptions} > .minify.json

  find ${assetsPath}/* | grep -E "\\w\\.\\w"
`

await Promise.all(assets.stdout.split('\n').map(async (file) => {
  const [type] = file.split('.').slice(-1);

  if (['js', 'css'].includes(type)) {
    await $`npx minify ${file} > ${file + tempFileSuffix}`;
  }

  if (type === 'jpeg') {
    await $`sips -s format jpeg -s formatOptions low ${file} --out ${file}`
  }
}));

await $`
  rm .minify.json

  find ${assetsPath}/**/*${tempFileSuffix} -exec sh -c 'mv "$1" "\${1%${tempFileSuffix}}"' -- {} \\;

  sips -Z 200 -s format jpeg -s formatOptions low ${assetsPath}/img/black_logo_icon.png --out ${faviconPath}
`
// npx minify ${indexPath} > ${indexPath + tempFileSuffix}
// mv ${indexPath + tempFileSuffix} ${indexPath}
