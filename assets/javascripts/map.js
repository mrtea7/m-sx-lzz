var myMap = {
    op: {
        lat: 30.002364,
        lng: 120.59246,
        adr: "浙江省绍兴市越城区人民中路",
        type: "baidu"
    },
    maps: null,
    is_default: true,
    is_change: false,
    baidu: {
        point: null,
        marker: null,
        infowindow: null,
        map: null,
        load: function () {
            if (typeof (BMap) == 'undefined') {
                var script = document.createElement("script"),
                    positioning = $("#positioning"),
                    self = this;

                self.el = {
                    searchId: $('#searchId'),
                    suggestId: $("#suggestId")
                };

                script.src = "http://api.map.baidu.com/api?v=2.0&ak=359042E5AC9ced07c553ebe2042aad73&callback=myMap.baidu.init";
                document.body.appendChild(script);
                
                positioning.click(function () {
                    self.search();
                });
            } else {
                this.init();
            }

        },
        init: function (op) {
            var self = this;
            self.map = new BMap.Map("l-map");
            self.point = new BMap.Point(myMap.op.lng, myMap.op.lat);
            self.map.centerAndZoom(self.point, 15);
            self.map.enableScrollWheelZoom();

            self.marker = new BMap.Marker(self.point);
            self.map.addOverlay(self.marker);
            self.marker.enableDragging();

            self.el.suggestId.text(myMap.op.adr).data('lat', myMap.op.lat).data('lng', myMap.op.lng);;

            self.map.addEventListener("dragend", function() {
                var cp = self.map.getCenter();

                self.marker.setPosition(new BMap.Point(cp.lng, cp.lat));
                self.showAddress(self.marker);
            });

            self.map.addEventListener("dragging", function() {
                var cp = self.map.getCenter();
                self.marker.setPosition(new BMap.Point(cp.lng, cp.lat));

            });

            self.marker.addEventListener("dragend", function (e) {
                self.map.panTo(new BMap.Point(e.point.lng, e.point.lat));
                self.showAddress(self.marker);

            });

            if (myMap.is_default) {
                // window.setTimeout(function () {
                    // self.locate();
                // }, 1000);
            }

        },
        locate: function () {
            var self = this;
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    point = new BMap.Point(r.point.lng, r.point.lat);
                    self.marker.setPosition(point);
                    self.map.panTo(point);
                    
                    self.showAddress(self.marker, true);

                } else {
                    console.log("无法获取定位");
                }
            });
        },
        search: function () {
            var self = this;
            var myGeo = new BMap.Geocoder();
            var addr = self.el.searchId.val();
            addr = addr.length > 0 ? addr : myMap.op.adr;
            myGeo.getPoint(addr, function (point) {
                if (point) {
                    self.marker.setPosition(point);
                    self.map.panTo(point);
                    
                    // map.centerAndZoom(self.marker.getPosition(), self.map.getZoom());
                    self.showAddress(self.marker, true);
                } else {
                    console.log("Search no point");
                }
            }, "全国");
        },
        showAddress: function (marker, callout) {
            var latlng = marker.getPosition();
            var self = this;
            var myGeo = new BMap.Geocoder();

            myGeo.getLocation(latlng, function (result) {
                if (result) {
                    // el.lat.val(latlng.lat);
                    // el.lng.val(latlng.lng);
                    self.el.suggestId.text(result.address).data('lat', latlng.lat).data('lng', latlng.lng);

                } else {
                    console.log("无法获取定位");
                }
            });
        }

    },
    init: function (op) {
        var self = this;
        if (op) { self.op = op; self.is_default = false; };
        self.maps = this.baidu;

        self.maps.load();
    }
}