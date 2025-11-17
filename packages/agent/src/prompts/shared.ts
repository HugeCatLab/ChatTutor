export const colors = ['primary', 'accent', 'note', 'warning', 'alert', 'info', 'success', 'creative']
export const highlights = ['primary', 'key', 'support', 'creative', 'caution', 'info']
export const fonts = ['primary', 'comic', 'code', 'math']
export const sizes = ['6xs', '5xs', '4xs', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']

export function reactivity() {
  return `
  You should use reactivity to control the behavior of the element.

  **Ref**
  A ref is a reactive variable that can be used to store a value.
  - If you use a ref on an element, the element will be updated when the value of the ref is changed.
  `.trim()
}

export function attributes() {
  return `
  ELEMENT has several attributes to control its behavior with different ATTRIBUTE_PREFIX.
  - \`attr="value"\`: A static string attribute, value will be parsed as a raw string.
    + e.g. \`attr="Hello, World!"\` will be parsed as "Hello, World!".
  - \`:attr="expression"\`: A expression attribute, which should be a valid JavaScript expression.
    + e.g. \`:attr="1 + 1"\` will be parsed as 2.
  - \`@attr="event"\`: A event attribute, which should be a valid JavaScript event handler.
    + e.g. \`@click="console.log('click')"\` will be parsed as console.log('click').
    + Events should be a standard DOM event name.
  - \`#attr="statement"\`: A statement attribute.
    + e.g. \`#if="x > 3"\`
  `.trim()
}

export function valueInsertion() {
  return `
  You can use \`{{ expression }}\` to insert the value of an expression into a TEXT-NODE.
  \`\`\`
  <element>
    Hello, \`{{ name }}\`!
  </element>
  \`\`\`
  `.trim()
}

export function statements() {
  return {
    if: `
    - \`#if="expression"\`: Conditional statements.
    \`\`\`
    <element #if="x > 3">
      <child1/>
    </element>
    \`\`\`
    `,
    else: `
    - \`#else\`: Else statements.
    \`\`\`
    <element #else>
      <child2/>
    </element>
    \`\`\`
    `,
    elif: `
    - \`#elif="expression"\`: Elif statements.
    \`\`\`
    <element #elif="x > 3">
      <child3/>
    </element>
    \`\`\`
    `,
    for: `
    - \`#for="expression"\`: Loop statements.
    \`\`\`
    <element #for="item in 10">
      {{ item }}
    </element>
    \`\`\`
    `,
    slot: `
    - \`#slot="name"\`: Slot statements.
    \`\`\`
    <element>
      <block #slot="default">
        <child/>
      </block>
    </element>
    \`\`\`
    `,
  }
}

export function animation() {
  return `
  **Syntax**
  \`{easing}name<duration, delay>(...params)\`
  - easing: optional, default to \`(progress) => progress\`.
  - name: required, the name of the animation.
  - duration: required, in seconds.
  - delay: optional, in seconds.
  - params: optional, list of parameters.

  **Variable Animation**
  Use a reactive variable as the name of the animation
  - \`x<1>(100)\`: \`x\` will be animated from itself to 100 in 1 second.
  - \`x<1, 0.5>(10, 100)\`: \`x\` will be animated from 10 to 100 in 1 second with a delay of 0.5 seconds.
  - \`{(x) => x * x}<1>(100)\`: \`x\` will be animated from itself to 100 in 1 second with easing function \`(x) => x * x\`.

  **Animation Group**
  - An animation should be defined in a component as a group so that you can call them.
  - An animation group could have one or more animations.
  - Animations in a group will be called in order.

  **Call Animation**
  use \`animate('animation_group_name')\` to call an animation group.
  - support multiple animations: \`animate('animation_group_name1', 'animation_group_name2')\`
  - support parallel animations: \`animate('animation_group_name1', ['animation_group_name2', 'animation_group_name3'])\`
    + animation_group_name2 and animation_group_name3 will be called in parallel.
  `.trim()
}

export const output = () => {
  return `
  You should output the result in the following format:
  \`\`\`document
  ---
  refs:
    <name>: '<expression>'
  ---
  <element/>
  \`\`\`

  - Document information is write in a yaml header
  - element should be a valid DSL element
  `.trim()
}

export const dslSyntax = () => {
  return `
  
  `.trim().replaceAll('$', '`')
}