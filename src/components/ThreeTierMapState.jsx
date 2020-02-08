import React from 'react';

import { scaleRadial } from 'd3-scale'

import { Map, MapShapeLayer, MapPointLayer } from './D3GeoMap'

import {
    mergeInNonprofitsByCounty,
} from '../logic/logic.js'

const rScaleState = scaleRadial().domain([0,200]).range([0,20])
const markNumberOfNonprofitsState = (d) => {
    return <g>
            {/* circle markers */}
            <circle cx={0} cy={0}
                // onClick={e => console.log(d.properties)}
                fill="#377eb8"
                fillOpacity={0.8}
                stroke="#377eb8"
                strokeOpacity={1}
                r={rScaleState(d.properties.nonprofits.length)}
                cursor="pointer"
            />
            {/* labels */}
            <text
                textAnchor="middle"
                dy="-0.3em"
                fontSize={14}
                // fontWeight="bold"
                fill="#000"
                pointerEvents='none'
            >
                {d.properties.nonprofits.length}
            </text>
        </g>
}

const StateTierMap = (props) => {
    const {
        nonprofits,
        counties,
        cities,
        zoomToCounty
    } = props
    const countiesWithNonprofitCounts = mergeInNonprofitsByCounty(counties, nonprofits, cities)    
    return <div>
        <h3>State map view, {nonprofits.length} nonprofits</h3>
        <Map>
            <MapShapeLayer
                shapeFeatures={counties.features}
                isInteractive={true}
                onFeatureClick={zoomToCounty}
            />
            <MapPointLayer
                pointFeatures={countiesWithNonprofitCounts.features}
                markerGenerator={markNumberOfNonprofitsState}
            />
        </Map>
    </div>
}

export default StateTierMap