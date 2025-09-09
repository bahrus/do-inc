# do-inc

```html
<my-component itemscope>
    <div 🔭 itemprop=likes></div>
    <button do-inc="likes byAmt `1` on click">Like</button>
    <button do-inc="likes byAmt `-1`">Dislike</button>
    <xtal-element 
        prop-defaults='{
            "likes": 0,
            "isHappy": true,
        }'
    ></xtal-element>
</my-component>
```