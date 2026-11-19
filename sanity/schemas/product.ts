import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Tea product',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'origin', type: 'string', description: 'Origin or blend, e.g. "Shizuoka, Japan"' }),
    defineField({ name: 'notes', type: 'string', description: 'Flavour notes, e.g. "Grassy · Umami · Marine"' }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'caffeine', type: 'string', options: { list: ['high', 'medium', 'low', 'none'] } }),
    defineField({ name: 'color', title: 'Tile / pouch colour', type: 'string', description: 'Hex, e.g. #4f6b34' }),
    defineField({ name: 'accent', title: 'Label colour', type: 'string' }),
    defineField({ name: 'ink', title: 'Text colour on pouch', type: 'string' }),
    defineField({ name: 'image', title: 'Lifestyle image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', type: 'number' })
  ],
  orderings: [{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'origin', media: 'image' } }
})
