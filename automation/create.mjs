#!/usr/bin/env zx
import fs from 'fs';
import { sources, wpUrl, projectUrl, cookie, getAssetsFolder } from './sources.mjs';

const buildPath = `./build`;
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
const wpHost = new URL(wpUrl).host;
const projectHost = new URL(projectUrl).host
const projectFavIcon = `${projectUrl}/favicon.jpeg`;
const projectTitle = 'Credit Centrum';
const projectDescription = 'Sua casa própria em 30 dias';

indexContent = indexContent
  // <meta content="https://www.google.com/logos/doodles/2023/mario-molinas-80th-birthday-6753651837110030-2x.png" property="twitter:image">
  // <meta content="https://www.google.com/logos/doodles/2023/mario-molinas-80th-birthday-6753651837110030-2x.png" property="og:image">

  // SEO & OG
  .replace(/<head>/gi, `<head>
    <link rel="icon" type="image/jpeg" href="${projectFavIcon}" />
    <meta prefix="og: http://ogp.me/ns#" property="og:image" content="${projectFavIcon}">
    <meta name="twitter:image" content="${projectFavIcon}">
    <meta content="${projectFavIcon}" itemprop="image">

    <title>${projectTitle}</title>
    <meta prefix="og: http://ogp.me/ns#" property="og:title" content="${projectTitle}">
    <meta name="twitter:title" content="${projectTitle}">
    <meta name="author" content="${projectTitle}">
  
    <meta name="description" content="${projectDescription}">
    <meta prefix="og: http://ogp.me/ns#" property="og:description" content="${projectDescription}">
    <meta name="twitter:description" content="${projectDescription}">

    <meta prefix="og: http://ogp.me/ns#" property="og:url" content="${projectUrl}">
    <meta property="twitter:domain" content="${projectHost}">
    <meta property="twitter:url" content="${projectUrl}">

    <meta prefix="og: http://ogp.me/ns#" property="og:image:type" content="image/jpeg">
    <meta prefix="og: http://ogp.me/ns#" property="og:image:width" content="200">
    <meta prefix="og: http://ogp.me/ns#" property="og:image:height" content="200">
    <meta prefix="og: http://ogp.me/ns#" property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">

    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
  `)
  .replace(/<link\s+rel=.canonical.\s+[^>]*>/gi, `<link rel="canonical" href="${projectUrl}" />`)
  .replace(/<link\s+rel=.shortlink.\s+[^>]*>/gi, `<link rel="shortlink" href="${projectUrl}" />`)

  // SCRIPTS
  .replaceAll(`${escapedUrl}\\/wp-includes\\/js\\/wp-emoji-release.min.js`, 'assets/js/wp-emoji-release.min.js')
  .replaceAll(`${escapedUrl}\\/wp-content\\/plugins\\/elementor\\/assets\\/`, 'assets/')
  .replaceAll(`=${wpHost}%2F"`, `=${projectHost}%2F"`)
  .replace(/.ajaxForServerEvent.:true/gi, '"ajaxForServerEvent":false')
  .replace(/['"]?event_url['"]?\s*:\s*.[^'"]+['"]/gi, `"event_url":"${projectHost}"`)
  .replace(/['"]?ajaxUrl['"]?\s*:\s*.[^'"]+['"]/gi, `"ajaxUrl":""`)
  .replace(/['"]?siteUrl['"]?\s*:\s*.[^'"]+['"]/gi, `"siteUrl":"${projectUrl}"`)

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

  // EXCLUSIONS
  .replace(/<meta\s+name=.generator.\s+[^>]*>/gi, '')
  .replace(/<title>Credit Centrum [a-z0-9&#;\sáéíóú]+<\/title>/gi, '')
  .replace(/<link\s+rel=.(alternate|EditURI|wlwmanifest|https:\/\/.+).\s+[^>]+>/gi, '')
  .replace(/<script\s+type=.application\/javascript.>console\.log\(.PixelYourSite Free version [0-9\.]+.\);<\/script>/gi, '')
  .replace(/@charset\s+.UTF-8.;?/gi, '')
  .replace(/<svg[a-z0-9/:"'=.\s]*viewBox=[0\s"'](.(?!\/svg>))+<\/svg>/gi, '')

  // GRAMMAR / TYPOS
  .replaceAll('FAMILIA', 'FAMÍLIA')
  .replace('baixos.,', 'baixos,')
  .replace(/ /g, ' ')

  // COMMENTS
  .replace(/\/\*\![^*]+\*\//g, '')
  .replace(/<!--(.(?!->))+-->/g, '')

  // CLEAN
  .replace(/xmlns=.http:\/\/www\.w3\.org\/2000\/svg./gi, '')
  .replace(/\n+/g, '\n')
  .replace(/\t+/g, '\t')

await $`mkdir -p ${buildPath}`;

fs.writeFileSync(indexPath, indexContent, { encoding: 'utf-8' });
