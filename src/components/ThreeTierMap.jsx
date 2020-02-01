import React, { Component } from 'react';

/* LOGIC */

// TODO - break this out to separate file
// Having nonprofits and cities in global scope in processing file would clean up arguments
// Discuss whether zipcode-based sorting is ideal approach

function getNonprofitsInCity(nonprofits, cities, cityName) {
    const city = cities.find(d => d.city === cityName)
    const zipsInCity = city.zip_codes // often only one
    const nonprofitsInCity = nonprofits.filter(np => zipsInCity.includes(np.ZIP.substring(0,5)))
    return nonprofitsInCity
}
function getNonprofitsInCounty(nonprofits, cities, countyName){
    // multiple cities per county
    const citiesInCounty = cities.filter(d => d.county === countyName)
    const zipsInCounty = citiesInCounty.map(d => d.zip_codes).reduce((arr, acc) => arr.concat(acc),[])
    const nonprofitsInCounty = nonprofits.filter(np => zipsInCounty.includes(np.ZIP.substring(0,5)))
    return nonprofitsInCounty
}

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
        const {nonprofits, cities} = this.props
        const {viewLevel, focusGeographyKey } = this.state

        // Does this sort of state validation logic belong here?
        const cityNames = cities.map(d => d.city)
        const countyNames = Array.from(new Set(cities.map(d => d.county)))
        
        if (viewLevel === 'state') {
            return <StateTierMap nonprofits={nonprofits}/>
        } else if (viewLevel === 'county' && countyNames.includes(focusGeographyKey)) {
            return <CountyTierMap
                nonprofits={getNonprofitsInCounty(nonprofits, cities, focusGeographyKey)}
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

export const StateTierMap = (props) => {
    const { nonprofits } = props
    return <div>State map view, {nonprofits.length} nonprofits</div>
}

export const CountyTierMap = (props) => {
    const {nonprofits, county} = props
    return <div>County map view, {county}, {nonprofits.length} nonprofits</div>
}

export const CityTierMap = (props) => {
    const {nonprofits, city} = props
    return <div>City/town map view, {city}, {nonprofits.length} nonprofits</div>
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