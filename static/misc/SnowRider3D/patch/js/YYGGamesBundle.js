bundle= {
  "load": function(module, func) {
    console.trace("--fx--bundle--load", arguments);
    func();
  }
}
