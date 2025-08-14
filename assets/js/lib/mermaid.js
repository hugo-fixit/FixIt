{{- $mermaid := .Param "mermaid" -}}
{{- $mermaidCDN := $mermaid.cdn | default "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs" -}}

import mermaid from "{{ $mermaidCDN }}";
{{- with $mermaid.zenuml }}
import zenuml from "{{ . }}";
await mermaid.registerExternalDiagrams([zenuml]);
{{- end }}
mermaid.startOnLoad = false;
window.mermaid = mermaid;
