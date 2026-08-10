import { describe, it, expect } from 'vitest';
import { splitReferences } from '@bibliohelp/shared';

/**
 * The frontend chunks a bibliography client-side (frontend/src/lib/verifyChunked.ts)
 * by splitting with THIS splitter, joining consecutive entries with blank lines
 * and re-sending each chunk — which the worker splits AGAIN. That is only sound
 * if re-splitting a joined slice returns exactly the slice. buildChunks
 * guarantees every joined chunk carries >= 2 entries (single entries travel as
 * the original text), so that is the invariant pinned here, across formats and
 * chunk sizes.
 */

const NUMBERED = `1. Wahlund, S. (1928). Zusammensetzung von Populationen und Korrelationserscheinungen vom Standpunkt der Vererbungslehre aus betrachtet. Hereditas, 11(1), 65-106.
2. Nei, M. (1977). F-statistics and analysis of gene diversity in subdivided populations. Annals of Human Genetics, 41(2), 225-233.
3. Monin, G., & Sellier, P. (1985). Pork of low technological quality with a normal rate of muscle pH fall in the immediate post-mortem period. Meat Science, 13(1), 49-63.
4. Altman, D. G., & Bland, J. M. (1995). Absence of evidence is not evidence of absence. BMJ, 311(7003), 485.
5. Cohen, J. (1988). Statistical power analysis for the behavioral sciences (2nd ed.). Lawrence Erlbaum Associates.
6. Wright, S. (1951). The genetical structure of populations. Annals of Eugenics, 15(1), 323-354.
7. Haeussler, E. F., Paul, R. S., & Wood, R. J. (2015). Matematicas para administracion y economia (13a ed.). Pearson Educacion.`;

const BLANK_SEPARATED = `Garcia Marquez, G. (1967). Cien anos de soledad. Editorial Sudamericana.

Vargas Llosa, M. (1969). Conversacion en La Catedral. Seix Barral.

Borges, J. L. (1944). Ficciones. Editorial Sur.

Cortazar, J. (1963). Rayuela. Editorial Sudamericana.

Rulfo, J. (1955). Pedro Paramo. Fondo de Cultura Economica.`;

const ONE_PER_LINE = `Smith, J. A. (2020). Machine learning for bibliographic verification. Journal of Information Science, 46(3), 301-315.
Johnson, K. B., & Lee, C. (2019). Reference quality in systematic reviews. Research Synthesis Methods, 10(2), 195-206.
Williams, R. (2021). Fabricated citations in the age of language models. Learned Publishing, 34(4), 516-524.
Brown, T., & Davis, M. (2018). Metadata completeness across scholarly databases. Scientometrics, 117(1), 45-62.
Miller, A. C. (2022). Duplicate detection in reference lists. Journal of Documentation, 78(5), 1002-1019.`;

const BIBTEX = `@article{wahlund1928,
  title={Zusammensetzung von {Populationen} und {Korrelationserscheinungen}},
  author={Wahlund, Sten},
  journal={Hereditas},
  year={1928}
}
@book{cohen1988,
  title={Statistical power analysis for the behavioral sciences},
  author={Cohen, Jacob},
  publisher={Lawrence Erlbaum Associates},
  year={1988}
}
@article{nei1977,
  title={F-statistics and analysis of gene diversity in subdivided populations},
  author={Nei, Masatoshi},
  journal={Annals of Human Genetics},
  year={1977}
}
@article{altman1995,
  title={Absence of evidence is not evidence of absence},
  author={Altman, Douglas G. and Bland, J. Martin},
  journal={BMJ},
  year={1995}
}`;

const RIS = `TY  - JOUR
AU  - Wahlund, Sten
TI  - Zusammensetzung von Populationen und Korrelationserscheinungen
JO  - Hereditas
PY  - 1928
ER  -
TY  - JOUR
AU  - Nei, Masatoshi
TI  - F-statistics and analysis of gene diversity in subdivided populations
JO  - Annals of Human Genetics
PY  - 1977
ER  -
TY  - BOOK
AU  - Cohen, Jacob
TI  - Statistical power analysis for the behavioral sciences
PB  - Lawrence Erlbaum Associates
PY  - 1988
ER  -
TY  - JOUR
AU  - Altman, Douglas G.
AU  - Bland, J. Martin
TI  - Absence of evidence is not evidence of absence
JO  - BMJ
PY  - 1995
ER  -`;

const FIXTURES: Record<string, string> = {
  numbered: NUMBERED,
  blankSeparated: BLANK_SEPARATED,
  onePerLine: ONE_PER_LINE,
  bibtex: BIBTEX,
  ris: RIS,
};

describe('splitReferences round-trip (chunked verification invariant)', () => {
  for (const [name, text] of Object.entries(FIXTURES)) {
    it(`${name}: every consecutive slice of >= 2 entries re-splits to itself`, () => {
      const entries = splitReferences(text);
      expect(entries.length).toBeGreaterThanOrEqual(4);
      for (let size = 2; size <= 5; size++) {
        for (let at = 0; at + size <= entries.length; at++) {
          const slice = entries.slice(at, at + size);
          const rejoined = slice.join('\n\n');
          expect(splitReferences(rejoined), `${name} slice [${at}, ${at + size})`).toEqual(slice);
        }
      }
    });
  }

  it('re-splitting is idempotent on the full entry sets', () => {
    for (const text of Object.values(FIXTURES)) {
      const entries = splitReferences(text);
      expect(splitReferences(entries.join('\n\n'))).toEqual(entries);
    }
  });
});
