import sanitizeHtml from 'sanitize-html';
import { forOwn } from 'lodash';

const InputSanitizer = function () {
    var relaxedOptions = {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ul',
            'br', 'p', 'u'],
        allowedAttributes: {
            'a': ['href']
        }
    };

    var restrictedOptions = {
        allowedTags: [],
        allowedAttributes: {},
        textFilter: function(text) {
              return text.replace(/&amp;/, '&');
            }
    };

    function trimWhiteSpaces(blip) {
      var processedBlip = {};
      forOwn(blip, function(value, key) {
        var trimmedKey = key.trim();
        var trimmedValue = value.trim ? value.trim() : value.toString().trim() ;
        processedBlip[trimmedKey] = trimmedValue;
      });
      return processedBlip;
    }

    var self = {};
    self.sanitize = function (rawBlip) {
      var blip = trimWhiteSpaces(rawBlip);
      blip.description = sanitizeHtml(blip.description, relaxedOptions);
      blip.name = sanitizeHtml(blip.name, restrictedOptions);
      blip.isNew = sanitizeHtml(blip.isNew, restrictedOptions);
      blip.ring = sanitizeHtml(blip.ring, restrictedOptions);
      blip.quadrant = sanitizeHtml(blip.quadrant, restrictedOptions);

      return blip;
    };

    return self;
};

export default InputSanitizer;
