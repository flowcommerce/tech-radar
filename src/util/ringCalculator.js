const sequence = [0, 6, 5, 3, 2, 1, 1, 1];

class RingCalculator {
  constructor(numberOfRings, maxRadius) {
    this.numberOfRings = numberOfRings;
    this.maxRadius = maxRadius;
  }

  sum = (length) => {
    return sequence.slice(0, length + 1).reduce(function (previous, current) {
      return previous + current;
    }, 0);
  }

  getRadius = (ring) => {
    const total = this.sum(this.numberOfRings);
    const sum = this.sum(ring);

    return this.maxRadius * sum / total;
  }
}

export default RingCalculator;
