#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./publish.sh <patch|minor|major|prerelease|preminor|premajor|version>

Examples:
  ./publish.sh patch
  ./publish.sh minor
  ./publish.sh 1.2.3
EOF
}

if [[ "${1:-}" == "" ]] || [[ "${1:-}" == "-h" ]] || [[ "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

bump="$1"

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"
package_json_rel="packages/post-encrypt/package.json"
package_json_abs="${repo_root}/${package_json_rel}"

if [[ ! -f "${package_json_abs}" ]]; then
  echo "Cannot find ${package_json_rel}" >&2
  exit 1
fi

if [[ -n "$(git -C "${repo_root}" status --porcelain)" ]]; then
  echo "Working tree is not clean. Commit or stash changes before release." >&2
  exit 1
fi

npm --prefix "${script_dir}" version "${bump}" --no-git-tag-version > /dev/null
version="$(node -p "require('${package_json_abs}').version")"

tag="post-encrypt-v${version}"
commit_msg="chore(release): post-encrypt ${version}"
tag_msg="release: @hugo-fixit/post-encrypt ${version}"

if git -C "${repo_root}" rev-parse -q --verify "refs/tags/${tag}" > /dev/null; then
  echo "Tag already exists: ${tag}" >&2
  exit 1
fi

git -C "${repo_root}" add "${package_json_rel}"
git -C "${repo_root}" commit -m "${commit_msg}"
git -C "${repo_root}" tag -a "${tag}" -m "${tag_msg}"

echo "Released @hugo-fixit/post-encrypt ${version}"
echo "Created commit: ${commit_msg}"
echo "Created tag: ${tag}"
echo "Next: git push origin main --follow-tags"
