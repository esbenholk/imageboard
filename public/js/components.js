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
                me.image = response.data.image;
                me.comments = response.data.comments;
            })
            .catch(err => console.log("error", err));
    },
    props: ["id"],
    methods: {
        sendClosingRequestToParent: function() {
            this.$emit("close");
            console.log("image id", this.image.id);
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
