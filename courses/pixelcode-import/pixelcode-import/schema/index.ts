import { codeBlock, quizOption, quizQuestion, rubricItem, testCase, workshopStep } from './objects'
import { course, module } from './course'
import { lesson } from './lesson'

// Add to your Studio config:  schema: { types: schemaTypes }
export const schemaTypes = [
  course,
  module,
  lesson,
  codeBlock,
  testCase,
  workshopStep,
  quizOption,
  quizQuestion,
  rubricItem,
]
