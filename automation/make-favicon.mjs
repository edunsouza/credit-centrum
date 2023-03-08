#!/usr/bin/env zx
import { sources, cookie,  } from './sources.mjs';

const publicPath = `${__dirname}/../build/public`;
const faviconPath = `${publicPath}/favicon.jpeg`
const iconSource = sources.find(({ file }) => file === 'black_logo_icon');

await $`mkdir -p ${__dirname}/../build`;

await $`mkdir -p ${publicPath}`;

await $`curl ${iconSource.origin} -H 'Cookie: ${cookie}' -H 'User-Agent: Mozilla' > ${faviconPath}`;

await $`sips -Z 200 -s format jpeg -s formatOptions low ${faviconPath} --out ${faviconPath}`;
