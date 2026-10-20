import {useEffect,useRef,useState} from 'react';
// Remaining time derived from a persisted start timestamp -> refresh grants no extra time.
export function useSectionTimer(min,start,onExpire){
 const calc=()=>Math.max(0,min*60-Math.floor((Date.now()-start)/1000));
 const [left,setLeft]=useState(calc);const cb=useRef(onExpire);cb.current=onExpire;
 useEffect(()=>{let done=false;const tick=()=>{const l=calc();setLeft(l);if(l<=0&&!done){done=true;clearInterval(t);cb.current()}};const t=setInterval(tick,1000);tick();return()=>clearInterval(t)},[start,min]);
 return left;}
export const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
