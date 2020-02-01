import React from 'react';

import ThreeTierMap from '../src/components/ThreeTierMap'

import nonprofits from '../src/data/eo-mt-app-extract-2019-filers-only.json'
import cities from '../src/data/mt-cities-with-centroids.json'

console.log('Nonprofits', nonprofits)
console.log('Cities', cities)

export default {
    title: 'ThreeTierMap',
    component: ThreeTierMap,
  }

export const StateView = () => {
  return <ThreeTierMap
    nonprofits={nonprofits}
    cities={cities}

    initialState={{
      viewLevel: 'state',
      focusGeographyKey: null
    }}
  />
}

export const CountyViewMissoula = () => {
  return <ThreeTierMap
    nonprofits={nonprofits}
    cities={cities}

    initialState={{
      viewLevel: 'county',
      focusGeographyKey: 'Missoula'
    }}
  />
}

export const CountyViewRosebud = () => {
  return <ThreeTierMap
    nonprofits={nonprofits}
    cities={cities}

    initialState={{
      viewLevel: 'county',
      focusGeographyKey: 'Rosebud'
    }}
  />
}

export const CityViewMissoula = () => {
  return <ThreeTierMap
    nonprofits={nonprofits}
    cities={cities}

    initialState={{
      viewLevel: 'city',
      focusGeographyKey: 'Missoula'
    }}
  />
}

export const CityViewHamilton = () => {
  return <ThreeTierMap
    nonprofits={nonprofits}
    cities={cities}

    initialState={{
      viewLevel: 'city',
      focusGeographyKey: 'Hamilton'
    }}
  />
}

export const CityViewEkalaka = () => {
  return <ThreeTierMap
    nonprofits={nonprofits}
    cities={cities}

    initialState={{
      viewLevel: 'city',
      focusGeographyKey: 'Ekalaka'
    }}
  />
}

