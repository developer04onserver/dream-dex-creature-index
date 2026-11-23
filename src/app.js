import { creatures } from "./catalog.js";
import { filterCreatures, buildParty, calculatePower } from "./core.js";
import "./style.css";

const get=id=>{const node=document.getElementById(id);if(!node)throw new Error("Missing #"+id);return node;};
const grid=get("creature-grid"),search=get("search"),habitat=get("habitat"),rarity=get("rarity");
const dialog=get("creature-dialog"),detailArt=get("detail-art");
let saved=readSaved(),party=[],currentId=null,savedOnly=false;
let paused=matchMedia("(prefers-reduced-motion: reduce)").matches;
function readSaved(){try{const x=JSON.parse(localStorage.getItem("dream-dex:saved")||"[]");return new Set(Array.isArray(x)?x.filter(v=>typeof v==="string"):[]);}catch{return new Set();}}
function persist(){try{localStorage.setItem("dream-dex:saved",JSON.stringify([...saved]));}catch{/* Optional local-only storage. */}}
function pauseSvg(object){const svg=object.contentDocument?.documentElement;if(!svg||typeof svg.pauseAnimations!=="function")return;paused?svg.pauseAnimations():svg.unpauseAnimations();}
function card(item,index){
 const article=document.createElement("article");article.className="creature-card";article.dataset.id=item.id;article.style.setProperty("--tone",item.primary);article.style.setProperty("--accent",item.accent);
 const open=document.createElement("button");open.type="button";open.className="creature-open";open.dataset.open=item.id;open.setAttribute("aria-label","Read field notes for "+item.name);
 const art=document.createElement("div");art.className="creature-art";const object=document.createElement("object");object.className="creature-svg";object.data=item.art;object.type="image/svg+xml";object.width="132";object.height="132";object.setAttribute("aria-hidden","true");object.addEventListener("load",()=>pauseSvg(object));art.append(object);
 const meta=document.createElement("div");meta.className="meta";const name=document.createElement("h3");name.textContent=item.name;const badge=document.createElement("span");badge.className="rarity "+item.rarity;badge.textContent=item.rarity;meta.append(name,badge);
 const habitatTag=document.createElement("span");habitatTag.className="habitat-tag";habitatTag.textContent=item.habitat;
 const num=document.createElement("span");num.className="num";num.textContent=String(index+1).padStart(2,"0");
 open.append(art,meta,habitatTag,num);
 const save=document.createElement("button");save.type="button";save.className="save-btn"+(saved.has(item.id)?" saved":"");save.dataset.save=item.id;save.textContent=saved.has(item.id)?"♥":"♡";save.setAttribute("aria-pressed",String(saved.has(item.id)));save.setAttribute("aria-label",(saved.has(item.id)?"Remove ":"Save ")+item.name);
 article.append(open,save);return article;
}
function render(){const visible=filterCreatures(creatures,search.value,habitat.value,rarity.value,savedOnly?saved:null);grid.replaceChildren(...visible.map(item=>card(item,creatures.indexOf(item))));grid.hidden=!visible.length;get("empty").hidden=!!visible.length;get("count").textContent=visible.length+" creatures "+(savedOnly?"saved":"discovered");}
function setSaved(id){saved.has(id)?saved.delete(id):saved.add(id);persist();render();if(currentId===id)syncDetailSave();}
function syncDetailSave(){const active=saved.has(currentId);get("save-creature").textContent=active?"♥ Saved":"♡ Save creature";get("save-creature").setAttribute("aria-pressed",String(active));}
function openDetail(id){const item=creatures.find(c=>c.id===id);if(!item)return;currentId=id;detailArt.data=item.art;detailArt.setAttribute("aria-label",item.name);get("detail-label").textContent=item.habitat.toUpperCase()+" HABITAT / "+item.rarity.toUpperCase();get("detail-name").textContent=item.name;get("detail-story").textContent=item.story;get("power").textContent=item.power;get("guard").textContent=item.guard;get("wonder").textContent=item.wonder;get("creature-id").textContent="SPECIMEN "+item.id.toUpperCase();detailArt.addEventListener("load",()=>pauseSvg(detailArt),{once:true});syncDetailSave();if(!dialog.open)dialog.showModal();}
function refreshParty(){const panel=get("party-panel"),container=get("party-grid");container.replaceChildren();party.forEach(item=>{const node=document.createElement("div");node.className="party-member";const title=document.createElement("strong");title.textContent=item.name;const habitat=document.createElement("span");habitat.textContent=item.habitat;node.append(title,habitat);container.append(node);});get("party-score").textContent="Average power: "+(party.length?calculatePower(party):"—")+" / 100";panel.hidden=!party.length;}
function addParty(id){const item=creatures.find(c=>c.id===id);if(!item||party.some(c=>c.id===id)||party.length>=4)return;party=[...party,item];refreshParty();}
function setMotion(value){paused=value;document.documentElement.classList.toggle("paused",value);get("motion").setAttribute("aria-pressed",String(value));get("motion").textContent=value?"▶ Resume":"Ⅱ Pause";document.querySelectorAll("object.creature-svg,object.hero-creature,object#detail-art").forEach(pauseSvg);}
function exportSaved(){const data=creatures.filter(c=>saved.has(c.id));const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),count:data.length,creatures:data},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="dream-dex-collection.json";a.click();URL.revokeObjectURL(url);}
grid.addEventListener("click",event=>{const button=event.target.closest("button");if(!button)return;if(button.dataset.open)openDetail(button.dataset.open);if(button.dataset.save)setSaved(button.dataset.save);});
search.addEventListener("input",render);habitat.addEventListener("change",render);rarity.addEventListener("change",render);
get("favorites-filter").addEventListener("click",()=>{savedOnly=!savedOnly;get("favorites-filter").setAttribute("aria-pressed",String(savedOnly));get("favorites-filter").textContent=savedOnly?"♥ Saved only":"♡ Saved";render();});
get("party").addEventListener("click",()=>{const visible=filterCreatures(creatures,search.value,habitat.value,rarity.value,savedOnly?saved:null);party=buildParty(visible,4);refreshParty();get("party-panel").scrollIntoView({behavior:paused?"auto":"smooth",block:"center"});});
get("clear-party").addEventListener("click",()=>{party=[];refreshParty();});
get("save-creature").addEventListener("click",()=>{if(currentId)setSaved(currentId);});
get("add-party").addEventListener("click",()=>{if(currentId)addParty(currentId);});
get("motion").addEventListener("click",()=>setMotion(!paused));get("export").addEventListener("click",exportSaved);
document.addEventListener("keydown",event=>{if(event.key==="/"&&document.activeElement!==search&&!event.ctrlKey&&!event.metaKey&&!event.altKey){event.preventDefault();search.focus();}if(event.key==="Escape"&&document.activeElement===search){search.value="";search.blur();render();}});
matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",event=>{if(event.matches)setMotion(true);});
setMotion(paused);render();
