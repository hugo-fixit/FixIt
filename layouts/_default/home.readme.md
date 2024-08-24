# {{ .Site.Title }}

{{ $pages := .Scratch.Get "mainSectionPages" -}}
{{- $pages = where $pages "Draft" "eq" false -}}
{{- T "section.archiveCounter" (len $pages) }}
{{ range $pages.GroupByPublishDate "2006" }}
  {{- if ne .Key "0001" -}}
    {{- printf "\n## %v\n\n%v\n\n" .Key (T "section.archiveCounter" .Pages.Len) -}}
    {{- range .Pages -}}
      {{- printf "- %v [%v](%v \"%v\")\n" (.PublishDate.Format "01-02") .Title .Permalink (.PublishDate.Format "2006-01-02 15:04:05") -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
