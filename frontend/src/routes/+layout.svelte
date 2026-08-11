<script>
  import '@fontsource-variable/inter/wght.css'; // self-hosted Inter — no external CDN
  import '../app.css';
  import { base } from '$app/paths';
  import { appConfig } from '$lib/config';
  import { t, getLang, toggleLang } from '$lib/i18n.svelte';
  import { onMount } from 'svelte';
  let { children } = $props();

  // Theme toggle — same mechanics as the landing: stamp data-theme on <html>,
  // which beats prefers-color-scheme in both directions. No persistence.
  let dark = $state(false);
  function isDark() {
    const stamped = document.documentElement.getAttribute('data-theme');
    return stamped === 'dark' || (!stamped && matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function toggleTheme() {
    document.documentElement.setAttribute('data-theme', isDark() ? 'light' : 'dark');
    dark = isDark();
  }
  onMount(() => {
    dark = isDark();
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const sync = () => { dark = isDark(); };
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  });
</script>

<div class="relative min-h-screen flex flex-col">
  <!-- Header -->
  <header class="border-b border-border bg-surface-card/90 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-3xl mx-auto px-6 py-3.5 flex items-center justify-between">
      <a href="{base}/" class="flex items-center gap-2.5 group" data-sveltekit-reload>
        <div class="w-8 h-8 rounded glyph-grad flex items-center justify-center">
          <svg class="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <div>
          <span class="font-display text-base font-bold text-text tracking-tight">{appConfig.appName}</span>
        </div>
      </a>
      <div class="flex items-center gap-3">
        <span class="text-xs text-text-light tracking-wide uppercase font-mono">{t('nav.tagline')}</span>
        <button
          onclick={toggleLang}
          class="flex items-center gap-1 text-xs font-semibold font-mono text-text-muted hover:text-text border border-border rounded px-2 py-1 transition-colors"
          title="Español / English / Deutsch"
          aria-label="Change language"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/>
          </svg>
          {getLang().toUpperCase()}
        </button>
        <button
          onclick={toggleTheme}
          class="w-8 h-8 rounded border border-border bg-surface-card text-text-muted hover:text-text hover:border-text-muted grid place-items-center transition-colors"
          aria-label="Cambiar tema / Toggle theme"
        >
          {#if dark}
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z"/></svg>
          {:else}
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
          {/if}
        </button>
      </div>
    </div>
  </header>

  <!-- Main -->
  <main class="flex-1 max-w-3xl mx-auto w-full px-6 py-8 relative z-10">
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="border-t border-border-light py-5 text-center relative z-10">
    <p class="text-xs text-text-light font-mono">
      {@html appConfig.footerHtml}
    </p>
  </footer>
</div>
