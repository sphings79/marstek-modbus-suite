/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const F=globalThis,et=F.ShadowRoot&&(F.ShadyCSS===void 0||F.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,st=Symbol(),lt=new WeakMap;let kt=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==st)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(et&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=lt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&lt.set(e,t))}return t}toString(){return this.cssText}};const Ct=i=>new kt(typeof i=="string"?i:i+"",void 0,st),N=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new kt(e,i,st)},Mt=(i,t)=>{if(et)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=F.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},ct=et?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ct(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ot,defineProperty:Nt,getOwnPropertyDescriptor:Rt,getOwnPropertyNames:Ut,getOwnPropertySymbols:Tt,getPrototypeOf:Dt}=Object,q=globalThis,ht=q.trustedTypes,It=ht?ht.emptyScript:"",zt=q.reactiveElementPolyfillSupport,T=(i,t)=>i,W={toAttribute(i,t){switch(t){case Boolean:i=i?It:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},it=(i,t)=>!Ot(i,t),dt={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:it};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;let P=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=dt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Nt(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Rt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??dt}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;const t=Dt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){const e=this.properties,s=[...Ut(e),...Tt(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(ct(r))}else t!==void 0&&e.push(ct(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Mt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const n=(s.converter?.toAttribute!==void 0?s.converter:W).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const n=s.getPropertyOptions(r),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:W;this._$Em=r;const l=o.fromAttribute(e,n.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s,r=!1,n){if(t!==void 0){const o=this.constructor;if(r===!1&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??it)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,n]of s){const{wrapped:o}=n,l=this[r];o!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};P.elementStyles=[],P.shadowRootOptions={mode:"open"},P[T("elementProperties")]=new Map,P[T("finalized")]=new Map,zt?.({ReactiveElement:P}),(q.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rt=globalThis,ut=i=>i,V=rt.trustedTypes,pt=V?V.createPolicy("lit-html",{createHTML:i=>i}):void 0,xt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,wt="?"+$,Ht=`<${wt}>`,w=document,D=()=>w.createComment(""),I=i=>i===null||typeof i!="object"&&typeof i!="function",nt=Array.isArray,Lt=i=>nt(i)||typeof i?.[Symbol.iterator]=="function",Y=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mt=/-->/g,ft=/>/g,k=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vt=/'/g,gt=/"/g,At=/^(?:script|style|textarea|title)$/i,Et=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),m=Et(1),$t=Et(2),C=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),_t=new WeakMap,x=w.createTreeWalker(w,129);function St(i,t){if(!nt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return pt!==void 0?pt.createHTML(t):t}const jt=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=U;for(let l=0;l<e;l++){const a=i[l];let c,u,h=-1,p=0;for(;p<a.length&&(o.lastIndex=p,u=o.exec(a),u!==null);)p=o.lastIndex,o===U?u[1]==="!--"?o=mt:u[1]!==void 0?o=ft:u[2]!==void 0?(At.test(u[2])&&(r=RegExp("</"+u[2],"g")),o=k):u[3]!==void 0&&(o=k):o===k?u[0]===">"?(o=r??U,h=-1):u[1]===void 0?h=-2:(h=o.lastIndex-u[2].length,c=u[1],o=u[3]===void 0?k:u[3]==='"'?gt:vt):o===gt||o===vt?o=k:o===mt||o===ft?o=U:(o=k,r=void 0);const v=o===k&&i[l+1].startsWith("/>")?" ":"";n+=o===U?a+Ht:h>=0?(s.push(c),a.slice(0,h)+xt+a.slice(h)+$+v):a+$+(h===-2?l:v)}return[St(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class z{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[c,u]=jt(t,e);if(this.el=z.createElement(c,s),x.currentNode=this.el.content,e===2||e===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=x.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const h of r.getAttributeNames())if(h.endsWith(xt)){const p=u[o++],v=r.getAttribute(h).split($),E=/([.?@])?(.*)/.exec(p);a.push({type:1,index:n,name:E[2],strings:v,ctor:E[1]==="."?Ft:E[1]==="?"?Wt:E[1]==="@"?Vt:K}),r.removeAttribute(h)}else h.startsWith($)&&(a.push({type:6,index:n}),r.removeAttribute(h));if(At.test(r.tagName)){const h=r.textContent.split($),p=h.length-1;if(p>0){r.textContent=V?V.emptyScript:"";for(let v=0;v<p;v++)r.append(h[v],D()),x.nextNode(),a.push({type:2,index:++n});r.append(h[p],D())}}}else if(r.nodeType===8)if(r.data===wt)a.push({type:2,index:n});else{let h=-1;for(;(h=r.data.indexOf($,h+1))!==-1;)a.push({type:7,index:n}),h+=$.length-1}n++}}static createElement(t,e){const s=w.createElement("template");return s.innerHTML=t,s}}function M(i,t,e=i,s){if(t===C)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl;const n=I(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=M(i,r._$AS(i,t.values),r,s)),t}class Bt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??w).importNode(e,!0);x.currentNode=r;let n=x.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let c;a.type===2?c=new L(n,n.nextSibling,this,t):a.type===1?c=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(c=new qt(n,this,t)),this._$AV.push(c),a=s[++l]}o!==a?.index&&(n=x.nextNode(),o++)}return x.currentNode=w,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class L{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=M(this,t,e),I(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==C&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Lt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=z.createElement(St(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{const n=new Bt(r,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=_t.get(t.strings);return e===void 0&&_t.set(t.strings,e=new z(t)),e}k(t){nt(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new L(this.O(D()),this.O(D()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=ut(t).nextSibling;ut(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class K{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=M(this,t,e,0),o=!I(t)||t!==this._$AH&&t!==C,o&&(this._$AH=t);else{const l=t;let a,c;for(t=n[0],a=0;a<n.length-1;a++)c=M(this,l[s+a],e,a),c===C&&(c=this._$AH[a]),o||=!I(c)||c!==this._$AH[a],c===d?t=d:t!==d&&(t+=(c??"")+n[a+1]),this._$AH[a]=c}o&&!r&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ft extends K{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}}class Wt extends K{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}}class Vt extends K{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=M(this,t,e,0)??d)===C)return;const s=this._$AH,r=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==d&&(s===d||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class qt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}}const Kt=rt.litHtmlPolyfillSupport;Kt?.(z,L),(rt.litHtmlVersions??=[]).push("3.3.3");const Gt=(i,t,e)=>{const s=e?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const n=e?.renderBefore??null;s._$litPart$=r=new L(t.insertBefore(D(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ot=globalThis;class _ extends P{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Gt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}}_._$litElement$=!0,_.finalized=!0,ot.litElementHydrateSupport?.({LitElement:_});const Zt=ot.litElementPolyfillSupport;Zt?.({LitElement:_});(ot.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const G=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Jt={attribute:!0,type:String,converter:W,reflect:!1,hasChanged:it},Yt=(i=Jt,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i,!0,l)}}throw Error("Unsupported decorator location: "+s)};function f(i){return(t,e)=>typeof e=="object"?Yt(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function at(i){return f({...i,state:!0,attribute:!1})}const Qt=N`
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
`,Z=N`
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

  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`,Xt="marstek_modbus";function te(i){const t=new Map;for(const e of Object.values(i.entities)){if(e.platform!==Xt||!e.device_id||!e.translation_key)continue;let s=t.get(e.device_id);if(!s){const r=i.devices[e.device_id];s={deviceId:e.device_id,name:r?.name_by_user||r?.name||"Marstek Venus",byKey:{}},t.set(e.device_id,s)}s.byKey[e.translation_key]=e.entity_id}return[...t.values()].sort((e,s)=>e.name.localeCompare(s.name))}class ee{constructor(t,e){this.hass=t,this.device=e}get name(){return this.device.name}entityId(t){return this.device.byKey[t]}has(t){return this.state(t)!==null}state(t){const e=this.device.byKey[t];if(!e)return null;const s=this.hass.states[e];return!s||s.state==="unavailable"||s.state==="unknown"?null:s}num(t){const e=this.state(t);if(!e)return null;const s=Number(e.state);return Number.isFinite(s)?s:null}str(t){return this.state(t)?.state??null}unit(t){return this.state(t)?.attributes.unit_of_measurement??""}label(t){return this.hass.states[this.device.byKey[t]??""]?.attributes.friendly_name??t}sum(t){let e=0,s=!1;for(const r of t){const n=this.num(r);n!==null&&(e+=n,s=!0)}return s?e:null}packCount(){let t=0;for(;this.device.byKey[`battery_${t+1}_max_cell_voltage`];)t++;return t}}const se="modulepreload",ie=function(i){return"/"+i},bt={},re=function(t,e,s){let r=Promise.resolve();if(e&&e.length>0){let o=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),a=l?.nonce||l?.getAttribute("nonce");r=o(e.map(c=>{if(c=ie(c),c in bt)return;bt[c]=!0;const u=c.endsWith(".css"),h=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":se,u||(p.as="script"),p.crossOrigin="",p.href=c,a&&p.setAttribute("nonce",a),document.head.appendChild(p),u)return new Promise((v,E)=>{p.addEventListener("load",v),p.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return r.then(o=>{for(const l of o||[])l.status==="rejected"&&n(l.reason);return t().catch(n)})},H={"tab.core":"CORE","tab.cells":"CELLS","tab.packs":"PACKS","tab.solar":"SOLAR","tab.energy":"ENERGY","tab.system":"SYSTEM","status.modbus":"MODBUS","status.wifi":"WIFI","status.cloud":"CLOUD","status.cloud_off":"CLOUD OFF","status.discharging":"DISCHARGING","status.charging":"CHARGING","status.idle":"IDLE","core.electrical":"Electrical · now","core.reserve":"Reserve · lifetime","core.stored":"Stored","core.capacity":"Capacity","core.soc_bms":"SOC · BMS","core.soc_usable":"usable {value} %","core.discharging_to_house":"discharging","core.charging_from_grid":"charging","core.at_rest":"at rest","core.today_charged":"Charged today","core.today_discharged":"Discharged today","core.cell_delta":"Cell delta","core.internal_temp":"Internal temperature","core.mppt_total":"MPPT total","core.pack_spread":"across {count} packs","core.no_delta":"no per-pack readings","empty.no_device":"No Marstek battery found","empty.no_device_hint":"This panel reads the Marstek Venus Modbus integration. Add a battery there first.","empty.not_ready":"Waiting for the first reading…","common.unavailable":"—","common.device":"Device"},Pt={de:()=>re(()=>import("./marstek-lang-de.js"),[]).then(i=>i.de)};["en",...Object.keys(Pt)].sort();const B={en:H};function ne(i){return i.split("-")[0].toLowerCase()}async function oe(i){const t=ne(i);if(B[t])return B[t];const e=Pt[t];if(!e)return H;try{return B[t]=await e(),B[t]}catch{return H}}function ae(i,t,e){let s=i[t]??H[t]??t;if(e)for(const[r,n]of Object.entries(e))s=s.replace(`{${r}}`,String(n));return s}const Q="—";class yt{constructor(t){this.language=t,this.cache=new Map}formatter(t){const e=String(t);let s=this.cache.get(e);return s||(s=new Intl.NumberFormat(this.language||"en",{minimumFractionDigits:t,maximumFractionDigits:t}),this.cache.set(e,s)),s}num(t,e=0){return t==null||!Number.isFinite(t)?Q:this.formatter(e).format(t)}signed(t,e=0){if(t==null||!Number.isFinite(t))return Q;const s=this.formatter(e).format(Math.abs(t));return t>0?`+${s}`:t<0?`−${s}`:s}millivolts(t){return t==null||!Number.isFinite(t)?Q:this.formatter(0).format(Math.round(t*1e3))}}var le=Object.defineProperty,ce=Object.getOwnPropertyDescriptor,j=(i,t,e,s)=>{for(var r=s>1?void 0:s?ce(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&le(t,e,r),r};const X=118,tt=97,he=2*Math.PI*X,de=2*Math.PI*tt;let A=class extends _{constructor(){super(...arguments),this.soc=null,this.usable=null,this.caption="",this.sub=""}arc(i,t){const e=i===null?0:Math.min(Math.max(i,0),100);return`${t*e/100} ${t}`}render(){const i=this.soc===null?"—":Math.round(this.soc).toString();return m`
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

        <circle class="track" cx="150" cy="134" r=${X} stroke-width="15" />
        <circle
          class="arc-outer"
          cx="150"
          cy="134"
          r=${X}
          stroke-width="15"
          stroke-dasharray=${this.arc(this.soc,he)}
          transform="rotate(-90 150 134)"
        />

        ${this.usable===null?d:$t`
              <circle class="track" cx="150" cy="134" r=${tt} stroke-width="5" />
              <circle
                class="arc-inner"
                cx="150" cy="134" r=${tt} stroke-width="5"
                stroke-dasharray=${this.arc(this.usable,de)}
                transform="rotate(-90 150 134)"
              />
            `}

        <text class="num" x="146" y="132" text-anchor="middle">${i}</text>
        <text class="pct" x="196" y="132" text-anchor="start">%</text>
        <text class="cap" x="150" y="158" text-anchor="middle">${this.caption}</text>
        ${this.sub?$t`<text class="sub" x="150" y="186" text-anchor="middle">${this.sub}</text>`:d}
      </svg>
    `}};A.styles=[Z,N`
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
    `];j([f({type:Number})],A.prototype,"soc",2);j([f({type:Number})],A.prototype,"usable",2);j([f({type:String})],A.prototype,"caption",2);j([f({type:String})],A.prototype,"sub",2);A=j([G("mk-gauge")],A);var ue=Object.defineProperty,pe=Object.getOwnPropertyDescriptor,y=(i,t,e,s)=>{for(var r=s>1?void 0:s?pe(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&ue(t,e,r),r};let g=class extends _{constructor(){super(...arguments),this.label="",this.value="—",this.unit="",this.foot="",this.tone="",this.bar=null,this.max=null}get fill(){return this.bar===null||this.max===null||this.max===0?null:Math.min(Math.max(this.bar/this.max*100,0),100)}render(){const i=this.fill;return m`
      <div class="label">${this.label}</div>
      <div class="num ${this.tone}">
        ${this.value}${this.unit?m`<span class="unit">${this.unit}</span>`:d}
      </div>
      ${i===null?d:m`<div class="track"><i style="width:${i}%"></i></div>`}
      ${this.foot?m`<div class="foot">${this.foot}</div>`:d}
    `}};g.styles=[Z,N`
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
    `];y([f({type:String})],g.prototype,"label",2);y([f({type:String})],g.prototype,"value",2);y([f({type:String})],g.prototype,"unit",2);y([f({type:String})],g.prototype,"foot",2);y([f({type:String})],g.prototype,"tone",2);y([f({type:Number})],g.prototype,"bar",2);y([f({type:Number})],g.prototype,"max",2);g=y([G("mk-stat")],g);var me=Object.defineProperty,fe=Object.getOwnPropertyDescriptor,J=(i,t,e,s)=>{for(var r=s>1?void 0:s?fe(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&me(t,e,r),r};const ve=30;let O=class extends _{render(){const i=this.reader,t=this.fmt,e=this.t,s=i.num("battery_soc"),r=i.num("battery_total_energy"),n=i.num("stored_energy"),o=i.num("battery_power"),l=i.num("usable_energy"),a=l!==null&&r?l/r*100:null,c=o!==null&&Math.abs(o)>ve,u=c&&o<0;return m`
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
            .soc=${s}
            .usable=${a}
            caption=${e("core.soc_bms")}
            sub=${a===null?"":e("core.soc_usable",{value:t.num(a,1)})}
          ></mk-gauge>

          <div class="split">
            <div>
              <div class="label">${e("core.stored")}</div>
              <div class="value">
                ${t.num(n,2)}<span class="unit">kWh</span>
              </div>
            </div>
            <div>
              <div class="label">${e("core.capacity")}</div>
              <div class="value" style="color:var(--mk-fg-2)">
                ${t.num(r,2)}<span class="unit">kWh</span>
              </div>
            </div>
            <div>
              <div class="label">${i.label("runtime_to_empty")}</div>
              <div class="value">
                ${t.num(i.num("runtime_to_empty"),1)}<span class="unit">h</span>
              </div>
            </div>
          </div>

          <div
            class="flow ${c?"":"rest"}"
            style=${c?`color: var(${u?"--mk-magenta":"--mk-accent"})`:""}
          >
            ${c?u?"▼":"▲":"•"}
            ${t.num(o===null?null:Math.abs(o),0)} W
          </div>
          <div class="label" style="margin-top:2px">
            ${e(c?u?"core.discharging_to_house":"core.charging_from_grid":"core.at_rest")}
            ${i.str("inverter_state")?` · ${i.str("inverter_state")}`:""}
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
          value=${t.num(i.num("total_daily_charging_energy"),2)}
          unit="kWh"
        ></mk-stat>
        <mk-stat
          label=${e("core.today_discharged")}
          value=${t.num(i.num("total_daily_discharging_energy"),2)}
          unit="kWh"
          tone="magenta"
        ></mk-stat>
        ${this.deltaTile()}
        <mk-stat
          label=${e("core.internal_temp")}
          value=${t.num(i.num("internal_temperature"),1)}
          unit="°C"
          tone="ok"
        ></mk-stat>
        <mk-stat
          label=${e("core.mppt_total")}
          value=${t.num(i.sum(["mppt1_power","mppt2_power","mppt3_power","mppt4_power"]),0)}
          unit="W"
        ></mk-stat>
        <mk-stat
          label=${i.label("round_trip_efficiency_total")}
          value=${t.num(i.num("round_trip_efficiency_total"),1)}
          unit="%"
          .bar=${i.num("round_trip_efficiency_total")}
          .max=${100}
        ></mk-stat>
      </div>
    `}kv(i,t){const e=this.reader;if(!e.entityId(i))return d;const s=e.num(i),r=e.unit(i);return m`
      <div class="kv">
        <span>${e.label(i)}</span>
        <b>${this.fmt.num(s,t)}${r?` ${r}`:""}</b>
      </div>
    `}deltaTile(){const i=this.reader,t=i.packCount(),e=[],s=[];for(let o=1;o<=t;o++){const l=i.num(`battery_${o}_max_cell_voltage`),a=i.num(`battery_${o}_min_cell_voltage`);l!==null&&e.push(l),a!==null&&s.push(a)}const r=e.length&&s.length?Math.max(...e)-Math.min(...s):null,n=r===null?"":r>.1?"crit":r>.05?"warn":"ok";return m`
      <mk-stat
        label=${this.t("core.cell_delta")}
        value=${this.fmt.millivolts(r)}
        unit="mV"
        tone=${n}
        .bar=${r}
        .max=${.1}
        foot=${t?this.t("core.pack_spread",{count:t}):this.t("core.no_delta")}
      ></mk-stat>
    `}};O.styles=[Z,N`
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
    `];J([f({attribute:!1})],O.prototype,"reader",2);J([f({attribute:!1})],O.prototype,"fmt",2);J([f({attribute:!1})],O.prototype,"t",2);O=J([G("mk-view-core")],O);var ge=Object.defineProperty,$e=Object.getOwnPropertyDescriptor,R=(i,t,e,s)=>{for(var r=s>1?void 0:s?$e(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&ge(t,e,r),r};const S=["core","cells","packs","solar","energy","system"],_e=new Set(["core"]);let b=class extends _{constructor(){super(...arguments),this.narrow=!1,this.tab="core",this.strings=H,this.deviceId=null,this.catalogueFor="",this.formatter=new yt("en"),this.t=(i,t)=>ae(this.strings,i,t)}willUpdate(i){if(!i.has("hass")||!this.hass)return;this.toggleAttribute("light",!this.hass.themes?.darkMode);const t=this.hass.language||"en";t!==this.catalogueFor&&(this.catalogueFor=t,this.formatter=new yt(t),oe(t).then(e=>{this.catalogueFor===t&&(this.strings=e)}))}get devices(){return this.hass?te(this.hass):[]}get device(){const i=this.devices;return i.length?i.find(t=>t.deviceId===this.deviceId)??i[0]:null}render(){if(!this.hass)return d;const i=this.device;if(!i)return m`
        <div class="shell">
          <div class="empty">
            <h2>${this.t("empty.no_device")}</h2>
            <p>${this.t("empty.no_device_hint")}</p>
          </div>
        </div>
      `;const t=new ee(this.hass,i);return m`
      <div class="shell">
        <header>
          <div class="brand">MARSTEK <em>${i.name}</em></div>
          <nav role="tablist" aria-label="Marstek Venus">
            ${S.map(e=>m`
                <button
                  class="tab"
                  role="tab"
                  aria-selected=${this.tab===e}
                  @click=${()=>this.tab=e}
                  @keydown=${s=>this.onTabKey(s,e)}
                >
                  ${this.t(`tab.${e}`)}
                </button>
              `)}
          </nav>
          ${this.statusBar(t)}
        </header>

        <main>${this.renderTab(t)}</main>
      </div>
    `}onTabKey(i,t){const e=i.key==="ArrowRight"?1:i.key==="ArrowLeft"?-1:0;if(!e)return;i.preventDefault();const s=S[(S.indexOf(t)+e+S.length)%S.length];this.tab=s,this.renderRoot.querySelectorAll("button.tab")[S.indexOf(s)]?.focus()}statusBar(i){const t=this.devices,e=this.device?.deviceId,s=i.num("wifi_signal_strength");return m`
      <div class="status">
        ${t.length>1?m`
              <select
                aria-label=${this.t("common.device")}
                @change=${r=>this.deviceId=r.target.value}
              >
                ${t.map(r=>m`
                    <option value=${r.deviceId} ?selected=${r.deviceId===e}>
                      ${r.name}
                    </option>
                  `)}
              </select>
            `:d}
        <span>
          <i class="led ${i.has("battery_soc")?"on":"off"}"></i>
          ${this.t("status.modbus")}
        </span>
        ${s===null?d:m`<span>
              <i class="led on"></i>${this.t("status.wifi")}
              ${this.formatter.num(s,0)} dBm
            </span>`}
        ${i.str("inverter_state")?m`<span>${i.str("inverter_state")}</span>`:d}
      </div>
    `}renderTab(i){return _e.has(this.tab)?m`
      <mk-view-core
        .reader=${i}
        .fmt=${this.formatter}
        .t=${this.t}
      ></mk-view-core>
    `:m`<div class="todo">${this.t(`tab.${this.tab}`)} · …</div>`}};b.styles=[Qt,Z,N`
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
    `];R([f({attribute:!1})],b.prototype,"hass",2);R([f({type:Boolean})],b.prototype,"narrow",2);R([at()],b.prototype,"tab",2);R([at()],b.prototype,"strings",2);R([at()],b.prototype,"deviceId",2);b=R([G("marstek-panel")],b);
