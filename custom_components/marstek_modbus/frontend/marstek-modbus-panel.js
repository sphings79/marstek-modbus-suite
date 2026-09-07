/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Y=globalThis,dt=Y.ShadowRoot&&(Y.ShadyCSS===void 0||Y.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,mt=Symbol(),$t=new WeakMap;let Dt=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==mt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(dt&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=$t.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&$t.set(e,t))}return t}toString(){return this.cssText}};const Bt=a=>new Dt(typeof a=="string"?a:a+"",void 0,mt),g=(a,...t)=>{const e=a.length===1?a[0]:t.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+a[r+1],a[0]);return new Dt(e,a,mt)},Ft=(a,t)=>{if(dt)a.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Y.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,a.appendChild(s)}},kt=dt?a=>a:a=>a instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Bt(e)})(a):a;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Kt,defineProperty:qt,getOwnPropertyDescriptor:Gt,getOwnPropertyNames:Yt,getOwnPropertySymbols:Zt,getPrototypeOf:Jt}=Object,X=globalThis,bt=X.trustedTypes,Qt=bt?bt.emptyScript:"",Xt=X.reactiveElementPolyfillSupport,L=(a,t)=>a,Z={toAttribute(a,t){switch(t){case Boolean:a=a?Qt:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){let e=a;switch(t){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch{e=null}}return e}},pt=(a,t)=>!Kt(a,t),yt={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:pt};Symbol.metadata??=Symbol("metadata"),X.litPropertyMetadata??=new WeakMap;let N=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=yt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&qt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=Gt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){const o=i?.call(this);r?.call(this,n),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??yt}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;const t=Jt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){const e=this.properties,s=[...Yt(e),...Zt(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(kt(i))}else t!==void 0&&e.push(kt(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ft(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const r=(s.converter?.toAttribute!==void 0?s.converter:Z).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const r=s.getPropertyOptions(i),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Z;this._$Em=i;const o=n.fromAttribute(e,r.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(t!==void 0){const n=this.constructor;if(i===!1&&(r=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??pt)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),r!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,r]of s){const{wrapped:n}=r,o=this[i];n!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,r,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};N.elementStyles=[],N.shadowRootOptions={mode:"open"},N[L("elementProperties")]=new Map,N[L("finalized")]=new Map,Xt?.({ReactiveElement:N}),(X.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=globalThis,xt=a=>a,J=ht.trustedTypes,wt=J?J.createPolicy("lit-html",{createHTML:a=>a}):void 0,Ut="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,It="?"+w,te=`<${It}>`,C=document,V=()=>C.createComment(""),H=a=>a===null||typeof a!="object"&&typeof a!="function",ut=Array.isArray,ee=a=>ut(a)||typeof a?.[Symbol.iterator]=="function",st=`[ 	
\f\r]`,I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,At=/-->/g,St=/>/g,E=RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Et=/'/g,Pt=/"/g,jt=/^(?:script|style|textarea|title)$/i,Lt=a=>(t,...e)=>({_$litType$:a,strings:t,values:e}),d=Lt(1),Ct=Lt(2),R=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Mt=new WeakMap,P=C.createTreeWalker(C,129);function Vt(a,t){if(!ut(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return wt!==void 0?wt.createHTML(t):t}const se=(a,t)=>{const e=a.length-1,s=[];let i,r=t===2?"<svg>":t===3?"<math>":"",n=I;for(let o=0;o<e;o++){const l=a[o];let c,h,m=-1,u=0;for(;u<l.length&&(n.lastIndex=u,h=n.exec(l),h!==null);)u=n.lastIndex,n===I?h[1]==="!--"?n=At:h[1]!==void 0?n=St:h[2]!==void 0?(jt.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=E):h[3]!==void 0&&(n=E):n===E?h[0]===">"?(n=i??I,m=-1):h[1]===void 0?m=-2:(m=n.lastIndex-h[2].length,c=h[1],n=h[3]===void 0?E:h[3]==='"'?Pt:Et):n===Pt||n===Et?n=E:n===At||n===St?n=I:(n=E,i=void 0);const f=n===E&&a[o+1].startsWith("/>")?" ":"";r+=n===I?l+te:m>=0?(s.push(c),l.slice(0,m)+Ut+l.slice(m)+w+f):l+w+(m===-2?o:f)}return[Vt(a,r+(a[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class W{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0;const o=t.length-1,l=this.parts,[c,h]=se(t,e);if(this.el=W.createElement(c,s),P.currentNode=this.el.content,e===2||e===3){const m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=P.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(const m of i.getAttributeNames())if(m.endsWith(Ut)){const u=h[n++],f=i.getAttribute(m).split(w),T=/([.?@])?(.*)/.exec(u);l.push({type:1,index:r,name:T[2],strings:f,ctor:T[1]==="."?ie:T[1]==="?"?ne:T[1]==="@"?re:tt}),i.removeAttribute(m)}else m.startsWith(w)&&(l.push({type:6,index:r}),i.removeAttribute(m));if(jt.test(i.tagName)){const m=i.textContent.split(w),u=m.length-1;if(u>0){i.textContent=J?J.emptyScript:"";for(let f=0;f<u;f++)i.append(m[f],V()),P.nextNode(),l.push({type:2,index:++r});i.append(m[u],V())}}}else if(i.nodeType===8)if(i.data===It)l.push({type:2,index:r});else{let m=-1;for(;(m=i.data.indexOf(w,m+1))!==-1;)l.push({type:7,index:r}),m+=w.length-1}r++}}static createElement(t,e){const s=C.createElement("template");return s.innerHTML=t,s}}function z(a,t,e=a,s){if(t===R)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl;const r=H(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(a),i._$AT(a,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=z(a,i._$AS(a,t.values),i,s)),t}class ae{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??C).importNode(e,!0);P.currentNode=i;let r=P.nextNode(),n=0,o=0,l=s[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new F(r,r.nextSibling,this,t):l.type===1?c=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(c=new oe(r,this,t)),this._$AV.push(c),l=s[++o]}n!==l?.index&&(r=P.nextNode(),n++)}return P.currentNode=C,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class F{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=z(this,t,e),H(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==R&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ee(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=W.createElement(Vt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const r=new ae(i,this),n=r.u(this.options);r.p(e),this.T(n),this._$AH=r}}_$AC(t){let e=Mt.get(t.strings);return e===void 0&&Mt.set(t.strings,e=new W(t)),e}k(t){ut(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new F(this.O(V()),this.O(V()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=xt(t).nextSibling;xt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){const r=this.strings;let n=!1;if(r===void 0)t=z(this,t,e,0),n=!H(t)||t!==this._$AH&&t!==R,n&&(this._$AH=t);else{const o=t;let l,c;for(t=r[0],l=0;l<r.length-1;l++)c=z(this,o[s+l],e,l),c===R&&(c=this._$AH[l]),n||=!H(c)||c!==this._$AH[l],c===p?t=p:t!==p&&(t+=(c??"")+r[l+1]),this._$AH[l]=c}n&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ie extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}}class ne extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}}class re extends tt{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=z(this,t,e,0)??p)===R)return;const s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class oe{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){z(this,t)}}const le=ht.litHtmlPolyfillSupport;le?.(W,F),(ht.litHtmlVersions??=[]).push("3.3.3");const ce=(a,t,e)=>{const s=e?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const r=e?.renderBefore??null;s._$litPart$=i=new F(t.insertBefore(V(),r),r,void 0,e??{})}return i._$AI(a),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vt=globalThis;class b extends N{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ce(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return R}}b._$litElement$=!0,b.finalized=!0,vt.litElementHydrateSupport?.({LitElement:b});const de=vt.litElementPolyfillSupport;de?.({LitElement:b});(vt.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const k=a=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(a,t)}):customElements.define(a,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me={attribute:!0,type:String,converter:Z,reflect:!1,hasChanged:pt},pe=(a=me,t,e)=>{const{kind:s,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),s==="setter"&&((a=Object.create(a)).wrapped=!0),r.set(e.name,a),s==="accessor"){const{name:n}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(n,l,a,!0,o)},init(o){return o!==void 0&&this.C(n,void 0,a,o),o}}}if(s==="setter"){const{name:n}=e;return function(o){const l=this[n];t.call(this,o),this.requestUpdate(n,l,a,!0,o)}}throw Error("Unsupported decorator location: "+s)};function v(a){return(t,e)=>typeof e=="object"?pe(a,t,e):((s,i,r)=>{const n=i.hasOwnProperty(r);return i.constructor.createProperty(r,s),n?Object.getOwnPropertyDescriptor(i,r):void 0})(a,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ft(a){return v({...a,state:!0,attribute:!1})}const he=g`
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
`,_=g`
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
`,ue="marstek_modbus";function ve(a){const t=new Map;for(const e of Object.values(a.entities)){if(e.platform!==ue||!e.device_id||!e.translation_key)continue;let s=t.get(e.device_id);if(!s){const i=a.devices[e.device_id];s={deviceId:e.device_id,name:i?.name_by_user||i?.name||"Marstek Venus",byKey:{}},t.set(e.device_id,s)}s.byKey[e.translation_key]=e.entity_id}return[...t.values()].sort((e,s)=>e.name.localeCompare(s.name))}class fe{constructor(t,e){this.hass=t,this.device=e}get name(){return this.device.name}entityId(t){return this.device.byKey[t]}has(t){return this.state(t)!==null}state(t){const e=this.device.byKey[t];if(!e)return null;const s=this.hass.states[e];return!s||s.state==="unavailable"||s.state==="unknown"?null:s}num(t){const e=this.state(t);if(!e)return null;const s=Number(e.state);return Number.isFinite(s)?s:null}str(t){return this.state(t)?.state??null}unit(t){return this.state(t)?.attributes.unit_of_measurement??""}label(t){return this.hass.states[this.device.byKey[t]??""]?.attributes.friendly_name??t}sum(t){let e=0,s=!1;for(const i of t){const r=this.num(i);r!==null&&(e+=r,s=!0)}return s?e:null}packCount(){let t=0;for(;this.device.byKey[`battery_${t+1}_max_cell_voltage`];)t++;return t}}const ge="modulepreload",_e=function(a){return"/"+a},Ot={},$e=function(t,e,s){let i=Promise.resolve();if(e&&e.length>0){let n=function(c){return Promise.all(c.map(h=>Promise.resolve(h).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");i=n(e.map(c=>{if(c=_e(c),c in Ot)return;Ot[c]=!0;const h=c.endsWith(".css"),m=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const u=document.createElement("link");if(u.rel=h?"stylesheet":ge,h||(u.as="script"),u.crossOrigin="",u.href=c,l&&u.setAttribute("nonce",l),document.head.appendChild(u),h)return new Promise((f,T)=>{u.addEventListener("load",f),u.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(n){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=n,window.dispatchEvent(o),!o.defaultPrevented)throw n}return i.then(n=>{for(const o of n||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},B={"tab.core":"OVERVIEW","tab.cells":"CELLS","tab.packs":"PACKS","tab.solar":"SOLAR","tab.energy":"ENERGY","tab.system":"SYSTEM","status.modbus":"MODBUS","status.wifi":"WIFI","common.pack":"PACK","common.device":"Device","core.electrical":"Electrical · now","core.reserve":"Reserve · lifetime","core.stored":"Stored","core.capacity":"Capacity","core.soc_bms":"SOC · BMS","core.soc_usable":"usable {value} %","core.discharging_to_house":"discharging","core.charging_from_grid":"charging","core.at_rest":"at rest","core.today_charged":"Charged today","core.today_discharged":"Discharged today","core.cell_delta":"Cell delta","core.internal_temp":"Internal temperature","core.mppt_total":"MPPT total","core.pack_spread":"across {count} packs","core.no_delta":"no per-pack readings","cells.highest":"Highest cell","cells.lowest":"Lowest cell","cells.in_pack":"pack {pack}","cells.stack_spread":"Spread across stack","cells.limit_hint":"100 mV is the usual limit","cells.mean_delta":"Mean delta in pack","cells.worst_pack":"widest: pack {pack}, {value} mV","cells.temp_span":"Cell temperature span","cells.packs_online":"Packs reporting","cells.cells_total":"{count} cells","cells.matrix_title":"Cell voltage range per pack · shared axis","cells.matrix_axis":"bar = lowest to highest cell","cells.matrix_legend":"The tick inside each bar is the pack's midpoint. A narrow bar is a balanced pack, a wide one is drift inside it, and a bar sitting apart from the others is a pack at a different level than the rest.","cells.no_ranges":"This battery reports no per-pack cell voltages.","cells.protection":"Protection and faults","cells.protection_all":"Protection · all {count} packs","cells.clear":"clear","cells.raised":"raised","cells.bms":"BMS","cells.bms_version":"BMS version","cells.uniform":"same on every pack","packs.device_reading":"as the device reports it","packs.mean_soc":"Mean of the packs","packs.from_n_packs":"from {count} packs","packs.spread":"Spread","packs.stored_total":"Stored energy","packs.summed":"packs add up to {value} kWh","packs.per_pack":"Per pack","packs.nominal":"nominal, capacity ÷ packs","packs.cycles_sum":"Cycles, all packs","packs.cycles_partial":"{have} of {total} packs report","packs.fill_title":"State of charge per pack","packs.fill_axis":"column height = SOC · figure inside = kWh","packs.fill_legend":"The dashed line marks the discharge floor at {floor} %. Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.","packs.fill_legend_nofloor":"Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.","packs.none":"This battery reports no per-pack state of charge.","packs.table_title":"Every pack in detail","packs.table_legend":"Highlighted rows sit more than 5 points away from the median pack. A pack that reports a high SOC at a low cell voltage is worth a second look: the two readings disagree.","packs.col_soc":"SOC","packs.col_energy":"kWh","packs.col_min":"Cell min","packs.col_max":"Cell max","packs.col_delta":"Delta","packs.col_voltage":"Voltage","packs.col_current":"Current","packs.col_cycles":"Cycles","packs.col_mos":"MOSFET","packs.col_env":"Ambient","packs.col_ntc":"NTC 1–4","solar.active":"ACTIVE","solar.floating":"FLOATING","solar.summary":"All inputs","solar.some_active":"carrying power","solar.all_idle":"nothing connected","solar.note_active":"Voltage follows the panels and power follows the sun through the day.","solar.note_floating":"All inputs sit at a low voltage without current, which is what an unused MPPT input looks like. Connect panels and the voltage rises to module level.","solar.diagnostics":"Diagnostics","solar.channels_reporting":"Inputs reporting","solar.none":"This battery has no MPPT inputs.","energy.today":"Today","energy.month":"This month","energy.lifetime":"Since commissioning","energy.charged":"charged kWh","energy.discharged":"discharged kWh","energy.loss":"Loss","energy.returned":"Returned","energy.rte":"Round trip","energy.rte_hint":"Round-trip efficiency is how much of the energy put into the battery comes back out of it. Conversion efficiency is the loss in the moment, at the current operating point.","energy.efficiency":"Efficiency compared","energy.throughput":"Throughput and wear","energy.gap_hint":"The monthly figure sits {value} points below the lifetime one. That gap is not conversion loss but standby draw between cycles: the shallower the cycling, the heavier it weighs.","system.no_faults":"No fault register is raised.","system.faults_raised":"Raised: {list}","system.device":"Device","system.packs":"Battery packs","system.firmware":"Firmware","system.connection":"Connection","system.faults":"Fault registers","system.control":"Control and limits","system.thermal":"Thermal and electrical","system.ceiling_used":"The panel treats {value} % as the charge ceiling, read from this register.","system.ceiling_ignored":"This register reads {value} %, outside its own 10-100 range, so the device is not using it. The panel charges towards 100 % instead.","empty.no_device":"No Marstek battery found","empty.no_device_hint":"This panel reads the Marstek Modbus Suite integration. Add a battery there first.","common.unavailable":"—"},Ht={de:()=>$e(()=>import("./marstek-modbus-lang-de.js"),[]).then(a=>a.de)};["en",...Object.keys(Ht)].sort();const q={en:B};function ke(a){return a.split("-")[0].toLowerCase()}async function be(a){const t=ke(a);if(q[t])return q[t];const e=Ht[t];if(!e)return B;try{return q[t]=await e(),q[t]}catch{return B}}function ye(a,t,e){let s=a[t]??B[t]??t;if(e)for(const[i,r]of Object.entries(e))s=s.replace(`{${i}}`,String(r));return s}const G="—";class Tt{constructor(t){this.language=t,this.cache=new Map}formatter(t){const e=String(t);let s=this.cache.get(e);return s||(s=new Intl.NumberFormat(this.language||"en",{minimumFractionDigits:t,maximumFractionDigits:t}),this.cache.set(e,s)),s}num(t,e=0){return t==null||!Number.isFinite(t)?G:this.formatter(e).format(t)}signed(t,e=0){if(t==null||!Number.isFinite(t))return G;const s=this.formatter(e).format(Math.abs(t));return t>0?`+${s}`:t<0?`−${s}`:s}version(t){return t==null||t===""?G:/^\d{4}$/.test(t)?`${t.slice(0,3)}.${t.slice(3)}`:t}millivolts(t){return t==null||!Number.isFinite(t)?G:this.formatter(0).format(Math.round(t*1e3))}}var xe=Object.defineProperty,gt=(a,t,e,s)=>{for(var i=void 0,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=n(t,e,i)||i);return i&&xe(t,e,i),i};const _t=class _t extends b{kv(t,e=1,s={}){const i=this.reader;if(!i.entityId(t))return p;const r=i.state(t);if(!r)return p;if(s.version)return d`
        <div class="kv">
          <span>${s.label??i.label(t)}</span>
          <b class=${s.tone??""}>${this.fmt.version(r.state)}</b>
        </div>
      `;const n=s.raw?null:i.num(t),o=i.unit(t),l=n===null?r.state:`${this.fmt.num(n,e)}${o?` ${o}`:""}`;return d`
      <div class="kv">
        <span>${s.label??i.label(t)}</span>
        <b class=${s.tone??""}>${l}</b>
      </div>
    `}row(t,e,s=""){return d`
      <div class="kv">
        <span>${t}</span>
        <b class=${s}>${e}</b>
      </div>
    `}get packs(){return Array.from({length:this.reader.packCount()},(t,e)=>e+1)}};_t.styles=[_];let $=_t;gt([v({attribute:!1})],$.prototype,"reader");gt([v({attribute:!1})],$.prototype,"fmt");gt([v({attribute:!1})],$.prototype,"t");var we=Object.defineProperty,Ae=Object.getOwnPropertyDescriptor,K=(a,t,e,s)=>{for(var i=s>1?void 0:s?Ae(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&we(t,e,i),i};const at=118,it=97,Se=2*Math.PI*at,Ee=2*Math.PI*it;let M=class extends b{constructor(){super(...arguments),this.soc=null,this.usable=null,this.caption="",this.sub=""}arc(a,t){const e=a===null?0:Math.min(Math.max(a,0),100);return`${t*e/100} ${t}`}render(){const a=this.soc===null?"—":Math.round(this.soc).toString();return d`
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

        <circle class="track" cx="150" cy="134" r=${at} stroke-width="15" />
        <circle
          class="arc-outer"
          cx="150"
          cy="134"
          r=${at}
          stroke-width="15"
          stroke-dasharray=${this.arc(this.soc,Se)}
          transform="rotate(-90 150 134)"
        />

        ${this.usable===null?p:Ct`
              <circle class="track" cx="150" cy="134" r=${it} stroke-width="5" />
              <circle
                class="arc-inner"
                cx="150" cy="134" r=${it} stroke-width="5"
                stroke-dasharray=${this.arc(this.usable,Ee)}
                transform="rotate(-90 150 134)"
              />
            `}

        <text class="num" x="146" y="132" text-anchor="middle">${a}</text>
        <text class="pct" x="196" y="132" text-anchor="start">%</text>
        <text class="cap" x="150" y="158" text-anchor="middle">${this.caption}</text>
        ${this.sub?Ct`<text class="sub" x="150" y="186" text-anchor="middle">${this.sub}</text>`:p}
      </svg>
    `}};M.styles=[_,g`
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
    `];K([v({type:Number})],M.prototype,"soc",2);K([v({type:Number})],M.prototype,"usable",2);K([v({type:String})],M.prototype,"caption",2);K([v({type:String})],M.prototype,"sub",2);M=K([k("mk-gauge")],M);var Pe=Object.defineProperty,Ce=Object.getOwnPropertyDescriptor,S=(a,t,e,s)=>{for(var i=s>1?void 0:s?Ce(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Pe(t,e,i),i};let y=class extends b{constructor(){super(...arguments),this.label="",this.value="—",this.unit="",this.foot="",this.tone="",this.bar=null,this.max=null}get fill(){return this.bar===null||this.max===null||this.max===0?null:Math.min(Math.max(this.bar/this.max*100,0),100)}render(){const a=this.fill;return d`
      <div class="label">${this.label}</div>
      <div class="num ${this.tone}">
        ${this.value}${this.unit?d`<span class="unit">${this.unit}</span>`:p}
      </div>
      ${a===null?p:d`<div class="track"><i style="width:${a}%"></i></div>`}
      ${this.foot?d`<div class="foot">${this.foot}</div>`:p}
    `}};y.styles=[_,g`
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
    `];S([v({type:String})],y.prototype,"label",2);S([v({type:String})],y.prototype,"value",2);S([v({type:String})],y.prototype,"unit",2);S([v({type:String})],y.prototype,"foot",2);S([v({type:String})],y.prototype,"tone",2);S([v({type:Number})],y.prototype,"bar",2);S([v({type:Number})],y.prototype,"max",2);y=S([k("mk-stat")],y);var Me=Object.getOwnPropertyDescriptor,Oe=(a,t,e,s)=>{for(var i=s>1?void 0:s?Me(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=n(i)||i);return i};const Te=30;let nt=class extends ${render(){const a=this.reader,t=this.fmt,e=this.t,s=a.num("battery_soc"),i=a.num("battery_total_energy"),r=a.num("stored_energy"),n=a.num("battery_power"),o=a.num("usable_energy"),l=o!==null&&i?o/i*100:null,c=n!==null&&Math.abs(n)>Te,h=c&&n<0;return d`
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
            .usable=${l}
            caption=${e("core.soc_bms")}
            sub=${l===null?"":e("core.soc_usable",{value:t.num(l,1)})}
          ></mk-gauge>

          <div class="split">
            <div>
              <div class="label">${e("core.stored")}</div>
              <div class="value">
                ${t.num(r,2)}<span class="unit">kWh</span>
              </div>
            </div>
            <div>
              <div class="label">${e("core.capacity")}</div>
              <div class="value" style="color:var(--mk-fg-2)">
                ${t.num(i,2)}<span class="unit">kWh</span>
              </div>
            </div>
            <div>
              <div class="label">${a.label("runtime_to_empty")}</div>
              <div class="value">
                ${t.num(a.num("runtime_to_empty"),1)}<span class="unit">h</span>
              </div>
            </div>
          </div>

          <div
            class="flow ${c?"":"rest"}"
            style=${c?`color: var(${h?"--mk-magenta":"--mk-accent"})`:""}
          >
            ${c?h?"▼":"▲":"•"}
            ${t.num(n===null?null:Math.abs(n),0)} W
          </div>
          <div class="label" style="margin-top:2px">
            ${e(c?h?"core.discharging_to_house":"core.charging_from_grid":"core.at_rest")}
            ${a.str("inverter_state")?` · ${a.str("inverter_state")}`:""}
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
          value=${t.num(a.num("total_daily_charging_energy"),2)}
          unit="kWh"
        ></mk-stat>
        <mk-stat
          label=${e("core.today_discharged")}
          value=${t.num(a.num("total_daily_discharging_energy"),2)}
          unit="kWh"
          tone="magenta"
        ></mk-stat>
        ${this.deltaTile()}
        <mk-stat
          label=${e("core.internal_temp")}
          value=${t.num(a.num("internal_temperature"),1)}
          unit="°C"
          tone="ok"
        ></mk-stat>
        <mk-stat
          label=${e("core.mppt_total")}
          value=${t.num(a.sum(["mppt1_power","mppt2_power","mppt3_power","mppt4_power"]),0)}
          unit="W"
        ></mk-stat>
        <mk-stat
          label=${a.label("round_trip_efficiency_total")}
          value=${t.num(a.num("round_trip_efficiency_total"),1)}
          unit="%"
          .bar=${a.num("round_trip_efficiency_total")}
          .max=${100}
        ></mk-stat>
      </div>
    `}deltaTile(){const a=this.reader,t=a.packCount(),e=[],s=[];for(let n=1;n<=t;n++){const o=a.num(`battery_${n}_max_cell_voltage`),l=a.num(`battery_${n}_min_cell_voltage`);o!==null&&e.push(o),l!==null&&s.push(l)}const i=e.length&&s.length?Math.max(...e)-Math.min(...s):null,r=i===null?"":i>.1?"crit":i>.05?"warn":"ok";return d`
      <mk-stat
        label=${this.t("core.cell_delta")}
        value=${this.fmt.millivolts(i)}
        unit="mV"
        tone=${r}
        .bar=${i}
        .max=${.1}
        foot=${t?this.t("core.pack_spread",{count:t}):this.t("core.no_delta")}
      ></mk-stat>
    `}};nt.styles=[_,g`
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
    `];nt=Oe([k("mk-view-core")],nt);var Ne=Object.defineProperty,Re=Object.getOwnPropertyDescriptor,et=(a,t,e,s)=>{for(var i=s>1?void 0:s?Re(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Ne(t,e,i),i};const ze=.005,De=.01;let D=class extends b{constructor(){super(...arguments),this.ranges=[],this.packLabel="PACK",this.formatVolts=a=>a.toFixed(3)}get bounds(){const a=this.ranges.flatMap(i=>[i.min,i.max]);if(!a.length)return{lo:3.2,hi:3.4};const t=Math.min(...a),e=Math.max(...a),s=Math.max((e-t)*.15,.005);return{lo:t-s,hi:e+s}}pct(a){const{lo:t,hi:e}=this.bounds,s=e-t||1;return(a-t)/s*100}render(){if(!this.ranges.length)return p;const{lo:a,hi:t}=this.bounds,e=[0,.25,.5,.75].map(s=>({at:s*100,value:a+(t-a)*s}));return d`
      <div class="axis">
        <div></div>
        <div class="ticks">
          ${e.map(s=>d`<span style="left:${s.at}%">${this.formatVolts(s.value)}</span>`)}
        </div>
        <div class="right"><span class="label">Δ</span></div>
      </div>

      ${this.ranges.map(s=>{const i=s.max-s.min,r=i>=De?"crit":i>=ze?"warn":"",n=this.pct(s.min),o=Math.max(this.pct(s.max)-n,.6),l=this.pct((s.min+s.max)/2);return d`
          <div class="row">
            <div><span class="name ${r}">${this.packLabel} ${s.index}</span></div>
            <div class="rail">
              <i class="bar ${r}" style="left:${n}%;width:${o}%"></i>
              <i class="mid" style="left:${l}%"></i>
            </div>
            <div class="right">
              <span class="delta ${r}">${Math.round(i*1e3)} mV</span>
              ${s.note?d`<span class="label note">${s.note}</span>`:p}
            </div>
          </div>
        `})}
    `}};D.styles=[_,g`
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
    `];et([v({attribute:!1})],D.prototype,"ranges",2);et([v({type:String})],D.prototype,"packLabel",2);et([v({attribute:!1})],D.prototype,"formatVolts",2);D=et([k("mk-pack-matrix")],D);var Ue=Object.getOwnPropertyDescriptor,Ie=(a,t,e,s)=>{for(var i=s>1?void 0:s?Ue(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=n(i)||i);return i};const je=.05,Nt=.1;let rt=class extends ${get ranges(){const a=this.reader,t=[];for(const e of this.packs){const s=a.num(`battery_${e}_min_cell_voltage`),i=a.num(`battery_${e}_max_cell_voltage`);if(s===null||i===null)continue;const r=a.num(`battery_${e}_cycle_count`),n=a.num(`battery_${e}_mos_temperature`),o=[r===null?null:`${this.fmt.num(r,0)} ⟳`,n===null?null:`${this.fmt.num(n,1)} °C`].filter(Boolean).join(" · ");t.push({index:e,min:s,max:i,note:o})}return t}render(){const a=this.reader,t=this.fmt,e=this.t,s=this.ranges,i=s.map(m=>m.max),r=s.map(m=>m.min),n=s.length?Math.max(...i)-Math.min(...r):null,o=s.reduce((m,u)=>!m||u.max-u.min>m.max-m.min?u:m,null),l=s.map(m=>m.max-m.min),c=l.length?l.reduce((m,u)=>m+u,0)/l.length:null,h=n===null?"":n>=Nt?"crit":n>=je?"warn":"ok";return d`
      <div class="grid tiles">
        <mk-stat
          label=${e("cells.highest")}
          value=${t.num(i.length?Math.max(...i):null,3)}
          unit="V"
          foot=${i.length?e("cells.in_pack",{pack:s[i.indexOf(Math.max(...i))].index}):""}
        ></mk-stat>
        <mk-stat
          label=${e("cells.lowest")}
          value=${t.num(r.length?Math.min(...r):null,3)}
          unit="V"
          foot=${r.length?e("cells.in_pack",{pack:s[r.indexOf(Math.min(...r))].index}):""}
        ></mk-stat>
        <mk-stat
          label=${e("cells.stack_spread")}
          value=${t.millivolts(n)}
          unit="mV"
          tone=${h}
          .bar=${n}
          .max=${Nt}
          foot=${e("cells.limit_hint")}
        ></mk-stat>
        <mk-stat
          label=${e("cells.mean_delta")}
          value=${t.millivolts(c)}
          unit="mV"
          foot=${o?e("cells.worst_pack",{pack:o.index,value:t.millivolts(o.max-o.min)}):""}
        ></mk-stat>
        <mk-stat
          label=${e("cells.temp_span")}
          value=${t.num(this.tempSpan(),1)}
          unit="K"
          foot=${`${t.num(a.num("min_cell_temperature"),1)} – ${t.num(a.num("max_cell_temperature"),1)} °C`}
        ></mk-stat>
        <mk-stat
          label=${e("cells.packs_online")}
          value=${`${s.length} / ${a.num("bms_pack_count")??s.length}`}
          foot=${e("cells.cells_total",{count:s.length*16})}
        ></mk-stat>
      </div>

      <div class="panel">
        <div class="head">
          <div class="label">${e("cells.matrix_title")}</div>
          <div class="label">${e("cells.matrix_axis")}</div>
        </div>
        ${s.length?d`
              <mk-pack-matrix
                .ranges=${s}
                packLabel=${e("common.pack")}
                .formatVolts=${m=>t.num(m,3)}
              ></mk-pack-matrix>
            `:d`<div class="note">${e("cells.no_ranges")}</div>`}
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
    `}tempSpan(){const a=this.reader.num("max_cell_temperature"),t=this.reader.num("min_cell_temperature");return a===null||t===null?null:a-t}protectionRows(){const a=this.reader,t=this.t,e=[];for(const s of this.packs){const i=a.num(`battery_${s}_protection_1`),r=a.num(`battery_${s}_protection_2`),n=a.num(`battery_${s}_mos_status`),o=[];i&&o.push(`P1 ${i}`),r&&o.push(`P2 ${r}`),n&&o.push(`MOS ${n}`),o.length&&e.push(`${t("common.pack")} ${s}: ${o.join(", ")}`)}return this.packs.length?d`
      ${e.length?e.map(s=>this.row(s,t("cells.raised"),"crit")):this.row(t("cells.protection_all",{count:this.packs.length}),t("cells.clear"),"ok")}
      ${this.kv("fault_status",0)} ${this.kv("fault_status_2",0)}
      ${this.bmsVersions()}
    `:d`<div class="note">${t("cells.no_ranges")}</div>`}bmsVersions(){const a=this.reader,t=new Map;for(const e of this.packs){const s=a.str(`battery_${e}_bms_version`);s!==null&&t.set(s,[...t.get(s)??[],e])}if(!t.size)return p;if(t.size===1){const[e]=[...t.keys()];return this.row(this.t("cells.bms_version"),`${this.fmt.version(e)} · ${this.t("cells.uniform")}`)}return[...t.entries()].map(([e,s])=>this.row(`${this.t("cells.bms_version")} ${this.fmt.version(e)}`,s.map(i=>`#${i}`).join(" "),"warn"))}};rt.styles=[_,g`
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
    `];rt=Ie([k("mk-view-cells")],rt);var Le=Object.defineProperty,Ve=Object.getOwnPropertyDescriptor,O=(a,t,e,s)=>{for(var i=s>1?void 0:s?Ve(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Le(t,e,i),i};let x=class extends b{constructor(){super(...arguments),this.packs=[],this.floor=null,this.packLabel="PACK",this.energyUnit="kWh",this.formatNumber=a=>a===null?"—":String(a),this.tolerance=5}fill(a){if(a===null)return"var(--mk-track)";const t=Math.min(Math.max(a,0),100)/100,e=t<.5?4+41*(t/.5):45+95*((t-.5)/.5);return`linear-gradient(180deg, hsl(${e.toFixed(0)} 74% 56%), hsl(${e.toFixed(0)} 68% 43%))`}render(){if(!this.packs.length)return p;const a=this.packs.map(e=>e.soc).filter(e=>e!==null).sort((e,s)=>e-s),t=a.length?a[Math.floor(a.length/2)]:null;return d`
      <div
        class="rack"
        style="grid-template-columns: repeat(${this.packs.length}, 1fr)"
      >
        ${this.packs.map(e=>{const s=t!==null&&e.soc!==null&&Math.abs(e.soc-t)>this.tolerance,i=e.soc===null?0:Math.min(Math.max(e.soc,0),100);return d`
            <div>
              <div class="soc ${s?"warn":""}">
                ${this.formatNumber(e.soc,1)}<span class="pct">%</span>
              </div>
              <div class="column ${s?"flagged":""}">
                <div class="fill" style="height:${i}%;background:${this.fill(e.soc)}"></div>
                ${this.floor===null?p:d`<div class="floor" style="bottom:${this.floor}%"></div>`}
                ${e.energy===null?p:d`
                      <div
                        class="readings ${i>=26?"inside":"outside"}"
                        style=${i>=26?`bottom:${i}%;transform:translateY(100%);padding-top:7px`:`bottom:${i}%;transform:translateY(-4px)`}
                      >
                        <span class="kwh">
                          ${this.formatNumber(e.energy,2)}<span class="unit">${this.energyUnit}</span>
                        </span>
                        ${e.socLabel?d`<span class="pct-line">${e.socLabel}</span>`:p}
                      </div>
                    `}
              </div>
              <div class="name ${s?"warn":""}">
                ${this.packLabel} ${e.index}
              </div>
              ${e.note?d`<div class="label note">${e.note}</div>`:p}
            </div>
          `})}
      </div>
    `}};x.styles=[_,g`
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
    `];O([v({attribute:!1})],x.prototype,"packs",2);O([v({type:Number})],x.prototype,"floor",2);O([v({type:String})],x.prototype,"packLabel",2);O([v({type:String})],x.prototype,"energyUnit",2);O([v({attribute:!1})],x.prototype,"formatNumber",2);O([v({type:Number})],x.prototype,"tolerance",2);x=O([k("mk-pack-bars")],x);var He=Object.getOwnPropertyDescriptor,We=(a,t,e,s)=>{for(var i=s>1?void 0:s?He(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=n(i)||i);return i};let Q=class extends ${constructor(){super(),this.floor=null}get packCapacity(){const a=this.reader.num("battery_total_energy"),t=this.packs.length;return a!==null&&t?a/t:null}get fills(){const a=this.reader,t=this.fmt,e=this.packCapacity;return this.packs.map(s=>{const i=a.num(`battery_soc_${s}`),r=a.num(`battery_${s}_min_cell_voltage`),n=a.num(`battery_${s}_max_cell_voltage`);return{index:s,soc:i,energy:i===null||e===null?null:i/100*e,socLabel:i===null?void 0:`${t.num(i,1)} %`,note:r===null||n===null?void 0:`${t.num(r,3)} – ${t.num(n,3)} V`}})}render(){const a=this.reader,t=this.fmt,e=this.t,s=this.fills,i=s.map(c=>c.soc).filter(c=>c!==null),r=i.length?i.reduce((c,h)=>c+h,0)/i.length:null,n=i.length?Math.max(...i)-Math.min(...i):null,o=s.reduce((c,h)=>h.energy===null?c:c+h.energy,0),l=this.packs.map(c=>a.num(`battery_${c}_cycle_count`)).filter(c=>c!==null);return d`
      <div class="grid tiles">
        <mk-stat
          label=${a.label("battery_soc")}
          value=${t.num(a.num("battery_soc"),0)}
          unit="%"
          foot=${e("packs.device_reading")}
        ></mk-stat>
        <mk-stat
          label=${e("packs.mean_soc")}
          value=${t.num(r,1)}
          unit="%"
          foot=${e("packs.from_n_packs",{count:s.length})}
        ></mk-stat>
        <mk-stat
          label=${e("packs.spread")}
          value=${t.num(n,1)}
          unit="pp"
          tone=${n===null?"":n>5?"warn":"ok"}
          .bar=${n}
          .max=${10}
        ></mk-stat>
        <mk-stat
          label=${e("packs.stored_total")}
          value=${t.num(a.num("stored_energy"),2)}
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
          value=${t.num(l.length?l.reduce((c,h)=>c+h,0):null,0)}
          foot=${l.length<this.packs.length?e("packs.cycles_partial",{have:l.length,total:this.packs.length}):""}
        ></mk-stat>
      </div>

      <div class="panel">
        <div class="head">
          <div class="label">${e("packs.fill_title")}</div>
          <div class="label">${e("packs.fill_axis")}</div>
        </div>
        ${s.length?d`
              <mk-pack-bars
                .packs=${s}
                .floor=${this.floor}
                packLabel=${e("common.pack")}
                energyUnit=${a.unit("battery_total_energy")||"kWh"}
                .formatNumber=${(c,h=0)=>t.num(c,h)}
              ></mk-pack-bars>
            `:d`<div class="note">${e("packs.none")}</div>`}
        <div class="note">
          ${this.floor===null?e("packs.fill_legend_nofloor"):e("packs.fill_legend",{floor:t.num(this.floor,0)})}
        </div>
      </div>

      ${s.length?this.table():p}
    `}table(){const a=this.reader,t=this.fmt,e=this.t,s=this.packCapacity,i=this.packs.map(n=>a.num(`battery_soc_${n}`)).filter(n=>n!==null).sort((n,o)=>n-o),r=i.length?i[Math.floor(i.length/2)]:null;return d`
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
              ${this.packs.map(n=>{const o=a.num(`battery_soc_${n}`),l=a.num(`battery_${n}_min_cell_voltage`),c=a.num(`battery_${n}_max_cell_voltage`),h=l!==null&&c!==null?c-l:null,m=[1,2,3,4].map(f=>a.num(`battery_${n}_cell_temperature_${f}`)).filter(f=>f!==null).map(f=>t.num(f,1)).join(" · "),u=r!==null&&o!==null&&Math.abs(o-r)>5;return d`
                  <tr class=${u?"flagged":""}>
                    <td class=${u?"warn":""}>${e("common.pack")} ${n}</td>
                    <td class="n ${u?"warn":""}">${t.num(o,1)} %</td>
                    <td class="n">
                      ${t.num(o===null||s===null?null:o/100*s,2)}
                    </td>
                    <td class="n">${t.num(l,3)}</td>
                    <td class="n">${t.num(c,3)}</td>
                    <td class="n ${h!==null&&h>=.01?"crit":""}">
                      ${t.millivolts(h)} mV
                    </td>
                    <td class="n">${t.num(a.num(`battery_${n}_voltage`),2)}</td>
                    <td class="n">${t.num(a.num(`battery_${n}_current`),2)}</td>
                    <td class="n">${t.num(a.num(`battery_${n}_cycle_count`),0)}</td>
                    <td class="n">${t.num(a.num(`battery_${n}_mos_temperature`),1)}</td>
                    <td class="n">${t.num(a.num(`battery_${n}_env_temperature`),1)}</td>
                    <td class="n">${m||"—"}</td>
                  </tr>
                `})}
            </tbody>
          </table>
        </div>
        <div class="note">${e("packs.table_legend")}</div>
      </div>
    `}};Q.properties={floor:{type:Number}};Q.styles=[_,g`
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
    `];Q=We([k("mk-view-packs")],Q);var Be=Object.getOwnPropertyDescriptor,Fe=(a,t,e,s)=>{for(var i=s>1?void 0:s?Be(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=n(i)||i);return i};const j=[1,2,3,4],Rt=1;let ot=class extends ${render(){const a=this.reader,t=this.fmt,e=this.t,s=j.map(o=>a.num(`mppt${o}_power`)),i=a.sum(j.map(o=>`mppt${o}_power`)),r=Math.max(...s.map(o=>o??0),1),n=s.some(o=>o!==null&&o>Rt);return j.some(o=>a.entityId(`mppt${o}_power`))?d`
      <div class="grid channels">
        ${j.map(o=>{const l=a.num(`mppt${o}_power`),c=l!==null&&l>Rt;return d`
            <div class="panel">
              <div class="head">
                <div class="label">MPPT ${o}</div>
                <span class="pill ${c?"on":""}">
                  ${e(c?"solar.active":"solar.floating")}
                </span>
              </div>
              <div class="chan-value">
                ${t.num(l,0)}<span class="chan-unit">W</span>
              </div>
              <div class="track">
                <i style="width:${l===null?0:l/r*100}%"></i>
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
            <div class="label">${e(n?"solar.some_active":"solar.all_idle")}</div>
          </div>
          <div class="chan-value">
            ${t.num(i,0)}<span class="chan-unit">W</span>
          </div>
          <div class="note">
            ${e(n?"solar.note_active":"solar.note_floating")}
          </div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${e("solar.diagnostics")}</div></div>
          ${this.kv("mppt_error",0,{tone:a.num("mppt_error")?"crit":"ok"})}
          ${this.kv("mppt_warning",0,{tone:a.num("mppt_warning")?"warn":"ok"})}
          ${this.kv("mppt_version",0)}
          ${i===null?p:this.row(e("solar.channels_reporting"),`${s.filter(o=>o!==null).length} / ${j.length}`)}
        </div>
      </div>
    `:d`<div class="panel"><div class="note">${e("solar.none")}</div></div>`}};ot.styles=[_,g`
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
    `];ot=Fe([k("mk-view-solar")],ot);var Ke=Object.getOwnPropertyDescriptor,qe=(a,t,e,s)=>{for(var i=s>1?void 0:s?Ke(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=n(i)||i);return i};const Ge=[{titleKey:"energy.today",charge:"total_daily_charging_energy",discharge:"total_daily_discharging_energy"},{titleKey:"energy.month",charge:"total_monthly_charging_energy",discharge:"total_monthly_discharging_energy",efficiency:"round_trip_efficiency_monthly"},{titleKey:"energy.lifetime",charge:"total_charging_energy",discharge:"total_discharging_energy",efficiency:"round_trip_efficiency_total"}];let lt=class extends ${render(){const a=this.t;return d`
      <div class="grid periods">${Ge.map(t=>this.period(t))}</div>
      <div class="grid below">
        ${this.efficiencyPanel()}
        <div class="panel">
          <div class="head"><div class="label">${a("energy.throughput")}</div></div>
          ${this.kv("battery_cycle_count_calc",2)} ${this.kv("battery_cycle_count",0)}
          ${this.kv("stored_energy",2)} ${this.kv("battery_total_energy",2)}
          ${this.kv("usable_energy",2)} ${this.kv("energy_to_full",2)}
          ${this.kv("remaining_cycles",0)} ${this.kv("battery_health",2)}
        </div>
      </div>
    `}period(a){const t=this.reader,e=this.fmt,s=this.t,i=t.num(a.charge),r=t.num(a.discharge);if(i===null&&r===null)return p;const n=i?(r??0)/i*100:null,o=i!==null&&r!==null?i-r:null,l=a.efficiency?t.num(a.efficiency):null;return d`
      <div class="panel">
        <div class="head">
          <div class="label">${s(a.titleKey)}</div>
          ${l===null?p:d`<span class="pill ${l<70?"w":"on"}">
                ${s("energy.rte")} ${e.num(l,1)} %
              </span>`}
        </div>
        <div class="pair">
          <div>
            <div class="big">${e.num(i,2)}</div>
            <div class="label" style="margin-top:2px">${s("energy.charged")}</div>
          </div>
          <div>
            <div class="big magenta">${e.num(r,2)}</div>
            <div class="label" style="margin-top:2px">${s("energy.discharged")}</div>
          </div>
        </div>
        <div class="track"><i style="width:100%"></i></div>
        <div class="track out">
          <i style="width:${n===null?0:Math.min(n,100)}%"></i>
        </div>
        <div style="margin-top:14px">
          ${o===null?p:this.row(s("energy.loss"),`${e.num(o,2)} kWh`,o/(i||1)>.25?"warn":"")}
          ${n===null?p:this.row(s("energy.returned"),`${e.num(n,1)} %`)}
        </div>
      </div>
    `}efficiencyPanel(){const a=this.reader,t=this.fmt,e=this.t,s=[[a.label("round_trip_efficiency_total"),a.num("round_trip_efficiency_total"),""],[a.label("round_trip_efficiency_monthly"),a.num("round_trip_efficiency_monthly"),"warn"],[a.label("conversion_efficiency"),a.num("conversion_efficiency"),"ok"]],i=a.num("round_trip_efficiency_total"),r=a.num("round_trip_efficiency_monthly"),n=i!==null&&r!==null?i-r:null;return d`
      <div class="panel">
        <div class="head"><div class="label">${e("energy.efficiency")}</div></div>
        <div class="note" style="margin-top:0;margin-bottom:16px">
          ${e("energy.rte_hint")}
        </div>
        ${s.map(([o,l,c])=>l===null?p:d`
                <div class="meter">
                  <div class="meter-head">
                    <span class="label">${o}</span>
                    <span class="value ${c}" style="font-size:13px">
                      ${t.num(l,1)} %
                    </span>
                  </div>
                  <div class="track">
                    <i
                      style="width:${Math.min(Math.max(l,0),100)}%;background:var(--mk-${c||"accent"})"
                    ></i>
                  </div>
                </div>
              `)}
        ${n===null||Math.abs(n)<5?p:d`<div class="note">
              ${e("energy.gap_hint",{value:t.num(Math.abs(n),1)})}
            </div>`}
      </div>
    `}};lt.styles=[_,g`
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
    `];lt=qe([k("mk-view-energy")],lt);var Ye=Object.getOwnPropertyDescriptor,Ze=(a,t,e,s)=>{for(var i=s>1?void 0:s?Ye(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=n(i)||i);return i};const zt=["alarm_status","fault_status","fault_status_low","fault_status_2","fault_status_2_low","mppt_error","mppt_warning"];let ct=class extends ${render(){const a=this.reader,t=this.t,e=zt.filter(s=>{const i=a.num(s);return i!==null&&i!==0});return d`
      <div class="banner ${e.length?"crit":"ok"}">
        <span class="dot"></span>
        ${e.length?t("system.faults_raised",{list:e.map(s=>a.label(s)).join(", ")}):t("system.no_faults")}
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
          ${zt.map(s=>this.kv(s,0,{tone:a.num(s)?"crit":"ok"}))}
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
    `}ceilingNote(){const a=this.reader.num("charge_to_soc");if(a===null)return p;const t=a>=10&&a<=100;return d`
      <div class="note">
        ${t?this.t("system.ceiling_used",{value:this.fmt.num(a,0)}):this.t("system.ceiling_ignored",{value:this.fmt.num(a,0)})}
      </div>
    `}};ct.styles=[_,g`
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
    `];ct=Ze([k("mk-view-system")],ct);var Je=Object.defineProperty,Qe=Object.getOwnPropertyDescriptor,U=(a,t,e,s)=>{for(var i=s>1?void 0:s?Qe(t,e):t,r=a.length-1,n;r>=0;r--)(n=a[r])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Je(t,e,i),i};const Xe=["core","cells","packs","solar","energy","system"],ts={cells:"battery_1_max_cell_voltage",packs:"battery_soc_1",solar:"mppt1_power"},Wt="marstek-panel.device";let A=class extends b{constructor(){super(...arguments),this.narrow=!1,this.tab="core",this.strings=B,this.deviceId=es(),this.catalogueFor="",this.formatter=new Tt("en"),this.t=(a,t)=>ye(this.strings,a,t)}willUpdate(a){if(!a.has("hass")||!this.hass)return;this.toggleAttribute("light",!this.hass.themes?.darkMode);const t=this.hass.language||"en";t!==this.catalogueFor&&(this.catalogueFor=t,this.formatter=new Tt(t),be(t).then(e=>{this.catalogueFor===t&&(this.strings=e)}))}selectDevice(a){this.deviceId=a;try{localStorage.setItem(Wt,a)}catch{}}tabsFor(a){return Xe.filter(t=>{const e=ts[t];return!e||a.entityId(e)!==void 0})}get devices(){return this.hass?ve(this.hass):[]}get device(){const a=this.devices;return a.length?a.find(t=>t.deviceId===this.deviceId)??a[0]:null}render(){if(!this.hass)return p;const a=this.device;if(!a)return d`
        <div class="shell">
          <div class="empty">
            <h2>${this.t("empty.no_device")}</h2>
            <p>${this.t("empty.no_device_hint")}</p>
          </div>
        </div>
      `;const t=new fe(this.hass,a),e=this.tabsFor(t),s=e.includes(this.tab)?this.tab:e[0];return d`
      <div class="shell">
        <header>
          <div class="brand">MARSTEK <em>${a.name}</em></div>
          <nav role="tablist" aria-label="Marstek Venus">
            ${e.map(i=>d`
                <button
                  class="tab"
                  role="tab"
                  aria-selected=${s===i}
                  @click=${()=>this.tab=i}
                  @keydown=${r=>this.onTabKey(r,i,e)}
                >
                  ${this.t(`tab.${i}`)}
                </button>
              `)}
          </nav>
          ${this.statusBar(t)}
        </header>

        <main>${this.renderTab(t,s)}</main>
      </div>
    `}onTabKey(a,t,e){const s=a.key==="ArrowRight"?1:a.key==="ArrowLeft"?-1:0;if(!s)return;a.preventDefault();const i=e[(e.indexOf(t)+s+e.length)%e.length];this.tab=i,this.renderRoot.querySelectorAll("button.tab")[e.indexOf(i)]?.focus()}statusBar(a){const t=this.devices,e=this.device?.deviceId,s=a.num("wifi_signal_strength");return d`
      <div class="status">
        ${t.length>1?d`
              <select
                aria-label=${this.t("common.device")}
                @change=${i=>this.selectDevice(i.target.value)}
              >
                ${t.map(i=>d`
                    <option value=${i.deviceId} ?selected=${i.deviceId===e}>
                      ${i.name}
                    </option>
                  `)}
              </select>
            `:p}
        <span>
          <i class="led ${a.has("battery_soc")?"on":"off"}"></i>
          ${this.t("status.modbus")}
        </span>
        ${s===null?p:d`<span>
              <i class="led on"></i>${this.t("status.wifi")}
              ${this.formatter.num(s,0)} dBm
            </span>`}
        ${a.str("inverter_state")?d`<span>${a.str("inverter_state")}</span>`:p}
      </div>
    `}floorPercent(a){const t=a.num("stored_energy"),e=a.num("usable_energy"),s=a.num("battery_total_energy");if(t===null||e===null||!s)return null;const i=(t-e)/s*100;return i>=0&&i<=100?i:null}renderTab(a,t){const e={reader:a,fmt:this.formatter,t:this.t};switch(t){case"cells":return d`<mk-view-cells
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
        ></mk-view-cells>`;case"packs":return d`<mk-view-packs
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
          .floor=${this.floorPercent(a)}
        ></mk-view-packs>`;case"solar":return d`<mk-view-solar
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
        ></mk-view-solar>`;case"energy":return d`<mk-view-energy
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
        ></mk-view-energy>`;case"system":return d`<mk-view-system
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
        ></mk-view-system>`;default:return d`<mk-view-core
          .reader=${e.reader}
          .fmt=${e.fmt}
          .t=${e.t}
        ></mk-view-core>`}}};A.styles=[he,_,g`
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
    `];U([v({attribute:!1})],A.prototype,"hass",2);U([v({type:Boolean})],A.prototype,"narrow",2);U([ft()],A.prototype,"tab",2);U([ft()],A.prototype,"strings",2);U([ft()],A.prototype,"deviceId",2);A=U([k("marstek-modbus-panel")],A);function es(){try{return localStorage.getItem(Wt)}catch{return null}}
