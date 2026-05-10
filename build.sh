#!/usr/bin/env bash

#------------------------------------------------------------------------------
# @file
# Builds a Hugo site hosted on Vercel.
#
# The Vercel build image automatically installs Node.js dependencies.
#
# @example
# chmod a+x build.sh && ./build.sh
#------------------------------------------------------------------------------

# Exit on error, undefined variables, or pipe failures
set -euo pipefail

build_temp_dir=""

# Perform cleanup
cleanup() {
  if [[ -n "${build_temp_dir:-}" && -d "${build_temp_dir}" ]]; then
    rm -rf "${build_temp_dir}"
  fi
}

# Register the cleanup trap
trap cleanup EXIT SIGINT SIGTERM

# Build demo/test with the correct Hugo baseURL on Vercel preview deployments.
# - demo: https://${VERCEL_URL}
# - test: https://${VERCEL_URL}/test
build() {
  local target="$1"
  if [[ ! "${target}" =~ ^(demo|test)$ ]]; then
    echo "Unknown build target: ${target}" >&2
    return 2
  fi

  if [[ "${VERCEL_ENV:-}" != "preview" ]]; then
    pnpm "build:${target}"
    return
  fi

  local base_url="https://${VERCEL_URL}"
  if [[ "${target}" == "test" ]]; then
    base_url+="/test"
  fi
  pnpm "build:${target}" --buildDrafts --baseURL "${base_url}"
}

main() {
  # Define tool versions
  # You can also manage these via Environment Variables in the Vercel dashboard.
  if [[ -z "${DART_SASS_VERSION:-}" ]]; then
    DART_SASS_VERSION=1.99.0
  fi
  if [[ -z "${GO_VERSION:-}" ]]; then
    GO_VERSION=1.26.1
  fi

  # Set the build timezone
  export TZ=Asia/Shanghai

  # Create and move into a temporary directory for downloads
  build_temp_dir=$(mktemp -d)
  pushd "${build_temp_dir}" > /dev/null

  # Create the local tools directory
  mkdir -p "${HOME}/.local"

  # Install Dart Sass
  echo "Installing Dart Sass ${DART_SASS_VERSION}..."
  curl -sLJO "https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz"
  tar -C "${HOME}/.local" -xf "dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz"
  export PATH="${HOME}/.local/dart-sass:${PATH}"

  # Install Go
  # echo "Installing Go ${GO_VERSION}..."
  # curl -sLJO "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz"
  # tar -C "${HOME}/.local" -xf "go${GO_VERSION}.linux-amd64.tar.gz"
  # export PATH="${HOME}/.local/go/bin:${PATH}"

  # Install Go from the package manager
  dnf install -y golang.x86_64

  # Return to the project root
  popd > /dev/null

  # Verify installations
  echo "Verifying installations..."
  echo Dart Sass: "$(sass --version)"
  echo Go: "$(go version)"
  echo Hugo: "$(hugo version)"
  echo Node.js: "$(node --version)"

  # Configure Git
  echo "Configuring Git..."
  git config core.quotepath false
  if [ "$(git rev-parse --is-shallow-repository)" = "true" ]; then
    git fetch --unshallow
  fi

  # Build the site
  echo "Building the site..."
  build demo &
  build test &
  wait
  pnpm -F integration start
}

main "$@"
