Vue.component("imageModal", {
    template: "#imagemodaltemplate",
    data: function() {
        return {
            title: "",
            description: "",
            image: {},
            username: "",
            comment: ""
        };
    },
    mounted: function() {
        console.log(this.id);
        var me = this;
        axios
            .post("/image", {
                params: { id: me.id }
            })
            .then(function(response) {
                console.log("got single image from server", response.data);
                me.image = response.data;
            })
            .catch(err => console.log("error", err));
    },
    props: ["greetee", "id"],
    methods: {
        sendClosingRequestToParent: function() {
            this.$emit("close");
        }
    }
});
