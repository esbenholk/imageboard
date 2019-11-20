new Vue({
    el: "#main",
    data: {
        seen: true,
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
        currentImage: null
    },
    mounted: function() {
        var me = this;
        axios
            .get("/images")
            .then(function(response) {
                console.log("response from server object", response.data);
                me.images = response.data;
            })
            .catch(err => console.log("error", err));
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
        }
    }
});
