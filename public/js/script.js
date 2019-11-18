new Vue({
    el: "#main",
    data: {
        name: "esben",
        seen: true,
        images: []
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
        method1: function(e) {
            console.log("the method (as Vue.method.method1), works");
            console.log("eventinstance (default passed value)", e);
        }
    }
});
