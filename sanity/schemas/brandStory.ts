import { defineField, defineType } from 'sanity'

/** Brand / heritage stories (storytelling + heritage sections, inner pages). */
export default defineType({
  name: 'brandStory',
  title: 'Brand story',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'intro', type: 'text', rows: 3 }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'gallery',
      title: 'Orbit gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'caption', type: 'string' }] }]
    }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] })
  ],
  preview: { select: { title: 'title', subtitle: 'eyebrow', media: 'image' } }
})
