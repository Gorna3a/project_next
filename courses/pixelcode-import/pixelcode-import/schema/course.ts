import { defineArrayMember, defineField, defineType } from 'sanity'

const list = (values: string[]) => ({ list: values })

export const course = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({ name: 'contentId', type: 'string', readOnly: true, description: 'Stable ID from the Markdown file' }),
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'domain', type: 'string' }),
    defineField({ name: 'difficulty', type: 'string', options: list(['beginner', 'intermediate', 'advanced']) }),
    defineField({ name: 'status', type: 'string', options: list(['draft', 'review', 'published', 'archived']) }),
    defineField({ name: 'language', type: 'string', options: list(['en', 'fr', 'ar']) }),
    defineField({ name: 'estimatedHours', type: 'number' }),
    defineField({ name: 'version', type: 'string' }),
    defineField({ name: 'lastUpdated', type: 'date' }),
    defineField({ name: 'tags', type: 'array', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({
      name: 'prerequisites',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'course' }] })],
    }),
    defineField({ name: 'learningObjectives', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'body', type: 'text', rows: 20, description: 'Markdown' }),
  ],
  preview: { select: { title: 'title', subtitle: 'difficulty' } },
})

export const module = defineType({
  name: 'module',
  title: 'Module',
  type: 'document',
  fields: [
    defineField({ name: 'contentId', type: 'string', readOnly: true }),
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'course', type: 'reference', to: [{ type: 'course' }], validation: (Rule) => Rule.required() }),
    defineField({ name: 'order', type: 'number', validation: (Rule) => Rule.required().integer().positive() }),
    defineField({ name: 'difficulty', type: 'string', options: list(['beginner', 'intermediate', 'advanced']) }),
    defineField({ name: 'status', type: 'string', options: list(['draft', 'review', 'published', 'archived']) }),
    defineField({ name: 'language', type: 'string', options: list(['en', 'fr', 'ar']) }),
    defineField({ name: 'lastUpdated', type: 'date' }),
    defineField({ name: 'tags', type: 'array', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({
      name: 'prerequisites',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'module' }] })],
    }),
    defineField({ name: 'outcomes', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'body', type: 'text', rows: 12, description: 'Markdown' }),
  ],
  orderings: [{ title: 'Course, then order', name: 'courseOrder', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'order' } },
})
