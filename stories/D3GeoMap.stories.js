import React from 'react';
import { Map, MapShapeLayer, MapPointLayer } from '../src/components/D3GeoMap'

import {
    geoAlbers
} from 'd3-geo'

import mtCounties from '../src/data/mt-counties-geojson.json'
import mtCities from '../src/data/mt-cities-with-centroids.json'

export default {
    title: 'D3GeoMap',
    component: Map,
  }

export const BasicMap = () => { 
    return <Map>
        <MapShapeLayer shapeFeatures={mtCounties.features} />
        <MapPointLayer pointFeatures={mtCities} />
    </Map>
}
