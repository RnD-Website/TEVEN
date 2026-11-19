import { defineField, defineType } from 'sanity'

/** Hero carousel slides (Section 04 featured stories). */
export default defineType({
  name: 'featuredStory',
  title: 'Featured story (hero slide)',
  type: 'document',
  fields: [
    defineField({ name: 'thumbTitle', title: 'Indicator title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'thumbTitle' } }),
    defineField({ name: 'title', title: 'Headline lines', type: 'array', of: [{ type: 'string' }], description: 'One entry per line, e.g. "TEVEN, the" / "art of tea."' }),
    defineField({ name: 'text', type: 'text', rows: 2 }),
    defineField({ name: 'cta', type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'to', title: 'Link', type: 'string' }] }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'order', type: 'number' })
  ],
  preview: { select: { title: 'thumbTitle', media: 'image' } }
})
