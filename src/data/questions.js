import B from './bank.json';
// Built-in default bank (edit src/data/bank.json or public/data/questions.json)
export const QS={...B};delete QS.coding;
export const CODING={...B.coding};
export const LANGS=['C','C++','Java','Python','JavaScript'];
export const TPL={C:'#include <stdio.h>\nint main(){\n  // your code\n  return 0;\n}\n','C++':'#include <iostream>\nusing namespace std;\nint main(){\n  // your code\n  return 0;\n}\n',Java:'import java.util.*;\npublic class Main{\n  public static void main(String[] a){\n    // your code\n  }\n}\n',Python:'# your code\n',JavaScript:'// your code\n'};
