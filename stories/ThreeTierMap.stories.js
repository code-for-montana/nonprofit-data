import React from 'react';

import ThreeTierMap from '../src/components/ThreeTierMap'

import {
  convertFlatDataToGeojson
} from '../src/logic/logic.js'

import nonprofits from '../src/data/eo-mt-app-extract-2019-filers-only.json'
import cities from '../src/data/mt-cities-with-centroids.json'
import counties from '../src/data/mt-counties-geojson.json'

const baseData = {
  nonprofits,
  counties,
  cities: convertFlatDataToGeojson(cities)
}

export default {
    title: 'ThreeTierMap',
    component: ThreeTierMap,
  }

export const StateView = () => {
  return <ThreeTierMap
    {... baseData }

    initialState={{
      viewLevel: 'state',
      focusGeographyKey: null
    }}
  />
}

export const CountyViewMissoula = () => {
  return <ThreeTierMap
  {... baseData }

    initialState={{
      viewLevel: 'county',
      focusGeographyKey: 'Missoula'
    }}
  />
}

export const CountyViewRosebud = () => {
  return <ThreeTierMap
    {... baseData }

    initialState={{
      viewLevel: 'county',
      focusGeographyKey: 'Rosebud'
    }}
  />
}

export const CityViewMissoula = () => {
  return <ThreeTierMap
    {... baseData }

    initialState={{
      viewLevel: 'city',
      focusGeographyKey: 'Missoula'
    }}
  />
}

export const CityViewHamilton = () => {
  return <ThreeTierMap
    {... baseData }

    initialState={{
      viewLevel: 'city',
      focusGeographyKey: 'Hamilton'
    }}
  />
}

export const CityViewEkalaka = () => {
  return <ThreeTierMap
    {... baseData }

    initialState={{
      viewLevel: 'city',
      focusGeographyKey: 'Ekalaka'
    }}
  />
}

