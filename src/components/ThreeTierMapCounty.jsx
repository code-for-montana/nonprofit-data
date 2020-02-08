import React from 'react';

import { scaleRadial } from 'd3-scale'

import { Map, MapShapeLayer, MapPointLayer } from './D3GeoMap'

import {
    getCitiesInCountyAsGeoJson,
    mergeInNonprofitsByCity
} from '../logic/logic.js'

const highlightCountyStyle = d => ({
    fill: '#888',
    stroke: '#222',
    strokeWidth: 1.5,
})
const rScaleCounty = scaleRadial().domain([0,200]).range([0,40])
const markNumberOfNonprofitsCounty = (d) => {
    if (d.properties.nonprofits.length === 0) return <g></g>
    return <g>
        <circle cx={0} cy={0}
            // onClick={e => console.log(d.properties)}
            fill="#377eb8"
            fillOpacity={0.8}
            stroke="#377eb8"
            strokeOpacity={1}
            r={rScaleCounty(d.properties.nonprofits.length)}
            cursor='pointer'
        />
        <text
            textAnchor="middle"
            dy="-0.25em"
            fontSize={14}
            // fontWeight="bold"
            fill="#fff"
            pointerEvents='none'
        >
            {d.properties.nonprofits.length}
        </text>
    </g>
}

const CountyTierMap = (props) => {
    const {
        nonprofits,
        county,
        counties,
        cities,
        zoomToCounty,
        zoomToCity,
    } = props
    
    // Get Geojson structured object with just focus county
    // Lets us tell map to zoom to that county
    const currentCountyGeojson = {
            type: "FeatureCollection",
            features: [counties.features.find(d => d.properties.name === county)]
    }
    const citiesInCounty = getCitiesInCountyAsGeoJson(cities, county)
    const citiesWithNonprofitCounts = mergeInNonprofitsByCity(citiesInCounty, nonprofits)

    return <div>
        <h3>County map view, {county}, {nonprofits.length} nonprofits</h3>
        <Map scopeLayer={currentCountyGeojson}>
            {/* Base layer */}
            <MapShapeLayer
                shapeFeatures={counties.features}
                isInteractive={true}
                onFeatureClick={zoomToCounty}
            />
            {/* Selected county */}
            <MapShapeLayer
                shapeFeatures={currentCountyGeojson.features}
                featureStyler={highlightCountyStyle}
            />
            {/* City points */}
            <MapPointLayer
                pointFeatures={citiesWithNonprofitCounts.features}
                markerGenerator={markNumberOfNonprofitsCounty}
                isInteractive={true}
                onFeatureClick={zoomToCity}
            />
        </Map>
    </div>
}

export default CountyTierMap