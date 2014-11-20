var path = require('path');
var url = require('url');
var queryString = require('querystring');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');

var methods = {
  'GET': function(req, res, pathname) {
    if (pathname === '/') { pathname = 'index.html' }
    http.serveAssets(res, pathname);
  },
  'POST': function(req, res) {
    http.getPostData(req, function(data){
      var parsedData = queryString.parse(data);
      archive.isUrlInList(parsedData.url, function(inList) {
        if (inList) {
          archive.isUrlArchived(parsedData.url, function(archived) {
            if (archived) {
              http.redirect(res, parsedData.url);
            } else {
              http.redirect(res, 'loading.html');
            }
          })
        } else {
          archive.addUrlToList(parsedData.url);
          http.redirect(res, 'loading.html');
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  var parsedUrl = url.parse(req.url);

  methods[req.method](req, res, parsedUrl.pathname)


  // res.end(archive.paths.list);
};
