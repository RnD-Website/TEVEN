import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'journalArticle',
  title: 'Journal article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: ['Tea Stories', 'Origins & Gardens', 'Brewing Guides', 'Tea Culture', 'Sustainability'] },
      validation: (r) => r.required()
    }),
    defineField({ name: 'date', type: 'date' }),
    defineField({ name: 'excerpt', type: 'text', rows: 2 }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] })
  ],
  orderings: [{ title: 'Newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'image' } }
})
