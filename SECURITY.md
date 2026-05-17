# Security Policy

## Supported versions

This repository is a starter template. Security fixes are applied to `main`. Generated applications are responsible for pulling or porting fixes into their own codebases.

## Reporting a vulnerability

Please report security issues privately to the maintainer instead of opening a public issue.

Maintainer: Jay Nogueira
Email: jailsom.nogueira@gmail.com
GitHub: https://github.com/Jailsom-Nogueira

Include:

- Affected file, dependency, workflow, or generated-app pattern.
- Reproduction steps or proof of concept.
- Impact and affected environments.
- Suggested fix, if known.

## Scope

In scope:

- Template code that could leak secrets or weaken auth, RLS, CSP, server/client boundaries, or admin gates.
- CI, scripts, or agent instructions that could encourage insecure generated apps.
- Dependency or configuration vulnerabilities in the template defaults.

Out of scope:

- Secrets committed by downstream generated apps.
- Product-specific vulnerabilities introduced after a user creates their own app from this template.
- Social engineering, spam, or denial-of-service against third-party services.

## Security defaults

- Supabase service-role access must stay server-only.
- RLS should be enabled for application tables.
- Environment access should go through `src/env.ts`.
- Public keys may be exposed only when the provider documents them as browser-safe.
- The repository URL, site URL, analytics, and email values are template defaults; generated apps should replace them.
