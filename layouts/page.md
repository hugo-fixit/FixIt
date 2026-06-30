{{- $author := .Store.Get "author" | default (partial "function/get-author-map.html" .Params.author) -}}
# {{ cond (.Param "capitalize_titles") (title .Title) .Title }}

{{ if .Params.password -}}
  _**{{ T "single.encryptedAbstract" }}**_
{{- else -}}
  {{ .RawContent | replaceRE "\n?{{% fixit-encryptor .+ %}}((\n|.)*){{% /fixit-encryptor %}}\n?" "" }}
{{- end }}

---

> {{ T "single.author"}}: {{ with $author.link }}[{{ $author.name }}]({{ . }}){{ else }}{{ $author.name }}{{ end }}  {{/* EOL */}}
> URL: {{ .Permalink }}  {{/* EOL */}}
{{ $repost := .Param "repost" | default dict -}}
{{ if $repost.enable | and (hasPrefix $repost.url "http") }}> {{ T "single.repost" }} URL: {{ $repost.url }}{{ end }}
