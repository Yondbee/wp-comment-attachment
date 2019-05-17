/**
 * Custom code for Comment Attachment by Andrea Santambrogio @ Yondbee
 */
(function (w, d, $, _settings) {
    

    console.debug('Comment Attachment Init', _settings);

    var fsClient = filestack.init(_settings.commentAttachmentFilestack);
    var fsForm = null;
    var fsInput = null;

    function doneLoading(files, form, input) {
        // Parse all the data and inject them into the hidden field
        /*
            [name] => testfile.txt
            [type] => application/octet-stream
            [tmp_name] => /tmp/php6wHXmC
            [error] => 0
            [size] => 4
        */

        console.debug('Upload done', files);

        var filesUploadedData = [];
        if (files.filesUploaded.length > 0)
        {
            for (var i = 0; i < files.filesUploaded.length; ++i)
            {
                var f = files.filesUploaded[i];

                filesUploadedData.push({
                    name: f.filename,
                    type: f.mimetype,
                    tmp_name: f.url,
                    size: f.size,
                    error: 0
                });
            }

            console.debug('Parsed uploaded data', filesUploadedData);
            input.val(JSON.stringify(filesUploadedData));
            console.log(form.submit);
            form.submit();
        }
        else
            $('#attachment.data').val('');
    }


    var filestackOptions = {
        "maxFiles": _settings.commentAttachmentMaxFiles || 5,
        "accept": _settings.commentAttachmentAllowedTypes || [],
        "storeTo": {
            "container": _settings.commentAttachmentFilestackAmazonS3Bucket || 'default',
            "location": "s3",
            "path": _settings.commentAttachmentFilestackAmazonS3BucketFolder + "/" || '/',
            "region": "eu-central-1",
            "access": "public"
        },
        "fromSources": [
            "local_file_system",
            "googledrive",
            "dropbox",
        ],
        "uploadInBackground": false,
        "onUploadDone": function (files) {
            console.log(files);
            console.log(fsForm);
            console.log(fsInput);
            doneLoading(files, fsForm, fsInput);
        }
    };

    var fsPicker = fsClient.picker(filestackOptions);

    $('.attachment-button').click(function (e) {
        
        fsForm = this.form;
        fsInput = $(fsForm).find('input[name="attachment-data"]');

        fsPicker.open();
        e.preventDefault();
    })

})(window, document, jQuery, y_comment_attachment);