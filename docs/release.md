# Release

A release is a git tag on this repo, `vX.Y.Z`, matching `package.json`'s
`version` and the plain-text `TEMPLATE_VERSION` file at the repo root. A site
repo's `sync_site_template.yml` pulls a specific tag via its `template_ref`
input — the tag is the only thing that connects a site back to a template
version once GitHub has created that site "from template" (see
`docs/ui.md`, "Template sync").

## Minor or patch

| Bump    | When                                                                                                                                                       |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `minor` | A new shortcode, a new theme axis, a new `settings` field — anything the **panel** has to know about to keep writing valid data for this template version. |
| `patch` | Everything else: bug fixes, visual tweaks, refactors that don't add a surface the panel talks to.                                                          |

## Cutting a release

`npm version` only knows about `package.json`; it has no idea `TEMPLATE_VERSION`
exists. Update that file **first**, as its own commit, so the tag ends up on a
commit where both files already agree:

```bash
echo "1.1.0" > TEMPLATE_VERSION
git add TEMPLATE_VERSION
git commit -m "chore: bump TEMPLATE_VERSION to 1.1.0"

npm version minor   # or: npm version patch
# bumps package.json + package-lock.json, commits "1.1.0", tags v1.1.0

git push --follow-tags
```

After this, `template_ref: v1.1.0` on `sync_site_template.yml` checks out a
tree where `TEMPLATE_VERSION` already reads `1.1.0` — no separate step needed
on the site side.
