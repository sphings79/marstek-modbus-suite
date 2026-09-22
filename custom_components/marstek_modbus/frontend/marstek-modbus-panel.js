/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ut=globalThis,Lt=ut.ShadowRoot&&(ut.ShadyCSS===void 0||ut.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Wt=Symbol(),Jt=new WeakMap;let ge=class{constructor(t,s,a){if(this._$cssResult$=!0,a!==Wt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o;const s=this.t;if(Lt&&t===void 0){const a=s!==void 0&&s.length===1;a&&(t=Jt.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),a&&Jt.set(s,t))}return t}toString(){return this.cssText}};const De=e=>new ge(typeof e=="string"?e:e+"",void 0,Wt),g=(e,...t)=>{const s=e.length===1?e[0]:t.reduce((a,i,n)=>a+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new ge(s,e,Wt)},Re=(e,t)=>{if(Lt)e.adoptedStyleSheets=t.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(const s of t){const a=document.createElement("style"),i=ut.litNonce;i!==void 0&&a.setAttribute("nonce",i),a.textContent=s.cssText,e.appendChild(a)}},Zt=Lt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let s="";for(const a of t.cssRules)s+=a.cssText;return De(s)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ze,defineProperty:Le,getOwnPropertyDescriptor:We,getOwnPropertyNames:Ie,getOwnPropertySymbols:Ue,getPrototypeOf:je}=Object,kt=globalThis,Xt=kt.trustedTypes,Fe=Xt?Xt.emptyScript:"",He=kt.reactiveElementPolyfillSupport,it=(e,t)=>e,gt={toAttribute(e,t){switch(t){case Boolean:e=e?Fe:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=e!==null;break;case Number:s=e===null?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch{s=null}}return s}},It=(e,t)=>!ze(e,t),Qt={attribute:!0,type:String,converter:gt,reflect:!1,useDefault:!1,hasChanged:It};Symbol.metadata??=Symbol("metadata"),kt.litPropertyMetadata??=new WeakMap;let G=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=Qt){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){const a=Symbol(),i=this.getPropertyDescriptor(t,a,s);i!==void 0&&Le(this.prototype,t,i)}}static getPropertyDescriptor(t,s,a){const{get:i,set:n}=We(this.prototype,t)??{get(){return this[s]},set(r){this[s]=r}};return{get:i,set(r){const l=i?.call(this);n?.call(this,r),this.requestUpdate(t,l,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Qt}static _$Ei(){if(this.hasOwnProperty(it("elementProperties")))return;const t=je(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(it("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(it("properties"))){const s=this.properties,a=[...Ie(s),...Ue(s)];for(const i of a)this.createProperty(i,s[i])}const t=this[Symbol.metadata];if(t!==null){const s=litPropertyMetadata.get(t);if(s!==void 0)for(const[a,i]of s)this.elementProperties.set(a,i)}this._$Eh=new Map;for(const[s,a]of this.elementProperties){const i=this._$Eu(s,a);i!==void 0&&this._$Eh.set(i,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const s=[];if(Array.isArray(t)){const a=new Set(t.flat(1/0).reverse());for(const i of a)s.unshift(Zt(i))}else t!==void 0&&s.push(Zt(t));return s}static _$Eu(t,s){const a=s.attribute;return a===!1?void 0:typeof a=="string"?a:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const a of s.keys())this.hasOwnProperty(a)&&(t.set(a,this[a]),delete this[a]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Re(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,s,a){this._$AK(t,a)}_$ET(t,s){const a=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,a);if(i!==void 0&&a.reflect===!0){const n=(a.converter?.toAttribute!==void 0?a.converter:gt).toAttribute(s,a.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,s){const a=this.constructor,i=a._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=a.getPropertyOptions(i),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:gt;this._$Em=i;const l=r.fromAttribute(s,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,s,a,i=!1,n){if(t!==void 0){const r=this.constructor;if(i===!1&&(n=this[t]),a??=r.getPropertyOptions(t),!((a.hasChanged??It)(n,s)||a.useDefault&&a.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,a))))return;this.C(t,s,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,s,{useDefault:a,reflect:i,wrapped:n},r){a&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),n!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||a||(s=void 0),this._$AL.set(t,s)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const a=this.constructor.elementProperties;if(a.size>0)for(const[i,n]of a){const{wrapped:r}=n,l=this[i];r!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(s)):this._$EM()}catch(a){throw t=!1,this._$EM(),a}t&&this._$AE(s)}willUpdate(t){}_$AE(t){this._$EO?.forEach(s=>s.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(s=>this._$ET(s,this[s])),this._$EM()}updated(t){}firstUpdated(t){}};G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[it("elementProperties")]=new Map,G[it("finalized")]=new Map,He?.({ReactiveElement:G}),(kt.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=globalThis,te=e=>e,vt=Ut.trustedTypes,ee=vt?vt.createPolicy("lit-html",{createHTML:e=>e}):void 0,ve="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,be="?"+U,Ve=`<${be}>`,K=document,nt=()=>K.createComment(""),rt=e=>e===null||typeof e!="object"&&typeof e!="function",jt=Array.isArray,Be=e=>jt(e)||typeof e?.[Symbol.iterator]=="function",xt=`[ 	
\f\r]`,et=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,se=/-->/g,ae=/>/g,V=RegExp(`>|${xt}(?:([^\\s"'>=/]+)(${xt}*=${xt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ie=/'/g,ne=/"/g,ke=/^(?:script|style|textarea|title)$/i,$e=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),o=$e(1),re=$e(2),J=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),oe=new WeakMap,B=K.createTreeWalker(K,129);function ye(e,t){if(!jt(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ee!==void 0?ee.createHTML(t):t}const Ke=(e,t)=>{const s=e.length-1,a=[];let i,n=t===2?"<svg>":t===3?"<math>":"",r=et;for(let l=0;l<s;l++){const c=e[l];let d,m,u=-1,f=0;for(;f<c.length&&(r.lastIndex=f,m=r.exec(c),m!==null);)f=r.lastIndex,r===et?m[1]==="!--"?r=se:m[1]!==void 0?r=ae:m[2]!==void 0?(ke.test(m[2])&&(i=RegExp("</"+m[2],"g")),r=V):m[3]!==void 0&&(r=V):r===V?m[0]===">"?(r=i??et,u=-1):m[1]===void 0?u=-2:(u=r.lastIndex-m[2].length,d=m[1],r=m[3]===void 0?V:m[3]==='"'?ne:ie):r===ne||r===ie?r=V:r===se||r===ae?r=et:(r=V,i=void 0);const v=r===V&&e[l+1].startsWith("/>")?" ":"";n+=r===et?c+Ve:u>=0?(a.push(d),c.slice(0,u)+ve+c.slice(u)+U+v):c+U+(u===-2?l:v)}return[ye(e,n+(e[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),a]};class ot{constructor({strings:t,_$litType$:s},a){let i;this.parts=[];let n=0,r=0;const l=t.length-1,c=this.parts,[d,m]=Ke(t,s);if(this.el=ot.createElement(d,a),B.currentNode=this.el.content,s===2||s===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=B.nextNode())!==null&&c.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(ve)){const f=m[r++],v=i.getAttribute(u).split(U),I=/([.?@])?(.*)/.exec(f);c.push({type:1,index:n,name:I[2],strings:v,ctor:I[1]==="."?Ge:I[1]==="?"?Ye:I[1]==="@"?Je:$t}),i.removeAttribute(u)}else u.startsWith(U)&&(c.push({type:6,index:n}),i.removeAttribute(u));if(ke.test(i.tagName)){const u=i.textContent.split(U),f=u.length-1;if(f>0){i.textContent=vt?vt.emptyScript:"";for(let v=0;v<f;v++)i.append(u[v],nt()),B.nextNode(),c.push({type:2,index:++n});i.append(u[f],nt())}}}else if(i.nodeType===8)if(i.data===be)c.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(U,u+1))!==-1;)c.push({type:7,index:n}),u+=U.length-1}n++}}static createElement(t,s){const a=K.createElement("template");return a.innerHTML=t,a}}function Z(e,t,s=e,a){if(t===J)return t;let i=a!==void 0?s._$Co?.[a]:s._$Cl;const n=rt(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(e),i._$AT(e,s,a)),a!==void 0?(s._$Co??=[])[a]=i:s._$Cl=i),i!==void 0&&(t=Z(e,i._$AS(e,t.values),i,a)),t}class qe{constructor(t,s){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:s},parts:a}=this._$AD,i=(t?.creationScope??K).importNode(s,!0);B.currentNode=i;let n=B.nextNode(),r=0,l=0,c=a[0];for(;c!==void 0;){if(r===c.index){let d;c.type===2?d=new dt(n,n.nextSibling,this,t):c.type===1?d=new c.ctor(n,c.name,c.strings,this,t):c.type===6&&(d=new Ze(n,this,t)),this._$AV.push(d),c=a[++l]}r!==c?.index&&(n=B.nextNode(),r++)}return B.currentNode=K,i}p(t){let s=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(t,a,s),s+=a.strings.length-2):a._$AI(t[s])),s++}}class dt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,s,a,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=a,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&t?.nodeType===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=Z(this,t,s),rt(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==J&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Be(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&rt(this._$AH)?this._$AA.nextSibling.data=t:this.T(K.createTextNode(t)),this._$AH=t}$(t){const{values:s,_$litType$:a}=t,i=typeof a=="number"?this._$AC(t):(a.el===void 0&&(a.el=ot.createElement(ye(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===i)this._$AH.p(s);else{const n=new qe(i,this),r=n.u(this.options);n.p(s),this.T(r),this._$AH=n}}_$AC(t){let s=oe.get(t.strings);return s===void 0&&oe.set(t.strings,s=new ot(t)),s}k(t){jt(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let a,i=0;for(const n of t)i===s.length?s.push(a=new dt(this.O(nt()),this.O(nt()),this,this.options)):a=s[i],a._$AI(n),i++;i<s.length&&(this._$AR(a&&a._$AB.nextSibling,i),s.length=i)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const a=te(t).nextSibling;te(t).remove(),t=a}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class $t{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,s,a,i,n){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=s,this._$AM=i,this.options=n,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=h}_$AI(t,s=this,a,i){const n=this.strings;let r=!1;if(n===void 0)t=Z(this,t,s,0),r=!rt(t)||t!==this._$AH&&t!==J,r&&(this._$AH=t);else{const l=t;let c,d;for(t=n[0],c=0;c<n.length-1;c++)d=Z(this,l[a+c],s,c),d===J&&(d=this._$AH[c]),r||=!rt(d)||d!==this._$AH[c],d===h?t=h:t!==h&&(t+=(d??"")+n[c+1]),this._$AH[c]=d}r&&!i&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ge extends $t{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}}class Ye extends $t{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}}class Je extends $t{constructor(t,s,a,i,n){super(t,s,a,i,n),this.type=5}_$AI(t,s=this){if((t=Z(this,t,s,0)??h)===J)return;const a=this._$AH,i=t===h&&a!==h||t.capture!==a.capture||t.once!==a.once||t.passive!==a.passive,n=t!==h&&(a===h||i);i&&this.element.removeEventListener(this.name,this,a),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Ze{constructor(t,s,a){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const Xe=Ut.litHtmlPolyfillSupport;Xe?.(ot,dt),(Ut.litHtmlVersions??=[]).push("3.3.3");const Qe=(e,t,s)=>{const a=s?.renderBefore??t;let i=a._$litPart$;if(i===void 0){const n=s?.renderBefore??null;a._$litPart$=i=new dt(t.insertBefore(nt(),n),n,void 0,s??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ft=globalThis;class $ extends G{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Qe(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return J}}$._$litElement$=!0,$.finalized=!0,Ft.litElementHydrateSupport?.({LitElement:$});const ts=Ft.litElementPolyfillSupport;ts?.({LitElement:$});(Ft.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const k=e=>(t,s)=>{s!==void 0?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const es={attribute:!0,type:String,converter:gt,reflect:!1,hasChanged:It},ss=(e=es,t,s)=>{const{kind:a,metadata:i}=s;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),a==="setter"&&((e=Object.create(e)).wrapped=!0),n.set(s.name,e),a==="accessor"){const{name:r}=s;return{set(l){const c=t.get.call(this);t.set.call(this,l),this.requestUpdate(r,c,e,!0,l)},init(l){return l!==void 0&&this.C(r,void 0,e,l),l}}}if(a==="setter"){const{name:r}=s;return function(l){const c=this[r];t.call(this,l),this.requestUpdate(r,c,e,!0,l)}}throw Error("Unsupported decorator location: "+a)};function p(e){return(t,s)=>typeof s=="object"?ss(e,t,s):((a,i,n)=>{const r=i.hasOwnProperty(n);return i.constructor.createProperty(n,a),r?Object.getOwnPropertyDescriptor(i,n):void 0})(e,t,s)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function y(e){return p({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const as=(e,t,s)=>(s.configurable=!0,s.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,s),s);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function is(e,t){return(s,a,i)=>{const n=r=>r.renderRoot?.querySelector(e)??null;return as(s,a,{get(){return n(this)}})}}const ns=g`
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
`,b=g`
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
`,rs="marstek_modbus";function os(e){const t=new Map;for(const s of Object.values(e.entities)){if(s.platform!==rs||!s.device_id||!s.translation_key)continue;let a=t.get(s.device_id);if(!a){const i=e.devices[s.device_id];a={deviceId:s.device_id,name:i?.name_by_user||i?.name||"Marstek Venus",byKey:{}},t.set(s.device_id,a)}a.byKey[s.translation_key]=s.entity_id}return[...t.values()].sort((s,a)=>s.name.localeCompare(a.name))}const _e=3;class ls{constructor(t,s){this.hass=t,this.device=s}get name(){return this.device.name}entityId(t){return this.device.byKey[t]}has(t){return this.state(t)!==null}state(t){const s=this.device.byKey[t];if(!s)return null;const a=this.hass.states[s];return!a||a.state==="unavailable"||a.state==="unknown"?null:a}num(t){const s=this.state(t);if(!s)return null;const a=Number(s.state);return Number.isFinite(a)?a:null}str(t){return this.state(t)?.state??null}unit(t){return this.state(t)?.attributes.unit_of_measurement??""}rawState(t){const s=this.device.byKey[t];return s&&this.hass.states[s]||null}attr(t,s,a){return this.rawState(t)?.attributes[s]??a}writable(t){const s=this.rawState(t);return!!s&&s.state!=="unavailable"}label(t){const s=this.hass.states[this.device.byKey[t]??""]?.attributes.friendly_name;if(!s)return t;const a=this.device.name;return a&&s.startsWith(a)&&s.length>a.length+1?s.slice(a.length).trim():s}sum(t){let s=0,a=!1;for(const i of t){const n=this.num(i);n!==null&&(s+=n,a=!0)}return a?s:null}firstKey(t){return t.find(s=>this.entityId(s))??null}inverterState(t){const a=this.num("battery_power"),i=this.num("ac_power"),n=a!==null&&a>30,r=i!==null&&i>30;return n&&r?t?t("core.pv_passthrough"):"PV Passthrough":this.str("inverter_state")}cellsPerPack(){let t=0;for(let s=1;s<=32;s++)this.device.byKey[`battery_1_cell_${s}_voltage`]&&(t=s);return t}conductingPack(){for(let t=1;t<=this.packCount();t++)if(this.num(`battery_${t}_mos_status`)===_e)return t;return null}packCount(){let t=0;for(;this.device.byKey[`battery_${t+1}_max_cell_voltage`];)t++;let s=0;for(let a=1;a<=t;a++){const i=this.num(`battery_${a}_max_cell_voltage`);i!==null&&i>0&&(s=a)}return s||t}}class cs{constructor(t,s){this.hass=t,this.reader=s}call(t,s,a,i){const n=this.reader.entityId(a);n&&this.hass.callService(t,s,{entity_id:n,...i})}setNumber(t,s){this.call("number","set_value",t,{value:s})}selectOption(t,s){this.call("select","select_option",t,{option:s})}setSwitch(t,s){this.call("switch",s?"turn_on":"turn_off",t,{})}press(t){this.call("button","press",t,{})}}const ds="modulepreload",ps=function(e){return"/"+e},le={},hs=function(t,s,a){let i=Promise.resolve();if(s&&s.length>0){let r=function(d){return Promise.all(d.map(m=>Promise.resolve(m).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=l?.nonce||l?.getAttribute("nonce");i=r(s.map(d=>{if(d=ps(d),d in le)return;le[d]=!0;const m=d.endsWith(".css"),u=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${u}`))return;const f=document.createElement("link");if(f.rel=m?"stylesheet":ds,m||(f.as="script"),f.crossOrigin="",f.href=d,c&&f.setAttribute("nonce",c),document.head.appendChild(f),m)return new Promise((v,I)=>{f.addEventListener("load",v),f.addEventListener("error",()=>I(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return i.then(r=>{for(const l of r||[])l.status==="rejected"&&n(l.reason);return t().catch(n)})},lt={"tab.core":"OVERVIEW","tab.cells":"CELLS","tab.packs":"PACKS","tab.solar":"SOLAR","tab.energy":"ENERGY","tab.system":"SYSTEM","tab.control":"CONTROL","control.power":"Power now","control.power_hint":"These two set the working point directly. Anything that regulates the battery from outside — a zero-feed-in automation, an energy manager — writes the same registers and will win within seconds.","control.limits":"Limits","control.limits_hint":"After the device restarts these three often read 0. The limit set earlier still applies and does not have to be written again.","control.mode":"Mode","control.mode_hint":"Has no effect while the device is being controlled over Modbus.","control.polling":"Polling","control.polling_hint":"Stops this battery being read at all and closes the connection, for a device switched off over the winter. Paused entities either keep their last reading or go unavailable, whichever you pick here. Readings are not restored after a Home Assistant restart.","control.backup_hint":"Switches the backup socket on and off.","control.rs485_hint":"Has to be on before the device takes Modbus control at all — from this page, from an automation, or from the integration. Switched off, the device regulates itself again.","control.overwritten":"Something else changed {names} right after this panel did. An external controller is writing the same registers.","control.schedules":"Schedules","control.schedules_axis":"times are the device's own, in its local time","control.schedules_hint":"A schedule needs a window, a power and a day before switching it on does anything. Power is signed: the sign decides the direction. The device takes one day per schedule, not a set of them.","control.no_schedules":"This battery exposes no schedules.","control.window":"Window","control.sched_power":"Power","control.days":"Day","control.active":"On","control.unset":"not set","control.device":"Device","control.reset":"Restart device","control.reset_confirm":"Really restart","control.reset_title":"Restart device?","control.reset_message":"The battery drops the connection and restarts. Until it is back there are no readings, and it cannot be controlled either. The limits you set still apply afterwards.","control.cancel":"Cancel","control.opt.manual":"Manual","control.opt.anti_feed":"Anti-feed","control.opt.trade_mode":"Trade","control.opt.standby":"Standby","control.opt.charge":"Charge","control.opt.discharge":"Discharge","control.opt.active":"On","control.opt.paused_unavailable":"Paused · entities unavailable","control.opt.paused_frozen":"Paused · entities frozen","control.day.monday":"Mon","control.day.tuesday":"Tue","control.day.wednesday":"Wed","control.day.thursday":"Thu","control.day.friday":"Fri","control.day.saturday":"Sat","control.day.sunday":"Sun","status.modbus":"MODBUS","status.modbus_offline":"MODBUS OFFLINE","status.modbus_offline_since":"MODBUS OFFLINE · last answer {time}","status.modbus_paused":"MODBUS PAUSED","status.modbus_paused_hint":"Polling is switched off for this battery. Nothing is being read, and the values below are whatever was last seen.","status.modbus_offline_hint":"The battery is not answering. Every value below is the last one read before the link dropped.","status.modbus_degraded":"The link answers, but registers timed out in the last poll.","common.pack":"PACK","common.pack_n":"pack {pack}","common.standby":"standby","common.voltage":"Voltage","common.current":"Current","common.device":"Device","core.electrical":"Electrical · now","core.reserve":"Reserve · lifetime","core.stored":"Stored","core.capacity":"Capacity","core.stored_of_total":"Stored / total","core.usable":"Usable energy","core.to_full":"Energy to full","core.pv_passthrough":"PV Passthrough","core.runtime":"Runtime","core.to_empty":"Until empty","core.until_full":"Until full","core.packs":"Packs","core.soc_bms":"SOC · BMS","core.soc_usable":"usable {value} %","core.discharging_to_house":"discharging","core.charging_from_grid":"charging","core.at_rest":"at rest","core.today_charged":"Charged today","core.today_discharged":"Discharged today","core.cell_delta":"Largest cell delta","core.internal_temp":"Device temperature","core.mppt_total":"MPPT total","core.in_pack":"in pack {pack}","core.no_delta":"no per-pack readings","cells.highest":"Highest cell","cells.lowest":"Lowest cell","cells.in_pack":"pack {pack}","cells.stack_spread":"Spread across stack","cells.stack_hint":"packs charge in turn, so a spread is expected","cells.mean_delta":"Mean delta in pack","cells.worst_pack":"widest: pack {pack}, {value} mV","cells.temp_span":"Cell temperature span","cells.packs_online":"Packs reporting","cells.cells_total":"{count} cells","cells.matrix_title":"Cell voltage range per pack · shared axis","cells.matrix_axis":"bar = lowest to highest cell","cells.matrix_legend":"The tick inside each bar is the pack's midpoint. A narrow bar is a balanced pack, a wide one is drift inside it, and a bar sitting apart from the others is a pack at a different level than the rest.","cells.no_ranges":"This battery reports no per-pack cell voltages.","cells.protection":"Protection and faults","cells.protection_all":"Protection · all {count} packs","cells.clear":"clear","cells.conducting":"Pack conducting","cells.conducting_none":"none — every pack disconnected","cells.conducting_hint":"The device works one pack at a time and closes that pack's MOSFETs while it does. A pack listed here is doing the work, not reporting a fault.","cells.mos_unexpected":"unexpected MOSFET status","cells.raised":"raised","cells.bms":"BMS","cells.bms_version":"BMS version","cells.uniform":"same on every pack","packs.device_reading":"as the device reports it","packs.mean_soc":"Mean of the packs","packs.from_n_packs":"from {count} packs","packs.spread":"Spread","packs.stored_total":"Stored energy","packs.of_max":"of {value} kWh possible","packs.per_pack":"Per pack","packs.nominal":"nominal, capacity ÷ packs","packs.cycles_mean":"Cycles","packs.cycles_basis":"mean across packs","packs.cycles_partial":"{have} of {total} packs report","packs.fill_title":"State of charge per pack","packs.fill_axis":"column height = SOC","packs.fill_legend":"The dashed line marks the discharge floor at {floor} %. Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.","packs.fill_legend_backup":"The dotted line at {backup} % is as far as the backup socket discharges during an outage.","packs.fill_legend_nofloor":"Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.","packs.none":"This battery reports no per-pack state of charge.","packs.table_title":"Every pack in detail","packs.table_legend":"Nothing is highlighted until the spread above reaches {spread} %; then the packs further than {points} % from the median pack are. While the stack stays together, columns and rows stay quiet. A pack that reports a high SOC at a low cell voltage is worth a second look: the two readings disagree.","packs.conducting":"conducting now","packs.col_soc":"SOC","packs.col_energy":"kWh","packs.col_min":"Cell min","packs.col_max":"Cell max","packs.col_delta":"Delta","packs.col_voltage":"Voltage","packs.col_current":"Current","packs.col_cycles":"Cycles","packs.col_mos":"MOSFET","packs.col_env":"Ambient","packs.col_ntc":"NTC 1–4","solar.active":"ACTIVE","solar.floating":"FLOATING","solar.summary":"All inputs","solar.some_active":"carrying power","solar.all_idle":"nothing connected","solar.note_active":"Voltage follows the panels and power follows the sun through the day.","solar.note_floating":"All inputs sit at a low voltage without current, which is what an unused MPPT input looks like. Connect panels and the voltage rises to module level.","solar.diagnostics":"Diagnostics","solar.channels_reporting":"Inputs reporting","solar.none":"This battery has no MPPT inputs.","energy.today":"Today","energy.month":"This month","energy.lifetime":"Since commissioning","energy.charged":"charged kWh","energy.discharged":"discharged kWh","energy.loss":"Loss","energy.returned":"Returned","energy.rte":"Round trip","energy.rte_hint":"Round-trip efficiency is how much of the energy put into the battery comes back out of it. Conversion efficiency is the loss in the moment, at the current operating point.","energy.efficiency":"Efficiency compared","energy.throughput":"Throughput and wear","energy.gap_hint":"The monthly figure sits {value} points below the lifetime one. That gap is not conversion loss but standby draw between cycles: the shallower the cycling, the heavier it weighs.","system.no_faults":"No fault register is raised.","system.faults_raised":"Raised: {list}","system.device":"Device","system.packs":"Battery packs","system.firmware":"Firmware","system.connection":"Connection","system.faults":"Fault registers","system.control":"Control and limits","system.thermal":"Thermal and electrical","system.ceiling_used":"The panel treats {value} % as the charge ceiling, read from this register.","system.ceiling_ignored":"This register reads {value} %, outside its own 10-100 range, so the device is not using it. The panel charges towards 100 % instead.","settings.title":"Settings","settings.scheme":"Colour scheme","settings.scheme_hint":"Each scheme brings its own light and dark version. The swatch is painted in the scheme it offers.","settings.scheme_theme":"follows your theme","settings.appearance":"Appearance","settings.mode":"Light or dark","settings.mode.auto":"Home Assistant","settings.mode.dark":"Dark","settings.mode.light":"Light","settings.mode_ha":"This scheme takes its colours from your Home Assistant theme, which already decides light or dark.","settings.digits":"Decimal places","settings.digits.normal":"Normal","settings.digits.more":"One more","settings.spread":"Pack spread","settings.spread_hint":"When the packs count as having drifted apart. The device works one pack at a time, so during normal operation they routinely sit a good ten points apart — that is the design working. The table only marks individual packs once the spread itself reaches the warning level.","settings.spread_warn":"Warn above","settings.spread_crit":"Critical above","settings.start_tab":"Tab when opening","settings.start_tab.last":"Last used","settings.start_tab_hint":"A fixed tab that the battery cannot fill falls back to the overview.","settings.tabs":"Tabs","settings.tabs_hint":"Greyed out means this battery does not report what the tab shows, so hiding it is not a choice you have to make.","settings.always":"always shown","settings.unavail.cells":"no per-cell voltages","settings.unavail.packs":"no state of charge per pack","settings.unavail.solar":"no PV inputs","settings.unavail.control":"no writable registers","settings.scale":"Scale","settings.width":"Content width","settings.width.full":"Full width","settings.screen_hint":"Scale and width belong to this browser: a phone and a 4K monitor want different answers, so they are not carried across devices or included in the export.","settings.storage":"Stored settings","settings.reset":"Reset to defaults","settings.transfer":"Import / export","settings.transfer_hint":"Copy this out, paste it in somewhere else. Scale and width are not part of it.","settings.transfer_bad":"That is not a settings object.","settings.import":"Apply pasted","settings.export_again":"Show current","settings.storage_hint":"Everything except scale and width is stored in Home Assistant under your user, so the same panel follows you to every device. Other people keep their own.","settings.offline":"Home Assistant did not answer, so nothing changed here will be kept. Reload the panel to try again.","empty.no_device":"No Marstek battery found","empty.no_device_hint":"This panel reads the Marstek Modbus Suite integration. Add a battery there first.","common.unavailable":"—"},we={de:()=>hs(()=>import("./marstek-modbus-lang-de.js"),[]).then(e=>e.de)};["en",...Object.keys(we)].sort();const mt={en:lt};function ms(e){return e.split("-")[0].toLowerCase()}async function us(e){const t=ms(e);if(mt[t])return mt[t];const s=we[t];if(!s)return lt;try{return mt[t]=await s(),mt[t]}catch{return lt}}function fs(e,t,s){let a=e[t]??lt[t]??t;if(s)for(const[i,n]of Object.entries(s))a=a.replace(`{${i}}`,String(n));return a}const st="—";class ce{constructor(t,s=0){this.language=t,this.extra=s,this.cache=new Map}get extraDigits(){return this.extra}formatter(t){const s=String(t);let a=this.cache.get(s);return a||(a=new Intl.NumberFormat(this.language||"en",{minimumFractionDigits:t,maximumFractionDigits:t}),this.cache.set(s,a)),a}num(t,s=0){return t==null||!Number.isFinite(t)?st:this.formatter(s+this.extra).format(t)}signed(t,s=0){if(t==null||!Number.isFinite(t))return st;const a=this.formatter(s+this.extra).format(Math.abs(t));return t>0?`+${a}`:t<0?`−${a}`:a}version(t){return t==null||t===""?st:/^\d{4}$/.test(t)?`${t.slice(0,3)}.${t.slice(3)}`:t}duration(t){if(t==null||!Number.isFinite(t))return st;const s=Math.round(Math.abs(t)*60),a=Math.floor(s/60),i=s%60,n=t<0?"−":"";return a===0?`${n}${this.formatter(0).format(i)} min`:i===0?`${n}${this.formatter(0).format(a)} h`:`${n}${this.formatter(0).format(a)} h ${this.formatter(0).format(i)} min`}millivolts(t){return t==null||!Number.isFinite(t)?st:this.formatter(0).format(Math.round(t*1e3))}}var gs=Object.defineProperty,Ht=(e,t,s,a)=>{for(var i=void 0,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=r(t,s,i)||i);return i&&gs(t,s,i),i};const Gt=class Gt extends ${kv(t,s=1,a={}){const i=this.reader;if(!i.entityId(t))return h;const n=i.state(t);if(!n)return h;if(a.version)return o`
        <div class="kv">
          <span>${a.label??i.label(t)}</span>
          <b class=${a.tone??""}>${this.fmt.version(n.state)}</b>
        </div>
      `;const r=a.raw?null:i.num(t),l=i.unit(t),c=r===null?n.state:`${this.fmt.num(r,s)}${l?` ${l}`:""}`;return o`
      <div class="kv">
        <span>${a.label??i.label(t)}</span>
        <b class=${a.tone??""}>${c}</b>
      </div>
    `}kvFirst(t,s=1,a={}){const i=t.find(n=>this.reader.entityId(n));return i?this.kv(i,s,a):h}packElectrical(){const t=this.reader;if(!t.entityId("battery_1_voltage"))return[this.kv("battery_voltage",2),this.kv("battery_current",2)];const s=t.conductingPack(),a=s===null?this.t("common.standby"):this.t("common.pack_n",{pack:s});if(s===null){const i=this.t("common.unavailable");return[this.row(`${this.t("common.voltage")} · ${a}`,i),this.row(`${this.t("common.current")} · ${a}`,i)]}return[this.kv(`battery_${s}_voltage`,2,{label:`${this.t("common.voltage")} · ${a}`}),this.kv(`battery_${s}_current`,2,{label:`${this.t("common.current")} · ${a}`})]}row(t,s,a=""){return o`
      <div class="kv">
        <span>${t}</span>
        <b class=${a}>${s}</b>
      </div>
    `}unitOf(...t){for(const s of t){const a=this.reader.unit(s);if(a)return a}return""}get packs(){return Array.from({length:this.reader.packCount()},(t,s)=>s+1)}};Gt.styles=[b];let S=Gt;Ht([p({attribute:!1})],S.prototype,"reader");Ht([p({attribute:!1})],S.prototype,"fmt");Ht([p({attribute:!1})],S.prototype,"t");var vs=Object.defineProperty,bs=Object.getOwnPropertyDescriptor,pt=(e,t,s,a)=>{for(var i=a>1?void 0:a?bs(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&vs(t,s,i),i};const At=118,Ct=97,ks=2*Math.PI*At,$s=2*Math.PI*Ct;let q=class extends ${constructor(){super(...arguments),this.soc=null,this.usable=null,this.caption="",this.sub=""}arc(e,t){const s=e===null?0:Math.min(Math.max(e,0),100);return`${t*s/100} ${t}`}render(){const e=this.soc===null?"—":Math.round(this.soc).toString();return o`
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

        <circle class="track" cx="150" cy="134" r=${At} stroke-width="15" />
        <circle
          class="arc-outer"
          cx="150"
          cy="134"
          r=${At}
          stroke-width="15"
          stroke-dasharray=${this.arc(this.soc,ks)}
          transform="rotate(-90 150 134)"
        />

        ${this.usable===null?h:re`
              <circle class="track" cx="150" cy="134" r=${Ct} stroke-width="5" />
              <circle
                class="arc-inner"
                cx="150" cy="134" r=${Ct} stroke-width="5"
                stroke-dasharray=${this.arc(this.usable,$s)}
                transform="rotate(-90 150 134)"
              />
            `}

        <text class="num" x="146" y="132" text-anchor="middle">${e}</text>
        <text class="pct" x="196" y="132" text-anchor="start">%</text>
        <text class="cap" x="150" y="158" text-anchor="middle">${this.caption}</text>
        ${this.sub?re`<text class="sub" x="150" y="186" text-anchor="middle">${this.sub}</text>`:h}
      </svg>
    `}};q.styles=[b,g`
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
    `];pt([p({type:Number})],q.prototype,"soc",2);pt([p({type:Number})],q.prototype,"usable",2);pt([p({type:String})],q.prototype,"caption",2);pt([p({type:String})],q.prototype,"sub",2);q=pt([k("mk-gauge")],q);var ys=Object.defineProperty,_s=Object.getOwnPropertyDescriptor,j=(e,t,s,a)=>{for(var i=a>1?void 0:a?_s(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&ys(t,s,i),i};let E=class extends ${constructor(){super(...arguments),this.label="",this.value="—",this.unit="",this.foot="",this.tone="",this.bar=null,this.max=null}get fill(){return this.bar===null||this.max===null||this.max===0?null:Math.min(Math.max(this.bar/this.max*100,0),100)}render(){const e=this.fill;return o`
      <div class="label">${this.label}</div>
      <div class="num ${this.tone}">
        ${this.value}${this.unit?o`<span class="unit">${this.unit}</span>`:h}
      </div>
      ${e===null?h:o`<div class="track"><i style="width:${e}%"></i></div>`}
      ${this.foot?o`<div class="foot">${this.foot}</div>`:h}
    `}};E.styles=[b,g`
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
    `];j([p({type:String})],E.prototype,"label",2);j([p({type:String})],E.prototype,"value",2);j([p({type:String})],E.prototype,"unit",2);j([p({type:String})],E.prototype,"foot",2);j([p({type:String})],E.prototype,"tone",2);j([p({type:Number})],E.prototype,"bar",2);j([p({type:Number})],E.prototype,"max",2);E=j([k("mk-stat")],E);const ws=.05,xe=.1;function Se(e){return e===null?"":e>=xe?"crit":e>=ws?"warn":"ok"}function Ae(e){const t=Se(e);return t==="ok"?"":t}const ht=19,Vt=25,Pt=5,Ot=60,de=1;function xs(e){return e+5}function Ss(e,t=ht,s=Vt){return e===null?"":e>=s?"crit":e>=t?"warn":"ok"}function Ce(e,t,s,a=ht){return e===null||t===null||s===null||s<a?!1:Math.abs(e-t)>a/2}var As=Object.getOwnPropertyDescriptor,Cs=(e,t,s,a)=>{for(var i=a>1?void 0:a?As(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=r(i)||i);return i};const Ps=30;let Tt=class extends S{render(){const e=this.reader,t=this.fmt,s=this.t,a=e.num("battery_soc"),i=e.num("battery_total_energy"),n=e.num("stored_energy"),r=e.num("battery_power"),l=e.num("usable_energy"),c=l!==null&&i?l/i*100:null,d=r!==null&&Math.abs(r)>Ps,m=d&&r<0,u=e.packCount();return o`
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
            .usable=${c}
            caption=${s("core.soc_bms")}
            sub=${c===null?"":s("core.soc_usable",{value:t.num(c,1)})}
          ></mk-gauge>

          <div class="split">
            <div>
              <div class="label">${s("core.stored_of_total")}</div>
              <div class="value">
                ${t.num(n,2)}<span class="of">/ ${t.num(i,2)}</span
                ><span class="unit">kWh</span>
              </div>
            </div>
            ${this.energyCell(d&&!m)}
            ${this.runtimeCell(d,m)}
            ${u?o`<div>
                  <div class="label">${s("core.packs")}</div>
                  <div class="value" style="color:var(--mk-fg-2)">
                    ${t.num(u,0)}
                  </div>
                </div>`:h}
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
          value=${t.num(e.num("internal_temperature"),1)}
          unit=${this.unitOf("internal_temperature")}
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
      </div>
    `}deltaTile(){const e=this.reader;let t=null;for(let a=1;a<=e.packCount();a++){const i=e.num(`battery_${a}_max_cell_voltage`),n=e.num(`battery_${a}_min_cell_voltage`);if(i===null||n===null)continue;const r=i-n;(!t||r>t.delta)&&(t={pack:a,delta:r})}const s=Se(t?.delta??null);return o`
      <mk-stat
        label=${this.t("core.cell_delta")}
        value=${this.fmt.millivolts(t?.delta??null)}
        unit="mV"
        tone=${s}
        .bar=${t?.delta??null}
        .max=${xe}
        foot=${t?this.t("core.in_pack",{pack:t.pack}):this.t("core.no_delta")}
      ></mk-stat>
    `}};Tt.styles=[b,g`
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
    `];Tt=Cs([k("mk-view-core")],Tt);var Os=Object.defineProperty,Ts=Object.getOwnPropertyDescriptor,yt=(e,t,s,a)=>{for(var i=a>1?void 0:a?Ts(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&Os(t,s,i),i};let X=class extends ${constructor(){super(...arguments),this.ranges=[],this.packLabel="PACK",this.formatVolts=e=>e.toFixed(3)}get bounds(){const e=this.ranges.flatMap(i=>[i.min,i.max]);if(!e.length)return{lo:3.2,hi:3.4};const t=Math.min(...e),s=Math.max(...e),a=Math.max((s-t)*.15,.005);return{lo:t-a,hi:s+a}}pct(e){const{lo:t,hi:s}=this.bounds,a=s-t||1;return(e-t)/a*100}render(){if(!this.ranges.length)return h;const{lo:e,hi:t}=this.bounds,s=[0,.25,.5,.75].map(a=>({at:a*100,value:e+(t-e)*a}));return o`
      <div class="axis">
        <div></div>
        <div class="ticks">
          ${s.map(a=>o`<span style="left:${a.at}%">${this.formatVolts(a.value)}</span>`)}
        </div>
        <div class="right"><span class="label">Δ</span></div>
      </div>

      ${this.ranges.map(a=>{const i=a.max-a.min,n=Ae(i),r=this.pct(a.min),l=Math.max(this.pct(a.max)-r,.6),c=this.pct((a.min+a.max)/2);return o`
          <div class="row">
            <div><span class="name ${n}">${this.packLabel} ${a.index}</span></div>
            <div class="rail">
              <i class="bar ${n}" style="left:${r}%;width:${l}%"></i>
              <i class="mid" style="left:${c}%"></i>
            </div>
            <div class="right">
              <span class="delta ${n}">${Math.round(i*1e3)} mV</span>
              ${a.note?o`<span class="label note wide">${a.note}</span>`:h}
            </div>
            <div class="span">
              ${this.formatVolts(a.min)} – ${this.formatVolts(a.max)} V
              ${a.note?o`<span class="label note">${a.note}</span>`:h}
            </div>
          </div>
        `})}
    `}};X.styles=[b,g`
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
    `];yt([p({attribute:!1})],X.prototype,"ranges",2);yt([p({type:String})],X.prototype,"packLabel",2);yt([p({attribute:!1})],X.prototype,"formatVolts",2);X=yt([k("mk-pack-matrix")],X);var Es=Object.getOwnPropertyDescriptor,Ms=(e,t,s,a)=>{for(var i=a>1?void 0:a?Es(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=r(i)||i);return i};const Ns=[0,2,3];let Et=class extends S{get ranges(){const e=this.reader,t=this.unitOf(...this.packs.map(a=>`battery_${a}_mos_temperature`)),s=[];for(const a of this.packs){const i=e.num(`battery_${a}_min_cell_voltage`),n=e.num(`battery_${a}_max_cell_voltage`);if(i===null||n===null)continue;const r=e.num(`battery_${a}_cycle_count`),l=e.num(`battery_${a}_mos_temperature`),c=[r===null?null:`${this.fmt.num(r,0)} ⟳`,l===null?null:`${this.fmt.num(l,1)}${t?` ${t}`:""}`].filter(Boolean).join(" · ");s.push({index:a,min:i,max:n,note:c})}return s}render(){const e=this.reader,t=this.fmt,s=this.t,a=this.ranges,i=a.map(f=>f.max),n=a.map(f=>f.min),r=a.length?Math.max(...i)-Math.min(...n):null,l=a.reduce((f,v)=>!f||v.max-v.min>f.max-f.min?v:f,null),c=a.length*e.cellsPerPack(),d=a.map(f=>f.max-f.min),m=d.length?d.reduce((f,v)=>f+v,0)/d.length:null,u=this.unitOf("max_cell_temperature","min_cell_temperature");return o`
      <div class="grid tiles">
        <mk-stat
          label=${s("cells.highest")}
          value=${t.num(i.length?Math.max(...i):null,3)}
          unit="V"
          foot=${i.length?s("cells.in_pack",{pack:a[i.indexOf(Math.max(...i))].index}):""}
        ></mk-stat>
        <mk-stat
          label=${s("cells.lowest")}
          value=${t.num(n.length?Math.min(...n):null,3)}
          unit="V"
          foot=${n.length?s("cells.in_pack",{pack:a[n.indexOf(Math.min(...n))].index}):""}
        ></mk-stat>
        <mk-stat
          label=${s("cells.stack_spread")}
          value=${t.millivolts(r)}
          unit="mV"
          foot=${s("cells.stack_hint")}
        ></mk-stat>
        <mk-stat
          label=${s("cells.mean_delta")}
          value=${t.millivolts(m)}
          unit="mV"
          foot=${l?s("cells.worst_pack",{pack:l.index,value:t.millivolts(l.max-l.min)}):""}
        ></mk-stat>
        <mk-stat
          label=${s("cells.temp_span")}
          value=${t.num(this.tempSpan(),1)}
          unit=${u}
          foot=${`${t.num(e.num("min_cell_temperature"),1)} – ${t.num(e.num("max_cell_temperature"),1)}${u?` ${u}`:""}`}
        ></mk-stat>
        <mk-stat
          label=${s("cells.packs_online")}
          value=${`${a.length} / ${e.num("bms_pack_count")??a.length}`}
          foot=${c?s("cells.cells_total",{count:c}):""}
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
              ></mk-pack-matrix>
            `:o`<div class="note">${s("cells.no_ranges")}</div>`}
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
    `}tempSpan(){const e=this.reader.num("max_cell_temperature"),t=this.reader.num("min_cell_temperature");return e===null||t===null?null:e-t}protectionRows(){const e=this.reader,t=this.t,s=[],a=[],i=[];for(const n of this.packs){const r=e.num(`battery_${n}_protection_1`),l=e.num(`battery_${n}_protection_2`),c=[];r&&c.push(`P1 ${r}`),l&&c.push(`P2 ${l}`),c.length&&s.push(`${t("common.pack")} ${n}: ${c.join(", ")}`);const d=e.num(`battery_${n}_mos_status`);d===_e?a.push(n):d!==null&&!Ns.includes(d)&&i.push(`${t("common.pack")} ${n}: ${d}`)}return this.packs.length?o`
      ${s.length?s.map(n=>this.row(n,t("cells.raised"),"crit")):this.row(t("cells.protection_all",{count:this.packs.length}),t("cells.clear"),"ok")}
      ${this.row(t("cells.conducting"),a.length?a.map(n=>`${t("common.pack")} ${n}`).join(", "):t("cells.conducting_none"),a.length?"ok":"")}
      ${i.map(n=>this.row(n,t("cells.mos_unexpected"),"warn"))}
      ${this.kv("fault_status",0)} ${this.kv("fault_status_2",0)}
      ${this.bmsVersions()}
      <div class="note">${t("cells.conducting_hint")}</div>
    `:o`<div class="note">${t("cells.no_ranges")}</div>`}bmsVersions(){const e=this.reader,t=new Map;for(const s of this.packs){const a=e.str(`battery_${s}_bms_version`);a!==null&&t.set(a,[...t.get(a)??[],s])}if(!t.size)return h;if(t.size===1){const[s]=[...t.keys()];return this.row(this.t("cells.bms_version"),`${this.fmt.version(s)} · ${this.t("cells.uniform")}`)}return[...t.entries()].map(([s,a])=>this.row(`${this.t("cells.bms_version")} ${this.fmt.version(s)}`,a.map(i=>`#${i}`).join(" "),"warn"))}};Et.styles=[b,g`
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
    `];Et=Ms([k("mk-view-cells")],Et);var Ds=Object.defineProperty,Rs=Object.getOwnPropertyDescriptor,z=(e,t,s,a)=>{for(var i=a>1?void 0:a?Rs(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&Ds(t,s,i),i};let P=class extends ${constructor(){super(...arguments),this.packs=[],this.floor=null,this.backupFloor=null,this.packLabel="PACK",this.energyUnit="kWh",this.formatNumber=e=>e===null?"—":String(e),this.spread=null,this.spreadWarn=ht}fill(e){if(e===null)return"var(--mk-track)";const t=Math.min(Math.max(e,0),100)/100,s=t<.5?4+41*(t/.5):45+95*((t-.5)/.5);return`linear-gradient(180deg, hsl(${s.toFixed(0)} 74% 56%), hsl(${s.toFixed(0)} 68% 43%))`}render(){if(!this.packs.length)return h;const e=this.packs.map(s=>s.soc).filter(s=>s!==null).sort((s,a)=>s-a),t=e.length?e[Math.floor(e.length/2)]:null;return o`
      <div class="scroll">
      <div
        class="rack"
        style="grid-template-columns: repeat(${this.packs.length}, minmax(52px, 1fr))"
      >
        ${this.packs.map(s=>{const a=Ce(s.soc,t,this.spread,this.spreadWarn),i=s.soc===null?0:Math.min(Math.max(s.soc,0),100);return o`
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
    `}};P.styles=[b,g`
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
    `];z([p({attribute:!1})],P.prototype,"packs",2);z([p({type:Number})],P.prototype,"floor",2);z([p({type:Number})],P.prototype,"backupFloor",2);z([p({type:String})],P.prototype,"packLabel",2);z([p({type:String})],P.prototype,"energyUnit",2);z([p({attribute:!1})],P.prototype,"formatNumber",2);z([p({type:Number})],P.prototype,"spread",2);z([p({type:Number})],P.prototype,"spreadWarn",2);P=z([k("mk-pack-bars")],P);var zs=Object.getOwnPropertyDescriptor,Ls=(e,t,s,a)=>{for(var i=a>1?void 0:a?zs(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=r(i)||i);return i};let bt=class extends S{get backupFloor(){if(!this.reader.entityId("backup_reserve_energy"))return null;const e=this.reader.attr("backup_reserve_energy","backup_floor_percent",null);return typeof e=="number"&&e>=0&&e<100?e:null}constructor(){super(),this.floor=null,this.spreadWarn=ht,this.spreadCrit=Vt}get packCapacity(){const e=this.reader.num("battery_total_energy"),t=this.packs.length;return e!==null&&t?e/t:null}get fills(){const e=this.reader,t=this.fmt,s=this.packCapacity;return this.packs.map(a=>{const i=e.num(`battery_soc_${a}`),n=e.num(`battery_${a}_min_cell_voltage`),r=e.num(`battery_${a}_max_cell_voltage`);return{index:a,soc:i,energy:i===null||s===null?null:i/100*s,socLabel:i===null?void 0:`${t.num(i,1)} %`,note:n===null||r===null?void 0:`${t.num(n,3)} – ${t.num(r,3)} V`}})}render(){const e=this.reader,t=this.fmt,s=this.t,a=this.fills,i=a.map(c=>c.soc).filter(c=>c!==null),n=i.length?i.reduce((c,d)=>c+d,0)/i.length:null,r=i.length?Math.max(...i)-Math.min(...i):null,l=this.packs.map(c=>e.num(`battery_${c}_cycle_count`)).filter(c=>c!==null);return o`
      <div class="grid tiles">
        <mk-stat
          label=${e.label("battery_soc")}
          value=${t.num(e.num("battery_soc"),0)}
          unit="%"
          foot=${s("packs.device_reading")}
        ></mk-stat>
        <mk-stat
          label=${s("packs.mean_soc")}
          value=${t.num(n,1)}
          unit="%"
          foot=${s("packs.from_n_packs",{count:a.length})}
        ></mk-stat>
        <mk-stat
          label=${s("packs.spread")}
          value=${t.num(r,1)}
          unit="%"
          tone=${Ss(r,this.spreadWarn,this.spreadCrit)}
          .bar=${r}
          .max=${xs(this.spreadCrit)}
        ></mk-stat>
        <mk-stat
          label=${s("packs.stored_total")}
          value=${t.num(e.num("stored_energy"),2)}
          unit="kWh"
          foot=${e.num("battery_total_energy")===null?"":s("packs.of_max",{value:t.num(e.num("battery_total_energy"),2)})}
        ></mk-stat>
        <mk-stat
          label=${s("packs.per_pack")}
          value=${t.num(this.packCapacity,2)}
          unit="kWh"
          foot=${s("packs.nominal")}
        ></mk-stat>
        <mk-stat
          label=${s("packs.cycles_mean")}
          value=${t.num(l.length?l.reduce((c,d)=>c+d,0)/l.length:null,0)}
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
                .spread=${r}
                .spreadWarn=${this.spreadWarn}
                packLabel=${s("common.pack")}
                energyUnit=${e.unit("battery_total_energy")||"kWh"}
                .formatNumber=${(c,d=0)=>t.num(c,d)}
              ></mk-pack-bars>
            `:o`<div class="note">${s("packs.none")}</div>`}
        <div class="note">
          ${this.floor===null?s("packs.fill_legend_nofloor"):s("packs.fill_legend",{floor:t.num(this.floor,0)})}
          ${this.backupFloor===null?"":` ${s("packs.fill_legend_backup",{backup:t.num(this.backupFloor,0)})}`}
        </div>
      </div>

      ${a.length?this.table(r):h}
    `}table(e){const t=this.reader,s=this.fmt,a=this.t,i=this.packCapacity,n=this.packs.map(d=>t.num(`battery_soc_${d}`)).filter(d=>d!==null).sort((d,m)=>d-m),r=n.length?n[Math.floor(n.length/2)]:null,l=this.unitOf(...this.packs.flatMap(d=>[`battery_${d}_mos_temperature`,`battery_${d}_env_temperature`,`battery_${d}_cell_temperature_1`])),c=d=>l?`${d} ${l}`:d;return o`
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
                <th class="n">${c(a("packs.col_mos"))}</th>
                <th class="n">${c(a("packs.col_env"))}</th>
                <th class="n">${c(a("packs.col_ntc"))}</th>
              </tr>
            </thead>
            <tbody>
              ${this.packs.map(d=>{const m=t.num(`battery_soc_${d}`),u=t.num(`battery_${d}_min_cell_voltage`),f=t.num(`battery_${d}_max_cell_voltage`),v=u!==null&&f!==null?f-u:null,I=[1,2,3,4].map(tt=>t.num(`battery_${d}_cell_temperature_${tt}`)).filter(tt=>tt!==null).map(tt=>s.num(tt,1)).join(" · "),Yt=t.num(`battery_${d}_mos_status`)===3,wt=Ce(m,r,e,this.spreadWarn);return o`
                  <tr class="${wt?"flagged":""} ${Yt?"conducting":""}">
                    <td class=${wt?"warn":""}>
                      ${a("common.pack")} ${d}
                      ${Yt?o`<span class="live" title=${a("packs.conducting")}></span>`:h}
                    </td>
                    <td class="n ${wt?"warn":""}">${s.num(m,1)} %</td>
                    <td class="n">
                      ${s.num(m===null||i===null?null:m/100*i,2)}
                    </td>
                    <td class="n">${s.num(u,3)}</td>
                    <td class="n">${s.num(f,3)}</td>
                    <td class="n ${Ae(v)}">
                      ${s.millivolts(v)} mV
                    </td>
                    <td class="n">${s.num(t.num(`battery_${d}_voltage`),2)}</td>
                    <td class="n">${s.num(t.num(`battery_${d}_current`),2)}</td>
                    <td class="n">${s.num(t.num(`battery_${d}_cycle_count`),0)}</td>
                    <td class="n">${s.num(t.num(`battery_${d}_mos_temperature`),1)}</td>
                    <td class="n">${s.num(t.num(`battery_${d}_env_temperature`),1)}</td>
                    <td class="n">${I||"—"}</td>
                  </tr>
                `})}
            </tbody>
          </table>
        </div>
        <div class="note">
          ${a("packs.table_legend",{spread:s.num(this.spreadWarn,0),points:s.num(this.spreadWarn/2,1)})}
        </div>
      </div>
    `}};bt.properties={floor:{type:Number},spreadWarn:{type:Number},spreadCrit:{type:Number}};bt.styles=[b,g`
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
    `];bt=Ls([k("mk-view-packs")],bt);var Ws=Object.getOwnPropertyDescriptor,Is=(e,t,s,a)=>{for(var i=a>1?void 0:a?Ws(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=r(i)||i);return i};const at=[1,2,3,4],pe=1;let Mt=class extends S{render(){const e=this.reader,t=this.fmt,s=this.t,a=at.map(l=>e.num(`mppt${l}_power`)),i=e.sum(at.map(l=>`mppt${l}_power`)),n=Math.max(...a.map(l=>l??0),1),r=a.some(l=>l!==null&&l>pe);return at.some(l=>e.entityId(`mppt${l}_power`))?o`
      <div class="grid channels">
        ${at.map(l=>{const c=e.num(`mppt${l}_power`),d=c!==null&&c>pe;return o`
            <div class="panel">
              <div class="head">
                <div class="label">MPPT ${l}</div>
                <span class="pill ${d?"on":""}">
                  ${s(d?"solar.active":"solar.floating")}
                </span>
              </div>
              <div class="chan-value">
                ${t.num(c,0)}<span class="chan-unit">W</span>
              </div>
              <div class="track">
                <i style="width:${c===null?0:c/n*100}%"></i>
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
            <div class="label">${s(r?"solar.some_active":"solar.all_idle")}</div>
          </div>
          <div class="chan-value">
            ${t.num(i,0)}<span class="chan-unit">W</span>
          </div>
          <div class="note">
            ${s(r?"solar.note_active":"solar.note_floating")}
          </div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${s("solar.diagnostics")}</div></div>
          ${this.kv("mppt_error",0,{tone:e.num("mppt_error")?"crit":"ok"})}
          ${this.kv("mppt_warning",0,{tone:e.num("mppt_warning")?"warn":"ok"})}
          ${this.kv("mppt_version",0,{version:!0})}
          ${i===null?h:this.row(s("solar.channels_reporting"),`${a.filter(l=>l!==null).length} / ${at.length}`)}
        </div>
      </div>
    `:o`<div class="panel"><div class="note">${s("solar.none")}</div></div>`}};Mt.styles=[b,g`
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
    `];Mt=Is([k("mk-view-solar")],Mt);var Us=Object.getOwnPropertyDescriptor,js=(e,t,s,a)=>{for(var i=a>1?void 0:a?Us(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=r(i)||i);return i};const Fs=[{titleKey:"energy.today",charge:["total_daily_ac_input_energy","total_daily_charging_energy"],discharge:["total_daily_ac_output_energy","total_daily_discharging_energy"]},{titleKey:"energy.month",charge:["total_monthly_ac_input_energy","total_monthly_charging_energy"],discharge:["total_monthly_ac_output_energy","total_monthly_discharging_energy"],efficiency:"round_trip_efficiency_monthly"},{titleKey:"energy.lifetime",charge:["total_ac_input_energy","total_charging_energy"],discharge:["total_ac_output_energy","total_discharging_energy"],efficiency:"round_trip_efficiency_total"}];let Nt=class extends S{render(){const e=this.t;return o`
      <div class="grid periods">${Fs.map(t=>this.period(t))}</div>
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
    `}period(e){const t=this.reader,s=this.fmt,a=this.t,i=t.firstKey(e.charge),n=t.firstKey(e.discharge),r=i?t.num(i):null,l=n?t.num(n):null;if(r===null&&l===null)return h;const c=r?(l??0)/r*100:null,d=r!==null&&l!==null?r-l:null,m=e.efficiency?t.num(e.efficiency):null;return o`
      <div class="panel">
        <div class="head">
          <div class="label">${a(e.titleKey)}</div>
          ${m===null?h:o`<span class="pill ${m<70?"w":"on"}">
                ${a("energy.rte")} ${s.num(m,1)} %
              </span>`}
        </div>
        <div class="pair">
          <div>
            <div class="big">${s.num(r,2)}</div>
            <div class="label" style="margin-top:2px">${a("energy.charged")}</div>
          </div>
          <div>
            <div class="big magenta">${s.num(l,2)}</div>
            <div class="label" style="margin-top:2px">${a("energy.discharged")}</div>
          </div>
        </div>
        <div class="track"><i style="width:100%"></i></div>
        <div class="track out">
          <i style="width:${c===null?0:Math.min(c,100)}%"></i>
        </div>
        <div style="margin-top:14px">
          ${d===null?h:this.row(a("energy.loss"),`${s.num(d,2)} kWh`,d/(r||1)>.25?"warn":"")}
          ${c===null?h:this.row(a("energy.returned"),`${s.num(c,1)} %`)}
        </div>
      </div>
    `}efficiencyPanel(){const e=this.reader,t=this.fmt,s=this.t,a=[[e.label("round_trip_efficiency_total"),e.num("round_trip_efficiency_total"),""],[e.label("round_trip_efficiency_monthly"),e.num("round_trip_efficiency_monthly"),"warn"],[e.label("conversion_efficiency"),e.num("conversion_efficiency"),"ok"]],i=e.num("round_trip_efficiency_total"),n=e.num("round_trip_efficiency_monthly"),r=i!==null&&n!==null?i-n:null;return o`
      <div class="panel">
        <div class="head"><div class="label">${s("energy.efficiency")}</div></div>
        <div class="note" style="margin-top:0;margin-bottom:16px">
          ${s("energy.rte_hint")}
        </div>
        ${a.map(([l,c,d])=>c===null?h:o`
                <div class="meter">
                  <div class="meter-head">
                    <span class="label">${l}</span>
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
        ${r===null||Math.abs(r)<5?h:o`<div class="note">
              ${s("energy.gap_hint",{value:t.num(Math.abs(r),1)})}
            </div>`}
      </div>
    `}};Nt.styles=[b,g`
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
    `];Nt=js([k("mk-view-energy")],Nt);var Hs=Object.getOwnPropertyDescriptor,Vs=(e,t,s,a)=>{for(var i=a>1?void 0:a?Hs(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=r(i)||i);return i};const he=["alarm_status","fault_status","fault_status_low","fault_status_2","fault_status_2_low","mppt_error","mppt_warning"];let Dt=class extends S{render(){const e=this.reader,t=this.t,s=he.filter(a=>{const i=e.num(a);return i!==null&&i!==0});return o`
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
          <!-- The raw register on purpose: the summary corrects 35100 where it
               calls solar passing through "Discharge", a diagnostics view should not. -->
          ${this.kv("inverter_state",0,{raw:!0})} ${this.kv("work_mode",0,{raw:!0})}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.firmware")}</div></div>
          ${this.kv("ems_version",0,{version:!0})} ${this.kvFirst(["battery_1_bms_version","bms_version"],0,{version:!0,label:t("cells.bms_version")})}
          ${this.kv("vms_version",0,{version:!0})} ${this.kv("mppt_version",0,{version:!0})}
          ${this.kv("ems_boot_version",0,{version:!0})} ${this.kv("vns_boot_version",0,{version:!0})}
          ${this.kv("comm_module_firmware",0,{raw:!0})}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.connection")}</div></div>
          ${this.kv("bluetooth_status",0,{raw:!0})}
          ${this.kv("device_ip_address",0,{raw:!0})} ${this.kv("gateway_ip_address",0,{raw:!0})}
          ${this.kv("ble_mac_address",0,{raw:!0})}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.faults")}</div></div>
          ${he.map(a=>this.kv(a,0,{tone:e.num(a)?"crit":"ok"}))}
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
          ${this.packElectrical()}
          ${this.kv("ac_voltage",1)} ${this.kv("ac_frequency",2)}
        </div>
      </div>
    `}ceilingNote(){const e=this.reader.num("charge_to_soc");if(e===null)return h;const t=e>=10&&e<=100;return o`
      <div class="note">
        ${t?this.t("system.ceiling_used",{value:this.fmt.num(e,0)}):this.t("system.ceiling_ignored",{value:this.fmt.num(e,0)})}
      </div>
    `}};Dt.styles=[b,g`
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
    `];Dt=Vs([k("mk-view-system")],Dt);var Bs=Object.defineProperty,Ks=Object.getOwnPropertyDescriptor,C=(e,t,s,a)=>{for(var i=a>1?void 0:a?Ks(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&Bs(t,s,i),i};let w=class extends ${constructor(){super(...arguments),this.label="",this.value=null,this.min=0,this.max=100,this.step=1,this.unit="",this.disabled=!1,this.formatNumber=e=>e===null?"—":String(e),this.dragging=null,this.pending=null}willUpdate(e){e.has("value")&&this.pending!==null&&this.value===this.pending&&(this.pending=null)}get shown(){return this.dragging??this.pending??this.value}render(){const e=this.shown;return o`
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
    `}commit(e){this.dragging=null,e!==this.value&&(this.pending=e,this.onCommit?.(e))}};w.styles=[b,g`
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
    `];C([p({type:String})],w.prototype,"label",2);C([p({type:Number})],w.prototype,"value",2);C([p({type:Number})],w.prototype,"min",2);C([p({type:Number})],w.prototype,"max",2);C([p({type:Number})],w.prototype,"step",2);C([p({type:String})],w.prototype,"unit",2);C([p({type:Boolean})],w.prototype,"disabled",2);C([p({attribute:!1})],w.prototype,"formatNumber",2);C([p({attribute:!1})],w.prototype,"onCommit",2);C([y()],w.prototype,"dragging",2);C([y()],w.prototype,"pending",2);w=C([k("mk-slider")],w);var qs=Object.defineProperty,Gs=Object.getOwnPropertyDescriptor,L=(e,t,s,a)=>{for(var i=a>1?void 0:a?Gs(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&qs(t,s,i),i};let O=class extends ${constructor(){super(...arguments),this.open=!1,this.heading="",this.message="",this.confirmLabel="",this.cancelLabel=""}updated(e){e.has("open")&&(this.open&&!this.dialog.open&&this.dialog.showModal(),!this.open&&this.dialog.open&&this.dialog.close())}disconnectedCallback(){this.dialog?.open&&this.dialog.close(),super.disconnectedCallback()}render(){return o`
      <dialog
        aria-labelledby="heading"
        @click=${this.backdrop}
        @keydown=${this.keys}
      >
        <div class="body">
          <h2 id="heading">${this.heading}</h2>
          <p>${this.message}</p>
          <div class="buttons">
            <!-- Cancel first, so the dialog opens with the harmless answer
                 focused and Enter does nothing anyone has to undo. -->
            <button @click=${this.cancel}>${this.cancelLabel}</button>
            <button class="confirm" @click=${this.confirm}>
              ${this.confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    `}confirm(){this.dialog.close(),this.onConfirm?.()}cancel(){this.dialog.close(),this.onCancel?.()}keys(e){e.key==="Escape"&&(e.preventDefault(),this.cancel())}backdrop(e){e.target===this.dialog&&this.cancel()}};O.styles=[b,g`
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
      button:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
    `];L([p({type:Boolean})],O.prototype,"open",2);L([p({type:String})],O.prototype,"heading",2);L([p({type:String})],O.prototype,"message",2);L([p({type:String})],O.prototype,"confirmLabel",2);L([p({type:String})],O.prototype,"cancelLabel",2);L([p({attribute:!1})],O.prototype,"onConfirm",2);L([p({attribute:!1})],O.prototype,"onCancel",2);L([is("dialog")],O.prototype,"dialog",2);O=L([k("mk-confirm")],O);var Ys=Object.defineProperty,Js=Object.getOwnPropertyDescriptor,F=(e,t,s,a)=>{for(var i=a>1?void 0:a?Js(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&Ys(t,s,i),i};let M=class extends ${constructor(){super(...arguments),this.label="",this.hint="",this.options=[],this.value=null,this.disabled=!1,this.pending=null}willUpdate(e){e.has("value")&&this.pending!==null&&this.value===this.pending&&(this.pending=null)}render(){const e=this.pending??this.value;return o`
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
    `}pick(e){e!==this.value&&(this.pending=e,this.onSelect?.(e))}};M.styles=[b,g`
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
    `];F([p({type:String})],M.prototype,"label",2);F([p({type:String})],M.prototype,"hint",2);F([p({attribute:!1})],M.prototype,"options",2);F([p({type:String})],M.prototype,"value",2);F([p({type:Boolean})],M.prototype,"disabled",2);F([p({attribute:!1})],M.prototype,"onSelect",2);F([y()],M.prototype,"pending",2);M=F([k("mk-segment")],M);var Zs=Object.defineProperty,Xs=Object.getOwnPropertyDescriptor,H=(e,t,s,a)=>{for(var i=a>1?void 0:a?Xs(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&Zs(t,s,i),i};let N=class extends ${constructor(){super(...arguments),this.label="",this.hint="",this.bare=!1,this.checked=null,this.disabled=!1,this.pending=null}willUpdate(e){e.has("checked")&&this.pending!==null&&this.checked===this.pending&&(this.pending=null)}render(){const e=this.pending??this.checked;return o`
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
    `}flip(){const e=!(this.pending??this.checked);this.pending=e,this.onToggle?.(e)}};N.styles=[b,g`
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
    `];H([p({type:String})],N.prototype,"label",2);H([p({type:String})],N.prototype,"hint",2);H([p({type:Boolean})],N.prototype,"bare",2);H([p({type:Boolean})],N.prototype,"checked",2);H([p({type:Boolean})],N.prototype,"disabled",2);H([p({attribute:!1})],N.prototype,"onToggle",2);H([y()],N.prototype,"pending",2);N=H([k("mk-toggle")],N);var Qs=Object.defineProperty,ta=Object.getOwnPropertyDescriptor,W=(e,t,s,a)=>{for(var i=a>1?void 0:a?ta(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&Qs(t,s,i),i};let T=class extends ${constructor(){super(...arguments),this.rows=[],this.dayLabel=e=>e,this.formatNumber=e=>e===null?"—":String(e)}toClock(e){if(e===null||e<0||e>2359)return"";const t=Math.floor(e/100),s=e%100;return t>23||s>59?"":`${String(t).padStart(2,"0")}:${String(s).padStart(2,"0")}`}fromClock(e){const t=/^(\d{1,2}):(\d{2})$/.exec(e);return t?Number(t[1])*100+Number(t[2]):null}render(){if(!this.rows.length)return h;const e=this.labels;return o`
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
              ${t.days===null?o`<option value="" selected>${e.unset}</option>`:h}
              ${t.dayOptions.map(a=>o`
                  <option value=${a} ?selected=${t.days===a}>
                    ${this.dayLabel(a)}
                  </option>
                `)}
            </select>
          </div>
        `})}
      </div>
      </div>
    `}time(e,t,s){const a=this.fromClock(s.target.value);a!==null&&this.onTime?.(e,t,a)}power(e,t){const s=Number(t.target.value);Number.isFinite(s)&&this.onPower?.(e,s)}};T.styles=[b,g`
      /* The editor needs its width - a time field cannot usefully shrink -
         so it scrolls inside the card rather than pushing the page. */
      .scroll {
        overflow-x: auto;
      }
      .inner {
        min-width: 560px;
      }
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
    `];W([p({attribute:!1})],T.prototype,"rows",2);W([p({attribute:!1})],T.prototype,"labels",2);W([p({attribute:!1})],T.prototype,"dayLabel",2);W([p({attribute:!1})],T.prototype,"formatNumber",2);W([p({attribute:!1})],T.prototype,"onEnable",2);W([p({attribute:!1})],T.prototype,"onTime",2);W([p({attribute:!1})],T.prototype,"onPower",2);W([p({attribute:!1})],T.prototype,"onDays",2);T=W([k("mk-schedule")],T);var ea=Object.defineProperty,sa=Object.getOwnPropertyDescriptor,_t=(e,t,s,a)=>{for(var i=a>1?void 0:a?sa(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&ea(t,s,i),i};const me=["set_charge_power","set_discharge_power"],ue=["max_charge_power","max_discharge_power"],aa=[1,2,3,4,5,6],ia=30;let Q=class extends S{constructor(){super(...arguments),this.wrote={},this.confirmReset=!1}note(e){this.wrote={...this.wrote,[e]:Date.now()}}overwritten(e){const t=this.wrote[e];if(!t)return!1;const s=this.reader.rawState(e)?.last_updated;if(!s)return!1;const a=(new Date(s).getTime()-t)/1e3;return a>.5&&a<ia}slider(e){const t=this.reader;return t.entityId(e)?o`
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
    `:h}segment(e,t=""){const s=this.reader;if(!s.entityId(e))return h;const a=s.attr(e,"options",[]);return o`
      <mk-segment
        label=${s.label(e)}
        hint=${t?this.t(t):""}
        .value=${s.rawState(e)?.state??null}
        .options=${a.map(i=>({value:i,label:this.t(`control.opt.${i}`)}))}
        ?disabled=${!s.writable(e)}
        .onSelect=${i=>{this.note(e),this.controls.selectOption(e,i)}}
      ></mk-segment>
    `}toggle(e,t){const s=this.reader;if(!s.entityId(e))return h;const a=s.rawState(e);return o`
      <mk-toggle
        label=${s.label(e)}
        hint=${this.t(t)}
        .checked=${a&&a.state!=="unavailable"?a.state==="on":null}
        .onToggle=${i=>{this.note(e),this.controls.setSwitch(e,i)}}
      ></mk-toggle>
    `}get scheduleRows(){const e=this.reader;return aa.filter(t=>e.entityId(`schedule_${t}_start`)).map(t=>{const s=`schedule_${t}_mode`,a=e.rawState(`schedule_${t}_enabled`);return{index:t,enabled:a&&a.state!=="unavailable"?a.state==="on":null,start:e.num(`schedule_${t}_start`),end:e.num(`schedule_${t}_end`),power:e.num(s),powerMin:e.attr(s,"min",-2500),powerMax:e.attr(s,"max",2500),powerStep:e.attr(s,"step",1),days:e.rawState(`schedule_${t}_days`)?.state??null,dayOptions:e.attr(`schedule_${t}_days`,"options",[])}})}render(){const e=this.t,t=[...me,...ue].filter(a=>this.overwritten(a)),s=this.scheduleRows;return o`
      ${t.length?o`<div class="warn-note">
            <b>!</b>
            <span>
              ${e("control.overwritten",{names:t.map(a=>this.reader.label(a)).join(", ")})}
            </span>
          </div>`:h}

      <div class="grid top">
        <div class="panel stack">
          <div class="head"><div class="label">${e("control.power")}</div></div>
          ${me.map(a=>this.slider(a))}
          <div class="note">${e("control.power_hint")}</div>
        </div>

        <div class="panel stack">
          <div class="head"><div class="label">${e("control.limits")}</div></div>
          ${ue.map(a=>this.slider(a))} ${this.slider("charge_to_soc")}
          <div class="note">${e("control.limits_hint")}</div>
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
                  .labels=${{window:e("control.window"),power:e("control.sched_power"),days:e("control.days"),active:e("control.active"),unset:e("control.unset")}}
                  .dayLabel=${a=>e(`control.day.${a}`)}
                  .formatNumber=${a=>this.fmt.num(a,0)}
                  .onEnable=${(a,i)=>this.controls.setSwitch(`schedule_${a}_enabled`,i)}
                  .onTime=${(a,i,n)=>this.controls.setNumber(`schedule_${a}_${i}`,n)}
                  .onPower=${(a,i)=>this.controls.setNumber(`schedule_${a}_mode`,i)}
                  .onDays=${(a,i)=>this.controls.selectOption(`schedule_${a}_days`,i)}
                ></mk-schedule>
              `:o`<div class="note">${e("control.no_schedules")}</div>`}
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
                  .onConfirm=${()=>{this.controls.press("reset_device"),this.confirmReset=!1}}
                  .onCancel=${()=>this.confirmReset=!1}
                ></mk-confirm>
              </div>
            </div>
          `:h}
    `}};Q.styles=[b,g`
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
      button.action:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
    `];_t([p({attribute:!1})],Q.prototype,"controls",2);_t([y()],Q.prototype,"wrote",2);_t([y()],Q.prototype,"confirmReset",2);Q=_t([k("mk-view-control")],Q);const Rt=[{id:"reactor",name:"Reactor",dark:{bg:"#05090f",surface:"#0b131d","surface-2":"#101b28",inset:"#0d1723",line:"#1b2b3d","line-soft":"#152435",fg:"#dff2f6","fg-2":"#9fb8c6",dim:"#5d7d92",accent:"#2ae6dc","accent-deep":"#1b8fd6","accent-wash":"#0e2b30",magenta:"#ff3ea5","magenta-wash":"#2a0d1e",ok:"#35d67a",warn:"#ffb020",crit:"#ff4d5e",track:"#132434","on-accent":"#04141a"},light:{bg:"#eef2f6",surface:"#ffffff","surface-2":"#f6f9fb",inset:"#e8eef3",line:"#cbd8e2","line-soft":"#dfe7ee",fg:"#0c1a24","fg-2":"#3a5162",dim:"#5b7484",accent:"#0c847e","accent-deep":"#0f5f8c","accent-wash":"#d9f0ee",magenta:"#b4176e","magenta-wash":"#fbe4f0",ok:"#0f7a44",warn:"#8a5804",crit:"#b52436",track:"#dae3ea","on-accent":"#ffffff"}},{id:"cockpit",name:"Cockpit",dark:{bg:"#0a0704",surface:"#14100a","surface-2":"#1c1710",inset:"#17120b",line:"#35291a","line-soft":"#281f14",fg:"#f5e8d2","fg-2":"#c4ac8a",dim:"#8a7355",accent:"#ffb020","accent-deep":"#d2690c","accent-wash":"#33220a",magenta:"#ff5f3a","magenta-wash":"#331309",ok:"#9ecb3a",warn:"#ffd54a",crit:"#ff4a3d",track:"#241c11","on-accent":"#1a1000"},light:{bg:"#f5f0e6",surface:"#fffdf8","surface-2":"#faf5ea",inset:"#efe7d6",line:"#d9cdb4","line-soft":"#e8dfcc",fg:"#201705","fg-2":"#5b4a2d",dim:"#7d6a48",accent:"#a35c00","accent-deep":"#7c3d05","accent-wash":"#f6e6c8",magenta:"#b53a17","magenta-wash":"#fadfd6",ok:"#4d6b12",warn:"#8a5804",crit:"#b02a20",track:"#e3d8c2","on-accent":"#fffdf8"}},{id:"verdant",name:"Verdant",dark:{bg:"#040b07",surface:"#0a150f","surface-2":"#0f1d16",inset:"#0c1811",line:"#1c3226","line-soft":"#152920",fg:"#ddf5e5","fg-2":"#9cc0ab",dim:"#5d8570",accent:"#7ee787","accent-deep":"#26a269","accent-wash":"#0f2b1c",magenta:"#3ddbd9","magenta-wash":"#0a2a2c",ok:"#7ee787",warn:"#ffc94a",crit:"#ff5f6d",track:"#12281c","on-accent":"#04140a"},light:{bg:"#eef4ef",surface:"#ffffff","surface-2":"#f5faf6",inset:"#e6efe8",line:"#c7d9cc","line-soft":"#dbe8de",fg:"#0a1a10","fg-2":"#385643",dim:"#5a7864",accent:"#1a7f4b","accent-deep":"#115e37","accent-wash":"#d7f0e0",magenta:"#0d7d7b","magenta-wash":"#d4f0ef",ok:"#1a7f4b",warn:"#8a5804",crit:"#b52436",track:"#d9e5db","on-accent":"#ffffff"}},{id:"plasma",name:"Plasma",dark:{bg:"#07050f",surface:"#110d1e","surface-2":"#191330",inset:"#140f26",line:"#2c2350","line-soft":"#211a3e",fg:"#eae4ff","fg-2":"#b3a8d8",dim:"#7568a8",accent:"#a06bff","accent-deep":"#5b3ed6","accent-wash":"#22164a",magenta:"#ff5bc8","magenta-wash":"#2e0f2a",ok:"#4ddba0",warn:"#ffc046",crit:"#ff5470",track:"#1c1638","on-accent":"#0b0618"},light:{bg:"#f1eef8",surface:"#ffffff","surface-2":"#f8f5fd",inset:"#ebe6f6",line:"#d2c8e8","line-soft":"#e2dbf1",fg:"#150c28","fg-2":"#47395f",dim:"#6b5c88",accent:"#6b2fd0","accent-deep":"#4a1aa8","accent-wash":"#e7dbfb",magenta:"#b81f86","magenta-wash":"#fbdcf0",ok:"#0f7a52",warn:"#8a5804",crit:"#b52440",track:"#e0d8f0","on-accent":"#ffffff"}},{id:"ember",name:"Ember",dark:{bg:"#0a0605",surface:"#150e0b","surface-2":"#1e1511",inset:"#191110",line:"#38231b","line-soft":"#2a1a15",fg:"#f7e6dd","fg-2":"#c7a696",dim:"#8d6a5c",accent:"#ff6b3d","accent-deep":"#c22f1e","accent-wash":"#331408",magenta:"#ffc247","magenta-wash":"#2e2209",ok:"#58c98a",warn:"#ffc247",crit:"#ff3b30",track:"#251712","on-accent":"#190802"},light:{bg:"#f6f0ec",surface:"#ffffff","surface-2":"#fbf5f1",inset:"#efe4dd",line:"#ddc9bd","line-soft":"#ebdcd3",fg:"#22110a","fg-2":"#5e4235",dim:"#7f6153",accent:"#c1401b","accent-deep":"#922b12","accent-wash":"#fadfd3",magenta:"#8a6206","magenta-wash":"#f7e9c9",ok:"#0f7a44",warn:"#8a5804",crit:"#b52436",track:"#e6d6cb","on-accent":"#ffffff"}},{id:"glacier",name:"Glacier",dark:{bg:"#060a10",surface:"#0d141d","surface-2":"#131d29",inset:"#101825",line:"#223549","line-soft":"#1a2b3c",fg:"#e4eef8","fg-2":"#a6bccf",dim:"#67839c",accent:"#63b3ff","accent-deep":"#2f6fd0","accent-wash":"#112a45",magenta:"#9fd8e8","magenta-wash":"#10262e",ok:"#4fd1a5",warn:"#ffcb5c",crit:"#ff6b7d",track:"#16232f","on-accent":"#04101d"},light:{bg:"#eef2f7",surface:"#ffffff","surface-2":"#f6f9fc",inset:"#e7edf4",line:"#c8d5e3","line-soft":"#dde5ee",fg:"#0b1622","fg-2":"#3c5064",dim:"#5f7488",accent:"#1462b8","accent-deep":"#0c4383","accent-wash":"#d9e9fb",magenta:"#2a7f96","magenta-wash":"#d6eef4",ok:"#0f7a52",warn:"#8a5804",crit:"#b52440",track:"#dbe4ee","on-accent":"#ffffff"}},{id:"ha",name:"Home Assistant",dark:{bg:"var(--primary-background-color, #05090f)",surface:"var(--card-background-color, #0b131d)","surface-2":"var(--secondary-background-color, #101b28)",inset:"var(--secondary-background-color, #0d1723)",line:"var(--divider-color, #1b2b3d)","line-soft":"var(--divider-color, #152435)",fg:"var(--primary-text-color, #dff2f6)","fg-2":"var(--secondary-text-color, #9fb8c6)",dim:"var(--secondary-text-color, #5d7d92)",accent:"var(--primary-color, #2ae6dc)","accent-deep":"var(--dark-primary-color, #1b8fd6)","accent-wash":"var(--secondary-background-color, #0e2b30)",magenta:"var(--accent-color, #ff3ea5)","magenta-wash":"var(--secondary-background-color, #2a0d1e)",ok:"var(--success-color, #35d67a)",warn:"var(--warning-color, #ffb020)",crit:"var(--error-color, #ff4d5e)",track:"var(--divider-color, #132434)","on-accent":"var(--text-primary-color, #04141a)"}}],Pe="reactor";function Bt(e){return Rt.find(t=>t.id===e)??Rt[0]}function fe(e){return!Bt(e).light}function na(e,t,s){const a=Bt(t),i=s&&a.light||a.dark,n=a.id===Pe;for(const[r,l]of Object.entries(i)){const c=`--mk-${r}`;n?e.style.removeProperty(c):e.style.setProperty(c,l)}}const Oe=90,Te=150,Ee=5,ft=1200,Y=20,ct={fontScale:100,maxWidth:"full"},R={scheme:Pe,mode:"auto",startTab:"last",hiddenTabs:[],extraDigits:!1,spreadWarn:ht,spreadCrit:Vt},ra="marstek-panel.settings",Kt="marstek-panel.local",oa="marstek_modbus/settings/get",la="marstek_modbus/settings/set";function qt(e){if(!e||typeof e!="object")return{...R};const t=e;return{scheme:typeof t.scheme=="string"&&Bt(t.scheme).id===t.scheme?t.scheme:R.scheme,mode:t.mode==="dark"||t.mode==="light"||t.mode==="auto"?t.mode:R.mode,startTab:typeof t.startTab=="string"?t.startTab:R.startTab,hiddenTabs:Array.isArray(t.hiddenTabs)?t.hiddenTabs.filter(s=>typeof s=="string"):[],extraDigits:t.extraDigits===!0,...ca(t.spreadWarn,t.spreadCrit)}}function ca(e,t){const s=(n,r)=>typeof n=="number"&&Number.isFinite(n)?Math.min(Ot,Math.max(Pt,Math.round(n))):r,a=s(e,R.spreadWarn),i=s(t,R.spreadCrit);return i<a?{spreadWarn:a,spreadCrit:a}:{spreadWarn:a,spreadCrit:i}}function da(e){return JSON.stringify(e,null,2)}function pa(e){let t;try{t=JSON.parse(e)}catch{return null}return!t||typeof t!="object"||Array.isArray(t)?null:qt(t)}function ha(e,t,s,a){const i=Math.round(e/a)*a;return Math.min(s,Math.max(t,i))}function ma(e){if(!e||typeof e!="object")return{...ct};const t=e,s=t.maxWidth;return{fontScale:typeof t.fontScale=="number"&&Number.isFinite(t.fontScale)?ha(t.fontScale,Oe,Te,Ee):ct.fontScale,maxWidth:typeof s=="number"&&Number.isFinite(s)&&s>=ft?Math.round(s/Y)*Y:"full"}}function ua(){try{const e=localStorage.getItem(Kt);return e?ma(JSON.parse(e)):{...ct}}catch{return{...ct}}}function fa(e){try{localStorage.setItem(Kt,JSON.stringify(e))}catch{}}function ga(){try{localStorage.removeItem(Kt)}catch{}}async function va(e){try{const t=await e.callWS({type:oa});if(!t||Object.keys(t).length===0){const s=ba();return s?(await zt(e,s),s):{...R}}return qt(t)}catch{return null}}async function zt(e,t){try{await e.callWS({type:la,settings:t})}catch{}}function ba(){try{const e=localStorage.getItem(ra);return e?qt(JSON.parse(e)):null}catch{return null}}var ka=Object.defineProperty,$a=Object.getOwnPropertyDescriptor,x=(e,t,s,a)=>{for(var i=a>1?void 0:a?$a(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&ka(t,s,i),i};let _=class extends ${constructor(){super(...arguments),this.tabs=[],this.offline=!1,this.light=!1,this.transferOpen=!1,this.transferText="",this.transferBad=!1}render(){const e=this.t,t=this.settings,s=fe(t.scheme);return o`
      <div class="grid top">
        <div class="panel">
          <div class="head"><div class="label">${e("settings.scheme")}</div></div>
          <div class="schemes">
            ${Rt.map(a=>this.schemeCard(a.id,a.name,this.light&&a.light||a.dark))}
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
                min=${Oe}
                max=${Te}
                step=${Ee}
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
                min=${ft}
                max=${this.widthMax()}
                step=${Y}
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
                min=${Pt}
                max=${Ot}
                step=${de}
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
                min=${Pt}
                max=${Ot}
                step=${de}
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
    `}toggleTransfer(){this.transferOpen=!this.transferOpen,this.transferOpen&&this.resetTransfer()}resetTransfer(){this.transferText=da(this.settings),this.transferBad=!1}applyTransfer(){const e=pa(this.transferText);if(!e){this.transferBad=!0;return}this.transferBad=!1,this.onChange(e)}schemeCard(e,t,s){const a=this.settings.scheme===e;return o`
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
          ${fe(e)?o`<small>${this.t("settings.scheme_theme")}</small>`:h}
        </span>
      </button>
    `}widthMax(){const e=Math.max(ft+Y,window.innerWidth);return Math.ceil(e/Y)*Y}widthValue(){const e=this.widthMax();return this.local.maxWidth==="full"?e:Math.min(e,Math.max(ft,this.local.maxWidth))}pickSpread(e,t){const{spreadWarn:s,spreadCrit:a}=this.settings;e==="spreadWarn"?this.onChange({spreadWarn:t,spreadCrit:Math.max(a,t)}):this.onChange({spreadCrit:t,spreadWarn:Math.min(s,t)})}pickWidth(e){const t=Number(e.target.value);this.onChangeLocal({maxWidth:t>=this.widthMax()?"full":t})}choices(e,t,s,a=!1,i=!1){return o`
      <div class="choices ${i?"packed":""}">
        ${e.map(([n,r])=>o`
            <button
              aria-pressed=${n===t}
              ?disabled=${a}
              @click=${()=>s(n)}
            >
              ${r}
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
    `}setHidden(e,t){const s=this.settings.hiddenTabs.filter(a=>a!==e);this.onChange({hiddenTabs:t?[...s,e]:s})}};_.styles=[b,g`
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
    `];x([p({attribute:!1})],_.prototype,"settings",2);x([p({attribute:!1})],_.prototype,"local",2);x([p({attribute:!1})],_.prototype,"tabs",2);x([p({attribute:!1})],_.prototype,"t",2);x([p({attribute:!1})],_.prototype,"onChange",2);x([p({attribute:!1})],_.prototype,"onChangeLocal",2);x([p({attribute:!1})],_.prototype,"onReset",2);x([p({type:Boolean})],_.prototype,"offline",2);x([p({type:Boolean})],_.prototype,"light",2);x([y()],_.prototype,"transferOpen",2);x([y()],_.prototype,"transferText",2);x([y()],_.prototype,"transferBad",2);_=x([k("mk-view-settings")],_);var ya=Object.defineProperty,_a=Object.getOwnPropertyDescriptor,D=(e,t,s,a)=>{for(var i=a>1?void 0:a?_a(t,s):t,n=e.length-1,r;n>=0;n--)(r=e[n])&&(i=(a?r(t,s,i):r(i))||i);return a&&i&&ya(t,s,i),i};const St=["core","cells","packs","solar","energy","control","system"],wa={cells:"battery_1_max_cell_voltage",packs:"battery_soc_1",solar:"mppt1_power",control:"set_charge_power"},Me="marstek-panel.device",Ne="marstek-panel.tab";let A=class extends ${constructor(){super(...arguments),this.narrow=!1,this.settings={...R},this.local=ua(),this.settingsOffline=!1,this.tab="core",this.showSettings=!1,this.strings=lt,this.deviceId=Sa(),this.catalogueFor="",this.appearanceFor="",this.layoutFor="",this.sharedRequested=!1,this.formatter=new ce("en"),this.markTabEdges=()=>{const e=this.renderRoot.querySelector("nav");if(!e)return;e.dataset.bound||(e.dataset.bound="1",e.addEventListener("scroll",this.markTabEdges,{passive:!0}),new ResizeObserver(this.markTabEdges).observe(e));const t=e.scrollLeft>1,s=e.scrollLeft+e.clientWidth<e.scrollWidth-1;e.dataset.edge=t&&s?"both":t?"left":s?"right":"none"},this.t=(e,t)=>fs(this.strings,e,t)}connectedCallback(){super.connectedCallback(),this.tab=this.startingTab()}willUpdate(e){if(this.applyLayout(),!this.hass||(this.loadShared(),!e.has("hass")&&!e.has("settings")))return;this.applyAppearance();const t=this.hass.language||"en",s=this.settings.extraDigits?1:0;(t!==this.catalogueFor||this.formatter.extraDigits!==s)&&(this.formatter=new ce(t,s)),t!==this.catalogueFor&&(this.catalogueFor=t,us(t).then(a=>{this.catalogueFor===t&&(this.strings=a)}))}applyAppearance(){const e=this.settings.mode,t=e==="auto"?!this.hass.themes?.darkMode:e==="light",s=`${this.settings.scheme}/${t}`;s!==this.appearanceFor&&(this.appearanceFor=s,this.toggleAttribute("light",t),na(this,this.settings.scheme,t))}applyLayout(){const{fontScale:e,maxWidth:t}=this.local,s=`${e}/${t}`;if(s===this.layoutFor)return;this.layoutFor=s;const a=e/100;this.style.setProperty("--mk-zoom",String(a)),this.style.setProperty("--mk-max-width",t==="full"?"none":`${t/a}px`)}loadShared(){this.sharedRequested||(this.sharedRequested=!0,va(this.hass).then(e=>{if(e===null){this.settingsOffline=!0;return}this.settings=e,this.tab=this.startingTab()}))}startingTab(){const e=this.settings.startTab==="last"?xa():this.settings.startTab;return St.includes(e)?e:"core"}update_(e){this.settings={...this.settings,...e},zt(this.hass,this.settings)}updateLocal(e){this.local={...this.local,...e},fa(this.local)}resetSettings(){this.settings={...R},zt(this.hass,this.settings),ga(),this.local={...ct}}openTab(e){this.tab=e,this.showSettings=!1;try{localStorage.setItem(Ne,e)}catch{}}updated(){this.markTabEdges()}selectDevice(e){this.deviceId=e;try{localStorage.setItem(Me,e)}catch{}}tabsFor(e){return St.filter(t=>this.supports(e,t)&&(t==="core"||!this.settings.hiddenTabs.includes(t)))}supports(e,t){const s=wa[t];return!s||e.entityId(s)!==void 0}tabChoices(e){return St.map(t=>({id:t,label:this.t(`tab.${t}`),available:this.supports(e,t)}))}get devices(){return this.hass?os(this.hass):[]}get device(){const e=this.devices;return e.length?e.find(t=>t.deviceId===this.deviceId)??e[0]:null}render(){if(!this.hass)return h;const e=this.device;if(!e)return o`
        <div class="shell">
          <div class="empty">
            <h2>${this.t("empty.no_device")}</h2>
            <p>${this.t("empty.no_device_hint")}</p>
          </div>
        </div>
      `;const t=new ls(this.hass,e),s=this.tabsFor(t),a=s.includes(this.tab)?this.tab:s[0];return o`
      <div class="shell">
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
                  @keydown=${n=>this.onTabKey(n,i,s)}
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
                @change=${n=>this.selectDevice(n.target.value)}
              >
                ${t.map(n=>o`
                    <option value=${n.deviceId} ?selected=${n.deviceId===s}>
                      ${n.name}
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
    `}link(e){const t=e.rawState("modbus_connection");if(!t||t.state==="unavailable"||t.state==="unknown")return{led:e.has("battery_soc")?"on":"off",label:this.t("status.modbus"),detail:""};const s=String(t.attributes.health??(t.state==="on"?"ok":"offline"));if(s==="paused")return{led:"",label:this.t("status.modbus_paused"),detail:this.t("status.modbus_paused_hint")};if(s==="offline"){const a=this.lastRead(t);return{led:"off",label:a?this.t("status.modbus_offline_since",{time:a}):this.t("status.modbus_offline"),detail:this.t("status.modbus_offline_hint")}}return{led:s==="degraded"?"warn":"on",label:this.t("status.modbus"),detail:s==="degraded"?this.t("status.modbus_degraded"):""}}lastRead(e){const t=e.attributes.last_successful_read;if(typeof t!="string")return"";const s=new Date(t);return Number.isNaN(s.getTime())?"":s.toLocaleTimeString(this.hass?.language||"en",{hour:"2-digit",minute:"2-digit"})}floorPercent(e){const t=e.num("stored_energy"),s=e.num("usable_energy"),a=e.num("battery_total_energy");if(t===null||s===null||!a)return null;const i=(t-s)/a*100;return i>=0&&i<=100?i:null}renderTab(e,t){const s={reader:e,fmt:this.formatter,t:this.t};switch(t){case"cells":return o`<mk-view-cells
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
          .controls=${new cs(this.hass,e)}
        ></mk-view-control>`;case"system":return o`<mk-view-system
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
        ></mk-view-system>`;default:return o`<mk-view-core
          .reader=${s.reader}
          .fmt=${s.fmt}
          .t=${s.t}
        ></mk-view-core>`}}};A.styles=[ns,b,g`
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
    `];D([p({attribute:!1})],A.prototype,"hass",2);D([p({type:Boolean})],A.prototype,"narrow",2);D([y()],A.prototype,"settings",2);D([y()],A.prototype,"local",2);D([y()],A.prototype,"settingsOffline",2);D([y()],A.prototype,"tab",2);D([y()],A.prototype,"showSettings",2);D([y()],A.prototype,"strings",2);D([y()],A.prototype,"deviceId",2);A=D([k("marstek-modbus-panel")],A);function xa(){try{return localStorage.getItem(Ne)}catch{return null}}function Sa(){try{return localStorage.getItem(Me)}catch{return null}}
