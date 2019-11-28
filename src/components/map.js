import React, { Component } from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

export default class EmbeddedMap extends Component {
  render() {
    const position = [46.853606, -114.014338]
    const position2 = [46.86, -114.014338]
    const position3 = [46.87, -114.014338]


    if (typeof window !== 'undefined') {
      return (      
        <Map center={position} zoom={10} style={{height: '540px'}}>
          <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
        <Marker position={position}>
         <Popup>
            Hi! <br/> Missoula!
          </Popup>
        </Marker>
        <Marker position={position2}>
         <Popup>
            Hi! <br/> Missoula 2!
          </Popup>
        </Marker>
        <Marker position={position3}>
         <Popup>
            Hi! <br/> Missoula 3!
          </Popup>
        </Marker>
        </Map>
      )
    }
    return null
  }
}