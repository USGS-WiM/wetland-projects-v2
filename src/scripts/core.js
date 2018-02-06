//for jshint
//'use strict';
// Generated on 2015-04-13 using generator-wim 0.0.1

/**
 * Created by bdraper on 4/3/2015.
 */

var map;
var allLayers;
var maxLegendHeight;
var maxLegendDivHeight;
var printCount = 0;
var legendLayers = [];
var measurement;

var identifyTask, identifyParams;

var aoiClicked = false;

require([
    'esri/map',
    'esri/arcgis/utils',
    'esri/config',
    'esri/dijit/Geocoder',
    'esri/dijit/HomeButton',
    'esri/dijit/Legend',
    'esri/dijit/LocateButton',
    'esri/dijit/Measurement',
    'esri/dijit/PopupTemplate',
    'esri/graphic',
    'esri/geometry/Extent',
    'esri/geometry/Multipoint',
    'esri/geometry/Point',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/renderers/UniqueValueRenderer',
    'esri/SpatialReference',
    'esri/symbols/PictureMarkerSymbol',
    'esri/tasks/GeometryService',
    'esri/tasks/IdentifyParameters',
    'esri/tasks/IdentifyTask',
    'esri/tasks/LegendLayer',
    'esri/tasks/PrintTask',
    'esri/tasks/PrintParameters',
    'esri/tasks/PrintTemplate',
    'esri/geometry/webMercatorUtils',
    'esri/urlUtils',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/dnd/Moveable',
    'dojo/query',
    'dojo/on',
    'dojo/domReady!'
], function (
    Map,
    arcgisUtils,
    esriConfig,
    Geocoder,
    HomeButton,
    Legend,
    LocateButton,
    Measurement,
    PopupTemplate,
    Graphic,
    Extent,
    Multipoint,
    Point,
    ArcGISTiledMapServiceLayer,
    UniqueValueRenderer,
    SpatialReference,
    PictureMarkerSymbol,
    GeometryService,
    IdentifyParameters,
    IdentifyTask,
    LegendLayer,
    PrintTask,
    PrintParameters,
    PrintTemplate,
    webMercatorUtils,
    urlUtils,
    dom,
    domClass,
    Moveable,
    query,
    on
) {

        //bring this line back after experiment////////////////////////////
        //allLayers = mapLayers;

        esriConfig.defaults.io.corsEnabledServers.push("fwsmapper.wim.usgs.gov");
        esri.config.defaults.io.proxyUrl = "https://fwsmapper.wim.usgs.gov/serviceProxy/proxy.ashx";

        esriConfig.defaults.geometryService = new GeometryService("https://fwsmapper.wim.usgs.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");

        /*urlUtils.addProxyRule({
                                proxyUrl: "http://52.70.106.103/serviceProxy/proxy.ashx",
                                urlPrefix: "http://52.70.106.103/arcgis/rest/services/SecurePrinting/"
                            });
        
        urlUtils.addProxyRule({
                                proxyUrl: "http://52.70.106.103/serviceProxy/proxy.ashx",
                                urlPrefix: "http://52.70.106.103/arcgis/rest/services/Wetlands"
                            });
    
        urlUtils.addProxyRule({
                                proxyUrl: "http://52.70.106.103/serviceProxy/proxy.ashx",
                                urlPrefix: "http://52.70.106.103/arcgis/rest/services/Wetlands_Raster"
                            });
    
        urlUtils.addProxyRule({
                                proxyUrl: "http://52.70.106.103/serviceProxy/proxy.ashx",
                                urlPrefix: "http://52.70.106.103/arcgis/rest/services/Wetlands_Status"
                            });
    
        urlUtils.addProxyRule({
                                proxyUrl: "http://52.70.106.103/serviceProxy/proxy.ashx",
                                urlPrefix: "http://52.70.106.103/arcgis/rest/services/Riparian"
                            });
    
        urlUtils.addProxyRule({
                                proxyUrl: "http://52.70.106.103/serviceProxy/proxy.ashx",
                                urlPrefix: "http://52.70.106.103/arcgis/rest/services/Data_Source"
                            });
    
        urlUtils.addProxyRule({
                                proxyUrl: "http://52.70.106.103/serviceProxy/proxy.ashx",
                                urlPrefix: "http://52.70.106.103/arcgis/rest/services/Historic_Wetlands"
                            });*/

        map = new Map('mapDiv', {
            basemap: 'streets',
            extent: new Extent(-16339179.166, 97839.396, -3541786.143, 9059928.089, new SpatialReference({ wkid:3857 }))
        });

        var home = new HomeButton({
            map: map,
            extent: new Extent(-16339179.166, 97839.396, -3541786.143, 9059928.089, new SpatialReference({ wkid:3857 })),
            home: function() {
                $('#zoomToSelect').val('usa');
                map.setExtent(this.extent);
            }

        }, "homeButton");
        home.startup();

        var locate = new LocateButton({
            map: map,
            scale: 4514,
        }, "locateButton");
        locate.startup();

        //var utmCoords = $('<tr class="esriMeasurementTableRow" id="utmCoords"><td><span>UTM17</span></td><td class="esriMeasurementTableCell"> <span id="utmX" dir="ltr">UTM X</span></td> <td class="esriMeasurementTableCell"> <span id="utmY" dir="ltr">UTM Y</span></td></tr>');
        //$('.esriMeasurementResultTable').append(utmCoords);

        //following block forces map size to override problems with default behavior
        $(window).resize(function () {
            if ($("#legendCollapse").hasClass('in')) {
                maxLegendHeight = ($('#mapDiv').height()) * 0.90;
                $('#legendElement').css('height', maxLegendHeight);
                $('#legendElement').css('max-height', maxLegendHeight);
                maxLegendDivHeight = ($('#legendElement').height()) - parseInt($('#legendHeading').css("height").replace('px', ''));
                $('#legendDiv').css('max-height', maxLegendDivHeight);
            }
            else {
                $('#legendElement').css('height', 'initial');
            }
        });

        function showPrintModal() {
            $('#printModal').modal('show');
        }

        $('#printNavButton').click(function () {
            showPrintModal();
        });

        $('#printExecuteButton').click(function (e) {
            e.preventDefault();
            $(this).button('loading');
            printMap();
        });

        /*aoiSymbol = new PictureMarkerSymbol("../images/grn-pushpin.png", 45, 45);
    
        renderer.addValue({
            symbol: aoiSymbol
        });*/

        //displays map scale on map load
        on(map, "load", function () {
            var scale = map.getScale().toFixed(0);
            $('#scale')[0].innerHTML = addCommas(scale);
            var initMapCenter = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
            $('#latitude').html(initMapCenter.y.toFixed(3));
            $('#longitude').html(initMapCenter.x.toFixed(3));
            //map.setBasemap("topo");
            //map.setBasemap("hybrid");
        });
        //displays map scale on scale change (i.e. zoom level)
        on(map, "zoom-end", function () {
            var scale = map.getScale().toFixed(0);
            $('#scale')[0].innerHTML = addCommas(scale);
        });

        //updates lat/lng indicator on mouse move. does not apply on devices w/out mouse. removes "map center" label
        on(map, "mouse-move", function (cursorPosition) {
            $('#mapCenterLabel').css("display", "none");
            if (cursorPosition.mapPoint != null) {
                var geographicMapPt = webMercatorUtils.webMercatorToGeographic(cursorPosition.mapPoint);
                $('#latitude').html(geographicMapPt.y.toFixed(3));
                $('#longitude').html(geographicMapPt.x.toFixed(3));
            }
        });
        //updates lat/lng indicator to map center after pan and shows "map center" label.
        on(map, "pan-end", function () {
            //displays latitude and longitude of map center
            $('#mapCenterLabel').css("display", "inline");
            var geographicMapCenter = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
            $('#latitude').html(geographicMapCenter.y.toFixed(3));
            $('#longitude').html(geographicMapCenter.x.toFixed(3));
        });
        var usgsTopo = new ArcGISTiledMapServiceLayer('https://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer');
        var nationalMapBasemap = new ArcGISTiledMapServiceLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer');
        //on clicks to swap basemap. map.removeLayer is required for nat'l map b/c it is not technically a basemap, but a tiled layer.
        on(dom.byId('btnStreets'), 'click', function () {
            map.setBasemap('streets');
            map.removeLayer(nationalMapBasemap);
            map.removeLayer(usgsTopo);
        });
        on(dom.byId('btnSatellite'), 'click', function () {
            map.setBasemap('satellite');
            map.removeLayer(nationalMapBasemap);
            map.removeLayer(usgsTopo);
        });
        on(dom.byId('btnHybrid'), 'click', function () {
            map.setBasemap('hybrid');
            map.removeLayer(nationalMapBasemap);
            map.removeLayer(usgsTopo);
        });
        on(dom.byId('btnTerrain'), 'click', function () {
            map.setBasemap('terrain');
            map.removeLayer(nationalMapBasemap);
            map.removeLayer(usgsTopo);
        });
        on(dom.byId('btnGray'), 'click', function () {
            map.setBasemap('gray');
            map.removeLayer(nationalMapBasemap);
            map.removeLayer(usgsTopo);
        });
        on(dom.byId('btnNatGeo'), 'click', function () {
            map.setBasemap('national-geographic');
            map.removeLayer(nationalMapBasemap);
            map.removeLayer(usgsTopo);
        });
        on(dom.byId('btnOSM'), 'click', function () {
            map.setBasemap('osm');
            map.removeLayer(nationalMapBasemap);
            map.removeLayer(usgsTopo);
        });
        on(dom.byId('btnTopo'), 'click', function () {
            map.setBasemap('topo');
            map.removeLayer(nationalMapBasemap);
            map.removeLayer(usgsTopo);
        });

        on(dom.byId('btnNatlMap'), 'click', function () {
            map.addLayer(nationalMapBasemap, 1);
            map.removeLayer(usgsTopo);
        });

        on(dom.byId('btnUsgsTopo'), 'click', function () {
            map.addLayer(usgsTopo, 1);
            map.removeLayer(nationalMapBasemap);
        })

        identifyParams = new IdentifyParameters();
        identifyParams.tolerance = 0;
        identifyParams.returnGeometry = true;
        identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
        identifyParams.width = map.width;
        identifyParams.height = map.height;
        //identifyTask = new esri.tasks.IdentifyTask("http://50.17.205.92/arcgis/rest/services/NAWQA/DecadalMap/MapServer");
        identifyTask = new IdentifyTask(allLayers[0].layers["Active"].url);

        //code for adding draggability to infoWindow. http://www.gavinr.com/2015/04/13/arcgis-javascript-draggable-infowindow/
        var handle = query(".title", map.infoWindow.domNode)[0];
        var dnd = new Moveable(map.infoWindow.domNode, {
            handle: handle
        });

        // when the infoWindow is moved, hide the arrow:
        on(dnd, 'FirstMove', function () {
            // hide pointer and outerpointer (used depending on where the pointer is shown)
            var arrowNode = query(".outerPointer", map.infoWindow.domNode)[0];
            domClass.add(arrowNode, "hidden");

            var arrowNode = query(".pointer", map.infoWindow.domNode)[0];
            domClass.add(arrowNode, "hidden");
        }.bind(this));
        //end code for adding draggability to infoWindow

        //map click handler
        on(map, "click", function (evt) {

            /*if (aoiClicked == true) {
                aoiClicked = false;
                return;
            }
    */
            map.graphics.clear();
            //map.infoWindow.hide();s

            //alert("scale: " + map.getScale() + ", level: " + map.getLevel());

            identifyParams.geometry = evt.mapPoint;
            identifyParams.mapExtent = map.extent;
            identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
            identifyParams.returnGeometry = true;
            identifyParams.tolerance = 0;
            identifyParams.width = map.width;
            identifyParams.height = map.height;
            identifyParams.layerIds = [0, 1];

            //if (map.getLevel() >= 12 && $("#huc-download-alert")[0].scrollHeight == 0) {
            //the deferred variable is set to the parameters defined above and will be used later to build the contents of the infoWindow.
            setCursorByID("mainDiv", "wait");
            map.setCursor("wait");

            identifyTask = new IdentifyTask(allLayers[0].layers["recent"].url);

            var deferredResult = identifyTask.execute(identifyParams);

            deferredResult.addCallback(function (response) {
                if (response.length > 0) {
                    var feature = response[0].feature;
                    var attr;
                    var attrStatus;

                    for (var i = 0; i < response.length; i++) {
                        if (response[i].layerId == 0) {
                            //feature = response[i].feature;
                            attr = feature.attributes;
                        } else if (response[i].layerId == 1) {
                            attrStatus = response[i].feature.attributes;
                        }

                    }

                    // Code for adding wetland highlight
                    var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                            new dojo.Color([255, 255, 0]), 2), new dojo.Color([98, 194, 204, 0])
                    );
                    feature.geometry.spatialReference = map.spatialReference;
                    var graphic = feature;
                    graphic.setSymbol(symbol);

                    map.graphics.add(graphic);

                    var projmeta = '';
                    if (attrStatus.SUPPMAPINFO == 'None') {
                        projmeta = " NONE";
                    } else {
                        projmeta = " <a target='_blank' href='" + attrStatus.SUPPMAPINFO + "'>click here</a>";
                    }

                    if (response[0].layerName == "Recent Projects") {
                        var template = new esri.InfoTemplate("Wetland Mapping Project",
                            "<b>Project ID:</b> " + attrStatus.PROJECT_ID + "<br/>" +
                            "<b>Image Year:</b> " + attrStatus.IMAGE_YR + "<br/>" +
                            "<b>Project Metadata:</b>" + projmeta +
                            "<br/><p><a id='infoWindowLink' href='javascript:void(0)'>Zoom to Project</a></p>");
                    } else {
                        var template = new esri.InfoTemplate("Wetland Mapping Project",
                            "<b>Project ID:</b> " + attrStatus.PROJECT_ID + "<br/>" +
                            "<br/><p><a id='infoWindowLink' href='javascript:void(0)'>Zoom to Project</a></p>");
                    }
                    //ties the above defined InfoTemplate to the feature result returned from a click event

                    feature.setInfoTemplate(template);

                    map.infoWindow.setFeatures([feature]);
                    map.infoWindow.show(evt.mapPoint);

                    var infoWindowClose = dojo.connect(map.infoWindow, "onHide", function (evt) {
                        map.graphics.clear();
                        //dojo.disconnect(map.infoWindow, infoWindowClose);
                    });

                    setCursorByID("mainDiv", "default");
                    map.setCursor("default");

                    $("#infoWindowLink").click(function (event) {
                        var convertedGeom = webMercatorUtils.webMercatorToGeographic(feature.geometry);

                        var featExtent = convertedGeom.getExtent();

                        map.setExtent(featExtent, true);
                    });
                } else {
                    setCursorByID("mainDiv", "default");
                    map.setCursor("default");
                    map.infoWindow.hide();
                }
                //map.infoWindow.show(evt.mapPoint);

            });
        });

        //on(search,'search-results', function(e) {
        //$('#geosearchModal').modal('hide');
        //});

        // create search_api widget in element "geosearch"
        /*search_api.create("geosearch", {
            on_result: function (o) {
                // what to do when a location is found
                // o.result is geojson point feature of location with properties

                // zoom to location
                require(["esri/geometry/Extent"], function (Extent) {
                    var noExtents = ["GNIS_MAJOR", "GNIS_MINOR", "ZIPCODE", "AREACODE"];
                    var noExtentCheck = noExtents.indexOf(o.result.properties["Source"])
                    $("#geosearchModal").modal('hide');
                    if (noExtentCheck == -1) {
                        map.setExtent(
                            new esri.geometry.Extent({
                                xmin: o.result.properties.LonMin,
                                ymin: o.result.properties.LatMin,
                                xmax: o.result.properties.LonMax,
                                ymax: o.result.properties.LatMax,
                                spatialReference: { "wkid": 4326 }
                            }),
                            true
                        );
                    } else {
                        //map.setCenter();
                        require(["esri/geometry/Point"], function (Point) {
                            map.centerAndZoom(
                                new Point(o.result.properties.Lon, o.result.properties.Lat),
                                12
                            );
                        });
                    }

                });

            },
            "include_usgs_sw": true,
            "include_usgs_gw": true,
            "include_usgs_sp": true,
            "include_usgs_at": true,
            "include_usgs_ot": true,
            "include_huc2": true,
            "include_huc4": true,
            "include_huc6": true,
            "include_huc8": true,
            "include_huc10": true,
            "include_huc12": true

        }); */

        // Symbols
        var sym = createPictureSymbol('../images/purple-pin.png', 0, 12, 13, 24); 

        function createPictureSymbol(url, xOffset, yOffset, xWidth, yHeight) {
            return new PictureMarkerSymbol(
                {
                    'angle': 0,
                    'xoffset': xOffset, 'yoffset': yOffset, 'type': 'esriPMS',
                    'url': url,
                    'contentType': 'image/png',
                    'width':xWidth, 'height': yHeight
                });
        }

        map.on('load', function () {
            map.infoWindow.set('highlight', false);
            map.infoWindow.set('titleInBody', false);
        });


        function setCursorByID(id, cursorStyle) {
            var elem;
            if (document.getElementById &&
                (elem = document.getElementById(id))) {
                if (elem.style) elem.style.cursor = cursorStyle;
            }
        }

        // Show modal dialog; handle legend sizing (both on doc ready)
        $(document).ready(function () {
            function showModal() {
                $('#geosearchModal').modal('show');
            }
            // Geosearch nav menu is selected
            $('#geosearchNav').click(function () {
                showModal();
                on(dom.byId('geosearch_input'), 'change', function () {
                    $(".geosearchWarning").hide();
                })
            });

            function showAboutModal() {
                $('#aboutModal').modal('show');
            }
            $('#aboutNav').click(function () {
                showAboutModal();
            });

            $("#html").niceScroll();
            $("#sidebar").niceScroll();
            $("#sidebar").scroll(function () {
                $("#sidebar").getNiceScroll().resize();
            });

            maxLegendHeight = ($('#mapDiv').height()) * 0.90;
            $('#legendElement').css('max-height', maxLegendHeight);
            maxLegendDivHeight = (maxLegendHeight) - parseInt($('#legendHeading').css("height").replace('px', ''));
            $('#legendDiv').css('max-height', maxLegendDivHeight);

            $('#legendCollapse').on('shown.bs.collapse', function () {
                if (legendDiv.innerHTML.length == 0) {
                    var legend = new Legend({
                        map: map,
                        layerInfos: legendLayers
                    }, "legendDiv");
                    legend.startup();

                    $("#legendDiv").niceScroll();

                    /*legend.addCallback(function(response) { 
                        maxLegendHeight =  ($('#mapDiv').height()) * 0.90;
                        $('#legendElement').css('max-height', maxLegendHeight);
                        maxLegendDivHeight = ($('#legendElement').height()) - parseInt($('#legendHeading').css("height").replace('px',''));
                        $('#legendDiv').css('max-height', maxLegendDivHeight);
                    });*/
                }
            });

            $('#legendCollapse').on('hide.bs.collapse', function () {
                $('#legendElement').css('height', 'initial');
            });

        });

        function geosearch() {
            setSearchExtent();
            var def = geocoder.find();
            def.then(function (res){
                geocodeResults(res);
            });
        }
        
        var geocoder = new Geocoder({
            value: '',
            maxLocations: 25,
            autoComplete: true,
            arcgisGeocoder: true,
            autoNavigate: false,
            map: map
        }, 'geosearch');
        geocoder.startup();
        geocoder.on('select', geocodeSelect);
        geocoder.on('findResults', geocodeResults);
        geocoder.on('clear', clearFindGraphics);
        on(geocoder.inputNode, 'keydown', function (e) {
            if (e.keyCode == 13) {
                setSearchExtent();
            }
        });

        function geocodeSelect(item) {
            clearFindGraphics();
            var g = (item.graphic ? item.graphic : item.result.feature);
            g.setSymbol(sym);
        }

        function clearFindGraphics() {
            map.infoWindow.hide();
            map.graphics.clear();
        }

        //$(".geosearchWarning").hide(); //hidden for now; may need to get rid of this, not in SWI mapper, shows until hit "Go", doesn't show when location unavailable
        function geocodeResults(places) {
            places = places.results;
            if (places.length > 0) {
                clearFindGraphics();
                var symbol = sym;
                //zoomToPlaces(places);
                if (places[0].extent != null && places[0].extent.xmax != "NaN" && places[0].extent.xmin != places[0].extent.xmax) {
                    map.setExtent(places[0].extent, true)
                    //map.setLevel(12);
                    $(".geosearchWarning").hide();
                    // Close modal
                    $('#geosearchModal').modal('hide');
                } else if ((places[0].feature.geometry != null && places[0].feature.geometry.x != "NaN")) {
                    var centerPoint = new Point(places[0].feature.geometry);
                    map.centerAndZoom(centerPoint, 17);
                    $(".geosearchWarning").hide();
                    // Close modal
                    $('#geosearchModal').modal('hide');
                } else {
                    // code to give warning to the user that the search didn't work
                    $(".geosearchWarning").show();
                }
            } else {
                $(".geosearchWarning").show();//alert('Sorry, address or place not found.');  // TODO
            }
        } 

        // Geosearch functions
    on(dom.byId('btnGeosearch'),'click', geosearch);

        // Optionally confine search to map extent
    function setSearchExtent (){
        geocoder.activeGeocoder.searchExtent = null;
        /*if (dom.byId('chkExtent').checked === 1) {
            geocoder.activeGeocoder.searchExtent = map.extent;
        } else {
            geocoder.activeGeocoder.searchExtent = null;
        }*/
    }


        require([
            'esri/InfoTemplate',
            'esri/tasks/locator',
            'esri/tasks/query',
            'esri/tasks/QueryTask',
            'esri/graphicsUtils',
            'esri/geometry/Point',
            'esri/geometry/Extent',
            'esri/layers/ArcGISDynamicMapServiceLayer',
            'esri/layers/ArcGISImageServiceLayer',
            'esri/layers/FeatureLayer',
            'esri/layers/WMSLayer',
            'esri/layers/WMSLayerInfo',
            'esri/tasks/GeometryService',
            'dijit/form/CheckBox',
            'dijit/form/RadioButton',
            'dojo/query',
            'dojo/dom',
            'dojo/dom-class',
            'dojo/dom-construct',
            'dojo/dom-style',
            'dojo/on'
        ], function (
            InfoTemplate,
            Locator,
            Query,
            QueryTask,
            graphicsUtils,
            Point,
            Extent,
            ArcGISDynamicMapServiceLayer,
            ArcGISImageServiceLayer,
            FeatureLayer,
            WMSLayer,
            WMSLayerInfo,
            GeometryService,
            CheckBox,
            RadioButton,
            query,
            dom,
            domClass,
            domConstruct,
            domStyle,
            on
        ) {

                var layersObject = [];
                var layerArray = [];
                var staticLegendImage;
                var identifyTask, identifyParams;
                var navToolbar;
                var locator;

                var geomService = new GeometryService("https://fwsmapper.wim.usgs.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");

                //create global layers lookup
                var mapLayers = [];

                $.each(allLayers, function (index, group) {
                    console.log('processing: ', group.groupHeading)


                    //sub-loop over layers within this groupType
                    $.each(group.layers, function (layerName, layerDetails) {

                        var layer = new ArcGISDynamicMapServiceLayer(layerDetails.url, layerDetails.options);
                        //check if include in legend is true
                        if (layerDetails.visibleLayers) {
                            layer.setVisibleLayers(layerDetails.visibleLayers);
                        }
                        /*if (layerDetails.wimOptions && layerDetails.wimOptions.layerDefinitions) {
                            var layerDefs = [];
                            $.each(layerDetails.wimOptions.layerDefinitions, function (index, def) {
                                layerDefs[index] = def;
                            });
                            layer.setLayerDefinitions(layerDefs);
                        }
                        */
                        legendLayers.unshift({ layer: layer, title: layerName });

                        //map.addLayer(layer);
                        addLayerToMap(group.groupHeading, group.showGroupHeading, layer, layerName, layerDetails.options, layerDetails.wimOptions);
                        //addMapServerLegend(layerName, layerDetails);
                    });
                });

                function addLayerToMap(groupHeading, showGroupHeading, layer, layerName, options, wimOptions) {

                    //add layer to map
                    //layer.addTo(map);
                    map.addLayer(layer);



                    //add layer to layer list
                    mapLayers.push(["", camelize(layerName), layer]);



                    //not an exclusive group item

                    //create layer toggle
                    //var button = $('<div align="left" style="cursor: pointer;padding:5px;"><span class="glyphspan glyphicon glyphicon-check"></span>&nbsp;&nbsp;' + layerName + '</div>');
                    //image layer
                    if ((layer.visible && wimOptions.moreinfo)) {
                        var button = $(
                            '<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons">' +
                                '<button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left">' +
                                    '<i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;' + layerName + 
                                    '<span id="info' + camelize(layerName) + '" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span>'+
                                    '<span id="opacity' + camelize(layerName) + '" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span>' +
                                '</button>' +
                            '</div>');
                    } else if ((!layer.visible && wimOptions.moreinfo)) { 
                        var button = $(
                            '<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons">' +
                                '<button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left">' +
                                    '<i class="glyphspan fa fa-square-o"></i>&nbsp;&nbsp;' + layerName + 
                                    '<span id="info' + camelize(layerName) + '" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span>'+
                                    '<span id="opacity' + camelize(layerName) + '" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span>' +
                                '</button>' +
                            '</div>');
                    //recent and active layer
                    } else if (layer.visible && wimOptions.moreinfo == undefined) {
                        var button = $(
                            '<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons">' +
                                '<button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left">' +
                                    '<i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;' + layerName + 
                                    '<span id="opacity' + camelize(layerName) + '" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span>' +
                                '</button>' +
                            '</div>');
                    } else if ((!layer.visible && wimOptions.moreinfo == undefined)) {
                        var button = $(
                            '<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons">' +
                                '<button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left">' +
                                    '<i class="glyphspan fa fa-square-o"></i>&nbsp;&nbsp;' + layerName + 
                                    '<span id="opacity' + camelize(layerName) + '" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span>' +
                                '</button>' +
                            '</div>');
                    //check else
                    } else {
                        var button = $(
                            '<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons">' +
                                '<button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left">' +
                                    '<i class="glyphspan fa fa-square-o"></i>&nbsp;&nbsp;' + layerName + 
                                '</button>' +
                            '</div>');
                    }


                    //click listener for regular
                    button.click(function (e) {

                        //toggle checkmark
                        $(this).find('i.glyphspan').toggleClass('fa-check-square-o fa-square-o');
                        $(this).find('button').button('toggle');



                        //$('#' + camelize(layerName)).toggle();

                        //layer toggle
                        if (layer.visible) {
                            layer.setVisibility(false);
                        } else {
                            layer.setVisibility(true);
                        }

                        if (wimOptions.otherLayersToggled) {
                            $.each(wimOptions.otherLayersToggled, function (key, value) {
                                var lyr = map.getLayer(value);
                                lyr.setVisibility(layer.visible);
                            });
                        }

                    });

                    //group heading logic
                    if (showGroupHeading !== undefined) {

                        //camelize it for divID
                        var groupDivID = camelize(groupHeading);

                        //check to see if this group already exists
                        if (!$('#' + groupDivID).length) {
                            //if it doesn't add the header
                            if (showGroupHeading) {
                                var groupDiv = $('<div id="' + groupDivID + '"><div class="alert alert-info" role="alert"><strong>' + groupHeading + '</strong></div></div>');
                            } else {
                                var groupDiv = $('<div id="' + groupDivID + '"></div>');
                            }
                            $('#toggle').append(groupDiv);
                        }

                        //if it does already exist, append to it

                        $('#' + groupDivID).append(button);
                        if (wimOptions.moreinfo !== undefined && wimOptions.moreinfo) {
                            var id = "#info" + camelize(layerName);
                            var moreinfo = $(id);
                            moreinfo.click(function (e) {
                                window.open(wimOptions.moreinfo, "_blank");
                                e.preventDefault();
                                e.stopPropagation();
                            });
                        }
                        if ($("#opacity" + camelize(layerName)).length > 0) {
                            $("#opacity" + camelize(layerName)).click(function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                $(".opacitySlider").remove();
                                var currOpacity = map.getLayer(options.id).opacity;
                                var slider = $('<div class="opacitySlider"><label id="opacityValue">Opacity: ' + currOpacity + '</label><label class="opacityClose pull-right">X</label><input id="slider" type="range"></div>');
                                $("body").append(slider);[0]

                                $("#slider")[0].value = currOpacity * 100;
                                $(".opacitySlider").css('left', event.clientX - 180);
                                $(".opacitySlider").css('top', event.clientY - 50);

                                $(".opacitySlider").mouseleave(function () {
                                    $(".opacitySlider").remove();
                                });

                                $(".opacityClose").click(function () {
                                    $(".opacitySlider").remove();
                                });
                                $('#slider').change(function (event) {
                                    //get the value of the slider with this call
                                    var o = ($('#slider')[0].value) / 100;
                                    console.log("o: " + o);
                                    $("#opacityValue").html("Opacity: " + o)
                                    map.getLayer(options.id).setOpacity(o);

                                    if (wimOptions.otherLayersToggled) {
                                        $.each(wimOptions.otherLayersToggled, function (key, value) {
                                            var lyr = map.getLayer(value);
                                            lyr.setOpacity(o);
                                        });
                                    }
                                    //here I am just specifying the element to change with a "made up" attribute (but don't worry, this is in the HTML specs and supported by all browsers).
                                    //var e = '#' + $(this).attr('data-wjs-element');
                                    //$(e).css('opacity', o)
                                });
                            });
                        }
                    }

                    else {
                        //otherwise append
                        $('#toggle').append(button);
                        if (wimOptions.moreinfo !== undefined && wimOptions.moreinfo) {
                            var id = "#info" + camelize(layerName);
                            var moreinfo = $(id);
                            moreinfo.click(function (e) {
                                alert(e.currentTarget.id);
                                e.preventDefault();
                                e.stopPropagation();
                            });
                        }
                    }
                }
                //deleted commented out code

            });//end of require statement containing legend building code

    });

function stateSelected() {
    var select = $('#stateSelect')[0];
    if (select.selectedIndex > 0) {
        var selectedVal = select.options[select.selectedIndex].value;
        var selectedState = select.options[select.selectedIndex].label;
        $('#downloadState').html("Download <a target='_blank' href='http://www.fws.gov/wetlands/Downloads/State/" + selectedVal + "_wetlands.zip'>Geodatabase</a> and <a target='_blank' href='http://www.fws.gov/wetlands/Downloads/State/" + selectedVal + "_shapefile_wetlands.zip'>Shapefile</a> data for <b>" + selectedState + "</b>");
    } else {
        $('#downloadState').html("");
    }
}

$(".close-alert").click(function () {
    $(this).parent().slideUp(250);
});

function hucLinkListener(HUCNumber) {
    console.log(HUCNumber);
    $.get("https://fwsmapper.wim.usgs.gov/downloadLoggingService/downloadLog.asmx/Log?huc=" + HUCNumber + ",NWIV2", function (data) {
        //console.log(data);
    });
}

//set extent for 'Zoom to region' panel
function zoomToFunction() {
    var select = $('#zoomToSelect').val();
    var newExtent;
    switch(select) {
        case "usa":
            newExtent = new esri.geometry.Extent(-16339179.166, 97839.396, -3541786.143, 9059928.089, map.spatialReference);
            break;
        case "ak":
            newExtent = new esri.geometry.Extent(-20039665.83, 6649626.025, -10625354.198, 13097026.174, map.spatialReference);
            break;
        case "hi":
            newExtent = new esri.geometry.Extent(-19616798.939, 1673053.675, -16468815.698, 3390135.078, map.spatialReference);
            break;
        case "pr":
            newExtent = new esri.geometry.Extent(-7880962.696, 1764778.109, -6836527.142, 2317570.698, map.spatialReference);
            break;
        case "pti":
            newExtent = new esri.geometry.Extent(15728907.491, 1378312.494, 16984921.185, 2261313.045, map.spatialReference);
            break;
    }
    map.setExtent(newExtent);
}


$(document).ready(function () {
    //7 lines below are handler for the legend buttons. to be removed if we stick with the in-map legend toggle
    //$('#legendButtonNavBar, #legendButtonSidebar').on('click', function () {
    //    $('#legend').toggle();
    //    //return false;
    //});
    //$('#legendClose').on('click', function () {
    //    $('#legend').hide();
    //});

});