FROM mcr.microsoft.com/devcontainers/javascript-node:24

# Install Hugo Extended
ARG HUGO_VERSION
RUN curl -sLJO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz" \
  && tar -C /usr/local/bin -xf "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz" hugo \
  && rm "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"

# Install Dart Sass
ARG DART_SASS_VERSION
RUN curl -sLJO "https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz" \
  && tar -C /usr/local -xf "dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz" \
  && ln -s /usr/local/dart-sass/sass /usr/local/bin/sass \
  && rm "dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz"

# Install Go
ARG GO_VERSION
RUN curl -sLJO "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" \
  && tar -C /usr/local -xf "go${GO_VERSION}.linux-amd64.tar.gz" \
  && rm "go${GO_VERSION}.linux-amd64.tar.gz"
ENV PATH="/usr/local/go/bin:${PATH}"
