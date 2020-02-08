import React, { Component } from 'react';

import {
    geoPath,
    geoMercator
} from 'd3-geo'

import mtCounties from '../data/mt-counties-geojson.json'

const defaultMapConfig = {
    fontSize: 12,
    fontFamily: 'sans-serif',
}
export const Map = (props) => {
    const {
        projectionType=geoMercator,
        scopeLayer=mtCounties,
    } = props
    // SVG Container for maps/plots --> pass layers in as children
    // config is style config // TODO
    // scopeLayer is geojson layer used to fit zoom
    // TODO: Figure out how to make this responsive, at least on initial page load
    const width = 600
    const height = 400
    const margins = {top: 10, left: 10, bottom: 10, right: 10}
    const plotWidth = width - margins.left - margins.right
    const plotHeight = height - margins.top - margins.bottom 

    const projection = projectionType()
    projection.fitSize([plotWidth, plotHeight], scopeLayer)
    
    // Add projection attribute to child layers
    // See https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children
    const childrenWithProjection = React.Children.map(props.children, child =>
        React.cloneElement(child, { projection: projection })
    );

    return <svg
        width={width}
        height={height}
        {...defaultMapConfig}
        style={{border: "1px solid #ddd"}}>
        <g transform={`translate(${margins.left}, ${margins.top})`}>   
            { childrenWithProjection }
        </g>
    </svg>
}

const defaultShapeStyle = {
    opacity: 1,
    fill: '#ddd',
    fillOpacity: 1,
    stroke: '#fff',
    strokeWidth: '1px',
    strokeOpacity: 1,
}
const defaultFeatureStyler = (d => ({}))
export const MapShapeLayer = (props) => {
    // returns svg group with shape features
    const {
        projection,
        shapeFeatures,
        featureStyler=defaultFeatureStyler,
        onFeatureClick=(d => null)
    } = props
    // shapeFeatures is array of geojson polygon features
    // featureStyler is function of feature data returning object with fill/stroke/etc.

    // Translates geojson feature boundary data to svg path encoding
    const makeSVGPath = geoPath().projection(projection);

    const paths = shapeFeatures.map((feature, i) => {
        const style = {
            // use default style unless provided featureStyler that sets individual styles based on data
            ...defaultShapeStyle,
            ...featureStyler(feature.properties)
        }
        return <path
            key={String(i)}
            className='map-shape'
            d={makeSVGPath(feature)}
            
            // styling
            {...style}

            // interactivity - pass feature data up to handler function
            onClick={e => onFeatureClick(feature.properties)}
        />
    })

    return <g className={`shape-layer`}>
        {paths}
    </g>
    
}


const defaultMarkerStyle = {
    opacity: 1,
    fill: '#222',
    fillOpacity: 1,
    stroke: '#222',
    strokeWidth: 0,
    strokeOpacity: 1,
}
const defaultMarker = (d) => {
    return <circle cx={0} cy={0} r={3}
        onClick={e => console.log(d)}
        {...defaultMarkerStyle}
    />
}
export const MapPointLayer = (props) => {
    // returns svg group with point features
    const {
        projection,
        pointFeatures,
        markerGenerator=defaultMarker,
        // interactivity
        onFeatureClick=(d => null)
    } = props
    // pointFeatures is array of geojson MultiPoint features
    // See logic/convertFlatDataToGeojson for converting "flat" jsons
    // markerGenerator is jsx function of feature data returning svg marker

    const makeSVGPath = geoPath().projection(projection);

    const markers = pointFeatures.map((feature, i) => {
        // const point = projection([d.longitude, d.latitude])
        const centroid = makeSVGPath.centroid(feature)
        return <g className={`marker-container`} key={String(i)}
            transform={`translate(${centroid[0]},${centroid[1]})`}
            onClick={d => onFeatureClick(feature.properties)}
        >
            {markerGenerator(feature)}
        </g>
    })

    return <g className={`point-layer`}>
        {markers}
    </g>

}

export const MapMarker = (props) => {
    const { featureData } = props
}
// TODO Marker options:
// 1) circles w/ size encoded to values
// 2) cluster of individual nonprofits
// 3) cluster of nonprofits aggregated by category


// SVG container

// map feature shape layer - in SVG

// circle marker layer
    // geojson point data --> circle marks sized by key value

// circle cluster layer - in SVG, using D3 tools

// How to do tooltips?