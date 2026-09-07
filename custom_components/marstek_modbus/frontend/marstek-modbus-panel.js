/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lt=globalThis,At=lt.ShadowRoot&&(lt.ShadyCSS===void 0||lt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pt=Symbol(),zt=new WeakMap;let se=class{constructor(t,s,a){if(this._$cssResult$=!0,a!==Pt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o;const s=this.t;if(At&&t===void 0){const a=s!==void 0&&s.length===1;a&&(t=zt.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),a&&zt.set(s,t))}return t}toString(){return this.cssText}};const ge=e=>new se(typeof e=="string"?e:e+"",void 0,Pt),g=(e,...t)=>{const s=e.length===1?e[0]:t.reduce((a,n,i)=>a+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[i+1],e[0]);return new se(s,e,Pt)},ve=(e,t)=>{if(At)e.adoptedStyleSheets=t.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(const s of t){const a=document.createElement("style"),n=lt.litNonce;n!==void 0&&a.setAttribute("nonce",n),a.textContent=s.cssText,e.appendChild(a)}},It=At?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let s="";for(const a of t.cssRules)s+=a.cssText;return ge(s)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:be,defineProperty:$e,getOwnPropertyDescriptor:ke,getOwnPropertyNames:_e,getOwnPropertySymbols:ye,getPrototypeOf:xe}=Object,ht=globalThis,jt=ht.trustedTypes,we=jt?jt.emptyScript:"",Se=ht.reactiveElementPolyfillSupport,X=(e,t)=>e,ct={toAttribute(e,t){switch(t){case Boolean:e=e?we:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=e!==null;break;case Number:s=e===null?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch{s=null}}return s}},Ct=(e,t)=>!be(e,t),Ut={attribute:!0,type:String,converter:ct,reflect:!1,useDefault:!1,hasChanged:Ct};Symbol.metadata??=Symbol("metadata"),ht.litPropertyMetadata??=new WeakMap;let K=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=Ut){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){const a=Symbol(),n=this.getPropertyDescriptor(t,a,s);n!==void 0&&$e(this.prototype,t,n)}}static getPropertyDescriptor(t,s,a){const{get:n,set:i}=ke(this.prototype,t)??{get(){return this[s]},set(r){this[s]=r}};return{get:n,set(r){const o=n?.call(this);i?.call(this,r),this.requestUpdate(t,o,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ut}static _$Ei(){if(this.hasOwnProperty(X("elementProperties")))return;const t=xe(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(X("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(X("properties"))){const s=this.properties,a=[..._e(s),...ye(s)];for(const n of a)this.createProperty(n,s[n])}const t=this[Symbol.metadata];if(t!==null){const s=litPropertyMetadata.get(t);if(s!==void 0)for(const[a,n]of s)this.elementProperties.set(a,n)}this._$Eh=new Map;for(const[s,a]of this.elementProperties){const n=this._$Eu(s,a);n!==void 0&&this._$Eh.set(n,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const s=[];if(Array.isArray(t)){const a=new Set(t.flat(1/0).reverse());for(const n of a)s.unshift(It(n))}else t!==void 0&&s.push(It(t));return s}static _$Eu(t,s){const a=s.attribute;return a===!1?void 0:typeof a=="string"?a:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const a of s.keys())this.hasOwnProperty(a)&&(t.set(a,this[a]),delete this[a]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ve(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,s,a){this._$AK(t,a)}_$ET(t,s){const a=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,a);if(n!==void 0&&a.reflect===!0){const i=(a.converter?.toAttribute!==void 0?a.converter:ct).toAttribute(s,a.type);this._$Em=t,i==null?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(t,s){const a=this.constructor,n=a._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const i=a.getPropertyOptions(n),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:ct;this._$Em=n;const o=r.fromAttribute(s,i.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(t,s,a,n=!1,i){if(t!==void 0){const r=this.constructor;if(n===!1&&(i=this[t]),a??=r.getPropertyOptions(t),!((a.hasChanged??Ct)(i,s)||a.useDefault&&a.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,a))))return;this.C(t,s,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,s,{useDefault:a,reflect:n,wrapped:i},r){a&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||a||(s=void 0),this._$AL.set(t,s)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[n,i]of this._$Ep)this[n]=i;this._$Ep=void 0}const a=this.constructor.elementProperties;if(a.size>0)for(const[n,i]of a){const{wrapped:r}=i,o=this[n];r!==!0||this._$AL.has(n)||o===void 0||this.C(n,void 0,i,o)}}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(s)):this._$EM()}catch(a){throw t=!1,this._$EM(),a}t&&this._$AE(s)}willUpdate(t){}_$AE(t){this._$EO?.forEach(s=>s.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(s=>this._$ET(s,this[s])),this._$EM()}updated(t){}firstUpdated(t){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[X("elementProperties")]=new Map,K[X("finalized")]=new Map,Se?.({ReactiveElement:K}),(ht.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Et=globalThis,Lt=e=>e,dt=Et.trustedTypes,Ht=dt?dt.createPolicy("lit-html",{createHTML:e=>e}):void 0,ae="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,ne="?"+N,Ae=`<${ne}>`,B=document,tt=()=>B.createComment(""),et=e=>e===null||typeof e!="object"&&typeof e!="function",Ot=Array.isArray,Pe=e=>Ot(e)||typeof e?.[Symbol.iterator]=="function",gt=`[ 	
\f\r]`,Z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Bt=/-->/g,Ft=/>/g,U=RegExp(`>|${gt}(?:([^\\s"'>=/]+)(${gt}*=${gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Vt=/'/g,Wt=/"/g,ie=/^(?:script|style|textarea|title)$/i,re=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),l=re(1),Kt=re(2),q=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),qt=new WeakMap,L=B.createTreeWalker(B,129);function oe(e,t){if(!Ot(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ht!==void 0?Ht.createHTML(t):t}const Ce=(e,t)=>{const s=e.length-1,a=[];let n,i=t===2?"<svg>":t===3?"<math>":"",r=Z;for(let o=0;o<s;o++){const c=e[o];let d,m,u=-1,f=0;for(;f<c.length&&(r.lastIndex=f,m=r.exec(c),m!==null);)f=r.lastIndex,r===Z?m[1]==="!--"?r=Bt:m[1]!==void 0?r=Ft:m[2]!==void 0?(ie.test(m[2])&&(n=RegExp("</"+m[2],"g")),r=U):m[3]!==void 0&&(r=U):r===U?m[0]===">"?(r=n??Z,u=-1):m[1]===void 0?u=-2:(u=r.lastIndex-m[2].length,d=m[1],r=m[3]===void 0?U:m[3]==='"'?Wt:Vt):r===Wt||r===Vt?r=U:r===Bt||r===Ft?r=Z:(r=U,n=void 0);const $=r===U&&e[o+1].startsWith("/>")?" ":"";i+=r===Z?c+Ae:u>=0?(a.push(d),c.slice(0,u)+ae+c.slice(u)+N+$):c+N+(u===-2?o:$)}return[oe(e,i+(e[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),a]};class st{constructor({strings:t,_$litType$:s},a){let n;this.parts=[];let i=0,r=0;const o=t.length-1,c=this.parts,[d,m]=Ce(t,s);if(this.el=st.createElement(d,a),L.currentNode=this.el.content,s===2||s===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=L.nextNode())!==null&&c.length<o;){if(n.nodeType===1){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(ae)){const f=m[r++],$=n.getAttribute(u).split(N),W=/([.?@])?(.*)/.exec(f);c.push({type:1,index:i,name:W[2],strings:$,ctor:W[1]==="."?Oe:W[1]==="?"?Te:W[1]==="@"?Me:mt}),n.removeAttribute(u)}else u.startsWith(N)&&(c.push({type:6,index:i}),n.removeAttribute(u));if(ie.test(n.tagName)){const u=n.textContent.split(N),f=u.length-1;if(f>0){n.textContent=dt?dt.emptyScript:"";for(let $=0;$<f;$++)n.append(u[$],tt()),L.nextNode(),c.push({type:2,index:++i});n.append(u[f],tt())}}}else if(n.nodeType===8)if(n.data===ne)c.push({type:2,index:i});else{let u=-1;for(;(u=n.data.indexOf(N,u+1))!==-1;)c.push({type:7,index:i}),u+=N.length-1}i++}}static createElement(t,s){const a=B.createElement("template");return a.innerHTML=t,a}}function G(e,t,s=e,a){if(t===q)return t;let n=a!==void 0?s._$Co?.[a]:s._$Cl;const i=et(t)?void 0:t._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(e),n._$AT(e,s,a)),a!==void 0?(s._$Co??=[])[a]=n:s._$Cl=n),n!==void 0&&(t=G(e,n._$AS(e,t.values),n,a)),t}class Ee{constructor(t,s){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:s},parts:a}=this._$AD,n=(t?.creationScope??B).importNode(s,!0);L.currentNode=n;let i=L.nextNode(),r=0,o=0,c=a[0];for(;c!==void 0;){if(r===c.index){let d;c.type===2?d=new nt(i,i.nextSibling,this,t):c.type===1?d=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(d=new De(i,this,t)),this._$AV.push(d),c=a[++o]}r!==c?.index&&(i=L.nextNode(),r++)}return L.currentNode=B,n}p(t){let s=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(t,a,s),s+=a.strings.length-2):a._$AI(t[s])),s++}}class nt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,s,a,n){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=a,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&t?.nodeType===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=G(this,t,s),et(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pe(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&et(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){const{values:s,_$litType$:a}=t,n=typeof a=="number"?this._$AC(t):(a.el===void 0&&(a.el=st.createElement(oe(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===n)this._$AH.p(s);else{const i=new Ee(n,this),r=i.u(this.options);i.p(s),this.T(r),this._$AH=i}}_$AC(t){let s=qt.get(t.strings);return s===void 0&&qt.set(t.strings,s=new st(t)),s}k(t){Ot(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let a,n=0;for(const i of t)n===s.length?s.push(a=new nt(this.O(tt()),this.O(tt()),this,this.options)):a=s[n],a._$AI(i),n++;n<s.length&&(this._$AR(a&&a._$AB.nextSibling,n),s.length=n)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const a=Lt(t).nextSibling;Lt(t).remove(),t=a}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class mt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,s,a,n,i){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=s,this._$AM=n,this.options=i,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=p}_$AI(t,s=this,a,n){const i=this.strings;let r=!1;if(i===void 0)t=G(this,t,s,0),r=!et(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const o=t;let c,d;for(t=i[0],c=0;c<i.length-1;c++)d=G(this,o[a+c],s,c),d===q&&(d=this._$AH[c]),r||=!et(d)||d!==this._$AH[c],d===p?t=p:t!==p&&(t+=(d??"")+i[c+1]),this._$AH[c]=d}r&&!n&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Oe extends mt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}}class Te extends mt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}}class Me extends mt{constructor(t,s,a,n,i){super(t,s,a,n,i),this.type=5}_$AI(t,s=this){if((t=G(this,t,s,0)??p)===q)return;const a=this._$AH,n=t===p&&a!==p||t.capture!==a.capture||t.once!==a.once||t.passive!==a.passive,i=t!==p&&(a===p||n);n&&this.element.removeEventListener(this.name,this,a),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class De{constructor(t,s,a){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const Ne=Et.litHtmlPolyfillSupport;Ne?.(st,nt),(Et.litHtmlVersions??=[]).push("3.3.3");const Re=(e,t,s)=>{const a=s?.renderBefore??t;let n=a._$litPart$;if(n===void 0){const i=s?.renderBefore??null;a._$litPart$=n=new nt(t.insertBefore(tt(),i),i,void 0,s??{})}return n._$AI(e),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis;class k extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Re(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}k._$litElement$=!0,k.finalized=!0,Tt.litElementHydrateSupport?.({LitElement:k});const ze=Tt.litElementPolyfillSupport;ze?.({LitElement:k});(Tt.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const b=e=>(t,s)=>{s!==void 0?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ie={attribute:!0,type:String,converter:ct,reflect:!1,hasChanged:Ct},je=(e=Ie,t,s)=>{const{kind:a,metadata:n}=s;let i=globalThis.litPropertyMetadata.get(n);if(i===void 0&&globalThis.litPropertyMetadata.set(n,i=new Map),a==="setter"&&((e=Object.create(e)).wrapped=!0),i.set(s.name,e),a==="accessor"){const{name:r}=s;return{set(o){const c=t.get.call(this);t.set.call(this,o),this.requestUpdate(r,c,e,!0,o)},init(o){return o!==void 0&&this.C(r,void 0,e,o),o}}}if(a==="setter"){const{name:r}=s;return function(o){const c=this[r];t.call(this,o),this.requestUpdate(r,c,e,!0,o)}}throw Error("Unsupported decorator location: "+a)};function h(e){return(t,s)=>typeof s=="object"?je(e,t,s):((a,n,i)=>{const r=n.hasOwnProperty(i);return n.constructor.createProperty(i,a),r?Object.getOwnPropertyDescriptor(n,i):void 0})(e,t,s)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function y(e){return h({...e,state:!0,attribute:!1})}const Ue=g`
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
`,v=g`
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
`,Le="marstek_modbus";function He(e){const t=new Map;for(const s of Object.values(e.entities)){if(s.platform!==Le||!s.device_id||!s.translation_key)continue;let a=t.get(s.device_id);if(!a){const n=e.devices[s.device_id];a={deviceId:s.device_id,name:n?.name_by_user||n?.name||"Marstek Venus",byKey:{}},t.set(s.device_id,a)}a.byKey[s.translation_key]=s.entity_id}return[...t.values()].sort((s,a)=>s.name.localeCompare(a.name))}class Be{constructor(t,s){this.hass=t,this.device=s}get name(){return this.device.name}entityId(t){return this.device.byKey[t]}has(t){return this.state(t)!==null}state(t){const s=this.device.byKey[t];if(!s)return null;const a=this.hass.states[s];return!a||a.state==="unavailable"||a.state==="unknown"?null:a}num(t){const s=this.state(t);if(!s)return null;const a=Number(s.state);return Number.isFinite(a)?a:null}str(t){return this.state(t)?.state??null}unit(t){return this.state(t)?.attributes.unit_of_measurement??""}rawState(t){const s=this.device.byKey[t];return s&&this.hass.states[s]||null}attr(t,s,a){return this.rawState(t)?.attributes[s]??a}writable(t){const s=this.rawState(t);return!!s&&s.state!=="unavailable"}label(t){const s=this.hass.states[this.device.byKey[t]??""]?.attributes.friendly_name;if(!s)return t;const a=this.device.name;return a&&s.startsWith(a)&&s.length>a.length+1?s.slice(a.length).trim():s}sum(t){let s=0,a=!1;for(const n of t){const i=this.num(n);i!==null&&(s+=i,a=!0)}return a?s:null}packCount(){let t=0;for(;this.device.byKey[`battery_${t+1}_max_cell_voltage`];)t++;return t}}class Fe{constructor(t,s){this.hass=t,this.reader=s}call(t,s,a,n){const i=this.reader.entityId(a);i&&this.hass.callService(t,s,{entity_id:i,...n})}setNumber(t,s){this.call("number","set_value",t,{value:s})}selectOption(t,s){this.call("select","select_option",t,{option:s})}setSwitch(t,s){this.call("switch",s?"turn_on":"turn_off",t,{})}press(t){this.call("button","press",t,{})}}const Ve="modulepreload",We=function(e){return"/"+e},Gt={},Ke=function(t,s,a){let n=Promise.resolve();if(s&&s.length>0){let r=function(d){return Promise.all(d.map(m=>Promise.resolve(m).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=o?.nonce||o?.getAttribute("nonce");n=r(s.map(d=>{if(d=We(d),d in Gt)return;Gt[d]=!0;const m=d.endsWith(".css"),u=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${u}`))return;const f=document.createElement("link");if(f.rel=m?"stylesheet":Ve,m||(f.as="script"),f.crossOrigin="",f.href=d,c&&f.setAttribute("nonce",c),document.head.appendChild(f),m)return new Promise(($,W)=>{f.addEventListener("load",$),f.addEventListener("error",()=>W(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(r){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=r,window.dispatchEvent(o),!o.defaultPrevented)throw r}return n.then(r=>{for(const o of r||[])o.status==="rejected"&&i(o.reason);return t().catch(i)})},at={"tab.core":"OVERVIEW","tab.cells":"CELLS","tab.packs":"PACKS","tab.solar":"SOLAR","tab.energy":"ENERGY","tab.system":"SYSTEM","tab.control":"CONTROL","control.power":"Power now","control.power_hint":"These two set the working point directly. Anything that regulates the battery from outside — a zero-feed-in automation, an energy manager — writes the same registers and will win within seconds.","control.limits":"Limits","control.mode":"Mode","control.backup_hint":"Keeps a reserve for the off-grid output.","control.rs485_hint":"Switching this off hands control back to the device, and this page stops having any effect.","control.overwritten":"Something else changed {names} right after this panel did. An external controller is writing the same registers.","control.schedules":"Schedules","control.schedules_axis":"times are the device's own, in its local time","control.schedules_hint":"A schedule needs a window, a power and a day before switching it on does anything. Power is signed: the sign decides the direction. The device takes one day per schedule, not a set of them.","control.no_schedules":"This battery exposes no schedules.","control.window":"Window","control.sched_power":"Power","control.days":"Day","control.active":"On","control.unset":"not set","control.device":"Device","control.reset":"Restart device","control.reset_confirm":"Really restart","control.cancel":"Cancel","control.reset_hint":"Reconnects after a few seconds. A factory reset is deliberately not offered here — it is in the entity list.","control.opt.manual":"Manual","control.opt.anti_feed":"Anti-feed","control.opt.trade_mode":"Trade","control.opt.standby":"Standby","control.opt.charge":"Charge","control.opt.discharge":"Discharge","control.day.monday":"Mon","control.day.tuesday":"Tue","control.day.wednesday":"Wed","control.day.thursday":"Thu","control.day.friday":"Fri","control.day.saturday":"Sat","control.day.sunday":"Sun","status.modbus":"MODBUS","status.wifi":"WIFI","common.pack":"PACK","common.device":"Device","core.electrical":"Electrical · now","core.reserve":"Reserve · lifetime","core.stored":"Stored","core.capacity":"Capacity","core.stored_of_total":"Stored / total","core.usable":"Usable","core.to_full":"Room to full","core.runtime":"Runtime","core.to_empty":"Until empty","core.until_full":"Until full","core.packs":"Packs","core.soc_bms":"SOC · BMS","core.soc_usable":"usable {value} %","core.discharging_to_house":"discharging","core.charging_from_grid":"charging","core.at_rest":"at rest","core.today_charged":"Charged today","core.today_discharged":"Discharged today","core.cell_delta":"Largest cell delta","core.internal_temp":"Internal temperature","core.mppt_total":"MPPT total","core.in_pack":"in pack {pack}","core.no_delta":"no per-pack readings","cells.highest":"Highest cell","cells.lowest":"Lowest cell","cells.in_pack":"pack {pack}","cells.stack_spread":"Spread across stack","cells.stack_hint":"packs charge in turn, so a spread is expected","cells.mean_delta":"Mean delta in pack","cells.worst_pack":"widest: pack {pack}, {value} mV","cells.temp_span":"Cell temperature span","cells.packs_online":"Packs reporting","cells.cells_total":"{count} cells","cells.matrix_title":"Cell voltage range per pack · shared axis","cells.matrix_axis":"bar = lowest to highest cell","cells.matrix_legend":"The tick inside each bar is the pack's midpoint. A narrow bar is a balanced pack, a wide one is drift inside it, and a bar sitting apart from the others is a pack at a different level than the rest.","cells.no_ranges":"This battery reports no per-pack cell voltages.","cells.protection":"Protection and faults","cells.protection_all":"Protection · all {count} packs","cells.clear":"clear","cells.raised":"raised","cells.bms":"BMS","cells.bms_version":"BMS version","cells.uniform":"same on every pack","packs.device_reading":"as the device reports it","packs.mean_soc":"Mean of the packs","packs.from_n_packs":"from {count} packs","packs.spread":"Spread","packs.stored_total":"Stored energy","packs.summed":"packs add up to {value} kWh","packs.per_pack":"Per pack","packs.nominal":"nominal, capacity ÷ packs","packs.cycles_sum":"Cycles, all packs","packs.cycles_partial":"{have} of {total} packs report","packs.fill_title":"State of charge per pack","packs.fill_axis":"column height = SOC · figure inside = kWh","packs.fill_legend":"The dashed line marks the discharge floor at {floor} %. Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.","packs.fill_legend_backup":"The dotted line at {backup} % is as far as the backup socket discharges during an outage.","packs.fill_legend_nofloor":"Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.","packs.none":"This battery reports no per-pack state of charge.","packs.table_title":"Every pack in detail","packs.table_legend":"Highlighted rows sit {points} points or further from the median pack. A pack that reports a high SOC at a low cell voltage is worth a second look: the two readings disagree.","packs.col_soc":"SOC","packs.col_energy":"kWh","packs.col_min":"Cell min","packs.col_max":"Cell max","packs.col_delta":"Delta","packs.col_voltage":"Voltage","packs.col_current":"Current","packs.col_cycles":"Cycles","packs.col_mos":"MOSFET","packs.col_env":"Ambient","packs.col_ntc":"NTC 1–4","solar.active":"ACTIVE","solar.floating":"FLOATING","solar.summary":"All inputs","solar.some_active":"carrying power","solar.all_idle":"nothing connected","solar.note_active":"Voltage follows the panels and power follows the sun through the day.","solar.note_floating":"All inputs sit at a low voltage without current, which is what an unused MPPT input looks like. Connect panels and the voltage rises to module level.","solar.diagnostics":"Diagnostics","solar.channels_reporting":"Inputs reporting","solar.none":"This battery has no MPPT inputs.","energy.today":"Today","energy.month":"This month","energy.lifetime":"Since commissioning","energy.charged":"charged kWh","energy.discharged":"discharged kWh","energy.loss":"Loss","energy.returned":"Returned","energy.rte":"Round trip","energy.rte_hint":"Round-trip efficiency is how much of the energy put into the battery comes back out of it. Conversion efficiency is the loss in the moment, at the current operating point.","energy.efficiency":"Efficiency compared","energy.throughput":"Throughput and wear","energy.gap_hint":"The monthly figure sits {value} points below the lifetime one. That gap is not conversion loss but standby draw between cycles: the shallower the cycling, the heavier it weighs.","system.no_faults":"No fault register is raised.","system.faults_raised":"Raised: {list}","system.device":"Device","system.packs":"Battery packs","system.firmware":"Firmware","system.connection":"Connection","system.faults":"Fault registers","system.control":"Control and limits","system.thermal":"Thermal and electrical","system.ceiling_used":"The panel treats {value} % as the charge ceiling, read from this register.","system.ceiling_ignored":"This register reads {value} %, outside its own 10-100 range, so the device is not using it. The panel charges towards 100 % instead.","settings.title":"Settings","settings.scheme":"Colour scheme","settings.scheme_hint":"Each scheme brings its own light and dark version. The swatch is painted in the scheme it offers.","settings.scheme_theme":"follows your theme","settings.appearance":"Appearance","settings.mode":"Light or dark","settings.mode.auto":"Home Assistant","settings.mode.dark":"Dark","settings.mode.light":"Light","settings.mode_ha":"This scheme takes its colours from your Home Assistant theme, which already decides light or dark.","settings.digits":"Decimal places","settings.digits.normal":"Normal","settings.digits.more":"One more","settings.start_tab":"Tab when opening","settings.start_tab.last":"Last used","settings.start_tab_hint":"A fixed tab that the battery cannot fill falls back to the overview.","settings.tabs":"Tabs","settings.tabs_hint":"Greyed out means this battery does not report what the tab shows, so hiding it is not a choice you have to make.","settings.always":"always shown","settings.unavail.cells":"no per-cell voltages","settings.unavail.packs":"no state of charge per pack","settings.unavail.solar":"no PV inputs","settings.unavail.control":"no writable registers","settings.storage":"Stored settings","settings.reset":"Reset to defaults","settings.transfer":"Import / export","settings.transfer_hint":"Copy this out, paste it into another browser.","settings.transfer_bad":"That is not a settings object.","settings.import":"Apply pasted","settings.export_again":"Show current","settings.storage_hint":"These settings live in this browser only. Another browser, or another device, keeps its own.","empty.no_device":"No Marstek battery found","empty.no_device_hint":"This panel reads the Marstek Modbus Suite integration. Add a battery there first.","common.unavailable":"—"},le={de:()=>Ke(()=>import("./marstek-modbus-lang-de.js"),[]).then(e=>e.de)};["en",...Object.keys(le)].sort();const rt={en:at};function qe(e){return e.split("-")[0].toLowerCase()}async function Ge(e){const t=qe(e);if(rt[t])return rt[t];const s=le[t];if(!s)return at;try{return rt[t]=await s(),rt[t]}catch{return at}}function Ye(e,t,s){let a=e[t]??at[t]??t;if(s)for(const[n,i]of Object.entries(s))a=a.replace(`{${n}}`,String(i));return a}const ot="—";class Yt{constructor(t,s=0){this.language=t,this.extra=s,this.cache=new Map}get extraDigits(){return this.extra}formatter(t){const s=String(t);let a=this.cache.get(s);return a||(a=new Intl.NumberFormat(this.language||"en",{minimumFractionDigits:t,maximumFractionDigits:t}),this.cache.set(s,a)),a}num(t,s=0){return t==null||!Number.isFinite(t)?ot:this.formatter(s+this.extra).format(t)}signed(t,s=0){if(t==null||!Number.isFinite(t))return ot;const a=this.formatter(s+this.extra).format(Math.abs(t));return t>0?`+${a}`:t<0?`−${a}`:a}version(t){return t==null||t===""?ot:/^\d{4}$/.test(t)?`${t.slice(0,3)}.${t.slice(3)}`:t}millivolts(t){return t==null||!Number.isFinite(t)?ot:this.formatter(0).format(Math.round(t*1e3))}}var Je=Object.defineProperty,Mt=(e,t,s,a)=>{for(var n=void 0,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=r(t,s,n)||n);return n&&Je(t,s,n),n};const Rt=class Rt extends k{kv(t,s=1,a={}){const n=this.reader;if(!n.entityId(t))return p;const i=n.state(t);if(!i)return p;if(a.version)return l`
        <div class="kv">
          <span>${a.label??n.label(t)}</span>
          <b class=${a.tone??""}>${this.fmt.version(i.state)}</b>
        </div>
      `;const r=a.raw?null:n.num(t),o=n.unit(t),c=r===null?i.state:`${this.fmt.num(r,s)}${o?` ${o}`:""}`;return l`
      <div class="kv">
        <span>${a.label??n.label(t)}</span>
        <b class=${a.tone??""}>${c}</b>
      </div>
    `}row(t,s,a=""){return l`
      <div class="kv">
        <span>${t}</span>
        <b class=${a}>${s}</b>
      </div>
    `}get packs(){return Array.from({length:this.reader.packCount()},(t,s)=>s+1)}};Rt.styles=[v];let x=Rt;Mt([h({attribute:!1})],x.prototype,"reader");Mt([h({attribute:!1})],x.prototype,"fmt");Mt([h({attribute:!1})],x.prototype,"t");var Ze=Object.defineProperty,Qe=Object.getOwnPropertyDescriptor,it=(e,t,s,a)=>{for(var n=a>1?void 0:a?Qe(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=(a?r(t,s,n):r(n))||n);return a&&n&&Ze(t,s,n),n};const bt=118,$t=97,Xe=2*Math.PI*bt,ts=2*Math.PI*$t;let F=class extends k{constructor(){super(...arguments),this.soc=null,this.usable=null,this.caption="",this.sub=""}arc(e,t){const s=e===null?0:Math.min(Math.max(e,0),100);return`${t*s/100} ${t}`}render(){const e=this.soc===null?"—":Math.round(this.soc).toString();return l`
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

        <circle class="track" cx="150" cy="134" r=${bt} stroke-width="15" />
        <circle
          class="arc-outer"
          cx="150"
          cy="134"
          r=${bt}
          stroke-width="15"
          stroke-dasharray=${this.arc(this.soc,Xe)}
          transform="rotate(-90 150 134)"
        />

        ${this.usable===null?p:Kt`
              <circle class="track" cx="150" cy="134" r=${$t} stroke-width="5" />
              <circle
                class="arc-inner"
                cx="150" cy="134" r=${$t} stroke-width="5"
                stroke-dasharray=${this.arc(this.usable,ts)}
                transform="rotate(-90 150 134)"
              />
            `}

        <text class="num" x="146" y="132" text-anchor="middle">${e}</text>
        <text class="pct" x="196" y="132" text-anchor="start">%</text>
        <text class="cap" x="150" y="158" text-anchor="middle">${this.caption}</text>
        ${this.sub?Kt`<text class="sub" x="150" y="186" text-anchor="middle">${this.sub}</text>`:p}
      </svg>
    `}};F.styles=[v,g`
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
    `];it([h({type:Number})],F.prototype,"soc",2);it([h({type:Number})],F.prototype,"usable",2);it([h({type:String})],F.prototype,"caption",2);it([h({type:String})],F.prototype,"sub",2);F=it([b("mk-gauge")],F);var es=Object.defineProperty,ss=Object.getOwnPropertyDescriptor,R=(e,t,s,a)=>{for(var n=a>1?void 0:a?ss(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=(a?r(t,s,n):r(n))||n);return a&&n&&es(t,s,n),n};let P=class extends k{constructor(){super(...arguments),this.label="",this.value="—",this.unit="",this.foot="",this.tone="",this.bar=null,this.max=null}get fill(){return this.bar===null||this.max===null||this.max===0?null:Math.min(Math.max(this.bar/this.max*100,0),100)}render(){const e=this.fill;return l`
      <div class="label">${this.label}</div>
      <div class="num ${this.tone}">
        ${this.value}${this.unit?l`<span class="unit">${this.unit}</span>`:p}
      </div>
      ${e===null?p:l`<div class="track"><i style="width:${e}%"></i></div>`}
      ${this.foot?l`<div class="foot">${this.foot}</div>`:p}
    `}};P.styles=[v,g`
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
    `];R([h({type:String})],P.prototype,"label",2);R([h({type:String})],P.prototype,"value",2);R([h({type:String})],P.prototype,"unit",2);R([h({type:String})],P.prototype,"foot",2);R([h({type:String})],P.prototype,"tone",2);R([h({type:Number})],P.prototype,"bar",2);R([h({type:Number})],P.prototype,"max",2);P=R([b("mk-stat")],P);const as=.05,ce=.1;function de(e){return e===null?"":e>=ce?"crit":e>=as?"warn":"ok"}function pe(e){const t=de(e);return t==="ok"?"":t}var ns=Object.getOwnPropertyDescriptor,is=(e,t,s,a)=>{for(var n=a>1?void 0:a?ns(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=r(n)||n);return n};const rs=30;let kt=class extends x{render(){const e=this.reader,t=this.fmt,s=this.t,a=e.num("battery_soc"),n=e.num("battery_total_energy"),i=e.num("stored_energy"),r=e.num("battery_power"),o=e.num("usable_energy"),c=o!==null&&n?o/n*100:null,d=r!==null&&Math.abs(r)>rs,m=d&&r<0,u=e.packCount();return l`
      <div class="top">
        <div class="panel">
          <div class="label" style="margin-bottom:12px">${s("core.electrical")}</div>
          ${this.kv("ac_power",0)} ${this.kv("battery_power",0)}
          ${this.kv("battery_voltage",1)} ${this.kv("battery_current",1)}
          ${this.kv("ac_voltage",1)} ${this.kv("ac_frequency",1)}
          ${this.kv("conversion_efficiency",1)}
        </div>

        <div class="centre">
          <mk-gauge
            .soc=${a}
            .usable=${c}
            caption=${s("core.soc_bms")}
            sub=${c===null?"":s("core.soc_usable",{value:t.num(c,1)})}
          ></mk-gauge>

          <div class="split">
            <div>
              <div class="label">${s("core.stored_of_total")}</div>
              <div class="value">
                ${t.num(i,2)}<span class="of">/ ${t.num(n,2)}</span
                ><span class="unit">kWh</span>
              </div>
            </div>
            ${this.energyCell(d&&!m)}
            ${this.runtimeCell(d,m)}
            ${u?l`<div>
                  <div class="label">${s("core.packs")}</div>
                  <div class="value" style="color:var(--mk-fg-2)">
                    ${t.num(u,0)}
                  </div>
                </div>`:p}
          </div>

          <div
            class="flow ${d?"":"rest"}"
            style=${d?`color: var(${m?"--mk-magenta":"--mk-accent"})`:""}
          >
            ${d?m?"▼":"▲":"•"}
            ${t.num(r===null?null:Math.abs(r),0)} W
          </div>
          <div class="label" style="margin-top:2px">
            ${s(d?m?"core.discharging_to_house":"core.charging_from_grid":"core.at_rest")}
            ${e.str("inverter_state")?` · ${e.str("inverter_state")}`:""}
          </div>
        </div>

        <div class="panel">
          <div class="label" style="margin-bottom:12px">${s("core.reserve")}</div>
          ${this.kv("usable_energy",2)} ${this.kv("energy_to_full",2)}
          ${this.kv("backup_reserve_energy",2)}
          ${this.kv("runtime_to_full",1)} ${this.kv("battery_cycle_count_calc",2)}
          ${this.kv("battery_cycle_count",0)} ${this.kv("remaining_cycles",0)}
          ${this.kv("battery_health",2)}
        </div>
      </div>

      <div class="grid tiles">
        <mk-stat
          label=${s("core.today_charged")}
          value=${t.num(e.num("total_daily_charging_energy"),2)}
          unit="kWh"
        ></mk-stat>
        <mk-stat
          label=${s("core.today_discharged")}
          value=${t.num(e.num("total_daily_discharging_energy"),2)}
          unit="kWh"
          tone="magenta"
        ></mk-stat>
        ${this.deltaTile()}
        <mk-stat
          label=${s("core.internal_temp")}
          value=${t.num(e.num("internal_temperature"),1)}
          unit="°C"
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
    `}energyCell(e){const t=e?"energy_to_full":"usable_energy",s=this.reader.num(t);return s===null&&!this.reader.entityId(t)?p:l`
      <div>
        <div class="label">${this.t(e?"core.to_full":"core.usable")}</div>
        <div class="value" style="color:var(${e?"--mk-accent":"--mk-fg"})">
          ${this.fmt.num(s,2)}<span class="unit">kWh</span>
        </div>
      </div>
    `}runtimeCell(e,t){const s=t?"runtime_to_empty":"runtime_to_full";if(!this.reader.entityId(s))return p;const a=e?this.t(t?"core.to_empty":"core.until_full"):this.t("core.runtime");return l`
      <div>
        <div class="label">${a}</div>
        <div class="value" style=${e?"":"color:var(--mk-dim)"}>
          ${e?l`${this.fmt.num(this.reader.num(s),1)}<span class="unit">h</span>`:"—"}
        </div>
      </div>
    `}deltaTile(){const e=this.reader;let t=null;for(let a=1;a<=e.packCount();a++){const n=e.num(`battery_${a}_max_cell_voltage`),i=e.num(`battery_${a}_min_cell_voltage`);if(n===null||i===null)continue;const r=n-i;(!t||r>t.delta)&&(t={pack:a,delta:r})}const s=de(t?.delta??null);return l`
      <mk-stat
        label=${this.t("core.cell_delta")}
        value=${this.fmt.millivolts(t?.delta??null)}
        unit="mV"
        tone=${s}
        .bar=${t?.delta??null}
        .max=${ce}
        foot=${t?this.t("core.in_pack",{pack:t.pack}):this.t("core.no_delta")}
      ></mk-stat>
    `}};kt.styles=[v,g`
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
    `];kt=is([b("mk-view-core")],kt);var os=Object.defineProperty,ls=Object.getOwnPropertyDescriptor,ut=(e,t,s,a)=>{for(var n=a>1?void 0:a?ls(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=(a?r(t,s,n):r(n))||n);return a&&n&&os(t,s,n),n};let Y=class extends k{constructor(){super(...arguments),this.ranges=[],this.packLabel="PACK",this.formatVolts=e=>e.toFixed(3)}get bounds(){const e=this.ranges.flatMap(n=>[n.min,n.max]);if(!e.length)return{lo:3.2,hi:3.4};const t=Math.min(...e),s=Math.max(...e),a=Math.max((s-t)*.15,.005);return{lo:t-a,hi:s+a}}pct(e){const{lo:t,hi:s}=this.bounds,a=s-t||1;return(e-t)/a*100}render(){if(!this.ranges.length)return p;const{lo:e,hi:t}=this.bounds,s=[0,.25,.5,.75].map(a=>({at:a*100,value:e+(t-e)*a}));return l`
      <div class="axis">
        <div></div>
        <div class="ticks">
          ${s.map(a=>l`<span style="left:${a.at}%">${this.formatVolts(a.value)}</span>`)}
        </div>
        <div class="right"><span class="label">Δ</span></div>
      </div>

      ${this.ranges.map(a=>{const n=a.max-a.min,i=pe(n),r=this.pct(a.min),o=Math.max(this.pct(a.max)-r,.6),c=this.pct((a.min+a.max)/2);return l`
          <div class="row">
            <div><span class="name ${i}">${this.packLabel} ${a.index}</span></div>
            <div class="rail">
              <i class="bar ${i}" style="left:${r}%;width:${o}%"></i>
              <i class="mid" style="left:${c}%"></i>
            </div>
            <div class="right">
              <span class="delta ${i}">${Math.round(n*1e3)} mV</span>
              ${a.note?l`<span class="label note">${a.note}</span>`:p}
            </div>
          </div>
        `})}
    `}};Y.styles=[v,g`
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
    `];ut([h({attribute:!1})],Y.prototype,"ranges",2);ut([h({type:String})],Y.prototype,"packLabel",2);ut([h({attribute:!1})],Y.prototype,"formatVolts",2);Y=ut([b("mk-pack-matrix")],Y);var cs=Object.getOwnPropertyDescriptor,ds=(e,t,s,a)=>{for(var n=a>1?void 0:a?cs(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=r(n)||n);return n};let _t=class extends x{get ranges(){const e=this.reader,t=[];for(const s of this.packs){const a=e.num(`battery_${s}_min_cell_voltage`),n=e.num(`battery_${s}_max_cell_voltage`);if(a===null||n===null)continue;const i=e.num(`battery_${s}_cycle_count`),r=e.num(`battery_${s}_mos_temperature`),o=[i===null?null:`${this.fmt.num(i,0)} ⟳`,r===null?null:`${this.fmt.num(r,1)} °C`].filter(Boolean).join(" · ");t.push({index:s,min:a,max:n,note:o})}return t}render(){const e=this.reader,t=this.fmt,s=this.t,a=this.ranges,n=a.map(m=>m.max),i=a.map(m=>m.min),r=a.length?Math.max(...n)-Math.min(...i):null,o=a.reduce((m,u)=>!m||u.max-u.min>m.max-m.min?u:m,null),c=a.map(m=>m.max-m.min),d=c.length?c.reduce((m,u)=>m+u,0)/c.length:null;return l`
      <div class="grid tiles">
        <mk-stat
          label=${s("cells.highest")}
          value=${t.num(n.length?Math.max(...n):null,3)}
          unit="V"
          foot=${n.length?s("cells.in_pack",{pack:a[n.indexOf(Math.max(...n))].index}):""}
        ></mk-stat>
        <mk-stat
          label=${s("cells.lowest")}
          value=${t.num(i.length?Math.min(...i):null,3)}
          unit="V"
          foot=${i.length?s("cells.in_pack",{pack:a[i.indexOf(Math.min(...i))].index}):""}
        ></mk-stat>
        <mk-stat
          label=${s("cells.stack_spread")}
          value=${t.millivolts(r)}
          unit="mV"
          foot=${s("cells.stack_hint")}
        ></mk-stat>
        <mk-stat
          label=${s("cells.mean_delta")}
          value=${t.millivolts(d)}
          unit="mV"
          foot=${o?s("cells.worst_pack",{pack:o.index,value:t.millivolts(o.max-o.min)}):""}
        ></mk-stat>
        <mk-stat
          label=${s("cells.temp_span")}
          value=${t.num(this.tempSpan(),1)}
          unit="K"
          foot=${`${t.num(e.num("min_cell_temperature"),1)} – ${t.num(e.num("max_cell_temperature"),1)} °C`}
        ></mk-stat>
        <mk-stat
          label=${s("cells.packs_online")}
          value=${`${a.length} / ${e.num("bms_pack_count")??a.length}`}
          foot=${s("cells.cells_total",{count:a.length*16})}
        ></mk-stat>
      </div>

      <div class="panel">
        <div class="head">
          <div class="label">${s("cells.matrix_title")}</div>
          <div class="label">${s("cells.matrix_axis")}</div>
        </div>
        ${a.length?l`
              <mk-pack-matrix
                .ranges=${a}
                packLabel=${s("common.pack")}
                .formatVolts=${m=>t.num(m,3)}
              ></mk-pack-matrix>
            `:l`<div class="note">${s("cells.no_ranges")}</div>`}
        <div class="note">${s("cells.matrix_legend")}</div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head"><div class="label">${s("cells.protection")}</div></div>
          ${this.protectionRows()}
        </div>
        <div class="panel">
          <div class="head"><div class="label">${s("cells.bms")}</div></div>
          ${this.kv("bms_pack_count",0)} ${this.kv("bms_online_mask",0)}
          ${this.kv("bms_active_pack_index",0)} ${this.kv("bms_battery_voltage",2)}
          ${this.kv("bms_charge_voltage_limit",2)} ${this.kv("alarm_status",0)}
        </div>
      </div>
    `}tempSpan(){const e=this.reader.num("max_cell_temperature"),t=this.reader.num("min_cell_temperature");return e===null||t===null?null:e-t}protectionRows(){const e=this.reader,t=this.t,s=[];for(const a of this.packs){const n=e.num(`battery_${a}_protection_1`),i=e.num(`battery_${a}_protection_2`),r=e.num(`battery_${a}_mos_status`),o=[];n&&o.push(`P1 ${n}`),i&&o.push(`P2 ${i}`),r&&o.push(`MOS ${r}`),o.length&&s.push(`${t("common.pack")} ${a}: ${o.join(", ")}`)}return this.packs.length?l`
      ${s.length?s.map(a=>this.row(a,t("cells.raised"),"crit")):this.row(t("cells.protection_all",{count:this.packs.length}),t("cells.clear"),"ok")}
      ${this.kv("fault_status",0)} ${this.kv("fault_status_2",0)}
      ${this.bmsVersions()}
    `:l`<div class="note">${t("cells.no_ranges")}</div>`}bmsVersions(){const e=this.reader,t=new Map;for(const s of this.packs){const a=e.str(`battery_${s}_bms_version`);a!==null&&t.set(a,[...t.get(a)??[],s])}if(!t.size)return p;if(t.size===1){const[s]=[...t.keys()];return this.row(this.t("cells.bms_version"),`${this.fmt.version(s)} · ${this.t("cells.uniform")}`)}return[...t.entries()].map(([s,a])=>this.row(`${this.t("cells.bms_version")} ${this.fmt.version(s)}`,a.map(n=>`#${n}`).join(" "),"warn"))}};_t.styles=[v,g`
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
      @media (max-width: 1100px) {
        .below {
          grid-template-columns: 1fr;
        }
      }
    `];_t=ds([b("mk-view-cells")],_t);var ps=Object.defineProperty,hs=Object.getOwnPropertyDescriptor,z=(e,t,s,a)=>{for(var n=a>1?void 0:a?hs(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=(a?r(t,s,n):r(n))||n);return a&&n&&ps(t,s,n),n};let C=class extends k{constructor(){super(...arguments),this.packs=[],this.floor=null,this.backupFloor=null,this.packLabel="PACK",this.energyUnit="kWh",this.formatNumber=e=>e===null?"—":String(e),this.tolerance=5}fill(e){if(e===null)return"var(--mk-track)";const t=Math.min(Math.max(e,0),100)/100,s=t<.5?4+41*(t/.5):45+95*((t-.5)/.5);return`linear-gradient(180deg, hsl(${s.toFixed(0)} 74% 56%), hsl(${s.toFixed(0)} 68% 43%))`}render(){if(!this.packs.length)return p;const e=this.packs.map(s=>s.soc).filter(s=>s!==null).sort((s,a)=>s-a),t=e.length?e[Math.floor(e.length/2)]:null;return l`
      <div
        class="rack"
        style="grid-template-columns: repeat(${this.packs.length}, 1fr)"
      >
        ${this.packs.map(s=>{const a=t!==null&&s.soc!==null&&Math.abs(s.soc-t)>this.tolerance,n=s.soc===null?0:Math.min(Math.max(s.soc,0),100);return l`
            <div>
              <div class="soc ${a?"warn":""}">
                ${this.formatNumber(s.soc,1)}<span class="pct">%</span>
              </div>
              <div class="column ${a?"flagged":""}">
                <div class="fill" style="height:${n}%;background:${this.fill(s.soc)}"></div>
                ${this.floor===null?p:l`<div class="floor" style="bottom:${this.floor}%"></div>`}
                ${this.backupFloor===null?p:l`<div
                      class="backup-floor"
                      style="bottom:${this.backupFloor}%"
                    ></div>`}
                ${s.energy===null?p:l`
                      <div
                        class="readings ${n>=26?"inside":"outside"}"
                        style=${n>=26?`bottom:${n}%;transform:translateY(100%);padding-top:7px`:`bottom:${n}%;transform:translateY(-4px)`}
                      >
                        <span class="kwh">
                          ${this.formatNumber(s.energy,2)}<span class="unit">${this.energyUnit}</span>
                        </span>
                        ${s.socLabel?l`<span class="pct-line">${s.socLabel}</span>`:p}
                      </div>
                    `}
              </div>
              <div class="name ${a?"warn":""}">
                ${this.packLabel} ${s.index}
              </div>
              ${s.note?l`<div class="label note">${s.note}</div>`:p}
            </div>
          `})}
      </div>
    `}};C.styles=[v,g`
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
    `];z([h({attribute:!1})],C.prototype,"packs",2);z([h({type:Number})],C.prototype,"floor",2);z([h({type:Number})],C.prototype,"backupFloor",2);z([h({type:String})],C.prototype,"packLabel",2);z([h({type:String})],C.prototype,"energyUnit",2);z([h({attribute:!1})],C.prototype,"formatNumber",2);z([h({type:Number})],C.prototype,"tolerance",2);C=z([b("mk-pack-bars")],C);var ms=Object.getOwnPropertyDescriptor,us=(e,t,s,a)=>{for(var n=a>1?void 0:a?ms(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=r(n)||n);return n};const Jt=12,fs=20,gs=25;let pt=class extends x{get backupFloor(){if(!this.reader.entityId("backup_reserve_energy"))return null;const e=this.reader.attr("backup_reserve_energy","backup_floor_percent",null);return typeof e=="number"&&e>=0&&e<100?e:null}constructor(){super(),this.floor=null}get packCapacity(){const e=this.reader.num("battery_total_energy"),t=this.packs.length;return e!==null&&t?e/t:null}get fills(){const e=this.reader,t=this.fmt,s=this.packCapacity;return this.packs.map(a=>{const n=e.num(`battery_soc_${a}`),i=e.num(`battery_${a}_min_cell_voltage`),r=e.num(`battery_${a}_max_cell_voltage`);return{index:a,soc:n,energy:n===null||s===null?null:n/100*s,socLabel:n===null?void 0:`${t.num(n,1)} %`,note:i===null||r===null?void 0:`${t.num(i,3)} – ${t.num(r,3)} V`}})}render(){const e=this.reader,t=this.fmt,s=this.t,a=this.fills,n=a.map(d=>d.soc).filter(d=>d!==null),i=n.length?n.reduce((d,m)=>d+m,0)/n.length:null,r=n.length?Math.max(...n)-Math.min(...n):null,o=a.reduce((d,m)=>m.energy===null?d:d+m.energy,0),c=this.packs.map(d=>e.num(`battery_${d}_cycle_count`)).filter(d=>d!==null);return l`
      <div class="grid tiles">
        <mk-stat
          label=${e.label("battery_soc")}
          value=${t.num(e.num("battery_soc"),0)}
          unit="%"
          foot=${s("packs.device_reading")}
        ></mk-stat>
        <mk-stat
          label=${s("packs.mean_soc")}
          value=${t.num(i,1)}
          unit="%"
          foot=${s("packs.from_n_packs",{count:a.length})}
        ></mk-stat>
        <mk-stat
          label=${s("packs.spread")}
          value=${t.num(r,1)}
          unit="pp"
          tone=${r===null?"":r>=fs?"crit":r>=Jt?"warn":"ok"}
          .bar=${r}
          .max=${gs}
        ></mk-stat>
        <mk-stat
          label=${s("packs.stored_total")}
          value=${t.num(e.num("stored_energy"),2)}
          unit="kWh"
          foot=${o?s("packs.summed",{value:t.num(o,2)}):""}
        ></mk-stat>
        <mk-stat
          label=${s("packs.per_pack")}
          value=${t.num(this.packCapacity,2)}
          unit="kWh"
          foot=${s("packs.nominal")}
        ></mk-stat>
        <mk-stat
          label=${s("packs.cycles_sum")}
          value=${t.num(c.length?c.reduce((d,m)=>d+m,0):null,0)}
          foot=${c.length<this.packs.length?s("packs.cycles_partial",{have:c.length,total:this.packs.length}):""}
        ></mk-stat>
      </div>

      <div class="panel">
        <div class="head">
          <div class="label">${s("packs.fill_title")}</div>
          <div class="label">${s("packs.fill_axis")}</div>
        </div>
        ${a.length?l`
              <mk-pack-bars
                .packs=${a}
                .floor=${this.floor}
          .backupFloor=${this.backupFloor}
                packLabel=${s("common.pack")}
                energyUnit=${e.unit("battery_total_energy")||"kWh"}
                .formatNumber=${(d,m=0)=>t.num(d,m)}
              ></mk-pack-bars>
            `:l`<div class="note">${s("packs.none")}</div>`}
        <div class="note">
          ${this.floor===null?s("packs.fill_legend_nofloor"):s("packs.fill_legend",{floor:t.num(this.floor,0)})}
          ${this.backupFloor===null?"":` ${s("packs.fill_legend_backup",{backup:t.num(this.backupFloor,0)})}`}
        </div>
      </div>

      ${a.length?this.table():p}
    `}table(){const e=this.reader,t=this.fmt,s=this.t,a=this.packCapacity,n=this.packs.map(r=>e.num(`battery_soc_${r}`)).filter(r=>r!==null).sort((r,o)=>r-o),i=n.length?n[Math.floor(n.length/2)]:null;return l`
      <div class="panel table-wrap">
        <div class="head"><div class="label">${s("packs.table_title")}</div></div>
        <div class="scroll">
          <table>
            <thead>
              <tr>
                <th>${s("common.pack")}</th>
                <th class="n">${s("packs.col_soc")}</th>
                <th class="n">${s("packs.col_energy")}</th>
                <th class="n">${s("packs.col_min")}</th>
                <th class="n">${s("packs.col_max")}</th>
                <th class="n">${s("packs.col_delta")}</th>
                <th class="n">${s("packs.col_voltage")}</th>
                <th class="n">${s("packs.col_current")}</th>
                <th class="n">${s("packs.col_cycles")}</th>
                <th class="n">${s("packs.col_mos")}</th>
                <th class="n">${s("packs.col_env")}</th>
                <th class="n">${s("packs.col_ntc")}</th>
              </tr>
            </thead>
            <tbody>
              ${this.packs.map(r=>{const o=e.num(`battery_soc_${r}`),c=e.num(`battery_${r}_min_cell_voltage`),d=e.num(`battery_${r}_max_cell_voltage`),m=c!==null&&d!==null?d-c:null,u=[1,2,3,4].map($=>e.num(`battery_${r}_cell_temperature_${$}`)).filter($=>$!==null).map($=>t.num($,1)).join(" · "),f=i!==null&&o!==null&&Math.abs(o-i)>5;return l`
                  <tr class=${f?"flagged":""}>
                    <td class=${f?"warn":""}>${s("common.pack")} ${r}</td>
                    <td class="n ${f?"warn":""}">${t.num(o,1)} %</td>
                    <td class="n">
                      ${t.num(o===null||a===null?null:o/100*a,2)}
                    </td>
                    <td class="n">${t.num(c,3)}</td>
                    <td class="n">${t.num(d,3)}</td>
                    <td class="n ${pe(m)}">
                      ${t.millivolts(m)} mV
                    </td>
                    <td class="n">${t.num(e.num(`battery_${r}_voltage`),2)}</td>
                    <td class="n">${t.num(e.num(`battery_${r}_current`),2)}</td>
                    <td class="n">${t.num(e.num(`battery_${r}_cycle_count`),0)}</td>
                    <td class="n">${t.num(e.num(`battery_${r}_mos_temperature`),1)}</td>
                    <td class="n">${t.num(e.num(`battery_${r}_env_temperature`),1)}</td>
                    <td class="n">${u||"—"}</td>
                  </tr>
                `})}
            </tbody>
          </table>
        </div>
        <div class="note">
          ${s("packs.table_legend",{points:Jt})}
        </div>
      </div>
    `}};pt.properties={floor:{type:Number}};pt.styles=[v,g`
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
    `];pt=us([b("mk-view-packs")],pt);var vs=Object.getOwnPropertyDescriptor,bs=(e,t,s,a)=>{for(var n=a>1?void 0:a?vs(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=r(n)||n);return n};const Q=[1,2,3,4],Zt=1;let yt=class extends x{render(){const e=this.reader,t=this.fmt,s=this.t,a=Q.map(o=>e.num(`mppt${o}_power`)),n=e.sum(Q.map(o=>`mppt${o}_power`)),i=Math.max(...a.map(o=>o??0),1),r=a.some(o=>o!==null&&o>Zt);return Q.some(o=>e.entityId(`mppt${o}_power`))?l`
      <div class="grid channels">
        ${Q.map(o=>{const c=e.num(`mppt${o}_power`),d=c!==null&&c>Zt;return l`
            <div class="panel">
              <div class="head">
                <div class="label">MPPT ${o}</div>
                <span class="pill ${d?"on":""}">
                  ${s(d?"solar.active":"solar.floating")}
                </span>
              </div>
              <div class="chan-value">
                ${t.num(c,0)}<span class="chan-unit">W</span>
              </div>
              <div class="track">
                <i style="width:${c===null?0:c/i*100}%"></i>
              </div>
              <div style="margin-top:13px">
                ${this.kv(`mppt${o}_voltage`,1)} ${this.kv(`mppt${o}_current`,2)}
              </div>
            </div>
          `})}
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head">
            <div class="label">${s("solar.summary")}</div>
            <div class="label">${s(r?"solar.some_active":"solar.all_idle")}</div>
          </div>
          <div class="chan-value">
            ${t.num(n,0)}<span class="chan-unit">W</span>
          </div>
          <div class="note">
            ${s(r?"solar.note_active":"solar.note_floating")}
          </div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${s("solar.diagnostics")}</div></div>
          ${this.kv("mppt_error",0,{tone:e.num("mppt_error")?"crit":"ok"})}
          ${this.kv("mppt_warning",0,{tone:e.num("mppt_warning")?"warn":"ok"})}
          ${this.kv("mppt_version",0)}
          ${n===null?p:this.row(s("solar.channels_reporting"),`${a.filter(o=>o!==null).length} / ${Q.length}`)}
        </div>
      </div>
    `:l`<div class="panel"><div class="note">${s("solar.none")}</div></div>`}};yt.styles=[v,g`
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
    `];yt=bs([b("mk-view-solar")],yt);var $s=Object.getOwnPropertyDescriptor,ks=(e,t,s,a)=>{for(var n=a>1?void 0:a?$s(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=r(n)||n);return n};const _s=[{titleKey:"energy.today",charge:"total_daily_charging_energy",discharge:"total_daily_discharging_energy"},{titleKey:"energy.month",charge:"total_monthly_charging_energy",discharge:"total_monthly_discharging_energy",efficiency:"round_trip_efficiency_monthly"},{titleKey:"energy.lifetime",charge:"total_charging_energy",discharge:"total_discharging_energy",efficiency:"round_trip_efficiency_total"}];let xt=class extends x{render(){const e=this.t;return l`
      <div class="grid periods">${_s.map(t=>this.period(t))}</div>
      <div class="grid below">
        ${this.efficiencyPanel()}
        <div class="panel">
          <div class="head"><div class="label">${e("energy.throughput")}</div></div>
          ${this.kv("battery_cycle_count_calc",2)} ${this.kv("battery_cycle_count",0)}
          ${this.kv("stored_energy",2)} ${this.kv("battery_total_energy",2)}
          ${this.kv("usable_energy",2)} ${this.kv("energy_to_full",2)}
          ${this.kv("remaining_cycles",0)} ${this.kv("battery_health",2)}
        </div>
      </div>
    `}period(e){const t=this.reader,s=this.fmt,a=this.t,n=t.num(e.charge),i=t.num(e.discharge);if(n===null&&i===null)return p;const r=n?(i??0)/n*100:null,o=n!==null&&i!==null?n-i:null,c=e.efficiency?t.num(e.efficiency):null;return l`
      <div class="panel">
        <div class="head">
          <div class="label">${a(e.titleKey)}</div>
          ${c===null?p:l`<span class="pill ${c<70?"w":"on"}">
                ${a("energy.rte")} ${s.num(c,1)} %
              </span>`}
        </div>
        <div class="pair">
          <div>
            <div class="big">${s.num(n,2)}</div>
            <div class="label" style="margin-top:2px">${a("energy.charged")}</div>
          </div>
          <div>
            <div class="big magenta">${s.num(i,2)}</div>
            <div class="label" style="margin-top:2px">${a("energy.discharged")}</div>
          </div>
        </div>
        <div class="track"><i style="width:100%"></i></div>
        <div class="track out">
          <i style="width:${r===null?0:Math.min(r,100)}%"></i>
        </div>
        <div style="margin-top:14px">
          ${o===null?p:this.row(a("energy.loss"),`${s.num(o,2)} kWh`,o/(n||1)>.25?"warn":"")}
          ${r===null?p:this.row(a("energy.returned"),`${s.num(r,1)} %`)}
        </div>
      </div>
    `}efficiencyPanel(){const e=this.reader,t=this.fmt,s=this.t,a=[[e.label("round_trip_efficiency_total"),e.num("round_trip_efficiency_total"),""],[e.label("round_trip_efficiency_monthly"),e.num("round_trip_efficiency_monthly"),"warn"],[e.label("conversion_efficiency"),e.num("conversion_efficiency"),"ok"]],n=e.num("round_trip_efficiency_total"),i=e.num("round_trip_efficiency_monthly"),r=n!==null&&i!==null?n-i:null;return l`
      <div class="panel">
        <div class="head"><div class="label">${s("energy.efficiency")}</div></div>
        <div class="note" style="margin-top:0;margin-bottom:16px">
          ${s("energy.rte_hint")}
        </div>
        ${a.map(([o,c,d])=>c===null?p:l`
                <div class="meter">
                  <div class="meter-head">
                    <span class="label">${o}</span>
                    <span class="value ${d}" style="font-size:13px">
                      ${t.num(c,1)} %
                    </span>
                  </div>
                  <div class="track">
                    <i
                      style="width:${Math.min(Math.max(c,0),100)}%;background:var(--mk-${d||"accent"})"
                    ></i>
                  </div>
                </div>
              `)}
        ${r===null||Math.abs(r)<5?p:l`<div class="note">
              ${s("energy.gap_hint",{value:t.num(Math.abs(r),1)})}
            </div>`}
      </div>
    `}};xt.styles=[v,g`
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
    `];xt=ks([b("mk-view-energy")],xt);var ys=Object.getOwnPropertyDescriptor,xs=(e,t,s,a)=>{for(var n=a>1?void 0:a?ys(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=r(n)||n);return n};const Qt=["alarm_status","fault_status","fault_status_low","fault_status_2","fault_status_2_low","mppt_error","mppt_warning"];let wt=class extends x{render(){const e=this.reader,t=this.t,s=Qt.filter(a=>{const n=e.num(a);return n!==null&&n!==0});return l`
      <div class="banner ${s.length?"crit":"ok"}">
        <span class="dot"></span>
        ${s.length?t("system.faults_raised",{list:s.map(a=>e.label(a)).join(", ")}):t("system.no_faults")}
      </div>

      <div class="grid quad">
        <div class="panel">
          <div class="head"><div class="label">${t("system.device")}</div></div>
          ${this.kv("device_name",0,{raw:!0})}
          ${this.row(t("system.packs"),String(this.packs.length))}
          ${this.kv("battery_total_energy",2)} ${this.kv("modbus_address",0,{raw:!0})}
          ${this.kv("inverter_state",0,{raw:!0})} ${this.kv("work_mode",0,{raw:!0})}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.firmware")}</div></div>
          ${this.kv("ems_version",0,{version:!0})} ${this.kv("bms_version",0,{version:!0})}
          ${this.kv("vms_version",0,{version:!0})} ${this.kv("mppt_version",0,{version:!0})}
          ${this.kv("ems_boot_version",0,{version:!0})} ${this.kv("vns_boot_version",0,{version:!0})}
          ${this.kv("comm_module_firmware",0,{raw:!0})}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.connection")}</div></div>
          ${this.kv("wifi_signal_strength",0)} ${this.kv("bluetooth_status",0,{raw:!0})}
          ${this.kv("device_ip_address",0,{raw:!0})} ${this.kv("gateway_ip_address",0,{raw:!0})}
          ${this.kv("ble_mac_address",0,{raw:!0})}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.faults")}</div></div>
          ${Qt.map(a=>this.kv(a,0,{tone:e.num(a)?"crit":"ok"}))}
        </div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head"><div class="label">${t("system.control")}</div></div>
          ${this.kv("set_charge_power",0)} ${this.kv("set_discharge_power",0)}
          ${this.kv("max_charge_power",0)} ${this.kv("max_discharge_power",0)}
          ${this.kv("charge_to_soc",0)}
          ${this.ceilingNote()}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.thermal")}</div></div>
          ${this.kv("internal_temperature",1)} ${this.kv("internal_mos1_temperature",1)}
          ${this.kv("max_cell_temperature",1)} ${this.kv("min_cell_temperature",1)}
          ${this.kv("battery_voltage",2)} ${this.kv("battery_current",2)}
          ${this.kv("ac_voltage",1)} ${this.kv("ac_frequency",2)}
        </div>
      </div>
    `}ceilingNote(){const e=this.reader.num("charge_to_soc");if(e===null)return p;const t=e>=10&&e<=100;return l`
      <div class="note">
        ${t?this.t("system.ceiling_used",{value:this.fmt.num(e,0)}):this.t("system.ceiling_ignored",{value:this.fmt.num(e,0)})}
      </div>
    `}};wt.styles=[v,g`
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
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--mk-ok);
        flex: none;
      }
      .banner.crit .dot {
        background: var(--mk-crit);
      }
    `];wt=xs([b("mk-view-system")],wt);var ws=Object.defineProperty,Ss=Object.getOwnPropertyDescriptor,S=(e,t,s,a)=>{for(var n=a>1?void 0:a?Ss(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=(a?r(t,s,n):r(n))||n);return a&&n&&ws(t,s,n),n};let _=class extends k{constructor(){super(...arguments),this.label="",this.value=null,this.min=0,this.max=100,this.step=1,this.unit="",this.disabled=!1,this.formatNumber=e=>e===null?"—":String(e),this.dragging=null,this.pending=null}willUpdate(e){e.has("value")&&this.pending!==null&&this.value===this.pending&&(this.pending=null)}get shown(){return this.dragging??this.pending??this.value}render(){const e=this.shown;return l`
      <div class="row">
        <span class="label">${this.label}</span>
        <span class="val ${this.pending!==null?"pending":""}">
          ${this.formatNumber(e)}${this.unit?l`<span class="unit">${this.unit}</span>`:p}
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
    `}commit(e){this.dragging=null,e!==this.value&&(this.pending=e,this.onCommit?.(e))}};_.styles=[v,g`
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
    `];S([h({type:String})],_.prototype,"label",2);S([h({type:Number})],_.prototype,"value",2);S([h({type:Number})],_.prototype,"min",2);S([h({type:Number})],_.prototype,"max",2);S([h({type:Number})],_.prototype,"step",2);S([h({type:String})],_.prototype,"unit",2);S([h({type:Boolean})],_.prototype,"disabled",2);S([h({attribute:!1})],_.prototype,"formatNumber",2);S([h({attribute:!1})],_.prototype,"onCommit",2);S([y()],_.prototype,"dragging",2);S([y()],_.prototype,"pending",2);_=S([b("mk-slider")],_);var As=Object.defineProperty,Ps=Object.getOwnPropertyDescriptor,V=(e,t,s,a)=>{for(var n=a>1?void 0:a?Ps(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=(a?r(t,s,n):r(n))||n);return a&&n&&As(t,s,n),n};let M=class extends k{constructor(){super(...arguments),this.label="",this.options=[],this.value=null,this.disabled=!1,this.pending=null}willUpdate(e){e.has("value")&&this.pending!==null&&this.value===this.pending&&(this.pending=null)}render(){const e=this.pending??this.value;return l`
      <span class="label">${this.label}</span>
      <div class="bar" role="group" aria-label=${this.label}>
        ${this.options.map(t=>l`
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
    `}pick(e){e!==this.value&&(this.pending=e,this.onSelect?.(e))}};M.styles=[v,g`
      :host {
        display: block;
      }
      .label {
        display: block;
        margin-bottom: 7px;
      }
      .bar {
        display: flex;
        border: 1px solid var(--mk-line);
        background: var(--mk-inset);
      }
      button {
        flex: 1;
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 9px 6px;
        color: var(--mk-dim);
        background: none;
        border: 0;
        border-right: 1px solid var(--mk-line);
        cursor: pointer;
        transition: color 0.15s, background 0.15s;
        white-space: nowrap;
      }
      button:last-child {
        border-right: 0;
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
        box-shadow: inset 0 -2px 0 var(--mk-warn);
      }
      button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      button:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: -2px;
      }
    `];V([h({type:String})],M.prototype,"label",2);V([h({attribute:!1})],M.prototype,"options",2);V([h({type:String})],M.prototype,"value",2);V([h({type:Boolean})],M.prototype,"disabled",2);V([h({attribute:!1})],M.prototype,"onSelect",2);V([y()],M.prototype,"pending",2);M=V([b("mk-segment")],M);var Cs=Object.defineProperty,Es=Object.getOwnPropertyDescriptor,I=(e,t,s,a)=>{for(var n=a>1?void 0:a?Es(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=(a?r(t,s,n):r(n))||n);return a&&n&&Cs(t,s,n),n};let E=class extends k{constructor(){super(...arguments),this.label="",this.hint="",this.bare=!1,this.checked=null,this.disabled=!1,this.pending=null}willUpdate(e){e.has("checked")&&this.pending!==null&&this.checked===this.pending&&(this.pending=null)}render(){const e=this.pending??this.checked;return l`
      ${this.bare?p:l`
            <div class="text">
              <div class="name">${this.label}</div>
              ${this.hint?l`<div class="hint">${this.hint}</div>`:p}
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
    `}flip(){const e=!(this.pending??this.checked);this.pending=e,this.onToggle?.(e)}};E.styles=[v,g`
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
    `];I([h({type:String})],E.prototype,"label",2);I([h({type:String})],E.prototype,"hint",2);I([h({type:Boolean})],E.prototype,"bare",2);I([h({type:Boolean})],E.prototype,"checked",2);I([h({type:Boolean})],E.prototype,"disabled",2);I([h({attribute:!1})],E.prototype,"onToggle",2);I([y()],E.prototype,"pending",2);E=I([b("mk-toggle")],E);var Os=Object.defineProperty,Ts=Object.getOwnPropertyDescriptor,D=(e,t,s,a)=>{for(var n=a>1?void 0:a?Ts(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=(a?r(t,s,n):r(n))||n);return a&&n&&Os(t,s,n),n};let A=class extends k{constructor(){super(...arguments),this.rows=[],this.dayLabel=e=>e,this.formatNumber=e=>e===null?"—":String(e)}toClock(e){if(e===null||e<0||e>2359)return"";const t=Math.floor(e/100),s=e%100;return t>23||s>59?"":`${String(t).padStart(2,"0")}:${String(s).padStart(2,"0")}`}fromClock(e){const t=/^(\d{1,2}):(\d{2})$/.exec(e);return t?Number(t[1])*100+Number(t[2]):null}render(){if(!this.rows.length)return p;const e=this.labels;return l`
      <div class="head-row">
        <span class="label"></span>
        <span class="label">${e.active}</span>
        <span class="label">${e.window}</span>
        <span class="label">${e.power}</span>
        <span class="label">${e.days}</span>
      </div>

      ${this.rows.map(t=>{const s=t.enabled!==!0;return l`
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
                @change=${a=>this.time(t.index,"start",a)}
              />
              <span class="dash">–</span>
              <input
                type="time"
                .value=${this.toClock(t.end)}
                aria-label=${`${e.window} ${t.index}`}
                @change=${a=>this.time(t.index,"end",a)}
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

            <select
              aria-label=${`${e.days} ${t.index}`}
              @change=${a=>this.onDays?.(t.index,a.target.value)}
            >
              ${t.days===null?l`<option value="" selected>${e.unset}</option>`:p}
              ${t.dayOptions.map(a=>l`
                  <option value=${a} ?selected=${t.days===a}>
                    ${this.dayLabel(a)}
                  </option>
                `)}
            </select>
          </div>
        `})}
    `}time(e,t,s){const a=this.fromClock(s.target.value);a!==null&&this.onTime?.(e,t,a)}power(e,t){const s=Number(t.target.value);Number.isFinite(s)&&this.onPower?.(e,s)}};A.styles=[v,g`
      .head-row,
      .row {
        display: grid;
        grid-template-columns: 60px 52px 200px 1fr 128px;
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
      input[type="number"],
      select {
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
      select {
        width: 100%;
      }
      input:focus-visible,
      select:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 1px;
      }
      input:disabled,
      select:disabled {
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
    `];D([h({attribute:!1})],A.prototype,"rows",2);D([h({attribute:!1})],A.prototype,"labels",2);D([h({attribute:!1})],A.prototype,"dayLabel",2);D([h({attribute:!1})],A.prototype,"formatNumber",2);D([h({attribute:!1})],A.prototype,"onEnable",2);D([h({attribute:!1})],A.prototype,"onTime",2);D([h({attribute:!1})],A.prototype,"onPower",2);D([h({attribute:!1})],A.prototype,"onDays",2);A=D([b("mk-schedule")],A);var Ms=Object.defineProperty,Ds=Object.getOwnPropertyDescriptor,ft=(e,t,s,a)=>{for(var n=a>1?void 0:a?Ds(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=(a?r(t,s,n):r(n))||n);return a&&n&&Ms(t,s,n),n};const Xt=["set_charge_power","set_discharge_power"],te=["max_charge_power","max_discharge_power"],Ns=[1,2,3,4,5,6],Rs=30;let J=class extends x{constructor(){super(...arguments),this.wrote={},this.confirmReset=!1}note(e){this.wrote={...this.wrote,[e]:Date.now()}}overwritten(e){const t=this.wrote[e];if(!t)return!1;const s=this.reader.rawState(e)?.last_updated;if(!s)return!1;const a=(new Date(s).getTime()-t)/1e3;return a>.5&&a<Rs}slider(e){const t=this.reader;return t.entityId(e)?l`
      <mk-slider
        label=${t.label(e)}
        .value=${t.num(e)}
        .min=${t.attr(e,"min",0)}
        .max=${t.attr(e,"max",100)}
        .step=${t.attr(e,"step",1)}
        unit=${t.unit(e)}
        ?disabled=${!t.writable(e)}
        .formatNumber=${s=>this.fmt.num(s,0)}
        .onCommit=${s=>{this.note(e),this.controls.setNumber(e,s)}}
      ></mk-slider>
    `:p}segment(e){const t=this.reader;if(!t.entityId(e))return p;const s=t.attr(e,"options",[]);return l`
      <mk-segment
        label=${t.label(e)}
        .value=${t.rawState(e)?.state??null}
        .options=${s.map(a=>({value:a,label:this.t(`control.opt.${a}`)}))}
        ?disabled=${!t.writable(e)}
        .onSelect=${a=>{this.note(e),this.controls.selectOption(e,a)}}
      ></mk-segment>
    `}toggle(e,t){const s=this.reader;if(!s.entityId(e))return p;const a=s.rawState(e);return l`
      <mk-toggle
        label=${s.label(e)}
        hint=${this.t(t)}
        .checked=${a&&a.state!=="unavailable"?a.state==="on":null}
        .onToggle=${n=>{this.note(e),this.controls.setSwitch(e,n)}}
      ></mk-toggle>
    `}get scheduleRows(){const e=this.reader;return Ns.filter(t=>e.entityId(`schedule_${t}_start`)).map(t=>{const s=`schedule_${t}_mode`,a=e.rawState(`schedule_${t}_enabled`);return{index:t,enabled:a&&a.state!=="unavailable"?a.state==="on":null,start:e.num(`schedule_${t}_start`),end:e.num(`schedule_${t}_end`),power:e.num(s),powerMin:e.attr(s,"min",-2500),powerMax:e.attr(s,"max",2500),powerStep:e.attr(s,"step",1),days:e.rawState(`schedule_${t}_days`)?.state??null,dayOptions:e.attr(`schedule_${t}_days`,"options",[])}})}render(){const e=this.t,t=[...Xt,...te].filter(a=>this.overwritten(a)),s=this.scheduleRows;return l`
      ${t.length?l`<div class="warn-note">
            <b>!</b>
            <span>
              ${e("control.overwritten",{names:t.map(a=>this.reader.label(a)).join(", ")})}
            </span>
          </div>`:p}

      <div class="grid top">
        <div class="panel stack">
          <div class="head"><div class="label">${e("control.power")}</div></div>
          ${Xt.map(a=>this.slider(a))}
          <div class="note">${e("control.power_hint")}</div>
        </div>

        <div class="panel stack">
          <div class="head"><div class="label">${e("control.limits")}</div></div>
          ${te.map(a=>this.slider(a))} ${this.slider("charge_to_soc")}
        </div>

        <div class="panel stack">
          <div class="head"><div class="label">${e("control.mode")}</div></div>
          ${this.segment("user_work_mode")} ${this.segment("force_mode")}
          <div>
            ${this.toggle("backup_function","control.backup_hint")}
            ${this.toggle("rs485_control_mode","control.rs485_hint")}
          </div>
        </div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head">
            <div class="label">${e("control.schedules")}</div>
            <div class="label">${e("control.schedules_axis")}</div>
          </div>
          ${s.length?l`
                <mk-schedule
                  .rows=${s}
                  .labels=${{window:e("control.window"),power:e("control.sched_power"),days:e("control.days"),active:e("control.active"),unset:e("control.unset")}}
                  .dayLabel=${a=>e(`control.day.${a}`)}
                  .formatNumber=${a=>this.fmt.num(a,0)}
                  .onEnable=${(a,n)=>this.controls.setSwitch(`schedule_${a}_enabled`,n)}
                  .onTime=${(a,n,i)=>this.controls.setNumber(`schedule_${a}_${n}`,i)}
                  .onPower=${(a,n)=>this.controls.setNumber(`schedule_${a}_mode`,n)}
                  .onDays=${(a,n)=>this.controls.selectOption(`schedule_${a}_days`,n)}
                ></mk-schedule>
              `:l`<div class="note">${e("control.no_schedules")}</div>`}
          <div class="note">${e("control.schedules_hint")}</div>
        </div>
      </div>

      ${this.reader.entityId("reset_device")?l`
            <div class="grid below">
              <div class="panel">
                <div class="head"><div class="label">${e("control.device")}</div></div>
                <div class="danger">
                  ${this.confirmReset?l`
                        <button
                          class="action confirm"
                          @click=${()=>{this.controls.press("reset_device"),this.confirmReset=!1}}
                        >
                          ${e("control.reset_confirm")}
                        </button>
                        <button class="action" @click=${()=>this.confirmReset=!1}>
                          ${e("control.cancel")}
                        </button>
                      `:l`
                        <button class="action" @click=${()=>this.confirmReset=!0}>
                          ${e("control.reset")}
                        </button>
                      `}
                  <span class="note" style="margin:0">${e("control.reset_hint")}</span>
                </div>
              </div>
            </div>
          `:p}
    `}};J.styles=[v,g`
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
      button.action.confirm {
        border-color: var(--mk-crit);
        color: var(--mk-crit);
      }
      button.action:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
    `];ft([h({attribute:!1})],J.prototype,"controls",2);ft([y()],J.prototype,"wrote",2);ft([y()],J.prototype,"confirmReset",2);J=ft([b("mk-view-control")],J);const St=[{id:"reactor",name:"Reactor",dark:{bg:"#05090f",surface:"#0b131d","surface-2":"#101b28",inset:"#0d1723",line:"#1b2b3d","line-soft":"#152435",fg:"#dff2f6","fg-2":"#9fb8c6",dim:"#5d7d92",accent:"#2ae6dc","accent-deep":"#1b8fd6","accent-wash":"#0e2b30",magenta:"#ff3ea5","magenta-wash":"#2a0d1e",ok:"#35d67a",warn:"#ffb020",crit:"#ff4d5e",track:"#132434","on-accent":"#04141a"},light:{bg:"#eef2f6",surface:"#ffffff","surface-2":"#f6f9fb",inset:"#e8eef3",line:"#cbd8e2","line-soft":"#dfe7ee",fg:"#0c1a24","fg-2":"#3a5162",dim:"#5b7484",accent:"#0c847e","accent-deep":"#0f5f8c","accent-wash":"#d9f0ee",magenta:"#b4176e","magenta-wash":"#fbe4f0",ok:"#0f7a44",warn:"#8a5804",crit:"#b52436",track:"#dae3ea","on-accent":"#ffffff"}},{id:"cockpit",name:"Cockpit",dark:{bg:"#0a0704",surface:"#14100a","surface-2":"#1c1710",inset:"#17120b",line:"#35291a","line-soft":"#281f14",fg:"#f5e8d2","fg-2":"#c4ac8a",dim:"#8a7355",accent:"#ffb020","accent-deep":"#d2690c","accent-wash":"#33220a",magenta:"#ff5f3a","magenta-wash":"#331309",ok:"#9ecb3a",warn:"#ffd54a",crit:"#ff4a3d",track:"#241c11","on-accent":"#1a1000"},light:{bg:"#f5f0e6",surface:"#fffdf8","surface-2":"#faf5ea",inset:"#efe7d6",line:"#d9cdb4","line-soft":"#e8dfcc",fg:"#201705","fg-2":"#5b4a2d",dim:"#7d6a48",accent:"#a35c00","accent-deep":"#7c3d05","accent-wash":"#f6e6c8",magenta:"#b53a17","magenta-wash":"#fadfd6",ok:"#4d6b12",warn:"#8a5804",crit:"#b02a20",track:"#e3d8c2","on-accent":"#fffdf8"}},{id:"verdant",name:"Verdant",dark:{bg:"#040b07",surface:"#0a150f","surface-2":"#0f1d16",inset:"#0c1811",line:"#1c3226","line-soft":"#152920",fg:"#ddf5e5","fg-2":"#9cc0ab",dim:"#5d8570",accent:"#7ee787","accent-deep":"#26a269","accent-wash":"#0f2b1c",magenta:"#3ddbd9","magenta-wash":"#0a2a2c",ok:"#7ee787",warn:"#ffc94a",crit:"#ff5f6d",track:"#12281c","on-accent":"#04140a"},light:{bg:"#eef4ef",surface:"#ffffff","surface-2":"#f5faf6",inset:"#e6efe8",line:"#c7d9cc","line-soft":"#dbe8de",fg:"#0a1a10","fg-2":"#385643",dim:"#5a7864",accent:"#1a7f4b","accent-deep":"#115e37","accent-wash":"#d7f0e0",magenta:"#0d7d7b","magenta-wash":"#d4f0ef",ok:"#1a7f4b",warn:"#8a5804",crit:"#b52436",track:"#d9e5db","on-accent":"#ffffff"}},{id:"plasma",name:"Plasma",dark:{bg:"#07050f",surface:"#110d1e","surface-2":"#191330",inset:"#140f26",line:"#2c2350","line-soft":"#211a3e",fg:"#eae4ff","fg-2":"#b3a8d8",dim:"#7568a8",accent:"#a06bff","accent-deep":"#5b3ed6","accent-wash":"#22164a",magenta:"#ff5bc8","magenta-wash":"#2e0f2a",ok:"#4ddba0",warn:"#ffc046",crit:"#ff5470",track:"#1c1638","on-accent":"#0b0618"},light:{bg:"#f1eef8",surface:"#ffffff","surface-2":"#f8f5fd",inset:"#ebe6f6",line:"#d2c8e8","line-soft":"#e2dbf1",fg:"#150c28","fg-2":"#47395f",dim:"#6b5c88",accent:"#6b2fd0","accent-deep":"#4a1aa8","accent-wash":"#e7dbfb",magenta:"#b81f86","magenta-wash":"#fbdcf0",ok:"#0f7a52",warn:"#8a5804",crit:"#b52440",track:"#e0d8f0","on-accent":"#ffffff"}},{id:"ember",name:"Ember",dark:{bg:"#0a0605",surface:"#150e0b","surface-2":"#1e1511",inset:"#191110",line:"#38231b","line-soft":"#2a1a15",fg:"#f7e6dd","fg-2":"#c7a696",dim:"#8d6a5c",accent:"#ff6b3d","accent-deep":"#c22f1e","accent-wash":"#331408",magenta:"#ffc247","magenta-wash":"#2e2209",ok:"#58c98a",warn:"#ffc247",crit:"#ff3b30",track:"#251712","on-accent":"#190802"},light:{bg:"#f6f0ec",surface:"#ffffff","surface-2":"#fbf5f1",inset:"#efe4dd",line:"#ddc9bd","line-soft":"#ebdcd3",fg:"#22110a","fg-2":"#5e4235",dim:"#7f6153",accent:"#c1401b","accent-deep":"#922b12","accent-wash":"#fadfd3",magenta:"#8a6206","magenta-wash":"#f7e9c9",ok:"#0f7a44",warn:"#8a5804",crit:"#b52436",track:"#e6d6cb","on-accent":"#ffffff"}},{id:"glacier",name:"Glacier",dark:{bg:"#060a10",surface:"#0d141d","surface-2":"#131d29",inset:"#101825",line:"#223549","line-soft":"#1a2b3c",fg:"#e4eef8","fg-2":"#a6bccf",dim:"#67839c",accent:"#63b3ff","accent-deep":"#2f6fd0","accent-wash":"#112a45",magenta:"#9fd8e8","magenta-wash":"#10262e",ok:"#4fd1a5",warn:"#ffcb5c",crit:"#ff6b7d",track:"#16232f","on-accent":"#04101d"},light:{bg:"#eef2f7",surface:"#ffffff","surface-2":"#f6f9fc",inset:"#e7edf4",line:"#c8d5e3","line-soft":"#dde5ee",fg:"#0b1622","fg-2":"#3c5064",dim:"#5f7488",accent:"#1462b8","accent-deep":"#0c4383","accent-wash":"#d9e9fb",magenta:"#2a7f96","magenta-wash":"#d6eef4",ok:"#0f7a52",warn:"#8a5804",crit:"#b52440",track:"#dbe4ee","on-accent":"#ffffff"}},{id:"ha",name:"Home Assistant",dark:{bg:"var(--primary-background-color, #05090f)",surface:"var(--card-background-color, #0b131d)","surface-2":"var(--secondary-background-color, #101b28)",inset:"var(--secondary-background-color, #0d1723)",line:"var(--divider-color, #1b2b3d)","line-soft":"var(--divider-color, #152435)",fg:"var(--primary-text-color, #dff2f6)","fg-2":"var(--secondary-text-color, #9fb8c6)",dim:"var(--secondary-text-color, #5d7d92)",accent:"var(--primary-color, #2ae6dc)","accent-deep":"var(--dark-primary-color, #1b8fd6)","accent-wash":"var(--secondary-background-color, #0e2b30)",magenta:"var(--accent-color, #ff3ea5)","magenta-wash":"var(--secondary-background-color, #2a0d1e)",ok:"var(--success-color, #35d67a)",warn:"var(--warning-color, #ffb020)",crit:"var(--error-color, #ff4d5e)",track:"var(--divider-color, #132434)","on-accent":"var(--text-primary-color, #04141a)"}}],he="reactor";function Dt(e){return St.find(t=>t.id===e)??St[0]}function ee(e){return!Dt(e).light}function zs(e,t,s){const a=Dt(t),n=s&&a.light||a.dark,i=a.id===he;for(const[r,o]of Object.entries(n)){const c=`--mk-${r}`;i?e.style.removeProperty(c):e.style.setProperty(c,o)}}const H={scheme:he,mode:"auto",startTab:"last",hiddenTabs:[],extraDigits:!1},Nt="marstek-panel.settings";function Is(){try{const e=localStorage.getItem(Nt);return e?me(JSON.parse(e)):{...H}}catch{return{...H}}}function me(e){if(!e||typeof e!="object")return{...H};const t=e;return{scheme:typeof t.scheme=="string"&&Dt(t.scheme).id===t.scheme?t.scheme:H.scheme,mode:t.mode==="dark"||t.mode==="light"||t.mode==="auto"?t.mode:H.mode,startTab:typeof t.startTab=="string"?t.startTab:H.startTab,hiddenTabs:Array.isArray(t.hiddenTabs)?t.hiddenTabs.filter(s=>typeof s=="string"):[],extraDigits:t.extraDigits===!0}}function js(e){return JSON.stringify(e,null,2)}function Us(e){let t;try{t=JSON.parse(e)}catch{return null}return!t||typeof t!="object"||Array.isArray(t)?null:me(t)}function Ls(e){try{localStorage.setItem(Nt,JSON.stringify(e))}catch{}}function Hs(){try{localStorage.removeItem(Nt)}catch{}}var Bs=Object.defineProperty,Fs=Object.getOwnPropertyDescriptor,T=(e,t,s,a)=>{for(var n=a>1?void 0:a?Fs(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=(a?r(t,s,n):r(n))||n);return a&&n&&Bs(t,s,n),n};let w=class extends k{constructor(){super(...arguments),this.tabs=[],this.light=!1,this.transferOpen=!1,this.transferText="",this.transferBad=!1}render(){const e=this.t,t=this.settings,s=ee(t.scheme);return l`
      <div class="grid top">
        <div class="panel">
          <div class="head"><div class="label">${e("settings.scheme")}</div></div>
          <div class="schemes">
            ${St.map(a=>this.schemeCard(a.id,a.name,this.light&&a.light||a.dark))}
          </div>
          <div class="note">${e("settings.scheme_hint")}</div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${e("settings.appearance")}</div></div>

          <div class="field">
            <span class="label">${e("settings.mode")}</span>
            ${this.choices([["auto",e("settings.mode.auto")],["dark",e("settings.mode.dark")],["light",e("settings.mode.light")]],t.mode,a=>this.onChange({mode:a}),s)}
            ${s?l`<div class="note">${e("settings.mode_ha")}</div>`:p}
          </div>

          <div class="field">
            <span class="label">${e("settings.digits")}</span>
            ${this.choices([[!1,e("settings.digits.normal")],[!0,e("settings.digits.more")]],t.extraDigits,a=>this.onChange({extraDigits:a}))}
          </div>
        </div>
      </div>

      <div class="grid below">
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
          ${this.transferOpen?this.transfer():p}
        </div>
      </div>
    `}transfer(){const e=this.t;return l`
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
          ${this.transferBad?l`<span class="bad-note">${e("settings.transfer_bad")}</span>`:l`<span class="note" style="margin:0">${e("settings.transfer_hint")}</span>`}
        </div>
      </div>
    `}toggleTransfer(){this.transferOpen=!this.transferOpen,this.transferOpen&&this.resetTransfer()}resetTransfer(){this.transferText=js(this.settings),this.transferBad=!1}applyTransfer(){const e=Us(this.transferText);if(!e){this.transferBad=!0;return}this.transferBad=!1,this.onChange(e)}schemeCard(e,t,s){const a=this.settings.scheme===e;return l`
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
          ${ee(e)?l`<small>${this.t("settings.scheme_theme")}</small>`:p}
        </span>
      </button>
    `}choices(e,t,s,a=!1,n=!1){return l`
      <div class="choices ${n?"packed":""}">
        ${e.map(([i,r])=>l`
            <button
              aria-pressed=${i===t}
              ?disabled=${a}
              @click=${()=>s(i)}
            >
              ${r}
            </button>
          `)}
      </div>
    `}tabRow(e){const t=this.settings.hiddenTabs.includes(e.id),s=e.id==="core",a=`tab-${e.id}`;return l`
      <div class="tab-row ${e.available?"":"gone"}">
        <input
          type="checkbox"
          id=${a}
          .checked=${e.available&&!t}
          ?disabled=${!e.available||s}
          @change=${n=>this.setHidden(e.id,!n.target.checked)}
        />
        <label for=${a}>${e.label}</label>
        ${e.available?s?l`<span class="why">${this.t("settings.always")}</span>`:p:l`<span class="why">${this.t(`settings.unavail.${e.id}`)}</span>`}
      </div>
    `}setHidden(e,t){const s=this.settings.hiddenTabs.filter(a=>a!==e);this.onChange({hiddenTabs:t?[...s,e]:s})}};w.styles=[v,g`
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
    `];T([h({attribute:!1})],w.prototype,"settings",2);T([h({attribute:!1})],w.prototype,"tabs",2);T([h({attribute:!1})],w.prototype,"t",2);T([h({attribute:!1})],w.prototype,"onChange",2);T([h({attribute:!1})],w.prototype,"onReset",2);T([h({type:Boolean})],w.prototype,"light",2);T([y()],w.prototype,"transferOpen",2);T([y()],w.prototype,"transferText",2);T([y()],w.prototype,"transferBad",2);w=T([b("mk-view-settings")],w);var Vs=Object.defineProperty,Ws=Object.getOwnPropertyDescriptor,j=(e,t,s,a)=>{for(var n=a>1?void 0:a?Ws(t,s):t,i=e.length-1,r;i>=0;i--)(r=e[i])&&(n=(a?r(t,s,n):r(n))||n);return a&&n&&Vs(t,s,n),n};const vt=["core","cells","packs","solar","energy","control","system"],Ks={cells:"battery_1_max_cell_voltage",packs:"battery_soc_1",solar:"mppt1_power",control:"set_charge_power"},ue="marstek-panel.device",fe="marstek-panel.tab";let O=class extends k{constructor(){super(...arguments),this.narrow=!1,this.settings=Is(),this.tab="core",this.showSettings=!1,this.strings=at,this.deviceId=Gs(),this.catalogueFor="",this.appearanceFor="",this.formatter=new Yt("en"),this.t=(e,t)=>Ye(this.strings,e,t)}connectedCallback(){super.connectedCallback(),this.tab=this.startingTab()}willUpdate(e){if(!this.hass||!e.has("hass")&&!e.has("settings"))return;this.applyAppearance();const t=this.hass.language||"en",s=this.settings.extraDigits?1:0;(t!==this.catalogueFor||this.formatter.extraDigits!==s)&&(this.formatter=new Yt(t,s)),t!==this.catalogueFor&&(this.catalogueFor=t,Ge(t).then(a=>{this.catalogueFor===t&&(this.strings=a)}))}applyAppearance(){const e=this.settings.mode,t=e==="auto"?!this.hass.themes?.darkMode:e==="light",s=`${this.settings.scheme}/${t}`;s!==this.appearanceFor&&(this.appearanceFor=s,this.toggleAttribute("light",t),zs(this,this.settings.scheme,t))}startingTab(){const e=this.settings.startTab==="last"?qs():this.settings.startTab;return vt.includes(e)?e:"core"}update_(e){this.settings={...this.settings,...e},Ls(this.settings)}resetSettings(){Hs(),this.settings={...H}}openTab(e){this.tab=e,this.showSettings=!1;try{localStorage.setItem(fe,e)}catch{}}selectDevice(e){this.deviceId=e;try{localStorage.setItem(ue,e)}catch{}}tabsFor(e){return vt.filter(t=>this.supports(e,t)&&(t==="core"||!this.settings.hiddenTabs.includes(t)))}supports(e,t){const s=Ks[t];return!s||e.entityId(s)!==void 0}tabChoices(e){return vt.map(t=>({id:t,label:this.t(`tab.${t}`),available:this.supports(e,t)}))}get devices(){return this.hass?He(this.hass):[]}get device(){const e=this.devices;return e.length?e.find(t=>t.deviceId===this.deviceId)??e[0]:null}render(){if(!this.hass)return p;const e=this.device;if(!e)return l`
        <div class="shell">
          <div class="empty">
            <h2>${this.t("empty.no_device")}</h2>
            <p>${this.t("empty.no_device_hint")}</p>
          </div>
        </div>
      `;const t=new Be(this.hass,e),s=this.tabsFor(t),a=s.includes(this.tab)?this.tab:s[0];return l`
      <div class="shell">
        <header>
          <div class="brand">
            ${/^marstek/i.test(e.name)?l`<em>${e.name}</em>`:l`MARSTEK <em>${e.name}</em>`}
          </div>
          <nav role="tablist" aria-label="Marstek Venus">
            ${s.map(n=>l`
                <button
                  class="tab"
                  role="tab"
                  aria-selected=${!this.showSettings&&a===n}
                  @click=${()=>this.openTab(n)}
                  @keydown=${i=>this.onTabKey(i,n,s)}
                >
                  ${this.t(`tab.${n}`)}
                </button>
              `)}
          </nav>
          ${this.statusBar(t)}
        </header>

        <main>
          ${this.showSettings?l`<mk-view-settings
                .settings=${this.settings}
                .tabs=${this.tabChoices(t)}
                .t=${this.t}
                .onChange=${n=>this.update_(n)}
                .onReset=${()=>this.resetSettings()}
                ?light=${this.hasAttribute("light")}
              ></mk-view-settings>`:this.renderTab(t,a)}
        </main>
      </div>
    `}onTabKey(e,t,s){const a=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0;if(!a)return;e.preventDefault();const n=s[(s.indexOf(t)+a+s.length)%s.length];this.tab=n,this.renderRoot.querySelectorAll("button.tab")[s.indexOf(n)]?.focus()}statusBar(e){const t=this.devices,s=this.device?.deviceId,a=e.num("wifi_signal_strength");return l`
      <div class="status">
        ${t.length>1?l`
              <select
                aria-label=${this.t("common.device")}
                @change=${n=>this.selectDevice(n.target.value)}
              >
                ${t.map(n=>l`
                    <option value=${n.deviceId} ?selected=${n.deviceId===s}>
                      ${n.name}
                    </option>
                  `)}
              </select>
            `:p}
        <span>
          <i class="led ${e.has("battery_soc")?"on":"off"}"></i>
          ${this.t("status.modbus")}
        </span>
        ${a===null?p:l`<span>
              <i class="led on"></i>${this.t("status.wifi")}
              ${this.formatter.num(a,0)} dBm
            </span>`}
        ${e.str("inverter_state")?l`<span>${e.str("inverter_state")}</span>`:p}
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
    `}floorPercent(e){const t=e.num("stored_energy"),s=e.num("usable_energy"),a=e.num("battery_total_energy");if(t===null||s===null||!a)return null;const n=(t-s)/a*100;return n>=0&&n<=100?n:null}renderTab(e,t){const s={reader:e,fmt:this.formatter,t:this.t};switch(t){case"cells":return l`<mk-view-cells
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
        ></mk-view-cells>`;case"packs":return l`<mk-view-packs
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
          .floor=${this.floorPercent(e)}
        ></mk-view-packs>`;case"solar":return l`<mk-view-solar
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
        ></mk-view-solar>`;case"energy":return l`<mk-view-energy
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
        ></mk-view-energy>`;case"control":return l`<mk-view-control
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
          .controls=${new Fe(this.hass,e)}
        ></mk-view-control>`;case"system":return l`<mk-view-system
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
        ></mk-view-system>`;default:return l`<mk-view-core
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
        ></mk-view-core>`}}};O.styles=[Ue,v,g`
      :host {
        min-height: 100vh;
        background: var(--mk-bg);
      }

      .shell {
        max-width: 1440px;
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

      nav {
        display: flex;
        gap: 1px;
      }
      button.tab {
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
    `];j([h({attribute:!1})],O.prototype,"hass",2);j([h({type:Boolean})],O.prototype,"narrow",2);j([y()],O.prototype,"settings",2);j([y()],O.prototype,"tab",2);j([y()],O.prototype,"showSettings",2);j([y()],O.prototype,"strings",2);j([y()],O.prototype,"deviceId",2);O=j([b("marstek-modbus-panel")],O);function qs(){try{return localStorage.getItem(fe)}catch{return null}}function Gs(){try{return localStorage.getItem(ue)}catch{return null}}
