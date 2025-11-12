import type { PrefabKnowledge } from "../prefab";

export const prefabritize = (prefab: PrefabKnowledge) => {
  const header = `
  ## \`${prefab.name}\`
  > ${prefab.description}
  `.trim()
  const props = prefab.props && prefab.props.length > 0
    ? `### Props\n` + prefab.props.map(prop => `- \`${prop.name}\`: ${prop.description} [${prop.type}] ${prop.required ? '(required)' : `(optional default: ${prop.default})`}`).join('\n')
    : void 0
  const examples = prefab.examples && prefab.examples.length > 0
    ? `### Examples\n` + prefab.examples.map((example, index) => `\`\`\`example\n${index + 1}\n${example}\n\`\`\``).join('\n')
    : void 0
  const rules = prefab.rules && prefab.rules.length > 0
    ? `### Rules\n` + prefab.rules.map(rule => `- ${rule}`).join('\n')
    : void 0
  const slots = prefab.slots && prefab.slots.length > 0
    ? `### Slots\n` + prefab.slots.map(slot => `- \`${slot[0]}\`: ${slot[1]}`).join('\n')
    : void 0
  return [
    header,
    props,
    examples,
    rules,
    slots,
  ].filter(Boolean).join('\n\n')
}