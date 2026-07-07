#!/usr/bin/env bash
# churn.sh — Rank files by number of commits that touched them (Git churn analysis)
#
# Usage:
#   ./scripts/churn.sh [options]
#
# Options:
#   --since <date>   Limit history (e.g. --since "6 months ago")
#   --top <n>        Number of results to show (default: 20)
#   --branch <name>  Branch to analyse (default: current branch)
#   --ext <ext>      Filter by file extension (e.g. --ext .jsx)

set -euo pipefail

# ── Defaults ──────────────────────────────────────────────────────────────────
TOP=20
SINCE=""
BRANCH="HEAD"
EXT=""

# ── Parse arguments ────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --top)    TOP="$2";    shift 2 ;;
    --since)  SINCE="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    --ext)    EXT="$2";   shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# ── Build git log command ──────────────────────────────────────────────────────
GIT_ARGS=(log --pretty=format: --name-only "$BRANCH")
[[ -n "$SINCE" ]] && GIT_ARGS+=(--since="$SINCE")

# ── Collect and rank ──────────────────────────────────────────────────────────
echo ""
echo "  Git Churn Report"
echo "  Branch : $BRANCH"
[[ -n "$SINCE"  ]] && echo "  Since  : $SINCE"
[[ -n "$EXT"    ]] && echo "  Filter : *$EXT"
echo "  Top    : $TOP files"
echo ""
printf "  %-6s  %s\n" "COMMITS" "FILE"
printf "  %-6s  %s\n" "-------" "----"

git "${GIT_ARGS[@]}" \
  | grep -v '^$' \
  | { [[ -n "$EXT" ]] && grep -F "$EXT" || cat; } \
  | sort \
  | uniq -c \
  | sort -rn \
  | head -n "$TOP" \
  | awk '{ printf "  %-6s  %s\n", $1, $2 }'

echo ""
