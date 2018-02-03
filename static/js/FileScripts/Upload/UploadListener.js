const snappy = require('snappyjs');

$(document).ready(function ()
{
    /* Occurs when the user uploads a file or multiple files to the server */
    $("#fileupload").on("change", function ()
    {
        function notifyByteExceeded(contentSize)
        {
            $.notify(
            {
                icon: "glyphicon glyphicon-warning-sign",
                title: "File size exceeded 200MB: ",
                message: "The total amount of bytes uploaded (" + contentSize +
                    "MB) exceeds the maximum limit."
            },
            {
                type: "warning",
                placement:
                {
                    from: "top",
                    align: "center"
                }
            });
        }
        function notifyCompressionFailed()
        {
            $.notify(
            {
                icon: "glyphicon glyphicon-exclamation-sign",
                title: "An error has occured",
                message: "File couldn't be compressed."
            },
            {
                type: "danger",
                placement:
                {
                    from: "top",
                    align: "center"
                }
            });
        }

        htmlDocumentElement = document.getElementById("fileupload");
        const uploadedFile = htmlDocumentElement.files[0];
        htmlDocumentElement.value = "";
        if( uploadedFile === null || uploadedFile === undefined ) return;
        const fileNameTokens = uploadedFile.name.split(".");
        if (uploadedFile.size > CONSTANTS.MAXIMUM_UPLOAD_BYTES)
        {
            const contentSize = (uploadedFile.size / CONSTANTS.MEGABYTE).toFixed(2);
            notifyByteExceeded( contentSize );
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = function()
        {
            const compressedData = snappy.compress( fileReader.result );
            const base64 = _arrayBufferToBase64( compressedData );
            axios.post( '/upload', 
            {
                name:  uploadedFile.name,
                size:  compressedData.size,
                image: base64
            }).then( function(response)
            {
                switch( response.status )
                {
                    // success callback
                    case 200: onUploadSuccess( response ); break;
                    // error callback
                    default: onUploadError( response ); break;
                }
            });
        };
        fileReader.readAsArrayBuffer( uploadedFile );
    });

    function onUploadSuccess( data )
    {   
        console.log( 'success' );
        return;
    }

    function onUploadError( error )
    {
        console.log( 'error' );
        return;
    }

});
