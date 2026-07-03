"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import { MessagesContext } from "@/context/MessagesContext";
import axios from "axios";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Loader2Icon, Download } from "lucide-react";
import JSZip from "jszip";

const PANE_HEIGHT = "calc(100vh - 11.5rem)";

const startedCodeGenerations = new Set();

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages } = useContext(MessagesContext);
  const updateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchFiles();
  }, [id]);

  const fetchFiles = async () => {
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      const processedFiles = preprocessFiles(result?.fileData || {});
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...processedFiles };
      setFiles(mergedFiles);
    } catch (error) {
      console.error("Error fetching workspace files:", error);
    }
  };

  const sanitizeCode = (code) =>
    code
      .replace(/import\.meta\.env\.\w+/g, "undefined")
      .replace(/import\.meta\.env/g, "({})")
      .replace(/import\.meta/g, "({})");

  const preprocessFiles = (filesObj) => {
    const processed = {};
    Object.entries(filesObj).forEach(([path, content]) => {
      if (typeof content === "string") {
        processed[path] = { code: sanitizeCode(content) };
      } else if (content && typeof content === "object") {
        processed[path] = content.code
          ? { ...content, code: sanitizeCode(content.code) }
          : { code: JSON.stringify(content, null, 2) };
      }
    });
    return processed;
  };

  useEffect(() => {
    if (!messages?.length) return;
    const last = messages[messages.length - 1];
    if (last.role !== "user") return;
    const key = `${id}:${messages.length}:${last.content}`;
    if (startedCodeGenerations.has(key)) return;
    startedCodeGenerations.add(key);
    generateAiCode();
  }, [messages]);

  const generateAiCode = async () => {
    setLoading(true);
    try {
      const isFollowUp = messages.length > 1;
      const filesContext = isFollowUp
        ? " CURRENT_FILES: " + JSON.stringify(files)
        : "";
      const PROMPT =
        JSON.stringify(messages) + filesContext + " " + Prompt.CODE_GEN_PROMPT;
      const result = await axios.post("/api/gen-ai-code", { prompt: PROMPT });

      let aiFiles = result.data?.files;
      if (!aiFiles && typeof result.data?.result === "string") {
        try {
          const parsedResult = JSON.parse(result.data.result);
          aiFiles = parsedResult?.files;
        } catch {
          aiFiles = undefined;
        }
      }

      if (!aiFiles) {
        console.error("Code generation produced no files", result.data);
      }

      const processedAiFiles = preprocessFiles(aiFiles || {});
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...processedAiFiles };
      setFiles(mergedFiles);

      if (id) {
        await updateFiles({
          workspaceId: id,
          files: aiFiles || {},
        });
      }
    } catch (error) {
      console.error("Error generating AI code:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFiles = async () => {
    try {
      const zip = new JSZip();

      Object.entries(files).forEach(([filename, content]) => {
        let fileContent;
        if (typeof content === "string") fileContent = content;
        else if (content && typeof content === "object")
          fileContent = content.code || JSON.stringify(content, null, 2);

        if (fileContent) {
          const cleanFileName = filename.startsWith("/")
            ? filename.slice(1)
            : filename;
          zip.file(cleanFileName, fileContent);
        }
      });

      const packageJson = {
        name: "generated-project",
        version: "1.0.0",
        private: true,
        dependencies: Lookup.DEPENDENCY,
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
      };
      zip.file("package.json", JSON.stringify(packageJson, null, 2));

      const blob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "project-files.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading files:", error);
    }
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-6.5rem)] lg:h-[calc(100vh-7.5rem)] rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
      <div className="w-full px-3 py-2 border-b border-neutral-800 bg-black/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center shrink-0 bg-neutral-900 border border-neutral-800 p-1 gap-1 rounded-full">
            {["code", "preview"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm px-4 py-1 rounded-full transition-colors duration-200 ${
                  activeTab === tab
                    ? "bg-white text-black font-medium"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={downloadFiles}
            className="flex items-center gap-2 bg-gradient-to-b from-white to-neutral-200 hover:to-neutral-300 text-black text-sm font-semibold px-4 py-1.5 rounded-full transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <SandpackProvider
        files={files}
        template="react"
        theme="dark"
        customSetup={{
          dependencies: { ...Lookup.DEPENDENCY },
          entry: "/index.js",
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          bundlerTimeoutSecs: 120,
          recompileMode: "immediate",
          recompileDelay: 300,
        }}
      >
        <SandpackLayout style={{ border: "none", borderRadius: 0 }}>
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: PANE_HEIGHT }} />
              <SandpackCodeEditor
                style={{ height: PANE_HEIGHT }}
                showTabs
                showLineNumbers
                showInlineErrors
                wrapContent
              />
            </>
          ) : (
            <SandpackPreview
              style={{ height: PANE_HEIGHT }}
              showNavigator
              showOpenInCodeSandbox={false}
              showRefreshButton
            />
          )}
        </SandpackLayout>
      </SandpackProvider>

      {loading && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center gap-4 z-10">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white text-lg">Generating files...</h2>
        </div>
      )}
    </div>
  );
}

export default CodeView;
