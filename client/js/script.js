var imgData;

    function ClearProcess() {
        $('#processInfo').empty();
    }

    function ShowProcess(text) {
        $('#processInfo').append(text + "<br />");
    }

    function loadFromTumblr() {
        $('#images').empty();
        ShowProcess('Loading post from tumblr');
        var tumblrName = $('#tumblr_name').val();

        //Tumblr retrieval
        $.getJSON("http://" + tumblrName + ".tumblr.com/api/read/json?callback=?",
                function (data) {
                    $.each(data.posts, function (i, posts) {
                        var photo500 = this['photo-url-500'];
                        if (photo500 == undefined) return;
                        $('#images').append('<img src="' + photo500 + '">');
                    });

                    addClickEventToImages();
                });
    }

    function addClickEventToImages() {
        $('img').click(function () {
            var imgUlr = $(this).attr('src');

            ClearProcess();
            ShowProcess('Converting Image into [data:image\/jpeg;base64,] format ');

            //Canvas don't support modification of remote loaded images, then $.getImageData convert the remote image into embebed image to process locally
            $.getImageData({
                url: imgUlr,
                success: function (image) {
                    imgData = $(image).attr('src');

                    //start processingJs framework
                    var canvas = document.getElementById("canvasViewPort");
                    var p = new Processing(canvas, sketchProc);
                },
                error: function (xhr, text_status) {
                    console.log("bab luck dude :(", xhr, text_status);
                }
            });
        });
    }

    $(window).load(function () {
        //process first image
        $('img').first().click();
    });

    $(document).ready(function () {
        console.log(location.href);
        $('#load_tumblr_button').click(loadFromTumblr);
        $('#tumblr_name').keypress(function (e) {
            if (e.keyCode == 13) {
                loadFromTumblr();
            }
        });

        loadFromTumblr();
    });