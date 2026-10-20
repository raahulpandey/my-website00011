import {useState} from 'react';
import {CODING,LANGS,TPL} from './data/questions';
import {useSectionTimer,fmt} from './hooks/useSectionTimer';
import {Header,Modal} from './Pages';
export default function Code({s,up,sec,start,onFinish}){
 const ps=CODING[sec.id];const [p,setP]=useState(0);const [out,setOut]=useState('');const [m,setM]=useState(null);
 const left=useSectionTimer(sec.min,start,onFinish);
 const key=sec.id+p,c=s.code[key]||{lang:'Python',text:TPL.Python,sub:false},q=ps[p];
 const put=o=>up(x=>({code:{...x.code,[key]:{...(x.code[key]||c),...o}}}));
 return <div className="page"><Header right={<><span className="sec">{sec.title}</span><span className={'tm'+(left<60?' low':'')}>⏱ {fmt(left)}</span></>}/>
 <div className="cwrap"><section className="card cp"><div className="tabs">{ps.map((x,n)=><button key={n} className={n===p?'on':''} onClick={()=>{setP(n);setOut('')}}>Q{n+1}{s.code[sec.id+n]?.sub?' ✓':''}</button>)}</div>
  <h3>{q.t}</h3><p>{q.d}</p><h4>Input</h4><p>{q.inp}</p><h4>Output</h4><p>{q.out}</p><h4>Constraints</h4><p>{q.con}</p><h4>Sample Input</h4><pre>{q.si}</pre><h4>Sample Output</h4><pre>{q.so}</pre></section>
  <section className="card ce"><div className="row sp"><select value={c.lang} aria-label="Language" onChange={e=>put({lang:e.target.value,text:TPL[e.target.value]})}>{LANGS.map(l=><option key={l}>{l}</option>)}</select>
   <div><button className="btn ghost" onClick={()=>setM('reset')}>Reset Code</button> <button className="btn ghost" onClick={()=>setOut(`[SIMULATED – code was NOT compiled or run]\nSample input: ${q.si}\nExpected sample output: ${q.so}`)}>Run Simulation</button> <button className="btn" onClick={()=>{put({sub:true});setOut('Code saved and marked as submitted (locally).')}}>Submit Code</button></div></div>
  <textarea className="ed" spellCheck="false" value={c.text} onChange={e=>put({text:e.target.value,sub:false})} aria-label="Code editor"/>
  <pre className="con">{out||'Console output appears here.'}</pre><div className="row"><button className="btn grey" onClick={()=>setM('fin')}>FINISH SECTION</button></div></section></div>
 {m==='reset'&&<Modal title="Reset code?" onNo={()=>setM(null)} onYes={()=>{put({text:TPL[c.lang],sub:false});setM(null)}} yes="Reset">Your code will be replaced by the starter template.</Modal>}
 {m==='fin'&&<Modal title="Submit section?" onNo={()=>setM(null)} onYes={onFinish} yes="Submit">Current code is saved. You cannot return to this section.</Modal>}</div>}
