import React from 'react';

import { scaleOrdinal } from 'd3-scale'
import { schemeDark2 } from 'd3-scale-chromatic'

import { Chart, BubbleChartLayer } from '../src/components/D3BubbleChart'

const sampleData = [
    {"Name":"Olives","Count":4319, "category": "a"},
    {"Name":"Tea","Count":4159, "category": "a"},
    {"Name":"Mashed Potatoes","Count":2583, "category": "a"},
    {"Name":"Boiled Potatoes","Count":2074, "category": "b"},
    {"Name":"Milk","Count":1894, "category": "b"},
    {"Name":"Chicken Salad","Count":1809, "category": "b"},
    {"Name":"Vanilla Ice Cream","Count":1713, "category": "a"},
    {"Name":"Cocoa","Count":1636, "category": "a"},
    {"Name":"Lettuce Salad","Count":1566, "category": "a"},
    {"Name":"Lobster Salad","Count":1511, "category": "c"},
    {"Name":"Chocolate","Count":1489, "category": "c"},
    {"Name":"Apple Pie","Count":1487, "category": "c"},
    {"Name":"Orange Juice","Count":1423, "category": "c"},
    {"Name":"American Cheese","Count":1372, "category": "a"},
    {"Name":"Green Peas","Count":1341, "category": "d"},
    {"Name":"Assorted Cakes","Count":1331, "category": "d"},
    {"Name":"French Fried Potatoes","Count":1328, "category": "d"},
    {"Name":"Potato Salad","Count":1306, "category": "d"},
    {"Name":"Baked Potatoes","Count":1293, "category": "d"},
    {"Name":"Roquefort","Count":1273, "category": "d"},
    {"Name":"Stewed Prunes","Count":1268, "category": "d"}
]

export default {
    title: 'D3BubbleChart',
    component: Chart,
}

export const BasicBubbleChart = () => { 
    return <Chart width={600} height={400}>
        <BubbleChartLayer
            data={sampleData}
            sizeAccessor={d => d.Count}
        />
    </Chart>
}

const colorScale = scaleOrdinal(schemeDark2)
export const ColoredByCategory = () => { 
    return <Chart width={600} height={400}>
        <BubbleChartLayer
            data={sampleData}
            sizeAccessor={d => d.Count}
            bubbleStyler={d => ({
                fill: colorScale(d.category)
            })}
            bubbleLabler={
                d => `${d.category}: ${d.Count}`
            }
        />
    </Chart>
}