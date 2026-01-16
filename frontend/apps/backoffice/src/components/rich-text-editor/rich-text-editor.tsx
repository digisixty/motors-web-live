"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./toolbar-plugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

interface RichTextEditorProps {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

function onError(error: Error) {
  console.error(error);
}

const theme = {
  paragraph: "mb-1",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
  },
  heading: {
    h1: "text-2xl font-bold",
    h2: "text-xl font-bold",
    h3: "text-lg font-bold",
  },
  list: {
    ul: "list-disc ml-4",
    ol: "list-decimal ml-4",
  },
  link: "text-blue-600 underline",
};

function EditorContent({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [editor] = useLexicalComposerContext();
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!isInitializing.current && value !== undefined) {
      isInitializing.current = true;
      editor.update(() => {
        const dom = new DOMParser().parseFromString(value, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.append(...nodes);
      });
    }
  }, [editor, value]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        onChange(html);
      });
    });
  }, [editor, onChange]);

  return (
    <>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="min-h-[150px] p-3 outline-none prose prose-sm max-w-none"
            aria-placeholder={placeholder || "Enter text..."}
            placeholder={
              <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                {placeholder}
              </div>
            }
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
    </>
  );
}

const initialConfig = {
  namespace: "RichTextEditor",
  theme,
  onError,
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
};

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Enter text...",
  className = "",
}: RichTextEditorProps) {
  return (
    <div className={`rich-text-editor border rounded-md ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-inner-container">
          <ToolbarPlugin />
          <div className="editor-input-container relative">
            <EditorContent
              value={value}
              onChange={onChange}
              placeholder={placeholder}
            />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}
