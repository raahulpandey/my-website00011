import {useState} from 'react';
import {QS} from './data/questions';
import {useSectionTimer,fmt} from './hooks/useSectionTimer';
import {Header,Modal} from './Pages';

export default function Mcq({s,up,sec,start,onFinish}){
 const qs=QS[sec.id],id=sec.id;const [i,setI]=useState(0);const [conf,setC]=useState(false);
 const left=useSectionTimer(sec.min,start,onFinish);
 const A=s.ans[id]||{},R=s.rev[id]||{},V={0:1,...(s.vis[id]||{})};
 const patch=(k,fn)=>up(x=>({[k]:{...x[k],[id]:fn(x[k][id]||{})}}));
 const goQ=n=>{setI(n);patch('vis',v=>({...v,[n]:1}))};
 const cls=n=>n===i?'cur':A[n]!=null&&R[n]?'ar':R[n]?'rv':A[n]!=null?'an':V[n]?'vu':'nv';
 const un=qs.filter((_,n)=>A[n]==null).length;const q=qs[i];

 return (
   <div className="page">
     <Header right={<><span className="sec">{sec.title}</span><span className={'tm'+(left<60?' low':'')} aria-live="off">{fmt(left)}</span></>}/>
     <div className="body">
       <div className="qcol">
         
         <main className="card q">
           {/* LEFT SIDE: Question Area */}
           <div className="q-left">
             <div className="qh">Choose the correct option. <span className="qn" style={{float:'right'}}></span></div>
             <div className="qt">{q.q}</div>
           </div>

           {/* RIGHT SIDE: Options Area */}
           <div className="q-right">
             <h4 className="opt-heading">Options</h4>
             <div role="radiogroup">
               {q.o.map((o,n)=><button key={n} role="radio" aria-checked={A[i]===n} className={'opt'+(A[i]===n?' sel':'')} onClick={()=>patch('ans',a=>({...a,[i]:n}))}>{o}</button>)}
             </div>
           </div>
         </main>

         <div className="ctl">
           {/* <button className="btn ghost" disabled={!i} onClick={()=>goQ(i-1)}>Previous</button> */}
           {/* <button className="btn ghost" onClick={()=>patch('rev',r=>({...r,[i]:!r[i]}))}>{R[i]?'Unmark Review':'Mark for Review'}</button> */}
           {/* <button className="btn ghost" disabled={A[i]==null} onClick={()=>patch('ans',a=>{const b={...a};delete b[i];return b})}>Clear Response</button> */}
           
           {/* Logic for NEXT / SUBMIT ANSWER */}
           {i === qs.length - 1 ? (
             <button className="btn grey" onClick={() => setC(true)}>SUBMIT ANSWER</button>
           ) : (
             <button className="btn grey" onClick={() => goQ(i + 1)}>NEXT</button>
           )}
          
         </div>
       </div>
       
       <aside className="pal">
         <div className="pg">
           {qs.map((_,n)=><button key={n} className={'pb '+cls(n)} onClick={()=>goQ(n)} aria-label={'Question '+(n+1)} title={'Question '+(n+1)}>{n+1}</button>)}
         </div>
         <ul className="lg" hidden>
           <li><i className="pb an"/>Answered</li>
           <li><i className="pb vu"/>Unanswered</li>
           <li><i className="pb nv"/>Not visited</li>
           <li><i className="pb rv"/>Review</li>
           <li><i className="pb ar"/>Answered+Review</li>
           <li><i className="pb cur"/>Current</li>
         </ul>
       </aside>
     </div>
     {conf&&<Modal title="Submit section?" onNo={()=>setC(false)} onYes={onFinish} yes="Submit">{un?`${un} question(s) are unanswered. `:''}You cannot return to this section.</Modal>}
   </div>
 );
}