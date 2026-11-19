import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'teaOrigin',
  title: 'Tea origin',
  type: 'document',
  fields: [
    defineField({ name: 'country', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'country' }, validation: (r) => r.required() }),
    defineField({ name: 'tea', title: 'Signature tea', type: 'string' }),
    defineField({ name: 'color', title: 'Pouch colour', type: 'string' }),
    defineField({ name: 'story', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', type: 'number' })
  ],
  preview: { select: { title: 'country', subtitle: 'tea', media: 'image' } }
})
