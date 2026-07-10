"use client";
import { useState, useEffect } from "react";
import { Code2, Eye, EyeOff } from "lucide-react";
import { ALGORITHM_CODES } from "@/lib/algorithms/algorithmCode";
import { tokenizeLine, TOKEN_COLORS } from "@/lib/syntax/highlighter";
import { getAlgorithmById } from "@/lib/algorithms/index";

function SyntaxLine({ code, lang, isActive }) {
  const toks = tokenizeLine(code || "", lang);
  return (
    <code className="flex-1 text-xs leading-6 py-0.5 pr-2 whitespace-pre font-mono">
      {toks.length === 0 ? <span>&#8203;</span> : toks.map((tok, ti) => {
        const col = TOKEN_COLORS[tok.type] || TOKEN_COLORS.default;
        return (
          <span key={ti} style={{
            color: isActive ? (col.active || col.normal) : col.normal,
            fontStyle: col.italic ? 'italic' : 'normal',
            fontWeight: col.bold ? 700 : isActive ? 600 : 400,
          }}>{tok.text}</span>
        );
      })}
    </code>
  );
}

function translatePythonToLang(pythonCode, targetLang) {
  if (!pythonCode) return [];
  const lines = pythonCode.split("\n");
  const resultLines = [];
  const indentStack = [];

  for (let idx = 0; idx < lines.length; idx++) {
    let line = lines[idx];
    let code = line;
    let annotation = "";

    const commentIdx = code.indexOf("#");
    if (commentIdx !== -1) {
      annotation = code.substring(commentIdx + 1).trim();
      code = code.substring(0, commentIdx);
    }

    if (targetLang === "python") {
      resultLines.push({ line: resultLines.length + 1, code: line, annotation });
      continue;
    }

    let indentStr = code.match(/^\s*/)[0];
    let indent = indentStr.length;
    let content = code.trim();

    if (!content) {
      resultLines.push({ line: resultLines.length + 1, code: "", annotation });
      continue;
    }

    while (indentStack.length > 0 && indentStack[indentStack.length - 1] >= indent) {
      const prevIndent = indentStack.pop();
      const closeIndentStr = " ".repeat(prevIndent);
      resultLines.push({
        line: resultLines.length + 1,
        code: `${closeIndentStr}}`,
        annotation: ""
      });
    }

    let isBlockStart = content.endsWith(":");

    if (content.startsWith("def ")) {
      const match = content.match(/def\s+(\w+)\((.*)\):/);
      if (match) {
        const name = match[1].replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        const args = match[2];
        let typedArgs = args;
        if (targetLang === "cpp" || targetLang === "java") {
          typedArgs = args.split(",").map(a => a.trim() ? `auto ${a.trim()}` : "").filter(Boolean).join(", ");
        }
        if (targetLang === "javascript") content = `function ${name}(${args}) {`;
        else if (targetLang === "cpp") content = `auto ${name}(${typedArgs}) {`;
        else if (targetLang === "java") content = `public static auto ${name}(${typedArgs}) {`;
      }
    }
    else if (content.startsWith("class ")) {
      const match = content.match(/class\s+(\w+):?/);
      if (match) {
        content = `class ${match[1]} {`;
        isBlockStart = true;
      }
    }
    else if (content.includes(" = len(")) {
      const match = content.match(/(\w+)\s*=\s*len\((\w+)\)/);
      if (match) {
        const varName = match[1];
        const arrName = match[2];
        if (targetLang === "javascript") content = `const ${varName} = ${arrName}.length;`;
        else if (targetLang === "cpp") content = `int ${varName} = ${arrName}.size();`;
        else if (targetLang === "java") content = `int ${varName} = ${arrName}.length;`;
      }
    }
    else if (content.startsWith("for ") && content.includes("in range(")) {
      const match = content.match(/for\s+(\w+)\s+in\s+range\((.*)\):/);
      if (match) {
        const varName = match[1];
        const rangeExpr = match[2];
        let start = "0";
        let end = rangeExpr;
        if (rangeExpr.includes(",")) {
          const parts = rangeExpr.split(",");
          start = parts[0].trim();
          end = parts[1].trim();
        }
        if (targetLang === "javascript" || targetLang === "cpp" || targetLang === "java") {
          content = `for (let ${varName} = ${start}; ${varName} < ${end}; ${varName}++) {`;
        }
      }
    }
    else if (content.startsWith("while ") && content.endsWith(":")) {
      const cond = content.substring(6, content.length - 1).trim();
      content = `while (${cond}) {`;
    }
    else if (content.startsWith("if ") && content.endsWith(":")) {
      const cond = content.substring(3, content.length - 1).trim();
      content = `if (${cond}) {`;
    }
    else if (content.startsWith("elif ") && content.endsWith(":")) {
      const cond = content.substring(5, content.length - 1).trim();
      content = `else if (${cond}) {`;
    }
    else if (content === "else:") {
      content = `else {`;
    }
    else if (content.startsWith("return ")) {
      content = content + ";";
    }
    else if (content.length > 0) {
      if (!content.endsWith("{") && !content.endsWith("}") && !content.endsWith(";")) {
        content = content + ";";
      }
    }

    content = content
      .replace(/\bNone\b/g, "null")
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false")
      .replace(/\band\b/g, "&&")
      .replace(/\bor\b/g, "||")
      .replace(/\bnot\b/g, "!");

    resultLines.push({
      line: resultLines.length + 1,
      code: indentStr + content,
      annotation
    });

    if (isBlockStart) {
      indentStack.push(indent);
    }
  }

  while (indentStack.length > 0) {
    const prevIndent = indentStack.pop();
    const closeIndentStr = " ".repeat(prevIndent);
    resultLines.push({
      line: resultLines.length + 1,
      code: `${closeIndentStr}}`,
      annotation: ""
    });
  }

  return resultLines;
}

export default function CodeTracer({ algorithmId, currentLine, currentStep, language = "python", embedded = false }) {
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  useEffect(() => {
    setSelectedLang(language);
  }, [language]);

  const algoCode = ALGORITHM_CODES[algorithmId];
  let codeLines = [];

  if (algoCode && algoCode[selectedLang]) {
    codeLines = algoCode[selectedLang].code;
  } else {
    const algoMeta = getAlgorithmById(algorithmId);
    const pythonCode = algoMeta?.code || "";
    codeLines = translatePythonToLang(pythonCode, selectedLang);
  }

  const langs = ["python", "cpp", "java", "javascript"];

  const langSwitcher = (
    <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
      {langs.map(lang => (
        <button key={lang} onClick={() => setSelectedLang(lang)}
          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md transition-all uppercase ${selectedLang === lang ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
          {lang === "javascript" ? "JS" : lang}
        </button>
      ))}
    </div>
  );

  const annotationToggle = (
    <button onClick={() => setShowAnnotations(a => !a)}
      className="flex items-center gap-1 text-[10px] font-extrabold text-slate-400 hover:text-slate-600 transition-colors uppercase">
      {showAnnotations ? <EyeOff size={10} /> : <Eye size={10} />}
      <span>{showAnnotations ? "Hide" : "Show"} notes</span>
    </button>
  );

  const renderLines = () => {
    if (codeLines.length === 0) {
      return (
        <div className="p-4 text-xs text-slate-400 italic">No code implementation available.</div>
      );
    }
    return codeLines.map(({ line, code, annotation }) => {
      const isActive = line === currentLine;
      return (
        <div key={line} className="flex items-stretch transition-colors duration-150"
          style={{
            backgroundColor: isActive ? '#fef3c7' : 'transparent',
            borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
          }}>
          <div className="w-8 shrink-0 flex items-center justify-end pr-2 text-xs select-none border-r mr-2"
            style={{
              color: isActive ? '#d97706' : '#d1d5db',
              borderColor: isActive ? '#fde68a' : '#f3f4f6',
              fontFamily: 'monospace',
            }}>{line}</div>
          <SyntaxLine code={code} lang={selectedLang} isActive={isActive} />
          {showAnnotations && annotation && (
            <div className="shrink-0 flex items-center pr-3 text-xs italic border-l ml-1"
              style={{
                color: isActive ? '#b45309' : '#94a3b8',
                borderColor: isActive ? '#fde68a' : '#f3f4f6',
                maxWidth: 150,
                minWidth: 60,
              }}>{annotation}</div>
          )}
        </div>
      );
    });
  };

  if (embedded) {
    return (
      <div className="flex flex-col h-full bg-[#fafafa]">
        <div className="flex items-center justify-end gap-3 px-3 py-1.5 bg-white border-b border-slate-100 shrink-0">
          {annotationToggle}
          {langSwitcher}
        </div>
        <div className="flex-1 overflow-y-auto font-mono py-1">
          {renderLines()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white border-t border-slate-200 shrink-0" style={{ maxHeight: 250 }}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Code2 size={13} className="text-blue-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Code Trace</span>
          {currentLine > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
              Line {currentLine}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {annotationToggle}
          {langSwitcher}
        </div>
      </div>
      <div className="overflow-y-auto flex-1 font-mono bg-[#fafafa] py-1">
        {renderLines()}
      </div>
    </div>
  );
}
