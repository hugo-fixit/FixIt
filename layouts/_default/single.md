{{- $params := .Scratch.Get "params" -}}
# {{ .Title }}

{{ if $params.password -}}
  ***{{ T "encryptedAbstract" }}***
{{- else -}}
  {{ .RawContent | replaceRE "\n?{{% fixit-encryptor .+ %}}((\n|.)*){{% /fixit-encryptor %}}\n?" "" }}
{{- end }}

---

> {{ T "author"}}: {{ .Site.Author.name }}  
> {{ .Permalink }}
