var n=require("preact"),t=require("preact/hooks");function e(n,t){for(var e in t)n[e]=t[e];return n}function r(n,t){for(var e in n)if("__source"!==e&&!(e in t))return!0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return!0;return!1}function u(n,t){return n===t&&(0!==n||1/n==1/t)||n!=n&&t!=t}function o(n){this.props=n}function i(t,e){function u(n){var t=this.props.ref,u=t==n.ref;return!u&&t&&(t.call?t(null):t.current=null),e?!e(this.props,n)||!u:r(this.props,n)}function o(e){return this.shouldComponentUpdate=u,n.createElement(t,e)}return o.displayName="Memo("+(t.displayName||t.name)+")",o.prototype.isReactComponent=!0,o.__f=!0,o}(o.prototype=new n.Component).isPureReactComponent=!0,o.prototype.shouldComponentUpdate=function(n,t){return r(this.props,n)||r(this.state,t)};var l=n.options.__b;n.options.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),l&&l(n)};var c="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function f(n){function t(t){var r=e({},t);return delete r.ref,n(r,t.ref||null)}return t.$$typeof=c,t.render=t,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var a=function(t,e){return null==t?null:n.toChildArray(n.toChildArray(t).map(e))},s={map:a,forEach:a,count:function(t){return t?n.toChildArray(t).length:0},only:function(t){var e=n.toChildArray(t);if(1!==e.length)throw"Children.only";return e[0]},toArray:n.toChildArray},p=n.options.__e;n.options.__e=function(n,t,e,r){if(n.then)for(var u,o=t;o=o.__;)if((u=o.__c)&&u.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),u.__c(n,t);p(n,t,e,r)};var h=n.options.unmount;function v(n,t,r){return n&&(n.__c&&n.__c.__H&&(n.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c()}),n.__c.__H=null),null!=(n=e({},n)).__c&&(n.__c.__P===r&&(n.__c.__P=t),n.__c=null),n.__k=n.__k&&n.__k.map(function(n){return v(n,t,r)})),n}function d(n,t,e){return n&&(n.__v=null,n.__k=n.__k&&n.__k.map(function(n){return d(n,t,e)}),n.__c&&n.__c.__P===t&&(n.__e&&e.insertBefore(n.__e,n.__d),n.__c.__e=!0,n.__c.__P=e)),n}function m(){this.__u=0,this.t=null,this.__b=null}function x(n){var t=n.__.__c;return t&&t.__a&&t.__a(n)}function b(t){var e,r,u;function o(o){if(e||(e=t()).then(function(n){r=n.default||n},function(n){u=n}),u)throw u;if(!r)throw e;return n.createElement(r,o)}return o.displayName="Lazy",o.__f=!0,o}function _(){this.u=null,this.o=null}n.options.unmount=function(n){var t=n.__c;t&&t.__R&&t.__R(),t&&!0===n.__h&&(n.type=null),h&&h(n)},(m.prototype=new n.Component).__c=function(n,t){var e=t.__c,r=this;null==r.t&&(r.t=[]),r.t.push(e);var u=x(r.__v),o=!1,i=function(){o||(o=!0,e.__R=null,u?u(l):l())};e.__R=i;var l=function(){if(!--r.__u){if(r.state.__a){var n=r.state.__a;r.__v.__k[0]=d(n,n.__c.__P,n.__c.__O)}var t;for(r.setState({__a:r.__b=null});t=r.t.pop();)t.forceUpdate()}},c=!0===t.__h;r.__u++||c||r.setState({__a:r.__b=r.__v.__k[0]}),n.then(i,i)},m.prototype.componentWillUnmount=function(){this.t=[]},m.prototype.render=function(t,e){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),u=this.__v.__k[0].__c;this.__v.__k[0]=v(this.__b,r,u.__O=u.__P)}this.__b=null}var o=e.__a&&n.createElement(n.Fragment,null,t.fallback);return o&&(o.__h=null),[n.createElement(n.Fragment,null,e.__a?null:t.children),o]};var y=function(n,t,e){if(++e[1]===e[0]&&n.o.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.o.size))for(e=n.u;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.u=e=e[2]}};function g(n){return this.getChildContext=function(){return n.context},n.children}function S(t){var e=this,r=t.i;e.componentWillUnmount=function(){n.render(null,e.l),e.l=null,e.i=null},e.i&&e.i!==r&&e.componentWillUnmount(),t.__v?(e.l||(e.i=r,e.l={nodeType:1,parentNode:r,childNodes:[],appendChild:function(n){this.childNodes.push(n),e.i.appendChild(n)},insertBefore:function(n,t){this.childNodes.push(n),e.i.appendChild(n)},removeChild:function(n){this.childNodes.splice(this.childNodes.indexOf(n)>>>1,1),e.i.removeChild(n)}}),n.render(n.createElement(g,{context:e.context},t.__v),e.l)):e.l&&e.componentWillUnmount()}function C(t,e){var r=n.createElement(S,{__v:t,i:e});return r.containerInfo=e,r}(_.prototype=new n.Component).__a=function(n){var t=this,e=x(t.__v),r=t.o.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),y(t,n,r)):u()};e?e(o):o()}},_.prototype.render=function(t){this.u=null,this.o=new Map;var e=n.toChildArray(t.children);t.revealOrder&&"b"===t.revealOrder[0]&&e.reverse();for(var r=e.length;r--;)this.o.set(e[r],this.u=[1,0,this.u]);return t.children},_.prototype.componentDidUpdate=_.prototype.componentDidMount=function(){var n=this;this.o.forEach(function(t,e){y(n,e,t)})};var E="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,O=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,w="undefined"!=typeof document,R=function(n){return("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/i:/fil|che|ra/i).test(n)};function j(t,e,r){return null==e.__k&&(e.textContent=""),n.render(t,e),"function"==typeof r&&r(),t?t.__c:null}function N(t,e,r){return n.hydrate(t,e),"function"==typeof r&&r(),t?t.__c:null}n.Component.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(t){Object.defineProperty(n.Component.prototype,t,{configurable:!0,get:function(){return this["UNSAFE_"+t]},set:function(n){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:n})}})});var k=n.options.event;function A(){}function T(){return this.cancelBubble}function I(){return this.defaultPrevented}n.options.event=function(n){return k&&(n=k(n)),n.persist=A,n.isPropagationStopped=T,n.isDefaultPrevented=I,n.nativeEvent=n};var L,U={configurable:!0,get:function(){return this.class}},D=n.options.vnode;n.options.vnode=function(t){var e=t.type,r=t.props,u=r;if("string"==typeof e){var o=-1===e.indexOf("-");for(var i in u={},r){var l=r[i];w&&"children"===i&&"noscript"===e||"value"===i&&"defaultValue"in r&&null==l||("defaultValue"===i&&"value"in r&&null==r.value?i="value":"download"===i&&!0===l?l="":/ondoubleclick/i.test(i)?i="ondblclick":/^onchange(textarea|input)/i.test(i+e)&&!R(r.type)?i="oninput":/^onfocus$/i.test(i)?i="onfocusin":/^onblur$/i.test(i)?i="onfocusout":/^on(Ani|Tra|Tou|BeforeInp|Compo)/.test(i)?i=i.toLowerCase():o&&O.test(i)?i=i.replace(/[A-Z0-9]/g,"-$&").toLowerCase():null===l&&(l=void 0),/^oninput$/i.test(i)&&(i=i.toLowerCase(),u[i]&&(i="oninputCapture")),u[i]=l)}"select"==e&&u.multiple&&Array.isArray(u.value)&&(u.value=n.toChildArray(r.children).forEach(function(n){n.props.selected=-1!=u.value.indexOf(n.props.value)})),"select"==e&&null!=u.defaultValue&&(u.value=n.toChildArray(r.children).forEach(function(n){n.props.selected=u.multiple?-1!=u.defaultValue.indexOf(n.props.value):u.defaultValue==n.props.value})),t.props=u,r.class!=r.className&&(U.enumerable="className"in r,null!=r.className&&(u.class=r.className),Object.defineProperty(u,"className",U))}t.$$typeof=E,D&&D(t)};var F=n.options.__r;n.options.__r=function(n){F&&F(n),L=n.__c};var M=n.options.diffed;n.options.diffed=function(n){M&&M(n);var t=n.props,e=n.__e;null!=e&&"textarea"===n.type&&"value"in t&&t.value!==e.value&&(e.value=null==t.value?"":t.value),L=null};var V={ReactCurrentDispatcher:{current:{readContext:function(n){return L.__n[n.__c].props.value}}}};function W(t){return n.createElement.bind(null,t)}function P(n){return!!n&&n.$$typeof===E}function $(t){return P(t)?n.cloneElement.apply(null,arguments):t}function z(t){return!!t.__k&&(n.render(null,t),!0)}function B(n){return n&&(n.base||1===n.nodeType&&n)||null}var q=function(n,t){return n(t)},H=function(n,t){return n(t)},Z=n.Fragment;function Y(n){n()}function G(n){return n}function J(){return[!1,Y]}var K=t.useLayoutEffect;function Q(n,e){var r=e(),o=t.useState({p:{__:r,h:e}}),i=o[0].p,l=o[1];return t.useLayoutEffect(function(){i.__=r,i.h=e,u(i.__,e())||l({p:i})},[n,r,e]),t.useEffect(function(){return u(i.__,i.h())||l({p:i}),n(function(){u(i.__,i.h())||l({p:i})})},[n]),r}var X={useState:t.useState,useId:t.useId,useReducer:t.useReducer,useEffect:t.useEffect,useLayoutEffect:t.useLayoutEffect,useInsertionEffect:K,useTransition:J,useDeferredValue:G,useSyncExternalStore:Q,startTransition:Y,useRef:t.useRef,useImperativeHandle:t.useImperativeHandle,useMemo:t.useMemo,useCallback:t.useCallback,useContext:t.useContext,useDebugValue:t.useDebugValue,version:"17.0.2",Children:s,render:j,hydrate:N,unmountComponentAtNode:z,createPortal:C,createElement:n.createElement,createContext:n.createContext,createFactory:W,cloneElement:$,createRef:n.createRef,Fragment:n.Fragment,isValidElement:P,findDOMNode:B,Component:n.Component,PureComponent:o,memo:i,forwardRef:f,flushSync:H,unstable_batchedUpdates:q,StrictMode:Z,Suspense:m,SuspenseList:_,lazy:b,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:V};Object.defineProperty(exports,"Component",{enumerable:!0,get:function(){return n.Component}}),Object.defineProperty(exports,"Fragment",{enumerable:!0,get:function(){return n.Fragment}}),Object.defineProperty(exports,"createContext",{enumerable:!0,get:function(){return n.createContext}}),Object.defineProperty(exports,"createElement",{enumerable:!0,get:function(){return n.createElement}}),Object.defineProperty(exports,"createRef",{enumerable:!0,get:function(){return n.createRef}}),exports.Children=s,exports.PureComponent=o,exports.StrictMode=Z,exports.Suspense=m,exports.SuspenseList=_,exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=V,exports.cloneElement=$,exports.createFactory=W,exports.createPortal=C,exports.default=X,exports.findDOMNode=B,exports.flushSync=H,exports.forwardRef=f,exports.hydrate=N,exports.isValidElement=P,exports.lazy=b,exports.memo=i,exports.render=j,exports.startTransition=Y,exports.unmountComponentAtNode=z,exports.unstable_batchedUpdates=q,exports.useDeferredValue=G,exports.useInsertionEffect=K,exports.useSyncExternalStore=Q,exports.useTransition=J,exports.version="17.0.2",Object.keys(t).forEach(function(n){"default"===n||exports.hasOwnProperty(n)||Object.defineProperty(exports,n,{enumerable:!0,get:function(){return t[n]}})});
//# sourceMappingURL=compat.js.map
