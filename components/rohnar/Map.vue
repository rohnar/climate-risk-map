<script setup>
const currentZoom = ref(null)
//used to check if markers need to be reloaded
let closestDist = null;
let closestPair = null;
const { computedSubset } = useFilteredData()
const mapBoundaries = useState('mapBoundaries')
const mapFocus = useState('mapFocus')
const markers = new Map();

import "leaflet/dist/leaflet.css";
import L from "leaflet";

var map;
var layer;

function loadMarkers() {
    if (map) {
        markers.forEach((x)=>{
            x.marker.remove()
            markers.delete(map.latLngToLayerPoint(x.marker.getLatLng()))
        })
        let distRef = null;
        let pointRef = null;
        let count = {low:0, med:0, high:0, total: 0};
        let risk = 0;
        let overallCount = 0;
        let randomLat = 0.0001
        let randomLong = 0.0001
        computedSubset.value.forEach(el=>{
            let markerClass
            //take advantage of the fact that the points are geographically sorted...
            //only add markers for points with far distance when compared to the last
            // if ()
            let latlng = L.latLng(el.Lat, el.Long);
            if (mapBoundaries.value.contains(latlng)) {
                let adjLatlng = null;
                let point = map.latLngToLayerPoint(latlng)
                let dist;
                if (pointRef) {
                    dist = point.distanceTo(pointRef)
                    //to add some variance
                    // if (dist === 0) {
                    //     let randomLat = 0.003
                    //     let randomLong = 0.003
                    //     adjLatlng = [+el.Lat+randomLat, +el.Long+randomLong]
                    //     let newLatLng = L.latLng(adjLatlng[0], adjLatlng[1]);
                    //     point = map.latLngToLayerPoint(newLatLng)
                    //     dist = point.distanceTo(pointRef)
                    //     if (overallCount%2 ===0) {
                    //         randomLat+=0.001
                    //     } else {
                    //         randomLong+=0.001
                    //     }
                    // }
                }
                
                if (!pointRef || dist >= 30) {
                    if (pointRef && (!closestDist || dist < closestDist) ) {
                        closestDist = dist
                        closestPair = [map.layerPointToLatLng(pointRef),latlng]
                    }
                    if (+el['Risk Rating'] < 0.33) {
                        markerClass='single-marker green'
                        count.low=1
                    } else if (+el['Risk Rating'] < 0.66) {
                        markerClass='single-marker yellow'
                        count.med=1
    
                    } else {
                        markerClass='single-marker red'
                        count.high=1
    
                    }
                    let myIcon = L.divIcon({html: 
                        `<div>
                            <i class="fa fa-map-pin"></i>
                        </div>`, 
                        className: markerClass});
                    
                    let marker = L.marker(adjLatlng ? adjLatlng : [+el.Lat, +el.Long],{
                      icon: myIcon,
                    })
                    .bindTooltip(el['Asset Name']+': '+el['Risk Rating']).addTo(map)
                    markers.set(point.toString(), {marker: marker})
                    pointRef = point
                    count.total = 1
                } else if (pointRef && markers.size>0) {
                    if (el['Risk Rating'] < 0.33) {
                        markerClass='marker green'
                        count.low++
                    } else if (el['Risk Rating'] < 0.66) {
                        markerClass='marker yellow'
                        count.med++
    
                    } else {
                        markerClass='marker red'
                        count.high++
    
                    }
                    count.total++
                    let myIcon = L.divIcon({html: 
                        `<div>
                            <i>${count.total}</i>
                        </div>`, 
                        className: markerClass});
                    markers.get(pointRef.toString()).marker.setIcon(myIcon)
                }
            }
            overallCount++
        })
    }
}

onMounted(()=>{
    map = L.map("map",{preferCanvas: true}).setView([45, -76], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    mapBoundaries.value = map.getBounds()
    map.on('moveend', function updateBounds() {
        mapBoundaries.value = map.getBounds()
    });
    map.on('click',(e)=>{

    })
    map.on('zoomend', (e)=>{
        if (closestPair) {
            let p1 = map.latLngToLayerPoint(closestPair[0])
            let p2 = map.latLngToLayerPoint(closestPair[1])
            if (p2.distanceTo(p1) < 30 || p2.distanceTo(p1) > 50) {
                loadMarkers()
            }
        }
    })
    loadMarkers()
})



watch(computedSubset, (newValue, oldValue) => {
   loadMarkers()
});

watch(currentZoom, (newValue, oldValue)=>{
})

watch(mapBoundaries, (newValue, oldValue)=>{
    loadMarkers()
})
watch(mapFocus, (newValue, oldValue)=>{
    map.flyTo(L.latLng(newValue[0],newValue[1]))
})

</script>

<template>
    <div id="map">
        <div class="map-tools">
            <slot name="top"></slot>
            
        </div>
        <div class="map-tools-bottom">
            <slot name="bottom"></slot>
        </div>
    </div>
</template>
<style>
#map .single-marker {
    top: -30px;
    font-size: 30px;
}
#map .single-marker.green {
    color: green;
}
#map .single-marker.yellow {
    color: rgb(213, 131, 0);
}
#map .single-marker.red {
    color: red;
}
#map .marker {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding: 1rem;
    border-radius: 20px;
    color: white;
    border: white solid 2px;
    box-shadow: black 2px 2px 3px;
}
#map .marker.green {
    background-color: green;
}
#map .marker.yellow {
    background-color: rgb(213, 131, 0);
}
#map .marker.red {
    background-color: red;
}
</style>
<style scoped>
#map {
    height: 350px;
    z-index: 0;
    /* width: 98%;
    margin: auto; */
}
.map-tools {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 0 0 0 15px;
    border: white solid 2px;
    box-shadow: rgba(3, 105, 161) -2px 2px 3px;
    width: 50%;
    padding: 0 30px 20px 30px;
    background-color: #aad3dfa0;
    z-index: 410;
}
.map-tools-bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    /* border-radius: 0 0 0 15px; */
    /* border: white solid 2px; */
    /* box-shadow: rgba(3, 105, 161) -2px 2px 3px; */
    width: 100%;
    /* padding: 0 30px 20px 30px; */
    /* background-color: #aad3dfa0; */
    z-index: 410;
}
</style>
