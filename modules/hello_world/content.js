import React from "react"
import { Link } from "gatsby"

import Layout from "../../src/components/layout"
import SEO from "../../src/components/seo"

const Content = (props) => (
  <Layout>
    <SEO title="Hello, World!" />
    <h1>{props.pageContext.name}</h1>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default Content
