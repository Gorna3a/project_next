import { defineArrayMember, defineField, defineType } from 'sanity'

export const codeBlock = defineType({
  name: 'codeBlock',
  title: 'Code block',
  type: 'object',
  fields: [
    defineField({ name: 'language', type: 'string', initialValue: 'js' }),
    defineField({ name: 'code', type: 'text', rows: 10 }),
  ],
  preview: { select: { title: 'language', subtitle: 'code' } },
})

// One automated check. See _spec.md (Test DSL). Only the fields relevant to `type` are filled.
export const testCase = defineType({
  name: 'testCase',
  title: 'Test',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          'output-equals',
          'output-contains',
          'output-matches',
          'function-returns',
          'function-throws',
          'code-contains',
          'code-not-contains',
          'file-exists',
          'file-contains',
          'dom-selector',
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'message', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'weight', type: 'number', initialValue: 1, validation: (Rule) => Rule.integer().positive() }),
    defineField({ name: 'required', type: 'boolean', initialValue: false }),
    defineField({ name: 'value', type: 'string' }),
    defineField({ name: 'pattern', type: 'string' }),
    defineField({ name: 'flags', type: 'string' }),
    defineField({ name: 'input', type: 'string' }),
    defineField({ name: 'call', type: 'string' }),
    defineField({
      name: 'expected',
      type: 'string',
      description: 'JSON-encoded expected value, e.g. 5, "text", or {"a":1}',
    }),
    defineField({ name: 'errorType', type: 'string' }),
    defineField({ name: 'path', type: 'string' }),
    defineField({ name: 'selector', type: 'string' }),
    defineField({ name: 'count', type: 'number' }),
    defineField({ name: 'text', type: 'string' }),
  ],
  preview: { select: { title: 'type', subtitle: 'message' } },
})

export const workshopStep = defineType({
  name: 'workshopStep',
  title: 'Workshop step',
  type: 'object',
  fields: [
    defineField({ name: 'number', type: 'number' }),
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'instructions', type: 'text', description: 'Markdown' }),
    defineField({ name: 'hints', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'starter', type: 'codeBlock' }),
    defineField({ name: 'solution', type: 'codeBlock' }),
    defineField({ name: 'tests', type: 'array', of: [defineArrayMember({ type: 'testCase' })] }),
  ],
  preview: { select: { title: 'title', subtitle: 'number' } },
})

export const quizOption = defineType({
  name: 'quizOption',
  title: 'Option',
  type: 'object',
  fields: [
    defineField({ name: 'text', type: 'string' }),
    defineField({ name: 'correct', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'text', subtitle: 'correct' } },
})

export const quizQuestion = defineType({
  name: 'quizQuestion',
  title: 'Question',
  type: 'object',
  fields: [
    defineField({
      name: 'questionType',
      type: 'string',
      options: { list: ['single', 'multiple', 'true-false', 'code-output'] },
    }),
    defineField({ name: 'points', type: 'number', initialValue: 1 }),
    defineField({ name: 'prompt', type: 'text', description: 'Markdown (may contain a code block)' }),
    defineField({ name: 'options', type: 'array', of: [defineArrayMember({ type: 'quizOption' })] }),
    defineField({ name: 'hint', type: 'string' }),
    defineField({ name: 'explanation', type: 'text' }),
  ],
  preview: { select: { title: 'prompt', subtitle: 'questionType' } },
})

export const rubricItem = defineType({
  name: 'rubricItem',
  title: 'Rubric item',
  type: 'object',
  fields: [
    defineField({ name: 'number', type: 'number' }),
    defineField({ name: 'requirement', type: 'text', rows: 2 }),
    defineField({ name: 'weight', type: 'number' }),
    defineField({ name: 'required', type: 'boolean' }),
  ],
  preview: { select: { title: 'requirement', subtitle: 'weight' } },
})
