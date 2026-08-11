import { describe, expect, it } from 'vitest';
import type { ParsedReference, VerificationMatch } from '@bibliohelp/shared';
import { generateSuggestions } from './suggestions.js';

function ref(overrides: Partial<ParsedReference> = {}): ParsedReference {
  return {
    raw: 'Smith, R. K. (2021). The Complete Guide to Modern Web Development. O\'Reilly Media.',
    title: 'The Complete Guide to Modern Web Development',
    authors: ['Smith, R. K.'],
    year: 2021,
    doi: null,
    isbn: null,
    format: 'apa',
    ...overrides,
  } as ParsedReference;
}

function match(overrides: Partial<VerificationMatch> = {}): VerificationMatch {
  return {
    title: 'Modern gardening: a complete guide to gardening',
    authors: [],
    year: 1958,
    doi: null,
    url: 'https://archive.org/details/bwb_KU-355-817',
    similarity: 0.65,
    source: 'internetarchive',
    ...overrides,
  } as VerificationMatch;
}

describe('generateSuggestions', () => {
  it('does NOT adopt the year of a weak match (a 0.65 gardening book once suggested 1958)', () => {
    const suggestions = generateSuggestions(ref(), match({ similarity: 0.65, year: 1958 }));
    expect(suggestions.filter(s => s.field === 'year')).toEqual([]);
  });

  it('does NOT adopt the DOI of a weak match', () => {
    const suggestions = generateSuggestions(
      ref({ doi: null }),
      match({ similarity: 0.65, doi: '10.1234/unrelated' }),
    );
    expect(suggestions.filter(s => s.field === 'doi')).toEqual([]);
  });

  it('still suggests the year when the match is strong (likely the same work)', () => {
    const suggestions = generateSuggestions(
      ref({ year: 2020 }),
      match({ title: 'The Complete Guide to Modern Web Development', similarity: 0.95, year: 2021 }),
    );
    const year = suggestions.find(s => s.field === 'year');
    expect(year?.suggestedValue).toBe('2021');
  });

  it('still surfaces a found DOI when the match is strong', () => {
    const suggestions = generateSuggestions(
      ref({ doi: null }),
      match({ title: 'The Complete Guide to Modern Web Development', similarity: 0.9, doi: '10.1234/real' }),
    );
    const doi = suggestions.find(s => s.field === 'doi');
    expect(doi?.suggestedValue).toBe('10.1234/real');
  });

  it('keeps the title-differs suggestion in its 0.75–0.98 band', () => {
    const suggestions = generateSuggestions(
      ref(),
      match({ title: 'The Complete Guide to Modern Web Development and Deployment Practices', similarity: 0.8, year: 2021 }),
    );
    expect(suggestions.some(s => s.field === 'title')).toBe(true);
  });

  it('suppresses everything on a suspect record (yearConflict / identifierMismatch)', () => {
    for (const code of ['msg.yearConflict', 'msg.identifierMismatch']) {
      const suggestions = generateSuggestions(
        ref({ doi: null }),
        match({ similarity: 0.95, year: 1999, doi: '10.1234/suspect' }),
        code,
      );
      expect(suggestions).toEqual([]);
    }
  });

  it('returns nothing without a match', () => {
    expect(generateSuggestions(ref(), undefined)).toEqual([]);
  });
});
