#!/usr/bin/env zx
import { sources, cookie, getAssetsFolder } from './sources.mjs';

const assetFolders = Array.from(new Set(sources.map(({ dir, ext }) => getAssetsFolder({ dir, ext }))));

await $`mkdir -p ${assetFolders}`;

await Promise.all(sources.map(async ({ origin, file, ext, dir }) => {
  const fileName = [file, ext].join('.');
  const dest = [getAssetsFolder({ dir, ext }), fileName].join('/');

  await $`curl ${origin} -H 'Cookie: ${cookie}' -H 'User-Agent: Mozilla' > ${dest}`;
}));
