class Ring {
  constructor(name, order) {
    this._name = name;
    this._order = order;
  }

  name = () => this._name;
  order = () => this._order;

}

export default Ring;
