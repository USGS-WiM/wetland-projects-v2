/**
 * Created by bdraper on 4/27/2015.
 */
var allLayers;
var renderer;

require([
    'esri/InfoTemplate',
    'esri/renderers/UniqueValueRenderer',
    'esri/symbols/PictureMarkerSymbol',
    'dojo/domReady!'
], function(
    InfoTemplate,
    UniqueValueRenderer,
    PictureMarkerSymbol
) {

    var defaultSymbol = new PictureMarkerSymbol("./images/grn-pushpin.png", 45, 45);

    renderer = new UniqueValueRenderer(defaultSymbol);

    var template = new InfoTemplate("${NAME}",
        "Type: ${TYPE}<br/>" +
        "Ramsar: <a id='ramsarLink' target='_blank' href='${HYPERLINK_2}'>click here</a><br/>" +
        "Location Website: <a target='_blank' href='${HYPERLINK}'>click here</a><br/>" +
        "Water Summary Report: <a target='_blank' href='${WATER_SUMMARY_REPORT}'>click here</a><br/>" +
        "Wildlife Action Plan: <a target='_blank' href='${STATE_ACTION_PLAN}'>click here</a><br/>"
    )

    allLayers = [
        {
            'groupHeading': 'ESRI dynamic map services',
            'showGroupHeading': false,
            'includeInLayerList': true,
            'layers': {
                'Active' : {
                    'url': 'https://fws.wim.usgs.gov/arcgis/rest/services/WetlandsProjects/Recent_and_Current_Projects/MapServer',
                    'visibleLayers': [0],
                    'options': {
                        'id': 'active',
                        'opacity': 0.75,
                        'visible': true
                    },
                    'wimOptions': {
                        'type': 'layer',
                        'layerType': 'agisDynamic',
                        'includeInLayerList': true,
                        'zoomScale': 144448,
                        'hasOpacitySlider': true,
                        'includeLegend' : true,
                    }
                },
                'Wetlands Status' : {
                    'url': 'https://fwsmapper.wim.usgs.gov/ArcGIS/rest/services/Wetlands_Status/MapServer',
                    'options': {
                        'id': 'wetlandsStatus',
                        'layers': [1],
                        'visible': true,
                        'maxScale': 285000,
                        'opacity': 0.6
                    },
                    'wimOptions': {
                        'type': 'layer',
                        'layerType': 'agisDynamic',
                        'includeInLayerList': false,
                        'includeLegend' : true,
                        'layerDefinitions': {0: "STATUS = 'Digital' OR STATUS = 'No_Data'"}
                    }
                },
                'Wetlands ' : {
                    'url': 'https://fwsmapper.wim.usgs.gov/arcgis/rest/services/Wetlands_Raster/ImageServer',
                    'options': {
                        'id': 'wetlandsRaster',
                        'visible': true,
                        'maxScale': 285000,
                        'opacity': 0.6
                    },
                    'wimOptions': {
                        'type': 'layer',
                        'layerType': 'agisDynamic',
                        'includeInLayerList': false,
                        'includeLegend' : true
                    }
                },
                'Recent' : {
                    'url': 'https://fws.wim.usgs.gov/arcgis/rest/services/WetlandsProjects/Recent_and_Current_Projects/MapServer',
                    'visible layers': [2],
                    'options': {
                        'id': 'riparian',
                        'opacity': 0.75,
                        'visible': false
                    },
                    'wimOptions': {
                        'type': 'layer',
                        'layerType': 'agisDynamic',
                        'includeInLayerList': true,
                        'zoomScale': 144448,
                        'hasOpacitySlider': true,
                        'includeLegend' : true
                    }
                },
                'Image' : {
                    'url': 'https://fws.wim.usgs.gov/ArcGIS/rest/services/Data_Source/MapServer',
                    'visibleLayers': [3],
                    'options': {
                        'id': 'riparianStatus',
                        'visible': false,
                        'opacity': 0.6
                    },
                    'wimOptions': {
                        'type': 'layer',
                        'layerType': 'agisDynamic',
                        'includeInLayerList': true,
                        'hasOpacitySlider': true,
                        'moreinfo': 'http://www.fws.gov/wetlands/Other/Riparian-Product-Summary.html',
                        'includeLegend' : true
                    }
                },
            } 
        }
        
    ];

});