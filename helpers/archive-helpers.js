var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public/'),
  'archivedSites' : path.join(__dirname, '../archives/sites/'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, 'utf8', function(err, data){
    if (err) { console.error("Unable to read URL list.\n", err); }
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function (urls) {
    callback(urls.some(function(listUrl) {
      if (listUrl === url) { return true; }
    }))
  });
};

exports.addUrlToList = function(url){
  if(url) {
    fs.appendFile(exports.paths.list, url + '\n', function(err) {
      if (err) { console.error("Unable to add URL to list\n", err); }
    });
  }
};

exports.isUrlArchived = function(url, callback){
  fs.exists(exports.paths.archivedSites + url, callback);
};

exports.downloadUrl = function(url){
  http.get({url: url}, exports.paths.archivedSites + url, function(err, res) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(res.code, res.file);
  });
};
