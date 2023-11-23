!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("preact")):"function"==typeof define&&define.amd?define(["exports","preact"],t):t((e||self).preactRenderToString={},e.preact)}(this,function(e,t){var n=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,r=/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/,o=/[\s\n\\/='"\0<>]/,i=/^xlink:?./,s=/["&<]/;function a(e){if(!1===s.test(e+=""))return e;for(var t=0,n=0,r="",o="";n<e.length;n++){switch(e.charCodeAt(n)){case 34:o="&quot;";break;case 38:o="&amp;";break;case 60:o="&lt;";break;default:continue}n!==t&&(r+=e.slice(t,n)),r+=o,t=n+1}return n!==t&&(r+=e.slice(t,n)),r}var l=function(e,t){return String(e).replace(/(\n+)/g,"$1"+(t||"\t"))},f=function(e,t,n){return String(e).length>(t||40)||!n&&-1!==String(e).indexOf("\n")||-1!==String(e).indexOf("<")},u={},p=/([A-Z])/g;function c(e){var t="";for(var r in e){var o=e[r];null!=o&&""!==o&&(t&&(t+=" "),t+="-"==r[0]?r:u[r]||(u[r]=r.replace(p,"-$1").toLowerCase()),t="number"==typeof o&&!1===n.test(r)?t+": "+o+"px;":t+": "+o+";")}return t||void 0}function _(e,t){return Array.isArray(t)?t.reduce(_,e):null!=t&&!1!==t&&e.push(t),e}function d(){this.__d=!0}function v(e,t){return{__v:e,context:t,props:e.props,setState:d,forceUpdate:d,__d:!0,__h:[]}}function g(e,t){var n=e.contextType,r=n&&t[n.__c];return null!=n?r?r.props.value:n.__:t}var h=[];function y(e,n,s,u,p,d){if(null==e||"boolean"==typeof e)return"";if("object"!=typeof e)return"function"==typeof e?"":a(e);var m=s.pretty,b=m&&"string"==typeof m?m:"\t";if(Array.isArray(e)){for(var x="",k=0;k<e.length;k++)m&&k>0&&(x+="\n"),x+=y(e[k],n,s,u,p,d);return x}if(void 0!==e.constructor)return"";var S,w=e.type,C=e.props,O=!1;if("function"==typeof w){if(O=!0,!s.shallow||!u&&!1!==s.renderRootComponent){if(w===t.Fragment){var j=[];return _(j,e.props.children),y(j,n,s,!1!==s.shallowHighOrder,p,d)}var F,A=e.__c=v(e,n);t.options.__b&&t.options.__b(e);var T=t.options.__r;if(w.prototype&&"function"==typeof w.prototype.render){var H=g(w,n);(A=e.__c=new w(C,H)).__v=e,A._dirty=A.__d=!0,A.props=C,null==A.state&&(A.state={}),null==A._nextState&&null==A.__s&&(A._nextState=A.__s=A.state),A.context=H,w.getDerivedStateFromProps?A.state=Object.assign({},A.state,w.getDerivedStateFromProps(A.props,A.state)):A.componentWillMount&&(A.componentWillMount(),A.state=A._nextState!==A.state?A._nextState:A.__s!==A.state?A.__s:A.state),T&&T(e),F=A.render(A.props,A.state,A.context)}else for(var M=g(w,n),L=0;A.__d&&L++<25;)A.__d=!1,T&&T(e),F=w.call(e.__c,C,M);return A.getChildContext&&(n=Object.assign({},n,A.getChildContext())),t.options.diffed&&t.options.diffed(e),y(F,n,s,!1!==s.shallowHighOrder,p,d)}w=(S=w).displayName||S!==Function&&S.name||function(e){var t=(Function.prototype.toString.call(e).match(/^\s*function\s+([^( ]+)/)||"")[1];if(!t){for(var n=-1,r=h.length;r--;)if(h[r]===e){n=r;break}n<0&&(n=h.push(e)-1),t="UnnamedComponent"+n}return t}(S)}var E,$,D="<"+w;if(C){var N=Object.keys(C);s&&!0===s.sortAttributes&&N.sort();for(var P=0;P<N.length;P++){var R=N[P],W=C[R];if("children"!==R){if(!o.test(R)&&(s&&s.allAttributes||"key"!==R&&"ref"!==R&&"__self"!==R&&"__source"!==R)){if("defaultValue"===R)R="value";else if("defaultChecked"===R)R="checked";else if("defaultSelected"===R)R="selected";else if("className"===R){if(void 0!==C.class)continue;R="class"}else p&&i.test(R)&&(R=R.toLowerCase().replace(/^xlink:?/,"xlink:"));if("htmlFor"===R){if(C.for)continue;R="for"}"style"===R&&W&&"object"==typeof W&&(W=c(W)),"a"===R[0]&&"r"===R[1]&&"boolean"==typeof W&&(W=String(W));var q=s.attributeHook&&s.attributeHook(R,W,n,s,O);if(q||""===q)D+=q;else if("dangerouslySetInnerHTML"===R)$=W&&W.__html;else if("textarea"===w&&"value"===R)E=W;else if((W||0===W||""===W)&&"function"!=typeof W){if(!(!0!==W&&""!==W||(W=R,s&&s.xml))){D=D+" "+R;continue}if("value"===R){if("select"===w){d=W;continue}"option"===w&&d==W&&void 0===C.selected&&(D+=" selected")}D=D+" "+R+'="'+a(W)+'"'}}}else E=W}}if(m){var I=D.replace(/\n\s*/," ");I===D||~I.indexOf("\n")?m&&~D.indexOf("\n")&&(D+="\n"):D=I}if(D+=">",o.test(w))throw new Error(w+" is not a valid HTML tag name in "+D);var U,V=r.test(w)||s.voidElements&&s.voidElements.test(w),z=[];if($)m&&f($)&&($="\n"+b+l($,b)),D+=$;else if(null!=E&&_(U=[],E).length){for(var Z=m&&~D.indexOf("\n"),B=!1,G=0;G<U.length;G++){var J=U[G];if(null!=J&&!1!==J){var K=y(J,n,s,!0,"svg"===w||"foreignObject"!==w&&p,d);if(m&&!Z&&f(K)&&(Z=!0),K)if(m){var Q=K.length>0&&"<"!=K[0];B&&Q?z[z.length-1]+=K:z.push(K),B=Q}else z.push(K)}}if(m&&Z)for(var X=z.length;X--;)z[X]="\n"+b+l(z[X],b)}if(z.length||$)D+=z.join("");else if(s&&s.xml)return D.substring(0,D.length-1)+" />";return!V||U||$?(m&&~D.indexOf("\n")&&(D+="\n"),D=D+"</"+w+">"):D=D.replace(/>$/," />"),D}var m={shallow:!0};k.render=k;var b=function(e,t){return k(e,t,m)},x=[];function k(e,n,r){n=n||{};var o=t.options.__s;t.options.__s=!0;var i,s=t.h(t.Fragment,null);return s.__k=[e],i=r&&(r.pretty||r.voidElements||r.sortAttributes||r.shallow||r.allAttributes||r.xml||r.attributeHook)?y(e,n,r):F(e,n,!1,void 0,s),t.options.__c&&t.options.__c(e,x),t.options.__s=o,x.length=0,i}function S(e){return null==e||"boolean"==typeof e?null:"string"==typeof e||"number"==typeof e||"bigint"==typeof e?t.h(null,null,e):e}function w(e,t){return"className"===e?"class":"htmlFor"===e?"for":"defaultValue"===e?"value":"defaultChecked"===e?"checked":"defaultSelected"===e?"selected":t&&i.test(e)?e.toLowerCase().replace(/^xlink:?/,"xlink:"):e}function C(e,t){return"style"===e&&null!=t&&"object"==typeof t?c(t):"a"===e[0]&&"r"===e[1]&&"boolean"==typeof t?String(t):t}var O=Array.isArray,j=Object.assign;function F(e,n,i,s,l){if(null==e||!0===e||!1===e||""===e)return"";if("object"!=typeof e)return"function"==typeof e?"":a(e);if(O(e)){var f="";l.__k=e;for(var u=0;u<e.length;u++)f+=F(e[u],n,i,s,l),e[u]=S(e[u]);return f}if(void 0!==e.constructor)return"";e.__=l,t.options.__b&&t.options.__b(e);var p=e.type,c=e.props;if("function"==typeof p){var _;if(p===t.Fragment)_=c.children;else{_=p.prototype&&"function"==typeof p.prototype.render?function(e,n){var r=e.type,o=g(r,n),i=new r(e.props,o);e.__c=i,i.__v=e,i.__d=!0,i.props=e.props,null==i.state&&(i.state={}),null==i.__s&&(i.__s=i.state),i.context=o,r.getDerivedStateFromProps?i.state=j({},i.state,r.getDerivedStateFromProps(i.props,i.state)):i.componentWillMount&&(i.componentWillMount(),i.state=i.__s!==i.state?i.__s:i.state);var s=t.options.__r;return s&&s(e),i.render(i.props,i.state,i.context)}(e,n):function(e,n){var r,o=v(e,n),i=g(e.type,n);e.__c=o;for(var s=t.options.__r,a=0;o.__d&&a++<25;)o.__d=!1,s&&s(e),r=e.type.call(o,e.props,i);return r}(e,n);var d=e.__c;d.getChildContext&&(n=j({},n,d.getChildContext()))}var h=F(_=null!=_&&_.type===t.Fragment&&null==_.key?_.props.children:_,n,i,s,e);return t.options.diffed&&t.options.diffed(e),e.__=void 0,t.options.unmount&&t.options.unmount(e),h}var y,m,b="<";if(b+=p,c)for(var x in y=c.children,c){var k=c[x];if(!("key"===x||"ref"===x||"__self"===x||"__source"===x||"children"===x||"className"===x&&"class"in c||"htmlFor"===x&&"for"in c||o.test(x)))if(k=C(x=w(x,i),k),"dangerouslySetInnerHTML"===x)m=k&&k.__html;else if("textarea"===p&&"value"===x)y=k;else if((k||0===k||""===k)&&"function"!=typeof k){if(!0===k||""===k){k=x,b=b+" "+x;continue}if("value"===x){if("select"===p){s=k;continue}"option"!==p||s!=k||"selected"in c||(b+=" selected")}b=b+" "+x+'="'+a(k)+'"'}}var A=b;if(b+=">",o.test(p))throw new Error(p+" is not a valid HTML tag name in "+b);var T="",H=!1;if(m)T+=m,H=!0;else if("string"==typeof y)T+=a(y),H=!0;else if(O(y)){e.__k=y;for(var M=0;M<y.length;M++){var L=y[M];if(y[M]=S(L),null!=L&&!1!==L){var E=F(L,n,"svg"===p||"foreignObject"!==p&&i,s,e);E&&(T+=E,H=!0)}}}else if(null!=y&&!1!==y&&!0!==y){e.__k=[S(y)];var $=F(y,n,"svg"===p||"foreignObject"!==p&&i,s,e);$&&(T+=$,H=!0)}if(t.options.diffed&&t.options.diffed(e),e.__=void 0,t.options.unmount&&t.options.unmount(e),H)b+=T;else if(r.test(p))return A+" />";return b+"</"+p+">"}k.shallowRender=b,e.default=k,e.render=k,e.renderToStaticMarkup=k,e.renderToString=k,e.shallowRender=b});
//# sourceMappingURL=index.js.map
