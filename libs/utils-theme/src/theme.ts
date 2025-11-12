export function isCSSVariableExist(variableName: string): boolean {
  const style = window.getComputedStyle(document.documentElement)
  const value = style.getPropertyValue(variableName).trim()
  return value !== ''
}

type Size = 'primary' | '6xs' | '5xs' | '4xs' | '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
export function size(name: Size |string | number): string {
  const variable = `--dsl-size-${name}`
  return isCSSVariableExist(variable) ? `var(${variable})` : name.toString()
}

type Pallete = 'primary' | 'note' | 'warning' | 'accent' | 'alert' | 'info' | 'success' | 'creative'
export function pallete(name: Pallete | string): string {
  const variable = `--dsl-${name}`
  return isCSSVariableExist(variable) ? `var(${variable})` : name
}

type Highlight = 'primary' | 'key' | 'support' | 'creative' | 'caution' | 'info'
export function highlight(name: Highlight | string): string {
  const variable = `--dsl-highlight-${name}`
  return isCSSVariableExist(variable) ? `var(${variable})` : name
}

type Dasharray = 'solid' | 'dashed' | 'dotted'
export function dasharray(name: Dasharray | string): string {
  const variable = `--dsl-dasharray-${name}`
  return isCSSVariableExist(variable) ? `var(${variable})` : name
}

type Font = 'primary' | 'comic' | 'code' | 'math'
export function font(name: Font | string): string {
  const variable = `--dsl-font-${name}`
  return isCSSVariableExist(variable) ? `var(${variable})` : name
}