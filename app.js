var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    proxy = require('express-http-proxy'),
    urlHelper = require('url'),
    bodyParser = require('body-parser');

http.globalAgent.maxSockets = 100000;

var app = express();

// all environments
app.set('port', 3000);
app.use('/action', proxy('https://sb2.sunbird.org', {
    https: true,
    proxyReqPathResolver: function(req) {
        return "/api" + urlHelper.parse(req.url).path;
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        // you can update headers 
        if(!srcReq.headers['content-type']){
            proxyReqOpts.headers['Content-Type'] = 'application/json';
            proxyReqOpts.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkNjAwMGZkMjkwNGQ0YzI4OGU2OTk2MzcxZjY3N2U2MiJ9.xJveSc4FCT_46OafkmU6Y0SX2MNL6L6lW7kfUD7lkhU';
            proxyReqOpts.headers['X-Authenticated-User-Token'] = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJpTnBlRmRBQ2lOb3VNcTVGWFpNMXItLS10TW84dkYzVmhabW9MVjdCajYwIn0.eyJqdGkiOiI5MWI3MTM1ZC1mODFmLTQwZmEtYjFlZC00Nzg2ZTEwZjgyYzQiLCJleHAiOjE1NzkwMjE2MTQsIm5iZiI6MCwiaWF0IjoxNTc5MDAwMDE0LCJpc3MiOiJodHRwczovL3NiMi5zdW5iaXJkLm9yZy9hdXRoL3JlYWxtcy9zdW5iaXJkIiwiYXVkIjoiYWRtaW4tY2xpIiwic3ViIjoiZjo4YzJjNzU3Ni05MTBjLTQ4ZGMtODc5Zi0yZGVkYjJhYWY4NDU6NzI2OWY3MmQtNDY0MC00Njg4LWJkMjQtZmQ1ZjRhZDMxOWM4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWRtaW4tY2xpIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiMjlmMGNkMzAtNjcwMS00NTUyLWJhYzYtYWViZDcwZWY0MGJiIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6W10sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7fSwibmFtZSI6IkNvbnRlbnQgQ3JlYXRvciIsInByZWZlcnJlZF91c2VybmFtZSI6ImVkdWNhdGlvbl9jb250ZW50Y3JlYXRvciIsImdpdmVuX25hbWUiOiJDb250ZW50IiwiZmFtaWx5X25hbWUiOiJDcmVhdG9yIiwiZW1haWwiOiJlZHVjYXRpb25fY29udGVudGNyZWF0b3JAc3VuYmlyZC5vcmcifQ.nOxxDrHxCyCal5yz1jDw1ZEiTTVrtyume2i2s-OZpIatPI-BDWBUKCxf5g3-SsIOUoA80I4wPSyKxl6WUb6d0v3Jyw7BZZ_7zDOuYI-Cl17MVk_IW_-5-vPX0r84wNTPUNSeV5uJ0RFr58KIHFXL4prQHgr58RUeMFKAJQu79Ja-NaWwh3RgKbfoes6J6j7ykANaq9NAWJQtOnFxS0GvACHKtuTTt0tb-RIKDrSTzd_U3p1p6e9L9JZBJOdx-nleNJC8WY0-IYC0vAq1gTW4ZfV3hJMMtJmrzJSwCGYBRWS7MMixc9rqCa7_GuEyZGc0ccwcRh2E6pt6FKS9SLlC0Q';
            proxyReqOpts.headers['X-Channel-Id'] = '01278239935309414410';
            proxyReqOpts.headers['user-id'] = 'content-editor';

        }

        return proxyReqOpts;
    }
}));
app.use('/assets/public', proxy('https://sb2.sunbird.org', {
    https: true,
    proxyReqPathResolver: function(req) {
        return "/assets/public" + urlHelper.parse(req.url).path;
    }
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(express.static(path.join(__dirname, '.')));

var routes = __dirname + '/server/routes', route_files = fs.readdirSync(routes);
route_files.forEach(function (file) {
    require(routes + '/' + file)(app, __dirname);
});

var server = http.createServer(app).listen(app.get('port'), 1500 , function() {
    console.log('Server started at port 3000')
});
server.timeout = 0;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';