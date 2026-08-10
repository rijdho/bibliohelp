/**
 * Dependency-free i18n for BiblioHelp (EN/ES/DE).
 * Module-level $state requires the `.svelte.ts` extension.
 *
 * Language is auto-detected from localStorage → navigator.language → 'en',
 * and persisted on change. `t()` reads the reactive `current`, so any markup
 * that calls it re-renders when the language changes.
 *
 * tests/i18n.test.mjs (repo root) pins the three key sets to be identical —
 * adding a key to one locale without the other two fails the suite.
 */

export type Lang = 'en' | 'es' | 'de';

export const LANGS: Lang[] = ['es', 'en', 'de'];

const STORAGE_KEY = 'bh-lang';

function detect(): Lang {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'es' || saved === 'de') return saved;
  }
  if (typeof navigator !== 'undefined') {
    const nav = navigator.language?.toLowerCase() ?? '';
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('de')) return 'de';
  }
  return 'en';
}

let current = $state<Lang>(detect());

export function getLang(): Lang {
  return current;
}

export function setLang(l: Lang): void {
  current = l;
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, l);
  if (typeof document !== 'undefined') document.documentElement.lang = l;
}

/** Cycle es → en → de → es. */
export function toggleLang(): void {
  setLang(LANGS[(LANGS.indexOf(current) + 1) % LANGS.length]);
}

/** 'es-CL' / 'en-US' / 'de-DE' for Intl date formatting. */
export function dateLocale(): string {
  return current === 'es' ? 'es-CL' : current === 'de' ? 'de-DE' : 'en-US';
}

type Dict = Record<string, string>;

const strings: Record<Lang, Dict> = {
  es: {
    // Layout / nav
    'nav.tagline': 'Verificador de referencias',
    // Page head + hero
    'page.titleSuffix': 'Verificador de Referencias Bibliográficas',
    'hero.title': 'Verifica tu bibliografía',
    'hero.desc1': 'Pega tus referencias y',
    'hero.desc2': 'verificará si existen en bases de datos académicas como',
    'hero.desc3': ', entre otras. Además, te sugiere cómo formatearlas correctamente en APA, MLA, Chicago o Vancouver.',
    // Add more / actions
    'addMore.prompt': 'Agrega más referencias para verificar:',
    'common.cancel': 'Cancelar',
    'common.copy': 'Copiar',
    'common.copied': 'Copiado',
    'results.title': 'Resultados',
    'actions.addRefs': 'Agregar referencias',
    'actions.download': 'Descargar informe',
    'actions.newVerification': 'Nueva verificación',
    'error.verify': 'Error al verificar las referencias',
    // History
    'history.recent': 'Verificaciones recientes',
    'history.clear': 'Borrar historial',
    'history.delete': 'Eliminar',
    'history.ref': 'ref|refs',
    'history.verified': 'verificada|verificadas',
    // How it works
    'how.title': 'Cómo funciona',
    'how.step1': 'Pega tu bibliografía completa — numerada, con guiones o separada por líneas',
    'how.step2': 'Buscamos cada referencia en bases de datos académicas verificadas',
    'how.step3': 'Recibes un informe detallado y citas formateadas listas para usar',
    // Word add-in section
    'word.title': 'Plugin para Microsoft Word',
    'word.desc1': 'Verifica tus referencias directamente desde Word. Selecciona el texto en tu documento y',
    'word.desc2': 'lo analiza sin salir del editor.',
    'word.download': 'Descargar manifest.xml',
    'word.toggleShow': 'Ver instrucciones de instalación',
    'word.toggleHide': 'Ocultar instrucciones',
    'word.howTitle': 'Cómo instalar el plugin (sideload):',
    'word.step1pre': 'Descarga el archivo',
    'word.step1post': '',
    'word.step2pre': 'Abre Word y ve a',
    'word.step2menu': 'Insertar → Complementos → Mis complementos',
    'word.step3pre': 'Selecciona',
    'word.step3strong': 'Cargar mi complemento',
    'word.step3post': '(esquina inferior izquierda)',
    'word.step4pre': 'Sube el archivo',
    'word.step4post': 'descargado',
    'word.step5post': 'aparecerá en la barra lateral de Word',
    // Bibliography input
    'input.placeholder': 'Pega aquí tu bibliografía completa...\n\nCada referencia puede estar numerada, con guiones, separada por líneas en blanco, o una por línea.',
    'input.loadSample': 'Cargar ejemplo',
    'input.formats': 'APA · MLA · Chicago · Vancouver · Formato libre',
    'input.verifying': 'Verificando...',
    'input.verify': 'Verificar referencias',
    'input.progress': 'Verificando… {done} de {total} referencias',
    // Status badge
    'status.verified': 'Verificado',
    'status.partial': 'Parcial',
    'status.notFound': 'No encontrado',
    'status.likelyFake': 'Probablemente falsa',
    // Citation block
    'cite.title': 'Citas sugeridas',
    'cite.ref': 'referencia|referencias',
    'cite.copyAll': 'Copiar todo',
    'tpcite.title': 'Cita sugerida',
    'tpcite.insert': 'Insertar en Word',
    'tpcite.inserted': 'Insertado',
    // Results table
    'summary.total': 'Total',
    'summary.verified': 'Verificadas',
    'summary.partial': 'Parciales',
    'summary.notFound': 'No encontradas',
    'dup.title': 'Posibles duplicados detectados',
    'dup.refsLabel': 'Referencias',
    'dup.sameSource': 'parecen ser la misma fuente',
    'dup.similarity': 'similitud',
    'fields.title': 'Título',
    'fields.authors': 'Autores',
    'fields.year': 'Año',
    'matches.title': 'Coincidencias',
    'matches.suggestion': 'Sugerencia:',
    'matches.viewSource': 'Ver fuente',
    'msg.identifierNoMatch': 'Se proporcionó un identificador pero no se encontró ningún registro coincidente en las bases de datos.',
    'msg.noMatchFabricated': 'No se encontró ningún registro en las bases de datos académicas. Esta referencia podría ser inventada.',
    'msg.verifiedVia': 'Verificado vía {identifier}.',
    'msg.identifierMismatch': 'El {identifier} corresponde a un trabajo distinto: «{matchedTitle}». Revisa la referencia — puede ser incorrecta o inventada.',
    'msg.highConfidence': 'Coincidencia de alta confianza (similitud: {similarity}%).',
    'msg.yearConflict': 'El título coincide (similitud: {similarity}%), pero la fuente está fechada en {matchYear}, no en {refYear}. Puede ser otra edición o una copia re-registrada — verifica manualmente.',
    'msg.possibleMatch': 'Posible coincidencia (similitud: {similarity}%). El título o autor puede diferir ligeramente.',
    'msg.weakMatch': 'Coincidencia débil (similitud: {similarity}%). Verificar manualmente.',
    'msg.veryLowSimilarity': 'Solo se encontraron resultados con muy baja similitud. Esta referencia puede contener errores significativos.',
    'sug.year': 'El año en tu referencia es {userValue}, pero la fuente encontrada indica {suggestedValue}',
    'sug.doiFound': 'Se encontró un DOI para esta referencia: {suggestedValue}',
    'sug.doiMismatch': 'El DOI en tu referencia ({userValue}) difiere del encontrado ({suggestedValue})',
    'sug.titleDiffers': 'El título encontrado difiere del ingresado',
    'err.bodyTooLarge': 'El texto es demasiado largo (máximo {maxKb} KB)',
    'err.invalidJson': 'JSON inválido',
    'err.noText': 'No se proporcionó texto',
    'err.noReferences': 'No se pudo extraer ninguna referencia del texto',
    'err.tooManyReferences': 'Demasiadas referencias ({count}). Máximo {max} por consulta.',
    'err.timeout': 'La verificación tardó demasiado. Intenta con menos referencias.',
    'err.verifyFailed': 'Error al verificar',
    'err.badRequest': 'Solicitud inválida',
    'err.internal': 'Error interno del servidor',
    // Taskpane
    'tp.officeNotReady': 'Office.js no está listo. Asegúrate de abrir esto desde Word.',
    'tp.noSelection': 'No hay texto seleccionado en el documento.',
    'tp.readError': 'Error al leer la selección',
    'tp.verifyError': 'Error al verificar',
    'tp.instruction': 'Selecciona las referencias en tu documento de Word y haz clic en el botón para verificarlas.',
    'tp.readAndVerify': 'Leer selección y verificar',
    'tp.partialShort': 'Parcial',
    'tp.noShort': 'No',
    // Report (downloadable HTML)
    'report.title': 'Informe de verificación bibliográfica',
    'report.generatedBy': 'Generado por',
    'report.on': 'el',
    'report.detail': 'Detalle por referencia',
    'report.bestMatch': 'Mejor coincidencia',
    'report.duplicates': 'Posibles duplicados',
    'report.footer': 'Verificación automática de referencias bibliográficas',
    'report.statusVerified': 'Verificada',
    'report.statusPartial': 'Parcial',
    'report.statusNotFound': 'No encontrada',
    'report.fileName': 'verificacion',
  },
  en: {
    'nav.tagline': 'Reference verifier',
    'page.titleSuffix': 'Bibliographic Reference Verifier',
    'hero.title': 'Verify your bibliography',
    'hero.desc1': 'Paste your references and',
    'hero.desc2': 'will check whether they exist in academic databases such as',
    'hero.desc3': ', among others. It also suggests how to format them correctly in APA, MLA, Chicago, or Vancouver.',
    'addMore.prompt': 'Add more references to verify:',
    'common.cancel': 'Cancel',
    'common.copy': 'Copy',
    'common.copied': 'Copied',
    'results.title': 'Results',
    'actions.addRefs': 'Add references',
    'actions.download': 'Download report',
    'actions.newVerification': 'New verification',
    'error.verify': 'Error verifying the references',
    'history.recent': 'Recent verifications',
    'history.clear': 'Clear history',
    'history.delete': 'Delete',
    'history.ref': 'ref|refs',
    'history.verified': 'verified|verified',
    'how.title': 'How it works',
    'how.step1': 'Paste your full bibliography — numbered, with dashes, or separated by lines',
    'how.step2': 'We search each reference in verified academic databases',
    'how.step3': 'You get a detailed report and ready-to-use formatted citations',
    'word.title': 'Microsoft Word add-in',
    'word.desc1': 'Verify your references directly from Word. Select the text in your document and',
    'word.desc2': 'analyzes it without leaving the editor.',
    'word.download': 'Download manifest.xml',
    'word.toggleShow': 'View installation instructions',
    'word.toggleHide': 'Hide instructions',
    'word.howTitle': 'How to install the add-in (sideload):',
    'word.step1pre': 'Download the',
    'word.step1post': 'file',
    'word.step2pre': 'Open Word and go to',
    'word.step2menu': 'Insert → Add-ins → My Add-ins',
    'word.step3pre': 'Select',
    'word.step3strong': 'Upload My Add-in',
    'word.step3post': '(bottom-left corner)',
    'word.step4pre': 'Upload the downloaded',
    'word.step4post': 'file',
    'word.step5post': 'will appear in the Word sidebar',
    'input.placeholder': 'Paste your full bibliography here...\n\nEach reference can be numbered, dashed, separated by blank lines, or one per line.',
    'input.loadSample': 'Load example',
    'input.formats': 'APA · MLA · Chicago · Vancouver · Free-form',
    'input.verifying': 'Verifying...',
    'input.verify': 'Verify references',
    'input.progress': 'Verifying… {done} of {total} references',
    'status.verified': 'Verified',
    'status.partial': 'Partial',
    'status.notFound': 'Not found',
    'status.likelyFake': 'Likely fabricated',
    'cite.title': 'Suggested citations',
    'cite.ref': 'reference|references',
    'cite.copyAll': 'Copy all',
    'tpcite.title': 'Suggested citation',
    'tpcite.insert': 'Insert into Word',
    'tpcite.inserted': 'Inserted',
    'summary.total': 'Total',
    'summary.verified': 'Verified',
    'summary.partial': 'Partial',
    'summary.notFound': 'Not found',
    'dup.title': 'Possible duplicates detected',
    'dup.refsLabel': 'References',
    'dup.sameSource': 'appear to be the same source',
    'dup.similarity': 'similarity',
    'fields.title': 'Title',
    'fields.authors': 'Authors',
    'fields.year': 'Year',
    'matches.title': 'Matches',
    'matches.suggestion': 'Suggestion:',
    'matches.viewSource': 'View source',
    'msg.identifierNoMatch': 'Identifier provided but no matching record found in any database.',
    'msg.noMatchFabricated': 'No matching record found in any academic database. This reference may be fabricated.',
    'msg.verifiedVia': 'Verified via {identifier}.',
    'msg.identifierMismatch': 'The {identifier} resolves to a different work: “{matchedTitle}”. Check the reference — it may be incorrect or fabricated.',
    'msg.highConfidence': 'High-confidence match (similarity: {similarity}%).',
    'msg.yearConflict': 'The title matches (similarity: {similarity}%), but the source is dated {matchYear}, not {refYear}. It may be a different edition or a re-registered copy — verify manually.',
    'msg.possibleMatch': 'Possible match (similarity: {similarity}%). The title or author may differ slightly.',
    'msg.weakMatch': 'Weak match (similarity: {similarity}%). Verify manually.',
    'msg.veryLowSimilarity': 'Only very low-similarity results were found. This reference may contain significant errors.',
    'sug.year': 'The year in your reference is {userValue}, but the source indicates {suggestedValue}',
    'sug.doiFound': 'A DOI was found for this reference: {suggestedValue}',
    'sug.doiMismatch': 'The DOI in your reference ({userValue}) differs from the one found ({suggestedValue})',
    'sug.titleDiffers': 'The title found differs from the one entered',
    'err.bodyTooLarge': 'The text is too large (max {maxKb} KB)',
    'err.invalidJson': 'Invalid JSON',
    'err.noText': 'No text provided',
    'err.noReferences': 'No references could be parsed from the input',
    'err.tooManyReferences': 'Too many references ({count}). Maximum {max} per query.',
    'err.timeout': 'Verification took too long. Try with fewer references.',
    'err.verifyFailed': 'Verification failed.',
    'err.badRequest': 'Invalid request',
    'err.internal': 'Internal server error',
    'tp.officeNotReady': 'Office.js is not ready. Make sure you open this from Word.',
    'tp.noSelection': 'No text is selected in the document.',
    'tp.readError': 'Error reading the selection',
    'tp.verifyError': 'Verification error',
    'tp.instruction': 'Select the references in your Word document and click the button to verify them.',
    'tp.readAndVerify': 'Read selection and verify',
    'tp.partialShort': 'Partial',
    'tp.noShort': 'No',
    'report.title': 'Bibliographic verification report',
    'report.generatedBy': 'Generated by',
    'report.on': 'on',
    'report.detail': 'Detail by reference',
    'report.bestMatch': 'Best match',
    'report.duplicates': 'Possible duplicates',
    'report.footer': 'Automated bibliographic reference verification',
    'report.statusVerified': 'Verified',
    'report.statusPartial': 'Partial',
    'report.statusNotFound': 'Not found',
    'report.fileName': 'verification',
  },
  de: {
    'nav.tagline': 'Referenzprüfer',
    'page.titleSuffix': 'Prüfung bibliografischer Referenzen',
    'hero.title': 'Prüfe dein Literaturverzeichnis',
    'hero.desc1': 'Füge deine Referenzen ein, und',
    'hero.desc2': 'prüft, ob sie in akademischen Datenbanken wie',
    'hero.desc3': ' und weiteren zu finden sind. Zusätzlich erhältst du Vorschläge zur korrekten Formatierung nach APA, MLA, Chicago oder Vancouver.',
    'addMore.prompt': 'Weitere Referenzen zur Prüfung hinzufügen:',
    'common.cancel': 'Abbrechen',
    'common.copy': 'Kopieren',
    'common.copied': 'Kopiert',
    'results.title': 'Ergebnisse',
    'actions.addRefs': 'Referenzen hinzufügen',
    'actions.download': 'Bericht herunterladen',
    'actions.newVerification': 'Neue Prüfung',
    'error.verify': 'Fehler beim Prüfen der Referenzen',
    'history.recent': 'Letzte Prüfungen',
    'history.clear': 'Verlauf löschen',
    'history.delete': 'Entfernen',
    'history.ref': 'Ref.|Refs.',
    'history.verified': 'verifiziert|verifiziert',
    'how.title': 'So funktioniert es',
    'how.step1': 'Füge dein komplettes Literaturverzeichnis ein — nummeriert, mit Spiegelstrichen oder zeilenweise',
    'how.step2': 'Wir suchen jede Referenz in verifizierten akademischen Datenbanken',
    'how.step3': 'Du erhältst einen detaillierten Bericht und fertig formatierte Zitate',
    'word.title': 'Microsoft-Word-Add-in',
    'word.desc1': 'Prüfe deine Referenzen direkt aus Word. Markiere den Text in deinem Dokument, und',
    'word.desc2': 'analysiert ihn, ohne den Editor zu verlassen.',
    'word.download': 'manifest.xml herunterladen',
    'word.toggleShow': 'Installationsanleitung anzeigen',
    'word.toggleHide': 'Anleitung ausblenden',
    'word.howTitle': 'Installation des Add-ins (Sideload):',
    'word.step1pre': 'Lade die Datei',
    'word.step1post': 'herunter',
    'word.step2pre': 'Öffne Word und gehe zu',
    'word.step2menu': 'Einfügen → Add-Ins → Meine Add-Ins',
    'word.step3pre': 'Wähle',
    'word.step3strong': 'Mein Add-In hochladen',
    'word.step3post': '(unten links)',
    'word.step4pre': 'Lade die heruntergeladene Datei',
    'word.step4post': 'hoch',
    'word.step5post': 'erscheint in der Word-Seitenleiste',
    'input.placeholder': 'Füge hier dein komplettes Literaturverzeichnis ein...\n\nJede Referenz kann nummeriert, mit Spiegelstrichen, durch Leerzeilen getrennt oder zeilenweise stehen.',
    'input.loadSample': 'Beispiel laden',
    'input.formats': 'APA · MLA · Chicago · Vancouver · Freies Format',
    'input.verifying': 'Wird geprüft...',
    'input.verify': 'Referenzen prüfen',
    'input.progress': 'Wird geprüft … {done} von {total} Referenzen',
    'status.verified': 'Verifiziert',
    'status.partial': 'Teilweise',
    'status.notFound': 'Nicht gefunden',
    'status.likelyFake': 'Vermutlich erfunden',
    'cite.title': 'Zitiervorschläge',
    'cite.ref': 'Referenz|Referenzen',
    'cite.copyAll': 'Alles kopieren',
    'tpcite.title': 'Zitiervorschlag',
    'tpcite.insert': 'In Word einfügen',
    'tpcite.inserted': 'Eingefügt',
    'summary.total': 'Gesamt',
    'summary.verified': 'Verifiziert',
    'summary.partial': 'Teilweise',
    'summary.notFound': 'Nicht gefunden',
    'dup.title': 'Mögliche Duplikate erkannt',
    'dup.refsLabel': 'Referenzen',
    'dup.sameSource': 'scheinen dieselbe Quelle zu sein',
    'dup.similarity': 'Ähnlichkeit',
    'fields.title': 'Titel',
    'fields.authors': 'Autoren',
    'fields.year': 'Jahr',
    'matches.title': 'Treffer',
    'matches.suggestion': 'Vorschlag:',
    'matches.viewSource': 'Quelle ansehen',
    'msg.identifierNoMatch': 'Ein Identifikator wurde angegeben, aber in keiner Datenbank wurde ein passender Eintrag gefunden.',
    'msg.noMatchFabricated': 'In keiner akademischen Datenbank wurde ein passender Eintrag gefunden. Diese Referenz könnte erfunden sein.',
    'msg.verifiedVia': 'Verifiziert über {identifier}.',
    'msg.identifierMismatch': 'Der {identifier} verweist auf ein anderes Werk: „{matchedTitle}“. Prüfe die Referenz — sie könnte fehlerhaft oder erfunden sein.',
    'msg.highConfidence': 'Treffer mit hoher Konfidenz (Ähnlichkeit: {similarity} %).',
    'msg.yearConflict': 'Der Titel stimmt überein (Ähnlichkeit: {similarity} %), aber die Quelle ist auf {matchYear} datiert, nicht auf {refYear}. Möglicherweise eine andere Ausgabe oder eine neu registrierte Kopie — bitte manuell prüfen.',
    'msg.possibleMatch': 'Möglicher Treffer (Ähnlichkeit: {similarity} %). Titel oder Autor können leicht abweichen.',
    'msg.weakMatch': 'Schwacher Treffer (Ähnlichkeit: {similarity} %). Bitte manuell prüfen.',
    'msg.veryLowSimilarity': 'Es wurden nur Ergebnisse mit sehr geringer Ähnlichkeit gefunden. Diese Referenz kann erhebliche Fehler enthalten.',
    'sug.year': 'Das Jahr in deiner Referenz ist {userValue}, die gefundene Quelle nennt jedoch {suggestedValue}',
    'sug.doiFound': 'Für diese Referenz wurde ein DOI gefunden: {suggestedValue}',
    'sug.doiMismatch': 'Der DOI in deiner Referenz ({userValue}) weicht vom gefundenen ab ({suggestedValue})',
    'sug.titleDiffers': 'Der gefundene Titel weicht vom eingegebenen ab',
    'err.bodyTooLarge': 'Der Text ist zu lang (maximal {maxKb} KB)',
    'err.invalidJson': 'Ungültiges JSON',
    'err.noText': 'Kein Text übermittelt',
    'err.noReferences': 'Aus dem Text konnten keine Referenzen extrahiert werden',
    'err.tooManyReferences': 'Zu viele Referenzen ({count}). Maximal {max} pro Anfrage.',
    'err.timeout': 'Die Prüfung hat zu lange gedauert. Versuche es mit weniger Referenzen.',
    'err.verifyFailed': 'Prüfung fehlgeschlagen.',
    'err.badRequest': 'Ungültige Anfrage',
    'err.internal': 'Interner Serverfehler',
    'tp.officeNotReady': 'Office.js ist nicht bereit. Stelle sicher, dass du dies aus Word öffnest.',
    'tp.noSelection': 'Im Dokument ist kein Text markiert.',
    'tp.readError': 'Fehler beim Lesen der Auswahl',
    'tp.verifyError': 'Fehler bei der Prüfung',
    'tp.instruction': 'Markiere die Referenzen in deinem Word-Dokument und klicke auf die Schaltfläche, um sie zu prüfen.',
    'tp.readAndVerify': 'Auswahl lesen und prüfen',
    'tp.partialShort': 'Teilw.',
    'tp.noShort': 'Nein',
    'report.title': 'Bericht zur bibliografischen Prüfung',
    'report.generatedBy': 'Erstellt von',
    'report.on': 'am',
    'report.detail': 'Detail je Referenz',
    'report.bestMatch': 'Bester Treffer',
    'report.duplicates': 'Mögliche Duplikate',
    'report.footer': 'Automatische Prüfung bibliografischer Referenzen',
    'report.statusVerified': 'Verifiziert',
    'report.statusPartial': 'Teilweise',
    'report.statusNotFound': 'Nicht gefunden',
    'report.fileName': 'pruefbericht',
  },
};

export function t(key: string, params?: Record<string, string | number>): string {
  let s = strings[current][key] ?? strings.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}

/**
 * Translate a worker-provided coded message. Falls back to the server's English
 * `message` string when the code is missing or unknown to the client.
 */
export function tCoded(
  code: string | undefined,
  params: Record<string, string | number> | undefined,
  fallback: string,
): string {
  if (!code) return fallback;
  if (strings[current][code] === undefined && strings.en[code] === undefined) return fallback;
  return t(code, params);
}

/**
 * Localize a worker error JSON body ({ error, code?, params? }). Prefers the
 * localized `code`, falls back to the server's English `error` string, then to
 * a generic "Error {status}".
 */
export function tError(data: unknown, status: number): string {
  if (data && typeof data === 'object') {
    const d = data as { error?: unknown; code?: unknown; params?: Record<string, string | number> };
    if (typeof d.code === 'string' && (strings[current][d.code] !== undefined || strings.en[d.code] !== undefined)) {
      return t(d.code, d.params);
    }
    if (typeof d.error === 'string') return d.error;
  }
  return `Error ${status}`;
}

/** Pick singular/plural from a "singular|plural" dict entry by count. */
export function plural(n: number, key: string): string {
  const raw = strings[current][key] ?? strings.en[key] ?? '';
  const [one, many] = raw.split('|');
  return n === 1 ? one : (many ?? one);
}
