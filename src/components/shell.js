import React from "react"

import Layout from "./layout"

const Shell = ({ sidebar, headerTitle, headerItems, body }) => {
    return (<Layout>
        <div>{sidebar}</div>
        <div>{headerTitle}</div>
        <div>{headerItems}</div>
        <div>{body}</div>
    </Layout>)
}

export default Shell