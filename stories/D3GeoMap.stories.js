import React from 'react';
import { Map, MapShapeLayer, MapPointLayer } from '../src/components/D3GeoMap'

import { scaleSequential, scaleLinear } from 'd3-scale'
import { interpolatePurples } from 'd3-scale-chromatic'

import {
    convertFlatDataToGeojson
  } from '../src/logic/logic.js'

import mtCounties from '../src/data/mt-counties-geojson.json'
import mtCities from '../src/data/mt-cities-with-centroids.json'

export default {
    title: 'D3GeoMap',
    component: Map,
  }

export const BasicMapWithTowns = () => { 
    return <Map>
        <MapShapeLayer shapeFeatures={mtCounties.features} />
        <MapPointLayer pointFeatures={convertFlatDataToGeojson(mtCities).features} />
    </Map>
}

// colored by county acreage
// For info on D3 color scales, see https://github.com/d3/d3-scale-chromatic
const colorScale = scaleSequential(interpolatePurples)
    .domain([0,5000000])
export const ChoroplethMapCountyAcreage = () => { 
    return <Map>
        <MapShapeLayer shapeFeatures={mtCounties.features} 
            featureStyler={d => ({
                fill: colorScale(d.acres)
            })}
        />
    </Map>
}

const sizeScale = scaleLinear()
    .domain([0, 20])
    .range([0, 30])
const sizeTownsByNumberOfZips = (d) => {
    return <circle cx={0} cy={0} r={sizeScale(d.properties.zip_codes.length)}
        onClick={e => console.log(d.city, d.zip_codes)}
        fill='red'
        fillOpacity={0.6}
        stroke='red'
        strokeOpacity={1}
    />
}
export const TownsByNumberOfZips = () => { 
    return <Map>
        <MapShapeLayer shapeFeatures={mtCounties.features} />
        <MapPointLayer pointFeatures={convertFlatDataToGeojson(mtCities).features} markerGenerator={sizeTownsByNumberOfZips}/>
    </Map>
}
