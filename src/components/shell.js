import React from "react"

import Layout from "./layout"
import Header from "./header"

const Shell = ({ sidebar, headerTitle, headerItems, body }) => {
    return (<Layout>
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
    </Layout>)
}

export default Shell