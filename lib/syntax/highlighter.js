const _KW = {
  python:     new Set(['False','None','True','and','as','assert','async','await','break','class','continue','def','del','elif','else','except','finally','for','from','global','if','import','in','is','lambda','nonlocal','not','or','pass','raise','return','try','while','with','yield']),
  javascript: new Set(['async','await','break','case','catch','class','const','continue','debugger','default','delete','do','else','export','extends','false','finally','for','from','function','if','import','in','instanceof','let','new','null','of','return','static','super','switch','this','throw','true','try','typeof','undefined','var','void','while','with','yield']),
  typescript: new Set(['async','await','break','case','catch','class','const','continue','default','delete','do','else','enum','export','extends','false','finally','for','from','function','if','implements','import','in','instanceof','interface','let','new','null','of','return','static','super','switch','this','throw','true','try','type','typeof','undefined','var','void','while','yield','any','boolean','number','string','never','unknown','object','readonly','declare','abstract','override','private','protected','public']),
  java:       new Set(['abstract','assert','boolean','break','byte','case','catch','char','class','continue','default','do','double','else','enum','extends','final','finally','float','for','if','implements','import','instanceof','int','interface','long','native','new','package','private','protected','public','return','short','static','super','switch','synchronized','this','throw','throws','try','void','volatile','while','null','true','false','String','System','ArrayList','HashMap','List','Map','Set','Integer','Double','Boolean','Object']),
  cpp:        new Set(['auto','bool','break','case','catch','char','class','const','constexpr','continue','default','delete','do','double','else','enum','explicit','extern','false','float','for','friend','if','inline','int','long','mutable','namespace','new','nullptr','operator','private','protected','public','return','short','signed','sizeof','static','struct','switch','template','this','throw','true','try','typedef','typename','union','unsigned','using','virtual','void','volatile','while','include','define','ifdef','ifndef','pragma','endif']),
  c:          new Set(['auto','break','case','char','const','continue','default','do','double','else','enum','extern','float','for','goto','if','inline','int','long','register','return','short','signed','sizeof','static','struct','switch','typedef','union','unsigned','void','volatile','while','NULL','true','false','include','define','ifdef','ifndef','pragma','endif']),
  go:         new Set(['break','case','chan','const','continue','default','defer','else','fallthrough','for','func','go','goto','if','import','interface','map','package','range','return','select','struct','switch','type','var','nil','true','false','iota','error','string','int','int8','int16','int32','int64','uint','uint64','float32','float64','bool','byte','rune','make','new','len','cap','append','close','delete','copy','panic','recover']),
  rust:       new Set(['as','async','await','break','const','continue','crate','dyn','else','enum','extern','false','fn','for','if','impl','in','let','loop','match','mod','move','mut','pub','ref','return','self','Self','static','struct','super','trait','true','type','unsafe','use','where','while','i8','i16','i32','i64','i128','u8','u16','u32','u64','u128','f32','f64','bool','char','str','String','Vec','Option','Some','None','Result','Ok','Err','Box']),
  php:        new Set(['abstract','and','as','break','callable','case','catch','class','clone','const','continue','declare','default','do','echo','else','elseif','extends','final','finally','fn','for','foreach','function','global','if','implements','include','instanceof','interface','match','namespace','new','or','print','private','protected','public','require','return','static','switch','throw','trait','try','use','var','while','null','true','false','int','string','float','bool','array','void']),
  ruby:       new Set(['BEGIN','END','alias','and','begin','break','case','class','def','do','else','elsif','end','ensure','false','for','if','in','module','next','nil','not','or','redo','rescue','retry','return','self','super','then','true','undef','unless','until','when','while','yield']),
  swift:      new Set(['associatedtype','class','deinit','enum','extension','fileprivate','func','import','init','inout','internal','let','open','operator','private','protocol','public','rethrows','struct','subscript','typealias','var','break','case','continue','default','defer','do','else','fallthrough','for','guard','if','in','repeat','return','switch','throw','where','while','as','Any','catch','false','is','nil','super','self','Self','throws','true','try','mutating','final','lazy','override','required','static','weak']),
  kotlin:     new Set(['abstract','as','break','by','catch','class','companion','const','constructor','continue','data','do','else','enum','external','false','final','finally','for','fun','if','import','in','infix','init','inline','inner','interface','internal','is','lateinit','null','object','open','operator','out','override','package','private','protected','public','return','sealed','super','suspend','tailrec','this','throw','true','try','typealias','val','var','vararg','when','where','while']),
};

const _BI = {
  python:     new Set(['print','len','range','type','input','open','int','str','float','list','dict','set','tuple','bool','enumerate','zip','map','filter','sorted','reversed','sum','min','max','abs','round','format','repr','id','hash','hex','oct','bin','ord','chr','iter','next','super','property','staticmethod','classmethod','isinstance','issubclass','hasattr','getattr','setattr','delattr','dir','vars','callable','eval','exec']),
  javascript: new Set(['console','Math','JSON','Array','Object','String','Number','Boolean','Promise','Date','RegExp','Error','Map','Set','WeakMap','WeakSet','Symbol','Proxy','parseInt','parseFloat','isNaN','isFinite','setTimeout','setInterval','clearTimeout','clearInterval','fetch','document','window','process','require','module','exports']),
  typescript: new Set(['console','Math','JSON','Array','Object','String','Number','Boolean','Promise','Date','RegExp','Error','Map','Set','WeakMap','WeakSet','Symbol','Proxy','parseInt','parseFloat','isNaN','isFinite','setTimeout','setInterval','clearTimeout','clearInterval','fetch','document','window','process','Partial','Required','Readonly','Record','Pick','Omit','Exclude','Extract','NonNullable','ReturnType','InstanceType','Parameters']),
  java:       new Set(['System','out','println','print','err','Math','String','Integer','Double','Float','Boolean','Long','Arrays','Collections','ArrayList','HashMap','HashSet','LinkedList','Queue','Stack','Scanner','StringBuilder','StringBuffer','Thread','Object','Class','Exception']),
  go:         new Set(['fmt','Println','Printf','Sprintf','Errorf','os','io','bufio','strings','strconv','math','sort','time','sync','http','json','reflect','errors','log']),
  rust:       new Set(['println','eprintln','format','todo','unreachable','unimplemented','panic','assert','assert_eq','assert_ne','dbg','vec','print']),
};

export function detectLang(lang) {
  const l = (lang || '').toLowerCase().trim().replace(/\s/g, '');
  if (l === 'py' || l.includes('python')) return 'python';
  if (l === 'ts' || l === 'tsx' || l.includes('typescript')) return 'typescript';
  if (l === 'js' || l === 'jsx' || l.includes('javascript')) return 'javascript';
  if ((l === 'java' || l.includes('java')) && !l.includes('script')) return 'java';
  if (l === 'cpp' || l === 'cc' || l === 'cxx' || l.includes('c++')) return 'cpp';
  if (l === 'c') return 'c';
  if (l === 'go' || l === 'golang') return 'go';
  if (l === 'rs' || l.includes('rust')) return 'rust';
  if (l === 'php') return 'php';
  if (l === 'rb' || l.includes('ruby')) return 'ruby';
  if (l.includes('swift')) return 'swift';
  if (l === 'kt' || l.includes('kotlin')) return 'kotlin';
  return 'javascript';
}

export function tokenizeLine(rawLine, lang) {
  const n = detectLang(lang);
  const kw = _KW[n] || _KW.javascript;
  const bi = _BI[n] || _BI.javascript;
  const lc = ['python', 'ruby'].includes(n) ? '#' : '//';
  const tokens = [];
  let i = 0;
  const t = rawLine || '';
  while (i < t.length) {
    const rest = t.slice(i);
    if (rest.startsWith(lc)) { tokens.push({ text: rest, type: 'comment' }); break; }
    if ((['python', 'ruby'].includes(n)) && t[i] === '#') { tokens.push({ text: rest, type: 'comment' }); break; }
    if (rest.startsWith('/*')) {
      const end = t.indexOf('*/', i + 2);
      if (end === -1) { tokens.push({ text: rest, type: 'comment' }); break; }
      tokens.push({ text: t.slice(i, end + 2), type: 'comment' }); i = end + 2; continue;
    }
    if (t[i] === '"' || t[i] === "'" || t[i] === '`') {
      const q = t[i];
      if (n === 'python' && t.slice(i, i + 3) === q + q + q) {
        const te = t.indexOf(q + q + q, i + 3);
        if (te === -1) { tokens.push({ text: rest, type: 'string' }); break; }
        tokens.push({ text: t.slice(i, te + 3), type: 'string' }); i = te + 3; continue;
      }
      let j = i + 1;
      while (j < t.length && t[j] !== q) { if (t[j] === '\\') j++; j++; }
      tokens.push({ text: t.slice(i, j + 1), type: 'string' }); i = j + 1; continue;
    }
    const numM = rest.match(/^(?:0x[\da-fA-F]+|0b[01]+|\d+\.?\d*(?:[eE][+-]?\d+)?)/);
    if (numM && (i === 0 || /[\s\(,=+\-*\/\[\{:<>!&|^~%?;]/.test(t[i - 1]))) {
      tokens.push({ text: numM[0], type: 'number' }); i += numM[0].length; continue;
    }
    const idM = rest.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (idM) {
      const w = idM[0]; const after = t[i + w.length];
      if (kw.has(w)) tokens.push({ text: w, type: 'keyword' });
      else if (bi.has(w)) tokens.push({ text: w, type: 'builtin' });
      else if (after === '(') tokens.push({ text: w, type: 'function' });
      else tokens.push({ text: w, type: 'identifier' });
      i += w.length; continue;
    }
    const opM = rest.match(/^[+\-*\/=<>!&|%^~?:;,.()\[\]{}'@\\]/);
    if (opM) { tokens.push({ text: opM[0], type: 'operator' }); i += opM[0].length; continue; }
    tokens.push({ text: t[i], type: 'default' }); i++;
  }
  return tokens;
}

export const TOKEN_COLORS = {
  comment:    { normal: '#6b7280', active: '#9ca3af', italic: true },
  string:     { normal: '#15803d', active: '#166534' },
  number:     { normal: '#c2410c', active: '#9a3412' },
  keyword:    { normal: '#7c3aed', active: '#5b21b6', bold: true },
  builtin:    { normal: '#0369a1', active: '#075985' },
  function:   { normal: '#1d4ed8', active: '#1e40af' },
  operator:   { normal: '#0891b2', active: '#0e7490' },
  identifier: { normal: '#334155', active: '#0f172a' },
  default:    { normal: '#475569', active: '#1e293b' },
};
