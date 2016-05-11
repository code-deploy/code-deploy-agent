import * as context from './context';

export class Node {

  children = [];

  constructor (name, context = context.default, options = {}) {
    this.name = name;
  }

  evaluate() {
    this.hasChild() ? this._evaluateChildren() : null;
  }

  _evaluateChildren() {
    this.children.forEach(child => child.evaluate());
  }

  setParent(node) {
    this.parent = node;
  }

  hasChild () {
    return this.children.length > 0;
  }

  appendChild(node) {
    this.children.push(node);
  }

  removeChild(node) {
    const index = this.children.indexOf(node);
    if (index >= 0) { this.children.splice(index, 1); }
  }
}

