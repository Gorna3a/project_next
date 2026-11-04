---
id: "py-lab-eligibility-checker"
type: "lab"
title: "Eligibility Checker"
moduleId: "py-mod-03-operators-and-conditionals"
order: 7
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "conditionals", "operators", "logic"]
---

# Objective

Decide whether an applicant is eligible for a program, then print a short report. The applicant must be old enough, have enough experience, and hold the required certification.

The expected output is:

```text
Age: 20
Experience: 3 years
Certification: False
Eligible: False
Reason: Certification required.
```

## Requirements
- Build `eligible` from three conditions joined with `and`: age, experience, and certification.
- Use an `if`/`elif`/`else` chain to set `reason`.
- Check the reasons in this order: age, experience, certification.
- Use `not` for the certification check.
- Print exactly the five report lines shown above.
- Do not change the provided constants.

## Starter State / Workspace
```python
age = 20
years_experience = 3
has_certification = False

minimum_age = 18
required_experience = 2

# Decide eligibility and print the report.
```

## Evaluation Tests
```json
[
  { "type": "output-equals", "value": "Age: 20\nExperience: 3 years\nCertification: False\nEligible: False\nReason: Certification required.", "message": "The report should match the five expected lines", "weight": 3, "required": true },
  { "type": "output-contains", "value": "Eligible: False", "message": "The applicant should not be eligible", "required": true },
  { "type": "output-contains", "value": "Reason: Certification required.", "message": "The reason should identify the missing certification", "required": true },
  { "type": "code-contains", "value": " and ", "message": "Combine the three eligibility conditions with and", "required": true },
  { "type": "code-contains", "value": "elif ", "message": "Use elif for the ordered reason checks", "required": true },
  { "type": "code-contains", "value": "not ", "message": "Use not for the certification check", "required": true },
  { "type": "code-contains", "value": ">=", "message": "Use comparison operators for the minimums", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** Eligibility is true only when all three conditions are true. Combine them with `and`.

> [!TIP]
> **Hint 2:** Check one failure at a time. If age fails, that is the reason; otherwise check experience; otherwise check certification.

> [!TIP]
> **Hint 3:** The certification condition fails when the applicant does not have it, so the check is `not has_certification`.

## Reference Solution
```python
age = 20
years_experience = 3
has_certification = False

minimum_age = 18
required_experience = 2

eligible = (
    age >= minimum_age
    and years_experience >= required_experience
    and has_certification
)

if age < minimum_age:
    reason = "Too young."
elif years_experience < required_experience:
    reason = "Not enough experience."
elif not has_certification:
    reason = "Certification required."
else:
    reason = "Meets all requirements."

print(f"Age: {age}")
print(f"Experience: {years_experience} years")
print(f"Certification: {has_certification}")
print(f"Eligible: {eligible}")
print(f"Reason: {reason}")
```
