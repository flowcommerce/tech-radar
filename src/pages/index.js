import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { flow, map, uniqBy, capitalize, each, sortBy, reduce } from 'lodash/fp';
import ExceptionMessages from '../util/exceptionMessages';
import { Blip, Quadrant, Radar, Ring } from '../models';
import InputSanitizer from '../util/inputSanitizer';
import GraphingRadar from '../graphing/radar';
import Layout from '../components/layout';
import logo from '../images/logo.png';
import "../styles/main.scss"

const reduceWithIndex = reduce.convert({ cap: false });

const MaxRings = 4;
const RingSortMap = {
  'adopt': 0,
  'trial': 1,
  'assess': 2,
  'hold': 3
};

class IndexPage extends Component {
  constructor(props) {
    super(props);

    const { allMarkdownRemark } = props.data;
    const { edges } = allMarkdownRemark;

    this.json = map(({ node }) => ({
      ...node.frontmatter,
      description: node.html
    }), edges);

    this.radar = new Radar();
  }

  componentDidMount = () => {
    var size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133;
    new GraphingRadar(size, this.radar).init().plot();
  }

  errorMessage = (error) => (
    <Layout>
      <div className="error-container">
        <div className="error-container__message">
          <p>
            {error} <br />
            Please check <a href="https://info.thoughtworks.com/visualize-your-tech-strategy-guide.html#faq">FAQs</a> for possible solutions.
          </p>
        </div>
      </div>
    </Layout>
  )

  render = () => {
    const { site } = this.props.data;

    const blips = map(new InputSanitizer().sanitize, this.json);
    const ringMap = flow(
      uniqBy(r => r.ring),
      map(r => r.ring),
      sortBy(ringName => RingSortMap[ringName]),
      reduceWithIndex((obj, ringName, idx) => {
        obj[ringName] = new Ring(ringName, idx);
        return obj;
      }, {})
    )(blips);

    if (Object.keys(ringMap).length > MaxRings) {
      return this.errorMessage(ExceptionMessages.TOO_MANY_RINGS);
    }

    const quadrants = reduce((obj, blip) => {
      (obj[blip.quadrant] || (obj[blip.quadrant] = new Quadrant(capitalize(blip.quadrant))))
        .add(new Blip(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description));
      return obj;
    }, {}, blips);

    try {
      each(q => this.radar.addQuadrant(q), quadrants);
    } catch(e) {
      return this.errorMessage(e.message);
    }

    const quadrantButtons = map(quadrant => (
      <div
        key={quadrant.quadrant.name()}
        className={`button ${quadrant.order} full-view`}
      >
        {quadrant.quadrant.name()}
      </div>
    ), this.radar.quadrants());

    return (
      <Layout>
        <header>
          <div className="radar-title">
            <div className="radar-title__text">
              <h2>{site.siteMetadata.title}</h2>
            </div>
            <div className="radar-title__logo">
              <a href="https://www.flow.io">
                <img src={logo} alt="Logo" />
              </a>
            </div>
          </div>

          {quadrantButtons}
          <div className="print-radar button no-capitalize" onClick={() =>  window.print.bind(window)}>
            Print this radar
          </div>
        </header>
        <div id="radar" />
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark {
      edges {
        node {
          html
          frontmatter {
            name
            ring
            quadrant
            isNew
          }
        }
      }
    }
  }
`

export default IndexPage
