{{- $params := .Scratch.Get "params" -}}
# {{ .Title }}

{{ if $params.password -}}
  ***{{ T "encryptedMessage" }}***
{{- else -}}
  {{ .RawContent }}
{{- end }}

---

> {{ T "author"}}: {{ .Site.Author.name }}  
> {{ .Permalink }}
