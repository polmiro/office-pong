;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react', 'react-async'], factory);
  } else {
    root.ReactRouter = factory(root.React, root.ReactAsync);
  }
})(this, function(React, ReactAsync) {

  var __ReactShim = window.__ReactShim = window.__ReactShim || {};

  __ReactShim.React = React;

  __ReactShim.cloneWithProps = React.addons.cloneWithProps;

  __ReactShim.invariant = function(check, msg) {
    if (!check) {
      throw new Error(msg);
    }
  }

  var mergeInto = __ReactShim.mergeInto = function(dst, src) {
    for (var k in src) {
      if (src.hasOwnProperty(k)) {
        dst[k] = src[k];
      }
    }
  }

  __ReactShim.merge = function(a, b) {
    var c = {};
    mergeInto(c, a);
    mergeInto(c, b);
    return c;
  }

  __ReactShim.emptyFunction = function() {
  }

  __ReactShim.ExecutionEnvironment = {
    canUseDOM: true
  };

  __ReactShim.ReactUpdates = {
    batchedUpdates: function(cb) { cb(); }
  };

  var __ReactAsyncShim = window.__ReactAsyncShim = window.__ReactAsyncShim || {};
  __ReactAsyncShim.isAsyncComponent = ReactAsync.isAsyncComponent;
  __ReactAsyncShim.prefetchAsyncState = ReactAsync.prefetchAsyncState;

  var
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Focm2+":[function(__browserify__,module,exports){
"use strict";

var Router                    = __browserify__('./lib/Router');
var Route                     = __browserify__('./lib/Route');
var Link                      = __browserify__('./lib/Link');

var RouterMixin               = __browserify__('./lib/RouterMixin');
var AsyncRouteRenderingMixin  = __browserify__('./lib/AsyncRouteRenderingMixin');
var RouteRenderingMixin       = __browserify__('./lib/RouteRenderingMixin');

var NavigatableMixin          = __browserify__('./lib/NavigatableMixin');

var environment               = __browserify__('./lib/environment');

module.exports = {
  Locations: Router.Locations,
  Pages: Router.Pages,

  Location: Route.Route,
  Page: Route.Route,
  NotFound: Route.NotFound,

  Link: Link,

  environment: environment,

  RouterMixin: RouterMixin,
  RouteRenderingMixin: RouteRenderingMixin,
  AsyncRouteRenderingMixin: AsyncRouteRenderingMixin,

  NavigatableMixin: NavigatableMixin
};

},{"./lib/AsyncRouteRenderingMixin":3,"./lib/Link":4,"./lib/NavigatableMixin":5,"./lib/Route":6,"./lib/RouteRenderingMixin":7,"./lib/Router":8,"./lib/RouterMixin":9,"./lib/environment":14}],"__main__":[function(__browserify__,module,exports){
module.exports=__browserify__('Focm2+');
},{}],3:[function(__browserify__,module,exports){
"use strict";

var merge               = (window.__ReactShim.merge);
var prefetchAsyncState  = (window.__ReactAsyncShim.prefetchAsyncState);
var isAsyncComponent    = (window.__ReactAsyncShim.isAsyncComponent);
var RouteRenderingMixin = __browserify__('./RouteRenderingMixin');

/**
 * Mixin for router components which prefetches state of async components
 * (as in react-async).
 */
var AsyncRouteRenderingMixin = {
  mixins: [RouteRenderingMixin],

  setRoutingState: function(state, cb) {
    var currentHandler = this.state && this.state.handler;
    var nextHandler = state && state.handler;

    if (nextHandler &&
        isAsyncComponent(nextHandler) &&
        // if component's type is the same we would need to skip async state
        // update
        !(currentHandler && currentHandler.type === nextHandler.type)) {
      // store pending state and start fetching async state of a new handler
      this.setState(
        {pendingState: state},
        this.prefetchMatchHandlerState.bind(null, state, cb)
      );
    } else {
      this.replaceState(state, cb);
    }
  },

  hasPendingUpdate: function() {
    return !!this.state.pendingState;
  },

  prefetchMatchHandlerState: function(state, cb) {
    prefetchAsyncState(state.handler, function(err, handler) {
      // check if we router is still mounted and have the same match in state
      // as we started fetching state with
      if (this.isMounted() &&
          this.state.pendingState &&
          this.state.pendingState.match === state.match) {

        var nextState = merge(this.state.pendingState, {handler: handler});
        this.replaceState(nextState, cb);

      }
    }.bind(this));
  }
};

module.exports = AsyncRouteRenderingMixin;

},{"./RouteRenderingMixin":7}],4:[function(__browserify__,module,exports){
"use strict";

var React             = (window.__ReactShim.React);
var NavigatableMixin  = __browserify__('./NavigatableMixin');
var Environment       = __browserify__('./environment');

/**
 * Link.
 *
 * A basic navigatable component which renders into <a> DOM element and handles
 * onClick event by transitioning onto different route (defined by
 * this.props.href).
 */
var Link = React.createClass({
  mixins: [NavigatableMixin],

  displayName: 'Link',

  propTypes: {
    href: React.PropTypes.string.isRequired,
    global: React.PropTypes.bool,
    globalHash: React.PropTypes.bool
  },

  onClick: function(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
    if (!e.defaultPrevented) {
      e.preventDefault();
      this._navigate(this.props.href, function(err) {
        if (err) {
          throw err;
        }
      });
    }
  },

  _navigationParams: function() {
    var params = {};
    for (var k in this.props) {
      if (!this.constructor.propTypes[k]) {
        params[k] = this.props[k];
      }
    }
    return params;
  },

  _createHref: function() {
    return this.props.global ?
      Environment.defaultEnvironment.makeHref(this.props.href) :
      this.makeHref(this.props.href);
  },

  _navigate: function(path, cb) {
    if (this.props.globalHash) {
      return Environment.hashEnvironment.navigate(path, cb);
    }

    if (this.props.global) {
      return Environment.defaultEnvironment.navigate(path, cb);
    }

    return this.navigate(path, this._navigationParams(), cb);
  },

  render: function() {
    var props = {
      onClick: this.onClick,
      href: this._createHref()
    };
    return this.transferPropsTo(React.DOM.a(props, this.props.children));
  }
});

module.exports = Link;

},{"./NavigatableMixin":5,"./environment":14}],5:[function(__browserify__,module,exports){
"use strict";

var React       = (window.__ReactShim.React);
var Environment = __browserify__('./environment');


/**
 * NavigatableMixin
 *
 * A mixin for a component which operates in context of a router and can
 * navigate to a different route using `navigate(path, cb)` method.
 */
var NavigatableMixin = {

  contextTypes: {
    router: React.PropTypes.component,
  },

  /**
   * @private
   */
  _getNavigable: function() {
    return this.context.router || Environment.defaultEnvironment;
  },

  getPath: function() {
    return this._getNavigable().getPath();
  },

  navigate: function(path, cb) {
    return this._getNavigable().navigate(path, cb);
  },

  makeHref: function(path) {
    return this._getNavigable().makeHref(path);
  }
};

module.exports = NavigatableMixin;

},{"./environment":14}],6:[function(__browserify__,module,exports){
"use strict";

var invariant = (window.__ReactShim.invariant);
var merge     = (window.__ReactShim.merge);
var mergeInto = (window.__ReactShim.mergeInto);

/**
 * Create a new route descriptor from a specification.
 *
 * @param {Object} spec
 * @param {?Object} defaults
 */
function createRoute(spec, defaults) {

  var handler = spec.handler;
  var path = spec.path;
  var ref = spec.ref;
  var props = merge({}, spec);

  delete props.path;
  delete props.handler;
  delete props.ref;

  var route = {
    path: path,
    handler: handler,
    props: props,
    ref: ref
  };

  if (defaults) {
    mergeInto(route, defaults);
  }

  invariant(
    typeof route.handler === 'function',
    "Route handler should be a component or a function but got: %s", handler
  );

  invariant(
    route.path !== undefined,
    "Route should have an URL pattern specified: %s", handler
  );

  return route;
}

/**
 * Regular route descriptor.
 *
 * @param {Object} spec
 */
function Route(spec) {
  return createRoute(spec);
}

/**
 * Catch all route descriptor.
 *
 * @param {Object} spec
 */
function NotFound(spec) {
  return createRoute(spec, {path: null});
}

module.exports = {
  Route: Route,
  NotFound: NotFound
};

},{}],7:[function(__browserify__,module,exports){
"use strict";

var cloneWithProps  = (window.__ReactShim.cloneWithProps);

/**
 * Mixin for routers which implements the simplest rendering strategy.
 */
var RouteRenderingMixin = {

  renderRouteHandler: function() {
    var ref = this.state.match.route && this.state.match.route.ref;
    return cloneWithProps(this.state.handler, {ref: ref});
  }

};

module.exports = RouteRenderingMixin;

},{}],8:[function(__browserify__,module,exports){
"use strict";

var React                     = (window.__ReactShim.React);
var RouterMixin               = __browserify__('./RouterMixin');
var AsyncRouteRenderingMixin  = __browserify__('./AsyncRouteRenderingMixin');

/**
 * Create a new router class
 *
 * @param {String} name
 * @param {ReactComponent} component
 */
function createRouter(name, component) {

  return React.createClass({

    mixins: [RouterMixin, AsyncRouteRenderingMixin],

    displayName: name,

    getRoutes: function(props) {
      return props.children;
    },

    getDefaultProps: function() {
      return {
        component: component
      }
    },

    render: function() {
      var handler = this.renderRouteHandler();
      return this.transferPropsTo(this.props.component(null, handler));
    }
  });
}

module.exports = {
  createRouter: createRouter,
  Locations: createRouter('Locations', React.DOM.div),
  Pages: createRouter('Pages', React.DOM.body),
}

},{"./AsyncRouteRenderingMixin":3,"./RouterMixin":9}],9:[function(__browserify__,module,exports){
"use strict";

var React         = (window.__ReactShim.React);
var invariant     = (window.__ReactShim.invariant);
var merge         = (window.__ReactShim.merge);
var matchRoutes   = __browserify__('./matchRoutes');
var Environment   = __browserify__('./environment');

var RouterMixin = {
  mixins: [Environment.Mixin],

  propTypes: {
    path: React.PropTypes.string,
    contextual: React.PropTypes.bool,
    onBeforeNavigation: React.PropTypes.func,
    onNavigation: React.PropTypes.func
  },

  childContextTypes: {
    router: React.PropTypes.component
  },

  getChildContext: function() {
    return {
      router: this
    };
  },

  contextTypes: {
    router: React.PropTypes.component
  },

  getInitialState: function() {
    return this.getRouterState(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    var nextState = this.getRouterState(nextProps);
    this.delegateSetRoutingState(nextState);
  },

  getRouterState: function(props) {
    var path;
    var prefix;

    var parent = this.getParentRouter();

    if (props.contextual && parent) {

      var parentMatch = parent.getMatch();

      invariant(
        props.path || isString(parentMatch.unmatchedPath),
        "contextual router has nothing to match on: %s", parentMatch.unmatchedPath
      );

      path = props.path || parentMatch.unmatchedPath;
      prefix = parentMatch.matchedPath;
    } else {

      path = props.path || this.getEnvironment().getPath();

      invariant(
        isString(path),
        ("router operate in environment which cannot provide path, " +
         "pass it a path prop; or probably you want to make it contextual")
      );

      prefix = '';
    }

    if (path[0] !== '/') {
      path = '/' + path;
    }

    var match = matchRoutes(this.getRoutes(props), path);
    var handler = match.getHandler();

    return {
      match: match,
      handler: handler,
      prefix: prefix,
      navigation: {}
    };
  },

  getEnvironment: function() {
    if (this.props.environment) {
      return this.props.environment;
    }
    if (this.props.hash) {
      return Environment.hashEnvironment;
    }
    if (this.props.contextual && this.context.router) {
      return this.context.router.getEnvironment();
    }
    return Environment.defaultEnvironment;
  },

  /**
   * Return parent router or undefined.
   */
  getParentRouter: function() {
    var current = this.context.router;
    var environment = this.getEnvironment();

    while (current) {
      if (current.getEnvironment() === environment) {
        return current;
      }
    }
  },

  /**
   * Return current match.
   */
  getMatch: function() {
    return this.state.match;
  },

  /**
   * Make href scoped for the current router.
   */
  makeHref: function(href) {
    return join(this.state.prefix, href);
  },

  /**
   * Navigate to a path
   *
   * @param {String} path
   * @param {Function} navigation
   * @param {Callback} cb
   */
  navigate: function(path, navigation, cb) {
    if (typeof navigation === 'function' && cb === undefined) {
      cb = navigation;
      navigation = {};
    }
    navigation = navigation || {};
    path = join(this.state.prefix, path);
    this.getEnvironment().setPath(path, navigation, cb);
  },

  /**
   * Set new path.
   *
   * This function is called by environment.
   *
   * @private
   *
   * @param {String} path
   * @param {Function} navigation
   * @param {Callback} cb
   */
  setPath: function(path, navigation, cb) {
    var match = matchRoutes(this.getRoutes(this.props), path);
    var handler = match.getHandler();

    var state = {
      match: match,
      handler: handler,
      prefix: this.state.prefix,
      navigation: navigation
    };

    navigation = merge(navigation, {match: match});

    if (this.props.onBeforeNavigation &&
        this.props.onBeforeNavigation(path, navigation) === false) {
      return;
    }

    if (navigation.onBeforeNavigation &&
        navigation.onBeforeNavigation(path, navigation) === false) {
      return;
    }

    this.delegateSetRoutingState(state, function() {
      if (this.props.onNavigation) {
        this.props.onNavigation();
      }
      cb();
    }.bind(this));
  },

  /**
   * Return the current path
   */
  getPath: function () {
    return this.state.match.path;
  },

  /**
   * Try to delegate state update to a setRoutingState method (might be provided
   * by router itself) or use replaceState.
   */
  delegateSetRoutingState: function(state, cb) {
    if (this.setRoutingState) {
      this.setRoutingState(state, cb);
    } else {
      this.replaceState(state, cb);
    }
  }

};

function join(a, b) {
  return (a + b).replace(/\/\//g, '/');
}

function isString(o) {
  return Object.prototype.toString.call(o) === '[object String]';
}

module.exports = RouterMixin;

},{"./environment":14,"./matchRoutes":15}],10:[function(__browserify__,module,exports){
"use strict";

var Environment   = __browserify__('./Environment');
var emptyFunction = (window.__ReactShim.emptyFunction);

/**
 * Dummy routing environment which provides no path.
 *
 * Should be used on server or in WebWorker.
 */
function DummyEnvironment() {
  Environment.call(this);
}

DummyEnvironment.prototype = Object.create(Environment.prototype);
DummyEnvironment.prototype.constructor = DummyEnvironment;

DummyEnvironment.prototype.getPath = emptyFunction.thatReturnsNull;

DummyEnvironment.prototype.setPath = function(path, cb) {
  this.path = path;
  cb();
};

DummyEnvironment.prototype.start = emptyFunction;

DummyEnvironment.prototype.stop = emptyFunction;

module.exports = DummyEnvironment;

},{"./Environment":11}],11:[function(__browserify__,module,exports){
"use strict";

var ReactUpdates  = (window.__ReactShim.ReactUpdates);

/**
 * Base abstract class for a routing environment.
 *
 * @private
 */
function Environment() {
  this.routers = [];
  this.path = this.getPath();
}

/**
 * Notify routers about the change.
 *
 * @param {Object} navigation
 * @param {Function} cb
 */
Environment.prototype.notify = function notify(navigation, cb) {
  var latch = this.routers.length;

  if (latch === 0) {
    return cb && cb();
  }

  function callback() {
    latch -= 1;
    if (cb && latch === 0) {
      cb();
    }
  }

  ReactUpdates.batchedUpdates(function() {
    for (var i = 0, len = this.routers.length; i < len; i++) {
      this.routers[i].setPath(this.path, navigation, callback);
    }
  }.bind(this));
}

Environment.prototype.makeHref = function makeHref(path) {
  return path;
}

Environment.prototype.navigate = function navigate(path, navigation, cb) {
  if (typeof navigation === 'function' && cb === undefined) {
    cb = navigation;
    navigation = {};
  }
  return this.setPath(path, navigation, cb);
}

Environment.prototype.setPath = function(path, navigation, cb) {
  if (!navigation.isPopState) {
    if (navigation.replace) {
      this.replaceState(path, navigation);
    } else {
      this.pushState(path, navigation);
    }
  }
  this.path = path;
  this.notify(navigation, cb);
}

/**
 * Register router with an environment.
 */
Environment.prototype.register = function register(router) {
  if (this.routers.length === 0) {
    this.start();
  }

  if (!router.getParentRouter()) {
    this.routers.push(router);
  }
}

/**
 * Unregister router from an environment.
 */
Environment.prototype.unregister = function unregister(router) {
  if (this.routers.indexOf(router) > -1) {
    this.routers.splice(this.routers.indexOf(router), 1);
  }

  if (this.routers.length === 0) {
    this.stop();
  }
}

module.exports = Environment;

},{}],12:[function(__browserify__,module,exports){
"use strict";

var Environment = __browserify__('./Environment');

/**
 * Routing environment which routes by `location.hash`.
 */
function HashEnvironment() {
  this.onHashChange = this.onHashChange.bind(this);
  Environment.call(this);
}

HashEnvironment.prototype = Object.create(Environment.prototype);
HashEnvironment.prototype.constructor = HashEnvironment;

HashEnvironment.prototype.getPath = function() {
  return window.location.hash.slice(1) || '/';
};

HashEnvironment.prototype.pushState = function(path, navigation) {
  window.location.hash = path;
}

HashEnvironment.prototype.replaceState = function(path, navigation) {
  var href = window.location.href.replace(/(javascript:|#).*$/, '');
  window.location.replace(href + '#' + path);
}

HashEnvironment.prototype.start = function() {
  window.addEventListener('hashchange', this.onHashChange);
};

HashEnvironment.prototype.stop = function() {
  window.removeEventListener('hashchange', this.onHashChange);
};

HashEnvironment.prototype.onHashChange = function() {
  var path = this.getPath();

  if (this.path !== path) {
    this.setPath(path, {isPopState: true});
  }
};

module.exports = HashEnvironment;

},{"./Environment":11}],13:[function(__browserify__,module,exports){
"use strict";

var Environment = __browserify__('./Environment');

/**
 * Routing environment which routes by `location.pathname`.
 */
function PathnameEnvironment() {
  this.onPopState = this.onPopState.bind(this);
  Environment.call(this);
}

PathnameEnvironment.prototype = Object.create(Environment.prototype);
PathnameEnvironment.prototype.constructor = PathnameEnvironment;

PathnameEnvironment.prototype.getPath = function() {
  return window.location.pathname;
}

PathnameEnvironment.prototype.pushState = function(path, navigation) {
  window.history.pushState({}, '', path);
}

PathnameEnvironment.prototype.replaceState = function(path, navigation) {
  window.history.replaceState({}, '', path);
}

PathnameEnvironment.prototype.start = function() {
  window.addEventListener('popstate', this.onPopState);
};

PathnameEnvironment.prototype.stop = function() {
  window.removeEventListener('popstate', this.onPopState);
};

PathnameEnvironment.prototype.onPopState = function(e) {
  var path = window.location.pathname;

  if (this.path !== path) {
    this.setPath(path, {isPopState: true});
  }
};

module.exports = PathnameEnvironment;

},{"./Environment":11}],14:[function(__browserify__,module,exports){
"use strict";
/**
 * Routing environment.
 *
 * It specifies how routers read its state from DOM and synchronise it back.
 */

var ExecutionEnvironment  = (window.__ReactShim.ExecutionEnvironment);
var DummyEnvironment      = __browserify__('./DummyEnvironment');
var Environment           = __browserify__('./Environment');

/**
 * Mixin for routes to keep attached to an environment.
 *
 * This mixin assumes the environment is passed via props.
 */
var Mixin = {

  componentDidMount: function() {
    this.getEnvironment().register(this);
  },

  componentWillUnmount: function() {
    this.getEnvironment().unregister(this);
  }
};

var PathnameEnvironment;
var HashEnvironment;

var pathnameEnvironment;
var hashEnvironment;
var defaultEnvironment;
var dummyEnvironment;

if (ExecutionEnvironment.canUseDOM) {

  PathnameEnvironment = __browserify__('./PathnameEnvironment');
  HashEnvironment     = __browserify__('./HashEnvironment');

  pathnameEnvironment = new PathnameEnvironment();
  hashEnvironment     = new HashEnvironment();
  defaultEnvironment  = (window.history !== undefined &&
                         window.history.pushState !== undefined) ?
                        pathnameEnvironment :
                        hashEnvironment;

} else {

  dummyEnvironment    = new DummyEnvironment();
  pathnameEnvironment = dummyEnvironment;
  hashEnvironment     = dummyEnvironment;
  defaultEnvironment  = dummyEnvironment;

}

module.exports = {
  pathnameEnvironment: pathnameEnvironment,
  hashEnvironment: hashEnvironment,
  defaultEnvironment: defaultEnvironment,
  dummyEnvironment: dummyEnvironment,

  Environment: Environment,
  PathnameEnvironment: PathnameEnvironment,
  HashEnvironment: HashEnvironment,

  Mixin: Mixin
};

},{"./DummyEnvironment":10,"./Environment":11,"./HashEnvironment":12,"./PathnameEnvironment":13}],15:[function(__browserify__,module,exports){
"use strict";

var urlMatch   = __browserify__('url-match');
var mergeInto = (window.__ReactShim.mergeInto);
var invariant = (window.__ReactShim.invariant);

/**
 * Match routes against a path
 *
 * @param {Array.<Route>} routes
 * @param {String} path
 */
function matchRoutes(routes, path) {
  var match, page, notFound;

  if (!Array.isArray(routes)) {
    routes = [routes];
  }

  for (var i = 0, len = routes.length; i < len; i++) {
    var current = routes[i];

    if ("development" !== "production") {
      invariant(
        current.handler !== undefined && current.path !== undefined,
        "Router should contain either Route or NotFound components " +
        "as routes")
    }

    if (current.path) {
      current.urlMatch = current.urlMatch || urlMatch.generate(current.path);
      if (!page) {
        match = current.urlMatch.match(path);
        if (match) {
          page = current;
        }
      }
    }
    if (!notFound && current.path === null) {
      notFound = current;
    }
  }

  return new Match(
    path,
    page ? page : notFound ? notFound : null,
    match
  );
}

/**
 * Match object
 *
 * @private
 */
function Match(path, route, match) {
  this.path = path;
  this.route = route;
  this.match = match;

  this.unmatchedPath = this.match && this.match._ ?
    this.match._[0] :
    null;

  this.matchedPath = this.unmatchedPath ?
    this.path.substring(0, this.path.length - this.unmatchedPath.length) :
    this.path;
}

Match.prototype.getHandler = function() {
  var props = {};
  if (this.match) {
    mergeInto(props, this.match.namedParams);
    props.queryParams = this.match.queryParams;
  }
  if (this.route && this.route.props) {
    mergeInto(props, this.route.props);
  }
  // we will set ref later during a render call
  delete props.ref;
  return this.route ? this.route.handler(props) : undefined;
}

module.exports = matchRoutes;

},{"url-match":17}],16:[function(__browserify__,module,exports){
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `__browserify__()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{}],17:[function(__browserify__,module,exports){
var _ = __browserify__("underscore");

var queryStringParam = /^\?(.*)/,
    optionalParam = /\((.*?)\)/g,
    namedParam    = /(\(\?)?:\w+/g,
    splatParam    = /\*\w+/g,
    escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g,
    fragmentStrip = /^([^\?]*)/,
    namesPattern = /[\:\*]([^\:\?\/]+)/g,
    routeStripper = /^[#\/]|\s+$/g,
    trailingSlash = /\/$/,
    arrayValueSplit = '|',
    Pattern;

Pattern =  {
  generate: function(route) {
    var splatMatch = (splatParam.exec(route) || {index: -1}),
        namedMatch = (namedParam.exec(route) || {index: -1}),
        paramNames = route.match(namesPattern) || [];

    route = route.replace(escapeRegExp, '\\$&')
                 .replace(optionalParam, '(?:$1)?')
                 .replace(namedParam, function(match, optional){
                   return optional ? match : '([^\\/\\?]+)';
                 })
                 // `[^??]` is hacking around a regular expression bug under iOS4.
                 // If only `[^?]` is used then paths like signin/photos will fail
                 // while paths with `?` anywhere, like `signin/photos?`, will succeed.
                 .replace(splatParam, '([^??]*?)');
    route += '(\\?.*)?';
    var rtn = new RegExp('^' + route + '$');

    // use the rtn value to hold some parameter data
    if (splatMatch.index >= 0) {
      // there is a splat
      if (namedMatch >= 0) {
        // negative value will indicate there is a splat match before any named matches
        rtn.splatMatch = splatMatch.index - namedMatch.index;
      } else {
        rtn.splatMatch = -1;
      }
    }
    rtn.paramNames = _.map(paramNames, function(name) { return name.substring(1); });
    rtn.namedParameters = this.namedParameters;
    rtn.match = function(fragment) {
      return Pattern.match(rtn, fragment);
    }

    return rtn;
  },

  /**
   * Given a route, and a URL fragment that it matches, return the array of
   * extracted parameters.
   */
  match: function(route, fragment) {
    var match = route.exec(fragment);

    if(match == null) return null;

    var params = match.slice(1),
        queryParams = {},
        namedParams = {};


    if (params.length > 0 && _.isUndefined(params[params.length - 1])) {
      // remove potential invalid data from query params match
      params.splice(params.length - 1, 1);
    }

    // do we have an additional query string?
    var match = params.length && params[params.length-1] && params[params.length-1].match(queryStringParam);
    if (match) {
      var queryString = match[1];
      if (queryString) {
        var self = this;
        iterateQueryString(queryString, function(name, value) {
          self.setParamValue(name, value, queryParams);
        });
      }
      params[params.length-1] = queryParams;
    }

    // decode params
    var length = params.length;
    // if (route.splatMatch && this.encodedSplatParts) {
    //   if (route.splatMatch < 0) {
    //     // splat param is first
    //     return params;
    //   } else {
    //     length = length - 1;
    //   }
    // }

    for (var i=0; i<length; i++) {
      if (_.isString(params[i])) {
        params[i] = parseParams(params[i]);
        if (route.paramNames && route.paramNames.length >= i-1) {
          namedParams[route.paramNames[i]] = params[i];
        }
      }
    }

    // return (Backbone.Router.namedParameters || route.namedParameters) ? [namedParams] : params;
    return { namedParams: namedParams, queryParams: queryParams};
  },

  /**
   * Set the parameter value on the data hash
   */
  setParamValue: function(key, value, data) {
    // use '.' to define hash separators
    key = key.replace('[]', '');
    key = key.replace('%5B%5D', '');
    var parts = key.split('.');
    var _data = data;
    for (var i=0; i<parts.length; i++) {
      var part = parts[i];
      if (i === parts.length-1) {
        // set the value
        _data[part] = this.decodeParamValue(value, _data[part]);
      } else {
        _data = _data[part] = _data[part] || {};
      }
    }
  },

  /**
   * Decode an individual parameter value (or list of values)
   * @param value the complete value
   * @param currentValue the currently known value (or list of values)
   */
  decodeParamValue: function(value, currentValue) {
    // '|' will indicate an array.  Array with 1 value is a=|b - multiple values can be a=b|c
    var splitChar = arrayValueSplit;
    if (splitChar && value.indexOf(splitChar) >= 0) {
      var values = value.split(splitChar);
      // clean it up
      for (var i=values.length-1; i>=0; i--) {
        if (!values[i]) {
          values.splice(i, 1);
        } else {
          values[i] = parseParams(values[i]);
        }
      }
      return values;
    }

    value = parseParams(value);
    if (!currentValue) {
      return value;
    } else if (_.isArray(currentValue)) {
      currentValue.push(value);
      return currentValue;
    } else {
      return [currentValue, value];
    }
  },

  /**
   * Return the route fragment with queryParameters serialized to query parameter string
   */
  toFragment: function(route, queryParameters) {
    if (queryParameters) {
      if (!_.isString(queryParameters)) {
        queryParameters = toQueryString(queryParameters);
      }
      if(queryParameters) {
        route += '?' + queryParameters;
      }
    }
    return route;
  }
};

/**
 * Serialize the val hash to query parameters and return it.  Use the namePrefix to prefix all param names (for recursion)
 */
function toQueryString(val, namePrefix) {
  /*jshint eqnull:true */
  var splitChar = arrayValueSplit;
  function encodeSplit(val) { return String(val).replace(splitChar, encodeURIComponent(splitChar)); }

  if (!val) {
    return '';
  }

  namePrefix = namePrefix || '';
  var rtn = [];
  _.each(val, function(_val, name) {
    name = namePrefix + name;

    if (_.isString(_val) || _.isNumber(_val) || _.isBoolean(_val) || _.isDate(_val)) {
      // primitive type
      if (_val != null) {
        rtn.push(name + '=' + encodeSplit(encodeURIComponent(_val)));
      }
    } else if (_.isArray(_val)) {
      // arrays use arrayValueSplit separator
      var str = '';
      for (var i = 0; i < _val.length; i++) {
        var param = _val[i];
        if (param != null) {
          str += splitChar + encodeSplit(param);
        }
      }
      if (str) {
        rtn.push(name + '=' + str);
      }
    } else {
      // dig into hash
      var result = toQueryString(_val, name + '.');
      if (result) {
        rtn.push(result);
      }
    }
  });

  return rtn.join('&');
}

function parseParams(value) {
  // decodeURIComponent doesn't touch '+'
  try {
    return decodeURIComponent(value.replace(/\+/g, ' '));
  } catch (err) {
    // Failover to whatever was passed if we get junk data
    return value;
  }
}

function iterateQueryString(queryString, callback) {
  var keyValues = queryString.split('&');
  _.each(keyValues, function(keyValue) {
    var arr = keyValue.split('=');
    callback(arr.shift(), arr.join('='));
  });
}
module.exports = Pattern;

},{"underscore":16}]},{},[])

  return require('__main__');
});
