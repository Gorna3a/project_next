---
id: "les-strict-mode"
type: "theory"
title: "Strict Mode"
moduleId: "mod-08-errors-and-strict-mode"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","strict-mode","errors"]
---

# Concept Overview

Strict mode is an opt-in set of rules that turns several silent mistakes into errors. You enable it with the string `"use strict"` at the top of a script or function. Modern modules and classes are strict by default, but plain scripts are not.

## Key Principles & Frameworks

To enable strict mode for a whole script, put the directive on the first line, before any other statement.

```js
"use strict";

function setCount() {
  count = 1;
}
```

Calling `setCount` here throws a `ReferenceError` because `count` was never declared. Without strict mode, the assignment would silently create a global variable.

Strict mode also makes several other mistakes throw instead of failing silently:
- Writing to a read-only or non-writable property
- Deleting a variable or function
- Using duplicate parameter names in a function
- Using an octal literal such as `010`
- Using the `with` statement

```js
"use strict";

function add(a, a) {
  return a + a;
}
```

This function declaration is a syntax error because the parameter name `a` appears twice. Non-strict mode would allow it.

The directive can also be placed at the top of a function to make only that function strict.

```js
function strictPart() {
  "use strict";
  leaked = 1;
}
```

Calling this function throws a `ReferenceError` because the function itself is strict, even if the surrounding script is not.

Strict mode does not prevent every bug. It only removes a category of silent failures. You still need explicit validation and error handling for bad input.

## Common Pitfalls & Anti-Patterns
- **Putting the directive after other code**: `"use strict"` must be the first statement in the script or function. A comment before it is fine, but a variable declaration is not.
- **Assuming a whole file is strict from a function-level directive**: A directive inside one function affects only that function.
- **Relying on sloppy behavior**: Code that accidentally creates globals may work in non-strict scripts but fail when moved into a module or strict function.
- **Believing strict mode catches all errors**: It does not validate data types or business rules. Those still need your own checks.

## Quick Summary
- `"use strict"` enables stricter rules for a script or function.
- It turns accidental globals and several silent failures into errors.
- The directive must come first in its scope.
- Modules and classes are strict automatically.
- Strict mode is a safety net, not a replacement for validation.
