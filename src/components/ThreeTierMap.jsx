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
        this.resetView = this.resetView.bind(this)
        this.zoomToCounty = this.zoomToCounty.bind(this)
        this.zoomToCity = this.zoomToCity.bind(this)
    }

    resetView() {
        this.setState(defaultState)
    }

    zoomToCounty(d) {
        this.setState({
            viewLevel: 'county',
            focusGeographyKey: d.name
        })
    }

    zoomToCity(d) {
        this.setState({
            viewLevel: 'city',
            focusGeographyKey: d.city
        })
    }

    render() {
        const {nonprofits, cities, counties} = this.props
        const {viewLevel, focusGeographyKey } = this.state

        // Does this sort of state validation logic belong here?
        const cityNames = cities.features.map(d => d.properties.city)
        const countyNames = Array.from(new Set(cities.features.map(d => d.properties.county)))

        let view;
        
        if (viewLevel === 'state') {
            view = <StateTierMap
                nonprofits={nonprofits}
                counties={counties}
                cities={cities}
                zoomToCounty={this.zoomToCounty} // handle click on specific county
            />
        } else if (viewLevel === 'county' && countyNames.includes(focusGeographyKey)) {
            view = <CountyTierMap
                nonprofits={getNonprofitsInCounty(nonprofits, cities, focusGeographyKey)}
                counties={counties}
                cities={cities}
                county={focusGeographyKey}
                zoomToCounty={this.zoomToCounty} // handle click on specific county
                zoomToCity={this.zoomToCity} // handle click on specific city
            />
        } else if (viewLevel === 'city' && cityNames.includes(focusGeographyKey)) {
            view = <CityTierMap
                nonprofits={getNonprofitsInCity(nonprofits, cities, focusGeographyKey)}
                city={focusGeographyKey}
            />
        } else {
            view = <div>Map state error: {viewLevel}, {focusGeographyKey}</div>
        }

        return <div>
            <button onClick={this.resetView}>Reset View</button>
            <div>TODO search select -- Zoom to county</div>
            <div>TODO search select -- Zoom to city</div>
            {view}
        </div>
    }
}

const rScaleState = scaleRadial().domain([0,200]).range([0,20])
const markNumberOfNonprofitsState = (d) => {
    return <circle cx={0} cy={0}
        // onClick={e => console.log(d.properties)}
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
        zoomToCounty
    } = props
    const countiesWithNonprofitCounts = mergeInNonprofitsByCounty(counties, nonprofits, cities)    
    return <div>
        <h3>State map view, {nonprofits.length} nonprofits</h3>
        <Map>
            <MapShapeLayer
                shapeFeatures={counties.features}
                onFeatureClick={zoomToCounty}
            />
            <MapPointLayer
                pointFeatures={countiesWithNonprofitCounts.features}
                markerGenerator={markNumberOfNonprofitsState}
            />
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
        // onClick={e => console.log(d.properties)}
        fill="#377eb8"
        fillOpacity={0.8}
        stroke="#377eb8"
        strokeOpacity={1}
        r={rScaleCounty(d.properties.nonprofits.length)}
    />
}
export const CountyTierMap = (props) => {
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
                onFeatureClick={zoomToCity}
            />
        </Map>
    </div>
}

export const CityTierMap = (props) => {
    const {nonprofits, city} = props
    return <div>
        <h3>City/town map view, {city}, {nonprofits.length} nonprofits</h3>
        <div>TODO: Button move up to county</div>
        <div>TODO: Button look at other cities in county</div>
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