// Data management functions
// TODO: Think through which of these are necessary to have client-side

// Discuss whether zipcode-based sorting is ideal approach

// TODO: Think through where data should be passed around as a GeoJson collection vs flat arrays
// Currently usually GeoJson, but somewhat inconsistent 

export function getNonprofitsInCity(nonprofits, cities, cityName) {
    const city = cities.features.find(d => d.properties.city === cityName)
    const zipsInCity = city.properties.zip_codes // often only one
    const nonprofitsInCity = nonprofits.filter(np => zipsInCity.includes(np.ZIP.substring(0,5)))
    return nonprofitsInCity
}

export function getNonprofitsInCounty(nonprofits, cities, countyName){
    // multiple cities per county
    const citiesInCounty = getCitiesInCounty(cities, countyName)
    const zipsInCounty = citiesInCounty.map(d => d.properties.zip_codes).reduce((arr, acc) => arr.concat(acc),[])
    const nonprofitsInCounty = nonprofits.filter(np => zipsInCounty.includes(np.ZIP.substring(0,5)))
    return nonprofitsInCounty
}

export function getCitiesInCounty(cities, countyName) {
    return cities.features.filter(d => d.properties.county.toUpperCase() === countyName.toUpperCase())
}

export function getCitiesInCountyAsGeoJson(cities, countyName){
    const inCounty = getCitiesInCounty(cities, countyName)
    return {
        type: "FeatureCollection",
        features: inCounty,
    }
}

export function convertFlatDataToGeojson(flat){
    // Takes "flat" js object data with "latitude" and "longitude" fields
    // converts it to a GeoJson "MultiPoint" object for compatibility with D3 geopath
    // See https://tools.ietf.org/html/rfc7946#section-3.1.3
    const points = flat.map(d => {
        console.assert(d.longitude, "Point missing longitude field")
        console.assert(d.latitude, "Point missing latitude field")
        return {
            type: "MultiPoint",
            coordinates: [
                [d.longitude, d.latitude]
            ],
            properties: {
                ...d
            } 
        }
    })
    
    return {
        type: "FeatureCollection",
        // Assumes WGS84 CRS
        features: points
    }
}


export function mergeInNonprofitsByCounty(counties, nonprofits, cities) {
    // Takes GeoJson feature array of cities, GeoJson array of cities, flat array of nonprofits
    // Returns GeoJson feature array of counties w/ nonprofit count
    counties.features.forEach(county => {
        const citiesInCounty = getCitiesInCounty(cities, county.properties.name)
        const zipsInCounty = citiesInCounty.map(d => d.properties.zip_codes).reduce((arr, acc) => arr.concat(acc),[])
        const nonprofitsInCounty = nonprofits.filter(np => zipsInCounty.includes(np.ZIP.substring(0,5)))
        county.properties.nonprofits = nonprofitsInCounty
    })
    return counties
}
export function mergeInNonprofitsByCity(cities, nonprofits) {
    // Takes GeoJson feature array of cities, flat array of nonprofits
    // Returns GeoJson feature array of cities w/ nonprofit count #     

    cities.features.forEach(city => {
        const zipsInCity = city.properties.zip_codes // often only one
        const nonprofitsInCity = nonprofits.filter(np => zipsInCity.includes(np.ZIP.substring(0,5)))
        city.properties.nonprofits = nonprofitsInCity
    })
    return cities
}