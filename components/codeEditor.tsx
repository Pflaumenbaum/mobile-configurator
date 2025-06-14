"use dom";

import Editor, { EditorProps } from "@monaco-editor/react";
import React, { useEffect, useRef, useState } from "react";
import { useColorScheme } from "react-native";

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: EditorProps["theme"];
  options?: EditorProps["options"];
  height?: string | number;
  width?: string | number;
  formatOnMount?: boolean;
  autoComplete?: "plist";
}
const CodeEditor = (props: CodeEditorProps) => {
  const [code, setCode] = useState(props.initialValue);
  const editorRef = useRef<any>(null);
  const ColorTheme = useColorScheme();

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    if (props.formatOnMount) {
      setTimeout(() => {
        editor.getAction("editor.action.formatDocument")?.run();
      }, 100);
    }
    if (props.autoComplete === "plist") {
      monaco.languages.registerCompletionItemProvider("xml", {
        provideCompletionItems: () => {
          const tags = [
            "array",
            "dict",
            "true",
            "false",
            "string",
            "data",
            "date",
            "key",
          ];
          const selfClosingTags = ["true", "false"];

          const suggestions = tags.map((tag) => ({
            label: `${tag}`,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: selfClosingTags.includes(tag)
              ? `<${tag}/>$0`
              : `<${tag}>$0</${tag}>`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: `Insert <${tag}> ... </${tag}>`,
          }));

          return { suggestions };
        },

        triggerCharacters: ["<"],
      });
    }
  }

  useEffect(() => {
    props.onChange(code);
  }, [props.initialValue]);

  return (
    <Editor
      language={props.language || "json"}
      theme={props.theme || ColorTheme === "dark" ? "vs-dark" : "vs-light"}
      onMount={(editor, monaco) => handleEditorDidMount(editor, monaco)}
      value={code}
      height={props.height}
      width={props.width}
      onChange={(value) => {
        setCode(value || "");
        props.onChange(value || "");
      }}
      options={props.options}
    />
  );
};

export default CodeEditor;
