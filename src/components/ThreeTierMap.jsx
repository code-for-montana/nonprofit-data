import React, { Component } from 'react';

import {
    scaleRadial
} from 'd3-scale'

import { Map, MapShapeLayer, MapPointLayer } from './D3GeoMap'
import { Chart, BubbleChartLayer } from './D3BubbleChart'

import {
    getCitiesInCountyAsGeoJson,
    getNonprofitsInCity,
    getNonprofitsInCounty,
    mergeInNonprofitsByCity,
    mergeInNonprofitsByCounty,
} from '../logic/logic.js'

/* MAP COMPONENTS */

const defaultState = {
    viewLevel: 'state', // one of state/county/city
    focusGeographyKey: null // null for state level, county/city name otherwise
}

export default class ThreeTierMap extends Component {
    constructor(props){
        super(props)
        // This setup is to make Storybook UI testing easier by letting us pipe in state via props
        // See https://storybook.js.org/docs/basics/faq/
        const initialState = this.props.initialState || defaultState
        this.state = {
            ...initialState
        }
    }

    render() {
        const {nonprofits, cities, counties} = this.props
        const {viewLevel, focusGeographyKey } = this.state

        // Does this sort of state validation logic belong here?
        const cityNames = cities.features.map(d => d.properties.city)
        const countyNames = Array.from(new Set(cities.features.map(d => d.properties.county)))
        
        if (viewLevel === 'state') {
            return <StateTierMap
                nonprofits={nonprofits}
                counties={counties}
                cities={cities}
                // onFeatureClick={e => console.log(e)} // handle click on specific county
            />
        } else if (viewLevel === 'county' && countyNames.includes(focusGeographyKey)) {
            return <CountyTierMap
                nonprofits={getNonprofitsInCounty(nonprofits, cities, focusGeographyKey)}
                counties={counties}
                cities={cities}
                county={focusGeographyKey}
                />
        } else if (viewLevel === 'city' && cityNames.includes(focusGeographyKey)) {
            return <CityTierMap
                nonprofits={getNonprofitsInCity(nonprofits, cities, focusGeographyKey)}
                city={focusGeographyKey}
                />
        } else {
            return <div>Map state error: {viewLevel}, {focusGeographyKey}</div>
        }
    }
}

const rScaleState = scaleRadial().domain([0,200]).range([0,20])
const markNumberOfNonprofitsState = (d) => {
    return <circle cx={0} cy={0}
        onClick={e => console.log(d.properties)}
        fill="#377eb8"
        fillOpacity={0.8}
        stroke="#377eb8"
        strokeOpacity={1}
        r={rScaleState(d.properties.nonprofits.length)}
    />
}
export const StateTierMap = (props) => {
    const {
        nonprofits,
        counties,
        cities,
        onFeatureClick
    } = props  
    // const citiesWithNonprofitCounts = mergeInNonprofitsByCity(counties, nonprofits)  
    const countiesWithNonprofitCounts = mergeInNonprofitsByCounty(counties, nonprofits, cities)    
    return <div>
        <div>State map view, {nonprofits.length} nonprofits</div>
        <Map>
            <MapShapeLayer
                shapeFeatures={counties.features}
                // onFeatureClick=
            />
            <MapPointLayer
                pointFeatures={countiesWithNonprofitCounts.features}
                markerGenerator={markNumberOfNonprofitsState}
            />
            {/* <MapPointLayer pointFeatures={cities.features} /> */}
            {/* TODO: Parse geodata to get centroids for adding nonprofit counts by county here */}
            {/* <MapPointLayer pointFeatures={mtCities} /> */}
        </Map>
    </div>
}

const highlightCountyStyle = d => ({
    fill: '#bbb',
    stroke: '#222',
    strokeWidth: 1.5,
})
const rScaleCounty = scaleRadial().domain([0,200]).range([0,40])
const markNumberOfNonprofitsCounty = (d) => {
    return <circle cx={0} cy={0}
        onClick={e => console.log(d.properties)}
        fill="#377eb8"
        fillOpacity={0.8}
        stroke="#377eb8"
        strokeOpacity={1}
        r={rScaleCounty(d.properties.nonprofits.length)}
    />
}
export const CountyTierMap = (props) => {
    const {nonprofits, county, counties, cities} = props
    
    // Get Geojson structured object with just focus county
    // Lets us tell map to zoom to that county
    const currentCountyGeojson = {
            type: "FeatureCollection",
            features: [counties.features.find(d => d.properties.name === county)]
    }
    const citiesInCounty = getCitiesInCountyAsGeoJson(cities, county)
    const citiesWithNonprofitCounts = mergeInNonprofitsByCity(citiesInCounty, nonprofits)

    // const citiesWithNonprofitCounts = countNonprofitsByCity(cities)
    return <div>
        <div>County map view, {county}, {nonprofits.length} nonprofits</div>
        <Map scopeLayer={currentCountyGeojson}>
            <MapShapeLayer shapeFeatures={counties.features} />
            <MapShapeLayer
                shapeFeatures={currentCountyGeojson.features}
                featureStyler={highlightCountyStyle}
            />
            <MapPointLayer
                pointFeatures={citiesWithNonprofitCounts.features}
                markerGenerator={markNumberOfNonprofitsCounty}
            />
        </Map>
    </div>
}

export const CityTierMap = (props) => {
    const {nonprofits, city} = props
    console.log(nonprofits)
    return <div>
        <div>City/town map view, {city}, {nonprofits.length} nonprofits</div>
        <Chart width={600} height={400}>
        <BubbleChartLayer
            data={nonprofits}
            sizeAccessor={d => 5}
            bubbleLabler={
                // d => `${d.NAME}`
                d => ''
            }
        />
    </Chart>
    </div>
}

/* Three tiers

Necessary data:
- Nonprofit data (don't currently have easy categories)
- County boundary data as appropriate-resolution GeoJson
- File w/ Lat/lng point for each city/town/place in nonprofit address data, also county of place via zip
    - Develop from zip codes --> group by zips w/ same place and average lat/longs

# State view
- Plot all counties as svg
- Circle w/ number

# County view
- Show boundary of selected county
- Show faintly other counties in frame
- Circles at 

# City view
- Show all nonprofits in city as bubble plot
- Color by category?
- Tooltips

*/