import * as d3 from "d3";
import { map, uniqBy, capitalize, each } from 'lodash';
import InputSanitizer from './inputSanitizer';
import Radar from '../models/radar';
import Quadrant from '../models/quadrant';
import Ring from '../models/ring';
import Blip from '../models/blip';
import GraphingRadar from '../graphing/radar';
import MalformedDataError from '../exceptions/malformedDataError';
import ExceptionMessages from './exceptionMessages';

class TechRadar {
  constructor(data) {
    this._data = data;
  }

  displayErrorMessage = (exception) => {
    d3.selectAll(".loading").remove();
    var message = 'Oops! It seems like there are some problems with loading your data. ';

    if (exception instanceof MalformedDataError) {
        message = message.concat(exception.message);
    } else {
        console.error(exception);
    }

    message = message.concat('<br/>', 'Please check <a href="https://info.thoughtworks.com/visualize-your-tech-strategy-guide.html#faq">FAQs</a> for possible solutions.');

    d3.select('body')
        .append('div')
        .attr('class', 'error-container')
        .append('div')
        .attr('class', 'error-container__message')
        .append('p')
        .html(message);
  }

  render = () => {
    try {
      var blips = map(this._data, new InputSanitizer().sanitize);

      document.title = "Flow Tech Radar";
      d3.selectAll(".loading").remove();

      var rings = map(uniqBy(blips, 'ring'), 'ring');
      var ringMap = {};
      var maxRings = 4;

      each(rings, function (ringName, i) {
          if (i == maxRings) {
              throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS);
          }
          ringMap[ringName] = new Ring(ringName, i);
      });

      var quadrants = {};
      each(blips, function (blip) {
          if (!quadrants[blip.quadrant]) {
              quadrants[blip.quadrant] = new Quadrant(capitalize(blip.quadrant));
          }
          quadrants[blip.quadrant].add(new Blip(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description))
      });

      var radar = new Radar();
      each(quadrants, function (quadrant) {
          radar.addQuadrant(quadrant)
      });

      var size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133;

      new GraphingRadar(size, radar).init().plot();
    } catch (exception) {
      this.displayErrorMessage(exception);
    }
  }
};

export default TechRadar;
