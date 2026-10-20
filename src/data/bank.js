// Question "database": JSON or TXT. Loaded from public/data/questions.json, or imported on the Instructions page (saved in localStorage).
import {QS,CODING} from './questions';
const K='assess-bank-v1',IDS=['english','aptitude','logical','technical','core'];
export function parseTxt(t){const b={};let sec=null,cur=null,m;
 for(const raw of t.split(/\r?\n/)){const l=raw.trim();if(!l||l.startsWith('#'))continue;
  if((m=l.match(/^\[(\w+)\]$/))){sec=m[1].toLowerCase();b[sec]=b[sec]||[];cur=null}
  else if(sec&&(m=l.match(/^Q\d*\s*[:.)]\s*(.+)/i))){cur={q:m[1],o:[],a:-1};b[sec].push(cur)}
  else if(cur&&(m=l.match(/^([A-F])\s*[).:]\s*(.+)/i)))cur.o.push(m[2]);
  else if(cur&&(m=l.match(/^ANS(?:WER)?\s*[:=]\s*([A-F])/i)))cur.a=m[1].toUpperCase().charCodeAt(0)-65;}
 return b}
export function validate(b){const e=[];if(!b||typeof b!=='object')return['File is not a valid question bank'];
 let any=false;
 for(const id of IDS)if(b[id]!==undefined){any=true;if(!Array.isArray(b[id])){e.push(id+': must be a list');continue}
  b[id].forEach((q,i)=>{const n=`${id} #${i+1}`;if(!q.q)e.push(n+': missing question text');
   if(!Array.isArray(q.o)||q.o.length<2)e.push(n+': needs at least 2 options');
   else if(!Number.isInteger(q.a)||q.a<0||q.a>=q.o.length)e.push(n+': missing/invalid answer')})}
 if(b.coding){any=true;for(const k of['coding','automata'])if(b.coding[k]&&!Array.isArray(b.coding[k]))e.push(k+': must be a list')}
 if(!any)e.push('No known sections found ('+IDS.join(', ')+', coding)');return e}
export function applyBank(b,save){IDS.forEach(id=>{if(Array.isArray(b[id]))QS[id]=b[id]});
 if(b.coding)['coding','automata'].forEach(k=>{if(Array.isArray(b.coding[k]))CODING[k]=b.coding[k]});
 if(save)try{localStorage.setItem(K,JSON.stringify(b))}catch{}}
export const clearBank=()=>{try{localStorage.removeItem(K)}catch{}};
export async function loadInitial(){
 try{const l=localStorage.getItem(K);if(l){const b=JSON.parse(l);if(!validate(b).length){applyBank(b,false);return}}}catch{}
 try{const r=await fetch(import.meta.env.BASE_URL+'data/questions.json');if(r.ok){const b=await r.json();if(!validate(b).length)applyBank(b,false)}}catch{}}
