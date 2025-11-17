export const resolveValue = (v: string | undefined, d: string) => typeof v === 'undefined' || v === '' ? d : v
