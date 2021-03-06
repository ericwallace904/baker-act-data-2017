var layer = new L.StamenTileLayer('toner-lite');

var map = new L.Map('map').setView([28.542,-81.681],6);
map.addLayer(layer);

function setColor(total) {
	var overdose_num = parseInt (overdoses);
	var getColor = chroma.scale(['#efedf5', '#756bb1']).domain([0,400]);
	return getColor(overdose_num);
}


function setStyle(feature) {
	return {
		opacity: 1,
		weight: 2,
		color: "#FFF",
		fillColor: setColor(feature.properties.OverdoseZip2016),
		fillOpacity: 0.8
	}
}

var geojson;

function highlightFeature(e) {
	var layer = e.target;
	county_info.update(layer.feature.properties);
}

function resetHighlight(e) {
	// geojson.resetStyle(e.target);
	county_info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature,layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

var county_info = L.control();

county_info.onAdd = function (map) {
	this._div = L.DomUtil.create('div','county_info');
	this.update();
	return this._div;
};

county_info.update = function (props) {
	this._div.innerHTML = '<h4>Overdoses in 2016:</h4>' + (props ? 
		'<b>ZIP Code ' + props.GEOID10 + '</b><br />' + props.OverdoseZip2016 + ' overdoses' : 'Hover over a ZIP code');
};

county_info.addTo(map);
	
L.geoJson(fl_counties, {
	style: setStyle,
	onEachFeature: onEachFeature
}).addTo(map);

for (var num = 0; num < hospitals.length; num++) {
	var hospital = hospitals[num];
	var hospital_lat = hospital["Latitude"];
	var hospital_long = hospital["Longitude"];
	var hospital_name = hospital["Hospital"];
	var hospital_address = hospital["HospitalStreetAddress"];
	var hospital_city = hospital["HospitalCity"];
	var hospital_ods = hospital["NumberOverdoses"];
	
	var marker = L.marker([hospital_lat,hospital_long]).addTo(map);
	
	var popup_html = '<h3>' + hospital_name + '</h3>';
	popup_html += '<div>' + hospital_address + ', ' + hospital_city + '</div>';
	popup_html += '<div><strong>Overdoses in 2016:</strong> ' + hospital_ods + '</div>';
	
	marker.bindPopup(popup_html);
}