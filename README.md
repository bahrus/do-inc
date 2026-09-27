# do-inc (➕)

Increment a property from the host or a peer element via a specified amount on a specified event.

## Alternatives

[do-merge](https://github.com/bahrus/do-invoke) covers most of the same ground as [do-invoke](https://github.com/bahrus/do-invoke), [do-inc](https://github.com/bahrus/do-inc), and [do-toggle](https://github.com/bahrus/do-toggle). The key differences:

- **do-invoke**, **do-inc**, and **do-toggle** use a string DSL (no JSON required) and include inferencing logic — they can figure out the event type, target property, etc. from context, so you can often be less explicit. The intent is arguably more obvious at a glance for their specific use cases.
- **do-merge** uses JSON syntax and the full power of [assign-gingerly](https://github.com/bahrus/assign-gingerly) operators (`=!` for toggle, `+=` for increment, method calls via `?.classList?.add`, etc.). It's more general-purpose — a single enhancement that can handle toggling, incrementing, method invocation, and arbitrary property assignment in one attribute.

Choose do-merge when you need to combine multiple operations or want the full expressiveness of assign-gingerly. Choose the specialized enhancements like *do-inc* when brevity and self-documenting intent matter more.

The following shows all the required html mockup in all its glory

```html
<be-hive>
    <script type=emc-parser 
            src="be-hive/parsers/parse-grouped-capture-statements.js" 
            parser-name=parse-grouped-capture-statements></script>
    <script type=emc 
            src="do-inc/emc.json" 
            wait-for-parsers=parse-grouped-capture-statements></script>
</be-hive>
<script type=module>
    import 'be-hive/be-hive.js';
    class MoodStone extends HTMLElement {
        #age;
        get age(){
            return this.#age;
        }
        set age(nv){
            this.#age = nv;
            this.querySelector('[itemprop="age"]').textContent = nv;
        }
    }
    customElements.define('mood-stone', MoodStone);
    document.querySelector('mood-stone').age = 0;
</script>
<mood-stone itemscope>
    <span itemprop=age></span>
    <button do-inc="age byAmt `12`">Increment</button>
</mood-stone>
```

## Inferring the property to increment:

```html
<mood-stone itemscope>
    <span itemprop=age></span>
    <button name=age ➕>Increment</button>
</mood-stone>
```

This increments the age property of the host (mood-stone) by 1 on the click event of the adorned button element.

## Specifying the event to trigger increment:

```html
<mood-stone itemscope>
    <span itemprop=age></span>
    <button ➕="age byAmt `12` on mouseover">Increment</button>
</mood-stone>
```

## Inferring the increment amount

```html
<mood-stone itemscope>
    <span itemprop=age></span>
    <button  ➕=age>Increment</button>
</mood-stone>
```

This infers that the increment amount should be 1 on click.

## Inferring the name of the property to increment from the name attribute

```html
<mood-stone itemscope>
    <span itemprop=age></span>
    <button name=age  ➕="byAmt `12`">Increment</button>
</mood-stone>
```

## Specifying the event with inferred prop

```html
<mood-stone itemscope>
    <span itemprop=age></span>
    <button name=age  ➕="byAmt `12` on mouseover">Increment</button>
</mood-stone>
```

## Programmatic attachment (no attribute)

The attribute syntax shown above shines for server-rendered HTML and progressive enhancement:  the markup alone says what gets incremented, by how much, and when.  But most web development today renders on the client, with a framework (Lit, React, Vue, Svelte, etc.) that already has a JavaScript reference to each element it creates.  In that setting, attaching do-inc programmatically is the better fit:

1.  **A less clunky API.**  Frameworks tend to be awkward about setting arbitrary (let alone emoji) attributes, and composing ``"age byAmt `12` on mouseover"`` -- backticks and all -- from framework state is error prone.  Setting `increments` to an array of plain objects is ordinary JavaScript, which the framework, your editor, and TypeScript all understand.  The amount is an actual number (`byAmtN: 12`), and you can increment a *peer* element (`targetElementId`), which the attribute syntax has no way to express.
2.  **Less stringifying and parsing.**  With an attribute, the framework serializes each rule to a string, which do-inc then matches against a series of regular expressions, then strips the backticks off the amount and converts it to a number.  Setting `increments` directly skips all of that.
3.  **Less overhead monitoring attributes.**  The attribute approach relies on [be-hive](https://github.com/bahrus/be-hive) / [mount-observer](https://github.com/bahrus/mount-observer) watching the DOM for elements that carry (or gain) the attribute, and for changes to its value.  The programmatic approach needs none of that -- `def.js` just registers the enhancement's config, and the enhancement is attached exactly when, and to exactly the elements, your code says.

Both approaches produce the same enhancement, with the same inference rules, so you can mix them in one app -- attributes for server-rendered islands, programmatic attachment inside client-rendered components.

First register the enhancement's config once:

```JS
import { defDoInc } from 'do-inc/def.js';
const emc = await defDoInc(document.body); // or a shadow root's host, for a scoped registry
```

Then set `increments` -- one object per statement.  Anything omitted is inferred exactly as with the attribute.  `increments` accepts:

- a property name:  `'age'` (equivalent to `do-inc=age`);
- a single object:  `{prop: 'age', byAmtN: 12}`;
- an array of either, mixed freely:  `['age', {prop: 'score', byAmtN: 10}]`;
- an empty array, equivalent to a bare `➕` attribute (everything inferred).

| Statement part       | Property          | Notes                                                              |
|----------------------|-------------------|--------------------------------------------------------------------|
| `age`                | `prop`            | Defaults to the `name` attribute, else the inferred value property. |
| ``byAmt `12` ``      | `byAmtN`          | `12` -- a number.  Defaults to `1`.                                |
| `on mouseover`       | `localEventType`  | Defaults to the inferred event (e.g. `click` for a button).        |
| *(none)*             | `targetElementId` | id of a peer element to increment, instead of the host.            |

### Declarative -- via `enh.set`

```JS
// equivalent to <button do-inc="age byAmt `12`">
button.enh.set.doInc.increments = [{prop: 'age', byAmtN: 12}];
```

This can be done before or after `defDoInc` has been called.

### Imperative -- via `enh.get()`

```JS
// increment a peer <mood-stone id=counter>, rather than the itemscope host
button.enh.get(emc).increments = [
    {prop: 'age', byAmtN: 5, targetElementId: 'counter'}
];
```

Reassigning `increments` (e.g. when a framework re-renders with new props) replaces the listeners from the previous value rather than adding more.

See [demo/Programmatic](demo/Programmatic/) for runnable examples.

## Viewing Demos Locally

1. Install git
2. Fork/clone this repo
3. Install node.js
4. Open command window to folder where you cloned this repo
5. > git submodule add https://github.com/bahrus/types.git types
6. > git submodule update --init --recursive
7. > npm install
8. > npm run serve
9. Open http://localhost:8000/ in a modern browser

## Running Tests

```
> npm run test
```

## Using from ESM Module:

```JavaScript
import 'do-inc/do-inc.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.sh/do-inc';
</script>
```
