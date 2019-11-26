/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const fs = require("fs")
const path = require("path")
const slugify = require("slugify")

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const modules = fs.readdirSync("modules", { withFileTypes: true }).filter(dir => dir.isDirectory()).map(dir => dir.name)

  for (const module of modules) {
    const module_path = path.join("modules", module)

    const config_path = path.join(module_path, "config.json")
    const config_text = fs.readFileSync(config_path).toString()
    const config = JSON.parse(config_text)

    const component_path = path.join(module_path, "content.js")

    createPage({
      path: `/${slugify(config.name, '-')}`,
      component: path.resolve(component_path),
      context: {
        name: config.name,
      },
    });
  }
}
