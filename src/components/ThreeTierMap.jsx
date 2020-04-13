import React, { Component } from 'react';

import StateTierMap from './ThreeTierMapState'
import CountyTierMap from './ThreeTierMapCounty'
import CityTierMap from './ThreeTierMapCity'

import {
    getNonprofitsInCity,
    getNonprofitsInCounty,
    getCountyForCity,
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
                county={getCountyForCity(focusGeographyKey, cities, counties)}
                zoomToCounty={this.zoomToCounty}
            />
        } else {
            // QUESTION: Ideal way to test for state errors?
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