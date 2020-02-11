import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ title, items }) => {
  return (
  <header
    style={{
      background: `#984ea3`,
      height: `7rem`,
}}
  >
    <div
      style={{
        margin: `0 auto`,
        padding: `1rem 1rem`,
      }}
    >
      <h2 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
         {title}
        </Link>
      </h2>
    </div>
  </header>
)
        }

export default Header
