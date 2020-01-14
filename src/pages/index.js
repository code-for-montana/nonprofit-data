import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import EmbeddedMap from "../components/map"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <EmbeddedMap />
    <p><Checkbox /> Show details</p>
  </Layout>
)

const Checkbox = props => (
  <input type="checkbox" {...props} />
)

export default IndexPage
