var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http-request');

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public/'),
  'archivedSites' : path.join(__dirname, '../archives/sites/'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

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
