function addCommas(e){e+="";for(var a=e.split("."),i=a[0],t=a.length>1?"."+a[1]:"",r=/(\d+)(\d{3})/;r.test(i);)i=i.replace(r,"$1,$2");return i+t}function camelize(e){return e.replace(/(?:^\w|[A-Z]|\b\w)/g,function(e,a){return 0===a?e.toLowerCase():e.toUpperCase()}).replace(/\s+/g,"")}function hucLinkListener(e){console.log(e),$.get("https://fwsmapper.wim.usgs.gov/downloadLoggingService/downloadLog.asmx/Log?huc="+e+",NWIV2",function(e){})}function showHideInnerProj(e){"none"==$("#innerProjDetail_"+e).css("display")?($("#innerProjDetail_"+e).css("display","block"),$("#openProjInfo_"+e).html("Hide")):($("#innerProjDetail_"+e).css("display","none"),$("#openProjInfo_"+e).html("Show"))}function zoomToFunction(){var e,a=$("#zoomToSelect").val();switch(a){case"usa":e=new esri.geometry.Extent(-16339179.166,97839.396,-3541786.143,9059928.089,map.spatialReference);break;case"ak":e=new esri.geometry.Extent(-20039665.83,6649626.025,-12798598.065,12984229.813,map.spatialReference);break;case"hi":e=new esri.geometry.Extent(-19616798.939,1673053.675,-16468815.698,3390135.078,map.spatialReference);break;case"pr":e=new esri.geometry.Extent(-7880962.696,1764778.109,-6836527.142,2317570.698,map.spatialReference);break;case"pti":e=new esri.geometry.Extent(15728907.491,1378312.494,16984921.185,2261313.045,map.spatialReference)}map.setExtent(e)}var allLayers,renderer;require(["esri/InfoTemplate","esri/renderers/UniqueValueRenderer","esri/symbols/PictureMarkerSymbol","dojo/domReady!"],function(e,a,i){var t=new i("./images/grn-pushpin.png",45,45);renderer=new a(t),allLayers=[{groupHeading:"ESRI dynamic map services",showGroupHeading:!1,includeInLayerList:!0,layers:{Recent:{url:"https://gis.usgs.gov/sciencebase2/rest/services/Catalog/5a9476d6e4b069906068fc3b/MapServer",visibleLayers:[1],options:{id:"recent",opacity:.75,visible:!0},wimOptions:{type:"layer",layerType:"agisDynamic",includeInLayerList:!0,zoomScale:144448,hasOpacitySlider:!0,includeLegend:!0}},Active:{url:"https://gis.usgs.gov/sciencebase2/rest/services/Catalog/5a9476d6e4b069906068fc3b/MapServer",visibleLayers:[0],options:{id:"active",opacity:.75,visible:!0},wimOptions:{type:"layer",layerType:"agisDynamic",includeInLayerList:!0,zoomScale:144448,hasOpacitySlider:!0,includeLegend:!0}},Image:{url:"https://fwsprimary.wim.usgs.gov/server/rest/services/Data_Source/MapServer",visibleLayers:[3],options:{id:"riparianStatus",visible:!1,opacity:.6},wimOptions:{type:"layer",layerType:"agisDynamic",includeInLayerList:!0,hasOpacitySlider:!0,includeLegend:!0}}}}]});var map,allLayers,maxLegendHeight,maxLegendDivHeight,printCount=0,legendLayers=[],measurement,identifyTask,identifyParams,aoiClicked=!1;require(["esri/map","esri/arcgis/utils","esri/config","esri/dijit/Geocoder","esri/dijit/HomeButton","esri/dijit/Legend","esri/dijit/LocateButton","esri/dijit/Measurement","esri/dijit/PopupTemplate","esri/graphic","esri/geometry/Extent","esri/geometry/Multipoint","esri/geometry/Point","esri/layers/ArcGISTiledMapServiceLayer","esri/renderers/UniqueValueRenderer","esri/SpatialReference","esri/symbols/PictureMarkerSymbol","esri/tasks/GeometryService","esri/tasks/IdentifyParameters","esri/tasks/IdentifyTask","esri/tasks/LegendLayer","esri/tasks/PrintTask","esri/tasks/PrintParameters","esri/tasks/PrintTemplate","esri/geometry/webMercatorUtils","esri/urlUtils","dojo/dom","dojo/dom-class","dojo/dnd/Moveable","dojo/query","dojo/on","dojo/domReady!"],function(e,a,i,t,r,o,n,s,l,c,p,d,m,g,y,u,f,h,v,b,w,L,S,x,P,k,I,T,j,M,D){function E(){$("#printModal").modal("show")}function C(e,a,i,t,r){return new f({angle:0,xoffset:a,yoffset:i,type:"esriPMS",url:e,contentType:"image/png",width:t,height:r})}function R(e,a){var i;document.getElementById&&(i=document.getElementById(e))&&i.style&&(i.style.cursor=a)}function G(){z();var e=Y.find();e.then(function(e){O(e)})}function H(e){N();var a=e.graphic?e.graphic:e.result.feature;a.setSymbol(q)}function N(){map.infoWindow.hide(),map.graphics.clear()}function O(e){if(e=e.results,e.length>0){N();if(null!=e[0].extent&&"NaN"!=e[0].extent.xmax&&e[0].extent.xmin!=e[0].extent.xmax)map.setExtent(e[0].extent,!0),$(".geosearchWarning").hide(),$("#geosearchModal").modal("hide");else if(null!=e[0].feature.geometry&&"NaN"!=e[0].feature.geometry.x){var a=new m(e[0].feature.geometry);map.centerAndZoom(a,17),$(".geosearchWarning").hide(),$("#geosearchModal").modal("hide")}else $(".geosearchWarning").show()}else $(".geosearchWarning").show()}function z(){Y.activeGeocoder.searchExtent=null}i.defaults.io.corsEnabledServers.push("fwsmapper.wim.usgs.gov"),esri.config.defaults.io.proxyUrl="https://fwsmapper.wim.usgs.gov/serviceProxy/proxy.ashx",i.defaults.geometryService=new h("https://fwsmapper.wim.usgs.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer"),map=new e("mapDiv",{basemap:"topo",extent:new p(-16339179.166,97839.396,-3541786.143,9059928.089,new u({wkid:3857}))});var W=new r({map:map,extent:new p(-16339179.166,97839.396,-3541786.143,9059928.089,new u({wkid:3857})),home:function(){$("#zoomToSelect").val("usa"),map.setExtent(this.extent)}},"homeButton");W.startup();var _=new n({map:map,scale:4514},"locateButton");_.startup(),$(window).resize(function(){$("#legendCollapse").hasClass("in")?(maxLegendHeight=.9*$("#mapDiv").height(),$("#legendElement").css("height",maxLegendHeight),$("#legendElement").css("max-height",maxLegendHeight),maxLegendDivHeight=$("#legendElement").height()-parseInt($("#legendHeading").css("height").replace("px","")),$("#legendDiv").css("max-height",maxLegendDivHeight)):$("#legendElement").css("height","initial")}),$("#printNavButton").click(function(){E()}),$("#printExecuteButton").click(function(e){e.preventDefault(),$(this).button("loading"),printMap()}),D(map,"load",function(){var e=map.getScale().toFixed(0);$("#scale")[0].innerHTML=addCommas(e);var a=P.webMercatorToGeographic(map.extent.getCenter());$("#latitude").html(a.y.toFixed(3)),$("#longitude").html(a.x.toFixed(3))}),D(map,"zoom-end",function(){var e=map.getScale().toFixed(0);$("#scale")[0].innerHTML=addCommas(e)}),D(map,"mouse-move",function(e){if($("#mapCenterLabel").css("display","none"),null!=e.mapPoint){var a=P.webMercatorToGeographic(e.mapPoint);$("#latitude").html(a.y.toFixed(3)),$("#longitude").html(a.x.toFixed(3))}}),D(map,"pan-end",function(){$("#mapCenterLabel").css("display","inline");var e=P.webMercatorToGeographic(map.extent.getCenter());$("#latitude").html(e.y.toFixed(3)),$("#longitude").html(e.x.toFixed(3))});var A=new g("https://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer"),B=new g("https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer");D(I.byId("btnNatlMap"),"click",function(){map.addLayer(B,1),map.removeLayer(A)}),D(I.byId("btnStreets"),"click",function(){map.setBasemap("streets"),map.removeLayer(B),map.removeLayer(A)}),D(I.byId("btnSatellite"),"click",function(){map.setBasemap("satellite"),map.removeLayer(B),map.removeLayer(A)}),D(I.byId("btnHybrid"),"click",function(){map.setBasemap("hybrid"),map.removeLayer(B),map.removeLayer(A)}),D(I.byId("btnTerrain"),"click",function(){map.setBasemap("terrain"),map.removeLayer(B),map.removeLayer(A)}),D(I.byId("btnGray"),"click",function(){map.setBasemap("gray"),map.removeLayer(B),map.removeLayer(A)}),D(I.byId("btnNatGeo"),"click",function(){map.setBasemap("national-geographic"),map.removeLayer(B),map.removeLayer(A)}),D(I.byId("btnOSM"),"click",function(){map.setBasemap("osm"),map.removeLayer(B),map.removeLayer(A)}),D(I.byId("btnTopo"),"click",function(){map.setBasemap("topo"),map.removeLayer(B),map.removeLayer(A)}),D(I.byId("btnUsgsTopo"),"click",function(){map.addLayer(A,1),map.removeLayer(B)}),identifyParams=new v,identifyParams.tolerance=0,identifyParams.returnGeometry=!0,identifyParams.layerOption=v.LAYER_OPTION_ALL,identifyParams.width=map.width,identifyParams.height=map.height,identifyTask=new b(allLayers[0].layers.Active.url);var F=M(".title",map.infoWindow.domNode)[0],U=new j(map.infoWindow.domNode,{handle:F});D(U,"FirstMove",function(){var e=M(".outerPointer",map.infoWindow.domNode)[0];T.add(e,"hidden");var e=M(".pointer",map.infoWindow.domNode)[0];T.add(e,"hidden")}.bind(this)),D(map,"click",function(e){map.graphics.clear();var a=[];1==map.getLayer("active").visible&&a.push(0),1==map.getLayer("recent").visible&&a.push(1),identifyParams.geometry=e.mapPoint,identifyParams.mapExtent=map.extent,identifyParams.layerOption=v.LAYER_OPTION_ALL,identifyParams.returnGeometry=!0,identifyParams.tolerance=0,identifyParams.width=map.width,identifyParams.height=map.height,identifyParams.layerIds=a,R("mainDiv","wait"),map.setCursor("wait"),identifyTask=new b(allLayers[0].layers.Recent.url);var i=identifyTask.execute(identifyParams);i.addCallback(function(i){function t(e){var a=e.currentTarget.id.replace(/\D/g,""),i=P.webMercatorToGeographic(m[a]),t=i.getExtent();map.setExtent(t,!0)}if(i.length>0&&a.length>0){for(var r,o,n=i[0].feature,s=0;s<i.length;s++)0==i[s].layerId?(n=i[s].feature,r=n.attributes):1==i[s].layerId&&(o=i[s].feature.attributes);var l=new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,new dojo.Color([255,255,0]),2),new dojo.Color([98,194,204,0]));n.geometry.spatialReference=map.spatialReference;var c=n;c.setSymbol(l),map.graphics.add(c);var p="";if(p=void 0==o||"None"==o.SUPPMAPINFO?" NONE":" <a target='_blank' href='"+o.SUPPMAPINFO+"'>click here</a>",i.length>1){var d="",m=[],g=[];for(s in i){m.push(i[s].feature.geometry),g.push(i[s].feature);var y=i[s].feature.attributes;d+="<b>Project ID:</b> "+y.PROJECT_ID+" <span onclick='showHideInnerProj("+s+")'><a id='openProjInfo_"+s+"' href='javascript:void(0)'> Show</a></span><br/><div id='innerProjDetail_"+s+"'style='display: none; background-color: rgba(0,0,0,0.04)'> <b>Acres:</b> "+addCommas(Math.ceil(y.ACRES))+"<br/><b>Layer Name:</b> "+i[s].layerName+"<br/>","Recent"==i[s].layerName&&(d+="<b>Image Year:</b> "+y.IMAGE_YR+"<br/><b>Project Metadata:</b>"+p),d+="<br/><a id='zoomToProjLoop"+s+"' href='javascript:void(0)'>Zoom to Project</a></div>";var u=new esri.InfoTemplate("Wetland Mapping Project",d+"<br/>")}n.setInfoTemplate(u),map.infoWindow.setFeatures([n]),map.infoWindow.show(e.mapPoint);for(s in i){var g=i[s].feature;$("#zoomToProjLoop"+s).click(t)}m.spatialReference=map.spatialReference;var c=g;c.setSymbol(l),map.graphics.add(c)}else{if("Recent"==i[0].layerName)var u=new esri.InfoTemplate("Wetland Mapping Project","<b>Project ID:</b> "+o.PROJECT_ID+"<br/><b>Acres:</b> "+addCommas(Math.ceil(o.ACRES))+"<br/><b>Image Year:</b> "+o.IMAGE_YR+"<br/><b>Project Metadata:</b>"+p+"<br/><p><a id='zoomToProj' href='javascript:void(0)'>Zoom to Project</a></p>");else var u=new esri.InfoTemplate("Wetland Mapping Project","<b>Project ID:</b> "+r.PROJECT_ID+"<br/><b>Acres:</b> "+addCommas(Math.ceil(r.ACRES))+"<br/><p><a id='zoomToProj' href='javascript:void(0)'>Zoom to Project</a></p>");n.setInfoTemplate(u),map.infoWindow.setFeatures([n]),map.infoWindow.show(e.mapPoint)}dojo.connect(map.infoWindow,"onHide",function(e){map.graphics.clear()});R("mainDiv","default"),map.setCursor("default"),$("#zoomToProj").click(function(e){var a=P.webMercatorToGeographic(n.geometry),i=a.getExtent();map.setExtent(i,!0)})}else R("mainDiv","default"),map.setCursor("default"),map.infoWindow.hide()})});var q=C("../images/purple-pin.png",0,12,13,24);map.on("load",function(){map.infoWindow.set("highlight",!1),map.infoWindow.set("titleInBody",!1)}),$(document).ready(function(){function e(){$("#geosearchModal").modal("show")}function a(){$("#aboutModal").modal("show")}$("#geosearchNav").click(function(){e(),D(I.byId("geosearch_input"),"change",function(){$(".geosearchWarning").hide()})}),$("#aboutNav").click(function(){a()}),$("#html").niceScroll(),$("#sidebar").niceScroll(),$("#sidebar").scroll(function(){$("#sidebar").getNiceScroll().resize()}),maxLegendHeight=.9*$("#mapDiv").height(),$("#legendElement").css("max-height",maxLegendHeight),maxLegendDivHeight=maxLegendHeight-parseInt($("#legendHeading").css("height").replace("px","")),$("#legendDiv").css("max-height",maxLegendDivHeight),$("#legendCollapse").on("shown.bs.collapse",function(){if(0==legendDiv.innerHTML.length){var e=new o({map:map,layerInfos:legendLayers},"legendDiv");e.startup(),$("#legendDiv").niceScroll()}}),$("#legendCollapse").on("hide.bs.collapse",function(){$("#legendElement").css("height","initial")})});var Y=new t({value:"",maxLocations:25,autoComplete:!0,arcgisGeocoder:!0,autoNavigate:!1,map:map},"geosearch");Y.startup(),Y.on("select",H),Y.on("findResults",O),Y.on("clear",N),D(Y.inputNode,"keydown",function(e){13==e.keyCode&&z()}),D(I.byId("btnGeosearch"),"click",G),require(["esri/InfoTemplate","esri/tasks/locator","esri/tasks/query","esri/tasks/QueryTask","esri/graphicsUtils","esri/geometry/Point","esri/geometry/Extent","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ArcGISImageServiceLayer","esri/layers/FeatureLayer","esri/layers/WMSLayer","esri/layers/WMSLayerInfo","esri/tasks/GeometryService","dijit/form/CheckBox","dijit/form/RadioButton","dojo/query","dojo/dom","dojo/dom-class","dojo/dom-construct","dojo/dom-style","dojo/on"],function(e,a,i,t,r,n,s,l,c,p,d,m,g,y,u,f,h,v,b,w,L){function S(e,a,i,t,r,o){if(map.addLayer(i),x.push(["",camelize(t),i]),i.visible&&void 0==o.moreinfo)var n=$('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"><button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;'+t+'<span id="info'+camelize(t)+'"  title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span><span id="opacity'+camelize(t)+'" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span></button></div>');else if(!i.visible&&void 0==o.moreinfo)var n=$('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"><button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square-o"></i>&nbsp;&nbsp;'+t+' Year<span id="info'+camelize(t)+'"  title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span><span id="opacity'+camelize(t)+'" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span></button></div>');if(n.click(function(e){$(this).find("i.glyphspan").toggleClass("fa-check-square-o fa-square-o"),$(this).find("button").button("toggle"),i.visible?i.setVisibility(!1):i.setVisibility(!0),o.otherLayersToggled&&$.each(o.otherLayersToggled,function(e,a){var t=map.getLayer(a);t.setVisibility(i.visible)})}),void 0!==a){var s=camelize(e);if(!$("#"+s).length){if(a)var l=$('<div id="'+s+'"><div class="alert alert-info" role="alert"><strong>'+e+"</strong></div></div>");else var l=$('<div id="'+s+'"></div>');$("#toggle").append(l)}if($("#"+s).append(n),void 0!==o.moreinfo&&o.moreinfo){var c="#info"+camelize(t),p=$(c);p.click(function(e){window.open(o.moreinfo,"_blank"),e.preventDefault(),e.stopPropagation()})}$("#opacity"+camelize(t)).length>0&&$("#opacity"+camelize(t)).click(function(e){e.preventDefault(),e.stopPropagation(),$(".opacitySlider").remove();var a=map.getLayer(r.id).opacity,i=$('<div class="opacitySlider"><label id="opacityValue">Opacity: '+a+'</label><label class="opacityClose pull-right">X</label><input id="slider" type="range"></div>');$("body").append(i),$("#slider")[0].value=100*a,$(".opacitySlider").css("left",event.clientX-180),$(".opacitySlider").css("top",event.clientY-50),$(".opacitySlider").mouseleave(function(){$(".opacitySlider").remove()}),$(".opacityClose").click(function(){$(".opacitySlider").remove()}),$("#slider").change(function(e){var a=$("#slider")[0].value/100;console.log("o: "+a),$("#opacityValue").html("Opacity: "+a),map.getLayer(r.id).setOpacity(a),o.otherLayersToggled&&$.each(o.otherLayersToggled,function(e,i){var t=map.getLayer(i);t.setOpacity(a)})})}),$("#info"+camelize(t)).click(function(e){e.preventDefault(),e.stopPropagation(),$("#aboutModal").modal("show")})}else if($("#toggle").append(n),void 0!==o.moreinfo&&o.moreinfo){var c="#info"+camelize(t),p=$(c);p.click(function(e){alert(e.currentTarget.id),e.preventDefault(),e.stopPropagation()})}}var x=(new g("https://fwsmapper.wim.usgs.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer"),[]);if($.each(allLayers,function(e,a){console.log("processing: ",a.groupHeading),$.each(a.layers,function(e,i){var t=new l(i.url,i.options);i.visibleLayers&&t.setVisibleLayers(i.visibleLayers),legendLayers.unshift({layer:t,title:e}),S(a.groupHeading,a.showGroupHeading,t,e,i.options,i.wimOptions)})}),$(window).width()>1300){var P=new o({map:map,layerInfos:legendLayers},"legendDiv");P.startup(),$("#legendButton").click(),$("#legendDiv").niceScroll()}})}),$(".close-alert").click(function(){$(this).parent().slideUp(250)}),$(document).ready(function(){});