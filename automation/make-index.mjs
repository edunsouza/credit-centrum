#!/usr/bin/env zx
import fs from 'fs';
import { sources, wpUrl, projectUrl, cookie, getAssetsFolder } from './sources.mjs';

const buildPath = `${__dirname}/../build`;
const indexPath = `${buildPath}/index.html`;

const index = await $`curl -s ${wpUrl} -H 'Cookie: ${cookie}' -H 'User-Agent: Mozilla'`;

let indexContent = index.stdout;

for (const { origin, file, ext, dir } of sources) {
  const folder = getAssetsFolder({ dir, ext }).replace(/^.+\/assets\//i, 'assets/');
  const fileName = [file, ext].join('.');
  const dest = [folder, fileName].join('/');

  indexContent = indexContent.replaceAll(origin, dest);
}

// manual replaces
const escapedUrl = wpUrl.replaceAll('/', '\\\/');
indexContent = indexContent
  // SCRIPTS
  .replaceAll(`${escapedUrl}\\/wp-includes\\/js\\/wp-emoji-release.min.js`, 'assets/js/wp-emoji-release.min.js')
  .replaceAll(`${escapedUrl}\\/wp-content\\/plugins\\/elementor\\/assets\\/`, 'assets/')

  // ASSETS
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a4f1nxqandunjx3wg0kof3v6nmdckvm0x7zs.png`, 'assets/img/home-300x300.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a14mxkdomaxl7rehkfrv1phfz6hi6x08mpws.png`, 'assets/img/home-300x300.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a6ur8syayuoha9c24qncud6p324xr7wtvo20.png`, 'assets/img/home-300x300.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a68tul5avzh0uoa0pk4oqjuth771gmu4n21g.png`, 'assets/img/home-300x300.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a376vi4ahnfqoqztlnjc7h7ffwhjzpgmfzyo.png`, 'assets/img/home-300x300.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/elementor/thumbs/1-1-q2myg6a3kcifloxrrey3mn95ujgysyem93d9b1l5z0.png`, 'assets/img/home-300x300.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/3-300x300.png`, 'assets/img/construction-300x300.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/3-1024x1024.png`, 'assets/img/construction-1024x1024.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/3-150x150.png`, 'assets/img/construction-150x150.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/3-768x768.png`, 'assets/img/construction-768x768.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/3.png`, 'assets/img/construction.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/4-150x150.png`, 'assets/img/speedometer-150x150.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/4-300x300.png`, 'assets/img/speedometer-300x300.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/4.png`, 'assets/img/speedometer.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/4-1024x1024.png`, 'assets/img/speedometer.png')
  .replaceAll(`${wpUrl}/wp-content/uploads/2023/02/4-768x768.png`, 'assets/img/speedometer.png')

  // SEO & OG
  .replace(/<head>/gi, `<head>
    <meta name="description" content="SUA CASA PRÓPRIA EM 15 DIAS" />
    <meta property="og:description" content="SUA CASA PRÓPRIA EM 15 DIAS" />
    <meta property="og:title" content="Credit Centrum" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${projectUrl}" />
    <meta property="og:image" content="/public/favicon.jpeg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="200" />
    <meta property="og:image:height" content="200" />
    <link rel="icon" type="image/jpeg" href="/public/favicon.jpeg" />
  `)
  .replace(/<link\s+rel=.canonical.\s+[^>]*>/gi, `<link rel="canonical" href="${projectUrl}" />`)
  .replace(/<link\s+rel=.shortlink.\s+[^>]*>/gi, `<link rel="shortlink" href="${projectUrl}" />`)

  // EXCLUSIONS
  .replace(/\<meta\s+name=.generator.\s+[^>]*>/gi, '')
  .replace(/<link\s+rel=.(alternate|EditURI|wlwmanifest|https:\/\/.+).\s+[^>]+>/gi, '')
  .replace(/@charset\s+.UTF-8.;?/gi, '')

  // GRAMMAR / TYPOS
  .replaceAll('FAMILIA', 'FAMÍLIA')
  .replace('baixos.,', 'baixos,')
  .replace(/ /g, ' ')

  // COMMENTS
  .replace(/\/\*\![^*]+\*\//g, '')

  // MINIFY / CLEAN
  .replace(/xmlns=.http:\/\/www\.w3\.org\/2000\/svg./g, '')
  .replace(/\n+/g, '\n')
  .replace(/\t+/g, '\t')
  .replace(/\s{2,}/g, ' ')

await $`mkdir -p ${buildPath}`;

fs.writeFileSync(indexPath, indexContent, { encoding: 'utf-8' });
