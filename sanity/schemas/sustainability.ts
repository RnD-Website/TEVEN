import { defineField, defineType } from 'sanity'

/** Singleton — sustainability block on the homepage. */
export default defineType({
  name: 'sustainability',
  title: 'Sustainability',
  type: 'document',
  fields: [
    defineField({ name: 'label', type: 'string' }),
    defineField({ name: 'titleLines', title: 'Headline lines', type: 'array', of: [{ type: 'string' }], description: 'Wrap small inline words in *asterisks*' }),
    defineField({ name: 'text', type: 'text', rows: 3 }),
    defineField({ name: 'pillars', type: 'array', of: [{ type: 'string' }] })
  ]
})
