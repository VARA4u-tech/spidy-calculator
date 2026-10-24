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
- Calculator math lives in src/lib/calculator.ts as pure functions (no eval, no UI) so it can be swapped for a REST API client later.
- Animation stack is GSAP (ScrollTrigger, with @gsap/react) for scroll-driven effects and Framer Motion for entrance/hover/progress effects; every animation must respect prefers-reduced-motion — one shared motion language across pages, don't add a third animation library.
