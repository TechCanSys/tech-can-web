<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Share the institutional navigation and footer through a site shell in the root route, so every public page stays consistent.
- Keep service content in a browser-safe data module shared by the home and services pages, so offerings have one source of truth.
- Use direct telephone, WhatsApp and user-prepared email links for enquiries; do not imply that a frontend form sends email automatically.
- Define visual roles and responsive presentation in the global CSS design system, so pages remain token-adherent.
- Share language and theme preferences through a root-level React provider; translate visible copy via one browser-safe dictionary to keep all public pages consistent.
