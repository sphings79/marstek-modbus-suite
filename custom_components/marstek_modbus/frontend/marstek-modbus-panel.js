/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yt=globalThis,Gt=yt.ShadowRoot&&(yt.ShadyCSS===void 0||yt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Xt=Symbol(),pe=new WeakMap;let Ue=class{constructor(t,s,a){if(this._$cssResult$=!0,a!==Xt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o;const s=this.t;if(Gt&&t===void 0){const a=s!==void 0&&s.length===1;a&&(t=pe.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),a&&pe.set(s,t))}return t}toString(){return this.cssText}};const os=e=>new Ue(typeof e=="string"?e:e+"",void 0,Xt),b=(e,...t)=>{const s=e.length===1?e[0]:t.reduce((a,i,r)=>a+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1],e[0]);return new Ue(s,e,Xt)},ls=(e,t)=>{if(Gt)e.adoptedStyleSheets=t.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(const s of t){const a=document.createElement("style"),i=yt.litNonce;i!==void 0&&a.setAttribute("nonce",i),a.textContent=s.cssText,e.appendChild(a)}},me=Gt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let s="";for(const a of t.cssRules)s+=a.cssText;return os(s)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:cs,defineProperty:ds,getOwnPropertyDescriptor:hs,getOwnPropertyNames:ps,getOwnPropertySymbols:ms,getPrototypeOf:us}=Object,Pt=globalThis,ue=Pt.trustedTypes,fs=ue?ue.emptyScript:"",gs=Pt.reactiveElementPolyfillSupport,lt=(e,t)=>e,xt={toAttribute(e,t){switch(t){case Boolean:e=e?fs:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=e!==null;break;case Number:s=e===null?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch{s=null}}return s}},Jt=(e,t)=>!cs(e,t),fe={attribute:!0,type:String,converter:xt,reflect:!1,useDefault:!1,hasChanged:Jt};Symbol.metadata??=Symbol("metadata"),Pt.litPropertyMetadata??=new WeakMap;let Q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=fe){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){const a=Symbol(),i=this.getPropertyDescriptor(t,a,s);i!==void 0&&ds(this.prototype,t,i)}}static getPropertyDescriptor(t,s,a){const{get:i,set:r}=hs(this.prototype,t)??{get(){return this[s]},set(n){this[s]=n}};return{get:i,set(n){const l=i?.call(this);r?.call(this,n),this.requestUpdate(t,l,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??fe}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=us(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const s=this.properties,a=[...ps(s),...ms(s)];for(const i of a)this.createProperty(i,s[i])}const t=this[Symbol.metadata];if(t!==null){const s=litPropertyMetadata.get(t);if(s!==void 0)for(const[a,i]of s)this.elementProperties.set(a,i)}this._$Eh=new Map;for(const[s,a]of this.elementProperties){const i=this._$Eu(s,a);i!==void 0&&this._$Eh.set(i,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const s=[];if(Array.isArray(t)){const a=new Set(t.flat(1/0).reverse());for(const i of a)s.unshift(me(i))}else t!==void 0&&s.push(me(t));return s}static _$Eu(t,s){const a=s.attribute;return a===!1?void 0:typeof a=="string"?a:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const a of s.keys())this.hasOwnProperty(a)&&(t.set(a,this[a]),delete this[a]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ls(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,s,a){this._$AK(t,a)}_$ET(t,s){const a=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,a);if(i!==void 0&&a.reflect===!0){const r=(a.converter?.toAttribute!==void 0?a.converter:xt).toAttribute(s,a.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,s){const a=this.constructor,i=a._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const r=a.getPropertyOptions(i),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:xt;this._$Em=i;const l=n.fromAttribute(s,r.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,s,a,i=!1,r){if(t!==void 0){const n=this.constructor;if(i===!1&&(r=this[t]),a??=n.getPropertyOptions(t),!((a.hasChanged??Jt)(r,s)||a.useDefault&&a.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,a))))return;this.C(t,s,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,s,{useDefault:a,reflect:i,wrapped:r},n){a&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??s??this[t]),r!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||a||(s=void 0),this._$AL.set(t,s)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}const a=this.constructor.elementProperties;if(a.size>0)for(const[i,r]of a){const{wrapped:n}=r,l=this[i];n!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,r,l)}}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(s)):this._$EM()}catch(a){throw t=!1,this._$EM(),a}t&&this._$AE(s)}willUpdate(t){}_$AE(t){this._$EO?.forEach(s=>s.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(s=>this._$ET(s,this[s])),this._$EM()}updated(t){}firstUpdated(t){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[lt("elementProperties")]=new Map,Q[lt("finalized")]=new Map,gs?.({ReactiveElement:Q}),(Pt.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zt=globalThis,ge=e=>e,St=Zt.trustedTypes,ve=St?St.createPolicy("lit-html",{createHTML:e=>e}):void 0,Be="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,je="?"+U,vs=`<${je}>`,X=document,dt=()=>X.createComment(""),ht=e=>e===null||typeof e!="object"&&typeof e!="function",Qt=Array.isArray,bs=e=>Qt(e)||typeof e?.[Symbol.iterator]=="function",Ot=`[ 	
\f\r]`,rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,be=/-->/g,_e=/>/g,Y=RegExp(`>|${Ot}(?:([^\\s"'>=/]+)(${Ot}*=${Ot}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ke=/'/g,ye=/"/g,Ke=/^(?:script|style|textarea|title)$/i,He=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),o=He(1),$e=He(2),et=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),we=new WeakMap,G=X.createTreeWalker(X,129);function qe(e,t){if(!Qt(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ve!==void 0?ve.createHTML(t):t}const _s=(e,t)=>{const s=e.length-1,a=[];let i,r=t===2?"<svg>":t===3?"<math>":"",n=rt;for(let l=0;l<s;l++){const d=e[l];let c,m,u=-1,f=0;for(;f<d.length&&(n.lastIndex=f,m=n.exec(d),m!==null);)f=n.lastIndex,n===rt?m[1]==="!--"?n=be:m[1]!==void 0?n=_e:m[2]!==void 0?(Ke.test(m[2])&&(i=RegExp("</"+m[2],"g")),n=Y):m[3]!==void 0&&(n=Y):n===Y?m[0]===">"?(n=i??rt,u=-1):m[1]===void 0?u=-2:(u=n.lastIndex-m[2].length,c=m[1],n=m[3]===void 0?Y:m[3]==='"'?ye:ke):n===ye||n===ke?n=Y:n===be||n===_e?n=rt:(n=Y,i=void 0);const v=n===Y&&e[l+1].startsWith("/>")?" ":"";r+=n===rt?d+vs:u>=0?(a.push(c),d.slice(0,u)+Be+d.slice(u)+U+v):d+U+(u===-2?l:v)}return[qe(e,r+(e[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),a]};class pt{constructor({strings:t,_$litType$:s},a){let i;this.parts=[];let r=0,n=0;const l=t.length-1,d=this.parts,[c,m]=_s(t,s);if(this.el=pt.createElement(c,a),G.currentNode=this.el.content,s===2||s===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=G.nextNode())!==null&&d.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Be)){const f=m[n++],v=i.getAttribute(u).split(U),C=/([.?@])?(.*)/.exec(f);d.push({type:1,index:r,name:C[2],strings:v,ctor:C[1]==="."?ys:C[1]==="?"?$s:C[1]==="@"?ws:Ct}),i.removeAttribute(u)}else u.startsWith(U)&&(d.push({type:6,index:r}),i.removeAttribute(u));if(Ke.test(i.tagName)){const u=i.textContent.split(U),f=u.length-1;if(f>0){i.textContent=St?St.emptyScript:"";for(let v=0;v<f;v++)i.append(u[v],dt()),G.nextNode(),d.push({type:2,index:++r});i.append(u[f],dt())}}}else if(i.nodeType===8)if(i.data===je)d.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf(U,u+1))!==-1;)d.push({type:7,index:r}),u+=U.length-1}r++}}static createElement(t,s){const a=X.createElement("template");return a.innerHTML=t,a}}function st(e,t,s=e,a){if(t===et)return t;let i=a!==void 0?s._$Co?.[a]:s._$Cl;const r=ht(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(e),i._$AT(e,s,a)),a!==void 0?(s._$Co??=[])[a]=i:s._$Cl=i),i!==void 0&&(t=st(e,i._$AS(e,t.values),i,a)),t}class ks{constructor(t,s){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:s},parts:a}=this._$AD,i=(t?.creationScope??X).importNode(s,!0);G.currentNode=i;let r=G.nextNode(),n=0,l=0,d=a[0];for(;d!==void 0;){if(n===d.index){let c;d.type===2?c=new gt(r,r.nextSibling,this,t):d.type===1?c=new d.ctor(r,d.name,d.strings,this,t):d.type===6&&(c=new xs(r,this,t)),this._$AV.push(c),d=a[++l]}n!==d?.index&&(r=G.nextNode(),n++)}return G.currentNode=X,i}p(t){let s=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(t,a,s),s+=a.strings.length-2):a._$AI(t[s])),s++}}class gt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,s,a,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=a,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&t?.nodeType===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=st(this,t,s),ht(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):bs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&ht(this._$AH)?this._$AA.nextSibling.data=t:this.T(X.createTextNode(t)),this._$AH=t}$(t){const{values:s,_$litType$:a}=t,i=typeof a=="number"?this._$AC(t):(a.el===void 0&&(a.el=pt.createElement(qe(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===i)this._$AH.p(s);else{const r=new ks(i,this),n=r.u(this.options);r.p(s),this.T(n),this._$AH=r}}_$AC(t){let s=we.get(t.strings);return s===void 0&&we.set(t.strings,s=new pt(t)),s}k(t){Qt(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let a,i=0;for(const r of t)i===s.length?s.push(a=new gt(this.O(dt()),this.O(dt()),this,this.options)):a=s[i],a._$AI(r),i++;i<s.length&&(this._$AR(a&&a._$AB.nextSibling,i),s.length=i)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const a=ge(t).nextSibling;ge(t).remove(),t=a}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class Ct{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,s,a,i,r){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=s,this._$AM=i,this.options=r,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=h}_$AI(t,s=this,a,i){const r=this.strings;let n=!1;if(r===void 0)t=st(this,t,s,0),n=!ht(t)||t!==this._$AH&&t!==et,n&&(this._$AH=t);else{const l=t;let d,c;for(t=r[0],d=0;d<r.length-1;d++)c=st(this,l[a+d],s,d),c===et&&(c=this._$AH[d]),n||=!ht(c)||c!==this._$AH[d],c===h?t=h:t!==h&&(t+=(c??"")+r[d+1]),this._$AH[d]=c}n&&!i&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ys extends Ct{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}}class $s extends Ct{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}}class ws extends Ct{constructor(t,s,a,i,r){super(t,s,a,i,r),this.type=5}_$AI(t,s=this){if((t=st(this,t,s,0)??h)===et)return;const a=this._$AH,i=t===h&&a!==h||t.capture!==a.capture||t.once!==a.once||t.passive!==a.passive,r=t!==h&&(a===h||i);i&&this.element.removeEventListener(this.name,this,a),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class xs{constructor(t,s,a){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}}const Ss=Zt.litHtmlPolyfillSupport;Ss?.(pt,gt),(Zt.litHtmlVersions??=[]).push("3.3.3");const Ts=(e,t,s)=>{const a=s?.renderBefore??t;let i=a._$litPart$;if(i===void 0){const r=s?.renderBefore??null;a._$litPart$=i=new gt(t.insertBefore(dt(),r),r,void 0,s??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const te=globalThis;class y extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ts(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return et}}y._$litElement$=!0,y.finalized=!0,te.litElementHydrateSupport?.({LitElement:y});const Es=te.litElementPolyfillSupport;Es?.({LitElement:y});(te.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const As={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:Jt},Ps=(e=As,t,s)=>{const{kind:a,metadata:i}=s;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),a==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(s.name,e),a==="accessor"){const{name:n}=s;return{set(l){const d=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,d,e,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,e,l),l}}}if(a==="setter"){const{name:n}=s;return function(l){const d=this[n];t.call(this,l),this.requestUpdate(n,d,e,!0,l)}}throw Error("Unsupported decorator location: "+a)};function p(e){return(t,s)=>typeof s=="object"?Ps(e,t,s):((a,i,r)=>{const n=i.hasOwnProperty(r);return i.constructor.createProperty(r,a),n?Object.getOwnPropertyDescriptor(i,r):void 0})(e,t,s)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function g(e){return p({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Cs=(e,t,s)=>(s.configurable=!0,s.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,s),s);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ms(e,t){return(s,a,i)=>{const r=n=>n.renderRoot?.querySelector(e)??null;return Cs(s,a,{get(){return r(this)}})}}const mt=new URL(import.meta.url).searchParams.get("v")??"",Lt="marstek-modbus-bundle-loaded",ee="__marstekModbusLatestBundle",se=window,xe=se[ee];se[ee]=mt;xe!==void 0&&xe!==mt&&window.dispatchEvent(new CustomEvent(Lt,{detail:mt}));function Os(){return se[ee]??mt}function k(e){return t=>{customElements.get(e)||customElements.define(e,t)}}const Ns=b`
  :host {
    /* dark, the design this was drawn in */
    --mk-bg: #05090f;
    --mk-surface: #0b131d;
    --mk-surface-2: #101b28;
    --mk-inset: #0d1723;
    --mk-line: #1b2b3d;
    --mk-line-soft: #152435;
    --mk-fg: #dff2f6;
    --mk-fg-2: #9fb8c6;
    --mk-dim: #5d7d92;
    --mk-accent: #2ae6dc;
    --mk-accent-deep: #1b8fd6;
    --mk-accent-wash: #0e2b30;
    --mk-magenta: #ff3ea5;
    --mk-magenta-wash: #2a0d1e;
    --mk-ok: #35d67a;
    --mk-warn: #ffb020;
    --mk-crit: #ff4d5e;
    --mk-track: #132434;
    --mk-on-accent: #04141a;
  }

  :host([light]) {
    /* The same roles on a light ground. Neon does not survive the move, so the
       accents are taken down in lightness and up in saturation until they hold
       their own against white rather than glowing on top of it. */
    --mk-bg: #eef2f6;
    --mk-surface: #ffffff;
    --mk-surface-2: #f6f9fb;
    --mk-inset: #e8eef3;
    --mk-line: #cbd8e2;
    --mk-line-soft: #dfe7ee;
    --mk-fg: #0c1a24;
    --mk-fg-2: #3a5162;
    --mk-dim: #5b7484;
    --mk-accent: #0c847e;
    --mk-accent-deep: #0f5f8c;
    --mk-accent-wash: #d9f0ee;
    --mk-magenta: #b4176e;
    --mk-magenta-wash: #fbe4f0;
    --mk-ok: #0f7a44;
    --mk-warn: #8a5804;
    --mk-crit: #b52436;
    --mk-track: #dae3ea;
    --mk-on-accent: #ffffff;
  }
`,_=b`
  :host {
    --mk-gap: 12px;
    --mk-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
    --mk-sans: var(--paper-font-body1_-_font-family, "Roboto", system-ui,
      -apple-system, sans-serif);

    display: block;
    color: var(--mk-fg);
    font-family: var(--mk-sans);
    font-size: 15px;
    line-height: 1.55;
  }

  * {
    box-sizing: border-box;
  }

  .panel {
    background: var(--mk-surface);
    border: 1px solid var(--mk-line);
    padding: 15px 17px;
  }

  .label {
    font-family: var(--mk-mono);
    font-size: 9.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--mk-dim);
  }

  .value {
    font-family: var(--mk-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }

  .grid {
    display: grid;
    gap: var(--mk-gap);
  }
  /* Grid items default to min-width:auto and grow to fit their content, which
     silently defeats any overflow-x container inside them: the card widens
     instead of the box scrolling, and the whole page moves sideways. */
  .grid > * {
    min-width: 0;
  }

  .ok {
    color: var(--mk-ok);
  }
  .warn {
    color: var(--mk-warn);
  }
  .crit {
    color: var(--mk-crit);
  }
  .magenta {
    color: var(--mk-magenta);
  }
  .accent {
    color: var(--mk-accent);
  }

  /* Wide content scrolls inside its own box so the page never does. */
  .scroll {
    overflow-x: auto;
  }

  /* A label/value row. Used by every view, so it lives here rather than being
     redefined in each of them. */
  .kv {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    padding: 5.5px 0;
    border-bottom: 1px dashed var(--mk-line-soft);
  }
  .kv:last-of-type {
    border-bottom: 0;
  }
  .kv > span {
    font-family: var(--mk-mono);
    font-size: 11px;
    color: var(--mk-dim);
    letter-spacing: 0.03em;
  }
  .kv > b {
    font-family: var(--mk-mono);
    font-size: 12.5px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  /* Decoded fault texts can run to a sentence; they wrap rather than push
     the card wider than the screen. */
  .kv > b.wrap {
    white-space: normal;
    text-align: right;
  }

  .head {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 13px;
  }
  .head .label:first-child {
    flex: 1;
  }

  .note {
    font-family: var(--mk-mono);
    font-size: 10.5px;
    color: var(--mk-dim);
    margin-top: 12px;
    line-height: 1.7;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }
  th,
  td {
    text-align: left;
    padding: 7px 10px;
    font-family: var(--mk-mono);
    font-size: 11.5px;
    border-bottom: 1px solid var(--mk-line-soft);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  th {
    font-size: 9.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--mk-dim);
    font-weight: 500;
  }
  td {
    color: var(--mk-fg);
  }
  th.n,
  td.n {
    text-align: right;
  }
  tr.flagged {
    background: var(--mk-magenta-wash);
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`,$t="marstek_modbus";function Rs(e){const t=new Map;for(const s of Object.values(e.entities)){if(s.platform!==$t||!s.device_id||!s.translation_key)continue;let a=t.get(s.device_id);if(!a){const i=e.devices[s.device_id];a={deviceId:s.device_id,name:i?.name_by_user||i?.name||"Marstek Venus",byKey:{}},t.set(s.device_id,a)}a.byKey[s.translation_key]=s.entity_id}return[...t.values()].sort((s,a)=>s.name.localeCompare(a.name))}const Ds=0,Ye=1,Ls=2,ae=3,ie=e=>e!==null&&e>=Ye&&e<=ae,B=["battery_rated_capacity","battery_total_energy"],It=["battery_1_min_cell_temperature","min_cell_temperature"],Is=["device_model","device_name"],Ws=["vns_version","vms_version"],Wt=["internal_temperature","inverter_radiator_1_temperature","inverter_temperature_ntc_ch12"],zs=["internal_mos1_temperature","inverter_radiator_2_temperature","inverter_temperature_ntc_ch5"],Se=e=>[`schedule_${e}_power`,`schedule_${e}_mode`],Fs=["device_name","software_version","battery_total_energy","schedule_1_mode"],Vs=["device_model","vns_version","battery_rated_capacity","schedule_1_power"],Us={soc:"battery_soc",max_cell_voltage:"max_cell_voltage",min_cell_voltage:"min_cell_voltage",voltage:"battery_voltage",current:"battery_current",cycle_count:"battery_cycle_count",bms_version:"bms_version"};class Bs{constructor(t,s){this.hass=t,this.device=s}get name(){return this.device.name}get deviceId(){return this.device.deviceId}isLegacyE(){return Vs.some(t=>this.entityId(t))?!1:Fs.some(t=>this.entityId(t))}isSinglePack(){return!this.entityId("battery_soc_1")&&!this.entityId("battery_1_max_cell_voltage")&&!!this.entityId("battery_soc")}packKey(t,s){const a=s==="soc"?`battery_soc_${t}`:`battery_${t}_${s}`;if(this.entityId(a)||t!==1)return a;const i=Us[s];return i&&this.entityId(i)&&this.isSinglePack()?i:a}packNum(t,s){return this.num(this.packKey(t,s))}activeFaults(t){const s=this.state(t)?.attributes.active_faults;return Array.isArray(s)?s.map(a=>String(a)):null}rawValue(t){const s=this.state(t)?.attributes.raw_value;return typeof s=="number"&&Number.isFinite(s)?s:null}code(t){return this.rawValue(t)??this.num(t)}codeText(t){const s=this.str(t);return s!==null&&!Number.isFinite(Number(s))?s:null}faultTexts(t){return this.activeFaults(t)??this.activeFaults(`${t}_description`)??[]}isOn(t){return this.state(t)?.state==="on"}buttonKeys(){return Object.entries(this.device.byKey).filter(([t,s])=>s.startsWith("button.")&&!this.isOrphan(t)).map(([t])=>t)}isOrphan(t){return this.rawState(t)?.attributes.restored===!0}entityId(t){return this.device.byKey[t]}has(t){return this.state(t)!==null}state(t){const s=this.device.byKey[t];if(!s)return null;const a=this.hass.states[s];return!a||a.state==="unavailable"||a.state==="unknown"?null:a}num(t){const s=this.state(t);if(!s)return null;const a=Number(s.state);return Number.isFinite(a)?a:null}str(t){return this.state(t)?.state??null}unit(t){return this.state(t)?.attributes.unit_of_measurement??""}rawState(t){const s=this.device.byKey[t];return s&&this.hass.states[s]||null}attr(t,s,a){return this.rawState(t)?.attributes[s]??a}writable(t){const s=this.rawState(t);return!!s&&s.state!=="unavailable"}label(t){const s=this.hass.states[this.device.byKey[t]??""]?.attributes.friendly_name;if(!s)return t;const a=this.device.name;return a&&s.startsWith(a)&&s.length>a.length+1?s.slice(a.length).trim():s}sum(t){let s=0,a=!1;for(const i of t){const r=this.num(i);r!==null&&(s+=r,a=!0)}return a?s:null}firstKey(t){return t.find(s=>this.entityId(s))??null}numFirst(t){const s=this.firstKey(t);return s?this.num(s):null}inverterState(t){const a=this.num("battery_power"),i=this.num("ac_power"),r=this.num("solar_power_total"),n=a!==null&&a>30,l=i!==null&&i>30;return r!==null&&r>30&&n&&l?t?t("core.pv_passthrough"):"PV Passthrough":this.str("inverter_state")}cellsPerPack(){let t=0;for(let s=1;s<=32;s++)this.device.byKey[`battery_1_cell_${s}_voltage`]&&(t=s);return t}conductingPack(){let t=null;for(let s=1;s<=this.packCount();s++){const a=this.packNum(s,"mos_status");if(a===ae)return s;t===null&&ie(a)&&(t=s)}return t}packCount(){let t=0;for(;this.device.byKey[`battery_${t+1}_max_cell_voltage`];)t++;if(t===0)return this.isSinglePack()?1:0;let s=t;for(;s>0&&this.isOrphan(`battery_${s}_max_cell_voltage`);)s--;s===0&&(s=t);let a=0;for(let i=1;i<=s;i++){const r=this.num(`battery_${i}_max_cell_voltage`);r!==null&&r>0&&(a=i)}return a||s}}const Te="Validation error: ",ct=class ct{constructor(t,s){this.hass=t,this.reader=s}call(t,s,a,i,r=!1){const n=this.reader.entityId(a);return n?this.hass.callService(t,s,{entity_id:n,...i},void 0,r?!1:void 0):Promise.resolve()}setNumber(t,s){return this.call("number","set_value",t,{value:s})}selectOption(t,s){return this.call("select","select_option",t,{option:s})}setSchedule(t,s){const a=this.reader.entityId(t);return a?this.hass.callWS({type:"marstek_modbus/schedule/set",entity_id:a,...s}):Promise.resolve()}setSwitch(t,s){return this.call("switch",s?"turn_on":"turn_off",t,{})}press(t,s){const a=this.reader.entityId(t);return a?this.hass.callWS({type:`${$t}/press_button`,entity_id:a,...s?{confirm_token:s}:{}}):Promise.resolve(void 0)}get isAdmin(){return this.hass.user?.is_admin!==!1}hasService(t){return!!this.hass.services?.[$t]?.[t]}setWifi(t,s){return this.hass.callWS({type:`${$t}/set_wifi`,device_id:this.reader.deviceId,ssid:t,password:s})}async warningText(t){if(t.translation_domain&&t.translation_key){const a=(await this.exceptionTexts(t.translation_domain))?.(`component.${t.translation_domain}.exceptions.${t.translation_key}.message`,t.translation_placeholders);if(a)return a}return t.warning??""}async errorText(t){const s=t??{};if(s.translation_domain&&s.translation_key){const r=(await this.exceptionTexts(s.translation_domain))?.(`component.${s.translation_domain}.exceptions.${s.translation_key}.message`,s.translation_placeholders);if(r)return r}const a=s.message??String(t);return a.startsWith(Te)?a.slice(Te.length):a}exceptionTexts(t){const s=`${this.hass.language||"en"}/${t}`;let a=ct.exceptions.get(s);if(!a){const i=this.hass.loadBackendTranslation;a=i?i.call(this.hass,"exceptions",t).catch(()=>null):Promise.resolve(null),ct.exceptions.set(s,a)}return a}};ct.exceptions=new Map;let Tt=ct;function js(e){return e?.code==="unauthorized"}function Ks(e){return e?.code==="confirm_expired"}const Hs="modulepreload",qs=function(e){return"/"+e},Ee={},Ae=function(t,s,a){let i=Promise.resolve();if(s&&s.length>0){let n=function(c){return Promise.all(c.map(m=>Promise.resolve(m).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),d=l?.nonce||l?.getAttribute("nonce");i=n(s.map(c=>{if(c=qs(c),c in Ee)return;Ee[c]=!0;const m=c.endsWith(".css"),u=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const f=document.createElement("link");if(f.rel=m?"stylesheet":Hs,m||(f.as="script"),f.crossOrigin="",f.href=c,d&&f.setAttribute("nonce",d),document.head.appendChild(f),m)return new Promise((v,C)=>{f.addEventListener("load",v),f.addEventListener("error",()=>C(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(n){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=n,window.dispatchEvent(l),!l.defaultPrevented)throw n}return i.then(n=>{for(const l of n||[])l.status==="rejected"&&r(l.reason);return t().catch(r)})},ut={"tab.core":"OVERVIEW","tab.cells":"CELLS","tab.packs":"PACKS","tab.solar":"SOLAR","tab.energy":"ENERGY","tab.system":"SYSTEM","tab.control":"CONTROL","update.available":"A new version of the integration is installed. This page still runs the old one.","update.reload":"Reload","control.power":"Power now","control.power_hint":"These two set the working point directly. Anything that regulates the battery from outside — a zero-feed-in automation, an energy manager — writes the same registers and will win within seconds.","control.limits":"Limits","control.limits_hint":"After the device restarts these three often read 0. The limit set earlier still applies and does not have to be written again.","control.limits_floor":"The two maximum powers start at {min} W and cannot be set to 0; the upper end, {max} W, comes from the device's entity (2500 W on the Venus D and E v3, 1450 W on the Venus A). To stop charging or discharging, set the force mode to standby or the power to 0.","control.mode":"Mode","control.mode_hint":"Has no effect while the device is being controlled over Modbus.","control.polling":"Polling","control.polling_hint":"Stops this battery being read at all and closes the connection, for a device switched off over the winter. Paused entities either keep their last reading or go unavailable, whichever you pick here. Readings are not restored after a Home Assistant restart.","control.backup_hint":"Switches the backup socket on and off.","control.rs485_hint":"Has to be on before the device takes Modbus control at all — from this page, from an automation, or from the integration. Switched off, the device regulates itself again.","control.overwritten":"Something else changed {names} right after this panel did. An external controller is writing the same registers.","control.schedules":"Schedules","control.schedules_axis":"times are the device's own, in its local time","control.schedules_hint":"A schedule needs a window, a power and at least one day before switching it on does anything. Positive power discharges, negative charges; −1 W runs self-consumption for the window. The end is not part of the window, and a window across midnight never runs - use two schedules. Enabled schedules may not overlap.","control.err.schedule_window":"Schedule {slot}: the start has to be before the end. Split a window across midnight into two schedules.","control.err.schedule_overlap":"Schedule {slot} would overlap schedule {other} on a shared day. The device runs only the first match.","control.err.schedule_time":"Schedule {slot}: start and end are HHMM times with minutes below 60.","control.no_schedules":"This battery exposes no schedules.","control.window":"Window","control.sched_power":"Power","control.days":"Days","control.active":"On","control.device":"Device","control.reset":"Restart device","control.reset_confirm":"Really restart","control.reset_title":"Restart device?","control.reset_message":"The battery drops the connection and restarts. Until it is back there are no readings, and it cannot be controlled either. The limits you set still apply afterwards.","control.cancel":"Cancel","control.opt.manual":"Manual","control.opt.anti_feed":"Anti-feed","control.opt.trade_mode":"Trade","control.opt.ai":"AI","control.opt.standby":"Standby","control.opt.charge":"Charge","control.opt.discharge":"Discharge","control.opt.active":"On","control.opt.paused_unavailable":"Paused · entities unavailable","control.opt.paused_frozen":"Paused · entities frozen","control.day.monday":"Mon","control.day.tuesday":"Tue","control.day.wednesday":"Wed","control.day.thursday":"Thu","control.day.friday":"Fri","control.day.saturday":"Sat","control.day.sunday":"Sun","status.modbus":"MODBUS","status.modbus_offline":"MODBUS OFFLINE","status.modbus_offline_since":"MODBUS OFFLINE · last answer {time}","status.modbus_paused":"MODBUS PAUSED","status.modbus_paused_hint":"Polling is switched off for this battery. Nothing is being read, and the values below are whatever was last seen.","status.modbus_offline_hint":"The battery is not answering. Every value below is the last one read before the link dropped.","status.modbus_degraded":"The link answers, but registers timed out in the last poll.","common.pack":"PACK","common.pack_n":"pack {pack}","common.standby":"standby","common.active_pack":"active pack {pack}","common.active_pack_hint":"The pack the battery has switched in right now; the others are idle.","common.voltage":"Voltage","common.current":"Current","common.device":"Device","common.pack_entities_disabled":"Some readings of this pack are missing because their entities are disabled by default on this model: cell voltages, pack temperatures, protection and warning words, MOSFET status, battery profile. Enable the ones you want on the device page (Settings → Devices & services → Marstek Modbus Suite → this battery → entities), and they appear here once they report.","core.electrical":"Electrical · now","core.reserve":"Reserve · lifetime","core.stored":"Stored","core.capacity":"Capacity","core.stored_of_total":"Stored / total","core.usable":"Usable energy","core.to_full":"Energy to full","core.pv_passthrough":"PV Passthrough","core.runtime":"Runtime","core.to_empty":"Until empty","core.until_full":"Until full","core.until_pct":"Until {value} %","core.packs":"Packs","core.soc_bms":"SOC · BMS","core.soc_usable":"usable {value} %","core.discharging_to_house":"discharging","core.charging_from_grid":"charging","core.at_rest":"at rest","core.today_charged":"Charged today","core.today_discharged":"Discharged today","core.cell_delta":"Largest cell delta","core.internal_temp":"Device temperature","core.mppt_total":"MPPT total","core.in_pack":"in pack {pack}","core.no_delta":"no per-pack readings","cells.highest":"Highest cell","cells.lowest":"Lowest cell","cells.in_pack":"pack {pack}","cells.stack_spread":"Spread across stack","cells.stack_hint":"packs charge and discharge in turn, so a spread is expected","cells.mean_delta":"Mean delta in pack","cells.worst_pack":"widest: pack {pack}, {value} mV","cells.temp_span":"Cell temp. span in pack","cells.temp_span_pack":"widest: pack {pack}, {range}","cells.packs_online":"Detected packs","cells.cells_total":"{count} cells","cells.matrix_title":"Cell voltage range per pack · shared axis","cells.matrix_axis":"bar = lowest to highest cell · fixed axis 3.0 – 3.7 V","cells.matrix_legend":"The tick inside each bar is the pack's midpoint. A narrow bar is a balanced pack, a wide one is drift inside it, and a bar sitting apart from the others is a pack at a different level than the rest. The axis is fixed at 3.0 – 3.7 V and only widens, in steps of 0.1 V, when a pack reads outside it.","cells.no_ranges":"This battery reports no per-pack cell voltages.","cells.protection":"Protection and faults","cells.protection_all":"Protection · all {count} packs","cells.clear":"clear","cells.conducting":"Pack conducting","cells.conducting_none":"none — every pack disconnected","cells.conducting_hint":"The device works one pack at a time and switches that pack in while it does: charge MOSFET only, discharge MOSFET only, or both. A pack listed here is doing the work, not reporting a fault.","cells.mos_unexpected":"unexpected MOSFET status","cells.mos_off":"both MOSFETs off","cells.mos_charge":"charge only","cells.mos_discharge":"discharge only","cells.mos_both":"charge and discharge","cells.lock_on":"active","cells.lock_off":"inactive","cells.cell_voltages":"Cell voltages","cells.raised":"raised","cells.bms":"BMS","cells.bms_version":"BMS version","cells.uniform":"same on every pack","packs.device_reading":"as the device reports it","packs.mean_soc":"Mean of the packs","packs.from_n_packs":"from {count} packs","packs.spread":"Spread","packs.stored_total":"Stored energy","packs.of_max":"of {value} kWh possible","packs.per_pack":"Per pack","packs.nominal":"nominal, capacity ÷ packs","packs.cycles_mean":"Cycles","packs.cycles_basis":"mean across packs","packs.cycles_partial":"{have} of {total} packs report","packs.fill_title":"State of charge per pack","packs.fill_axis":"column height = SOC","packs.fill_legend":"The dashed line marks the discharge floor at {floor} %. Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.","packs.fill_legend_backup":"The dotted line at {backup} % is as far as the backup socket discharges during an outage.","packs.fill_legend_nofloor":"Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.","packs.none":"This battery reports no per-pack state of charge.","packs.table_title":"Every pack in detail","packs.table_legend":"Nothing is highlighted until the spread above reaches {spread} %; then the packs further than {points} % from the median pack are. While the stack stays together, columns and rows stay quiet. A pack that reports a high SOC at a low cell voltage is worth a second look: the two readings disagree.","packs.conducting":"conducting now","packs.col_soc":"SOC","packs.col_energy":"kWh","packs.col_min":"Cell min","packs.col_max":"Cell max","packs.col_delta":"Delta","packs.col_voltage":"Voltage","packs.col_current":"Current","packs.col_cycles":"Cycles","packs.col_mos":"MOSFET","packs.col_env":"Ambient","packs.col_ntc":"NTC 1–4","solar.active":"ACTIVE","solar.floating":"FLOATING","solar.summary":"All inputs","solar.some_active":"carrying power","solar.all_idle":"nothing connected","solar.note_active":"Voltage follows the panels and power follows the sun through the day.","solar.note_floating":"All inputs sit at a low voltage without current, which is what an unused MPPT input looks like. Connect panels and the voltage rises to module level.","solar.diagnostics":"Diagnostics","solar.channels_reporting":"Inputs reporting","solar.none":"This battery has no MPPT inputs.","energy.today":"Today","energy.month":"This month","energy.lifetime":"Since commissioning","energy.charged":"charged kWh","energy.discharged":"discharged kWh","energy.loss":"Loss","energy.returned":"Returned","energy.rte":"Round trip","energy.rte_hint":"Round-trip efficiency is how much of the energy put into the battery comes back out of it. Conversion efficiency is the loss in the moment, at the current operating point.","energy.efficiency":"Efficiency compared","energy.throughput":"Throughput and wear","energy.gap_hint":"The monthly figure sits {value} points below the lifetime one. That gap is not conversion loss but standby draw between cycles: the shallower the cycling, the heavier it weighs.","system.no_faults":"No fault register is raised.","system.faults_raised":"Raised: {list}","system.grid_wait":"The inverter is waiting for the grid release (alarm word bit 0). This is not a fault; it clears once the grid is accepted.","system.bms_lock_active":"BMS lock active: the BMS holds the pack MOSFETs open after a fault, so the battery neither charges nor discharges.","system.bms_factory_mode":"BMS factory mode is on: the BMS is not in its normal operating mode.","system.device":"Device","system.packs":"Battery packs","system.firmware":"Firmware","system.connection":"Connection","system.faults":"Fault registers","system.control":"Control and limits","system.thermal":"Thermal and electrical","system.cell_temp_max_all":"Cell temperature, highest (all packs)","system.cell_temp_min_all":"Cell temperature, lowest (all packs)","system.cell_temp_max":"Cell temperature, highest","system.cell_temp_min":"Cell temperature, lowest","system.cell_temp_max_bms":"Cell temperature, highest (BMS)","system.cell_temp_min_bms":"Cell temperature, lowest (BMS)","system.cell_temp_holder":"Pack {packs}","system.set_charge_power":"Charge power set-point","system.set_discharge_power":"Discharge power set-point","system.set_power_hint":"Currently requested by the controller (force mode, schedule or an external controller); not the measured power.","system.selftest_5":"Ethernet chip reports another version than expected (harmless)","system.selftest_5_hint":"The self-test compares the version of the Ethernet chip (CH395) with the one the firmware expects: the chip reports 0x4A instead of 0x4B. Measured on two Venus D with a working LAN, harmless. A real SRAM fault would stop the controller; the real faults are 2 (EEPROM) and 3 (flash).","system.ceiling_used":"The panel treats {value} % as the charge ceiling, read from this register.","system.ceiling_ignored":"This register reads {value} %, outside its own {min}-100 range, so the device is not using it. The panel charges towards 100 % instead.","maint.title":"Maintenance · danger zone","maint.warning":"These commands act on the device directly. Several of them cannot be undone - a factory reset deletes the Wi-Fi and cloud settings. Use them only when you know what they do.","maint.buttons":"Commands","maint.dev":"DEV commands","maint.none":"No command is enabled for this battery. The command entities are disabled by default; enable the ones you need on the device page and they appear here.","maint.buttons_hint":"A command with a two-step confirmation shows the integration's warning first and is only sent when you confirm within its time window.","maint.press":"Press","maint.run":"Run","maint.pressing":"Sending…","maint.confirm":"Send now","maint.close":"Close","maint.countdown":"Confirm within {seconds} s. Nothing has been sent yet.","maint.expired":"The confirmation window has run out. Nothing was sent. Close this and press the command again to start over.","maint.admin_required":"This needs an administrator account. Ask a Home Assistant administrator to do it.","maint.sent":"{name}: sent.","maint.cancelled":"{name}: cancelled, nothing was sent.","maint.ask_message":"This command is sent on the first press, without a confirmation step of the integration. Send it now?","wifi.title":"Wi-Fi","wifi.warning":"Writes new Wi-Fi credentials to the battery's communication module. The firmware stores the password in an EEPROM area that overlaps another setting (a known firmware bug), and a wrong or aborted write can leave the module with wrong credentials. Use this only while the battery stays reachable another way - the Marstek app or a cable - to correct it. It needs the integration option Options → DEV registers → Show DEV registers.","wifi.ssid":"SSID","wifi.password":"Password","wifi.hint":"SSID 1 to 31 characters; password empty for an open network or 8 to 31 characters. Printable ASCII only, without comma and double quote. The password is not stored and the field is emptied after every attempt.","wifi.send":"Send credentials","wifi.sent":"Credentials sent. The communication module applies them now and reconnects.","wifi.err.ssid_length":"The SSID has to be 1 to {max} characters long. Nothing has been sent.","wifi.err.ssid_chars":"The SSID may only contain printable ASCII characters, without a comma and without a double quote. Nothing has been sent.","wifi.err.password_length":"The password has to be empty (open network) or {min} to {max} characters long. Nothing has been sent.","wifi.err.password_chars":"The password may only contain printable ASCII characters, without a comma and without a double quote. Nothing has been sent.","settings.title":"Settings","settings.scheme":"Colour scheme","settings.scheme_hint":"Each scheme brings its own light and dark version. The swatch is painted in the scheme it offers.","settings.scheme_theme":"follows your theme","settings.appearance":"Appearance","settings.mode":"Light or dark","settings.mode.auto":"Home Assistant","settings.mode.dark":"Dark","settings.mode.light":"Light","settings.mode_ha":"This scheme takes its colours from your Home Assistant theme, which already decides light or dark.","settings.digits":"Decimal places","settings.digits.normal":"Normal","settings.digits.more":"One more","settings.spread":"Pack spread","settings.spread_hint":"When the packs count as having drifted apart. The device works one pack at a time, so during normal operation they routinely sit a good ten points apart — that is the design working. The table only marks individual packs once the spread itself reaches the warning level.","settings.spread_warn":"Warn above","settings.spread_crit":"Critical above","settings.start_tab":"Tab when opening","settings.start_tab.last":"Last used","settings.start_tab_hint":"A fixed tab that the battery cannot fill falls back to the overview.","settings.tabs":"Tabs","settings.tabs_hint":"Greyed out means this battery does not report what the tab shows, so hiding it is not a choice you have to make.","settings.always":"always shown","settings.unavail.cells":"no per-cell voltages","settings.unavail.packs":"no state of charge per pack","settings.unavail.solar":"no PV inputs","settings.unavail.control":"no writable registers","settings.scale":"Scale","settings.width":"Content width","settings.width.full":"Full width","settings.screen_hint":"Scale and width belong to this browser: a phone and a 4K monitor want different answers, so they are not carried across devices or included in the export.","settings.storage":"Stored settings","settings.reset":"Reset to defaults","settings.transfer":"Import / export","settings.transfer_hint":"Copy this out, paste it in somewhere else. Scale and width are not part of it.","settings.transfer_bad":"That is not a settings object.","settings.import":"Apply pasted","settings.export_again":"Show current","settings.storage_hint":"Everything except scale and width is stored in Home Assistant under your user, so the same panel follows you to every device. Other people keep their own.","settings.offline":"Home Assistant did not answer, so nothing changed here will be kept. Reload the panel to try again.","empty.no_device":"No Marstek battery found","empty.no_device_hint":"This panel reads the Marstek Modbus Suite integration. Add a battery there first.","common.unavailable":"—","code.mppt_error.0":"No error","code.mppt_error.1088":"Battery over-voltage","code.mppt_error.1089":"Battery over-current","code.mppt_error.1093":"MPPT chip over-temperature","code.mppt_error.1094":"PV4 over-current","code.mppt_error.1095":"PV3 over-current","code.mppt_error.1096":"PV2 over-current","code.mppt_error.1097":"PV1 over-current","code.mppt_error.1098":"PV4 reverse current","code.mppt_error.1099":"PV3 reverse current","code.mppt_error.1100":"PV2 reverse current","code.mppt_error.1101":"PV1 reverse current","code.mppt_error.1105":"PE (earth) voltage warning","code.mppt_error.1106":"PE (earth) over-voltage","code.mppt_error.1107":"Battery over-voltage (hardware trip)","code.mppt_error.1109":"PV4 over-voltage","code.mppt_error.1110":"PV3 over-voltage","code.mppt_error.1111":"PV2 over-voltage","code.mppt_error.1112":"PV1 over-voltage","code.mppt_error.1123":"PV4 over-current (hardware trip)","code.mppt_error.1124":"PV3 over-current (hardware trip)","code.mppt_error.1125":"PV2 over-current (hardware trip)","code.mppt_error.1126":"PV1 over-current (hardware trip)","code.mppt_error.1127":"Radiator 1 above 90 °C","code.mppt_error.1128":"Radiator 2 above 90 °C","code.mppt_error.1129":"Ambient above 90 °C","code.mppt_error.1130":"Battery over-current (hardware trip)","code.mppt_warning.0":"No warning","code.mppt_warning.1345":"MPPT power or voltage reference out of range","code.mppt_warning.1363":"Power derating, radiator or ambient above 73 °C","code.mppt_warning.1364":"Radiator 1 sensor open or shorted","code.mppt_warning.1365":"Radiator 2 sensor open or shorted","code.mppt_warning.1366":"Ambient sensor open or shorted","code.mppt_warning.1367":"MPPT chip above 85 °C","code.mppt_warning.1368":"Radiator 1 above 73 °C","code.mppt_warning.1369":"Radiator 2 above 73 °C","code.mppt_warning.1370":"Ambient above 73 °C"},Ge={de:()=>Ae(()=>import("./marstek-modbus-lang-de.js"),[]).then(e=>e.de),nl:()=>Ae(()=>import("./marstek-modbus-lang-nl.js"),[]).then(e=>e.nl)};["en",...Object.keys(Ge)].sort();const kt={en:ut};function Ys(e){return e.split("-")[0].toLowerCase()}async function Gs(e){const t=Ys(e);if(kt[t])return kt[t];const s=Ge[t];if(!s)return ut;try{return kt[t]=await s(),kt[t]}catch{return ut}}function Xs(e,t,s){let a=e[t]??ut[t]??t;if(s)for(const[i,r]of Object.entries(s))a=a.replace(`{${i}}`,String(r));return a}const nt="—";class Pe{constructor(t,s=0){this.language=t,this.extra=s,this.cache=new Map}get extraDigits(){return this.extra}formatter(t){const s=String(t);let a=this.cache.get(s);return a||(a=new Intl.NumberFormat(this.language||"en",{minimumFractionDigits:t,maximumFractionDigits:t}),this.cache.set(s,a)),a}num(t,s=0){return t==null||!Number.isFinite(t)?nt:this.formatter(s+this.extra).format(t)}signed(t,s=0){if(t==null||!Number.isFinite(t))return nt;const a=this.formatter(s+this.extra).format(Math.abs(t));return t>0?`+${a}`:t<0?`−${a}`:a}version(t){return t==null||t===""?nt:/^\d{4}$/.test(t)?`${t.slice(0,3)}.${t.slice(3)}`:t}duration(t){if(t==null||!Number.isFinite(t))return nt;const s=Math.round(Math.abs(t)*60),a=Math.floor(s/60),i=s%60,r=t<0?"−":"";return a===0?`${r}${this.formatter(0).format(i)} min`:i===0?`${r}${this.formatter(0).format(a)} h`:`${r}${this.formatter(0).format(a)} h ${this.formatter(0).format(i)} min`}millivolts(t){return t==null||!Number.isFinite(t)?nt:this.formatter(0).format(Math.round(t*1e3))}}var Js=Object.defineProperty,re=(e,t,s,a)=>{for(var i=void 0,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=n(t,s,i)||i);return i&&Js(t,s,i),i};const Zs=[1,2,3,4],de=class de extends y{kv(t,s=1,a={}){const i=this.reader;if(!i.entityId(t))return h;const r=i.state(t);if(!r)return h;if(a.version)return o`
        <div class="kv" title=${a.title||h}>
          <span>${a.label??i.label(t)}</span>
          <b class=${a.tone??""}>${this.fmt.version(r.state)}</b>
        </div>
      `;const n=a.raw?null:i.num(t),l=i.unit(t),d=n===null?r.state:`${this.fmt.num(n,s)}${l?` ${l}`:""}`;return o`
      <div class="kv" title=${a.title||h}>
        <span>${a.label??i.label(t)}</span>
        <b class="${a.tone??""} ${a.wrap?"wrap":""}">${d}</b>
      </div>
    `}codeLabel(t){const s=this.reader,a=s.codeText(t);if(a===null)return null;const i=s.code(t);if(i!==null){const r=`code.${t}.${i}`,n=this.t(r);if(n!==r)return n}return a}codeRow(t,s=""){const a=this.reader;if(!a.entityId(t)||!a.state(t))return h;const i=this.codeLabel(t);if(i===null)return this.kv(t,0,{raw:!0,tone:s});const r=a.code(t);return this.row(a.label(t),i,s,{title:r===null?void 0:String(r),wrap:!0})}kvFirst(t,s=1,a={}){const i=t.find(r=>this.reader.entityId(r));return i?this.kv(i,s,a):h}packElectrical(){const t=this.reader;if(!t.entityId("battery_1_voltage"))return[this.kv("battery_voltage",2),this.kv("battery_current",2)];const s=t.conductingPack(),a=s===null?this.t("common.standby"):this.t("common.active_pack",{pack:s}),i=this.t("common.active_pack_hint");if(s===null){const r=this.t("common.unavailable");return[this.row(`${this.t("common.voltage")} · ${a}`,r,"",{title:i}),this.row(`${this.t("common.current")} · ${a}`,r,"",{title:i})]}return[this.kv(`battery_${s}_voltage`,2,{label:`${this.t("common.voltage")} · ${a}`,title:i}),this.kv(`battery_${s}_current`,2,{label:`${this.t("common.current")} · ${a}`,title:i})]}row(t,s,a="",i={}){return o`
      <div class="kv">
        <span>${t}</span>
        <b class="${a} ${i.wrap?"wrap":""}" title=${i.title||h}>${s}</b>
      </div>
    `}unitOf(...t){for(const s of t){const a=this.reader.unit(s);if(a)return a}return""}disabledPackNote(t){const s=this.reader;return!s.isSinglePack()||!t.filter(i=>!s.entityId(s.packKey(1,i))).length?h:o`<div
      class="panel note"
      role="note"
      style="margin:0 0 var(--mk-gap);border-color:var(--mk-warn)"
    >
      ${this.t("common.pack_entities_disabled")}
    </div>`}get packs(){return Array.from({length:this.reader.packCount()},(t,s)=>s+1)}packCellTemps(t){return Zs.map(s=>this.reader.num(`battery_${t}_cell_temperature_${s}`)).filter(s=>s!==null)}cellTempExtremes(){const t=this.packs.map(i=>({pack:i,temps:this.packCellTemps(i)})).filter(i=>i.temps.length>0);if(!t.length)return null;const s=Math.max(...t.map(i=>Math.max(...i.temps))),a=Math.min(...t.map(i=>Math.min(...i.temps)));return{hi:{value:s,packs:t.filter(i=>Math.max(...i.temps)===s).map(i=>i.pack)},lo:{value:a,packs:t.filter(i=>Math.min(...i.temps)===a).map(i=>i.pack)}}}};de.styles=[_];let x=de;re([p({attribute:!1})],x.prototype,"reader");re([p({attribute:!1})],x.prototype,"fmt");re([p({attribute:!1})],x.prototype,"t");var Qs=Object.defineProperty,ta=Object.getOwnPropertyDescriptor,vt=(e,t,s,a)=>{for(var i=a>1?void 0:a?ta(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&Qs(t,s,i),i};const zt=118,Ft=97,ea=2*Math.PI*zt,sa=2*Math.PI*Ft;let J=class extends y{constructor(){super(...arguments),this.soc=null,this.usable=null,this.caption="",this.sub=""}arc(e,t){const s=e===null?0:Math.min(Math.max(e,0),100);return`${t*s/100} ${t}`}render(){const e=this.soc===null?"—":Math.round(this.soc).toString();return o`
      <svg
        viewBox="0 0 300 268"
        role="img"
        aria-label=${this.soc===null?this.caption:`${this.caption} ${Math.round(this.soc)} %`}
      >
        <defs>
          <linearGradient id="mk-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--mk-accent)" />
            <stop offset="100%" stop-color="var(--mk-accent-deep)" />
          </linearGradient>
        </defs>

        <circle class="track" cx="150" cy="134" r=${zt} stroke-width="15" />
        <circle
          class="arc-outer"
          cx="150"
          cy="134"
          r=${zt}
          stroke-width="15"
          stroke-dasharray=${this.arc(this.soc,ea)}
          transform="rotate(-90 150 134)"
        />

        ${this.usable===null?h:$e`
              <circle class="track" cx="150" cy="134" r=${Ft} stroke-width="5" />
              <circle
                class="arc-inner"
                cx="150" cy="134" r=${Ft} stroke-width="5"
                stroke-dasharray=${this.arc(this.usable,sa)}
                transform="rotate(-90 150 134)"
              />
            `}

        <text class="num" x="146" y="132" text-anchor="middle">${e}</text>
        <text class="pct" x="196" y="132" text-anchor="start">%</text>
        <text class="cap" x="150" y="158" text-anchor="middle">${this.caption}</text>
        ${this.sub?$e`<text class="sub" x="150" y="186" text-anchor="middle">${this.sub}</text>`:h}
      </svg>
    `}};J.styles=[_,b`
      :host {
        display: block;
      }
      svg {
        width: 100%;
        max-width: 320px;
        height: auto;
        display: block;
        margin: 0 auto;
      }
      .track {
        fill: none;
        stroke: var(--mk-track);
      }
      .arc-outer {
        fill: none;
        stroke: url(#mk-ring);
        stroke-linecap: butt;
      }
      .arc-inner {
        fill: none;
        stroke: var(--mk-magenta);
      }
      text {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
      }
      .num {
        fill: var(--mk-fg);
        font-size: 66px;
        font-weight: 600;
      }
      .pct {
        fill: var(--mk-dim);
        font-size: 21px;
      }
      .cap {
        fill: var(--mk-dim);
        font-size: 11px;
        letter-spacing: 3.5px;
      }
      .sub {
        fill: var(--mk-magenta);
        font-size: 14px;
      }
    `];vt([p({type:Number})],J.prototype,"soc",2);vt([p({type:Number})],J.prototype,"usable",2);vt([p({type:String})],J.prototype,"caption",2);vt([p({type:String})],J.prototype,"sub",2);J=vt([k("mk-gauge")],J);var aa=Object.defineProperty,ia=Object.getOwnPropertyDescriptor,K=(e,t,s,a)=>{for(var i=a>1?void 0:a?ia(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&aa(t,s,i),i};let D=class extends y{constructor(){super(...arguments),this.label="",this.value="—",this.unit="",this.foot="",this.tone="",this.bar=null,this.max=null}get fill(){return this.bar===null||this.max===null||this.max===0?null:Math.min(Math.max(this.bar/this.max*100,0),100)}render(){const e=this.fill;return o`
      <div class="label">${this.label}</div>
      <div class="num ${this.tone}">
        ${this.value}${this.unit?o`<span class="unit">${this.unit}</span>`:h}
      </div>
      ${e===null?h:o`<div class="track"><i style="width:${e}%"></i></div>`}
      ${this.foot?o`<div class="foot">${this.foot}</div>`:h}
    `}};D.styles=[_,b`
      :host {
        display: block;
        background: var(--mk-surface);
        border: 1px solid var(--mk-line);
        padding: 15px 17px;
      }
      .num {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 24px;
        margin-top: 5px;
        letter-spacing: -0.01em;
      }
      .unit {
        font-size: 11px;
        color: var(--mk-dim);
        margin-left: 4px;
        font-weight: 400;
      }
      .track {
        height: 5px;
        background: var(--mk-track);
        margin-top: 9px;
        position: relative;
        overflow: hidden;
      }
      .track > i {
        position: absolute;
        inset: 0 auto 0 0;
        display: block;
        background: var(--mk-accent);
      }
      .foot {
        font-family: var(--mk-mono);
        font-size: 10.5px;
        color: var(--mk-dim);
        margin-top: 7px;
        line-height: 1.6;
      }
      .ok > i,
      :host([tone="ok"]) .track > i {
        background: var(--mk-ok);
      }
      :host([tone="warn"]) .track > i {
        background: var(--mk-warn);
      }
      :host([tone="crit"]) .track > i {
        background: var(--mk-crit);
      }
      :host([tone="magenta"]) .track > i {
        background: var(--mk-magenta);
      }
    `];K([p({type:String})],D.prototype,"label",2);K([p({type:String})],D.prototype,"value",2);K([p({type:String})],D.prototype,"unit",2);K([p({type:String})],D.prototype,"foot",2);K([p({type:String})],D.prototype,"tone",2);K([p({type:Number})],D.prototype,"bar",2);K([p({type:Number})],D.prototype,"max",2);D=K([k("mk-stat")],D);const ra=.05,Xe=.1;function Je(e){return e===null?"":e>=Xe?"crit":e>=ra?"warn":"ok"}function Ze(e){const t=Je(e);return t==="ok"?"":t}const bt=19,ne=25,Vt=5,Ut=60,Ce=1;function na(e){return e+5}function oa(e,t=bt,s=ne){return e===null?"":e>=s?"crit":e>=t?"warn":"ok"}function Qe(e,t,s,a=bt){return e===null||t===null||s===null||s<a?!1:Math.abs(e-t)>a/2}var la=Object.getOwnPropertyDescriptor,ca=(e,t,s,a)=>{for(var i=a>1?void 0:a?la(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=n(i)||i);return i};const da=30;let Bt=class extends x{render(){const e=this.reader,t=this.fmt,s=this.t,a=e.num("battery_soc"),i=e.numFirst(B),r=e.num("stored_energy"),n=e.num("battery_power"),l=e.num("usable_energy"),d=l!==null&&i?l/i*100:null,c=n!==null&&Math.abs(n)>da,m=c&&n<0,u=e.packCount();return o`
      <div class="top">
        <div class="panel">
          <div class="label" style="margin-bottom:12px">${s("core.electrical")}</div>
          ${this.kv("ac_power",0)} ${this.kv("battery_power",0)}
          ${this.packElectrical()}
          ${this.kv("ac_voltage",1)} ${this.kv("ac_frequency",1)}
          ${this.kv("conversion_efficiency",1)}
        </div>

        <div class="centre">
          <mk-gauge
            .soc=${a}
            .usable=${d}
            caption=${s("core.soc_bms")}
            sub=${d===null?"":s("core.soc_usable",{value:t.num(d,1)})}
          ></mk-gauge>

          <div class="split">
            <div>
              <div class="label">${s("core.stored_of_total")}</div>
              <div class="value">
                ${t.num(r,2)}<span class="of">/ ${t.num(i,2)}</span
                ><span class="unit">kWh</span>
              </div>
            </div>
            ${this.energyCell(c&&!m)}
            ${this.runtimeCell(c,m)}
            ${u?o`<div>
                  <div class="label">${s("core.packs")}</div>
                  <div class="value" style="color:var(--mk-fg-2)">
                    ${t.num(u,0)}
                  </div>
                </div>`:h}
          </div>

          <div
            class="flow ${c?"":"rest"}"
            style=${c?`color: var(${m?"--mk-magenta":"--mk-accent"})`:""}
          >
            ${c?m?"▼":"▲":"•"}
            ${t.num(n===null?null:Math.abs(n),0)} W
          </div>
          <div class="label" style="margin-top:2px">
            ${s(c?m?"core.discharging_to_house":"core.charging_from_grid":"core.at_rest")}
            ${e.inverterState(s)?` · ${e.inverterState(s)}`:""}
          </div>
        </div>

        <div class="panel">
          <div class="label" style="margin-bottom:12px">${s("core.reserve")}</div>
          ${this.kv("usable_energy",2)} ${this.kv("energy_to_full",2)}
          ${this.kv("backup_reserve_energy",2)}
          ${this.kv("battery_cycle_count_calc",2)}
          ${this.kv("battery_cycle_count",0)} ${this.kv("remaining_cycles",0)}
          ${this.kv("battery_health",2)}
        </div>
      </div>

      <div class="grid tiles">
        <mk-stat
          label=${s("core.today_charged")}
          value=${t.num(e.num(e.firstKey(["total_daily_ac_input_energy","total_daily_charging_energy"])??""),2)}
          unit="kWh"
        ></mk-stat>
        <mk-stat
          label=${s("core.today_discharged")}
          value=${t.num(e.num(e.firstKey(["total_daily_ac_output_energy","total_daily_discharging_energy"])??""),2)}
          unit="kWh"
          tone="magenta"
        ></mk-stat>
        ${this.deltaTile()}
        <mk-stat
          label=${s("core.internal_temp")}
          value=${t.num(e.numFirst(Wt),1)}
          unit=${this.unitOf(...Wt)}
          tone="ok"
        ></mk-stat>
        <mk-stat
          label=${s("core.mppt_total")}
          value=${t.num(e.sum(["mppt1_power","mppt2_power","mppt3_power","mppt4_power"]),0)}
          unit="W"
        ></mk-stat>
        <mk-stat
          label=${e.label("round_trip_efficiency_total")}
          value=${t.num(e.num("round_trip_efficiency_total"),1)}
          unit="%"
          .bar=${e.num("round_trip_efficiency_total")}
          .max=${100}
        ></mk-stat>
      </div>
    `}energyCell(e){const t=e?"energy_to_full":"usable_energy",s=this.reader.num(t);return s===null&&!this.reader.entityId(t)?h:o`
      <div>
        <div class="label">${this.t(e?"core.to_full":"core.usable")}</div>
        <div class="value" style="color:var(${e?"--mk-accent":"--mk-fg"})">
          ${this.fmt.num(s,2)}<span class="unit">kWh</span>
        </div>
      </div>
    `}runtimeCell(e,t){const s=t?"runtime_to_empty":"runtime_to_full";if(!this.reader.entityId(s))return h;const a=e?this.t(t?"core.to_empty":"core.until_full"):this.t("core.runtime");return o`
      <div>
        <div class="label">${a}</div>
        <div class="value" style=${e?"":"color:var(--mk-dim)"}>
          ${e?o`${this.fmt.duration(this.reader.num(s))}`:"—"}
        </div>
        ${e&&!t?this.chargeSteps():h}
      </div>
    `}chargeSteps(){const e=[95,90].map(t=>({pct:t,hours:this.reader.attr("runtime_to_full",`hours_to_${t}`,null)})).filter(t=>typeof t.hours=="number"&&t.hours>0);return e.length?o`
      <div class="steps">
        ${e.map(t=>o`<div>
            ${this.t("core.until_pct",{value:String(t.pct)})}
            ${this.fmt.duration(t.hours)}
          </div>`)}
      </div>
    `:h}deltaTile(){const e=this.reader;let t=null;for(let a=1;a<=e.packCount();a++){const i=e.packNum(a,"max_cell_voltage"),r=e.packNum(a,"min_cell_voltage");if(i===null||r===null)continue;const n=i-r;(!t||n>t.delta)&&(t={pack:a,delta:n})}const s=Je(t?.delta??null);return o`
      <mk-stat
        label=${this.t("core.cell_delta")}
        value=${this.fmt.millivolts(t?.delta??null)}
        unit="mV"
        tone=${s}
        .bar=${t?.delta??null}
        .max=${Xe}
        foot=${t?this.t("core.in_pack",{pack:t.pack}):this.t("core.no_delta")}
      ></mk-stat>
    `}};Bt.styles=[_,b`
      .top {
        display: grid;
        grid-template-columns: 262px 1fr 262px;
        gap: var(--mk-gap);
        align-items: start;
      }
      @media (max-width: 1100px) {
        .top {
          grid-template-columns: 1fr;
        }
      }


      .centre {
        text-align: center;
        padding: 4px 0;
      }
      .split {
        display: flex;
        border: 1px solid var(--mk-line);
        background: var(--mk-surface);
        margin-top: 2px;
      }
      .split > div {
        flex: 1;
        padding: 11px 8px;
        border-right: 1px solid var(--mk-line);
      }
      .split > div:last-child {
        border-right: 0;
      }
      .split .value {
        font-size: 21px;
        margin-top: 3px;
      }
      .split .of {
        font-size: 13px;
        color: var(--mk-dim);
        font-weight: 400;
        margin-left: 5px;
      }
      .split .unit {
        font-size: 11px;
        color: var(--mk-dim);
        margin-left: 4px;
        font-weight: 400;
      }
      .split .steps {
        margin-top: 4px;
        font-size: 11px;
        color: var(--mk-dim);
        line-height: 1.5;
      }

      .flow {
        margin-top: 11px;
        font-family: var(--mk-mono);
        font-size: 26px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .flow.rest {
        color: var(--mk-dim);
      }

      .tiles {
        grid-template-columns: repeat(6, 1fr);
        margin-top: var(--mk-gap);
      }
      @media (max-width: 1400px) {
        .tiles {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      @media (max-width: 700px) {
        .tiles {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `];Bt=ca([k("mk-view-core")],Bt);const ha=30,pa=37,Me=1e-6,ma=10;function ua(e){let t=ha,s=pa;for(const a of e)Number.isFinite(a)&&(t=Math.min(t,Math.floor(a*10+Me)),s=Math.max(s,Math.ceil(a*10-Me)));return{lo:t/10,hi:s/10}}function fa({lo:e,hi:t}){const s=Math.round(e*10),a=Math.round(t*10),i=[1,2,5,10,20].find(n=>(a-s)/n<=ma)??20,r=[];for(let n=Math.ceil(s/i)*i;n<=a;n+=i)r.push(n/10);return r}var ga=Object.defineProperty,va=Object.getOwnPropertyDescriptor,_t=(e,t,s,a)=>{for(var i=a>1?void 0:a?va(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&ga(t,s,i),i};let Z=class extends y{constructor(){super(...arguments),this.ranges=[],this.packLabel="PACK",this.formatVolts=e=>e.toFixed(3),this.formatTick=e=>e.toFixed(1)}get bounds(){return ua(this.ranges.flatMap(e=>[e.min,e.max]))}pct(e){const{lo:t,hi:s}=this.bounds,a=s-t||1;return Math.min(100,Math.max(0,(e-t)/a*100))}render(){if(!this.ranges.length)return h;const{lo:e,hi:t}=this.bounds,s=fa({lo:e,hi:t}),a=s.map((i,r)=>({at:(i-e)/(t-e)*100,value:i,cls:[r===0&&i===e?"first":"",r===s.length-1&&i===t?"last":"",r%2?"alt":""].filter(Boolean).join(" ")}));return o`
      <div class="axis">
        <div></div>
        <div class="ticks">
          ${a.map(i=>o`<span class=${i.cls} style="left:${i.at}%"
                >${this.formatTick(i.value)}</span
              >`)}
        </div>
        <div class="right"><span class="label">Δ</span></div>
      </div>

      ${this.ranges.map(i=>{const r=i.max-i.min,n=Ze(r),l=Math.max(this.pct(i.max)-this.pct(i.min),.6),d=Math.min(this.pct(i.min),100-l),c=this.pct((i.min+i.max)/2);return o`
          <div class="row">
            <div><span class="name ${n}">${this.packLabel} ${i.index}</span></div>
            <div class="rail">
              ${a.map(m=>o`<i class="gl" style="left:${m.at}%"></i>`)}
              <i class="bar ${n}" style="left:${d}%;width:${l}%"></i>
              <i class="mid" style="left:${c}%"></i>
            </div>
            <div class="right">
              <span class="delta ${n}">${Math.round(r*1e3)} mV</span>
              ${i.note?o`<span class="label note wide">${i.note}</span>`:h}
            </div>
            <div class="span">
              ${this.formatVolts(i.min)} – ${this.formatVolts(i.max)} V
              ${i.note?o`<span class="label note">${i.note}</span>`:h}
            </div>
          </div>
        `})}
    `}};Z.styles=[_,b`
      .axis {
        display: grid;
        grid-template-columns: 104px 1fr 172px;
        margin-bottom: 2px;
      }
      .ticks {
        position: relative;
        height: 15px;
        border-bottom: 1px solid var(--mk-line);
      }
      .ticks > span {
        position: absolute;
        font-family: var(--mk-mono);
        font-size: 9.5px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--mk-dim);
      }
      .ticks > span.first {
        transform: none;
      }
      .ticks > span {
        transform: translateX(-50%);
        letter-spacing: 0.04em;
        white-space: nowrap;
      }
      .ticks > span.last {
        transform: translateX(-100%);
      }
      /* Faint lines at the labelled values, so a bar's position can be read
         against the same grid on every refresh. */
      .gl {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        display: block;
        background: var(--mk-line-soft);
      }
      /* Medium widths: label every second tick (the grid lines stay). */
      @media (max-width: 960px) {
        .ticks > span.alt {
          display: none;
        }
      }
      .row {
        display: grid;
        grid-template-columns: 104px 1fr 172px;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid var(--mk-line-soft);
      }
      .row:last-of-type {
        border-bottom: 0;
      }
      .rail {
        position: relative;
        height: 17px;
        background: var(--mk-inset);
      }
      .bar {
        position: absolute;
        top: 2px;
        bottom: 2px;
        display: block;
        background: var(--mk-ok);
        min-width: 2px;
      }
      .bar.warn {
        background: var(--mk-warn);
      }
      .bar.crit {
        background: var(--mk-crit);
      }
      .mid {
        position: absolute;
        top: -2px;
        bottom: -2px;
        width: 1px;
        display: block;
        background: var(--mk-fg);
      }
      .name {
        font-family: var(--mk-mono);
        font-size: 12.5px;
        font-weight: 600;
      }
      .right {
        text-align: right;
      }
      .delta {
        font-family: var(--mk-mono);
        font-size: 12.5px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      .note {
        margin: 0 0 0 10px;
        display: inline;
      }
      /* The shared axis is the point of this card, and on a phone it is two
         centimetres wide - every pack lands on the same pixel. Below that
         width the range is written out instead. */
      /* Only one of the two copies is ever visible; which one depends on
         whether the row still has a bar to sit beside. */
      .span {
        display: none;
        font-family: var(--mk-mono);
        font-size: 11.5px;
        font-variant-numeric: tabular-nums;
        color: var(--mk-fg-2);
      }
      @media (max-width: 640px) {
        .axis,
        .rail {
          display: none;
        }
        .row {
          grid-template-columns: 1fr auto;
          row-gap: 3px;
          padding: 9px 0;
        }
        .span {
          display: block;
          grid-column: 1 / -1;
        }
        .note {
          margin-left: 8px;
        }
        .note.wide {
          display: none;
        }
      }
    `];_t([p({attribute:!1})],Z.prototype,"ranges",2);_t([p({type:String})],Z.prototype,"packLabel",2);_t([p({attribute:!1})],Z.prototype,"formatVolts",2);_t([p({attribute:!1})],Z.prototype,"formatTick",2);Z=_t([k("mk-pack-matrix")],Z);var ba=Object.getOwnPropertyDescriptor,_a=(e,t,s,a)=>{for(var i=a>1?void 0:a?ba(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=n(i)||i);return i};const ka={[Ds]:"cells.mos_off",[Ye]:"cells.mos_charge",[Ls]:"cells.mos_discharge",[ae]:"cells.mos_both"};let jt=class extends x{get ranges(){const e=this.reader,t=this.unitOf(...this.packs.map(a=>`battery_${a}_mos_temperature`)),s=[];for(const a of this.packs){const i=e.packNum(a,"min_cell_voltage"),r=e.packNum(a,"max_cell_voltage");if(i===null||r===null)continue;const n=e.packNum(a,"cycle_count"),l=e.num(`battery_${a}_mos_temperature`),d=[n===null?null:`${this.fmt.num(n,0)} ⟳`,l===null?null:`${this.fmt.num(l,1)}${t?` ${t}`:""}`].filter(Boolean).join(" · ");s.push({index:a,min:i,max:r,note:d})}return s}render(){const e=this.reader,t=this.fmt,s=this.t,a=this.ranges,i=a.map(f=>f.max),r=a.map(f=>f.min),n=a.length?Math.max(...i)-Math.min(...r):null,l=a.reduce((f,v)=>!f||v.max-v.min>f.max-f.min?v:f,null),d=a.length*e.cellsPerPack(),c=a.map(f=>f.max-f.min),m=c.length?c.reduce((f,v)=>f+v,0)/c.length:null,u=this.unitOf(...this.packs.map(f=>`battery_${f}_cell_temperature_1`),"max_cell_temperature",...It);return o`
      ${this.disabledPackNote(["max_cell_voltage","min_cell_voltage","cell_1_voltage","cell_temperature_1","protection_1","bms_warnings","mos_status"])}
      <div class="grid tiles">
        <mk-stat
          label=${s("cells.highest")}
          value=${t.num(i.length?Math.max(...i):null,3)}
          unit="V"
          foot=${i.length?s("cells.in_pack",{pack:a[i.indexOf(Math.max(...i))].index}):""}
        ></mk-stat>
        <mk-stat
          label=${s("cells.lowest")}
          value=${t.num(r.length?Math.min(...r):null,3)}
          unit="V"
          foot=${r.length?s("cells.in_pack",{pack:a[r.indexOf(Math.min(...r))].index}):""}
        ></mk-stat>
        <mk-stat
          label=${s("cells.stack_spread")}
          value=${t.millivolts(n)}
          unit="mV"
          foot=${s("cells.stack_hint")}
        ></mk-stat>
        <mk-stat
          label=${s("cells.mean_delta")}
          value=${t.millivolts(m)}
          unit="mV"
          foot=${l?s("cells.worst_pack",{pack:l.index,value:t.millivolts(l.max-l.min)}):""}
        ></mk-stat>
        ${this.tempSpanTile(u)}
        <mk-stat
          label=${s("cells.packs_online")}
          value=${`${a.length} / ${e.num("bms_pack_count")??a.length}`}
          foot=${d?s("cells.cells_total",{count:d}):""}
        ></mk-stat>
      </div>

      <div class="panel">
        <div class="head">
          <div class="label">${s("cells.matrix_title")}</div>
          <div class="label">${s("cells.matrix_axis")}</div>
        </div>
        ${a.length?o`
              <mk-pack-matrix
                .ranges=${a}
                packLabel=${s("common.pack")}
                .formatVolts=${f=>t.num(f,3)}
                .formatTick=${f=>t.num(f,1)}
              ></mk-pack-matrix>
            `:o`<div class="note">${s("cells.no_ranges")}</div>`}
        <div class="note">${s("cells.matrix_legend")}</div>
      </div>

      ${this.cellVoltages()}

      <div class="grid below">
        <div class="panel">
          <div class="head"><div class="label">${s("cells.protection")}</div></div>
          ${this.protectionRows()}
        </div>
        <div class="panel">
          <div class="head"><div class="label">${s("cells.bms")}</div></div>
          ${this.kv("bms_pack_count",0)} ${this.kv("bms_online_mask",0)}
          ${this.kv("bms_active_pack_index",0)} ${this.kv("bms_battery_voltage",2)}
          ${this.kv("bms_charge_voltage_limit",2)}
          ${this.kv("bms_charge_current_limit",1)} ${this.kv("bms_discharge_current_limit",1)}
          ${this.kv("battery_1_profile",0,{raw:!0})}
        </div>
      </div>
    `}tempSpanTile(e){const t=this.reader,s=this.fmt,a=this.t,i=e?` ${e}`:"";let r=null;for(const d of this.packs){const c=this.packCellTemps(d);if(c.length<2)continue;const m=Math.min(...c),u=Math.max(...c);(!r||u-m>r.hi-r.lo)&&(r={pack:d,lo:m,hi:u})}if(r)return o`<mk-stat
        label=${a("cells.temp_span")}
        value=${s.num(r.hi-r.lo,1)}
        unit=${e}
        foot=${a("cells.temp_span_pack",{pack:r.pack,range:`${s.num(r.lo,1)} – ${s.num(r.hi,1)}${i}`})}
      ></mk-stat>`;const n=this.packs.length<=1?t.num("max_cell_temperature"):null,l=this.packs.length<=1?t.numFirst(It):null;return o`<mk-stat
      label=${a("cells.temp_span")}
      value=${s.num(n===null||l===null?null:n-l,1)}
      unit=${e}
      foot=${n===null||l===null?"":`${s.num(l,1)} – ${s.num(n,1)}${i}`}
    ></mk-stat>`}cellVoltages(){const e=this.reader;if(this.packs.length!==1)return h;const t=e.cellsPerPack();if(!t)return h;const s=Array.from({length:t},(n,l)=>l+1).filter(n=>e.entityId(`battery_1_cell_${n}_voltage`)),a=s.map(n=>e.num(`battery_1_cell_${n}_voltage`)).filter(n=>n!==null),i=a.length?Math.max(...a):null,r=a.length?Math.min(...a):null;return o`
      <div class="panel" style="margin-top:var(--mk-gap)">
        <div class="head">
          <div class="label">${this.t("cells.cell_voltages")}</div>
          <div class="label">${this.t("cells.cells_total",{count:s.length})}</div>
        </div>
        <div class="cellgrid">
          ${s.map(n=>{const l=e.num(`battery_1_cell_${n}_voltage`),d=l===null||a.length<2?"":l===i?"accent":l===r?"warn":"";return this.row(`#${n}`,`${this.fmt.num(l,3)} V`,d)})}
        </div>
      </div>
    `}protectionRows(){const e=this.reader,t=this.t,s=[],a=[],i=[],r=[],n=this.packs.length===1;for(const c of this.packs){for(const v of[`battery_${c}_protection_1`,`battery_${c}_protection_2`]){const C=e.num(v);C&&s.push(this.bitRow(v,C,"crit"))}const m=e.num(`battery_${c}_bms_warnings`);m&&a.push(this.bitRow(`battery_${c}_bms_warnings`,m,"warn"));const u=e.packNum(c,"mos_status");if(u===null)continue;const f=ka[u];f?ie(u)&&i.push(n?t(f):`${t("common.pack")} ${c} · ${t(f)}`):r.push(`${t("common.pack")} ${c}: ${u}`)}if(!this.packs.length)return o`<div class="note">${t("cells.no_ranges")}</div>`;const l=this.packs.some(c=>e.has(`battery_${c}_protection_1`)),d=this.packs.some(c=>e.has(e.packKey(c,"mos_status")));return o`
      ${this.lockRows()}
      ${s.length?s:l?this.row(t("cells.protection_all",{count:this.packs.length}),t("cells.clear"),"ok"):h}
      ${a}
      ${d?this.row(t("cells.conducting"),i.length?i.join(", "):t("cells.conducting_none"),i.length?"ok":""):h}
      ${r.map(c=>this.row(c,t("cells.mos_unexpected"),"warn"))}
      ${this.kv("fault_status",0,{raw:!0})}
      ${this.bmsVersions()}
      ${d?o`<div class="note">${t("cells.conducting_hint")}</div>`:h}
    `}bitRow(e,t,s){const a=this.reader.activeFaults(e);return this.row(this.reader.label(e),a&&a.length?a.join(", "):String(t),s,{title:String(t),wrap:!0})}lockRows(){const e=this.reader,t=this.t;return["bms_lock_active","bms_factory_mode"].map(s=>e.has(s)?this.row(e.label(s),e.isOn(s)?t("cells.lock_on"):t("cells.lock_off"),e.isOn(s)?"warn":"ok"):h)}bmsVersions(){const e=this.reader,t=new Map;for(const s of this.packs){const a=e.str(e.packKey(s,"bms_version"));a!==null&&t.set(a,[...t.get(a)??[],s])}if(!t.size)return h;if(t.size===1){const[s]=[...t.keys()];return this.row(this.t("cells.bms_version"),`${this.fmt.version(s)} · ${this.t("cells.uniform")}`)}return[...t.entries()].map(([s,a])=>this.row(`${this.t("cells.bms_version")} ${this.fmt.version(s)}`,a.map(i=>`#${i}`).join(" "),"warn"))}};jt.styles=[_,b`
      .tiles {
        grid-template-columns: repeat(6, 1fr);
        margin-bottom: var(--mk-gap);
      }
      @media (max-width: 1400px) {
        .tiles {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      @media (max-width: 700px) {
        .tiles {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      .below {
        grid-template-columns: 1.5fr 1fr;
        margin-top: var(--mk-gap);
      }
      .cellgrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
        gap: 0 18px;
      }
      @media (max-width: 1100px) {
        .below {
          grid-template-columns: 1fr;
        }
      }
    `];jt=_a([k("mk-view-cells")],jt);var ya=Object.defineProperty,$a=Object.getOwnPropertyDescriptor,F=(e,t,s,a)=>{for(var i=a>1?void 0:a?$a(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&ya(t,s,i),i};let M=class extends y{constructor(){super(...arguments),this.packs=[],this.floor=null,this.backupFloor=null,this.packLabel="PACK",this.energyUnit="kWh",this.formatNumber=e=>e===null?"—":String(e),this.spread=null,this.spreadWarn=bt}fill(e){if(e===null)return"var(--mk-track)";const t=Math.min(Math.max(e,0),100)/100,s=t<.5?4+41*(t/.5):45+95*((t-.5)/.5);return`linear-gradient(180deg, hsl(${s.toFixed(0)} 74% 56%), hsl(${s.toFixed(0)} 68% 43%))`}render(){if(!this.packs.length)return h;const e=this.packs.map(s=>s.soc).filter(s=>s!==null).sort((s,a)=>s-a),t=e.length?e[Math.floor(e.length/2)]:null;return o`
      <div class="scroll">
      <div
        class="rack"
        style="grid-template-columns: repeat(${this.packs.length}, minmax(52px, 1fr))"
      >
        ${this.packs.map(s=>{const a=Qe(s.soc,t,this.spread,this.spreadWarn),i=s.soc===null?0:Math.min(Math.max(s.soc,0),100);return o`
            <div>
              <div class="soc ${a?"warn":""}">
                ${this.formatNumber(s.soc,1)}<span class="pct">%</span>
              </div>
              <div class="column ${a?"flagged":""}">
                <div class="fill" style="height:${i}%;background:${this.fill(s.soc)}"></div>
                ${this.floor===null?h:o`<div class="floor" style="bottom:${this.floor}%"></div>`}
                ${this.backupFloor===null?h:o`<div
                      class="backup-floor"
                      style="bottom:${this.backupFloor}%"
                    ></div>`}
                ${s.energy===null?h:o`
                      <div
                        class="readings ${i>=26?"inside":"outside"}"
                        style=${i>=26?`bottom:${i}%;transform:translateY(100%);padding-top:7px`:`bottom:${i}%;transform:translateY(-4px)`}
                      >
                        <span class="kwh">
                          ${this.formatNumber(s.energy,2)}<span class="unit">${this.energyUnit}</span>
                        </span>
                        ${s.socLabel?o`<span class="pct-line">${s.socLabel}</span>`:h}
                      </div>
                    `}
              </div>
              <div class="name ${a?"warn":""}">
                ${this.packLabel} ${s.index}
              </div>
              ${s.note?o`<div class="label note">${s.note}</div>`:h}
            </div>
          `})}
      </div>
      </div>
    `}};M.styles=[_,b`
      /* Seven columns do not fit a phone, and shrinking them further turns the
         numbers inside into a smear. The rack scrolls in its own box instead,
         so reaching pack 7 does not drag the whole page sideways. */
      .scroll {
        overflow-x: auto;
      }

      .rack {
        display: grid;
        gap: 14px;
        align-items: end;
        padding-top: 6px;
      }
      .soc {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 19px;
        text-align: center;
        margin-bottom: 7px;
      }
      .soc .pct {
        font-size: 10px;
        color: var(--mk-dim);
        margin-left: 2px;
      }
      .column {
        position: relative;
        height: 186px;
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
      }
      .column.flagged {
        border-color: var(--mk-warn);
      }
      .fill {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: 7px;
        gap: 1px;
      }
      /* Readings sit inside the fill when it is tall enough to hold them, and
         above it when it is not - a nearly empty pack must not push its own
         figures out of the column. */
      .readings {
        position: absolute;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1px;
        pointer-events: none;
      }
      .readings .kwh {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 12px;
      }
      .readings .kwh .unit {
        font-size: 9px;
        font-weight: 400;
        margin-left: 2px;
        opacity: 0.75;
      }
      .readings .pct-line {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-size: 10px;
        opacity: 0.82;
      }
      .readings.inside {
        color: #0a1410;
      }
      .readings.outside {
        color: var(--mk-fg-2);
      }
      .floor {
        position: absolute;
        left: -1px;
        right: -1px;
        /* Above the fill, or it disappears the moment a pack is charged past
           the floor - which is most of the time. */
        z-index: 1;
        border-top: 2px dashed var(--mk-magenta);
      }
      .floor::after {
        content: "";
        position: absolute;
        right: 0;
        top: -3px;
        border: 3px solid transparent;
        border-right-color: var(--mk-magenta);
      }
      /* Drawn quieter than the floor: it is the exception, reachable only
         while the off-grid output is running, not where discharging stops. */
      .backup-floor {
        position: absolute;
        left: -1px;
        right: -1px;
        z-index: 1;
        border-top: 1px dotted var(--mk-dim);
      }
      .name {
        font-family: var(--mk-mono);
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        margin-top: 8px;
      }
      .note {
        text-align: center;
        margin-top: 3px;
      }
    `];F([p({attribute:!1})],M.prototype,"packs",2);F([p({type:Number})],M.prototype,"floor",2);F([p({type:Number})],M.prototype,"backupFloor",2);F([p({type:String})],M.prototype,"packLabel",2);F([p({type:String})],M.prototype,"energyUnit",2);F([p({attribute:!1})],M.prototype,"formatNumber",2);F([p({type:Number})],M.prototype,"spread",2);F([p({type:Number})],M.prototype,"spreadWarn",2);M=F([k("mk-pack-bars")],M);var wa=Object.getOwnPropertyDescriptor,xa=(e,t,s,a)=>{for(var i=a>1?void 0:a?wa(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=n(i)||i);return i};let Et=class extends x{get backupFloor(){if(!this.reader.entityId("backup_reserve_energy"))return null;const e=this.reader.attr("backup_reserve_energy","backup_floor_percent",null);return typeof e=="number"&&e>=0&&e<100?e:null}constructor(){super(),this.floor=null,this.spreadWarn=bt,this.spreadCrit=ne}get packCapacity(){const e=this.reader.numFirst(B),t=this.packs.length;return e!==null&&t?e/t:null}get fills(){const e=this.reader,t=this.fmt,s=this.packCapacity;return this.packs.map(a=>{const i=e.packNum(a,"soc"),r=e.packNum(a,"min_cell_voltage"),n=e.packNum(a,"max_cell_voltage");return{index:a,soc:i,energy:i===null||s===null?null:i/100*s,socLabel:i===null?void 0:`${t.num(i,1)} %`,note:r===null||n===null?void 0:`${t.num(r,3)} – ${t.num(n,3)} V`}})}render(){const e=this.reader,t=this.fmt,s=this.t,a=this.fills,i=a.map(d=>d.soc).filter(d=>d!==null),r=i.length?i.reduce((d,c)=>d+c,0)/i.length:null,n=i.length?Math.max(...i)-Math.min(...i):null,l=this.packs.map(d=>e.packNum(d,"cycle_count")).filter(d=>d!==null);return o`
      ${this.disabledPackNote(["max_cell_voltage","min_cell_voltage","mos_temperature","env_temperature","cell_temperature_1","mos_status"])}
      <div class="grid tiles">
        <mk-stat
          label=${e.label("battery_soc")}
          value=${t.num(e.num("battery_soc"),0)}
          unit="%"
          foot=${s("packs.device_reading")}
        ></mk-stat>
        <mk-stat
          label=${s("packs.mean_soc")}
          value=${t.num(r,1)}
          unit="%"
          foot=${s("packs.from_n_packs",{count:a.length})}
        ></mk-stat>
        <mk-stat
          label=${s("packs.spread")}
          value=${t.num(n,1)}
          unit="%"
          tone=${oa(n,this.spreadWarn,this.spreadCrit)}
          .bar=${n}
          .max=${na(this.spreadCrit)}
        ></mk-stat>
        <mk-stat
          label=${s("packs.stored_total")}
          value=${t.num(e.num("stored_energy"),2)}
          unit="kWh"
          foot=${e.numFirst(B)===null?"":s("packs.of_max",{value:t.num(e.numFirst(B),2)})}
        ></mk-stat>
        <mk-stat
          label=${s("packs.per_pack")}
          value=${t.num(this.packCapacity,2)}
          unit="kWh"
          foot=${s("packs.nominal")}
        ></mk-stat>
        <mk-stat
          label=${s("packs.cycles_mean")}
          value=${t.num(l.length?l.reduce((d,c)=>d+c,0)/l.length:null,0)}
          foot=${l.length<this.packs.length?s("packs.cycles_partial",{have:l.length,total:this.packs.length}):s("packs.cycles_basis")}
        ></mk-stat>
      </div>

      <div class="panel">
        <div class="head">
          <div class="label">${s("packs.fill_title")}</div>
          <div class="label">${s("packs.fill_axis")}</div>
        </div>
        ${a.length?o`
              <mk-pack-bars
                .packs=${a}
                .floor=${this.floor}
                .backupFloor=${this.backupFloor}
                .spread=${n}
                .spreadWarn=${this.spreadWarn}
                packLabel=${s("common.pack")}
                energyUnit=${e.unit(e.firstKey(B)??"")||"kWh"}
                .formatNumber=${(d,c=0)=>t.num(d,c)}
              ></mk-pack-bars>
            `:o`<div class="note">${s("packs.none")}</div>`}
        <div class="note">
          ${this.floor===null?s("packs.fill_legend_nofloor"):s("packs.fill_legend",{floor:t.num(this.floor,0)})}
          ${this.backupFloor===null?"":` ${s("packs.fill_legend_backup",{backup:t.num(this.backupFloor,0)})}`}
        </div>
      </div>

      ${a.length?this.table(n):h}
    `}table(e){const t=this.reader,s=this.fmt,a=this.t,i=this.packCapacity,r=this.packs.map(c=>t.packNum(c,"soc")).filter(c=>c!==null).sort((c,m)=>c-m),n=r.length?r[Math.floor(r.length/2)]:null,l=this.unitOf(...this.packs.flatMap(c=>[`battery_${c}_mos_temperature`,`battery_${c}_env_temperature`,`battery_${c}_cell_temperature_1`])),d=c=>l?`${c} ${l}`:c;return o`
      <div class="panel table-wrap">
        <div class="head"><div class="label">${a("packs.table_title")}</div></div>
        <div class="scroll">
          <table>
            <thead>
              <tr>
                <th>${a("common.pack")}</th>
                <th class="n">${a("packs.col_soc")}</th>
                <th class="n">${a("packs.col_energy")}</th>
                <th class="n">${a("packs.col_min")}</th>
                <th class="n">${a("packs.col_max")}</th>
                <th class="n">${a("packs.col_delta")}</th>
                <th class="n">${a("packs.col_voltage")}</th>
                <th class="n">${a("packs.col_current")}</th>
                <th class="n">${a("packs.col_cycles")}</th>
                <th class="n">${d(a("packs.col_mos"))}</th>
                <th class="n">${d(a("packs.col_env"))}</th>
                <th class="n">${d(a("packs.col_ntc"))}</th>
              </tr>
            </thead>
            <tbody>
              ${this.packs.map(c=>{const m=t.packNum(c,"soc"),u=t.packNum(c,"min_cell_voltage"),f=t.packNum(c,"max_cell_voltage"),v=u!==null&&f!==null?f-u:null,C=[1,2,3,4].map(it=>t.num(`battery_${c}_cell_temperature_${it}`)).filter(it=>it!==null).map(it=>s.num(it,1)).join(" · "),he=ie(t.packNum(c,"mos_status")),Mt=Qe(m,n,e,this.spreadWarn);return o`
                  <tr class="${Mt?"flagged":""} ${he?"conducting":""}">
                    <td class=${Mt?"warn":""}>
                      ${a("common.pack")} ${c}
                      ${he?o`<span class="live" title=${a("packs.conducting")}></span>`:h}
                    </td>
                    <td class="n ${Mt?"warn":""}">${s.num(m,1)} %</td>
                    <td class="n">
                      ${s.num(m===null||i===null?null:m/100*i,2)}
                    </td>
                    <td class="n">${s.num(u,3)}</td>
                    <td class="n">${s.num(f,3)}</td>
                    <td class="n ${Ze(v)}">
                      ${s.millivolts(v)} mV
                    </td>
                    <td class="n">${s.num(t.packNum(c,"voltage"),2)}</td>
                    <td class="n">${s.num(t.packNum(c,"current"),2)}</td>
                    <td class="n">${s.num(t.packNum(c,"cycle_count"),0)}</td>
                    <td class="n">${s.num(t.num(`battery_${c}_mos_temperature`),1)}</td>
                    <td class="n">${s.num(t.num(`battery_${c}_env_temperature`),1)}</td>
                    <td class="n">${C||"—"}</td>
                  </tr>
                `})}
            </tbody>
          </table>
        </div>
        <div class="note">
          ${a("packs.table_legend",{spread:s.num(this.spreadWarn,0),points:s.num(this.spreadWarn/2,1)})}
        </div>
      </div>
    `}};Et.properties={floor:{type:Number},spreadWarn:{type:Number},spreadCrit:{type:Number}};Et.styles=[_,b`
      /* The working pack, marked rather than coloured: it is information, and
         the two alarm tones in this table are already spoken for. */
      tr.conducting > td:first-child {
        box-shadow: inset 2px 0 0 var(--mk-accent);
      }
      .live {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-left: 6px;
        vertical-align: 1px;
        background: var(--mk-accent);
      }

      .tiles {
        grid-template-columns: repeat(6, 1fr);
        margin-bottom: var(--mk-gap);
      }
      @media (max-width: 1400px) {
        .tiles {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      @media (max-width: 700px) {
        .tiles {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      .table-wrap {
        margin-top: var(--mk-gap);
      }
    `];Et=xa([k("mk-view-packs")],Et);var Sa=Object.getOwnPropertyDescriptor,Ta=(e,t,s,a)=>{for(var i=a>1?void 0:a?Sa(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=n(i)||i);return i};const ot=[1,2,3,4],Oe=1;let Kt=class extends x{render(){const e=this.reader,t=this.fmt,s=this.t,a=ot.map(l=>e.num(`mppt${l}_power`)),i=e.sum(ot.map(l=>`mppt${l}_power`)),r=Math.max(...a.map(l=>l??0),1),n=a.some(l=>l!==null&&l>Oe);return ot.some(l=>e.entityId(`mppt${l}_power`))?o`
      <div class="grid channels">
        ${ot.map(l=>{const d=e.num(`mppt${l}_power`),c=d!==null&&d>Oe;return o`
            <div class="panel">
              <div class="head">
                <div class="label">MPPT ${l}</div>
                <span class="pill ${c?"on":""}">
                  ${s(c?"solar.active":"solar.floating")}
                </span>
              </div>
              <div class="chan-value">
                ${t.num(d,0)}<span class="chan-unit">W</span>
              </div>
              <div class="track">
                <i style="width:${d===null?0:d/r*100}%"></i>
              </div>
              <div style="margin-top:13px">
                ${this.kv(`mppt${l}_voltage`,1)} ${this.kv(`mppt${l}_current`,2)}
              </div>
            </div>
          `})}
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head">
            <div class="label">${s("solar.summary")}</div>
            <div class="label">${s(n?"solar.some_active":"solar.all_idle")}</div>
          </div>
          <div class="chan-value">
            ${t.num(i,0)}<span class="chan-unit">W</span>
          </div>
          ${this.kv("pv_lifetime_energy",2)}
          <div class="note">
            ${s(n?"solar.note_active":"solar.note_floating")}
          </div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${s("solar.diagnostics")}</div></div>
          ${this.codeRow("mppt_error",e.code("mppt_error")?"crit":"ok")}
          ${this.codeRow("mppt_warning",e.code("mppt_warning")?"warn":"ok")}
          ${this.kv("mppt_version",0,{version:!0})}
          ${i===null?h:this.row(s("solar.channels_reporting"),`${a.filter(l=>l!==null).length} / ${ot.length}`)}
        </div>
      </div>
    `:o`<div class="panel"><div class="note">${s("solar.none")}</div></div>`}};Kt.styles=[_,b`
      .channels {
        grid-template-columns: repeat(4, 1fr);
      }
      @media (max-width: 900px) {
        .channels {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      .below {
        grid-template-columns: 1.6fr 1fr;
        margin-top: var(--mk-gap);
      }
      @media (max-width: 1100px) {
        .below {
          grid-template-columns: 1fr;
        }
      }
      .chan-value {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 32px;
      }
      .chan-unit {
        font-size: 13px;
        color: var(--mk-dim);
        margin-left: 5px;
        font-weight: 400;
      }
      .pill {
        font-family: var(--mk-mono);
        font-size: 9.5px;
        letter-spacing: 0.12em;
        padding: 2px 7px;
        border: 1px solid var(--mk-line);
        color: var(--mk-dim);
      }
      .pill.on {
        border-color: var(--mk-accent);
        color: var(--mk-accent);
        background: var(--mk-accent-wash);
      }
      .track {
        height: 5px;
        background: var(--mk-track);
        margin-top: 11px;
        position: relative;
        overflow: hidden;
      }
      .track > i {
        position: absolute;
        inset: 0 auto 0 0;
        display: block;
        background: var(--mk-accent);
      }
    `];Kt=Ta([k("mk-view-solar")],Kt);var Ea=Object.getOwnPropertyDescriptor,Aa=(e,t,s,a)=>{for(var i=a>1?void 0:a?Ea(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=n(i)||i);return i};const Pa=[{titleKey:"energy.today",charge:["total_daily_ac_input_energy","total_daily_charging_energy"],discharge:["total_daily_ac_output_energy","total_daily_discharging_energy"]},{titleKey:"energy.month",charge:["total_monthly_ac_input_energy","total_monthly_charging_energy"],discharge:["total_monthly_ac_output_energy","total_monthly_discharging_energy"],efficiency:"round_trip_efficiency_monthly"},{titleKey:"energy.lifetime",charge:["total_ac_input_energy","total_charging_energy"],discharge:["total_ac_output_energy","total_discharging_energy"],efficiency:"round_trip_efficiency_total",extra:["pv_lifetime_energy"]}];let Ht=class extends x{render(){const e=this.t;return o`
      <div class="grid periods">${Pa.map(t=>this.period(t))}</div>
      <div class="grid below">
        ${this.efficiencyPanel()}
        <div class="panel">
          <div class="head"><div class="label">${e("energy.throughput")}</div></div>
          ${this.kv("battery_cycle_count_calc",2)} ${this.kv("battery_cycle_count",0)}
          ${this.kv("stored_energy",2)} ${this.kvFirst(B,2)}
          ${this.kv("usable_energy",2)} ${this.kv("energy_to_full",2)}
          ${this.kv("remaining_cycles",0)} ${this.kv("battery_health",2)}
        </div>
      </div>
    `}period(e){const t=this.reader,s=this.fmt,a=this.t,i=t.firstKey(e.charge),r=t.firstKey(e.discharge),n=i?t.num(i):null,l=r?t.num(r):null;if(n===null&&l===null)return h;const d=n?(l??0)/n*100:null,c=n!==null&&l!==null?n-l:null,m=e.efficiency?t.num(e.efficiency):null;return o`
      <div class="panel">
        <div class="head">
          <div class="label">${a(e.titleKey)}</div>
          ${m===null?h:o`<span class="pill ${m<70?"w":"on"}">
                ${a("energy.rte")} ${s.num(m,1)} %
              </span>`}
        </div>
        <div class="pair">
          <div>
            <div class="big">${s.num(n,2)}</div>
            <div class="label" style="margin-top:2px">${a("energy.charged")}</div>
          </div>
          <div>
            <div class="big magenta">${s.num(l,2)}</div>
            <div class="label" style="margin-top:2px">${a("energy.discharged")}</div>
          </div>
        </div>
        <div class="track"><i style="width:100%"></i></div>
        <div class="track out">
          <i style="width:${d===null?0:Math.min(d,100)}%"></i>
        </div>
        <div style="margin-top:14px">
          ${c===null?h:this.row(a("energy.loss"),`${s.num(c,2)} kWh`,c/(n||1)>.25?"warn":"")}
          ${d===null?h:this.row(a("energy.returned"),`${s.num(d,1)} %`)}
          ${(e.extra??[]).map(u=>this.kv(u,2))}
        </div>
      </div>
    `}efficiencyPanel(){const e=this.reader,t=this.fmt,s=this.t,a=[[e.label("round_trip_efficiency_total"),e.num("round_trip_efficiency_total"),""],[e.label("round_trip_efficiency_monthly"),e.num("round_trip_efficiency_monthly"),"warn"],[e.label("conversion_efficiency"),e.num("conversion_efficiency"),"ok"]],i=e.num("round_trip_efficiency_total"),r=e.num("round_trip_efficiency_monthly"),n=i!==null&&r!==null?i-r:null;return o`
      <div class="panel">
        <div class="head"><div class="label">${s("energy.efficiency")}</div></div>
        <div class="note" style="margin-top:0;margin-bottom:16px">
          ${s("energy.rte_hint")}
        </div>
        ${a.map(([l,d,c])=>d===null?h:o`
                <div class="meter">
                  <div class="meter-head">
                    <span class="label">${l}</span>
                    <span class="value ${c}" style="font-size:13px">
                      ${t.num(d,1)} %
                    </span>
                  </div>
                  <div class="track">
                    <i
                      style="width:${Math.min(Math.max(d,0),100)}%;background:var(--mk-${c||"accent"})"
                    ></i>
                  </div>
                </div>
              `)}
        ${n===null||Math.abs(n)<5?h:o`<div class="note">
              ${s("energy.gap_hint",{value:t.num(Math.abs(n),1)})}
            </div>`}
      </div>
    `}};Ht.styles=[_,b`
      .periods {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (max-width: 1100px) {
        .periods {
          grid-template-columns: 1fr;
        }
      }
      .pair {
        display: flex;
        gap: 18px;
        align-items: baseline;
      }
      .big {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 30px;
      }
      .track {
        height: 7px;
        background: var(--mk-track);
        margin-top: 4px;
        position: relative;
        overflow: hidden;
      }
      .track > i {
        position: absolute;
        inset: 0 auto 0 0;
        display: block;
        background: var(--mk-accent);
      }
      .track.out > i {
        background: var(--mk-magenta);
      }
      .pill {
        font-family: var(--mk-mono);
        font-size: 9.5px;
        letter-spacing: 0.12em;
        padding: 2px 7px;
        border: 1px solid var(--mk-line);
        color: var(--mk-dim);
      }
      .pill.on {
        border-color: var(--mk-accent);
        color: var(--mk-accent);
        background: var(--mk-accent-wash);
      }
      .pill.w {
        border-color: var(--mk-warn);
        color: var(--mk-warn);
      }
      .below {
        margin-top: var(--mk-gap);
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 1100px) {
        .below {
          grid-template-columns: 1fr;
        }
      }
      .meter + .meter {
        margin-top: 15px;
      }
      .meter-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
    `];Ht=Aa([k("mk-view-energy")],Ht);const Ne=31,Re=8,De=31;function Le(e){for(const t of e){const s=t.codePointAt(0)??0;if(s<32||s>126||t===","||t==='"')return!1}return!0}function Ca(e,t){const s=[...e].length,a=[...t].length;return s<1||s>Ne?{key:"wifi.err.ssid_length",values:{max:Ne}}:Le(e)?t&&(a<Re||a>De)?{key:"wifi.err.password_length",values:{min:Re,max:De}}:Le(t)?null:{key:"wifi.err.password_chars"}:{key:"wifi.err.ssid_chars"}}var Ma=Object.defineProperty,Oa=Object.getOwnPropertyDescriptor,N=(e,t,s,a)=>{for(var i=a>1?void 0:a?Oa(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&Ma(t,s,i),i};const Na=300;let S=class extends y{constructor(){super(...arguments),this.open=!1,this.heading="",this.message="",this.confirmLabel="",this.cancelLabel="",this.note="",this.confirmDisabled=!1,this.openedAt=0}updated(e){e.has("open")&&(this.open&&!this.dialog.open&&(this.openedAt=performance.now(),this.dialog.showModal()),!this.open&&this.dialog.open&&this.dialog.close())}disconnectedCallback(){this.dialog?.open&&this.dialog.close(),super.disconnectedCallback()}render(){return o`
      <dialog
        aria-labelledby="heading"
        @click=${this.backdrop}
        @keydown=${this.keys}
      >
        <div class="body">
          <h2 id="heading">${this.heading}</h2>
          <p>${this.message}</p>
          ${this.note?o`<p class="note" role="timer">${this.note}</p>`:""}
          <div class="buttons">
            <!-- Cancel first, so the dialog opens with the harmless answer
                 focused and Enter does nothing anyone has to undo. -->
            <button @click=${this.cancel}>${this.cancelLabel}</button>
            <button class="confirm" ?disabled=${this.confirmDisabled} @click=${this.confirm}>
              ${this.confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    `}confirm(){this.confirmDisabled||(this.dialog.close(),this.onConfirm?.())}cancel(){this.dialog.close(),this.onCancel?.()}keys(e){e.key==="Escape"&&(e.preventDefault(),this.cancel())}backdrop(e){e.target===this.dialog&&(performance.now()-this.openedAt<Na||this.cancel())}};S.styles=[_,b`
      /* No padding of its own: every pixel of the dialog itself is backdrop
         as far as the click handler is concerned, and the box inside carries
         the spacing. */
      dialog {
        padding: 0;
        border: 1px solid var(--mk-line);
        background: var(--mk-surface);
        color: var(--mk-fg);
        width: min(420px, calc(100vw - 32px));
      }
      dialog::backdrop {
        background: rgb(2 8 14 / 0.72);
      }
      .body {
        padding: 18px;
      }
      h2 {
        font-family: var(--mk-mono);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--mk-crit);
        margin: 0 0 10px;
      }
      p {
        font-family: var(--mk-mono);
        font-size: 11px;
        line-height: 1.6;
        color: var(--mk-fg-2);
        margin: 0 0 18px;
      }
      .buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      button {
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 9px 15px;
        color: var(--mk-fg-2);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        cursor: pointer;
      }
      button:hover {
        border-color: var(--mk-fg-2);
        color: var(--mk-fg);
      }
      button.confirm {
        border-color: var(--mk-crit);
        color: var(--mk-crit);
      }
      button.confirm:hover {
        border-color: var(--mk-crit);
        color: var(--mk-crit);
        background: var(--mk-surface-2);
      }
      button.confirm:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      p.note {
        color: var(--mk-warn);
        margin-top: -8px;
      }
      button:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
    `];N([p({type:Boolean})],S.prototype,"open",2);N([p({type:String})],S.prototype,"heading",2);N([p({type:String})],S.prototype,"message",2);N([p({type:String})],S.prototype,"confirmLabel",2);N([p({type:String})],S.prototype,"cancelLabel",2);N([p({type:String})],S.prototype,"note",2);N([p({type:Boolean})],S.prototype,"confirmDisabled",2);N([p({attribute:!1})],S.prototype,"onConfirm",2);N([p({attribute:!1})],S.prototype,"onCancel",2);N([Ms("dialog")],S.prototype,"dialog",2);S=N([k("mk-confirm")],S);var Ra=Object.defineProperty,Da=Object.getOwnPropertyDescriptor,W=(e,t,s,a)=>{for(var i=a>1?void 0:a?Da(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&Ra(t,s,i),i};const La=new Set(["led_test","inverter_eeprom_test","read_inverter_input_pb1"]),Ia=new Set(["dev_45020_pv_restart","dev_45021_pv_off","dev_45021_pv_on"]),Wa=new Set(["reset_device"]),za=1,Fa=15,Va=8e3;let A=class extends x{constructor(){super(...arguments),this.busy=null,this.armed=null,this.asking=null,this.now=performance.now(),this.toast=null,this.ssid="",this.wifiBusy=!1,this.wifiResult=null}disconnectedCallback(){window.clearInterval(this.ticker),window.clearTimeout(this.toastTimer),this.ticker=void 0,super.disconnectedCallback()}updated(){const e=this.armed!==null;e&&this.ticker===void 0?this.ticker=window.setInterval(()=>this.now=performance.now(),250):!e&&this.ticker!==void 0&&(window.clearInterval(this.ticker),this.ticker=void 0)}get buttons(){const e=this.reader,t=e.buttonKeys().filter(s=>!Wa.has(s)).sort((s,a)=>e.label(s).localeCompare(e.label(a)));return{service:t.filter(s=>!s.startsWith("dev_")),dev:t.filter(s=>s.startsWith("dev_"))}}get wifiAvailable(){return this.controls.hasService("set_wifi")&&!this.reader.isLegacyE()}errorText(e){return js(e)?Promise.resolve(this.t("maint.admin_required")):this.controls.errorText(e)}remaining(e){return e.window-za-(this.now-e.since)/1e3}showToast(e,t){this.toast={text:e,tone:t},window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toast=null,Va)}askFirst(e){return Ia.has(e)||e==="factory_reset"&&this.reader.isLegacyE()}onButton(e){if(!(this.busy||this.armed||this.asking)){if(this.askFirst(e)){this.asking=e;return}this.press(e)}}async arm(e,t,s){const a=await this.controls.warningText(t),i=Number(t.expires_in);this.now=performance.now(),this.armed={key:e,message:a,token:t.token??"",since:s,window:Number.isFinite(i)&&i>0?i:Fa}}async press(e){if(this.busy)return;this.busy=e;const t=performance.now();try{const s=await this.controls.press(e);s?.needs_confirm?await this.arm(e,s,t):this.showToast(this.t("maint.sent",{name:this.reader.label(e)}),"ok")}catch(s){this.showToast(await this.errorText(s),"crit")}finally{this.busy=null}}async confirmArmed(){const e=this.armed;if(this.armed=null,!(!e||this.remaining(e)<=0)){this.busy=e.key;try{await this.controls.press(e.key,e.token),this.showToast(this.t("maint.sent",{name:this.reader.label(e.key)}),"ok")}catch(t){if(Ks(t)){const s=performance.now();try{const a=await this.controls.press(e.key);a?.needs_confirm?await this.arm(e.key,a,s):this.showToast(this.t("maint.sent",{name:this.reader.label(e.key)}),"ok")}catch(a){this.showToast(await this.errorText(a),"crit")}}else this.showToast(await this.errorText(t),"crit")}finally{this.busy=null}}}dropArmed(){const e=this.armed;this.armed=null,e&&this.showToast(this.t("maint.cancelled",{name:this.reader.label(e.key)}),"")}render(){const e=this.t,{service:t,dev:s}=this.buttons,a=this.wifiAvailable;return o`
      <details>
        <summary>${e("maint.title")}</summary>
        <div class="inner">
          <p class="warning">${e("maint.warning")}</p>
          ${this.controls.isAdmin?h:o`<p class="warning">${e("maint.admin_required")}</p>`}
          <div class="grid cards">
            <div class="panel">
              <div class="head"><div class="label">${e("maint.buttons")}</div></div>
              ${t.length||s.length?o`
                    ${t.map(i=>this.buttonRow(i))}
                    ${s.length?o`<div class="label sub">${e("maint.dev")}</div>
                          ${s.map(i=>this.buttonRow(i))}`:h}
                  `:o`<div class="note">${e("maint.none")}</div>`}
              <div class="note">${e("maint.buttons_hint")}</div>
              ${this.toast?o`<div class="toast ${this.toast.tone}" role="status">${this.toast.text}</div>`:h}
            </div>
            ${a?this.wifiCard():h}
          </div>
        </div>
      </details>
      ${this.dialogs()}
    `}buttonRow(e){const t=this.busy!==null||this.armed!==null||this.asking!==null;return o`
      <div class="btn-row">
        <span>${this.reader.label(e)}</span>
        <button
          class="action"
          ?disabled=${t||!this.controls.isAdmin||!this.reader.writable(e)}
          @click=${()=>this.onButton(e)}
        >
          ${this.busy===e?this.t("maint.pressing"):this.t(La.has(e)?"maint.run":"maint.press")}
        </button>
      </div>
    `}dialogs(){const e=this.t,t=this.armed,s=t?this.remaining(t):0,a=t!==null&&s<=0;return o`
      <mk-confirm
        ?open=${t!==null}
        heading=${t?this.reader.label(t.key):""}
        message=${t?.message??""}
        note=${t?a?e("maint.expired"):e("maint.countdown",{seconds:Math.ceil(s)}):""}
        ?confirmDisabled=${a}
        confirmLabel=${e("maint.confirm")}
        cancelLabel=${e(a?"maint.close":"control.cancel")}
        .onConfirm=${()=>void this.confirmArmed()}
        .onCancel=${()=>this.dropArmed()}
      ></mk-confirm>
      <mk-confirm
        ?open=${this.asking!==null}
        heading=${this.asking?this.reader.label(this.asking):""}
        message=${e("maint.ask_message")}
        confirmLabel=${e("maint.press")}
        cancelLabel=${e("control.cancel")}
        .onConfirm=${()=>{const i=this.asking;this.asking=null,i&&this.press(i)}}
        .onCancel=${()=>this.asking=null}
      ></mk-confirm>
    `}wifiCard(){const e=this.t;return o`
      <div class="panel">
        <div class="head"><div class="label">${e("wifi.title")}</div></div>
        <p class="warning">${e("wifi.warning")}</p>
        <form autocomplete="off" @submit=${this.submitWifi}>
          <label>
            <span class="label">${e("wifi.ssid")}</span>
            <input
              name="ssid"
              autocomplete="off"
              spellcheck="false"
              maxlength="31"
              .value=${this.ssid}
              @input=${t=>this.ssid=t.target.value}
            />
          </label>
          <label>
            <span class="label">${e("wifi.password")}</span>
            <!-- Not bound to any property: the value is read once on submit
                 and the field emptied again, so it never sits in the panel's
                 state. -->
            <input id="wifi-password" type="password" name="password" autocomplete="off" maxlength="31" />
          </label>
          <div class="note">${e("wifi.hint")}</div>
          <div class="buttons">
            <button class="action" type="submit" ?disabled=${this.wifiBusy||!this.controls.isAdmin}>
              ${this.wifiBusy?e("maint.pressing"):e("wifi.send")}
            </button>
          </div>
        </form>
        ${this.wifiResult?o`<div class="toast ${this.wifiResult.tone}" role="status">${this.wifiResult.text}</div>`:h}
      </div>
    `}async submitWifi(e){if(e.preventDefault(),this.wifiBusy||!this.controls.isAdmin)return;const t=this.renderRoot.querySelector("#wifi-password"),s=t?.value??"";t&&(t.value="");const a=Ca(this.ssid,s);if(a){this.wifiResult={text:this.t(a.key,a.values),tone:"crit"};return}this.wifiBusy=!0,this.wifiResult=null;try{await this.controls.setWifi(this.ssid,s),this.wifiResult={text:this.t("wifi.sent"),tone:"ok"}}catch(i){this.wifiResult={text:await this.errorText(i),tone:"crit"}}finally{this.wifiBusy=!1}}};A.styles=[_,b`
      details {
        margin-top: var(--mk-gap);
        border: 1px solid var(--mk-crit);
        background: var(--mk-surface);
      }
      summary {
        cursor: pointer;
        padding: 12px 17px;
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--mk-crit);
        list-style-position: inside;
      }
      summary:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: -2px;
      }
      .inner {
        padding: 0 17px 17px;
      }
      .warning {
        font-family: var(--mk-mono);
        font-size: 11px;
        line-height: 1.6;
        color: var(--mk-fg-2);
        border-left: 2px solid var(--mk-crit);
        padding: 4px 0 4px 12px;
        margin: 0 0 14px;
      }
      .cards {
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 1100px) {
        .cards {
          grid-template-columns: 1fr;
        }
      }
      .btn-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 6px 0;
        border-bottom: 1px dashed var(--mk-line-soft);
      }
      .btn-row:last-of-type {
        border-bottom: 0;
      }
      .btn-row > span {
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-fg-2);
      }
      .sub {
        margin: 14px 0 4px;
      }
      button.action {
        flex: none;
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 7px 13px;
        color: var(--mk-fg-2);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        cursor: pointer;
      }
      button.action:hover:not(:disabled) {
        border-color: var(--mk-crit);
        color: var(--mk-crit);
      }
      button.action:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      button.action:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
      .toast {
        margin-top: 12px;
        padding: 8px 12px;
        border: 1px solid var(--mk-line);
        font-family: var(--mk-mono);
        font-size: 11px;
        line-height: 1.6;
        background: var(--mk-surface-2);
      }
      .toast.ok {
        border-color: var(--mk-ok);
      }
      .toast.crit {
        border-color: var(--mk-crit);
      }
      label {
        display: block;
        margin-top: 10px;
      }
      label .label {
        display: block;
        margin-bottom: 4px;
      }
      input {
        width: 100%;
        font-family: var(--mk-mono);
        font-size: 12px;
        color: var(--mk-fg);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        padding: 7px 9px;
      }
      input:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 1px;
      }
      form .buttons {
        margin-top: 14px;
      }
    `];W([p({attribute:!1})],A.prototype,"controls",2);W([g()],A.prototype,"busy",2);W([g()],A.prototype,"armed",2);W([g()],A.prototype,"asking",2);W([g()],A.prototype,"now",2);W([g()],A.prototype,"toast",2);W([g()],A.prototype,"ssid",2);W([g()],A.prototype,"wifiBusy",2);W([g()],A.prototype,"wifiResult",2);A=W([k("mk-maintenance")],A);var Ua=Object.defineProperty,Ba=Object.getOwnPropertyDescriptor,ts=(e,t,s,a)=>{for(var i=a>1?void 0:a?Ba(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&Ua(t,s,i),i};const ja=5,Ka=[2,3],Ha="Ethernet chip reports",qa=["EEPROM fault","Flash fault"],Ie=["alarm_status","fault_status","fault_status_low","fault_status_2_low","mppt_error","mppt_warning"],We=["mppt_warning"],Ya=["bms_lock_active","bms_factory_mode"],Nt=1;let At=class extends x{get gridWaitWord(){return!this.reader.isLegacyE()}faultPart(e,t){return e==="alarm_status"&&this.gridWaitWord&&t%2===Nt?t-Nt:t}notices(){const e=this.reader,t=this.t,s=[];for(const i of Ie){const r=e.code(i);if(!(r===null||r===0)){if(this.faultPart(i,r)){const n=[...i==="alarm_status"&&this.gridWaitWord?[]:e.faultTexts(i)],l=this.codeLabel(i);l!==null&&n.push(l),s.push({level:We.includes(i)?"warn":"crit",text:n.length?`${e.label(i)}: ${n.join(", ")}`:e.label(i),title:String(r)})}i==="alarm_status"&&this.gridWaitWord&&r%2===Nt&&s.push({level:"info",text:t("system.grid_wait"),title:String(r)})}}for(const i of Ya)e.isOn(i)&&s.push({level:"warn",text:t(`system.${i}`)});const a={crit:0,warn:1,info:2};return s.sort((i,r)=>a[i.level]-a[r.level])}banner(){const e=this.t,t=this.notices(),s=t.filter(i=>i.level==="crit"),a=t[0]?.level??"ok";return o`
      <div class="banner ${a}" role=${a==="crit"||a==="warn"?"alert":"status"}>
        <span class="dot"></span>
        <div class="lines">
          ${s.length?o`<div>
                ${e("system.faults_raised",{list:""})}
                ${s.map((i,r)=>o`<span title=${i.title??h}>${r?"; ":""}${i.text}</span>`)}
              </div>`:o`<div>${e("system.no_faults")}</div>`}
          ${t.filter(i=>i.level!=="crit").map(i=>o`<div class="${i.level}-line" title=${i.title??h}>${i.text}</div>`)}
        </div>
      </div>
    `}faultTone(e){const t=this.reader.code(e);return t?We.includes(e)?"warn":this.faultPart(e,t)?"crit":"accent":"ok"}render(){const e=this.t;return o`
      ${this.banner()}

      <div class="grid quad">
        <div class="panel">
          <div class="head"><div class="label">${e("system.device")}</div></div>
          ${this.kvFirst(Is,0,{raw:!0})}
          ${this.row(e("system.packs"),String(this.packs.length))}
          ${this.kvFirst(B,2)} ${this.kv("modbus_address",0,{raw:!0})}
          <!-- The raw register on purpose: the summary corrects 35100 where it
               calls solar passing through "Discharge", a diagnostics view should not. -->
          ${this.kv("inverter_state",0,{raw:!0})} ${this.kv("work_mode",0,{raw:!0})}
          ${this.selfTestRow()}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${e("system.firmware")}</div></div>
          ${this.kv("ems_version",0,{version:!0})} ${this.kvFirst(["battery_1_bms_version","bms_version"],0,{version:!0,label:e("cells.bms_version")})}
          ${this.kvFirst(Ws,0,{version:!0})} ${this.kv("mppt_version",0,{version:!0})}
          ${this.kv("ems_boot_version",0,{version:!0})} ${this.kv("vns_boot_version",0,{version:!0})}
          ${this.kv("comm_module_firmware",0,{raw:!0})}
          ${this.kv("ethernet_chip_version",0,{raw:!0})}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${e("system.connection")}</div></div>
          ${this.kv("bluetooth_status",0,{raw:!0})}
          ${this.kv("device_ip_address",0,{raw:!0})} ${this.kv("gateway_ip_address",0,{raw:!0})}
          ${this.kv("ble_mac_address",0,{raw:!0})}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${e("system.faults")}</div></div>
          ${Ie.map(t=>this.codeRow(t,this.faultTone(t)))}
        </div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head"><div class="label">${e("system.control")}</div></div>
          ${this.kv("set_charge_power",0,{label:e("system.set_charge_power"),title:e("system.set_power_hint")})}
          ${this.kv("set_discharge_power",0,{label:e("system.set_discharge_power"),title:e("system.set_power_hint")})}
          ${this.kv("max_charge_power",0)} ${this.kv("max_discharge_power",0)}
          ${this.kv("charge_to_soc",0)}
          ${this.ceilingNote()}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${e("system.thermal")}</div></div>
          ${this.kvFirst(Wt,1)} ${this.kvFirst(zs,1)}
          ${this.cellTemperatureRows()}
          ${this.packElectrical()}
          ${this.kv("ac_voltage",1)} ${this.kv("ac_frequency",2)}
        </div>
      </div>

      <mk-maintenance
        .reader=${this.reader}
        .fmt=${this.fmt}
        .t=${this.t}
        .controls=${this.controls}
      ></mk-maintenance>
    `}selfTestRow(){const e=this.reader,t=e.str("selftest_status");if(t===null)return h;const s=e.label("selftest_status"),a=e.rawValue("selftest_status");if(a!==null?a===ja:t.startsWith(Ha))return this.row(s,this.t("system.selftest_5"),"",{title:this.t("system.selftest_5_hint"),wrap:!0});const r=a!==null?Ka.includes(a):qa.some(n=>t.includes(n));return this.row(s,t,r?"crit":"",{wrap:!0})}cellTemperatureRows(){const e=this.t,t=this.cellTempExtremes();if(t){const s=this.packs.length>1,a=this.unitOf(...this.packs.map(n=>`battery_${n}_cell_temperature_1`),"max_cell_temperature"),i=n=>`${this.fmt.num(n,1)}${a?` ${a}`:""}`,r=n=>s?e("system.cell_temp_holder",{packs:n.join(", ")}):"";return o`
        ${this.row(e(s?"system.cell_temp_max_all":"system.cell_temp_max"),i(t.hi.value),"",{title:r(t.hi.packs)})}
        ${this.row(e(s?"system.cell_temp_min_all":"system.cell_temp_min"),i(t.lo.value),"",{title:r(t.lo.packs)})}
      `}return o`
      ${this.kv("max_cell_temperature",1,{label:e("system.cell_temp_max_bms")})}
      ${this.packs.length<=1?this.kvFirst(It,1,{label:e("system.cell_temp_min_bms")}):h}
    `}ceilingNote(){const e=this.reader.num("charge_to_soc");if(e===null)return h;const t=Number(this.reader.attr("charge_to_soc","min",10))||10,s=e>=t&&e<=100;return o`
      <div class="note">
        ${s?this.t("system.ceiling_used",{value:this.fmt.num(e,0)}):this.t("system.ceiling_ignored",{value:this.fmt.num(e,0),min:this.fmt.num(t,0)})}
      </div>
    `}};At.styles=[_,b`
      .quad {
        grid-template-columns: repeat(4, 1fr);
      }
      @media (max-width: 1300px) {
        .quad {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 700px) {
        .quad {
          grid-template-columns: 1fr;
        }
      }
      .below {
        margin-top: var(--mk-gap);
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 1100px) {
        .below {
          grid-template-columns: 1fr;
        }
      }
      .banner {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 11px 14px;
        border: 1px solid var(--mk-line);
        background: var(--mk-surface-2);
        margin-bottom: var(--mk-gap);
        font-family: var(--mk-mono);
        font-size: 12px;
      }
      .banner.ok {
        border-color: var(--mk-ok);
      }
      .banner.crit {
        border-color: var(--mk-crit);
      }
      .banner.warn {
        border-color: var(--mk-warn);
      }
      .banner.info {
        border-color: var(--mk-accent);
      }
      .banner {
        align-items: flex-start;
      }
      .lines > div + div {
        margin-top: 4px;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--mk-ok);
        flex: none;
        margin-top: 5px;
      }
      .banner.crit .dot {
        background: var(--mk-crit);
      }
      .banner.warn .dot {
        background: var(--mk-warn);
      }
      .banner.info .dot {
        background: var(--mk-accent);
      }
      .lines .warn-line {
        color: var(--mk-warn);
      }
      .lines .info-line {
        color: var(--mk-accent);
      }
      .lines .crit-line {
        color: var(--mk-crit);
      }
    `];ts([p({attribute:!1})],At.prototype,"controls",2);At=ts([k("mk-view-system")],At);var Ga=Object.defineProperty,Xa=Object.getOwnPropertyDescriptor,P=(e,t,s,a)=>{for(var i=a>1?void 0:a?Xa(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&Ga(t,s,i),i};let w=class extends y{constructor(){super(...arguments),this.label="",this.value=null,this.min=0,this.max=100,this.step=1,this.unit="",this.disabled=!1,this.formatNumber=e=>e===null?"—":String(e),this.dragging=null,this.pending=null}willUpdate(e){e.has("value")&&this.pending!==null&&this.value===this.pending&&(this.pending=null)}get shown(){return this.dragging??this.pending??this.value}render(){const e=this.shown;return o`
      <div class="row">
        <span class="label">${this.label}</span>
        <span class="val ${this.pending!==null?"pending":""}">
          ${this.formatNumber(e)}${this.unit?o`<span class="unit">${this.unit}</span>`:h}
        </span>
      </div>
      <input
        type="range"
        .min=${String(this.min)}
        .max=${String(this.max)}
        .step=${String(this.step)}
        .value=${String(e??this.min)}
        ?disabled=${this.disabled||this.value===null}
        aria-label=${this.label}
        @input=${t=>this.dragging=Number(t.target.value)}
        @change=${t=>this.commit(Number(t.target.value))}
      />
      <div class="ends">
        <span class="label">${this.formatNumber(this.min)}</span>
        <span class="label">${this.formatNumber(this.max)}</span>
      </div>
    `}commit(e){if(this.dragging=null,e===this.value)return;this.pending=e;const t=this.onCommit?.(e);t instanceof Promise&&t.catch(()=>{this.pending===e&&(this.pending=null)})}};w.styles=[_,b`
      :host {
        display: block;
      }
      .row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 7px;
      }
      .val {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 17px;
      }
      .val .unit {
        font-size: 10px;
        color: var(--mk-dim);
        margin-left: 3px;
        font-weight: 400;
      }
      .val.pending {
        color: var(--mk-warn);
      }
      input[type="range"] {
        appearance: none;
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: var(--mk-track);
        outline: none;
        margin: 0;
      }
      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--mk-accent);
        border: 2px solid var(--mk-surface);
        cursor: pointer;
      }
      input[type="range"]::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--mk-accent);
        border: 2px solid var(--mk-surface);
        cursor: pointer;
        border-width: 2px;
      }
      input[type="range"]:disabled {
        opacity: 0.4;
      }
      input[type="range"]:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 3px;
      }
      .ends {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    `];P([p({type:String})],w.prototype,"label",2);P([p({type:Number})],w.prototype,"value",2);P([p({type:Number})],w.prototype,"min",2);P([p({type:Number})],w.prototype,"max",2);P([p({type:Number})],w.prototype,"step",2);P([p({type:String})],w.prototype,"unit",2);P([p({type:Boolean})],w.prototype,"disabled",2);P([p({attribute:!1})],w.prototype,"formatNumber",2);P([p({attribute:!1})],w.prototype,"onCommit",2);P([g()],w.prototype,"dragging",2);P([g()],w.prototype,"pending",2);w=P([k("mk-slider")],w);var Ja=Object.defineProperty,Za=Object.getOwnPropertyDescriptor,H=(e,t,s,a)=>{for(var i=a>1?void 0:a?Za(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&Ja(t,s,i),i};let L=class extends y{constructor(){super(...arguments),this.label="",this.hint="",this.options=[],this.value=null,this.disabled=!1,this.pending=null}willUpdate(e){e.has("value")&&this.pending!==null&&this.value===this.pending&&(this.pending=null)}render(){const e=this.pending??this.value;return o`
      <span class="label">${this.label}</span>
      ${this.hint?o`<span class="hint">${this.hint}</span>`:h}
      <div class="bar" role="group" aria-label=${this.label}>
        ${this.options.map(t=>o`
            <button
              class=${this.pending===t.value?"pending":""}
              aria-pressed=${e===t.value}
              ?disabled=${this.disabled}
              @click=${()=>this.pick(t.value)}
            >
              ${t.label}
            </button>
          `)}
      </div>
    `}pick(e){e!==this.value&&(this.pending=e,this.onSelect?.(e))}};L.styles=[_,b`
      :host {
        display: block;
      }
      .label {
        display: block;
        margin-bottom: 7px;
      }
      .hint {
        display: block;
        font-family: var(--mk-mono);
        font-size: 9.5px;
        color: var(--mk-dim);
        line-height: 1.5;
        margin: -3px 0 7px;
      }
      /* Options that do not fit beside each other drop onto their own row
         instead of pushing the bar - and the whole page with it - out past
         the edge of a phone. The polling choice spells out what pausing does
         to the entities, which is three sentences wide; the mode choice is
         three words and stays on one line where it always was. */
      .bar {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid var(--mk-line);
        background: var(--mk-inset);
        /* Clips each button's separator where it would land on the frame. */
        overflow: hidden;
      }
      button {
        flex: 1 1 auto;
        /* Without this a flex item refuses to shrink below its text. */
        min-width: 0;
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 9px 6px;
        color: var(--mk-dim);
        background: none;
        border: 0;
        cursor: pointer;
        transition: color 0.15s, background 0.15s;
        overflow-wrap: break-word;
        /* Drawn rather than bordered: a border only ever divides one way, and
           these sit beside each other on a wide panel and above each other on
           a narrow one. */
        box-shadow: 1px 0 0 var(--mk-line), 0 1px 0 var(--mk-line);
      }
      button:hover:not(:disabled) {
        color: var(--mk-fg-2);
        background: var(--mk-surface);
      }
      button[aria-pressed="true"] {
        color: var(--mk-accent);
        background: var(--mk-accent-wash);
      }
      button.pending[aria-pressed="true"] {
        color: var(--mk-warn);
        background: transparent;
        box-shadow: inset 0 -2px 0 var(--mk-warn), 1px 0 0 var(--mk-line),
          0 1px 0 var(--mk-line);
      }
      button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      button:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: -2px;
      }
    `];H([p({type:String})],L.prototype,"label",2);H([p({type:String})],L.prototype,"hint",2);H([p({attribute:!1})],L.prototype,"options",2);H([p({type:String})],L.prototype,"value",2);H([p({type:Boolean})],L.prototype,"disabled",2);H([p({attribute:!1})],L.prototype,"onSelect",2);H([g()],L.prototype,"pending",2);L=H([k("mk-segment")],L);var Qa=Object.defineProperty,ti=Object.getOwnPropertyDescriptor,q=(e,t,s,a)=>{for(var i=a>1?void 0:a?ti(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&Qa(t,s,i),i};let I=class extends y{constructor(){super(...arguments),this.label="",this.hint="",this.bare=!1,this.checked=null,this.disabled=!1,this.pending=null}willUpdate(e){e.has("checked")&&this.pending!==null&&this.checked===this.pending&&(this.pending=null)}render(){const e=this.pending??this.checked;return o`
      ${this.bare?h:o`
            <div class="text">
              <div class="name">${this.label}</div>
              ${this.hint?o`<div class="hint">${this.hint}</div>`:h}
            </div>
          `}
      <button
        class=${this.pending!==null?"pending":""}
        role="switch"
        aria-checked=${e===!0}
        aria-label=${this.label}
        ?disabled=${this.disabled||this.checked===null}
        @click=${()=>this.flip()}
      >
        <i></i>
      </button>
    `}flip(){const e=!(this.pending??this.checked);this.pending=e,Promise.resolve(this.onToggle?.(e)).then(t=>{t===!1&&(this.pending=null)})}};I.styles=[_,b`
      :host {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 9px 0;
        border-bottom: 1px dashed var(--mk-line-soft);
      }
      :host(:last-of-type),
      :host([bare]) {
        border-bottom: 0;
      }
      :host([bare]) {
        padding: 0;
        gap: 0;
      }
      .text {
        flex: 1;
        min-width: 0;
      }
      .name {
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-fg);
      }
      .hint {
        font-family: var(--mk-mono);
        font-size: 9.5px;
        color: var(--mk-dim);
        margin-top: 2px;
        line-height: 1.5;
      }
      button {
        flex: none;
        width: 42px;
        height: 22px;
        border-radius: 11px;
        border: 1px solid var(--mk-line);
        background: var(--mk-inset);
        position: relative;
        cursor: pointer;
        transition: background 0.18s, border-color 0.18s;
        padding: 0;
      }
      button > i {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--mk-dim);
        display: block;
        transition: transform 0.18s, background 0.18s;
      }
      button[aria-checked="true"] {
        background: var(--mk-accent-wash);
        border-color: var(--mk-accent);
      }
      button[aria-checked="true"] > i {
        transform: translateX(20px);
        background: var(--mk-accent);
      }
      button.pending {
        border-color: var(--mk-warn);
      }
      button.pending > i {
        background: var(--mk-warn);
      }
      button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      button:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
    `];q([p({type:String})],I.prototype,"label",2);q([p({type:String})],I.prototype,"hint",2);q([p({type:Boolean})],I.prototype,"bare",2);q([p({type:Boolean})],I.prototype,"checked",2);q([p({type:Boolean})],I.prototype,"disabled",2);q([p({attribute:!1})],I.prototype,"onToggle",2);q([g()],I.prototype,"pending",2);I=q([k("mk-toggle")],I);var ei=Object.defineProperty,si=Object.getOwnPropertyDescriptor,V=(e,t,s,a)=>{for(var i=a>1?void 0:a?si(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&ei(t,s,i),i};const ze=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];let O=class extends y{constructor(){super(...arguments),this.rows=[],this.dayLabel=e=>e,this.formatNumber=e=>e===null?"—":String(e)}toClock(e){if(e===null||e<0||e>2359)return"";const t=Math.floor(e/100),s=e%100;return t>23||s>59?"":`${String(t).padStart(2,"0")}:${String(s).padStart(2,"0")}`}fromClock(e){const t=/^(\d{1,2}):(\d{2})$/.exec(e);return t?Number(t[1])*100+Number(t[2]):null}render(){if(!this.rows.length)return h;const e=this.labels;return o`
      <div class="scroll">
      <div class="inner">
      <div class="head-row">
        <span class="label"></span>
        <span class="label">${e.active}</span>
        <span class="label">${e.window}</span>
        <span class="label">${e.power}</span>
        <span class="label">${e.days}</span>
      </div>

      ${this.rows.map(t=>{const s=t.enabled!==!0;return o`
          <div class="row ${s?"off":""}">
            <span class="name">${t.index}</span>

            <mk-toggle
              bare
              .checked=${t.enabled}
              label=${`${e.active} ${t.index}`}
              .onToggle=${a=>this.onEnable?.(t.index,a)}
            ></mk-toggle>

            <div class="times">
              <input
                type="time"
                .value=${this.toClock(t.start)}
                aria-label=${`${e.window} ${t.index}`}
                @change=${a=>this.time(t,"start",a)}
              />
              <span class="dash">–</span>
              <input
                type="time"
                .value=${this.toClock(t.end)}
                aria-label=${`${e.window} ${t.index}`}
                @change=${a=>this.time(t,"end",a)}
              />
            </div>

            <div class="power">
              <input
                type="number"
                .value=${t.power===null?"":String(t.power)}
                min=${t.powerMin}
                max=${t.powerMax}
                step=${t.powerStep}
                aria-label=${`${e.power} ${t.index}`}
                @change=${a=>this.power(t.index,a)}
              />
              <span class="unit">W</span>
            </div>

            <div class="days" role="group" aria-label=${`${e.days} ${t.index}`}>
              ${ze.map(a=>{const i=t.days?.includes(a)??!1;return o`
                  <button
                    class="day ${i?"on":""}"
                    aria-pressed=${i?"true":"false"}
                    ?disabled=${t.days===null}
                    @click=${()=>this.toggleDay(t,a)}
                  >
                    ${this.dayLabel(a)}
                  </button>
                `})}
            </div>
          </div>
        `})}
      </div>
      </div>
    `}toggleDay(e,t){if(e.days===null)return;const s=e.days.includes(t)?e.days.filter(a=>a!==t):[...e.days,t];this.onDays?.(e.index,ze.filter(a=>s.includes(a)))}time(e,t,s){const a=s.target,i=this.fromClock(a.value),r=t==="start"?e.end:e.start;i===null||r===null||(a.value=this.toClock(e[t]),t==="start"?this.onWindow?.(e.index,i,r):this.onWindow?.(e.index,r,i))}power(e,t){const s=Number(t.target.value);Number.isFinite(s)&&this.onPower?.(e,s)}};O.styles=[_,b`
      /* The editor needs its width - a time field cannot usefully shrink -
         so it scrolls inside the card rather than pushing the page. */
      .scroll {
        overflow-x: auto;
      }
      .inner {
        min-width: 660px;
      }
      .head-row,
      .row {
        display: grid;
        grid-template-columns: 60px 52px 200px 1fr 232px;
        align-items: center;
        gap: 12px;
      }
      .head-row {
        padding-bottom: 8px;
        border-bottom: 1px solid var(--mk-line);
        margin-bottom: 4px;
      }
      .row {
        padding: 10px 0;
        border-bottom: 1px solid var(--mk-line-soft);
      }
      .row:last-of-type {
        border-bottom: 0;
      }
      .row.off {
        opacity: 0.55;
      }
      .name {
        font-family: var(--mk-mono);
        font-size: 11.5px;
        font-weight: 600;
      }
      .times {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .dash {
        color: var(--mk-dim);
      }
      input[type="time"],
      input[type="number"] {
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-fg);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        padding: 5px 6px;
        min-width: 0;
      }
      input[type="time"] {
        /* Wide enough for "05:45" plus the picker indicator Chromium adds
           inside the field; anything tighter clips the last digit. */
        width: 92px;
      }
      input[type="number"] {
        width: 78px;
        text-align: right;
      }
      .days {
        display: flex;
        gap: 3px;
      }
      .day {
        flex: 1;
        font-family: var(--mk-mono);
        font-size: 10.5px;
        color: var(--mk-dim);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        padding: 5px 0;
        cursor: pointer;
      }
      .day.on {
        color: var(--mk-bg);
        background: var(--mk-accent);
        border-color: var(--mk-accent);
      }
      .day:disabled {
        opacity: 0.45;
        cursor: default;
      }
      input:focus-visible,
      .day:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 1px;
      }
      input:disabled {
        opacity: 0.45;
      }
      .power {
        display: flex;
        align-items: center;
        gap: 7px;
      }
      .unit {
        font-family: var(--mk-mono);
        font-size: 10px;
        color: var(--mk-dim);
      }
      mk-toggle {
        border-bottom: 0;
        padding: 0;
      }
    `];V([p({attribute:!1})],O.prototype,"rows",2);V([p({attribute:!1})],O.prototype,"labels",2);V([p({attribute:!1})],O.prototype,"dayLabel",2);V([p({attribute:!1})],O.prototype,"formatNumber",2);V([p({attribute:!1})],O.prototype,"onEnable",2);V([p({attribute:!1})],O.prototype,"onWindow",2);V([p({attribute:!1})],O.prototype,"onPower",2);V([p({attribute:!1})],O.prototype,"onDays",2);O=V([k("mk-schedule")],O);var ai=Object.defineProperty,ii=Object.getOwnPropertyDescriptor,at=(e,t,s,a)=>{for(var i=a>1?void 0:a?ii(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&ai(t,s,i),i};const Fe=["set_charge_power","set_discharge_power"],Rt=["max_charge_power","max_discharge_power"],ri=[1,2,3,4,5,6],ni=30;let j=class extends x{constructor(){super(...arguments),this.wrote={},this.confirmReset=!1,this.scheduleError="",this.actionError=""}note(e){this.wrote={...this.wrote,[e]:Date.now()}}overwritten(e){const t=this.wrote[e];if(!t)return!1;const s=this.reader.rawState(e)?.last_updated;if(!s)return!1;const a=(new Date(s).getTime()-t)/1e3;return a>.5&&a<ni}async schedule(e){try{return await e,this.scheduleError="",!0}catch(t){const s=t;return this.scheduleError=s.translation_key?.startsWith("schedule_")?this.t(`control.err.${s.translation_key}`,s.translation_placeholders):s.message??String(t),!1}}async action(e){try{const t=await e;return this.actionError="",t}catch(t){throw this.actionError=await this.controls.errorText(t),t}}slider(e){const t=this.reader;return t.entityId(e)?o`
      <mk-slider
        label=${t.label(e)}
        .value=${t.num(e)}
        .min=${t.attr(e,"min",0)}
        .max=${t.attr(e,"max",100)}
        .step=${t.attr(e,"step",1)}
        unit=${t.unit(e)}
        ?disabled=${!t.writable(e)}
        .formatNumber=${s=>this.fmt.num(s,0)}
        .onCommit=${s=>(this.note(e),this.action(this.controls.setNumber(e,s)))}
      ></mk-slider>
    `:h}segment(e,t=""){const s=this.reader;if(!s.entityId(e))return h;const a=s.attr(e,"options",[]);return o`
      <mk-segment
        label=${s.label(e)}
        hint=${t?this.t(t):""}
        .value=${s.rawState(e)?.state??null}
        .options=${a.map(i=>({value:i,label:this.t(`control.opt.${i}`)}))}
        ?disabled=${!s.writable(e)}
        .onSelect=${i=>{this.note(e),this.action(this.controls.selectOption(e,i)).catch(()=>{})}}
      ></mk-segment>
    `}toggle(e,t){const s=this.reader;if(!s.entityId(e))return h;const a=s.rawState(e);return o`
      <mk-toggle
        label=${s.label(e)}
        hint=${this.t(t)}
        .checked=${a&&a.state!=="unavailable"?a.state==="on":null}
        .onToggle=${i=>{this.note(e),this.action(this.controls.setSwitch(e,i)).catch(()=>{})}}
      ></mk-toggle>
    `}get scheduleRows(){const e=this.reader;return ri.filter(t=>e.entityId(`schedule_${t}_start`)).map(t=>{const s=e.firstKey(Se(t))??`schedule_${t}_mode`,a=e.rawState(`schedule_${t}_enabled`);return{index:t,enabled:a&&a.state!=="unavailable"?a.state==="on":null,start:e.num(`schedule_${t}_start`),end:e.num(`schedule_${t}_end`),power:e.num(s),powerMin:e.attr(s,"min",-2500),powerMax:e.attr(s,"max",2500),powerStep:e.attr(s,"step",1),days:e.attr(`schedule_${t}_days`,"days",null)}})}limitsFloorHint(){const e=Rt.find(a=>this.reader.entityId(a));if(!e)return h;const t=Number(this.reader.attr(e,"min",0)),s=Number(this.reader.attr(e,"max",0));return!(t>0)||!(s>0)?h:this.t("control.limits_floor",{min:this.fmt.num(t,0),max:this.fmt.num(s,0)})}render(){const e=this.t,t=[...Fe,...Rt].filter(a=>this.overwritten(a)),s=this.scheduleRows;return o`
      ${t.length?o`<div class="warn-note">
            <b>!</b>
            <span>
              ${e("control.overwritten",{names:t.map(a=>this.reader.label(a)).join(", ")})}
            </span>
          </div>`:h}

      <div class="grid top">
        <div class="panel stack">
          <div class="head"><div class="label">${e("control.power")}</div></div>
          ${Fe.map(a=>this.slider(a))}
          <div class="note">${e("control.power_hint")}</div>
        </div>

        <div class="panel stack">
          <div class="head"><div class="label">${e("control.limits")}</div></div>
          ${Rt.map(a=>this.slider(a))} ${this.slider("charge_to_soc")}
          <div class="note">${e("control.limits_hint")} ${this.limitsFloorHint()}</div>
        </div>

        <div class="panel stack">
          <div class="head"><div class="label">${e("control.mode")}</div></div>
          ${this.segment("user_work_mode","control.mode_hint")}
          ${this.segment("force_mode")}
          <div>
            ${this.toggle("backup_function","control.backup_hint")}
            ${this.toggle("rs485_control_mode","control.rs485_hint")}
          </div>
        </div>
      </div>

      ${this.actionError?o`<div class="warn-note sched-error" role="alert">
            <b>!</b><span>${this.actionError}</span>
          </div>`:h}

      <div class="grid below">
        <div class="panel stack">
          <div class="head"><div class="label">${e("control.polling")}</div></div>
          ${this.segment("modbus_device_polling")}
          <div class="note">${e("control.polling_hint")}</div>
        </div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head">
            <div class="label">${e("control.schedules")}</div>
            <div class="label">${e("control.schedules_axis")}</div>
          </div>
          ${s.length?o`
                <mk-schedule
                  .rows=${s}
                  .labels=${{window:e("control.window"),power:e("control.sched_power"),days:e("control.days"),active:e("control.active")}}
                  .dayLabel=${a=>e(`control.day.${a}`)}
                  .formatNumber=${a=>this.fmt.num(a,0)}
                  .onEnable=${(a,i)=>this.schedule(this.controls.setSwitch(`schedule_${a}_enabled`,i))}
                  .onWindow=${(a,i,r)=>this.schedule(this.controls.setSchedule(`schedule_${a}_start`,{start:i,end:r}))}
                  .onPower=${(a,i)=>this.schedule(this.controls.setNumber(this.reader.firstKey(Se(a))??`schedule_${a}_mode`,i))}
                  .onDays=${(a,i)=>this.schedule(this.controls.setSchedule(`schedule_${a}_start`,{days:i}))}
                ></mk-schedule>
              `:o`<div class="note">${e("control.no_schedules")}</div>`}
          ${this.scheduleError?o`<div class="warn-note sched-error" role="alert">
                <b>!</b><span>${this.scheduleError}</span>
              </div>`:h}
          <div class="note">${e("control.schedules_hint")}</div>
        </div>
      </div>

      ${this.reader.entityId("reset_device")?o`
            <div class="grid below">
              <div class="panel">
                <div class="head"><div class="label">${e("control.device")}</div></div>
                <div class="danger">
                  <button class="action" @click=${()=>this.confirmReset=!0}>
                    ${e("control.reset")}
                  </button>
                </div>
                <mk-confirm
                  ?open=${this.confirmReset}
                  heading=${e("control.reset_title")}
                  message=${e("control.reset_message")}
                  confirmLabel=${e("control.reset_confirm")}
                  cancelLabel=${e("control.cancel")}
                  .onConfirm=${()=>{this.confirmReset=!1,this.action(this.controls.press("reset_device")).catch(()=>{})}}
                  .onCancel=${()=>this.confirmReset=!1}
                ></mk-confirm>
              </div>
            </div>
          `:h}
    `}};j.styles=[_,b`
      .top {
        grid-template-columns: 1fr 1fr 1fr;
      }
      @media (max-width: 1200px) {
        .top {
          grid-template-columns: 1fr;
        }
      }
      .stack > * + * {
        margin-top: 18px;
      }
      .below {
        margin-top: var(--mk-gap);
        grid-template-columns: 1fr;
      }
      .warn-note {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 10px 13px;
        border: 1px solid var(--mk-warn);
        background: var(--mk-surface-2);
        margin-bottom: var(--mk-gap);
        font-family: var(--mk-mono);
        font-size: 11px;
        line-height: 1.6;
        color: var(--mk-fg-2);
      }
      .warn-note b {
        color: var(--mk-warn);
        flex: none;
      }
      .sched-error {
        margin: 12px 0 0;
      }
      .danger {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
      button.action {
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 9px 15px;
        color: var(--mk-fg-2);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        cursor: pointer;
      }
      button.action:hover {
        border-color: var(--mk-warn);
        color: var(--mk-warn);
      }
      button.action:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
    `];at([p({attribute:!1})],j.prototype,"controls",2);at([g()],j.prototype,"wrote",2);at([g()],j.prototype,"confirmReset",2);at([g()],j.prototype,"scheduleError",2);at([g()],j.prototype,"actionError",2);j=at([k("mk-view-control")],j);const qt=[{id:"reactor",name:"Reactor",dark:{bg:"#05090f",surface:"#0b131d","surface-2":"#101b28",inset:"#0d1723",line:"#1b2b3d","line-soft":"#152435",fg:"#dff2f6","fg-2":"#9fb8c6",dim:"#5d7d92",accent:"#2ae6dc","accent-deep":"#1b8fd6","accent-wash":"#0e2b30",magenta:"#ff3ea5","magenta-wash":"#2a0d1e",ok:"#35d67a",warn:"#ffb020",crit:"#ff4d5e",track:"#132434","on-accent":"#04141a"},light:{bg:"#eef2f6",surface:"#ffffff","surface-2":"#f6f9fb",inset:"#e8eef3",line:"#cbd8e2","line-soft":"#dfe7ee",fg:"#0c1a24","fg-2":"#3a5162",dim:"#5b7484",accent:"#0c847e","accent-deep":"#0f5f8c","accent-wash":"#d9f0ee",magenta:"#b4176e","magenta-wash":"#fbe4f0",ok:"#0f7a44",warn:"#8a5804",crit:"#b52436",track:"#dae3ea","on-accent":"#ffffff"}},{id:"cockpit",name:"Cockpit",dark:{bg:"#0a0704",surface:"#14100a","surface-2":"#1c1710",inset:"#17120b",line:"#35291a","line-soft":"#281f14",fg:"#f5e8d2","fg-2":"#c4ac8a",dim:"#8a7355",accent:"#ffb020","accent-deep":"#d2690c","accent-wash":"#33220a",magenta:"#ff5f3a","magenta-wash":"#331309",ok:"#9ecb3a",warn:"#ffd54a",crit:"#ff4a3d",track:"#241c11","on-accent":"#1a1000"},light:{bg:"#f5f0e6",surface:"#fffdf8","surface-2":"#faf5ea",inset:"#efe7d6",line:"#d9cdb4","line-soft":"#e8dfcc",fg:"#201705","fg-2":"#5b4a2d",dim:"#7d6a48",accent:"#a35c00","accent-deep":"#7c3d05","accent-wash":"#f6e6c8",magenta:"#b53a17","magenta-wash":"#fadfd6",ok:"#4d6b12",warn:"#8a5804",crit:"#b02a20",track:"#e3d8c2","on-accent":"#fffdf8"}},{id:"verdant",name:"Verdant",dark:{bg:"#040b07",surface:"#0a150f","surface-2":"#0f1d16",inset:"#0c1811",line:"#1c3226","line-soft":"#152920",fg:"#ddf5e5","fg-2":"#9cc0ab",dim:"#5d8570",accent:"#7ee787","accent-deep":"#26a269","accent-wash":"#0f2b1c",magenta:"#3ddbd9","magenta-wash":"#0a2a2c",ok:"#7ee787",warn:"#ffc94a",crit:"#ff5f6d",track:"#12281c","on-accent":"#04140a"},light:{bg:"#eef4ef",surface:"#ffffff","surface-2":"#f5faf6",inset:"#e6efe8",line:"#c7d9cc","line-soft":"#dbe8de",fg:"#0a1a10","fg-2":"#385643",dim:"#5a7864",accent:"#1a7f4b","accent-deep":"#115e37","accent-wash":"#d7f0e0",magenta:"#0d7d7b","magenta-wash":"#d4f0ef",ok:"#1a7f4b",warn:"#8a5804",crit:"#b52436",track:"#d9e5db","on-accent":"#ffffff"}},{id:"plasma",name:"Plasma",dark:{bg:"#07050f",surface:"#110d1e","surface-2":"#191330",inset:"#140f26",line:"#2c2350","line-soft":"#211a3e",fg:"#eae4ff","fg-2":"#b3a8d8",dim:"#7568a8",accent:"#a06bff","accent-deep":"#5b3ed6","accent-wash":"#22164a",magenta:"#ff5bc8","magenta-wash":"#2e0f2a",ok:"#4ddba0",warn:"#ffc046",crit:"#ff5470",track:"#1c1638","on-accent":"#0b0618"},light:{bg:"#f1eef8",surface:"#ffffff","surface-2":"#f8f5fd",inset:"#ebe6f6",line:"#d2c8e8","line-soft":"#e2dbf1",fg:"#150c28","fg-2":"#47395f",dim:"#6b5c88",accent:"#6b2fd0","accent-deep":"#4a1aa8","accent-wash":"#e7dbfb",magenta:"#b81f86","magenta-wash":"#fbdcf0",ok:"#0f7a52",warn:"#8a5804",crit:"#b52440",track:"#e0d8f0","on-accent":"#ffffff"}},{id:"ember",name:"Ember",dark:{bg:"#0a0605",surface:"#150e0b","surface-2":"#1e1511",inset:"#191110",line:"#38231b","line-soft":"#2a1a15",fg:"#f7e6dd","fg-2":"#c7a696",dim:"#8d6a5c",accent:"#ff6b3d","accent-deep":"#c22f1e","accent-wash":"#331408",magenta:"#ffc247","magenta-wash":"#2e2209",ok:"#58c98a",warn:"#ffc247",crit:"#ff3b30",track:"#251712","on-accent":"#190802"},light:{bg:"#f6f0ec",surface:"#ffffff","surface-2":"#fbf5f1",inset:"#efe4dd",line:"#ddc9bd","line-soft":"#ebdcd3",fg:"#22110a","fg-2":"#5e4235",dim:"#7f6153",accent:"#c1401b","accent-deep":"#922b12","accent-wash":"#fadfd3",magenta:"#8a6206","magenta-wash":"#f7e9c9",ok:"#0f7a44",warn:"#8a5804",crit:"#b52436",track:"#e6d6cb","on-accent":"#ffffff"}},{id:"glacier",name:"Glacier",dark:{bg:"#060a10",surface:"#0d141d","surface-2":"#131d29",inset:"#101825",line:"#223549","line-soft":"#1a2b3c",fg:"#e4eef8","fg-2":"#a6bccf",dim:"#67839c",accent:"#63b3ff","accent-deep":"#2f6fd0","accent-wash":"#112a45",magenta:"#9fd8e8","magenta-wash":"#10262e",ok:"#4fd1a5",warn:"#ffcb5c",crit:"#ff6b7d",track:"#16232f","on-accent":"#04101d"},light:{bg:"#eef2f7",surface:"#ffffff","surface-2":"#f6f9fc",inset:"#e7edf4",line:"#c8d5e3","line-soft":"#dde5ee",fg:"#0b1622","fg-2":"#3c5064",dim:"#5f7488",accent:"#1462b8","accent-deep":"#0c4383","accent-wash":"#d9e9fb",magenta:"#2a7f96","magenta-wash":"#d6eef4",ok:"#0f7a52",warn:"#8a5804",crit:"#b52440",track:"#dbe4ee","on-accent":"#ffffff"}},{id:"ha",name:"Home Assistant",dark:{bg:"var(--primary-background-color, #05090f)",surface:"var(--card-background-color, #0b131d)","surface-2":"var(--secondary-background-color, #101b28)",inset:"var(--secondary-background-color, #0d1723)",line:"var(--divider-color, #1b2b3d)","line-soft":"var(--divider-color, #152435)",fg:"var(--primary-text-color, #dff2f6)","fg-2":"var(--secondary-text-color, #9fb8c6)",dim:"var(--secondary-text-color, #5d7d92)",accent:"var(--primary-color, #2ae6dc)","accent-deep":"var(--dark-primary-color, #1b8fd6)","accent-wash":"var(--secondary-background-color, #0e2b30)",magenta:"var(--accent-color, #ff3ea5)","magenta-wash":"var(--secondary-background-color, #2a0d1e)",ok:"var(--success-color, #35d67a)",warn:"var(--warning-color, #ffb020)",crit:"var(--error-color, #ff4d5e)",track:"var(--divider-color, #132434)","on-accent":"var(--text-primary-color, #04141a)"}}],es="reactor";function oe(e){return qt.find(t=>t.id===e)??qt[0]}function Ve(e){return!oe(e).light}function oi(e,t,s){const a=oe(t),i=s&&a.light||a.dark,r=a.id===es;for(const[n,l]of Object.entries(i)){const d=`--mk-${n}`;r?e.style.removeProperty(d):e.style.setProperty(d,l)}}const ss=90,as=150,is=5,wt=1200,tt=20,ft={fontScale:100,maxWidth:"full"},z={scheme:es,mode:"auto",startTab:"last",hiddenTabs:[],extraDigits:!1,spreadWarn:bt,spreadCrit:ne},li="marstek-panel.settings",le="marstek-panel.local",ci="marstek_modbus/settings/get",di="marstek_modbus/settings/set";function ce(e){if(!e||typeof e!="object")return{...z};const t=e;return{scheme:typeof t.scheme=="string"&&oe(t.scheme).id===t.scheme?t.scheme:z.scheme,mode:t.mode==="dark"||t.mode==="light"||t.mode==="auto"?t.mode:z.mode,startTab:typeof t.startTab=="string"?t.startTab:z.startTab,hiddenTabs:Array.isArray(t.hiddenTabs)?t.hiddenTabs.filter(s=>typeof s=="string"):[],extraDigits:t.extraDigits===!0,...hi(t.spreadWarn,t.spreadCrit)}}function hi(e,t){const s=(r,n)=>typeof r=="number"&&Number.isFinite(r)?Math.min(Ut,Math.max(Vt,Math.round(r))):n,a=s(e,z.spreadWarn),i=s(t,z.spreadCrit);return i<a?{spreadWarn:a,spreadCrit:a}:{spreadWarn:a,spreadCrit:i}}function pi(e){return JSON.stringify(e,null,2)}function mi(e){let t;try{t=JSON.parse(e)}catch{return null}return!t||typeof t!="object"||Array.isArray(t)?null:ce(t)}function ui(e,t,s,a){const i=Math.round(e/a)*a;return Math.min(s,Math.max(t,i))}function fi(e){if(!e||typeof e!="object")return{...ft};const t=e,s=t.maxWidth;return{fontScale:typeof t.fontScale=="number"&&Number.isFinite(t.fontScale)?ui(t.fontScale,ss,as,is):ft.fontScale,maxWidth:typeof s=="number"&&Number.isFinite(s)&&s>=wt?Math.round(s/tt)*tt:"full"}}function gi(){try{const e=localStorage.getItem(le);return e?fi(JSON.parse(e)):{...ft}}catch{return{...ft}}}function vi(e){try{localStorage.setItem(le,JSON.stringify(e))}catch{}}function bi(){try{localStorage.removeItem(le)}catch{}}async function _i(e){try{const t=await e.callWS({type:ci});if(!t||Object.keys(t).length===0){const s=ki();return s?(await Yt(e,s),s):{...z}}return ce(t)}catch{return null}}async function Yt(e,t){try{await e.callWS({type:di,settings:t})}catch{}}function ki(){try{const e=localStorage.getItem(li);return e?ce(JSON.parse(e)):null}catch{return null}}var yi=Object.defineProperty,$i=Object.getOwnPropertyDescriptor,E=(e,t,s,a)=>{for(var i=a>1?void 0:a?$i(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&yi(t,s,i),i};let $=class extends y{constructor(){super(...arguments),this.tabs=[],this.offline=!1,this.light=!1,this.transferOpen=!1,this.transferText="",this.transferBad=!1}render(){const e=this.t,t=this.settings,s=Ve(t.scheme);return o`
      <div class="grid top">
        <div class="panel">
          <div class="head"><div class="label">${e("settings.scheme")}</div></div>
          <div class="schemes">
            ${qt.map(a=>this.schemeCard(a.id,a.name,this.light&&a.light||a.dark))}
          </div>
          <div class="note">${e("settings.scheme_hint")}</div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${e("settings.appearance")}</div></div>

          <div class="field">
            <span class="label">${e("settings.mode")}</span>
            ${this.choices([["auto",e("settings.mode.auto")],["dark",e("settings.mode.dark")],["light",e("settings.mode.light")]],t.mode,a=>this.onChange({mode:a}),s)}
            ${s?o`<div class="note">${e("settings.mode_ha")}</div>`:h}
          </div>

          <div class="field">
            <span class="label">${e("settings.digits")}</span>
            ${this.choices([[!1,e("settings.digits.normal")],[!0,e("settings.digits.more")]],t.extraDigits,a=>this.onChange({extraDigits:a}))}
          </div>

          <div class="field">
            <span class="label">${e("settings.scale")}</span>
            <div class="slider">
              <input
                type="range"
                min=${ss}
                max=${as}
                step=${is}
                .value=${String(this.local.fontScale)}
                aria-label=${e("settings.scale")}
                @input=${a=>this.onChangeLocal({fontScale:Number(a.target.value)})}
              />
              <span class="readout">${this.local.fontScale} %</span>
            </div>
          </div>

          <div class="field">
            <span class="label">${e("settings.width")}</span>
            <div class="slider">
              <input
                type="range"
                min=${wt}
                max=${this.widthMax()}
                step=${tt}
                .value=${String(this.widthValue())}
                aria-label=${e("settings.width")}
                @input=${a=>this.pickWidth(a)}
              />
              <span class="readout">
                ${this.local.maxWidth==="full"?e("settings.width.full"):`${this.local.maxWidth} px`}
              </span>
            </div>
            <div class="note">${e("settings.screen_hint")}</div>
          </div>
        </div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head"><div class="label">${e("settings.spread")}</div></div>

          <div class="note">${e("settings.spread_hint")}</div>

          <div class="field">
            <span class="label">${e("settings.spread_warn")}</span>
            <div class="slider">
              <input
                type="range"
                min=${Vt}
                max=${Ut}
                step=${Ce}
                .value=${String(t.spreadWarn)}
                aria-label=${e("settings.spread_warn")}
                @input=${a=>this.pickSpread("spreadWarn",Number(a.target.value))}
              />
              <span class="readout">${t.spreadWarn} %</span>
            </div>
          </div>

          <div class="field">
            <span class="label">${e("settings.spread_crit")}</span>
            <div class="slider">
              <input
                type="range"
                min=${Vt}
                max=${Ut}
                step=${Ce}
                .value=${String(t.spreadCrit)}
                aria-label=${e("settings.spread_crit")}
                @input=${a=>this.pickSpread("spreadCrit",Number(a.target.value))}
              />
              <span class="readout">${t.spreadCrit} %</span>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${e("settings.start_tab")}</div></div>
          ${this.choices([["last",e("settings.start_tab.last")],...this.tabs.filter(a=>a.available&&!t.hiddenTabs.includes(a.id)).map(a=>[a.id,a.label])],t.startTab,a=>this.onChange({startTab:a}),!1,!0)}
          <div class="note">${e("settings.start_tab_hint")}</div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${e("settings.tabs")}</div></div>
          ${this.tabs.map(a=>this.tabRow(a))}
          <div class="note">${e("settings.tabs_hint")}</div>
        </div>
      </div>

      <div class="grid below" style="grid-template-columns: 1fr">
        <div class="panel">
          <div class="head"><div class="label">${e("settings.storage")}</div></div>
          <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
            <button class="action" @click=${()=>this.onReset()}>
              ${e("settings.reset")}
            </button>
            <button
              class="action"
              aria-expanded=${this.transferOpen}
              @click=${()=>this.toggleTransfer()}
            >
              ${e("settings.transfer")}
            </button>
            <span class="note" style="margin:0">${e("settings.storage_hint")}</span>
          </div>
          ${this.offline?o`<div class="note crit">${e("settings.offline")}</div>`:h}
          ${this.transferOpen?this.transfer():h}
        </div>
      </div>
    `}transfer(){const e=this.t;return o`
      <div class="transfer">
        <textarea
          class=${this.transferBad?"bad":""}
          aria-label=${e("settings.transfer")}
          .value=${this.transferText}
          @input=${t=>{this.transferText=t.target.value,this.transferBad=!1}}
        ></textarea>
        <div class="row">
          <button class="action" @click=${()=>this.applyTransfer()}>
            ${e("settings.import")}
          </button>
          <button class="action" @click=${()=>this.resetTransfer()}>
            ${e("settings.export_again")}
          </button>
          ${this.transferBad?o`<span class="bad-note">${e("settings.transfer_bad")}</span>`:o`<span class="note" style="margin:0">${e("settings.transfer_hint")}</span>`}
        </div>
      </div>
    `}toggleTransfer(){this.transferOpen=!this.transferOpen,this.transferOpen&&this.resetTransfer()}resetTransfer(){this.transferText=pi(this.settings),this.transferBad=!1}applyTransfer(){const e=mi(this.transferText);if(!e){this.transferBad=!0;return}this.transferBad=!1,this.onChange(e)}schemeCard(e,t,s){const a=this.settings.scheme===e;return o`
      <button
        class="scheme"
        aria-pressed=${a}
        @click=${()=>this.onChange({scheme:e})}
      >
        <div class="preview" style="background:${s.bg}">
          <div class="bar">
            <span class="pill" style="background:${s.accent}"></span>
            <span class="pill" style="background:${s.magenta}"></span>
            <span class="dot" style="background:${s.ok}"></span>
            <span class="dot" style="background:${s.warn}"></span>
            <span class="dot" style="background:${s.crit}"></span>
          </div>
          <div
            class="card"
            style="background:${s.surface};border-color:${s.line}"
          >
            <div class="rule" style="background:${s.fg}"></div>
            <div class="rule short" style="background:${s.dim}"></div>
          </div>
        </div>
        <span class="scheme-name">
          ${t}
          ${Ve(e)?o`<small>${this.t("settings.scheme_theme")}</small>`:h}
        </span>
      </button>
    `}widthMax(){const e=Math.max(wt+tt,window.innerWidth);return Math.ceil(e/tt)*tt}widthValue(){const e=this.widthMax();return this.local.maxWidth==="full"?e:Math.min(e,Math.max(wt,this.local.maxWidth))}pickSpread(e,t){const{spreadWarn:s,spreadCrit:a}=this.settings;e==="spreadWarn"?this.onChange({spreadWarn:t,spreadCrit:Math.max(a,t)}):this.onChange({spreadCrit:t,spreadWarn:Math.min(s,t)})}pickWidth(e){const t=Number(e.target.value);this.onChangeLocal({maxWidth:t>=this.widthMax()?"full":t})}choices(e,t,s,a=!1,i=!1){return o`
      <div class="choices ${i?"packed":""}">
        ${e.map(([r,n])=>o`
            <button
              aria-pressed=${r===t}
              ?disabled=${a}
              @click=${()=>s(r)}
            >
              ${n}
            </button>
          `)}
      </div>
    `}tabRow(e){const t=this.settings.hiddenTabs.includes(e.id),s=e.id==="core",a=`tab-${e.id}`;return o`
      <div class="tab-row ${e.available?"":"gone"}">
        <input
          type="checkbox"
          id=${a}
          .checked=${e.available&&!t}
          ?disabled=${!e.available||s}
          @change=${i=>this.setHidden(e.id,!i.target.checked)}
        />
        <label for=${a}>${e.label}</label>
        ${e.available?s?o`<span class="why">${this.t("settings.always")}</span>`:h:o`<span class="why">${this.t(`settings.unavail.${e.id}`)}</span>`}
      </div>
    `}setHidden(e,t){const s=this.settings.hiddenTabs.filter(a=>a!==e);this.onChange({hiddenTabs:t?[...s,e]:s})}};$.styles=[_,b`
      .grid.top {
        grid-template-columns: 2fr 1fr;
      }
      @media (max-width: 1100px) {
        .grid.top {
          grid-template-columns: 1fr;
        }
      }
      .below {
        margin-top: var(--mk-gap);
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 900px) {
        .below {
          grid-template-columns: 1fr;
        }
      }

      /* ---- scheme picker ---- */
      .schemes {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
        gap: 10px;
      }
      button.scheme {
        display: block;
        width: 100%;
        padding: 0;
        text-align: left;
        border: 1px solid var(--mk-line);
        background: none;
        cursor: pointer;
        font: inherit;
      }
      button.scheme:hover {
        border-color: var(--mk-fg-2);
      }
      button.scheme[aria-pressed="true"] {
        border-color: var(--mk-accent);
        box-shadow: 0 0 0 1px var(--mk-accent);
      }
      button.scheme:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
      /* The preview paints itself in the scheme it offers, so the swatch is
         the scheme rather than a description of it. */
      .preview {
        padding: 11px 12px 12px;
      }
      .preview .bar {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 9px;
      }
      .preview .pill {
        height: 5px;
        flex: 1;
      }
      .preview .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex: none;
      }
      .preview .card {
        border: 1px solid;
        padding: 7px 8px;
      }
      .preview .rule {
        height: 4px;
        margin-bottom: 5px;
      }
      .preview .rule.short {
        width: 55%;
        margin-bottom: 0;
      }
      .scheme-name {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 8px;
        font-family: var(--mk-mono);
        font-size: 11px;
        padding: 7px 10px;
        border-top: 1px solid var(--mk-line);
        color: var(--mk-fg-2);
        background: var(--mk-surface);
      }
      button.scheme[aria-pressed="true"] .scheme-name {
        color: var(--mk-accent);
        background: var(--mk-accent-wash);
      }
      .scheme-name small {
        font-size: 9.5px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--mk-dim);
      }

      /* ---- option rows ---- */
      .field + .field {
        margin-top: 16px;
      }
      .field > .label {
        display: block;
        margin-bottom: 7px;
      }
      .choices {
        display: flex;
        flex-wrap: wrap;
        gap: 1px;
        background: var(--mk-line);
        border: 1px solid var(--mk-line);
      }
      /* Two or three options share the row; a long list packs instead of
         stretching one stray button across the full width. */
      .choices button {
        flex: 1 1 auto;
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.08em;
        padding: 8px 11px;
        color: var(--mk-fg-2);
        background: var(--mk-inset);
        border: 0;
        cursor: pointer;
        white-space: nowrap;
      }
      .choices button:hover {
        color: var(--mk-fg);
      }
      .choices button[aria-pressed="true"] {
        color: var(--mk-on-accent);
        background: var(--mk-accent);
      }
      .choices button:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: -2px;
      }
      /* A long list becomes separate chips. Kept as one strip, the row's own
         background would show through the space the last button does not fill
         and read as an extra, empty option. */
      .choices.packed {
        background: none;
        border: 0;
        gap: 6px;
      }
      .choices.packed button {
        flex: 0 0 auto;
        border: 1px solid var(--mk-line);
      }

      /* ---- sliders ---- */
      .slider {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .slider input {
        flex: 1 1 auto;
        min-width: 0;
        height: 4px;
        margin: 0;
        appearance: none;
        background: var(--mk-track);
        border: 0;
        cursor: pointer;
      }
      .slider input::-webkit-slider-thumb {
        appearance: none;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: var(--mk-accent);
        border: 0;
        cursor: pointer;
      }
      .slider input::-moz-range-thumb {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: var(--mk-accent);
        border: 0;
        cursor: pointer;
      }
      .slider input:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 4px;
      }
      /* The readout sits in a fixed box so the slider does not shift under
         the pointer as the number gains or loses a digit. */
      .slider .readout {
        flex: 0 0 auto;
        min-width: 9ch;
        text-align: right;
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-fg);
      }
      .choices button:disabled {
        opacity: 0.4;
        cursor: default;
      }

      /* ---- tab list ---- */
      .tab-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 0;
        border-bottom: 1px dashed var(--mk-line-soft);
      }
      .tab-row:last-of-type {
        border-bottom: 0;
      }
      .tab-row.gone {
        opacity: 0.45;
      }
      .tab-row label {
        font-family: var(--mk-mono);
        font-size: 11.5px;
        cursor: pointer;
      }
      .tab-row.gone label {
        cursor: default;
      }
      .tab-row .why {
        margin-left: auto;
        font-family: var(--mk-mono);
        font-size: 10px;
        color: var(--mk-dim);
        text-align: right;
      }
      input[type="checkbox"] {
        accent-color: var(--mk-accent);
        width: 15px;
        height: 15px;
        flex: none;
      }
      input[type="checkbox"]:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }

      .transfer {
        margin-top: 14px;
      }
      textarea {
        width: 100%;
        min-height: 150px;
        resize: vertical;
        font-family: var(--mk-mono);
        font-size: 11px;
        line-height: 1.6;
        color: var(--mk-fg);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        padding: 9px 10px;
      }
      textarea:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 1px;
      }
      textarea.bad {
        border-color: var(--mk-crit);
      }
      .transfer .row {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 9px;
      }
      .bad-note {
        font-family: var(--mk-mono);
        font-size: 10.5px;
        color: var(--mk-crit);
      }
      button.action {
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 9px 15px;
        color: var(--mk-fg-2);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        cursor: pointer;
      }
      button.action:hover {
        border-color: var(--mk-warn);
        color: var(--mk-warn);
      }
      button.action:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
    `];E([p({attribute:!1})],$.prototype,"settings",2);E([p({attribute:!1})],$.prototype,"local",2);E([p({attribute:!1})],$.prototype,"tabs",2);E([p({attribute:!1})],$.prototype,"t",2);E([p({attribute:!1})],$.prototype,"onChange",2);E([p({attribute:!1})],$.prototype,"onChangeLocal",2);E([p({attribute:!1})],$.prototype,"onReset",2);E([p({type:Boolean})],$.prototype,"offline",2);E([p({type:Boolean})],$.prototype,"light",2);E([g()],$.prototype,"transferOpen",2);E([g()],$.prototype,"transferText",2);E([g()],$.prototype,"transferBad",2);$=E([k("mk-view-settings")],$);var wi=Object.defineProperty,xi=Object.getOwnPropertyDescriptor,R=(e,t,s,a)=>{for(var i=a>1?void 0:a?xi(t,s):t,r=e.length-1,n;r>=0;r--)(n=e[r])&&(i=(a?n(t,s,i):n(i))||i);return a&&i&&wi(t,s,i),i};const Dt=["core","cells","packs","solar","energy","control","system"],Si={cells:"battery_1_max_cell_voltage",packs:"battery_soc_1",solar:"mppt1_power",control:"set_charge_power"},Ti=["cells","packs"],rs="marstek-panel.device",ns="marstek-panel.tab";let T=class extends y{constructor(){super(...arguments),this.narrow=!1,this.settings={...z},this.local=gi(),this.settingsOffline=!1,this.tab="core",this.showSettings=!1,this.strings=ut,this.deviceId=Ai(),this.updateReady=!1,this.catalogueFor="",this.appearanceFor="",this.layoutFor="",this.sharedRequested=!1,this.formatter=new Pe("en"),this.onBundleLoaded=()=>{this.updateReady=Os()!==mt},this.markTabEdges=()=>{const e=this.renderRoot.querySelector("nav");if(!e)return;e.dataset.bound||(e.dataset.bound="1",e.addEventListener("scroll",this.markTabEdges,{passive:!0}),new ResizeObserver(this.markTabEdges).observe(e));const t=e.scrollLeft>1,s=e.scrollLeft+e.clientWidth<e.scrollWidth-1;e.dataset.edge=t&&s?"both":t?"left":s?"right":"none"},this.t=(e,t)=>Xs(this.strings,e,t)}connectedCallback(){super.connectedCallback(),this.tab=this.startingTab(),window.addEventListener(Lt,this.onBundleLoaded),this.onBundleLoaded()}disconnectedCallback(){window.removeEventListener(Lt,this.onBundleLoaded),super.disconnectedCallback()}updateNote(){return this.updateReady?o`
      <div class="update" role="status">
        <span>${this.t("update.available")}</span>
        <button @click=${()=>location.reload()}>${this.t("update.reload")}</button>
      </div>
    `:h}willUpdate(e){if(this.applyLayout(),!this.hass||(this.loadShared(),!e.has("hass")&&!e.has("settings")))return;this.applyAppearance();const t=this.hass.language||"en",s=this.settings.extraDigits?1:0;(t!==this.catalogueFor||this.formatter.extraDigits!==s)&&(this.formatter=new Pe(t,s)),t!==this.catalogueFor&&(this.catalogueFor=t,Gs(t).then(a=>{this.catalogueFor===t&&(this.strings=a)}))}applyAppearance(){const e=this.settings.mode,t=e==="auto"?!this.hass.themes?.darkMode:e==="light",s=`${this.settings.scheme}/${t}`;s!==this.appearanceFor&&(this.appearanceFor=s,this.toggleAttribute("light",t),oi(this,this.settings.scheme,t))}applyLayout(){const{fontScale:e,maxWidth:t}=this.local,s=`${e}/${t}`;if(s===this.layoutFor)return;this.layoutFor=s;const a=e/100;this.style.setProperty("--mk-zoom",String(a)),this.style.setProperty("--mk-max-width",t==="full"?"none":`${t/a}px`)}loadShared(){this.sharedRequested||(this.sharedRequested=!0,_i(this.hass).then(e=>{if(e===null){this.settingsOffline=!0;return}this.settings=e,this.tab=this.startingTab()}))}startingTab(){const e=this.settings.startTab==="last"?Ei():this.settings.startTab;return Dt.includes(e)?e:"core"}update_(e){this.settings={...this.settings,...e},Yt(this.hass,this.settings)}updateLocal(e){this.local={...this.local,...e},vi(this.local)}resetSettings(){this.settings={...z},Yt(this.hass,this.settings),bi(),this.local={...ft}}openTab(e){this.tab=e,this.showSettings=!1;try{localStorage.setItem(ns,e)}catch{}}updated(){this.markTabEdges()}selectDevice(e){this.deviceId=e;try{localStorage.setItem(rs,e)}catch{}}tabsFor(e){return Dt.filter(t=>this.supports(e,t)&&(t==="core"||!this.settings.hiddenTabs.includes(t)))}supports(e,t){const s=Si[t];return!s||e.entityId(s)!==void 0?!0:Ti.includes(t)&&e.isSinglePack()&&!e.isLegacyE()}tabChoices(e){return Dt.map(t=>({id:t,label:this.t(`tab.${t}`),available:this.supports(e,t)}))}get devices(){return this.hass?Rs(this.hass):[]}get device(){const e=this.devices;return e.length?e.find(t=>t.deviceId===this.deviceId)??e[0]:null}render(){if(!this.hass)return h;const e=this.device;if(!e)return o`
        <div class="shell">
          <div class="empty">
            <h2>${this.t("empty.no_device")}</h2>
            <p>${this.t("empty.no_device_hint")}</p>
          </div>
        </div>
      `;const t=new Bs(this.hass,e),s=this.tabsFor(t),a=s.includes(this.tab)?this.tab:s[0];return o`
      <div class="shell">
        ${this.updateNote()}
        <header>
          <div class="brand">
            ${/^marstek/i.test(e.name)?o`<em>${e.name}</em>`:o`MARSTEK <em>${e.name}</em>`}
          </div>
          <nav role="tablist" aria-label="Marstek Venus">
            ${s.map(i=>o`
                <button
                  class="tab"
                  role="tab"
                  aria-selected=${!this.showSettings&&a===i}
                  @click=${()=>this.openTab(i)}
                  @keydown=${r=>this.onTabKey(r,i,s)}
                >
                  ${this.t(`tab.${i}`)}
                </button>
              `)}
          </nav>
          ${this.statusBar(t)}
        </header>

        <main>
          ${this.showSettings?o`<mk-view-settings
                .settings=${this.settings}
                .local=${this.local}
                .offline=${this.settingsOffline}
                .onChangeLocal=${i=>this.updateLocal(i)}
                .tabs=${this.tabChoices(t)}
                .t=${this.t}
                .onChange=${i=>this.update_(i)}
                .onReset=${()=>this.resetSettings()}
                ?light=${this.hasAttribute("light")}
              ></mk-view-settings>`:this.renderTab(t,a)}
        </main>
      </div>
    `}onTabKey(e,t,s){const a=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0;if(!a)return;e.preventDefault();const i=s[(s.indexOf(t)+a+s.length)%s.length];this.tab=i,this.renderRoot.querySelectorAll("button.tab")[s.indexOf(i)]?.focus()}statusBar(e){const t=this.devices,s=this.device?.deviceId,a=this.link(e),i=a.led==="on"||a.led==="warn";return o`
      <div class="status">
        ${t.length>1?o`
              <select
                aria-label=${this.t("common.device")}
                @change=${r=>this.selectDevice(r.target.value)}
              >
                ${t.map(r=>o`
                    <option value=${r.deviceId} ?selected=${r.deviceId===s}>
                      ${r.name}
                    </option>
                  `)}
              </select>
            `:h}
        <span title=${a.detail||h}>
          <i class="led ${a.led}"></i>
          ${a.label}
        </span>
        ${i&&e.inverterState(this.t)?o`<span>${e.inverterState(this.t)}</span>`:h}
        <button
          class="gear"
          aria-pressed=${this.showSettings}
          title=${this.t("settings.title")}
          aria-label=${this.t("settings.title")}
          @click=${()=>this.showSettings=!this.showSettings}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-.98l2.11-1.63a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.3 7.3 0 0 0-1.69-.98l-.38-2.65a.49.49 0 0 0-.49-.42h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.25-1.17.58-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.63c-.04.32-.07.65-.07.98s.03.65.07.97L2.46 14.6a.5.5 0 0 0-.12.64l2 3.46c.13.23.4.31.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.63Z"
            />
          </svg>
        </button>
      </div>
    `}link(e){const t=e.rawState("modbus_connection");if(!t||t.state==="unavailable"||t.state==="unknown")return{led:e.has("battery_soc")?"on":"off",label:this.t("status.modbus"),detail:""};const s=String(t.attributes.health??(t.state==="on"?"ok":"offline"));if(s==="paused")return{led:"",label:this.t("status.modbus_paused"),detail:this.t("status.modbus_paused_hint")};if(s==="offline"){const a=this.lastRead(t);return{led:"off",label:a?this.t("status.modbus_offline_since",{time:a}):this.t("status.modbus_offline"),detail:this.t("status.modbus_offline_hint")}}return{led:s==="degraded"?"warn":"on",label:this.t("status.modbus"),detail:s==="degraded"?this.t("status.modbus_degraded"):""}}lastRead(e){const t=e.attributes.last_successful_read;if(typeof t!="string")return"";const s=new Date(t);return Number.isNaN(s.getTime())?"":s.toLocaleTimeString(this.hass?.language||"en",{hour:"2-digit",minute:"2-digit"})}floorPercent(e){const t=e.num("stored_energy"),s=e.num("usable_energy"),a=e.numFirst(B);if(t===null||s===null||!a)return null;const i=(t-s)/a*100;return i>=0&&i<=100?i:null}renderTab(e,t){const s={reader:e,fmt:this.formatter,t:this.t};switch(t){case"cells":return o`<mk-view-cells
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
        ></mk-view-cells>`;case"packs":return o`<mk-view-packs
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
          .floor=${this.floorPercent(e)}
          .spreadWarn=${this.settings.spreadWarn}
          .spreadCrit=${this.settings.spreadCrit}
        ></mk-view-packs>`;case"solar":return o`<mk-view-solar
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
        ></mk-view-solar>`;case"energy":return o`<mk-view-energy
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
        ></mk-view-energy>`;case"control":return o`<mk-view-control
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
          .controls=${new Tt(this.hass,e)}
        ></mk-view-control>`;case"system":return o`<mk-view-system
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
          .controls=${new Tt(this.hass,e)}
        ></mk-view-system>`;default:return o`<mk-view-core
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
        ></mk-view-core>`}}};T.styles=[Ns,_,b`
      :host {
        min-height: 100vh;
        background: var(--mk-bg);
      }

      /*
       * Scale and width.
       *
       * The scale is a zoom rather than a font size, so the gaps, tiles and
       * bars grow with the type instead of the text outgrowing its box - the
       * panel has 64 sizes in px across its views and components, and none of
       * them has to know about this.
       *
       * Zoom scales lengths too, which would make a 1440px limit measure 1584
       * real pixels at 110%. The limit arrives already divided by the zoom to
       * cancel that, so the width the user set stays the width they get.
       */
      .shell {
        zoom: var(--mk-zoom, 1);
        max-width: var(--mk-max-width, 1440px);
        margin: 0 auto;
        padding: 0 24px 40px;
      }

      header {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 15px 0 0;
        border-bottom: 1px solid var(--mk-line);
        position: sticky;
        top: 0;
        z-index: 5;
        background: var(--mk-bg);
        flex-wrap: wrap;
      }

      .brand {
        font-size: 16px;
        font-weight: 700;
        letter-spacing: -0.01em;
        padding-bottom: 14px;
      }
      .brand em {
        font-style: normal;
        color: var(--mk-accent);
      }

      /* The strip scrolls inside itself. Left to overflow, it drags the whole
         document sideways on a phone - every card moves when you meant to
         reach the next tab. */
      nav {
        display: flex;
        gap: 1px;
        max-width: 100%;
        overflow-x: auto;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      nav::-webkit-scrollbar {
        display: none;
      }
      /* A soft edge where the strip continues, so it is visible that there are
         more tabs than fit. Driven by the scroll position rather than left on
         permanently: a faded last tab you have already scrolled to reads as a
         rendering fault, not as an invitation. */
      nav[data-edge="right"] {
        mask-image: linear-gradient(to right, #000 calc(100% - 34px), transparent);
      }
      nav[data-edge="left"] {
        mask-image: linear-gradient(to left, #000 calc(100% - 34px), transparent);
      }
      nav[data-edge="both"] {
        mask-image: linear-gradient(
          to right,
          transparent,
          #000 34px calc(100% - 34px),
          transparent
        );
      }
      button.tab {
        flex: none;
        white-space: nowrap;
        font-family: var(--mk-mono);
        font-size: 11.5px;
        letter-spacing: 0.15em;
        padding: 9px 15px 13px;
        color: var(--mk-dim);
        background: none;
        border: 0;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: color 0.15s, background 0.15s;
      }
      button.tab:hover {
        color: var(--mk-fg-2);
        background: var(--mk-surface);
      }
      button.tab[aria-selected="true"] {
        color: var(--mk-accent);
        border-bottom-color: var(--mk-accent);
        background: var(--mk-accent-wash);
      }
      button.tab:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: -2px;
      }

      .status {
        margin-left: auto;
        display: flex;
        gap: 18px;
        align-items: center;
        padding-bottom: 14px;
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-dim);
        white-space: nowrap;
      }
      .led {
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        margin-right: 6px;
        vertical-align: 1px;
        background: var(--mk-dim);
      }
      .led.on {
        background: var(--mk-ok);
      }
      .led.off {
        background: var(--mk-crit);
      }
      .led.warn {
        background: var(--mk-warn);
      }

      select {
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-fg);
        background: var(--mk-surface);
        border: 1px solid var(--mk-line);
        padding: 4px 6px;
      }

      button.gear {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        color: var(--mk-dim);
        background: none;
        border: 1px solid transparent;
        cursor: pointer;
      }
      button.gear:hover {
        color: var(--mk-fg-2);
        border-color: var(--mk-line);
      }
      button.gear[aria-pressed="true"] {
        color: var(--mk-accent);
        border-color: var(--mk-accent);
        background: var(--mk-accent-wash);
      }
      button.gear:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
      button.gear svg {
        width: 17px;
        height: 17px;
        fill: currentColor;
      }

      main {
        padding-top: 20px;
      }

      /* A phone has neither the room to give away nor the pixels to zoom. */
      @media (max-width: 700px) {
        .shell {
          zoom: 1;
          max-width: none;
          padding: 0 12px 32px;
        }
        header {
          gap: 10px;
        }
        .status {
          margin-left: 0;
          flex-wrap: wrap;
          gap: 12px;
          white-space: normal;
        }
        button.tab {
          padding: 9px 11px 12px;
          letter-spacing: 0.1em;
        }
      }

      .update {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 12px;
        padding: 9px 13px;
        border: 1px solid var(--mk-accent);
        background: var(--mk-accent-wash);
        font-family: var(--mk-mono);
        font-size: 11.5px;
        color: var(--mk-fg);
      }
      .update button {
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 6px 12px;
        color: var(--mk-accent);
        background: var(--mk-inset);
        border: 1px solid var(--mk-accent);
        cursor: pointer;
      }
      .update button:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }

      .empty {
        margin-top: 80px;
        text-align: center;
        color: var(--mk-fg-2);
      }
      .empty h2 {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 8px;
        color: var(--mk-fg);
      }
      .empty p {
        margin: 0 auto;
        max-width: 46ch;
        font-size: 14px;
      }

      .todo {
        margin-top: 40px;
        text-align: center;
        font-family: var(--mk-mono);
        font-size: 12px;
        color: var(--mk-dim);
        letter-spacing: 0.1em;
      }
    `];R([p({attribute:!1})],T.prototype,"hass",2);R([p({type:Boolean})],T.prototype,"narrow",2);R([g()],T.prototype,"settings",2);R([g()],T.prototype,"local",2);R([g()],T.prototype,"settingsOffline",2);R([g()],T.prototype,"tab",2);R([g()],T.prototype,"showSettings",2);R([g()],T.prototype,"strings",2);R([g()],T.prototype,"deviceId",2);R([g()],T.prototype,"updateReady",2);T=R([k("marstek-modbus-panel")],T);function Ei(){try{return localStorage.getItem(ns)}catch{return null}}function Ai(){try{return localStorage.getItem(rs)}catch{return null}}
