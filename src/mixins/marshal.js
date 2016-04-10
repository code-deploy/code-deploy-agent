
export default function mixind(Composed) {
  return class extends Composed {

    dump() {
      return JSON.stringify(this);
    }

    load(hash) {
      super.load(hash);
    }

    static unmarshal(data) {
      var obj = Object.create(this.prototype);
      var hash = JSON.parse(data);
      obj.load(hash);
    }

    static marshal(obj) {
      return obj.dump();
    }
  };
}
