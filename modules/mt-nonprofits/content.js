import React from "react"

import Shell from "../../src/components/shell"
import EmbeddedMap from "./components/map"

const Content = (props) => {
  const header = <h1>Header</h1>
  const body = <EmbeddedMap></EmbeddedMap>
  const sidebar = <h1>Sidebar</h1>

  return (
  <Shell header={header} body={body} sidebar={sidebar}></Shell>
  )
}

export default Content
