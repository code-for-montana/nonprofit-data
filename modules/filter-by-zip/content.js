import React, { Component } from "react"
import { Link } from "gatsby"

import Layout from "../../src/components/layout"
import SEO from "../../src/components/seo"

/* 
data - quick and dirty list of Montana nonprofits including ONLY groups that have filed 990s in 2019.

Fields included: ['OBJECT_ID', 'EIN', 'NAME', 'STREET', 'CITY', 'STATE', 'ZIP']

NOTE - we may want to add a data processing step that translates zip codes to five digit strings
*/

// const coverageLinks = require('./src/data/eo-mt-app-extract-2019-filers-only.json')
import data from '../../src/data/eo-mt-app-extract-2019-filers-only.json'

// .slice(0,5) accounts for detailed zip codes
const getLinesForZip = zip => data.filter(d => d.ZIP.slice(0,5) === zip)

const DEFAULT_ZIP = '59601'

class FilterToZipPage extends Component {
  constructor(props){
    super(props)

    this.state = {
      zip: DEFAULT_ZIP,
    }
    this.setFilterZip = this.setFilterZip.bind(this)
  }

  setFilterZip(zip){
    // TODO: Add validation logic here (or in Input component below)
    this.setState({
      zip: zip
    })
  }

  render(){
    const matches = getLinesForZip(this.state.zip)
    return <Layout>
      <SEO title="Filter by zip" />
      <h1>{this.props.pageContext.name}</h1>
      <Input 
        handleInput={this.setFilterZip}
        placeholder='e.g. 59718'
      />
      <br />
      <hr />
      
      <h2>{matches.length} matches for {this.state.zip} zip code</h2>
      <ol>
        {matches.map((d, i) => <ResultRow key={String(i)} data={d}/>)}
      </ol>
  
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  }
}

export default FilterToZipPage

// TODO: Refactor these out

class Input extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: '',
    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event){
      const input = event.target.value
      // There's probably a more elegant way to do this
      // Current logic prevents entry beyond 5 digits, calls handler function only at 5 digits
      if (input.length < 5){
        this.setState({value: input})
      } else if (input.length === 5) {
        this.props.handleInput(input)
        this.setState({value: input})
      } else if (input.length > 5) {
        this.setState({value: input.slice(0,5)})
      }
  }

  render(){
    return <div>
        <input type="text"
            value={this.state.value}
            onChange={this.handleChange}
            placeholder={this.props.placeholder} />
    </div>
  }

}

const ResultRow = (props) => {
  const { data } = props;
  return <li>
    <div><strong>{data.NAME}</strong></div>
    <div>{data.STREET}, {data.CITY} {data.ZIP}</div>
    <br />
  </li>
}
