module.exports=function(e){function t(n){if(r[n])return r[n].exports;var a=r[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=8)}([function(e,t){e.exports=require("babel-runtime/regenerator")},function(e,t){e.exports=require("babel-runtime/helpers/asyncToGenerator")},function(e,t){e.exports=require("azure-storage")},function(e,t){e.exports=require("babel-runtime/helpers/classCallCheck")},function(e,t){e.exports=require("babel-runtime/helpers/createClass")},function(e,t){e.exports=require("moment")},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=r(0),u=n(a),s=r(1),i=n(s),c=r(3),o=n(c),f=r(4),l=n(f),p=r(7),h=function(){function e(t,r,n){(0,o.default)(this,e),this.query=t,this.tableService=r,this.operation=n}return(0,l.default)(e,[{key:"run",value:function(){function e(){return t.apply(this,arguments)}var t=(0,i.default)(u.default.mark(function e(){var t=this;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,"getUrl"!==this.operation){e.next=3;break}throw new Error("This API is not yet implemented");case 3:return e.next=5,(0,p.asyncIt)(function(e){return t.tableService[t.operation](t.query.tableName,e)}).then(function(e){return e});case 5:return e.abrupt("return",e.sent);case 8:return e.prev=8,e.t0=e.catch(0),e.abrupt("return",e.t0);case 11:case"end":return e.stop()}},e,this,[[0,8]])}));return e}()}]),e}();t.default=h},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.asyncIt=void 0;var a=r(0),u=n(a),s=r(1),i=n(s);t.asyncIt=function(){var e=(0,i.default)(u.default.mark(function e(t){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.abrupt("return",new Promise(function(e,r){try{t(function(t,n){t&&r(t),e(n)})}catch(e){r(e)}}));case 4:return e.prev=4,e.t0=e.catch(0),e.abrupt("return",e.t0);case 7:case"end":return e.stop()}},e,void 0,[[0,4]])}));return function(t){return e.apply(this,arguments)}}()},function(e,t,r){"use strict";"use latest";function n(e){return e&&e.__esModule?e:{default:e}}var a=r(0),u=n(a),s=r(1),i=n(s),c=r(2),o=n(c),f=r(9),l=n(f),p=r(10),h=n(p),d=r(5),v=n(d),b=r(6),y=n(b),x=r(11),m=n(x);e.exports=function(e,t){var r=o.default.createTableService(e.secrets.TABLE_STORAGE_CONNECTION_STRING),n=new l.default({consumer_key:e.secrets.TWITTER_CONSUMER_KEY,consumer_secret:e.secrets.TWITTER_CONSUMER_SECRET,access_token:e.secrets.TWITTER_ACCESS_TOKEN,access_token_secret:e.secrets.TWITTER_ACCESS_TOKEN_SECRET,timeout_ms:6e4}),a={q:"auth0",result_type:"recent",count:100,lang:"en"};w(r).then(function(e){k(n,a).then(function(e){E(r,e).then(function(r){t(null,e)})})})};var w=function(){var e=(0,i.default)(u.default.mark(function e(t){var r;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,r=new y.default({tableName:"twitterSentimentAnalysis"},t,"createTableIfNotExists"),e.next=4,r.run().then(function(e){return console.log("response - ",e),e instanceof Error?{status:e.status?e.status:500,body:{message:e.message?e.message:"Unknown Error!",stackTrace:e.stack?e.stack:""}}:{status:e.status?e.status:200,body:"ok",headers:{"content-type":"application/json"}}}).then(function(e){return e});case 4:return e.abrupt("return",e.sent);case 7:return e.prev=7,e.t0=e.catch(0),console.log(e.t0),e.abrupt("return",e.t0);case 11:case 12:case"end":return e.stop()}},e,void 0,[[0,7]])}));return function(t){return e.apply(this,arguments)}}(),k=function(){var e=(0,i.default)(u.default.mark(function e(t,r){var n;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,_(t,r,[]).then(function(e){for(var t=[],r=0;r<e.length;){var n=!0,a=!1,u=void 0;try{for(var s,i=e[Symbol.iterator]();!(n=(s=i.next()).done);n=!0){var c=s.value;r++;var o=(0,h.default)(c.text),f={PartitionKey:"auth0Tweets",RowKey:c.id_str,id:c.id_str,text:c.text,user:c.user.screen_name,created_at:(0,v.default)(c.created_at.slice(4),"MMM DD HH:mm:ss ZZ YYYY","en").format(),user_followers_count:c.user.followers_count,hashtags:c.entities.hashtags,geo:c.geo,score:o.score,comparative:o.comparative,positive:o.positive,negative:o.negative};t.push(f)}}catch(e){a=!0,u=e}finally{try{!n&&i.return&&i.return()}finally{if(a)throw u}}}return t});case 3:return n=e.sent,e.abrupt("return",n);case 7:return e.prev=7,e.t0=e.catch(0),console.log(e.t0),e.abrupt("return",e.t0);case 11:case 12:case"end":return e.stop()}},e,void 0,[[0,7]])}));return function(t,r){return e.apply(this,arguments)}}(),_=function(){var e=(0,i.default)(u.default.mark(function e(t,r,n,a){var s,i;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=function(e,n){if(!e.length)return n;n.length&&e.shift(),n=n.concat(e);var a=parseInt(n[n.length-1].id_str);return e.length?_(t,r,n,a):void 0},e.prev=1,a&&(r.max_id=a),e.next=5,t.get("search/tweets",r).then(function(e){return e.data.statuses?i(e.data.statuses,n):n}).catch(function(e){console.log("caught error",e.stack)});case 5:return s=e.sent,e.abrupt("return",s);case 9:return e.prev=9,e.t0=e.catch(1),console.log(e.t0),e.abrupt("return",e.t0);case 13:case 15:case"end":return e.stop()}},e,void 0,[[1,9]])}));return function(t,r,n,a){return e.apply(this,arguments)}}(),E=function(){var e=(0,i.default)(u.default.mark(function e(t,r){var n;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=new m.default({tableName:"twitterSentimentAnalysis",data:r},t,"insertOrReplaceEntity"),e.next=4,n.run().then(function(e){return e instanceof Error?(console.log("error in response"),{status:e.status?e.status:500,body:{message:e.message?e.message:"Unknown Error!",stackTrace:e.stack?e.stack:""}}):{status:e.status?e.status:200,body:"ok",headers:{"content-type":"application/json"}}}).then(function(e){return e});case 4:return e.abrupt("return",e.sent);case 7:return e.prev=7,e.t0=e.catch(0),console.log(e.t0),e.abrupt("return",e.t0);case 11:case 12:case"end":return e.stop()}},e,void 0,[[0,7]])}));return function(t,r){return e.apply(this,arguments)}}()},function(e,t){e.exports=require("twit")},function(e,t){e.exports=require("sentiment")},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=r(0),u=n(a),s=r(12),i=n(s),c=r(1),o=n(c),f=r(3),l=n(f),p=r(4),h=n(p),d=r(2),v=n(d),b=r(7),y=r(13),x=n(y),m=function(){function e(t,r,n){(0,l.default)(this,e),this.query=t,this.tableService=r,this.operation=n,this.utils=new x.default,this.serializeEntity=this.utils.serializeEntity,this.deserializeEntity=this.utils.deserializeEntity,this.ensureTableExists=this.utils.ensureTableExists}return(0,h.default)(e,[{key:"run",value:function(){function e(){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(){var t,r,n,a,s,c,f,l,p,h,d,b,y,x,m,w,k=this;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:e.prev=0,t=0,r=0,n="retrieveEntity"===this.operation?1:100,a=[],s=[],c=(0,i.default)(this.query.data)===Object?[this.query.data]:this.query.data,f=Math.ceil(c.length/n);case 8:if(!(t<=f-1)){e.next=47;break}l=new v.default.TableBatch,p=!0,h=!1,d=void 0,e.prev=13,b=c.slice(r,r+n)[Symbol.iterator]();case 15:if(p=(y=b.next()).done){e.next=28;break}return x=y.value,e.next=19,this.serializeEntity(x);case 19:if(!((x=e.sent)instanceof Error)){e.next=24;break}throw x;case 24:"retrieveEntity"===this.operation?l[this.operation](x.PartitionKey._,x.RowKey._):l[this.operation](x,{echoContent:!0});case 25:p=!0,e.next=15;break;case 28:e.next=34;break;case 30:e.prev=30,e.t0=e.catch(13),h=!0,d=e.t0;case 34:e.prev=34,e.prev=35,!p&&b.return&&b.return();case 37:if(e.prev=37,!h){e.next=40;break}throw d;case 40:return e.finish(37);case 41:return e.finish(34);case 42:t++,r+=n,s.push(l),e.next=8;break;case 47:return e.next=49,Promise.all(s.map(function(){var e=(0,o.default)(u.default.mark(function e(t){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,k.executeBatch(k.query.tableName,k.tableService,t).then(function(e){a=a.concat(e)});case 3:e.next=8;break;case 5:throw e.prev=5,e.t0=e.catch(0),e.t0;case 8:case 9:case"end":return e.stop()}},e,k,[[0,5]])}));return function(t){return e.apply(this,arguments)}}())).then(function(e){if("retrieveEntity"===k.operation){var t=0;return function(){var e=(0,o.default)(u.default.mark(function e(){var r,n,s,i,c,o;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:e.prev=0;case 1:if(!(t<a.length)){e.next=32;break}r=!0,n=!1,s=void 0,e.prev=5,i=a[Symbol.iterator]();case 7:if(r=(c=i.next()).done){e.next=16;break}return o=c.value,e.next=11,k.deserializeEntity(o.entity);case 11:o.entity=e.sent,t++;case 13:r=!0,e.next=7;break;case 16:e.next=22;break;case 18:e.prev=18,e.t0=e.catch(5),n=!0,s=e.t0;case 22:e.prev=22,e.prev=23,!r&&i.return&&i.return();case 25:if(e.prev=25,!n){e.next=28;break}throw s;case 28:return e.finish(25);case 29:return e.finish(22);case 30:e.next=1;break;case 32:return e.abrupt("return",a);case 35:throw e.prev=35,e.t1=e.catch(0),e.t1;case 38:case 39:case"end":return e.stop()}},e,k,[[0,35],[5,18,22,30],[23,,25,29]])}));return function(){return e.apply(this,arguments)}}()().then(function(e){return e})}return a});case 49:return m=e.sent,e.next=52,this.ensureTableExists(this.query,this.tableService).then(function(e){if(e)return m});case 52:return w=e.sent,e.abrupt("return",w);case 56:return e.prev=56,e.t1=e.catch(0),e.abrupt("return",e.t1);case 59:case"end":return e.stop()}},e,this,[[0,56],[13,30,34,42],[35,,37,41]])}));return e}()},{key:"executeBatch",value:function(){function e(e,r,n){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(t,r,n){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,(0,b.asyncIt)(function(e){return r.executeBatch(t,n,e)}).then(function(e){return e});case 3:return e.abrupt("return",e.sent);case 6:return e.prev=6,e.t0=e.catch(0),e.abrupt("return",e.t0);case 9:case"end":return e.stop()}},e,this,[[0,6]])}));return e}()}]),e}();t.default=m},function(e,t){e.exports=require("babel-runtime/helpers/typeof")},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=r(0),u=n(a),s=r(14),i=n(s),c=r(1),o=n(c),f=r(3),l=n(f),p=r(4),h=n(p),d=r(2),v=n(d),b=r(15),y=n(b),x=r(16),m=n(x),w=r(5),k=n(w),_=r(6),E=n(_),g=function(){function e(){(0,l.default)(this,e),this.entGen=v.default.TableUtilities.entityGenerator,this.tableOps=E.default,this.isGuid=y.default,this.keyRegEx=new RegExp("[^A-Za-z0-9_]"),this.propertyNameRegEx=new RegExp("^[a-zA-Z_-][a-zA-Z0-9_-]*$"),this.momentDateParseArray=["MM/DD/YYYY","MM-DD-YYYY","DD/MM/YYYY","DD-MM-YYYY","'dd MMM DD HH:mm:ss ZZ YYYY', 'en'",k.default.ISO_8601],Object.entries||m.default.shim(),this.serializeEntity=this.serializeEntity.bind(this),this.deserializeEntity=this.deserializeEntity.bind(this),this.ensureTableExists=this.ensureTableExists.bind(this)}return(0,h.default)(e,[{key:"serializeEntity",value:function(){function e(e){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(t){var r,n,a,s,c,o,f,l,p,h;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:e.prev=0,r={},n=!0,a=!1,s=void 0,e.prev=5,c=Object.entries(t)[Symbol.iterator]();case 7:if(n=(o=c.next()).done){e.next=37;break}if(f=o.value,l=(0,i.default)(f,2),p=l[0],h=l[1],t.hasOwnProperty(p)&&"__etag"!==p&&"Timestamp"!==p){e.next=14;break}return e.abrupt("continue",34);case 14:if(null!==t[p]){e.next=17;break}return e.abrupt("continue",34);case 17:if("PartitionKey"!==p&&"RowKey"!==p||!this.keyRegEx.test(h)){e.next=22;break}throw new Error("Keys must be alphanumeric characters only");case 22:if("PartitionKey"!==p&&"RowKey"!==p||"string"==typeof h){e.next=26;break}throw new Error("Keys must be a string");case 26:if("PartitionKey"!==p&&"RowKey"!==p){e.next=29;break}return r[p]=this.entGen.String(h),e.abrupt("continue",34);case 29:if(this.propertyNameRegEx.test(p)){e.next=32;break}throw new Error("Column Name '"+p+"' must start with a letter");case 32:"string"==typeof h?36===h.length&&this.isGuid(h)?r[p]=this.entGen.Guid(h):(0,k.default)(h,this.momentDateParseArray,!0).isValid()?(r[p]=this.entGen.DateTime((0,k.default)(h,this.momentDateParseArray).format()),"Invalid date"===r[p]._&&console.log("value - ",h)):r[p]=this.entGen.String(h):"number"==typeof h?h%1==0?Math.abs(h)<2147483648?r[p]=this.entGen.Int32(h):r[p]=this.entGen.Int64(h):r[p]=this.entGen.Double(h):"boolean"==typeof h?r[p]=this.entGen.Boolean(h):h instanceof Buffer?r[p]=this.entGen.Binary(h.toString("base64")):r[p]=this.entGen.String(h.toString());case 34:n=!0,e.next=7;break;case 37:e.next=43;break;case 39:e.prev=39,e.t0=e.catch(5),a=!0,s=e.t0;case 43:e.prev=43,e.prev=44,!n&&c.return&&c.return();case 46:if(e.prev=46,!a){e.next=49;break}throw s;case 49:return e.finish(46);case 50:return e.finish(43);case 51:return e.abrupt("return",r);case 54:return e.prev=54,e.t1=e.catch(0),e.abrupt("return",e.t1);case 57:case"end":return e.stop()}},e,this,[[0,54],[5,39,43,51],[44,,46,50]])}));return e}()},{key:"deserializeEntity",value:function(){function e(e){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(t){var r,n,a,s,c,o,f,l,p,h,d,v,b;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:e.prev=0,r={},n=void 0,a=!0,s=!1,c=void 0,e.prev=6,o=Object.entries(t)[Symbol.iterator]();case 8:if(a=(f=o.next()).done){e.next=32;break}if(l=f.value,p=(0,i.default)(l,2),h=p[0],d=p[1],t.hasOwnProperty(h)&&!(h.indexOf(".metadata")>=0)){e.next=15;break}return e.abrupt("continue",29);case 15:if("PartitionKey"!==h&&"RowKey"!==h){e.next=21;break}return r[h]=d._,e.abrupt("continue",29);case 21:if("Timestamp"!==h){e.next=25;break}return v=(0,k.default)(d._).format(),r[h]=v,e.abrupt("continue",29);case 25:n=d.$,n?"Edm.Int64"===n?r[h]=parseInt(d._,10):"Edm.DateTime"===n?(b=(0,k.default)(d._).format(),r[h]=b):r[h]="Edm.Binary"===n?new Buffer(d._,"base64"):d._:r[h]=d._;case 29:a=!0,e.next=8;break;case 32:e.next=38;break;case 34:e.prev=34,e.t0=e.catch(6),s=!0,c=e.t0;case 38:e.prev=38,e.prev=39,!a&&o.return&&o.return();case 41:if(e.prev=41,!s){e.next=44;break}throw c;case 44:return e.finish(41);case 45:return e.finish(38);case 46:return e.abrupt("return",r);case 50:return e.prev=50,e.t1=e.catch(0),e.abrupt("return",e.t1);case 53:case"end":return e.stop()}},e,this,[[0,50],[6,34,38,46],[39,,41,45]])}));return e}()},{key:"ensureTableExists",value:function(){function e(e,r){return t.apply(this,arguments)}var t=(0,o.default)(u.default.mark(function e(t,r){var n,a=this;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=new this.tableOps(t,r,"createTableIfNotExists"),e.next=4,n.run().then(function(e){return!(!e.isSuccessful||e.created)||!(!e.isSuccessful||!e.created)&&function(){var e=(0,o.default)(u.default.mark(function e(){var n;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=new a.tableOps(t,r,"deleteTable"),e.next=4,n.run().then(function(e){throw new Error("invalid table name specified")});case 4:return e.abrupt("return",e.sent);case 7:throw e.prev=7,e.t0=e.catch(0),e.t0;case 10:case"end":return e.stop()}},e,a,[[0,7]])}));return function(){return e.apply(this,arguments)}}()()});case 4:return e.abrupt("return",e.sent);case 7:throw e.prev=7,e.t0=e.catch(0),e.t0;case 10:case 11:case"end":return e.stop()}},e,this,[[0,7]])}));return e}()}]),e}();t.default=g},function(e,t){e.exports=require("babel-runtime/helpers/slicedToArray")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return new RegExp("^([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}$").test(e)}},function(e,t){e.exports=require("object.entries")}]);