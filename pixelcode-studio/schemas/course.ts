import { defineArrayMember, defineField, defineType } from 'sanity'

const list = (values: string[]) => ({ list: values })

// Programming language taught by the course (code language).
// NOTE: `language` below is the UI locale (en/fr/ar per _spec.md) — do NOT
// confuse the two. `toSanity.mjs` does not set this field, so it stays
// optional to keep Markdown imports working; fill it in Studio after import.
const PROGRAMMING_LANGUAGES = [
  { title: '🐍 Python', value: 'python' },
  { title: '⚡ JavaScript', value: 'javascript' },
  { title: '📘 TypeScript', value: 'typescript' },
  { title: '☕ Java', value: 'java' },
  { title: '⚙️ C', value: 'c' },
  { title: '🔧 C++', value: 'cpp' },
  { title: '🐹 Go', value: 'go' },
  { title: '🦀 Rust', value: 'rust' },
  { title: '🎯 Kotlin', value: 'kotlin' },
  { title: '🍎 Swift', value: 'swift' },
  { title: '🎮 C#', value: 'csharp' },
  { title: '💎 Ruby', value: 'ruby' },
  { title: '🐘 PHP', value: 'php' },
]

export const course = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({ name: 'contentId', type: 'string', readOnly: true, description: 'Stable ID from the Markdown file' }),
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'domain', type: 'string' }),
    defineField({
      name: 'programmingLanguage',
      type: 'string',
      title: 'Programming Language',
      description: 'Code language taught (e.g. javascript). UI locale is the separate `language` field.',
      options: { list: PROGRAMMING_LANGUAGES, layout: 'radio' },
    }),
    defineField({ name: 'difficulty', type: 'string', options: list(['beginner', 'intermediate', 'advanced']) }),
    defineField({ name: 'status', type: 'string', options: list(['draft', 'review', 'published', 'archived']) }),
    defineField({ name: 'language', type: 'string', title: 'Content Language (locale)', description: 'UI locale: en | fr | ar', options: list(['en', 'fr', 'ar']) }),
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
    defineField({
      name: 'programmingLanguage',
      type: 'string',
      title: 'Programming Language (override)',
      description: 'Optional — blank means inherit from the parent course.',
      options: { list: PROGRAMMING_LANGUAGES, layout: 'dropdown' },
    }),
    defineField({ name: 'difficulty', type: 'string', options: list(['beginner', 'intermediate', 'advanced']) }),
    defineField({ name: 'status', type: 'string', options: list(['draft', 'review', 'published', 'archived']) }),
    defineField({ name: 'language', type: 'string', title: 'Content Language (locale)', options: list(['en', 'fr', 'ar']) }),
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
