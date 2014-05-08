var RouteHelper,
  __slice = [].slice;

RouteHelper = (function() {
  RouteHelper.prototype.routes = {
    "/": "root",
    "/players": "players",
    "/tournaments": "tournaments",
    "/me": "me"
  };

  function RouteHelper() {
    var name, pattern, _ref;
    _ref = this.routes;
    for (pattern in _ref) {
      name = _ref[pattern];
      this.defineRouteHelper(name, pattern);
      this.definePathHelper(name, pattern);
    }
  }

  RouteHelper.prototype.defineRouteHelper = function(name, pattern) {
    return this["" + name + "Route"] = pattern;
  };

  RouteHelper.prototype.definePathHelper = function(name, pattern) {
    var numberOfArguments, parts;
    parts = _.clone(pattern).replace(/\(.*\)/, "").split("/").slice(1);
    numberOfArguments = this.calculateRouteNumberOfArguments(parts);
    return this["" + name + "Path"] = function() {
      var args, currentArgument, i, params, path, uri, value, _i, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (args.length < numberOfArguments || args.length > numberOfArguments + 1) {
        throw "Invalid number of arguments";
      } else {
        path = parts.length === 0 ? "/" : "";
        currentArgument = 0;
        for (i = _i = _ref = parts.length - 1; _i >= 0; i = _i += -1) {
          if (parts[i].indexOf(":") === -1) {
            path = "/" + parts[i] + path;
          } else {
            path = "/" + args[currentArgument] + path;
            currentArgument += 1;
          }
        }
        uri = new Uri(path);
        if (currentArgument < args.length) {
          params = args[args.length - 1];
          if (typeof params === 'object') {
            for (name in params) {
              value = params[name];
              uri.replaceQueryParam(name, value);
            }
          } else {
            throw "Invalid argument is not an object";
          }
        }
        return uri.toString();
      }
    };
  };

  RouteHelper.prototype.calculateRouteNumberOfArguments = function(parts) {
    var i, numberOfArguments, _i, _ref;
    numberOfArguments = 0;
    for (i = _i = _ref = parts.length - 1; _i >= 0; i = _i += -1) {
      if (parts[i].indexOf(":") !== -1) {
        numberOfArguments += 1;
      }
    }
    return numberOfArguments;
  };

  RouteHelper.prototype.params = function(name) {
    return new Uri(window.location.href).getQueryParamValue(name);
  };

  return RouteHelper;

})();
