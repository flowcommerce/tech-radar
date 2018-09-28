import React, { Component } from 'react';
import { map } from 'lodash/fp';
import { graphql } from 'gatsby';
import TechRadar from '../util/factory';
import "../styles/main.scss"

class IndexPage extends Component {
  componentDidMount = () => {
    const { allMarkdownRemark } = this.props.data;
    const { edges } = allMarkdownRemark;
    const json = map(({ node }) => ({
      ...node.frontmatter,
      description: node.html
    }), edges);

    const radar = new TechRadar(json);
    radar.render();
  }

  render = () => (
    <div className="loading">
      <div className="input-sheet" />
    </div>
  )
}

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      limit: 1000
    ) {
      edges {
        node {
          html
          frontmatter {
            name
            ring
            quadrant
            isnew
          }
        }
      }
    }
  }
`

export default IndexPage
