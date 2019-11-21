new Vue({
    el: "#main",
    data: {
        seen: true,
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
        currentImage: location.hash.slice(1),
        lastImage: null
    },
    mounted: function() {
        var me = this;
        axios
            .get("/images")
            .then(function(response) {
                console.log("response from server object", response.data);
                me.images = response.data;
                me.lastImage = response.data[response.data.length - 1];
                me.infinitescroll();
            })
            .catch(err => console.log("error", err));

        addEventListener("hashchange", function() {
            console.log(location.hash);
            me.currentImage = location.hash.slice(1);
        });
    },
    methods: {
        handleClick: function(e) {
            var datathis = this;
            e.preventDefault();
            console.log("this", this);

            var fd = new FormData();
            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("username", this.username);

            axios
                .post("/upload", fd)
                .then(function(res) {
                    datathis.images.unshift(res.data.image);
                    datathis.title = "";
                    datathis.username = "";
                    datathis.description = "";
                })
                .catch(function(err) {
                    console.log("error in post upload");
                });
        },
        handleChange: function(e) {
            this.file = e.target.files[0];
        },
        setCurrentImage: function(imageid) {
            console.log("imageclicked", imageid);
            this.currentImage = imageid;
            if (imageid == null) {
                location.hash = "";
            }
        },
        infinitescroll: function() {
            var me = this;
            console.log(
                window.innerHeight,
                pageYOffset,
                document.body.scrollHeight
            );

            if (
                window.innerHeight + pageYOffset >=
                document.body.scrollHeight
            ) {
                console.log("lastimageid to search with", me.lastImage.id);
                axios
                    .get(`/moreimages/${me.lastImage.id}`)
                    .then(function(response) {
                        me.lastImage = response.data[response.data.length - 1];
                        if (response.data.length > 0) {
                            me.images = me.images.concat(response.data);
                            console.log(
                                "infinitescroll gives more results",
                                me.images
                            );
                            me.infinitescroll();
                        }
                    })
                    .catch("not receiving the next set of images");
            } else {
                // me.infinitescroll();
                setTimeout(function() {
                    me.infinitescroll();
                }, 500);
            }
        }
    }
});

// var me = this;
// var main = document.getElementById("main");
// var content = document.getElementById("imagecontainer");
// function checkForScroll() {
//     console.log(me.lastImage.id);
//     if (
//         main.scrollTop + main.offsetHeight + 100 >=
//         content.offsetHeight
//     ) {
//         axios
//             .get(`/moreimages/${me.lastImage.id}`)
//             .then(function(response) {
//                 me.lastImage =
//                     response.data[response.data.length - 1];
//                 me.images = me.images.concat(response.data);
//             })
//             .catch("not receiving the next set of images");
//     }
// }
//
// document.addEventListener("scroll", function() {
//     setTimeout(checkForScroll(), 2000);
// });
