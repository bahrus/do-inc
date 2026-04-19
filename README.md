# do-inc (➕)

Increment a property from the host or a peer element via a specified amount on a specified event.

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

This increments age by 1 on click.

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