/**
 * Language configuration for algorithm code blocks.
 * Separated from algorithmCodes.ts per SRP — language config
 * is independent of algorithm code string data.
 */

export type CodeLanguage = 'python' | 'javascript' | 'cpp' | 'java'
export type AlgorithmCodes = Record<CodeLanguage, string>

export const LANGUAGES: { key: CodeLanguage; label: string }[] = [
  { key: 'python', label: 'Python' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'cpp', label: 'C++' },
  { key: 'java', label: 'Java' },
]

export const STORAGE_KEY = 'algolens-code-lang'

export function getStoredLanguage(): CodeLanguage {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v && ['python','javascript','cpp','java'].includes(v)) return v as CodeLanguage
  } catch { /* localStorage unavailable */ }
  return 'python'
}

export function setStoredLanguage(lang: CodeLanguage) {
  try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* localStorage unavailable */ }
}
