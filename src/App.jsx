import {useState,useEffect} from 'react';
import {SECTIONS as S} from './data/config';
import {Reg,Ins,Done,Final} from './Pages';
import {loadInitial} from './data/bank';
import Mcq from './Mcq';import Code from './Code';
const KEY='assess-demo-v1';
const fresh=()=>({step:'reg',cand:null,ans:{},rev:{},vis:{},start:{},used:{},code:{}});
export default function App(){
 const [s,set]=useState(()=>{try{return JSON.parse(sessionStorage.getItem(KEY))||fresh()}catch{return fresh()}});
 useEffect(()=>{sessionStorage.setItem(KEY,JSON.stringify(s))},[s]);
 useEffect(()=>{const f=e=>{if(s.step.startsWith('sec')){e.preventDefault();e.returnValue=''}};addEventListener('beforeunload',f);return()=>removeEventListener('beforeunload',f)},[s.step]);
 const [ready,setReady]=useState(false);const [,tick]=useState(0);
 useEffect(()=>{loadInitial().then(()=>setReady(true))},[]);
 const up=p=>set(x=>({...x,...(typeof p==='function'?p(x):p)}));
 const go=step=>up({step});
 const begin=()=>up(x=>({step:'sec0',start:{...x.start,sec0:x.start.sec0||Date.now()}}));
 const finish=i=>up(x=>{if(x.step!=='sec'+i)return{};const sec=S[i],n=i+1,last=n>=S.length;
  return{used:{...x.used,[sec.id]:Math.min(sec.min*60,Math.round((Date.now()-x.start['sec'+i])/1000))},step:last?'done':'sec'+n,start:last?x.start:{...x.start,['sec'+n]:Date.now()}}});
 const restart=()=>{sessionStorage.removeItem(KEY);set(fresh())};
 if(!ready)return null;
 const {step}=s;
 if(step==='reg')return <Reg onDone={c=>up({cand:c,step:'ins'})} saved={s.cand}/>;
 if(step==='ins')return <Ins onStart={begin} onBack={()=>go('reg')} onBank={()=>tick(n=>n+1)}/>;
 if(step==='done')return <Done s={s} onNext={()=>go('final')} onRestart={restart}/>;
 if(step==='final')return <Final onRestart={restart}/>;
 const i=+step.slice(3),sec=S[i],P={key:sec.id,s,up,sec,start:s.start[step],onFinish:()=>finish(i),idx:i};
 return sec.kind==='mcq'?<Mcq {...P}/>:<Code {...P}/>;}
