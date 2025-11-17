import type { Template } from '..'

export const plane: Template = {
  id: 'plane',
  content: `
  ---
  ---
  <plane range="[-15, 10]" domain="[-10, 10]">
    <dot x="4" y="3" label="x^2 + y^2 = 25" color="info"/>
  </plane>
  `.trim(),
  type: 'svg',
}