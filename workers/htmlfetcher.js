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
