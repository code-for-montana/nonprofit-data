import React from 'react';

import { Chart, BubbleChartLayer } from './D3BubbleChart'

const CityTierMap = (props) => {
    const {
        nonprofits,
        city,
        county,
        zoomToCounty,
    } = props
    return <div>
        <h3>City/town map view, {city}, {nonprofits.length} nonprofits</h3>
        <button onClick={d => zoomToCounty(county.properties)}>
            See {county.properties.name} County
        </button>
        <div>
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
        
    </div>
}

export default CityTierMap