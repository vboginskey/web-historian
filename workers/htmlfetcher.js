// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require('../helpers/archive-helpers');
var request = require('http-request');

archive.readListOfUrls(function (urls) {
  urls.forEach(function (url) {
    archive.isUrlArchived(url, function (archived) {
      if (!archived) { archive.downloadUrl(url); }
    })
  })
});

console.info("fetcher run successful.")
