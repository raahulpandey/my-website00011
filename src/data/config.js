// Central config: change minutes / titles here. `count` = target number of questions.
export const SECTIONS=[
 {id:'english',title:'English',kind:'mcq',min:18,count:18},
 {id:'aptitude',title:'Aptitude',kind:'mcq',min:15,count:15},
 {id:'logical',title:'Logical Reasoning & Quantitative',kind:'mcq',min:15,count:15},
 {id:'technical',title:'Technical MCQ (CSE)',kind:'mcq',min:15,count:15},
 {id:'coding',title:'Coding',kind:'code',min:59,count:2},
 {id:'automata',title:'Fix Automata',kind:'code',min:20,count:1},
 {id:'core',title:'CSE Core MCQ',kind:'mcq',min:15,count:15}];
export const INSTRUCTIONS=[
 'The assessment has multiple sections; each has its own timer.',
 'Most MCQ questions have a one-minute budget (section timers are in the config file).',
 'Coding has two questions and a 59-minute timer. Fix Automata has a 20-minute timer.',
 'Answers are saved locally in your browser (demo only).',
 'Navigate within a section freely; each section must be submitted before the next.',
 'Code is NOT compiled or executed. "Run Simulation" shows a simulated result only.'];
