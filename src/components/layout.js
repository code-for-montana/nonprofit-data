import React from "react"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const sidebar = children[0]
  const headerTitle = children[1]
  const headerItems = children[2]
  const body = children[3]

  return (
    <>
      <div style={{display: `flex`, flexFlow: `row`, height: `100%`}}>
        <div
            style={{
              backgroundColor: `#377eb8`,
              width: `20%`,
              padding: `0px 1.0875rem 1.45rem`,
            }}
          >
          {sidebar}
        </div>

      <div style={{display: `flex`, flexGrow: `1`, flexFlow: `column`}}>

        <Header title={headerTitle} items={headerItems}></Header>
        <div
          style={{
            flexGrow: `1`,
            backgroundColor: `#ffff33`,
            padding: `0px 1.0875rem 1.45rem`,
            paddingTop: 0,
          }}
        >
          {body}
        </div>
      </div>
    </div>    
  </>
  )
}

export default Layout
