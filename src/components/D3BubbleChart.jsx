import React from 'react';

import { hierarchy, pack } from 'd3-hierarchy'
import { format } from 'd3-format'

export const Chart = (props) => {
    // SVG Container for charts --> pass layers in as children
    const {
        width=600,
        height=400,
        margins={top: 10, left: 10, bottom: 10, right: 10},
    } = props

    const plotWidth = width - margins.left - margins.right
    const plotHeight = height - margins.top - margins.bottom 
    const dimensions = {plotWidth, plotHeight}

    // pass dimensions to child layers
    const childrenWithProjection = React.Children.map(props.children, child =>
        React.cloneElement(child, { dimensions: dimensions })
    );
    
    // Transform function shifts plot area based on margins
    return <svg
        width={width}
        height={height}
        font-family='sans-serif'
        font-size={12}
        style={{border: "1px solid #ddd"}}>
        <g transform={`translate(${margins.left}, ${margins.top})`}>   
            { childrenWithProjection }
        </g>
    </svg>
}

const layoutBubbleChart = (flatData, opts) => {
    // Takes flat data array and works out size/placement for each bubble
    // Returns data structure that we can easily plot with svg
    // This is unintuitive b/c underlying library is designed to make hierarchical bubble plots
    // Reference: https://bl.ocks.org/alokkshukla/3d6be4be0ef9f6977ec6718b2916d168
    // Reference: https://observablehq.com/@d3/bubble-chart

    const { 
        width=300,
        height=300,
        padding=1.5,
        sizeAccessor=(d => d.value)
    } = opts
    
    const nodes = hierarchy({'children': flatData})
        .sum(sizeAccessor) // Indicate data field to use for size
    const bubbler = pack(nodes)
        .size([width, height]) // Set dimensions filled by bubble plot
        .padding(padding); // Set space between bubbles
    const bubbles = bubbler(nodes).descendants()
        .filter(d => !d.children) // use only nodes at bottom of hierarchy
    return bubbles    
}

const defaultBubbleStyle = {
    opacity: 1,
    fill: '#ddd',
    fillOpacity: 1,
    stroke: '#666',
    strokeWidth: '1px',
    strokeOpacity: 1,
}
const defaultBubbleStyler = (d => ({}))
const numberFormat = format(',.0f') // whole numbers with commas
const defaultBubbleLabeler = (d, sizeAccessor) => numberFormat(sizeAccessor(d)) // default label is field used for bubble size

export const BubbleChartLayer = (props) => {
    // Takes "flat" data array and returns svg circle bubbles as svg group
    const {
        data,
        dimensions, // supplied by SVG container
        bubbleStyler=defaultBubbleStyler,
        bubbleLabler=defaultBubbleLabeler,
        sizeAccessor=(d => d.value) // accessor function for data field mapped to bubble size
    } = props
    const width = dimensions.plotWidth || 200
    const height = dimensions.plotHeight || 300

    const bubbles = layoutBubbleChart(data, {width, height, sizeAccessor})

    const plottedBubbles = bubbles.map((bubble, i) => {
        const bubbleStyle = {
            // use default style, unless provided bubbleStyler function to set individual styles based on data
            ...defaultBubbleStyle,
            ...bubbleStyler(bubble.data)
        }
        return <g key={String(i)} transform={`translate(${bubble.x},${bubble.y})`}>
            <circle
                cx={0}
                cy={0}
                r={bubble.r}
                {...bubbleStyle}
            />
            <text
                text-anchor="middle"
                dy='0.3em'>
                {bubbleLabler(bubble.data, sizeAccessor)}
            </text>
        </g>
    })

    return <g>
        {plottedBubbles}
    </g>
}