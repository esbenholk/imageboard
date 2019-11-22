Vue.component("imageModal", {
    template: "#imagemodaltemplate",
    data: function() {
        return {
            title: "",
            description: "",
            image: {},
            username: "",
            comments: "",
            comment: ""
        };
    },
    mounted: function() {
        console.log(this.id);
        var me = this;
        axios
            .get(`/${me.id}`)
            .then(function(response) {
                if (response.data.error == true) {
                    me.image = {
                        url:
                            "https://media1.giphy.com/media/10JMv1m2VeIY92/giphy.gif?cid=790b7611d2245f2efc9bae16b6eb4b75a4ccbfa69dc4a850&rid=giphy.gif"
                    };
                    document.getElementById("seeLeftPicture").style.display =
                        "none";
                    document.getElementById("seeRightPicture").style.display =
                        "none";
                    document.getElementById("comments").style.display = "none";
                } else {
                    me.image = response.data.image;
                    me.comments = response.data.comments;
                }
            })
            .catch(err => console.log("error", err));
    },
    props: ["id"],
    methods: {
        sendClosingRequestToParent: function() {
            this.$emit("close");
            this.$emit("scrolltoelement", { scrollId: this.image.id });
        },
        handleClickComment: function() {
            var me = this;
            axios
                .post("/commenting", {
                    comment: this.comment,
                    username: this.username,
                    userid: this.id
                })
                .then(function(res) {
                    console.log(res);
                    me.comments.push(res.data.comment);
                    me.username = "";
                    me.comment = "";
                })
                .catch(function(err) {
                    console.log("error in comment");
                });
        },
        seeLeftPicture: function() {
            var me = this;
            console.log(me.image.id);
            let newImageId = me.image.id + 1;
            axios
                .get(`/${newImageId}`)
                .then(function(response) {
                    var buttonL = document.getElementById("seeLeftPicture");
                    var buttonR = document.getElementById("seeRightPicture");
                    me.image = response.data.image;
                    me.comments = response.data.comments;
                    if (
                        response.data.image.id >= response.data.totalImageAmount
                    ) {
                        buttonL.style.display = "none";
                    }
                    if (response.data.image.id > 1) {
                        buttonR.style.display = "inline-block";
                    }
                })
                .catch(err => console.log("error", err));
        },
        seeRightPicture: function() {
            var me = this;
            console.log(me.image.id);
            let newImageId = me.image.id - 1;
            axios
                .get(`/${newImageId}`)
                .then(function(response) {
                    var buttonL = document.getElementById("seeLeftPicture");
                    var buttonR = document.getElementById("seeRightPicture");
                    me.image = response.data.image;
                    me.comments = response.data.comments;
                    if (response.data.image.id <= 1) {
                        buttonR.style.display = "none";
                    }
                    if (
                        response.data.image.id > response.data.totalImageAmount
                    ) {
                        buttonL.style.display = "inline-block";
                    }
                })
                .catch(err => console.log("error", err));
        }
    },
    watch: {
        id: function() {
            var me = this;
            axios
                .get(`/${me.id}`)
                .then(function(response) {
                    me.image = response.data.image;
                    me.comments = response.data.comments;
                })
                .catch(err => console.log("error", err));
        }
    }
});
