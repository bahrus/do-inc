# Add Support For Programmatic Attachment

## Bruce's Ask

Can you please follow the example of [be-persistent](https://github.com/bahrus/be-persistent) and [be-bound](../../be-bound) and [be-calculating](../../be-calculating/) and [the addendum](../types/ImportantEnhancementAddendum.md) to add demos and adjust do-inc.js as needed and add def.js to support programmatic attachment of this enhancement?

Please add your implementation notes below.

## Implementation Notes

I followed the addendum's checklist, including step 6 (README wording), with
the previous enhancements as models. do-inc has the same shape as be-bound
and be-observing. `hydrate` read the attribute's `StatementsResult`
(`parsedStatements`) directly and even mutated it, so I split the two.

### Programmatic-friendly property: `increments`

- There is a new property, `increments: Array<IncParameters>`, and it is now
  the only thing `hydrate` reads.
- A compact, `when_parsedStatements_changes_call_onParsedStatementsChange`,
  copies each parsed statement's `value` into it. It still throws 400 when
  `success` is false.
- An empty array means a single, fully inferred rule, the same as a bare
  attribute. The rule `{}` now falls through the existing defaults:
  - `localEventType` is inferred in `hydrate`;
  - `prop` comes from the `name` attribute in `handleEvent`;
  - the amount defaults to 1.

  So the old special case that pushed a synthesized statement into
  `parsedStatements` is gone.
- `hydrate` uses
  `ifKeyIn: ['increments', 'initialized'], ifAllOf: ['increments', 'enhancedElement', 'initialized']`.

### No mutation of caller objects, no stacked listeners

- `handleEvent` used to cache the computed amount by writing `byAmtN` back
  into the rule object. It now computes the amount locally, so objects passed
  in by callers are left untouched.
- `hydrate` never removed its listeners, so reassigning `increments` would
  have stacked a second click handler. It now owns an `AbortController` and
  aborts the previous pass's listeners first, like do-assign.

### Addendum steps

1. **`init()` awaits `roundabout(...)` and then sets `self.initialized = true`.**
   The `await` was missing.
2. **`ctx.emc || ctx.config`.**
3. **`def.js`** exports `defDoInc(ref)`. `package.json` has no `exports` map
   and no `files` field, so `do-inc/def.js` already resolves and is already
   published. I deliberately didn't add an `exports` map, since that would
   block unlisted deep imports.
4. **Reserved names.** There are no collisions.
5. **Tests.** See below.
6. **README.** Added a "Programmatic attachment (no attribute)" section
   before "Viewing Demos Locally". It has the editorial intro, registration, a
   statement-part → property table, and both patterns. I also noted that
   `targetElementId` (incrementing a *peer*) exists in the code but no
   attribute pattern captures it, so programmatic attachment is currently the
   only way to use it.

### Demos and tests

- `demo/Programmatic/DeclarativeInSequence.html`:
  `[{prop: 'age', byAmtN: 12}]` via `enh.set`.
- `demo/Programmatic/DeclarativeOutOfSequence.html`: `[]` on
  `<button name=age>`, set before `defDoInc`. This covers full inference.
- `demo/Programmatic/Imperative.html`: `enh.get()` with
  `targetElementId: 'counter'`, a peer `<mood-stone>`.
- `demo/Programmatic/ImperativeReassign.html`: `byAmtN: 10`, then
  reassigned to `byAmtN: 1`. The test clicks twice and expects `2`; with
  stacked listeners it would be `22`.
- `tests/Programmatic/*` mirror these.

All 10 Playwright tests pass. That's the 6 existing ones, which cover every
attribute demo, plus the 4 new ones. Checks that the new tests catch real
problems:

- With the original `do-inc.js` / `emc.json`, all 4 fail.
- With only the `abort()` call disabled, `ImperativeReassign` fails.

### Other changes

- `types/do-inc/types.d.ts` (in the `types` git submodule):
  - added `increments` (in `EndUserProps`), `initialized` and
    `onParsedStatementsChange`;
  - documented `IncParameters`' fields.

  **These edits need to be committed and pushed in the `types` submodule
  separately.**
- `emc.json` / `➕.json` were regenerated with `npm run build`.

## Bruce's Response

Shouldn't we support increments a string (prop) and an object?



## Response to Bruce's Response

Yes. `increments` now accepts:

- a property name: `'age'`, the same as `do-inc=age`;
- a single object: `{prop: 'age', byAmtN: 12}`;
- an array of either, mixed freely: `['age', {prop: 'score', byAmtN: 10}]`;
- an empty array, which still means one fully inferred rule.

A new `toRules()` helper in `do-inc.js` normalizes these in `hydrate`. A
non-array is wrapped in an array, and string entries become `{prop}`. The
type is now
`Increments = string | IncParameters | Array<string | IncParameters>`.

There is a new demo/test, `demo/Programmatic/ShorthandForms.html` and
`tests/Programmatic/ShorthandForms.*`. It has three `<mood-stone>`s, one per
form (string, object, mixed array `['age', {prop: 'age', byAmtN: 100}]`),
clicks each once, and expects `1`, `12` and `101`. With `toRules` made
array-only, the test fails. All 11 Playwright tests pass. The README table's
intro now lists the accepted forms.

One edge case: an empty string `''` is falsy, so `hydrate`'s `ifAllOf`
doesn't fire and nothing is attached. That seems right for "no property
given". For "infer everything", use `[]`.
