{{- $params := .Scratch.Get "params" -}}
# {{ .Title }}

{{ if $params.password -}}
  ***{{ T "encryptedAbstract" }}***
{{- else -}}
  {{ .RawContent }}
{{- end }}

---

> {{ T "author"}}: {{ .Site.Author.name }}  
> {{ .Permalink }}
