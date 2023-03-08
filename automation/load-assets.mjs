#!/usr/bin/env zx
import { sources, cookie, getAssetsFolder } from './sources.mjs';

await $`mkdir -p ${__dirname}/../build`;

for (const { origin, file, ext, dir } of sources) {
  const folder = getAssetsFolder({ dir, ext });
  const fileName = [file, ext].join('.');
  const dest = [folder, fileName].join('/');

  await $`mkdir -p ${folder}`;

  $`curl ${origin} -H 'Cookie: ${cookie}' -H 'User-Agent: Mozilla' > ${dest}`;
}
