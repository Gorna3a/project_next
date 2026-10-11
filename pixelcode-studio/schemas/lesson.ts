import { defineArrayMember, defineField, defineType, type ConditionalPropertyCallbackContext } from 'sanity'

const KINDS = ['theory', 'workshop', 'lab', 'review', 'quiz', 'certification-project']

// Hide a field unless the document's `kind` is one of the given kinds.
const only =
  (...kinds: string[]) =>
  ({ document }: ConditionalPropertyCallbackContext) =>
    !kinds.includes(String((document as { kind?: unknown } | undefined)?.kind ?? ''))

// One document type for every content item. `kind` decides which fields apply.
export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson / Activity',
  type: 'document',
  fields: [
    defineField({ name: 'kind', type: 'string', options: { list: KINDS }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'contentId', type: 'string', readOnly: true, description: 'Stable ID from the Markdown file' }),
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'module',
      type: 'reference',
      to: [{ type: 'module' }],
      hidden: only('theory', 'workshop', 'lab', 'review', 'quiz'),
    }),
    defineField({
      name: 'order',
      type: 'number',
      validation: (Rule) => Rule.integer().positive(),
      hidden: only('theory', 'workshop', 'lab', 'review', 'quiz'),
    }),
    defineField({ name: 'status', type: 'string', options: { list: ['draft', 'review', 'published', 'archived'] } }),
    defineField({ name: 'language', type: 'string', title: 'Content Language (locale)', options: { list: ['en', 'fr', 'ar'] } }),
    defineField({ name: 'lastUpdated', type: 'date' }),
    defineField({ name: 'tags', type: 'array', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
    defineField({
      name: 'difficulty',
      type: 'string',
      options: { list: ['beginner', 'intermediate', 'advanced'] },
      hidden: only('lab', 'certification-project'),
    }),
    defineField({ name: 'estimatedMinutes', type: 'number', hidden: only('theory', 'workshop', 'lab') }),
    defineField({ name: 'estimatedHours', type: 'number', hidden: only('certification-project') }),

    // Prose (Markdown): theory = whole lesson; review = whole sheet; workshop = overview;
    // lab = objective + requirements; certification-project = objective + deliverables + rubric.
    defineField({ name: 'body', type: 'text', rows: 20, description: 'Markdown' }),

    // review
    defineField({
      name: 'covers',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'lesson' }] })],
      hidden: only('review'),
    }),

    // workshop
    defineField({ name: 'steps', type: 'array', of: [defineArrayMember({ type: 'workshopStep' })], hidden: only('workshop') }),

    // lab + certification-project
    defineField({ name: 'starter', type: 'codeBlock', hidden: only('lab', 'certification-project') }),
    defineField({ name: 'tests', type: 'array', of: [defineArrayMember({ type: 'testCase' })], hidden: only('lab', 'certification-project') }),

    // lab
    defineField({ name: 'hints', type: 'array', of: [defineArrayMember({ type: 'string' })], hidden: only('lab') }),
    defineField({ name: 'referenceSolution', type: 'codeBlock', hidden: only('lab') }),
    defineField({ name: 'revealSolutionAfterAttempts', type: 'number', hidden: only('lab') }),

    // lab + quiz
    defineField({ name: 'passingScorePercent', type: 'number', hidden: only('lab', 'quiz') }),

    // quiz
    defineField({ name: 'shuffleQuestions', type: 'boolean', hidden: only('quiz') }),
    defineField({ name: 'shuffleOptions', type: 'boolean', hidden: only('quiz') }),
    defineField({ name: 'questions', type: 'array', of: [defineArrayMember({ type: 'quizQuestion' })], hidden: only('quiz') }),

    // certification-project
    defineField({ name: 'scope', type: 'string', options: { list: ['course', 'module'] }, hidden: only('certification-project') }),
    defineField({
      name: 'target',
      type: 'reference',
      to: [{ type: 'course' }, { type: 'module' }],
      hidden: only('certification-project'),
    }),
    defineField({ name: 'passingGradePercent', type: 'number', hidden: only('certification-project') }),
    defineField({ name: 'rubric', type: 'array', of: [defineArrayMember({ type: 'rubricItem' })], hidden: only('certification-project') }),
  ],
  orderings: [
    {
      title: 'Module order',
      name: 'moduleOrder',
      by: [
        { field: 'module._ref', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: { select: { title: 'title', kind: 'kind', order: 'order' }, prepare: ({ title, kind, order }) => ({ title, subtitle: `${kind ?? ''}${order ? ` · #${order}` : ''}` }) },
})
