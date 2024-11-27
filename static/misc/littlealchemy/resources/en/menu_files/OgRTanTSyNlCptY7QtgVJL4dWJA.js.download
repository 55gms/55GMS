;window.CloudflareApps=window.Eager=window.CloudflareApps||window.Eager||{};window.CloudflareApps=window.CloudflareApps||{};CloudflareApps.siteId="3eb78d9f98cabeb48e6e4632a9e90ef0";CloudflareApps.installs=CloudflareApps.installs||{};;(function(){'use strict'
CloudflareApps.internal=CloudflareApps.internal||{}
var errors=[]
CloudflareApps.internal.placementErrors=errors
var errorHashes={}
function noteError(options){var hash=options.selector+'::'+options.type+'::'+(options.installId||'')
if(errorHashes[hash]){return}
errorHashes[hash]=true
errors.push(options)}
var initializedSelectors={}
var currentInit=false
CloudflareApps.internal.markSelectors=function markSelectors(){if(!currentInit){check()
currentInit=true
setTimeout(function(){currentInit=false})}}
function check(){var installs=window.CloudflareApps.installs
for(var installId in installs){if(!installs.hasOwnProperty(installId)){continue}
var selectors=installs[installId].selectors
if(!selectors){continue}
for(var key in selectors){if(!selectors.hasOwnProperty(key)){continue}
var hash=installId+'::'+key
if(initializedSelectors[hash]){continue}
var els=document.querySelectorAll(selectors[key])
if(els&&els.length>1){noteError({type:'init:too-many',option:key,selector:selectors[key],installId:installId})
initializedSelectors[hash]=true
continue}else if(!els||!els.length){continue}
initializedSelectors[hash]=true
els[0].setAttribute('cfapps-selector',selectors[key])}}}
CloudflareApps.querySelector=function querySelector(selector){if(selector==='body'||selector==='head'){return document[selector]}
CloudflareApps.internal.markSelectors()
var els=document.querySelectorAll('[cfapps-selector="'+selector+'"]')
if(!els||!els.length){noteError({type:'select:not-found:by-attribute',selector:selector})
els=document.querySelectorAll(selector)
if(!els||!els.length){noteError({type:'select:not-found:by-query',selector:selector})
return null}else if(els.length>1){noteError({type:'select:too-many:by-query',selector:selector})}
return els[0]}
if(els.length>1){noteError({type:'select:too-many:by-attribute',selector:selector})}
return els[0]}}());(function(){'use strict'
var prevEls={}
CloudflareApps.createElement=function createElement(options,prevEl){options=options||{}
CloudflareApps.internal.markSelectors()
try{if(prevEl&&prevEl.parentNode){var replacedEl
if(prevEl.cfAppsElementId){replacedEl=prevEls[prevEl.cfAppsElementId]}
if(replacedEl){prevEl.parentNode.replaceChild(replacedEl,prevEl)
delete prevEls[prevEl.cfAppsElementId]}else{prevEl.parentNode.removeChild(prevEl)}}
var element=document.createElement('cloudflare-app')
var container
if(options.pages&&options.pages.URLPatterns&&!CloudflareApps.matchPage(options.pages.URLPatterns)){return element}
try{container=CloudflareApps.querySelector(options.selector)}catch(e){}
if(!container){return element}
if(!container.parentNode&&(options.method==='after'||options.method==='before'||options.method==='replace')){return element}
if(container===document.body){if(options.method==='after'){options.method='append'}else if(options.method==='before'){options.method='prepend'}}
switch(options.method){case'prepend':if(container.firstChild){container.insertBefore(element,container.firstChild)
break}
case'append':container.appendChild(element)
break
case'after':if(container.nextSibling){container.parentNode.insertBefore(element,container.nextSibling)}else{container.parentNode.appendChild(element)}
break
case'before':container.parentNode.insertBefore(element,container)
break
case'replace':try{var id=element.cfAppsElementId=Math.random().toString(36)
prevEls[id]=container}catch(e){}
container.parentNode.replaceChild(element,container)}
return element}catch(e){if(typeof console!=='undefined'&&typeof console.error!=='undefined'){console.error('Error creating Cloudflare Apps element',e)}}}}());(function(){'use strict'
CloudflareApps.matchPage=function matchPage(patterns){if(!patterns||!patterns.length){return true}
var loc=document.location.host+document.location.pathname
if(window.CloudflareApps&&CloudflareApps.proxy&&CloudflareApps.proxy.originalURL){var url=CloudflareApps.proxy.originalURL.parsed
loc=url.host+url.path}
for(var i=0;i<patterns.length;i++){var re=new RegExp(patterns[i],'i')
if(re.test(loc)){return true}}
return false}}());CloudflareApps.installs["oy1J7tbRFjqx"]={appId:"ynYCifFKSA_0",scope:{}};;CloudflareApps.installs["oy1J7tbRFjqx"].options={"PPLanguage":"en","addCPBanner":false,"addPPBadge":false,"addPPBanner":false,"ppPublicId":"7940122","siteId":"636353"};;CloudflareApps.installs["oy1J7tbRFjqx"].product={"id":"iubenda-legacy"};;if(CloudflareApps.matchPage(CloudflareApps.installs['oy1J7tbRFjqx'].URLPatterns)){(function(){'use strict'
window._iub=window._iub||[]
var options=CloudflareApps.installs['oy1J7tbRFjqx'].options
var isPreview="oy1J7tbRFjqx"==='preview'
var PPLanguage=options.PPLanguage
var ppPublicId=options.ppPublicId
var siteId=options.siteId
var previewMockupIds={en:{'ppPublicId':8106822,'siteId':798710},it:{'ppPublicId':8107545,'siteId':798710},fr:{'ppPublicId':8107543,'siteId':798710},es:{'ppPublicId':8107549,'siteId':798710},de:{'ppPublicId':8107544,'siteId':798710},pt_br:{'ppPublicId':8107546,'siteId':798710},ru:{'ppPublicId':8107547,'siteId':798710},nl:{'ppPublicId':8107542,'siteId':798710}}
function documentHasPrivacyPPBadge(){if(document.getElementById('iubenda-ibadge'))return true
if(document.getElementsByClassName('iubenda-ibadge')[0])return true
if(document.getElementById('iubenda-embed'))return true
return false}
function addPrivacyPolicy(){var anchor=document.createElement('a')
anchor.href='https://www.iubenda.com/privacy-policy/'+ppPublicId
anchor.className='iubenda-white iubenda-embed no-brand iub-anchor'
anchor.title='Privacy Policy'
anchor.textContent='Privacy Policy'
document.body.appendChild(anchor)
var vendorScript=document.createElement('script')
vendorScript.src='https://cdn.iubenda.com/iubenda.js'
document.head.appendChild(vendorScript)}
function addCPBannerScript(){window._iub.csConfiguration={cookiePolicyId:ppPublicId,siteId:siteId,lang:PPLanguage}
var vendorScript=document.createElement('script')
vendorScript.src='https://cdn.iubenda.com/cookie_solution/safemode/iubenda_cs.js'
document.head.appendChild(vendorScript)}
function bootstrap(){if(isPreview){ppPublicId=previewMockupIds[PPLanguage]['ppPublicId']
siteId=previewMockupIds[PPLanguage]['siteId']}
var addPPBadge
if(typeof options.addPPBadge!=='undefined'){addPPBadge=options.addPPBadge}else if(typeof options.addPPBanner!=='undefined'){addPPBadge=options.addPPBanner}else if(typeof options.skip_badge!=='undefined'){addPPBadge=!options.skip_badge}
if(addPPBadge&&ppPublicId&&!documentHasPrivacyPPBadge()){addPrivacyPolicy()}
if(options.addCPBanner&&siteId){addCPBannerScript()}}
if(document.readyState==='loading'){window.addEventListener('DOMContentLoaded',bootstrap)}else{bootstrap()}}())}