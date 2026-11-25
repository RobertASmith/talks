#!/usr/bin/env python3
"""Rebuild the talks table in README.md from _data/talks.yml.

The website reads _data/talks.yml directly; this keeps the README table on
GitHub in sync. Run from the repository root after editing the data file:

    python3 scripts/build_readme.py
"""
import pathlib
import urllib.parse

import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
BLOB = "https://github.com/RobertASmith/talks/blob/master/"
START, END = "<!-- talks:start -->", "<!-- talks:end -->"


def fmt_date(iso):
    parts = iso.split("-")
    return "/".join(reversed(parts))


def fmt_link(link):
    url = link.get("url") or BLOB + urllib.parse.quote(link["file"])
    return f"[{link['type']}]({url})"


def main():
    talks = yaml.safe_load((ROOT / "_data/talks.yml").read_text())
    lines = [
        "| Title | Institution | Date | Link |",
        "| ----- | ----------- | ---- | ---- |",
    ]
    for t in talks:
        links = "; ".join(fmt_link(l) for l in t.get("links", []))
        lines.append(f"| {t['title']} | {t['venue']} | {fmt_date(t['date'])} | {links} |")
    readme = ROOT / "README.md"
    text = readme.read_text()
    head, rest = text.split(START, 1)
    _, tail = rest.split(END, 1)
    readme.write_text(head + START + "\n" + "\n".join(lines) + "\n" + END + tail)
    print(f"Wrote {len(talks)} talks to README.md")


if __name__ == "__main__":
    main()
