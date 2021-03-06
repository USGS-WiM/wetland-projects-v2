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

    allLayers = [
        {
            'groupHeading': 'ESRI dynamic map services',
            'showGroupHeading': false,
            'includeInLayerList': true,
            'layers': {
                'Recent' : {
                    'url': 'https://fwsprimary.wim.usgs.gov/server/rest/services/WetlandsProjects/WetlandsProjects/MapServer',
                    'visibleLayers': [1],
                    'options': {
                        'id': 'recent',
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
                'Active' : {
                    'url': 'https://fwsprimary.wim.usgs.gov/server/rest/services/WetlandsProjects/WetlandsProjects/MapServer',
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
                'Image' : {
                    'url': 'https://fwsprimary.wim.usgs.gov/server/rest/services/Data_Source/MapServer',
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
                        'includeLegend' : true
                    }
                },
            } 
        }
        
    ];

});
