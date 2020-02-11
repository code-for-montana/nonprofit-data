import React from "react"
import Shell from "../../src/components/shell"

const Content = (props) => {
  const headerTitle = <h1>Header</h1>
  const body = <h1>Body</h1>
  const sidebar = <h1>Sidebar</h1>

  return (<Shell headerTitle={headerTitle} body={body} sidebar={sidebar} />)

}

export default Content
