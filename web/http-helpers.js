var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.getPostData = function(req, callback) {
  var data = '';
  req.on('data', function(chunk){
    data += chunk;
  });
  req.on('end', function(){
    callback(data);
  })
};

exports.redirect = function(res, toUrl) {
  var redirectHeaders = headers;
  redirectHeaders['Location'] = toUrl;
  res.writeHead(302, redirectHeaders);
  res.end();
};

exports.serveAssets = function(res, asset, callback) {
  var path;

  if ((/.+\.(html|css|js)/).test(asset)) {
    path = archive.paths.siteAssets;
  } else {
    path = archive.paths.archivedSites;
  }

  fs.readFile(path + asset, 'utf8', function(err, data) {
    if (err) {
      exports.sendResponse(res, "404 Not Found", 404);
      return;
    }
    exports.sendResponse(res, data, 200);
  });
};

exports.sendResponse = function(res, data, statusCode){
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(data);
};
