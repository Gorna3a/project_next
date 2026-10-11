import { codeBlock, quizOption, quizQuestion, rubricItem, testCase, workshopStep } from './objects'
import { course, module } from './course'
import { lesson } from './lesson'

// v2 content model: course -> module -> lesson (kind: theory | workshop | lab | review | quiz | certification-project)
// Markdown import pipeline lives in courses/pixelcode-import (validate -> ndjson -> sanity dataset import).
// `challenge` was removed — labs/workshops/certification-projects cover it via the test DSL.
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
