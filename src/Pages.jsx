import {useState} from 'react';
import {SECTIONS as S,INSTRUCTIONS} from './data/config';
import {QS,CODING} from './data/questions';
import {parseTxt,validate,applyBank,clearBank} from './data/bank';
import {fmt} from './hooks/useSectionTimer';

import amcatLogo from './images/amcat .webp';

export const Logo = () => (
  <img src={amcatLogo} alt="SHL Logo" className="logo-img" />
);

export const Header = ({right}) => (
  <header className="hdr">
    <Logo/>
    <div className="hr">
      {right}
      
      {/* Fullscreen Icon */}
      <span 
        className="ic fs-btn" 
        title="Full screen" 
        onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.().catch(()=>{});
          } else {
            document.exitFullscreen?.().catch(()=>{});
          }
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 5H5v3M16 5h3v3M5 16v3h3M19 16v3h-3" />
        </svg>
      </span>
      
      {/* Help Icon with Left Separator */}
      <span className="ic sep" title="Help">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 3v1" />
          <circle cx="12" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
        <span className="ic-txt">Help</span>
      </span>

      {/* Exit Icon */}
      <span className="ic" style={{marginLeft: '16px'}} title="Exit">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 4.5A9 9 0 1 0 14 19.5" />
          <path d="M10 12h10m-4-4l4 4-4 4" />
        </svg>
        <span className="ic-txt">Exit</span>
      </span>

      {/* Menu Icon */}
      <span className="ic menu-btn" style={{marginLeft: '16px'}} title="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </span>
    </div>
  </header>
);

export function Modal({title,children,onYes,onNo,yes='Confirm'}){
  return (
    <div className="ov">
      <div className="modal" role="dialog">
        <h3>{title}</h3>
        <p>{children}</p>
        <div className="row">
          <button className="btn ghost" onClick={onNo}>Cancel</button>
          <button className="btn red" onClick={onYes}>{yes}</button>
        </div>
      </div>
    </div>
  );
}

const ok = {
  e: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  m: v => /^[6-9]\d{9}$/.test(v)
};

export function Reg({onDone,saved}){
  const [f,setF] = useState(saved||{fn:'',mn:'',ln:'',em:'',mo:'',ok:false});
  const [c,setC] = useState(false);
  const [t,setT] = useState({});
  const set = k => e => setF({...f,[k]:e.target.value});
  const err = {fn:!f.fn.trim(),ln:!f.ln.trim(),em:!ok.e(f.em),mo:!ok.m(f.mo)};
  const valid = !Object.values(err).some(Boolean)&&f.ok;
  const row = (k,l,req,msg) => (
    <div className="fr">
      <label>{l}{req&&<span className="rq"> *</span>}</label>
      <div>
        <input value={f[k]} onChange={set(k)} onBlur={()=>setT({...t,[k]:1})} aria-label={l}/>
        {t[k]&&err[k]&&<div className="er">{msg}</div>}
      </div>
    </div>
  );

  return (
    <div className="page gray">
      <Header/>
      <main className="regcard">
        <h2 className="teal">Personal Information<span className="chev">⌃</span></h2>
        <hr/>
        {row('fn','First Name',1,'Required')}
        {row('mn','Middle Name')}
        {row('ln','Last Name',1,'Required')}
        {row('em','Email Address',1,'Enter a valid email')}
        {row('mo','Mobile Number',1,'Enter a 10-digit mobile number')}
      </main>
      <div className="regfoot">
        <label>
          <input type="checkbox" checked={f.ok} onChange={e=>setF({...f,ok:e.target.checked})}/> I agree to <a href="#t" onClick={e=>e.preventDefault()}>Terms and Conditions</a>
        </label>
        <div>
          <button className="btn red" onClick={()=>setC(true)}>CANCEL</button> 
          <button className="btn" disabled={!valid} onClick={()=>onDone(f)}>CONTINUE</button>
        </div>
      </div>
      {c&&<Modal title="Cancel registration?" onNo={()=>setC(false)} onYes={()=>{setF({fn:'',mn:'',ln:'',em:'',mo:'',ok:false});setT({});setC(false)}} yes="Clear form">All entered details will be cleared.</Modal>}
    </div>
  );
}

export function Ins({onStart,onBack,onBank}){
  const [msg,setMsg] = useState('');
  const fs = () => document.documentElement.requestFullscreen?.().catch(()=>{});
  const cnt = x => x.kind==='mcq' ? `${(QS[x.id]||[]).length} / ${x.count}` : `${(CODING[x.id]||[]).length}`;
  const onFile = async e => {
    const f = e.target.files[0];
    if(!f) return;
    try {
      const t = await f.text();
      const b = /\.json$/i.test(f.name) ? JSON.parse(t) : parseTxt(t);
      const er = validate(b);
      if(er.length) setMsg('Not imported: '+er.slice(0,4).join('; '));
      else { applyBank(b,true); onBank(); setMsg('Imported '+f.name); }
    } catch(x) { setMsg('Could not read file: '+x.message); }
    e.target.value = '';
  };

  return (
    <div className="page gray">
      <Header/>
      <main className="card wide">
        <h2 className="teal">Instructions</h2>
        <ul>{INSTRUCTIONS.map(t=><li key={t}>{t}</li>)}</ul>
        <table className="tbl">
          <thead>
            <tr><th>Section</th><th>Questions loaded / target</th><th>Time</th></tr>
          </thead>
          <tbody>
            {S.map(x=><tr key={x.id}><td>{x.title}</td><td>{cnt(x)}</td><td>{x.min} min</td></tr>)}
          </tbody>
        </table>
        <div className="imp">
          <b>Question database:</b> load a <code>.json</code> or <code>.txt</code> file (samples in <a href="data/questions.json" target="_blank" rel="noreferrer">questions.json</a>, <a href="data/questions.txt" target="_blank" rel="noreferrer">questions.txt</a>).
          <div className="row sp">
            <input type="file" accept=".json,.txt" onChange={onFile} aria-label="Import question file"/>
            <button className="btn ghost" onClick={()=>{clearBank();location.reload()}}>Reset to default</button>
          </div>
          {msg&&<div className="er">{msg}</div>}
        </div>
        <p className="note">Full screen needs a click and you can exit any time (Esc). This is not secure proctoring.</p>
        <div className="row">
          <button className="btn ghost" onClick={onBack}>Back</button>
          <button className="btn ghost" onClick={fs}>Start Full Screen</button>
          <button className="btn" onClick={onStart}>I Understand – Start Assessment</button>
        </div>
      </main>
    </div>
  );
}

export function stats(s){
  let att=0, tot=0, cor=0, sc=0;
  S.filter(x=>x.kind==='mcq').forEach(x=>{
    const a = s.ans[x.id]||{};
    QS[x.id].forEach((q,i)=>{
      tot++;
      if(a[i]!=null){ att++; if(a[i]===q.a) cor++; }
    });
    sc += QS[x.id].length;
  });
  const coded = Object.values(s.code).filter(c=>c.sub).length;
  return {att,tot,cor,coded,unans:tot-att};
}

export function Done({s,onNext,onRestart}){
  const t = stats(s);
  const n = [s.cand?.fn,s.cand?.mn,s.cand?.ln].filter(Boolean).join(' ');
  return (
    <div className="page gray">
      <Header/>
      <main className="card wide">
        <h2 className="teal">Assessment completed</h2>
        <p>Candidate: <b>{n}</b></p>
        <table className="tbl">
          <tbody>
            <tr><td>Sections completed</td><td>{S.length}</td></tr>
            <tr><td>MCQs attempted</td><td>{t.att} / {t.tot}</td></tr>
            <tr><td>MCQs unanswered</td><td>{t.unans}</td></tr>
            <tr><td>Coding/Automata submitted</td><td>{t.coded}</td></tr>
            <tr><td>Demo score (sample questions only)</td><td>{t.cor} / {t.tot}</td></tr>
            {S.map(x=><tr key={x.id}><td>Time used – {x.title}</td><td>{fmt(s.used[x.id]||0)}</td></tr>)}
          </tbody>
        </table>
        <p className="note">Demo summary computed locally. Nothing was sent to any server.</p>
        <div className="row">
          <button className="btn ghost" onClick={onRestart}>Restart demo</button>
          <button className="btn" onClick={onNext}>Finish</button>
        </div>
      </main>
    </div>
  );
}

export function Final(){
  const L = [
    ['Facebook', 'https://facebook.com/myamcat'],
    ['Instagram', 'https://www.instagram.com/myamcatofficial/'],
    ['LinkedIn', 'https://www.linkedin.com/showcase/myamcat'],
    ['YouTube', 'https://www.youtube.com/@AMCATtest']
  ];

  return (
    <div className="page gray fin">
      <Header/>
      <main className="final-wrapper">
        <div className="final-card">
          <p className="msg-primary">
            You have successfully completed your test. Result will be available on your AMCAT Dashboard within a week.
          </p>
          <p className="msg-secondary">
            Follow us on social media handle to get insights on career related informative articles, jobs and promotions. Check our social media channels.
          </p>
          <div className="social-links">
            {L.map(([n, u]) => (
              <div key={n} className="social-row">
                <span className="lbl">{n}:</span>{' '}
                <a href={u} target="_blank" rel="noreferrer" className="link">
                  {u}
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}