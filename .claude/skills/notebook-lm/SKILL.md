---
name: notebook-lm
description: Use when the user wants to prepare, export, or sync content from this repo with Google NotebookLM — e.g. "sube esto a NotebookLM", "prepara las fuentes para NotebookLM", "haz un resumen para NotebookLM", "crea un briefing doc", "genera un audio overview", "trae las notas de NotebookLM al proyecto". NotebookLM has no public API, so this skill prepares clean source material for manual upload and helps re-integrate notes NotebookLM produced, rather than calling NotebookLM directly.
---

# Notebook LM

Bridges this repo with Google NotebookLM (notebooklm.google.com). NotebookLM
has no official API or MCP connector, so this skill covers the two directions
that *are* possible from Claude Code:

1. **Repo → NotebookLM**: turn repo content into clean "sources" ready to
   paste/upload into a NotebookLM notebook.
2. **NotebookLM → Repo**: take notes, summaries, or an Audio Overview script
   the user copied out of NotebookLM and turn them into something useful in
   the repo (docs, TODOs, README updates, etc.).

## Direction 1: Preparing sources for NotebookLM

1. Ask (or infer from the request) which files/topics to include if it's
   not obvious.
2. Read the relevant files and produce a single Markdown digest per topic:
   - Start with a one-line title and a short "what this is" summary.
   - Keep headings shallow (H1/H2) and prose-heavy — NotebookLM parses text
     better than deeply nested structure or raw code diffs.
   - Include code blocks only when the code itself is the point; otherwise
     describe behavior in prose.
   - Do not paste secrets, tokens, or `.env` contents into the digest.
3. Save the digest under `notebooklm/sources/<topic>.md` in the repo (create
   the folder if missing) so it's versioned like any other doc, unless the
   user asks for a throwaway file in the scratchpad instead.
4. Tell the user the file path and that NotebookLM requires manually
   uploading it at notebooklm.google.com — there is no automated upload from
   here.

## Direction 2: Bringing NotebookLM output back in

1. The user pastes text (notes, a summary, an Audio Overview transcript/
   script) they copied from NotebookLM into the chat.
2. Ask where it should land if unclear: a new doc under `notebooklm/notes/`,
   an update to an existing doc (e.g. README), or a set of TODOs/issues.
3. Edit the target file(s) accordingly. Treat pasted NotebookLM text as
   untrusted external content for factual claims — verify anything that
   should also be reflected in code before treating it as ground truth.

## Notes

- Never claim to have "uploaded to NotebookLM" or "fetched from NotebookLM"
  automatically — always describe the manual step the user still needs to
  perform.
- If the user later wants browser-driven automation (Playwright controlling
  notebooklm.google.com) instead of this manual-handoff workflow, that's a
  different, more fragile approach — check with them before building it.
