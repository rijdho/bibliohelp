<script lang="ts">
  import type { VerificationStatus } from '@bibliohelp/shared';
  import { t } from '$lib/i18n.svelte';

  interface Props {
    status: VerificationStatus;
    score: number;
  }

  let { status, score }: Props = $props();

  // Filled mono uppercase pill — the landing's .vc-badge, verbatim.
  const config = $derived({
    verified: { label: t('status.verified'), bg: 'bg-verified' },
    partial: { label: t('status.partial'), bg: 'bg-partial' },
    not_found: { label: t('status.notFound'), bg: 'bg-fake' },
    likely_fake: { label: t('status.likelyFake'), bg: 'bg-fake' },
  }[status]);
</script>

<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-white {config.bg}">
  {#if status === 'verified'}
    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
  {:else if status === 'partial'}
    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01"/></svg>
  {:else}
    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
  {/if}
  {config.label}
  <span class="opacity-75 text-[9px]">{score}%</span>
</span>
