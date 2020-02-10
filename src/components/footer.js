import React from "react"

const Footer = () => (
  <footer
    style={{
      background: `white`,
      position: `absolute`,
      bottom: `0`,
      width: `100%`,
      zIndex: `-1`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1rem 1rem`,
      }}
    >
      <span style={{ margin: `0`, fontSize: `0.7rem` }}>
        <a href="https://thenounproject.com/term/montana/468266">“Montana”</a>
        {" icon by Ted Grajeda from "}
        <a href="https://thenounproject.com/">the Noun project</a>.
      </span>
    </div>
  </footer>
)

export default Footer
