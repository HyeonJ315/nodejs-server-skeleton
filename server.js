//Constants and config
const CONFIG = require( './config/config.js' );

//REST api
const axios      = require( 'axios' );
const path       = require( 'path' );
const http       = require( 'http' );
const express    = require( 'express' );
const bodyParser = require( 'body-parser' );
const Promise    = require( 'bluebird' );

//for creating the sha256 hash.
const sha256    = require( 'sha256' );
const ab_to_str = require( 'arraybuffer-to-string' );
const b64_ab    = require( 'base64-arraybuffer' );

//setup amazon web services.
const AWS    = require( 'aws-sdk' );
const AWS_S3 = new AWS.S3();

// create the app and server.
const app    = express();
const server = http.createServer( app );

module.exports = function( )
{
    let self = {};
    self.APP = app;
    return self;
}();

//required for base64 conversions.
const base_array_converter = require( 'base64-arraybuffer' );
// for parsing application/json
app.use( bodyParser.json( { limit: '200mb' } ) );
// for parsing application/xwww-
app.use( bodyParser.urlencoded( { extended: true } ) );
// static images
app.use( express.static( CONFIG.STATIC_DIR ) );
// Home Screen
app.get('/', function(request, result, next) 
{
    result.sendFile( path.resolve( CONFIG.STATIC_HTML_DIR + 'index.html' ) );
});

// Uploading a file
app.post('/upload', function( request, result, next )
{
    const requestData = request.body;
    const filename    = requestData.name;
    const filesize    = requestData.size;
    const fileimage   = requestData.image;
    const filebuffer  = b64_ab.decode( fileimage );
    const filestring  = ab_to_str( filebuffer );
    const filehash    = sha256( filestring );
    const filekey     = filename + "|" + filehash;
    console.log( filekey );
    AWS_S3.putObject(
    {
        Bucket: "swagbox0", 
        Key: filekey,
        Body: fileimage
    }, 
    function( error, data )
    {
        if( error )
        {
            console.log( error );
            result.writeHead( 500, { 'Content-Type': 'text/plain' } );
            result.end( 'Internal Server Error: could not place file into the database.' );
            result.send();
        }
        else
        {

            result.writeHead( 200, { 'Content-Type': 'text/plain' } );
            result.end( data.Expiration + '|' + data.ETag + '|' + data.VersionId );
            result.send();
        }
    }); 
});

// Downloading a file
app.get( '/download/*', function( request, result, next )
{
});

server.listen( 3000, function() 
{
    console.log('server is running');
});
