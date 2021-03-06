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

        esriConfig.defaults.io.corsEnabledServers.push("fwsprimary.wim.usgs.gov");
        // esri.config.defaults.io.proxyUrl = "https://fwsprimary.wim.usgs.gov/arcgis-proxy/proxy.ashx";
        urlUtils.addProxyRule({
            urlPrefix: "fwsprimary.wim.usgs.gov/server/rest/services/WetlandsProjects/",
            proxyUrl: "https://fwsprimary.wim.usgs.gov/arcgis-proxy/proxy.ashx"
        });

        esriConfig.defaults.geometryService = new GeometryService("https://fwsprimary.wim.usgs.gov/server/rest/services/Utilities/Geometry/GeometryServer");

        //deleted commented out addProxyRules

        map = new Map('mapDiv', {
            basemap: 'topo',
            extent: new Extent(-16339179.166, 97839.396, -3541786.143, 9059928.089, new SpatialReference({ wkid: 3857 }))
        });

        var home = new HomeButton({
            map: map,
            extent: new Extent(-16339179.166, 97839.396, -3541786.143, 9059928.089, new SpatialReference({ wkid: 3857 })),
            home: function () {
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


        //displays map scale on map load
        on(map, "load", function () {
            var scale = map.getScale().toFixed(0);
            $('#scale')[0].innerHTML = addCommas(scale);
            var initMapCenter = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
            $('#latitude').html(initMapCenter.y.toFixed(3));
            $('#longitude').html(initMapCenter.x.toFixed(3));
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
        on(dom.byId('btnNatlMap'), 'click', function () {
            map.addLayer(nationalMapBasemap, 1);
            map.removeLayer(usgsTopo);
        });

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

            map.graphics.clear();
            //map.infoWindow.hide();s

            //alert("scale: " + map.getScale() + ", level: " + map.getLevel());
            var visLayers = []
            if (map.getLayer("active").visible == true) {
                visLayers.push(0);
            }
            if (map.getLayer("recent").visible == true) {
                visLayers.push(1);
            }
            identifyParams.geometry = evt.mapPoint;
            identifyParams.mapExtent = map.extent;
            identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
            identifyParams.returnGeometry = true;
            identifyParams.tolerance = 0;
            identifyParams.width = map.width;
            identifyParams.height = map.height;
            identifyParams.layerIds = visLayers;

            //if (map.getLevel() >= 12 && $("#huc-download-alert")[0].scrollHeight == 0) {
            //the deferred variable is set to the parameters defined above and will be used later to build the contents of the infoWindow.
            setCursorByID("mainDiv", "wait");
            map.setCursor("wait");

            identifyTask = new IdentifyTask(allLayers[0].layers["Recent"].url);

            var deferredResult = identifyTask.execute(identifyParams);

            deferredResult.addCallback(function (response) {
                if (response.length > 0 && visLayers.length > 0) {
                    var feature = response[0].feature;
                    var attr;
                    var attrStatus;

                    for (var i = 0; i < response.length; i++) {
                        if (response[i].layerId == 0) {
                            feature = response[i].feature;
                            attr = feature.attributes;
                        } else if (response[i].layerId == 1) {
                            attrStatus = response[i].feature.attributes;
                        }

                    }

                    // Code for adding wetland highlight, use in for loop if we want 'Show' to highlight overlapping projects in turn
                    var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                            new dojo.Color([255, 255, 0]), 2), new dojo.Color([98, 194, 204, 0])
                    );
                    feature.geometry.spatialReference = map.spatialReference;
                    var graphic = feature;
                    graphic.setSymbol(symbol);

                    map.graphics.add(graphic);

                    var projmeta = '';
                    if (attrStatus == undefined || attrStatus.SUPPMAPINFO == 'None') {
                        projmeta = " NONE";
                    } else {
                        projmeta = " <a target='_blank' href='" + attrStatus.SUPPMAPINFO + "'>click here</a>";
                    }

                    //creating info windows, with toggles to show data in sites that are overlapping
                    if (response.length > 1) { 
                        var projID = "";
                        var projGeom = [];
                        var projFeat = [];
                        //for loop runs through overlapping projects, create toggle to show data for each one
                        for (i in response) {
                            projGeom.push(response[i].feature.geometry);
                            projFeat.push(response[i].feature);
                            var projAttr = response[i].feature.attributes;
                            projID += "<b>Project ID:</b> " + projAttr.PROJECT_ID + " " + 
                                "<span onclick='showHideInnerProj(" + i + ")'><a id='openProjInfo_" + i + "' href='javascript:void(0)'> Show</a></span>" + "<br/>" +
                                "<div id='innerProjDetail_" + i + "'style='display: none; background-color: rgba(0,0,0,0.04)'> <b>Acres:</b> " + addCommas(Math.ceil(projAttr.ACRES)) + "<br/>" +
                                "<b>Layer Name:</b> " + response[i].layerName + "<br/>";

                            if (response[i].layerName == "Recent") {
                                projID += "<b>Image Year:</b> " + projAttr.IMAGE_YR + "<br/>" +
                                    "<b>Project Metadata:</b>" + projmeta;
                            }
                            projID += "<br/><a id='zoomToProjLoop" + i + "' href='javascript:void(0)'>Zoom to Project</a></div>";
                            //set up template for pop-up window with overlapping projects, show/hide toggle with project info
                            var template = new esri.InfoTemplate("Wetland Mapping Project",
                                projID + "<br/>");                         
                        };
                        feature.setInfoTemplate(template);
                        map.infoWindow.setFeatures([feature]);
                        map.infoWindow.show(evt.mapPoint);
                        function zoomTo(event) {
                            var index = event.currentTarget.id.replace(/\D/g,'');
                            var convertedGeom = webMercatorUtils.webMercatorToGeographic(projGeom[index]);
                            var featExtent = convertedGeom.getExtent();
                            map.setExtent(featExtent, true);
                        }
                        for (i in response) {
                            var projFeat = response[i].feature
                            $("#zoomToProjLoop" + i).click(zoomTo);
                        };
                        projGeom.spatialReference = map.spatialReference;
                        var graphic = projFeat;
                        graphic.setSymbol(symbol);

                        map.graphics.add(graphic);
                    } else {   // if only one layer clicked
                        if (response[0].layerName == "Recent") {
                            var template = new esri.InfoTemplate("Wetland Mapping Project",
                                "<b>Project ID:</b> " + attrStatus.PROJECT_ID + "<br/>" +
                                "<b>Acres:</b> " + addCommas(Math.ceil(attrStatus.ACRES)) + "<br/>" +
                                "<b>Image Year:</b> " + attrStatus.IMAGE_YR + "<br/>" +
                                "<b>Project Metadata:</b>" + projmeta + "<br/>" +
                                "<p><a id='zoomToProj' href='javascript:void(0)'>Zoom to Project</a></p>");
                        } else {
                            var template = new esri.InfoTemplate("Wetland Mapping Project",
                                "<b>Project ID:</b> " + attr.PROJECT_ID + "<br/>" + 
                                "<b>Acres:</b> " + addCommas(Math.ceil(attr.ACRES)) + "<br/>" +
                                "<p><a id='zoomToProj' href='javascript:void(0)'>Zoom to Project</a></p>");
                        }
                        feature.setInfoTemplate(template);
                        map.infoWindow.setFeatures([feature]);
                        map.infoWindow.show(evt.mapPoint);
                    }

                    var infoWindowClose = dojo.connect(map.infoWindow, "onHide", function (evt) {
                        map.graphics.clear();
                        //dojo.disconnect(map.infoWindow, infoWindowClose);
                    });

                    setCursorByID("mainDiv", "default");
                    map.setCursor("default");

                    $("#zoomToProj").click(function (event) {
                        var convertedGeom = webMercatorUtils.webMercatorToGeographic(feature.geometry);

                        var featExtent = convertedGeom.getExtent();

                        map.setExtent(featExtent, true);
                    });

                } else {
                    setCursorByID("mainDiv", "default");
                    map.setCursor("default");
                    map.infoWindow.hide();
                }
            });
        });

        //deleted commented out code

        // Symbols
        var sym = createPictureSymbol('../images/purple-pin.png', 0, 12, 13, 24);

        function createPictureSymbol(url, xOffset, yOffset, xWidth, yHeight) {
            return new PictureMarkerSymbol(
                {
                    'angle': 0,
                    'xoffset': xOffset, 'yoffset': yOffset, 'type': 'esriPMS',
                    'url': url,
                    'contentType': 'image/png',
                    'width': xWidth, 'height': yHeight
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

                }
            });

            $('#legendCollapse').on('hide.bs.collapse', function () {
                $('#legendElement').css('height', 'initial');
            });

            
        });        

        function geosearch() {
            setSearchExtent();
            var def = geocoder.find();
            def.then(function (res) {
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
        on(dom.byId('btnGeosearch'), 'click', geosearch);

        // Optionally confine search to map extent
        function setSearchExtent() {
            geocoder.activeGeocoder.searchExtent = null;
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
                    //recent/active layers
                    if ((layer.visible && wimOptions.moreinfo == undefined)) {
                        var button = $(
                            '<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons">' +
                            '<button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left">' +
                            '<i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;' + layerName +
                            '<span id="info' + camelize(layerName) + '"  title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span>' +
                            '<span id="opacity' + camelize(layerName) + '" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span>' +
                            '</button>' +
                            '</div>');
                    //image year
                    } else if ((!layer.visible && wimOptions.moreinfo == undefined)) {
                        var button = $(
                            '<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons">' +
                            '<button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left">' +
                            '<i class="glyphspan fa fa-square-o"></i>&nbsp;&nbsp;' + layerName + ' Year' +
                            '<span id="info' + camelize(layerName) + '"  title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span>' +
                            '<span id="opacity' + camelize(layerName) + '" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span>' +
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
                        
                        //open 'About' modal without toggling layers
                        $("#info"+camelize(layerName)).click(function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            $('#aboutModal').modal('show');
                            $('#aboutTab').tab('show');
                        });
                        
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
                //legend default open on larger screens
                if ( $(window).width() > 1300) {
                    var legend = new Legend({
                        map: map,
                        layerInfos: legendLayers
                    }, "legendDiv");
                    legend.startup();
                    $('#legendButton').click();
    
                    $("#legendDiv").niceScroll();
                }

                

            });//end of require statement containing legend building code

    });

/*function stateSelected() {
    var select = $('#stateSelect')[0];
    if (select.selectedIndex > 0) {
        var selectedVal = select.options[select.selectedIndex].value;
        var selectedState = select.options[select.selectedIndex].label;
        $('#downloadState').html("Download <a target='_blank' href='http://www.fws.gov/wetlands/Downloads/State/" + selectedVal + "_wetlands.zip'>Geodatabase</a> and <a target='_blank' href='http://www.fws.gov/wetlands/Downloads/State/" + selectedVal + "_shapefile_wetlands.zip'>Shapefile</a> data for <b>" + selectedState + "</b>");
    } else {
        $('#downloadState').html("");
    }
}*/

$(".close-alert").click(function () {
    $(this).parent().slideUp(250);
});

function hucLinkListener(HUCNumber) {
    console.log(HUCNumber);
    $.get("https://fwsmapper.wim.usgs.gov/downloadLoggingService/downloadLog.asmx/Log?huc=" + HUCNumber + ",NWIV2", function (data) {
        //console.log(data);
    });
}

//toggle project info in info Window for overlapping projects
function showHideInnerProj(i) {
    if ($("#innerProjDetail_" + i).css("display") == 'none') {
        $("#innerProjDetail_" + i).css("display", 'block');
        $("#openProjInfo_" + i).html("Hide");
    } else {
        $("#innerProjDetail_" + i).css("display", 'none');
        $("#openProjInfo_" + i).html("Show");
    };

}


//set extent for 'Zoom to region' panel
function zoomToFunction() {
    var select = $('#zoomToSelect').val();
    var newExtent;
    switch (select) {
        case "usa":
            newExtent = new esri.geometry.Extent(-16339179.166, 97839.396, -3541786.143, 9059928.089, map.spatialReference);
            break;
        case "ak":
            newExtent = new esri.geometry.Extent(-20039665.83, 6649626.025, -12798598.065, 12984229.813, map.spatialReference);
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

});
