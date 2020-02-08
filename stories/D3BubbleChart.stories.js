import React from 'react';

import { Chart, BubbleChartLayer } from '../src/components/D3BubbleChart'

const sampleData = [{"Name":"Olives","Count":4319},
    {"Name":"Tea","Count":4159},
    {"Name":"Mashed Potatoes","Count":2583},
    {"Name":"Boiled Potatoes","Count":2074},
    {"Name":"Milk","Count":1894},
    {"Name":"Chicken Salad","Count":1809},
    {"Name":"Vanilla Ice Cream","Count":1713},
    {"Name":"Cocoa","Count":1636},
    {"Name":"Lettuce Salad","Count":1566},
    {"Name":"Lobster Salad","Count":1511},
    {"Name":"Chocolate","Count":1489},
    {"Name":"Apple Pie","Count":1487},
    {"Name":"Orange Juice","Count":1423},
    {"Name":"American Cheese","Count":1372},
    {"Name":"Green Peas","Count":1341},
    {"Name":"Assorted Cakes","Count":1331},
    {"Name":"French Fried Potatoes","Count":1328},
    {"Name":"Potato Salad","Count":1306},
    {"Name":"Baked Potatoes","Count":1293},
    {"Name":"Roquefort","Count":1273},
    {"Name":"Stewed Prunes","Count":1268}
]

export default {
    title: 'D3BubbleChart',
    component: Chart,
}

export const BasicBubbleChart = () => { 
    return <Chart>
        <BubbleChartLayer data={sampleData} sizeKey='Count'/>
    </Chart>
}