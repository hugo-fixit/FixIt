# {{ .Site.Title }}

> {{ .Site.Params.description }}

{{ $pages := .Site.Store.Get "mainSectionPages" -}}
{{- $pages = where $pages "Draft" "eq" false -}}
{{- T "section.archiveCounter" (len $pages) }} by [{{ .Site.Params.author.name }}]({{ .Site.Params.author.link }}).
{{ range $pages.GroupByPublishDate "2006" }}
  {{- if ne .Key "0001" -}}
    {{- printf "\n## %v\n\n<details>\n<summary>%v</summary>\n\n" .Key (T "section.archiveCounter" .Pages.Len) -}}
    {{- range .Pages -}}
      {{- printf "- %v [%v](%v \"%v\")\n" (.PublishDate.Format "01-02") .Title .Permalink (.PublishDate.Format "2006-01-02 15:04:05") -}}
    {{- end -}}
    {{- printf "\n</details>\n" -}}
  {{- end -}}
{{- end -}}
