/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const it=globalThis,kt=it.ShadowRoot&&(it.ShadyCSS===void 0||it.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,yt=Symbol(),Et=new WeakMap;let Yt=class{constructor(t,e,a){if(this._$cssResult$=!0,a!==yt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(kt&&t===void 0){const a=e!==void 0&&e.length===1;a&&(t=Et.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),a&&Et.set(e,t))}return t}toString(){return this.cssText}};const se=s=>new Yt(typeof s=="string"?s:s+"",void 0,yt),f=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((a,n,i)=>a+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+s[i+1],s[0]);return new Yt(e,s,yt)},ae=(s,t)=>{if(kt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const a=document.createElement("style"),n=it.litNonce;n!==void 0&&a.setAttribute("nonce",n),a.textContent=e.cssText,s.appendChild(a)}},Ot=kt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const a of t.cssRules)e+=a.cssText;return se(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ne,defineProperty:ie,getOwnPropertyDescriptor:re,getOwnPropertyNames:oe,getOwnPropertySymbols:le,getPrototypeOf:ce}=Object,ct=globalThis,Mt=ct.trustedTypes,de=Mt?Mt.emptyScript:"",pe=ct.reactiveElementPolyfillSupport,Z=(s,t)=>s,rt={toAttribute(s,t){switch(t){case Boolean:s=s?de:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},xt=(s,t)=>!ne(s,t),Tt={attribute:!0,type:String,converter:rt,reflect:!1,useDefault:!1,hasChanged:xt};Symbol.metadata??=Symbol("metadata"),ct.litPropertyMetadata??=new WeakMap;let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Tt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const a=Symbol(),n=this.getPropertyDescriptor(t,a,e);n!==void 0&&ie(this.prototype,t,n)}}static getPropertyDescriptor(t,e,a){const{get:n,set:i}=re(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:n,set(r){const o=n?.call(this);i?.call(this,r),this.requestUpdate(t,o,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Tt}static _$Ei(){if(this.hasOwnProperty(Z("elementProperties")))return;const t=ce(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Z("properties"))){const e=this.properties,a=[...oe(e),...le(e)];for(const n of a)this.createProperty(n,e[n])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[a,n]of e)this.elementProperties.set(a,n)}this._$Eh=new Map;for(const[e,a]of this.elementProperties){const n=this._$Eu(e,a);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const a=new Set(t.flat(1/0).reverse());for(const n of a)e.unshift(Ot(n))}else t!==void 0&&e.push(Ot(t));return e}static _$Eu(t,e){const a=e.attribute;return a===!1?void 0:typeof a=="string"?a:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const a of e.keys())this.hasOwnProperty(a)&&(t.set(a,this[a]),delete this[a]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ae(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,a){this._$AK(t,a)}_$ET(t,e){const a=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,a);if(n!==void 0&&a.reflect===!0){const i=(a.converter?.toAttribute!==void 0?a.converter:rt).toAttribute(e,a.type);this._$Em=t,i==null?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(t,e){const a=this.constructor,n=a._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const i=a.getPropertyOptions(n),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:rt;this._$Em=n;const o=r.fromAttribute(e,i.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(t,e,a,n=!1,i){if(t!==void 0){const r=this.constructor;if(n===!1&&(i=this[t]),a??=r.getPropertyOptions(t),!((a.hasChanged??xt)(i,e)||a.useDefault&&a.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,a))))return;this.C(t,e,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:a,reflect:n,wrapped:i},r){a&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),i!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||a||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[n,i]of this._$Ep)this[n]=i;this._$Ep=void 0}const a=this.constructor.elementProperties;if(a.size>0)for(const[n,i]of a){const{wrapped:r}=i,o=this[n];r!==!0||this._$AL.has(n)||o===void 0||this.C(n,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(e)):this._$EM()}catch(a){throw t=!1,this._$EM(),a}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[Z("elementProperties")]=new Map,W[Z("finalized")]=new Map,pe?.({ReactiveElement:W}),(ct.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis,Nt=s=>s,ot=wt.trustedTypes,Dt=ot?ot.createPolicy("lit-html",{createHTML:s=>s}):void 0,Gt="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Zt="?"+M,he=`<${Zt}>`,U=document,J=()=>U.createComment(""),Q=s=>s===null||typeof s!="object"&&typeof s!="function",St=Array.isArray,me=s=>St(s)||typeof s?.[Symbol.iterator]=="function",mt=`[ 	
\f\r]`,Y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Rt=/-->/g,zt=/>/g,R=RegExp(`>|${mt}(?:([^\\s"'>=/]+)(${mt}*=${mt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ut=/'/g,jt=/"/g,Jt=/^(?:script|style|textarea|title)$/i,Qt=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),c=Qt(1),It=Qt(2),H=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Lt=new WeakMap,z=U.createTreeWalker(U,129);function Xt(s,t){if(!St(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Dt!==void 0?Dt.createHTML(t):t}const ue=(s,t)=>{const e=s.length-1,a=[];let n,i=t===2?"<svg>":t===3?"<math>":"",r=Y;for(let o=0;o<e;o++){const l=s[o];let d,u,m=-1,v=0;for(;v<l.length&&(r.lastIndex=v,u=r.exec(l),u!==null);)v=r.lastIndex,r===Y?u[1]==="!--"?r=Rt:u[1]!==void 0?r=zt:u[2]!==void 0?(Jt.test(u[2])&&(n=RegExp("</"+u[2],"g")),r=R):u[3]!==void 0&&(r=R):r===R?u[0]===">"?(r=n??Y,m=-1):u[1]===void 0?m=-2:(m=r.lastIndex-u[2].length,d=u[1],r=u[3]===void 0?R:u[3]==='"'?jt:Ut):r===jt||r===Ut?r=R:r===Rt||r===zt?r=Y:(r=R,n=void 0);const b=r===R&&s[o+1].startsWith("/>")?" ":"";i+=r===Y?l+he:m>=0?(a.push(d),l.slice(0,m)+Gt+l.slice(m)+M+b):l+M+(m===-2?o:b)}return[Xt(s,i+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),a]};class X{constructor({strings:t,_$litType$:e},a){let n;this.parts=[];let i=0,r=0;const o=t.length-1,l=this.parts,[d,u]=ue(t,e);if(this.el=X.createElement(d,a),z.currentNode=this.el.content,e===2||e===3){const m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(n=z.nextNode())!==null&&l.length<o;){if(n.nodeType===1){if(n.hasAttributes())for(const m of n.getAttributeNames())if(m.endsWith(Gt)){const v=u[r++],b=n.getAttribute(m).split(M),V=/([.?@])?(.*)/.exec(v);l.push({type:1,index:i,name:V[2],strings:b,ctor:V[1]==="."?fe:V[1]==="?"?ge:V[1]==="@"?be:dt}),n.removeAttribute(m)}else m.startsWith(M)&&(l.push({type:6,index:i}),n.removeAttribute(m));if(Jt.test(n.tagName)){const m=n.textContent.split(M),v=m.length-1;if(v>0){n.textContent=ot?ot.emptyScript:"";for(let b=0;b<v;b++)n.append(m[b],J()),z.nextNode(),l.push({type:2,index:++i});n.append(m[v],J())}}}else if(n.nodeType===8)if(n.data===Zt)l.push({type:2,index:i});else{let m=-1;for(;(m=n.data.indexOf(M,m+1))!==-1;)l.push({type:7,index:i}),m+=M.length-1}i++}}static createElement(t,e){const a=U.createElement("template");return a.innerHTML=t,a}}function B(s,t,e=s,a){if(t===H)return t;let n=a!==void 0?e._$Co?.[a]:e._$Cl;const i=Q(t)?void 0:t._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(s),n._$AT(s,e,a)),a!==void 0?(e._$Co??=[])[a]=n:e._$Cl=n),n!==void 0&&(t=B(s,n._$AS(s,t.values),n,a)),t}class ve{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:a}=this._$AD,n=(t?.creationScope??U).importNode(e,!0);z.currentNode=n;let i=z.nextNode(),r=0,o=0,l=a[0];for(;l!==void 0;){if(r===l.index){let d;l.type===2?d=new et(i,i.nextSibling,this,t):l.type===1?d=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(d=new $e(i,this,t)),this._$AV.push(d),l=a[++o]}r!==l?.index&&(i=z.nextNode(),r++)}return z.currentNode=U,n}p(t){let e=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(t,a,e),e+=a.strings.length-2):a._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,a,n){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=a,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=B(this,t,e),Q(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==H&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):me(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&Q(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:a}=t,n=typeof a=="number"?this._$AC(t):(a.el===void 0&&(a.el=X.createElement(Xt(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===n)this._$AH.p(e);else{const i=new ve(n,this),r=i.u(this.options);i.p(e),this.T(r),this._$AH=i}}_$AC(t){let e=Lt.get(t.strings);return e===void 0&&Lt.set(t.strings,e=new X(t)),e}k(t){St(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let a,n=0;for(const i of t)n===e.length?e.push(a=new et(this.O(J()),this.O(J()),this,this.options)):a=e[n],a._$AI(i),n++;n<e.length&&(this._$AR(a&&a._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const a=Nt(t).nextSibling;Nt(t).remove(),t=a}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,a,n,i){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=i,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=p}_$AI(t,e=this,a,n){const i=this.strings;let r=!1;if(i===void 0)t=B(this,t,e,0),r=!Q(t)||t!==this._$AH&&t!==H,r&&(this._$AH=t);else{const o=t;let l,d;for(t=i[0],l=0;l<i.length-1;l++)d=B(this,o[a+l],e,l),d===H&&(d=this._$AH[l]),r||=!Q(d)||d!==this._$AH[l],d===p?t=p:t!==p&&(t+=(d??"")+i[l+1]),this._$AH[l]=d}r&&!n&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class fe extends dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}}class ge extends dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}}class be extends dt{constructor(t,e,a,n,i){super(t,e,a,n,i),this.type=5}_$AI(t,e=this){if((t=B(this,t,e,0)??p)===H)return;const a=this._$AH,n=t===p&&a!==p||t.capture!==a.capture||t.once!==a.once||t.passive!==a.passive,i=t!==p&&(a===p||n);n&&this.element.removeEventListener(this.name,this,a),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class $e{constructor(t,e,a){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(t){B(this,t)}}const _e=wt.litHtmlPolyfillSupport;_e?.(X,et),(wt.litHtmlVersions??=[]).push("3.3.3");const ke=(s,t,e)=>{const a=e?.renderBefore??t;let n=a._$litPart$;if(n===void 0){const i=e?.renderBefore??null;a._$litPart$=n=new et(t.insertBefore(J(),i),i,void 0,e??{})}return n._$AI(s),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const At=globalThis;class _ extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ke(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H}}_._$litElement$=!0,_.finalized=!0,At.litElementHydrateSupport?.({LitElement:_});const ye=At.litElementPolyfillSupport;ye?.({LitElement:_});(At.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $=s=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(s,t)}):customElements.define(s,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xe={attribute:!0,type:String,converter:rt,reflect:!1,hasChanged:xt},we=(s=xe,t,e)=>{const{kind:a,metadata:n}=e;let i=globalThis.litPropertyMetadata.get(n);if(i===void 0&&globalThis.litPropertyMetadata.set(n,i=new Map),a==="setter"&&((s=Object.create(s)).wrapped=!0),i.set(e.name,s),a==="accessor"){const{name:r}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(r,l,s,!0,o)},init(o){return o!==void 0&&this.C(r,void 0,s,o),o}}}if(a==="setter"){const{name:r}=e;return function(o){const l=this[r];t.call(this,o),this.requestUpdate(r,l,s,!0,o)}}throw Error("Unsupported decorator location: "+a)};function h(s){return(t,e)=>typeof e=="object"?we(s,t,e):((a,n,i)=>{const r=n.hasOwnProperty(i);return n.constructor.createProperty(i,a),r?Object.getOwnPropertyDescriptor(n,i):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function E(s){return h({...s,state:!0,attribute:!1})}const Se=f`
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
`,g=f`
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
`,Ae="marstek_modbus";function Pe(s){const t=new Map;for(const e of Object.values(s.entities)){if(e.platform!==Ae||!e.device_id||!e.translation_key)continue;let a=t.get(e.device_id);if(!a){const n=s.devices[e.device_id];a={deviceId:e.device_id,name:n?.name_by_user||n?.name||"Marstek Venus",byKey:{}},t.set(e.device_id,a)}a.byKey[e.translation_key]=e.entity_id}return[...t.values()].sort((e,a)=>e.name.localeCompare(a.name))}class Ce{constructor(t,e){this.hass=t,this.device=e}get name(){return this.device.name}entityId(t){return this.device.byKey[t]}has(t){return this.state(t)!==null}state(t){const e=this.device.byKey[t];if(!e)return null;const a=this.hass.states[e];return!a||a.state==="unavailable"||a.state==="unknown"?null:a}num(t){const e=this.state(t);if(!e)return null;const a=Number(e.state);return Number.isFinite(a)?a:null}str(t){return this.state(t)?.state??null}unit(t){return this.state(t)?.attributes.unit_of_measurement??""}rawState(t){const e=this.device.byKey[t];return e&&this.hass.states[e]||null}attr(t,e,a){return this.rawState(t)?.attributes[e]??a}writable(t){const e=this.rawState(t);return!!e&&e.state!=="unavailable"}label(t){const e=this.hass.states[this.device.byKey[t]??""]?.attributes.friendly_name;if(!e)return t;const a=this.device.name;return a&&e.startsWith(a)&&e.length>a.length+1?e.slice(a.length).trim():e}sum(t){let e=0,a=!1;for(const n of t){const i=this.num(n);i!==null&&(e+=i,a=!0)}return a?e:null}packCount(){let t=0;for(;this.device.byKey[`battery_${t+1}_max_cell_voltage`];)t++;return t}}class Ee{constructor(t,e){this.hass=t,this.reader=e}call(t,e,a,n){const i=this.reader.entityId(a);i&&this.hass.callService(t,e,{entity_id:i,...n})}setNumber(t,e){this.call("number","set_value",t,{value:e})}selectOption(t,e){this.call("select","select_option",t,{option:e})}setSwitch(t,e){this.call("switch",e?"turn_on":"turn_off",t,{})}press(t){this.call("button","press",t,{})}}const Oe="modulepreload",Me=function(s){return"/"+s},Vt={},Te=function(t,e,a){let n=Promise.resolve();if(e&&e.length>0){let r=function(d){return Promise.all(d.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");n=r(e.map(d=>{if(d=Me(d),d in Vt)return;Vt[d]=!0;const u=d.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${m}`))return;const v=document.createElement("link");if(v.rel=u?"stylesheet":Oe,u||(v.as="script"),v.crossOrigin="",v.href=d,l&&v.setAttribute("nonce",l),document.head.appendChild(v),u)return new Promise((b,V)=>{v.addEventListener("load",b),v.addEventListener("error",()=>V(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(r){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=r,window.dispatchEvent(o),!o.defaultPrevented)throw r}return n.then(r=>{for(const o of r||[])o.status==="rejected"&&i(o.reason);return t().catch(i)})},tt={"tab.core":"OVERVIEW","tab.cells":"CELLS","tab.packs":"PACKS","tab.solar":"SOLAR","tab.energy":"ENERGY","tab.system":"SYSTEM","tab.control":"CONTROL","control.power":"Power now","control.power_hint":"These two set the working point directly. Anything that regulates the battery from outside — a zero-feed-in automation, an energy manager — writes the same registers and will win within seconds.","control.limits":"Limits","control.mode":"Mode","control.backup_hint":"Keeps a reserve for the off-grid output.","control.rs485_hint":"Switching this off hands control back to the device, and this page stops having any effect.","control.overwritten":"Something else changed {names} right after this panel did. An external controller is writing the same registers.","control.schedules":"Schedules","control.schedules_axis":"times are the device's own, in its local time","control.schedules_hint":"A schedule needs a window, a power and a day before switching it on does anything. Power is signed: the sign decides the direction. The device takes one day per schedule, not a set of them.","control.no_schedules":"This battery exposes no schedules.","control.window":"Window","control.sched_power":"Power","control.days":"Day","control.active":"On","control.unset":"not set","control.device":"Device","control.reset":"Restart device","control.reset_confirm":"Really restart","control.cancel":"Cancel","control.reset_hint":"Reconnects after a few seconds. A factory reset is deliberately not offered here — it is in the entity list.","control.opt.manual":"Manual","control.opt.anti_feed":"Anti-feed","control.opt.trade_mode":"Trade","control.opt.standby":"Standby","control.opt.charge":"Charge","control.opt.discharge":"Discharge","control.day.monday":"Mon","control.day.tuesday":"Tue","control.day.wednesday":"Wed","control.day.thursday":"Thu","control.day.friday":"Fri","control.day.saturday":"Sat","control.day.sunday":"Sun","status.modbus":"MODBUS","status.wifi":"WIFI","common.pack":"PACK","common.device":"Device","core.electrical":"Electrical · now","core.reserve":"Reserve · lifetime","core.stored":"Stored","core.capacity":"Capacity","core.soc_bms":"SOC · BMS","core.soc_usable":"usable {value} %","core.discharging_to_house":"discharging","core.charging_from_grid":"charging","core.at_rest":"at rest","core.today_charged":"Charged today","core.today_discharged":"Discharged today","core.cell_delta":"Cell delta","core.internal_temp":"Internal temperature","core.mppt_total":"MPPT total","core.pack_spread":"across {count} packs","core.no_delta":"no per-pack readings","cells.highest":"Highest cell","cells.lowest":"Lowest cell","cells.in_pack":"pack {pack}","cells.stack_spread":"Spread across stack","cells.limit_hint":"100 mV is the usual limit","cells.mean_delta":"Mean delta in pack","cells.worst_pack":"widest: pack {pack}, {value} mV","cells.temp_span":"Cell temperature span","cells.packs_online":"Packs reporting","cells.cells_total":"{count} cells","cells.matrix_title":"Cell voltage range per pack · shared axis","cells.matrix_axis":"bar = lowest to highest cell","cells.matrix_legend":"The tick inside each bar is the pack's midpoint. A narrow bar is a balanced pack, a wide one is drift inside it, and a bar sitting apart from the others is a pack at a different level than the rest.","cells.no_ranges":"This battery reports no per-pack cell voltages.","cells.protection":"Protection and faults","cells.protection_all":"Protection · all {count} packs","cells.clear":"clear","cells.raised":"raised","cells.bms":"BMS","cells.bms_version":"BMS version","cells.uniform":"same on every pack","packs.device_reading":"as the device reports it","packs.mean_soc":"Mean of the packs","packs.from_n_packs":"from {count} packs","packs.spread":"Spread","packs.stored_total":"Stored energy","packs.summed":"packs add up to {value} kWh","packs.per_pack":"Per pack","packs.nominal":"nominal, capacity ÷ packs","packs.cycles_sum":"Cycles, all packs","packs.cycles_partial":"{have} of {total} packs report","packs.fill_title":"State of charge per pack","packs.fill_axis":"column height = SOC · figure inside = kWh","packs.fill_legend":"The dashed line marks the discharge floor at {floor} %. Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.","packs.fill_legend_nofloor":"Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.","packs.none":"This battery reports no per-pack state of charge.","packs.table_title":"Every pack in detail","packs.table_legend":"Highlighted rows sit more than 5 points away from the median pack. A pack that reports a high SOC at a low cell voltage is worth a second look: the two readings disagree.","packs.col_soc":"SOC","packs.col_energy":"kWh","packs.col_min":"Cell min","packs.col_max":"Cell max","packs.col_delta":"Delta","packs.col_voltage":"Voltage","packs.col_current":"Current","packs.col_cycles":"Cycles","packs.col_mos":"MOSFET","packs.col_env":"Ambient","packs.col_ntc":"NTC 1–4","solar.active":"ACTIVE","solar.floating":"FLOATING","solar.summary":"All inputs","solar.some_active":"carrying power","solar.all_idle":"nothing connected","solar.note_active":"Voltage follows the panels and power follows the sun through the day.","solar.note_floating":"All inputs sit at a low voltage without current, which is what an unused MPPT input looks like. Connect panels and the voltage rises to module level.","solar.diagnostics":"Diagnostics","solar.channels_reporting":"Inputs reporting","solar.none":"This battery has no MPPT inputs.","energy.today":"Today","energy.month":"This month","energy.lifetime":"Since commissioning","energy.charged":"charged kWh","energy.discharged":"discharged kWh","energy.loss":"Loss","energy.returned":"Returned","energy.rte":"Round trip","energy.rte_hint":"Round-trip efficiency is how much of the energy put into the battery comes back out of it. Conversion efficiency is the loss in the moment, at the current operating point.","energy.efficiency":"Efficiency compared","energy.throughput":"Throughput and wear","energy.gap_hint":"The monthly figure sits {value} points below the lifetime one. That gap is not conversion loss but standby draw between cycles: the shallower the cycling, the heavier it weighs.","system.no_faults":"No fault register is raised.","system.faults_raised":"Raised: {list}","system.device":"Device","system.packs":"Battery packs","system.firmware":"Firmware","system.connection":"Connection","system.faults":"Fault registers","system.control":"Control and limits","system.thermal":"Thermal and electrical","system.ceiling_used":"The panel treats {value} % as the charge ceiling, read from this register.","system.ceiling_ignored":"This register reads {value} %, outside its own 10-100 range, so the device is not using it. The panel charges towards 100 % instead.","empty.no_device":"No Marstek battery found","empty.no_device_hint":"This panel reads the Marstek Modbus Suite integration. Add a battery there first.","common.unavailable":"—"},te={de:()=>Te(()=>import("./marstek-modbus-lang-de.js"),[]).then(s=>s.de)};["en",...Object.keys(te)].sort();const at={en:tt};function Ne(s){return s.split("-")[0].toLowerCase()}async function De(s){const t=Ne(s);if(at[t])return at[t];const e=te[t];if(!e)return tt;try{return at[t]=await e(),at[t]}catch{return tt}}function Re(s,t,e){let a=s[t]??tt[t]??t;if(e)for(const[n,i]of Object.entries(e))a=a.replace(`{${n}}`,String(i));return a}const nt="—";class Wt{constructor(t){this.language=t,this.cache=new Map}formatter(t){const e=String(t);let a=this.cache.get(e);return a||(a=new Intl.NumberFormat(this.language||"en",{minimumFractionDigits:t,maximumFractionDigits:t}),this.cache.set(e,a)),a}num(t,e=0){return t==null||!Number.isFinite(t)?nt:this.formatter(e).format(t)}signed(t,e=0){if(t==null||!Number.isFinite(t))return nt;const a=this.formatter(e).format(Math.abs(t));return t>0?`+${a}`:t<0?`−${a}`:a}version(t){return t==null||t===""?nt:/^\d{4}$/.test(t)?`${t.slice(0,3)}.${t.slice(3)}`:t}millivolts(t){return t==null||!Number.isFinite(t)?nt:this.formatter(0).format(Math.round(t*1e3))}}var ze=Object.defineProperty,Pt=(s,t,e,a)=>{for(var n=void 0,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=r(t,e,n)||n);return n&&ze(t,e,n),n};const Ct=class Ct extends _{kv(t,e=1,a={}){const n=this.reader;if(!n.entityId(t))return p;const i=n.state(t);if(!i)return p;if(a.version)return c`
        <div class="kv">
          <span>${a.label??n.label(t)}</span>
          <b class=${a.tone??""}>${this.fmt.version(i.state)}</b>
        </div>
      `;const r=a.raw?null:n.num(t),o=n.unit(t),l=r===null?i.state:`${this.fmt.num(r,e)}${o?` ${o}`:""}`;return c`
      <div class="kv">
        <span>${a.label??n.label(t)}</span>
        <b class=${a.tone??""}>${l}</b>
      </div>
    `}row(t,e,a=""){return c`
      <div class="kv">
        <span>${t}</span>
        <b class=${a}>${e}</b>
      </div>
    `}get packs(){return Array.from({length:this.reader.packCount()},(t,e)=>e+1)}};Ct.styles=[g];let y=Ct;Pt([h({attribute:!1})],y.prototype,"reader");Pt([h({attribute:!1})],y.prototype,"fmt");Pt([h({attribute:!1})],y.prototype,"t");var Ue=Object.defineProperty,je=Object.getOwnPropertyDescriptor,st=(s,t,e,a)=>{for(var n=a>1?void 0:a?je(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=(a?r(t,e,n):r(n))||n);return a&&n&&Ue(t,e,n),n};const ut=118,vt=97,Ie=2*Math.PI*ut,Le=2*Math.PI*vt;let j=class extends _{constructor(){super(...arguments),this.soc=null,this.usable=null,this.caption="",this.sub=""}arc(s,t){const e=s===null?0:Math.min(Math.max(s,0),100);return`${t*e/100} ${t}`}render(){const s=this.soc===null?"—":Math.round(this.soc).toString();return c`
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

        <circle class="track" cx="150" cy="134" r=${ut} stroke-width="15" />
        <circle
          class="arc-outer"
          cx="150"
          cy="134"
          r=${ut}
          stroke-width="15"
          stroke-dasharray=${this.arc(this.soc,Ie)}
          transform="rotate(-90 150 134)"
        />

        ${this.usable===null?p:It`
              <circle class="track" cx="150" cy="134" r=${vt} stroke-width="5" />
              <circle
                class="arc-inner"
                cx="150" cy="134" r=${vt} stroke-width="5"
                stroke-dasharray=${this.arc(this.usable,Le)}
                transform="rotate(-90 150 134)"
              />
            `}

        <text class="num" x="146" y="132" text-anchor="middle">${s}</text>
        <text class="pct" x="196" y="132" text-anchor="start">%</text>
        <text class="cap" x="150" y="158" text-anchor="middle">${this.caption}</text>
        ${this.sub?It`<text class="sub" x="150" y="186" text-anchor="middle">${this.sub}</text>`:p}
      </svg>
    `}};j.styles=[g,f`
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
    `];st([h({type:Number})],j.prototype,"soc",2);st([h({type:Number})],j.prototype,"usable",2);st([h({type:String})],j.prototype,"caption",2);st([h({type:String})],j.prototype,"sub",2);j=st([$("mk-gauge")],j);var Ve=Object.defineProperty,We=Object.getOwnPropertyDescriptor,N=(s,t,e,a)=>{for(var n=a>1?void 0:a?We(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=(a?r(t,e,n):r(n))||n);return a&&n&&Ve(t,e,n),n};let S=class extends _{constructor(){super(...arguments),this.label="",this.value="—",this.unit="",this.foot="",this.tone="",this.bar=null,this.max=null}get fill(){return this.bar===null||this.max===null||this.max===0?null:Math.min(Math.max(this.bar/this.max*100,0),100)}render(){const s=this.fill;return c`
      <div class="label">${this.label}</div>
      <div class="num ${this.tone}">
        ${this.value}${this.unit?c`<span class="unit">${this.unit}</span>`:p}
      </div>
      ${s===null?p:c`<div class="track"><i style="width:${s}%"></i></div>`}
      ${this.foot?c`<div class="foot">${this.foot}</div>`:p}
    `}};S.styles=[g,f`
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
    `];N([h({type:String})],S.prototype,"label",2);N([h({type:String})],S.prototype,"value",2);N([h({type:String})],S.prototype,"unit",2);N([h({type:String})],S.prototype,"foot",2);N([h({type:String})],S.prototype,"tone",2);N([h({type:Number})],S.prototype,"bar",2);N([h({type:Number})],S.prototype,"max",2);S=N([$("mk-stat")],S);var He=Object.getOwnPropertyDescriptor,Be=(s,t,e,a)=>{for(var n=a>1?void 0:a?He(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=r(n)||n);return n};const Fe=30;let ft=class extends y{render(){const s=this.reader,t=this.fmt,e=this.t,a=s.num("battery_soc"),n=s.num("battery_total_energy"),i=s.num("stored_energy"),r=s.num("battery_power"),o=s.num("usable_energy"),l=o!==null&&n?o/n*100:null,d=r!==null&&Math.abs(r)>Fe,u=d&&r<0;return c`
      <div class="top">
        <div class="panel">
          <div class="label" style="margin-bottom:12px">${e("core.electrical")}</div>
          ${this.kv("ac_power",0)} ${this.kv("battery_power",0)}
          ${this.kv("battery_voltage",1)} ${this.kv("battery_current",1)}
          ${this.kv("ac_voltage",1)} ${this.kv("ac_frequency",1)}
          ${this.kv("conversion_efficiency",1)}
        </div>

        <div class="centre">
          <mk-gauge
            .soc=${a}
            .usable=${l}
            caption=${e("core.soc_bms")}
            sub=${l===null?"":e("core.soc_usable",{value:t.num(l,1)})}
          ></mk-gauge>

          <div class="split">
            <div>
              <div class="label">${e("core.stored")}</div>
              <div class="value">
                ${t.num(i,2)}<span class="unit">kWh</span>
              </div>
            </div>
            <div>
              <div class="label">${e("core.capacity")}</div>
              <div class="value" style="color:var(--mk-fg-2)">
                ${t.num(n,2)}<span class="unit">kWh</span>
              </div>
            </div>
            <div>
              <div class="label">${s.label("runtime_to_empty")}</div>
              <div class="value">
                ${t.num(s.num("runtime_to_empty"),1)}<span class="unit">h</span>
              </div>
            </div>
          </div>

          <div
            class="flow ${d?"":"rest"}"
            style=${d?`color: var(${u?"--mk-magenta":"--mk-accent"})`:""}
          >
            ${d?u?"▼":"▲":"•"}
            ${t.num(r===null?null:Math.abs(r),0)} W
          </div>
          <div class="label" style="margin-top:2px">
            ${e(d?u?"core.discharging_to_house":"core.charging_from_grid":"core.at_rest")}
            ${s.str("inverter_state")?` · ${s.str("inverter_state")}`:""}
          </div>
        </div>

        <div class="panel">
          <div class="label" style="margin-bottom:12px">${e("core.reserve")}</div>
          ${this.kv("usable_energy",2)} ${this.kv("energy_to_full",2)}
          ${this.kv("runtime_to_full",1)} ${this.kv("battery_cycle_count_calc",2)}
          ${this.kv("battery_cycle_count",0)} ${this.kv("remaining_cycles",0)}
          ${this.kv("battery_health",2)}
        </div>
      </div>

      <div class="grid tiles">
        <mk-stat
          label=${e("core.today_charged")}
          value=${t.num(s.num("total_daily_charging_energy"),2)}
          unit="kWh"
        ></mk-stat>
        <mk-stat
          label=${e("core.today_discharged")}
          value=${t.num(s.num("total_daily_discharging_energy"),2)}
          unit="kWh"
          tone="magenta"
        ></mk-stat>
        ${this.deltaTile()}
        <mk-stat
          label=${e("core.internal_temp")}
          value=${t.num(s.num("internal_temperature"),1)}
          unit="°C"
          tone="ok"
        ></mk-stat>
        <mk-stat
          label=${e("core.mppt_total")}
          value=${t.num(s.sum(["mppt1_power","mppt2_power","mppt3_power","mppt4_power"]),0)}
          unit="W"
        ></mk-stat>
        <mk-stat
          label=${s.label("round_trip_efficiency_total")}
          value=${t.num(s.num("round_trip_efficiency_total"),1)}
          unit="%"
          .bar=${s.num("round_trip_efficiency_total")}
          .max=${100}
        ></mk-stat>
      </div>
    `}deltaTile(){const s=this.reader,t=s.packCount(),e=[],a=[];for(let r=1;r<=t;r++){const o=s.num(`battery_${r}_max_cell_voltage`),l=s.num(`battery_${r}_min_cell_voltage`);o!==null&&e.push(o),l!==null&&a.push(l)}const n=e.length&&a.length?Math.max(...e)-Math.min(...a):null,i=n===null?"":n>.1?"crit":n>.05?"warn":"ok";return c`
      <mk-stat
        label=${this.t("core.cell_delta")}
        value=${this.fmt.millivolts(n)}
        unit="mV"
        tone=${i}
        .bar=${n}
        .max=${.1}
        foot=${t?this.t("core.pack_spread",{count:t}):this.t("core.no_delta")}
      ></mk-stat>
    `}};ft.styles=[g,f`
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
    `];ft=Be([$("mk-view-core")],ft);var Ke=Object.defineProperty,qe=Object.getOwnPropertyDescriptor,pt=(s,t,e,a)=>{for(var n=a>1?void 0:a?qe(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=(a?r(t,e,n):r(n))||n);return a&&n&&Ke(t,e,n),n};const Ye=.005,Ge=.01;let F=class extends _{constructor(){super(...arguments),this.ranges=[],this.packLabel="PACK",this.formatVolts=s=>s.toFixed(3)}get bounds(){const s=this.ranges.flatMap(n=>[n.min,n.max]);if(!s.length)return{lo:3.2,hi:3.4};const t=Math.min(...s),e=Math.max(...s),a=Math.max((e-t)*.15,.005);return{lo:t-a,hi:e+a}}pct(s){const{lo:t,hi:e}=this.bounds,a=e-t||1;return(s-t)/a*100}render(){if(!this.ranges.length)return p;const{lo:s,hi:t}=this.bounds,e=[0,.25,.5,.75].map(a=>({at:a*100,value:s+(t-s)*a}));return c`
      <div class="axis">
        <div></div>
        <div class="ticks">
          ${e.map(a=>c`<span style="left:${a.at}%">${this.formatVolts(a.value)}</span>`)}
        </div>
        <div class="right"><span class="label">Δ</span></div>
      </div>

      ${this.ranges.map(a=>{const n=a.max-a.min,i=n>=Ge?"crit":n>=Ye?"warn":"",r=this.pct(a.min),o=Math.max(this.pct(a.max)-r,.6),l=this.pct((a.min+a.max)/2);return c`
          <div class="row">
            <div><span class="name ${i}">${this.packLabel} ${a.index}</span></div>
            <div class="rail">
              <i class="bar ${i}" style="left:${r}%;width:${o}%"></i>
              <i class="mid" style="left:${l}%"></i>
            </div>
            <div class="right">
              <span class="delta ${i}">${Math.round(n*1e3)} mV</span>
              ${a.note?c`<span class="label note">${a.note}</span>`:p}
            </div>
          </div>
        `})}
    `}};F.styles=[g,f`
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
    `];pt([h({attribute:!1})],F.prototype,"ranges",2);pt([h({type:String})],F.prototype,"packLabel",2);pt([h({attribute:!1})],F.prototype,"formatVolts",2);F=pt([$("mk-pack-matrix")],F);var Ze=Object.getOwnPropertyDescriptor,Je=(s,t,e,a)=>{for(var n=a>1?void 0:a?Ze(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=r(n)||n);return n};const Qe=.05,Ht=.1;let gt=class extends y{get ranges(){const s=this.reader,t=[];for(const e of this.packs){const a=s.num(`battery_${e}_min_cell_voltage`),n=s.num(`battery_${e}_max_cell_voltage`);if(a===null||n===null)continue;const i=s.num(`battery_${e}_cycle_count`),r=s.num(`battery_${e}_mos_temperature`),o=[i===null?null:`${this.fmt.num(i,0)} ⟳`,r===null?null:`${this.fmt.num(r,1)} °C`].filter(Boolean).join(" · ");t.push({index:e,min:a,max:n,note:o})}return t}render(){const s=this.reader,t=this.fmt,e=this.t,a=this.ranges,n=a.map(m=>m.max),i=a.map(m=>m.min),r=a.length?Math.max(...n)-Math.min(...i):null,o=a.reduce((m,v)=>!m||v.max-v.min>m.max-m.min?v:m,null),l=a.map(m=>m.max-m.min),d=l.length?l.reduce((m,v)=>m+v,0)/l.length:null,u=r===null?"":r>=Ht?"crit":r>=Qe?"warn":"ok";return c`
      <div class="grid tiles">
        <mk-stat
          label=${e("cells.highest")}
          value=${t.num(n.length?Math.max(...n):null,3)}
          unit="V"
          foot=${n.length?e("cells.in_pack",{pack:a[n.indexOf(Math.max(...n))].index}):""}
        ></mk-stat>
        <mk-stat
          label=${e("cells.lowest")}
          value=${t.num(i.length?Math.min(...i):null,3)}
          unit="V"
          foot=${i.length?e("cells.in_pack",{pack:a[i.indexOf(Math.min(...i))].index}):""}
        ></mk-stat>
        <mk-stat
          label=${e("cells.stack_spread")}
          value=${t.millivolts(r)}
          unit="mV"
          tone=${u}
          .bar=${r}
          .max=${Ht}
          foot=${e("cells.limit_hint")}
        ></mk-stat>
        <mk-stat
          label=${e("cells.mean_delta")}
          value=${t.millivolts(d)}
          unit="mV"
          foot=${o?e("cells.worst_pack",{pack:o.index,value:t.millivolts(o.max-o.min)}):""}
        ></mk-stat>
        <mk-stat
          label=${e("cells.temp_span")}
          value=${t.num(this.tempSpan(),1)}
          unit="K"
          foot=${`${t.num(s.num("min_cell_temperature"),1)} – ${t.num(s.num("max_cell_temperature"),1)} °C`}
        ></mk-stat>
        <mk-stat
          label=${e("cells.packs_online")}
          value=${`${a.length} / ${s.num("bms_pack_count")??a.length}`}
          foot=${e("cells.cells_total",{count:a.length*16})}
        ></mk-stat>
      </div>

      <div class="panel">
        <div class="head">
          <div class="label">${e("cells.matrix_title")}</div>
          <div class="label">${e("cells.matrix_axis")}</div>
        </div>
        ${a.length?c`
              <mk-pack-matrix
                .ranges=${a}
                packLabel=${e("common.pack")}
                .formatVolts=${m=>t.num(m,3)}
              ></mk-pack-matrix>
            `:c`<div class="note">${e("cells.no_ranges")}</div>`}
        <div class="note">${e("cells.matrix_legend")}</div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head"><div class="label">${e("cells.protection")}</div></div>
          ${this.protectionRows()}
        </div>
        <div class="panel">
          <div class="head"><div class="label">${e("cells.bms")}</div></div>
          ${this.kv("bms_pack_count",0)} ${this.kv("bms_online_mask",0)}
          ${this.kv("bms_active_pack_index",0)} ${this.kv("bms_battery_voltage",2)}
          ${this.kv("bms_charge_voltage_limit",2)} ${this.kv("alarm_status",0)}
        </div>
      </div>
    `}tempSpan(){const s=this.reader.num("max_cell_temperature"),t=this.reader.num("min_cell_temperature");return s===null||t===null?null:s-t}protectionRows(){const s=this.reader,t=this.t,e=[];for(const a of this.packs){const n=s.num(`battery_${a}_protection_1`),i=s.num(`battery_${a}_protection_2`),r=s.num(`battery_${a}_mos_status`),o=[];n&&o.push(`P1 ${n}`),i&&o.push(`P2 ${i}`),r&&o.push(`MOS ${r}`),o.length&&e.push(`${t("common.pack")} ${a}: ${o.join(", ")}`)}return this.packs.length?c`
      ${e.length?e.map(a=>this.row(a,t("cells.raised"),"crit")):this.row(t("cells.protection_all",{count:this.packs.length}),t("cells.clear"),"ok")}
      ${this.kv("fault_status",0)} ${this.kv("fault_status_2",0)}
      ${this.bmsVersions()}
    `:c`<div class="note">${t("cells.no_ranges")}</div>`}bmsVersions(){const s=this.reader,t=new Map;for(const e of this.packs){const a=s.str(`battery_${e}_bms_version`);a!==null&&t.set(a,[...t.get(a)??[],e])}if(!t.size)return p;if(t.size===1){const[e]=[...t.keys()];return this.row(this.t("cells.bms_version"),`${this.fmt.version(e)} · ${this.t("cells.uniform")}`)}return[...t.entries()].map(([e,a])=>this.row(`${this.t("cells.bms_version")} ${this.fmt.version(e)}`,a.map(n=>`#${n}`).join(" "),"warn"))}};gt.styles=[g,f`
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
    `];gt=Je([$("mk-view-cells")],gt);var Xe=Object.defineProperty,ts=Object.getOwnPropertyDescriptor,I=(s,t,e,a)=>{for(var n=a>1?void 0:a?ts(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=(a?r(t,e,n):r(n))||n);return a&&n&&Xe(t,e,n),n};let P=class extends _{constructor(){super(...arguments),this.packs=[],this.floor=null,this.packLabel="PACK",this.energyUnit="kWh",this.formatNumber=s=>s===null?"—":String(s),this.tolerance=5}fill(s){if(s===null)return"var(--mk-track)";const t=Math.min(Math.max(s,0),100)/100,e=t<.5?4+41*(t/.5):45+95*((t-.5)/.5);return`linear-gradient(180deg, hsl(${e.toFixed(0)} 74% 56%), hsl(${e.toFixed(0)} 68% 43%))`}render(){if(!this.packs.length)return p;const s=this.packs.map(e=>e.soc).filter(e=>e!==null).sort((e,a)=>e-a),t=s.length?s[Math.floor(s.length/2)]:null;return c`
      <div
        class="rack"
        style="grid-template-columns: repeat(${this.packs.length}, 1fr)"
      >
        ${this.packs.map(e=>{const a=t!==null&&e.soc!==null&&Math.abs(e.soc-t)>this.tolerance,n=e.soc===null?0:Math.min(Math.max(e.soc,0),100);return c`
            <div>
              <div class="soc ${a?"warn":""}">
                ${this.formatNumber(e.soc,1)}<span class="pct">%</span>
              </div>
              <div class="column ${a?"flagged":""}">
                <div class="fill" style="height:${n}%;background:${this.fill(e.soc)}"></div>
                ${this.floor===null?p:c`<div class="floor" style="bottom:${this.floor}%"></div>`}
                ${e.energy===null?p:c`
                      <div
                        class="readings ${n>=26?"inside":"outside"}"
                        style=${n>=26?`bottom:${n}%;transform:translateY(100%);padding-top:7px`:`bottom:${n}%;transform:translateY(-4px)`}
                      >
                        <span class="kwh">
                          ${this.formatNumber(e.energy,2)}<span class="unit">${this.energyUnit}</span>
                        </span>
                        ${e.socLabel?c`<span class="pct-line">${e.socLabel}</span>`:p}
                      </div>
                    `}
              </div>
              <div class="name ${a?"warn":""}">
                ${this.packLabel} ${e.index}
              </div>
              ${e.note?c`<div class="label note">${e.note}</div>`:p}
            </div>
          `})}
      </div>
    `}};P.styles=[g,f`
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
    `];I([h({attribute:!1})],P.prototype,"packs",2);I([h({type:Number})],P.prototype,"floor",2);I([h({type:String})],P.prototype,"packLabel",2);I([h({type:String})],P.prototype,"energyUnit",2);I([h({attribute:!1})],P.prototype,"formatNumber",2);I([h({type:Number})],P.prototype,"tolerance",2);P=I([$("mk-pack-bars")],P);var es=Object.getOwnPropertyDescriptor,ss=(s,t,e,a)=>{for(var n=a>1?void 0:a?es(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=r(n)||n);return n};let lt=class extends y{constructor(){super(),this.floor=null}get packCapacity(){const s=this.reader.num("battery_total_energy"),t=this.packs.length;return s!==null&&t?s/t:null}get fills(){const s=this.reader,t=this.fmt,e=this.packCapacity;return this.packs.map(a=>{const n=s.num(`battery_soc_${a}`),i=s.num(`battery_${a}_min_cell_voltage`),r=s.num(`battery_${a}_max_cell_voltage`);return{index:a,soc:n,energy:n===null||e===null?null:n/100*e,socLabel:n===null?void 0:`${t.num(n,1)} %`,note:i===null||r===null?void 0:`${t.num(i,3)} – ${t.num(r,3)} V`}})}render(){const s=this.reader,t=this.fmt,e=this.t,a=this.fills,n=a.map(d=>d.soc).filter(d=>d!==null),i=n.length?n.reduce((d,u)=>d+u,0)/n.length:null,r=n.length?Math.max(...n)-Math.min(...n):null,o=a.reduce((d,u)=>u.energy===null?d:d+u.energy,0),l=this.packs.map(d=>s.num(`battery_${d}_cycle_count`)).filter(d=>d!==null);return c`
      <div class="grid tiles">
        <mk-stat
          label=${s.label("battery_soc")}
          value=${t.num(s.num("battery_soc"),0)}
          unit="%"
          foot=${e("packs.device_reading")}
        ></mk-stat>
        <mk-stat
          label=${e("packs.mean_soc")}
          value=${t.num(i,1)}
          unit="%"
          foot=${e("packs.from_n_packs",{count:a.length})}
        ></mk-stat>
        <mk-stat
          label=${e("packs.spread")}
          value=${t.num(r,1)}
          unit="pp"
          tone=${r===null?"":r>5?"warn":"ok"}
          .bar=${r}
          .max=${10}
        ></mk-stat>
        <mk-stat
          label=${e("packs.stored_total")}
          value=${t.num(s.num("stored_energy"),2)}
          unit="kWh"
          foot=${o?e("packs.summed",{value:t.num(o,2)}):""}
        ></mk-stat>
        <mk-stat
          label=${e("packs.per_pack")}
          value=${t.num(this.packCapacity,2)}
          unit="kWh"
          foot=${e("packs.nominal")}
        ></mk-stat>
        <mk-stat
          label=${e("packs.cycles_sum")}
          value=${t.num(l.length?l.reduce((d,u)=>d+u,0):null,0)}
          foot=${l.length<this.packs.length?e("packs.cycles_partial",{have:l.length,total:this.packs.length}):""}
        ></mk-stat>
      </div>

      <div class="panel">
        <div class="head">
          <div class="label">${e("packs.fill_title")}</div>
          <div class="label">${e("packs.fill_axis")}</div>
        </div>
        ${a.length?c`
              <mk-pack-bars
                .packs=${a}
                .floor=${this.floor}
                packLabel=${e("common.pack")}
                energyUnit=${s.unit("battery_total_energy")||"kWh"}
                .formatNumber=${(d,u=0)=>t.num(d,u)}
              ></mk-pack-bars>
            `:c`<div class="note">${e("packs.none")}</div>`}
        <div class="note">
          ${this.floor===null?e("packs.fill_legend_nofloor"):e("packs.fill_legend",{floor:t.num(this.floor,0)})}
        </div>
      </div>

      ${a.length?this.table():p}
    `}table(){const s=this.reader,t=this.fmt,e=this.t,a=this.packCapacity,n=this.packs.map(r=>s.num(`battery_soc_${r}`)).filter(r=>r!==null).sort((r,o)=>r-o),i=n.length?n[Math.floor(n.length/2)]:null;return c`
      <div class="panel table-wrap">
        <div class="head"><div class="label">${e("packs.table_title")}</div></div>
        <div class="scroll">
          <table>
            <thead>
              <tr>
                <th>${e("common.pack")}</th>
                <th class="n">${e("packs.col_soc")}</th>
                <th class="n">${e("packs.col_energy")}</th>
                <th class="n">${e("packs.col_min")}</th>
                <th class="n">${e("packs.col_max")}</th>
                <th class="n">${e("packs.col_delta")}</th>
                <th class="n">${e("packs.col_voltage")}</th>
                <th class="n">${e("packs.col_current")}</th>
                <th class="n">${e("packs.col_cycles")}</th>
                <th class="n">${e("packs.col_mos")}</th>
                <th class="n">${e("packs.col_env")}</th>
                <th class="n">${e("packs.col_ntc")}</th>
              </tr>
            </thead>
            <tbody>
              ${this.packs.map(r=>{const o=s.num(`battery_soc_${r}`),l=s.num(`battery_${r}_min_cell_voltage`),d=s.num(`battery_${r}_max_cell_voltage`),u=l!==null&&d!==null?d-l:null,m=[1,2,3,4].map(b=>s.num(`battery_${r}_cell_temperature_${b}`)).filter(b=>b!==null).map(b=>t.num(b,1)).join(" · "),v=i!==null&&o!==null&&Math.abs(o-i)>5;return c`
                  <tr class=${v?"flagged":""}>
                    <td class=${v?"warn":""}>${e("common.pack")} ${r}</td>
                    <td class="n ${v?"warn":""}">${t.num(o,1)} %</td>
                    <td class="n">
                      ${t.num(o===null||a===null?null:o/100*a,2)}
                    </td>
                    <td class="n">${t.num(l,3)}</td>
                    <td class="n">${t.num(d,3)}</td>
                    <td class="n ${u!==null&&u>=.01?"crit":""}">
                      ${t.millivolts(u)} mV
                    </td>
                    <td class="n">${t.num(s.num(`battery_${r}_voltage`),2)}</td>
                    <td class="n">${t.num(s.num(`battery_${r}_current`),2)}</td>
                    <td class="n">${t.num(s.num(`battery_${r}_cycle_count`),0)}</td>
                    <td class="n">${t.num(s.num(`battery_${r}_mos_temperature`),1)}</td>
                    <td class="n">${t.num(s.num(`battery_${r}_env_temperature`),1)}</td>
                    <td class="n">${m||"—"}</td>
                  </tr>
                `})}
            </tbody>
          </table>
        </div>
        <div class="note">${e("packs.table_legend")}</div>
      </div>
    `}};lt.properties={floor:{type:Number}};lt.styles=[g,f`
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
    `];lt=ss([$("mk-view-packs")],lt);var as=Object.getOwnPropertyDescriptor,ns=(s,t,e,a)=>{for(var n=a>1?void 0:a?as(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=r(n)||n);return n};const G=[1,2,3,4],Bt=1;let bt=class extends y{render(){const s=this.reader,t=this.fmt,e=this.t,a=G.map(o=>s.num(`mppt${o}_power`)),n=s.sum(G.map(o=>`mppt${o}_power`)),i=Math.max(...a.map(o=>o??0),1),r=a.some(o=>o!==null&&o>Bt);return G.some(o=>s.entityId(`mppt${o}_power`))?c`
      <div class="grid channels">
        ${G.map(o=>{const l=s.num(`mppt${o}_power`),d=l!==null&&l>Bt;return c`
            <div class="panel">
              <div class="head">
                <div class="label">MPPT ${o}</div>
                <span class="pill ${d?"on":""}">
                  ${e(d?"solar.active":"solar.floating")}
                </span>
              </div>
              <div class="chan-value">
                ${t.num(l,0)}<span class="chan-unit">W</span>
              </div>
              <div class="track">
                <i style="width:${l===null?0:l/i*100}%"></i>
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
            <div class="label">${e("solar.summary")}</div>
            <div class="label">${e(r?"solar.some_active":"solar.all_idle")}</div>
          </div>
          <div class="chan-value">
            ${t.num(n,0)}<span class="chan-unit">W</span>
          </div>
          <div class="note">
            ${e(r?"solar.note_active":"solar.note_floating")}
          </div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${e("solar.diagnostics")}</div></div>
          ${this.kv("mppt_error",0,{tone:s.num("mppt_error")?"crit":"ok"})}
          ${this.kv("mppt_warning",0,{tone:s.num("mppt_warning")?"warn":"ok"})}
          ${this.kv("mppt_version",0)}
          ${n===null?p:this.row(e("solar.channels_reporting"),`${a.filter(o=>o!==null).length} / ${G.length}`)}
        </div>
      </div>
    `:c`<div class="panel"><div class="note">${e("solar.none")}</div></div>`}};bt.styles=[g,f`
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
    `];bt=ns([$("mk-view-solar")],bt);var is=Object.getOwnPropertyDescriptor,rs=(s,t,e,a)=>{for(var n=a>1?void 0:a?is(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=r(n)||n);return n};const os=[{titleKey:"energy.today",charge:"total_daily_charging_energy",discharge:"total_daily_discharging_energy"},{titleKey:"energy.month",charge:"total_monthly_charging_energy",discharge:"total_monthly_discharging_energy",efficiency:"round_trip_efficiency_monthly"},{titleKey:"energy.lifetime",charge:"total_charging_energy",discharge:"total_discharging_energy",efficiency:"round_trip_efficiency_total"}];let $t=class extends y{render(){const s=this.t;return c`
      <div class="grid periods">${os.map(t=>this.period(t))}</div>
      <div class="grid below">
        ${this.efficiencyPanel()}
        <div class="panel">
          <div class="head"><div class="label">${s("energy.throughput")}</div></div>
          ${this.kv("battery_cycle_count_calc",2)} ${this.kv("battery_cycle_count",0)}
          ${this.kv("stored_energy",2)} ${this.kv("battery_total_energy",2)}
          ${this.kv("usable_energy",2)} ${this.kv("energy_to_full",2)}
          ${this.kv("remaining_cycles",0)} ${this.kv("battery_health",2)}
        </div>
      </div>
    `}period(s){const t=this.reader,e=this.fmt,a=this.t,n=t.num(s.charge),i=t.num(s.discharge);if(n===null&&i===null)return p;const r=n?(i??0)/n*100:null,o=n!==null&&i!==null?n-i:null,l=s.efficiency?t.num(s.efficiency):null;return c`
      <div class="panel">
        <div class="head">
          <div class="label">${a(s.titleKey)}</div>
          ${l===null?p:c`<span class="pill ${l<70?"w":"on"}">
                ${a("energy.rte")} ${e.num(l,1)} %
              </span>`}
        </div>
        <div class="pair">
          <div>
            <div class="big">${e.num(n,2)}</div>
            <div class="label" style="margin-top:2px">${a("energy.charged")}</div>
          </div>
          <div>
            <div class="big magenta">${e.num(i,2)}</div>
            <div class="label" style="margin-top:2px">${a("energy.discharged")}</div>
          </div>
        </div>
        <div class="track"><i style="width:100%"></i></div>
        <div class="track out">
          <i style="width:${r===null?0:Math.min(r,100)}%"></i>
        </div>
        <div style="margin-top:14px">
          ${o===null?p:this.row(a("energy.loss"),`${e.num(o,2)} kWh`,o/(n||1)>.25?"warn":"")}
          ${r===null?p:this.row(a("energy.returned"),`${e.num(r,1)} %`)}
        </div>
      </div>
    `}efficiencyPanel(){const s=this.reader,t=this.fmt,e=this.t,a=[[s.label("round_trip_efficiency_total"),s.num("round_trip_efficiency_total"),""],[s.label("round_trip_efficiency_monthly"),s.num("round_trip_efficiency_monthly"),"warn"],[s.label("conversion_efficiency"),s.num("conversion_efficiency"),"ok"]],n=s.num("round_trip_efficiency_total"),i=s.num("round_trip_efficiency_monthly"),r=n!==null&&i!==null?n-i:null;return c`
      <div class="panel">
        <div class="head"><div class="label">${e("energy.efficiency")}</div></div>
        <div class="note" style="margin-top:0;margin-bottom:16px">
          ${e("energy.rte_hint")}
        </div>
        ${a.map(([o,l,d])=>l===null?p:c`
                <div class="meter">
                  <div class="meter-head">
                    <span class="label">${o}</span>
                    <span class="value ${d}" style="font-size:13px">
                      ${t.num(l,1)} %
                    </span>
                  </div>
                  <div class="track">
                    <i
                      style="width:${Math.min(Math.max(l,0),100)}%;background:var(--mk-${d||"accent"})"
                    ></i>
                  </div>
                </div>
              `)}
        ${r===null||Math.abs(r)<5?p:c`<div class="note">
              ${e("energy.gap_hint",{value:t.num(Math.abs(r),1)})}
            </div>`}
      </div>
    `}};$t.styles=[g,f`
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
    `];$t=rs([$("mk-view-energy")],$t);var ls=Object.getOwnPropertyDescriptor,cs=(s,t,e,a)=>{for(var n=a>1?void 0:a?ls(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=r(n)||n);return n};const Ft=["alarm_status","fault_status","fault_status_low","fault_status_2","fault_status_2_low","mppt_error","mppt_warning"];let _t=class extends y{render(){const s=this.reader,t=this.t,e=Ft.filter(a=>{const n=s.num(a);return n!==null&&n!==0});return c`
      <div class="banner ${e.length?"crit":"ok"}">
        <span class="dot"></span>
        ${e.length?t("system.faults_raised",{list:e.map(a=>s.label(a)).join(", ")}):t("system.no_faults")}
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
          ${Ft.map(a=>this.kv(a,0,{tone:s.num(a)?"crit":"ok"}))}
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
    `}ceilingNote(){const s=this.reader.num("charge_to_soc");if(s===null)return p;const t=s>=10&&s<=100;return c`
      <div class="note">
        ${t?this.t("system.ceiling_used",{value:this.fmt.num(s,0)}):this.t("system.ceiling_ignored",{value:this.fmt.num(s,0)})}
      </div>
    `}};_t.styles=[g,f`
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
    `];_t=cs([$("mk-view-system")],_t);var ds=Object.defineProperty,ps=Object.getOwnPropertyDescriptor,x=(s,t,e,a)=>{for(var n=a>1?void 0:a?ps(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=(a?r(t,e,n):r(n))||n);return a&&n&&ds(t,e,n),n};let k=class extends _{constructor(){super(...arguments),this.label="",this.value=null,this.min=0,this.max=100,this.step=1,this.unit="",this.disabled=!1,this.formatNumber=s=>s===null?"—":String(s),this.dragging=null,this.pending=null}willUpdate(s){s.has("value")&&this.pending!==null&&this.value===this.pending&&(this.pending=null)}get shown(){return this.dragging??this.pending??this.value}render(){const s=this.shown;return c`
      <div class="row">
        <span class="label">${this.label}</span>
        <span class="val ${this.pending!==null?"pending":""}">
          ${this.formatNumber(s)}${this.unit?c`<span class="unit">${this.unit}</span>`:p}
        </span>
      </div>
      <input
        type="range"
        .min=${String(this.min)}
        .max=${String(this.max)}
        .step=${String(this.step)}
        .value=${String(s??this.min)}
        ?disabled=${this.disabled||this.value===null}
        aria-label=${this.label}
        @input=${t=>this.dragging=Number(t.target.value)}
        @change=${t=>this.commit(Number(t.target.value))}
      />
      <div class="ends">
        <span class="label">${this.formatNumber(this.min)}</span>
        <span class="label">${this.formatNumber(this.max)}</span>
      </div>
    `}commit(s){this.dragging=null,s!==this.value&&(this.pending=s,this.onCommit?.(s))}};k.styles=[g,f`
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
    `];x([h({type:String})],k.prototype,"label",2);x([h({type:Number})],k.prototype,"value",2);x([h({type:Number})],k.prototype,"min",2);x([h({type:Number})],k.prototype,"max",2);x([h({type:Number})],k.prototype,"step",2);x([h({type:String})],k.prototype,"unit",2);x([h({type:Boolean})],k.prototype,"disabled",2);x([h({attribute:!1})],k.prototype,"formatNumber",2);x([h({attribute:!1})],k.prototype,"onCommit",2);x([E()],k.prototype,"dragging",2);x([E()],k.prototype,"pending",2);k=x([$("mk-slider")],k);var hs=Object.defineProperty,ms=Object.getOwnPropertyDescriptor,L=(s,t,e,a)=>{for(var n=a>1?void 0:a?ms(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=(a?r(t,e,n):r(n))||n);return a&&n&&hs(t,e,n),n};let C=class extends _{constructor(){super(...arguments),this.label="",this.options=[],this.value=null,this.disabled=!1,this.pending=null}willUpdate(s){s.has("value")&&this.pending!==null&&this.value===this.pending&&(this.pending=null)}render(){const s=this.pending??this.value;return c`
      <span class="label">${this.label}</span>
      <div class="bar" role="group" aria-label=${this.label}>
        ${this.options.map(t=>c`
            <button
              class=${this.pending===t.value?"pending":""}
              aria-pressed=${s===t.value}
              ?disabled=${this.disabled}
              @click=${()=>this.pick(t.value)}
            >
              ${t.label}
            </button>
          `)}
      </div>
    `}pick(s){s!==this.value&&(this.pending=s,this.onSelect?.(s))}};C.styles=[g,f`
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
    `];L([h({type:String})],C.prototype,"label",2);L([h({attribute:!1})],C.prototype,"options",2);L([h({type:String})],C.prototype,"value",2);L([h({type:Boolean})],C.prototype,"disabled",2);L([h({attribute:!1})],C.prototype,"onSelect",2);L([E()],C.prototype,"pending",2);C=L([$("mk-segment")],C);var us=Object.defineProperty,vs=Object.getOwnPropertyDescriptor,D=(s,t,e,a)=>{for(var n=a>1?void 0:a?vs(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=(a?r(t,e,n):r(n))||n);return a&&n&&us(t,e,n),n};let A=class extends _{constructor(){super(...arguments),this.label="",this.hint="",this.bare=!1,this.checked=null,this.disabled=!1,this.pending=null}willUpdate(s){s.has("checked")&&this.pending!==null&&this.checked===this.pending&&(this.pending=null)}render(){const s=this.pending??this.checked;return c`
      ${this.bare?p:c`
            <div class="text">
              <div class="name">${this.label}</div>
              ${this.hint?c`<div class="hint">${this.hint}</div>`:p}
            </div>
          `}
      <button
        class=${this.pending!==null?"pending":""}
        role="switch"
        aria-checked=${s===!0}
        aria-label=${this.label}
        ?disabled=${this.disabled||this.checked===null}
        @click=${()=>this.flip()}
      >
        <i></i>
      </button>
    `}flip(){const s=!(this.pending??this.checked);this.pending=s,this.onToggle?.(s)}};A.styles=[g,f`
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
    `];D([h({type:String})],A.prototype,"label",2);D([h({type:String})],A.prototype,"hint",2);D([h({type:Boolean})],A.prototype,"bare",2);D([h({type:Boolean})],A.prototype,"checked",2);D([h({type:Boolean})],A.prototype,"disabled",2);D([h({attribute:!1})],A.prototype,"onToggle",2);D([E()],A.prototype,"pending",2);A=D([$("mk-toggle")],A);var fs=Object.defineProperty,gs=Object.getOwnPropertyDescriptor,O=(s,t,e,a)=>{for(var n=a>1?void 0:a?gs(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=(a?r(t,e,n):r(n))||n);return a&&n&&fs(t,e,n),n};let w=class extends _{constructor(){super(...arguments),this.rows=[],this.dayLabel=s=>s,this.formatNumber=s=>s===null?"—":String(s)}toClock(s){if(s===null||s<0||s>2359)return"";const t=Math.floor(s/100),e=s%100;return t>23||e>59?"":`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`}fromClock(s){const t=/^(\d{1,2}):(\d{2})$/.exec(s);return t?Number(t[1])*100+Number(t[2]):null}render(){if(!this.rows.length)return p;const s=this.labels;return c`
      <div class="head-row">
        <span class="label"></span>
        <span class="label">${s.active}</span>
        <span class="label">${s.window}</span>
        <span class="label">${s.power}</span>
        <span class="label">${s.days}</span>
      </div>

      ${this.rows.map(t=>{const e=t.enabled!==!0;return c`
          <div class="row ${e?"off":""}">
            <span class="name">${t.index}</span>

            <mk-toggle
              bare
              .checked=${t.enabled}
              label=${`${s.active} ${t.index}`}
              .onToggle=${a=>this.onEnable?.(t.index,a)}
            ></mk-toggle>

            <div class="times">
              <input
                type="time"
                .value=${this.toClock(t.start)}
                aria-label=${`${s.window} ${t.index}`}
                @change=${a=>this.time(t.index,"start",a)}
              />
              <span class="dash">–</span>
              <input
                type="time"
                .value=${this.toClock(t.end)}
                aria-label=${`${s.window} ${t.index}`}
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
                aria-label=${`${s.power} ${t.index}`}
                @change=${a=>this.power(t.index,a)}
              />
              <span class="unit">W</span>
            </div>

            <select
              aria-label=${`${s.days} ${t.index}`}
              @change=${a=>this.onDays?.(t.index,a.target.value)}
            >
              ${t.days===null?c`<option value="" selected>${s.unset}</option>`:p}
              ${t.dayOptions.map(a=>c`
                  <option value=${a} ?selected=${t.days===a}>
                    ${this.dayLabel(a)}
                  </option>
                `)}
            </select>
          </div>
        `})}
    `}time(s,t,e){const a=this.fromClock(e.target.value);a!==null&&this.onTime?.(s,t,a)}power(s,t){const e=Number(t.target.value);Number.isFinite(e)&&this.onPower?.(s,e)}};w.styles=[g,f`
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
    `];O([h({attribute:!1})],w.prototype,"rows",2);O([h({attribute:!1})],w.prototype,"labels",2);O([h({attribute:!1})],w.prototype,"dayLabel",2);O([h({attribute:!1})],w.prototype,"formatNumber",2);O([h({attribute:!1})],w.prototype,"onEnable",2);O([h({attribute:!1})],w.prototype,"onTime",2);O([h({attribute:!1})],w.prototype,"onPower",2);O([h({attribute:!1})],w.prototype,"onDays",2);w=O([$("mk-schedule")],w);var bs=Object.defineProperty,$s=Object.getOwnPropertyDescriptor,ht=(s,t,e,a)=>{for(var n=a>1?void 0:a?$s(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=(a?r(t,e,n):r(n))||n);return a&&n&&bs(t,e,n),n};const Kt=["set_charge_power","set_discharge_power"],qt=["max_charge_power","max_discharge_power"],_s=[1,2,3,4,5,6],ks=30;let K=class extends y{constructor(){super(...arguments),this.wrote={},this.confirmReset=!1}note(s){this.wrote={...this.wrote,[s]:Date.now()}}overwritten(s){const t=this.wrote[s];if(!t)return!1;const e=this.reader.rawState(s)?.last_updated;if(!e)return!1;const a=(new Date(e).getTime()-t)/1e3;return a>.5&&a<ks}slider(s){const t=this.reader;return t.entityId(s)?c`
      <mk-slider
        label=${t.label(s)}
        .value=${t.num(s)}
        .min=${t.attr(s,"min",0)}
        .max=${t.attr(s,"max",100)}
        .step=${t.attr(s,"step",1)}
        unit=${t.unit(s)}
        ?disabled=${!t.writable(s)}
        .formatNumber=${e=>this.fmt.num(e,0)}
        .onCommit=${e=>{this.note(s),this.controls.setNumber(s,e)}}
      ></mk-slider>
    `:p}segment(s){const t=this.reader;if(!t.entityId(s))return p;const e=t.attr(s,"options",[]);return c`
      <mk-segment
        label=${t.label(s)}
        .value=${t.rawState(s)?.state??null}
        .options=${e.map(a=>({value:a,label:this.t(`control.opt.${a}`)}))}
        ?disabled=${!t.writable(s)}
        .onSelect=${a=>{this.note(s),this.controls.selectOption(s,a)}}
      ></mk-segment>
    `}toggle(s,t){const e=this.reader;if(!e.entityId(s))return p;const a=e.rawState(s);return c`
      <mk-toggle
        label=${e.label(s)}
        hint=${this.t(t)}
        .checked=${a&&a.state!=="unavailable"?a.state==="on":null}
        .onToggle=${n=>{this.note(s),this.controls.setSwitch(s,n)}}
      ></mk-toggle>
    `}get scheduleRows(){const s=this.reader;return _s.filter(t=>s.entityId(`schedule_${t}_start`)).map(t=>{const e=`schedule_${t}_mode`,a=s.rawState(`schedule_${t}_enabled`);return{index:t,enabled:a&&a.state!=="unavailable"?a.state==="on":null,start:s.num(`schedule_${t}_start`),end:s.num(`schedule_${t}_end`),power:s.num(e),powerMin:s.attr(e,"min",-2500),powerMax:s.attr(e,"max",2500),powerStep:s.attr(e,"step",1),days:s.rawState(`schedule_${t}_days`)?.state??null,dayOptions:s.attr(`schedule_${t}_days`,"options",[])}})}render(){const s=this.t,t=[...Kt,...qt].filter(a=>this.overwritten(a)),e=this.scheduleRows;return c`
      ${t.length?c`<div class="warn-note">
            <b>!</b>
            <span>
              ${s("control.overwritten",{names:t.map(a=>this.reader.label(a)).join(", ")})}
            </span>
          </div>`:p}

      <div class="grid top">
        <div class="panel stack">
          <div class="head"><div class="label">${s("control.power")}</div></div>
          ${Kt.map(a=>this.slider(a))}
          <div class="note">${s("control.power_hint")}</div>
        </div>

        <div class="panel stack">
          <div class="head"><div class="label">${s("control.limits")}</div></div>
          ${qt.map(a=>this.slider(a))} ${this.slider("charge_to_soc")}
        </div>

        <div class="panel stack">
          <div class="head"><div class="label">${s("control.mode")}</div></div>
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
            <div class="label">${s("control.schedules")}</div>
            <div class="label">${s("control.schedules_axis")}</div>
          </div>
          ${e.length?c`
                <mk-schedule
                  .rows=${e}
                  .labels=${{window:s("control.window"),power:s("control.sched_power"),days:s("control.days"),active:s("control.active"),unset:s("control.unset")}}
                  .dayLabel=${a=>s(`control.day.${a}`)}
                  .formatNumber=${a=>this.fmt.num(a,0)}
                  .onEnable=${(a,n)=>this.controls.setSwitch(`schedule_${a}_enabled`,n)}
                  .onTime=${(a,n,i)=>this.controls.setNumber(`schedule_${a}_${n}`,i)}
                  .onPower=${(a,n)=>this.controls.setNumber(`schedule_${a}_mode`,n)}
                  .onDays=${(a,n)=>this.controls.selectOption(`schedule_${a}_days`,n)}
                ></mk-schedule>
              `:c`<div class="note">${s("control.no_schedules")}</div>`}
          <div class="note">${s("control.schedules_hint")}</div>
        </div>
      </div>

      ${this.reader.entityId("reset_device")?c`
            <div class="grid below">
              <div class="panel">
                <div class="head"><div class="label">${s("control.device")}</div></div>
                <div class="danger">
                  ${this.confirmReset?c`
                        <button
                          class="action confirm"
                          @click=${()=>{this.controls.press("reset_device"),this.confirmReset=!1}}
                        >
                          ${s("control.reset_confirm")}
                        </button>
                        <button class="action" @click=${()=>this.confirmReset=!1}>
                          ${s("control.cancel")}
                        </button>
                      `:c`
                        <button class="action" @click=${()=>this.confirmReset=!0}>
                          ${s("control.reset")}
                        </button>
                      `}
                  <span class="note" style="margin:0">${s("control.reset_hint")}</span>
                </div>
              </div>
            </div>
          `:p}
    `}};K.styles=[g,f`
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
    `];ht([h({attribute:!1})],K.prototype,"controls",2);ht([E()],K.prototype,"wrote",2);ht([E()],K.prototype,"confirmReset",2);K=ht([$("mk-view-control")],K);var ys=Object.defineProperty,xs=Object.getOwnPropertyDescriptor,q=(s,t,e,a)=>{for(var n=a>1?void 0:a?xs(t,e):t,i=s.length-1,r;i>=0;i--)(r=s[i])&&(n=(a?r(t,e,n):r(n))||n);return a&&n&&ys(t,e,n),n};const ws=["core","cells","packs","solar","energy","control","system"],Ss={cells:"battery_1_max_cell_voltage",packs:"battery_soc_1",solar:"mppt1_power",control:"set_charge_power"},ee="marstek-panel.device";let T=class extends _{constructor(){super(...arguments),this.narrow=!1,this.tab="core",this.strings=tt,this.deviceId=As(),this.catalogueFor="",this.formatter=new Wt("en"),this.t=(s,t)=>Re(this.strings,s,t)}willUpdate(s){if(!s.has("hass")||!this.hass)return;this.toggleAttribute("light",!this.hass.themes?.darkMode);const t=this.hass.language||"en";t!==this.catalogueFor&&(this.catalogueFor=t,this.formatter=new Wt(t),De(t).then(e=>{this.catalogueFor===t&&(this.strings=e)}))}selectDevice(s){this.deviceId=s;try{localStorage.setItem(ee,s)}catch{}}tabsFor(s){return ws.filter(t=>{const e=Ss[t];return!e||s.entityId(e)!==void 0})}get devices(){return this.hass?Pe(this.hass):[]}get device(){const s=this.devices;return s.length?s.find(t=>t.deviceId===this.deviceId)??s[0]:null}render(){if(!this.hass)return p;const s=this.device;if(!s)return c`
        <div class="shell">
          <div class="empty">
            <h2>${this.t("empty.no_device")}</h2>
            <p>${this.t("empty.no_device_hint")}</p>
          </div>
        </div>
      `;const t=new Ce(this.hass,s),e=this.tabsFor(t),a=e.includes(this.tab)?this.tab:e[0];return c`
      <div class="shell">
        <header>
          <div class="brand">
            ${/^marstek/i.test(s.name)?c`<em>${s.name}</em>`:c`MARSTEK <em>${s.name}</em>`}
          </div>
          <nav role="tablist" aria-label="Marstek Venus">
            ${e.map(n=>c`
                <button
                  class="tab"
                  role="tab"
                  aria-selected=${a===n}
                  @click=${()=>this.tab=n}
                  @keydown=${i=>this.onTabKey(i,n,e)}
                >
                  ${this.t(`tab.${n}`)}
                </button>
              `)}
          </nav>
          ${this.statusBar(t)}
        </header>

        <main>${this.renderTab(t,a)}</main>
      </div>
    `}onTabKey(s,t,e){const a=s.key==="ArrowRight"?1:s.key==="ArrowLeft"?-1:0;if(!a)return;s.preventDefault();const n=e[(e.indexOf(t)+a+e.length)%e.length];this.tab=n,this.renderRoot.querySelectorAll("button.tab")[e.indexOf(n)]?.focus()}statusBar(s){const t=this.devices,e=this.device?.deviceId,a=s.num("wifi_signal_strength");return c`
      <div class="status">
        ${t.length>1?c`
              <select
                aria-label=${this.t("common.device")}
                @change=${n=>this.selectDevice(n.target.value)}
              >
                ${t.map(n=>c`
                    <option value=${n.deviceId} ?selected=${n.deviceId===e}>
                      ${n.name}
                    </option>
                  `)}
              </select>
            `:p}
        <span>
          <i class="led ${s.has("battery_soc")?"on":"off"}"></i>
          ${this.t("status.modbus")}
        </span>
        ${a===null?p:c`<span>
              <i class="led on"></i>${this.t("status.wifi")}
              ${this.formatter.num(a,0)} dBm
            </span>`}
        ${s.str("inverter_state")?c`<span>${s.str("inverter_state")}</span>`:p}
      </div>
    `}floorPercent(s){const t=s.num("stored_energy"),e=s.num("usable_energy"),a=s.num("battery_total_energy");if(t===null||e===null||!a)return null;const n=(t-e)/a*100;return n>=0&&n<=100?n:null}renderTab(s,t){const e={reader:s,fmt:this.formatter,t:this.t};switch(t){case"cells":return c`<mk-view-cells
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
        ></mk-view-cells>`;case"packs":return c`<mk-view-packs
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
          .floor=${this.floorPercent(s)}
        ></mk-view-packs>`;case"solar":return c`<mk-view-solar
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
        ></mk-view-solar>`;case"energy":return c`<mk-view-energy
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
        ></mk-view-energy>`;case"control":return c`<mk-view-control
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
          .controls=${new Ee(this.hass,s)}
        ></mk-view-control>`;case"system":return c`<mk-view-system
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
        ></mk-view-system>`;default:return c`<mk-view-core
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
        ></mk-view-core>`}}};T.styles=[Se,g,f`
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
    `];q([h({attribute:!1})],T.prototype,"hass",2);q([h({type:Boolean})],T.prototype,"narrow",2);q([E()],T.prototype,"tab",2);q([E()],T.prototype,"strings",2);q([E()],T.prototype,"deviceId",2);T=q([$("marstek-modbus-panel")],T);function As(){try{return localStorage.getItem(ee)}catch{return null}}
