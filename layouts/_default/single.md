{{- $params := .Scratch.Get "params" -}}
# {{ .Title }}

{{ if $params.password -}}
  ***{{ T "encryptedAbstract" }}***
{{- else -}}
  {{ .RawContent | replaceRE "\n?{{% fixit-encryptor .+ %}}((\n|.)*){{% /fixit-encryptor %}}\n?" "" }}
{{- end }}

---

> {{ T "author"}}: {{ .Site.Author.name }}  
> URL: {{ .Permalink }}  
{{ if $params.repost.enable | and (hasPrefix $params.repost.url "http") }}> {{ T "repost" }} URL: {{ $params.repost.url }}{{ end }}
