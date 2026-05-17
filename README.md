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
