//@ts-check

/** @import {EMC} from './types/mount-observer/types' */;
/** @import {AllProps, Actions} from './types/do-inc/types' */
/** @import {RAConfig} from './types/roundabout/types' */
/** @import {PatternConfig} from './types/nested-regex-groups/types' */

// const defaultVals = {
//     // No default values needed for localEventType since it's optional
// };

/** @type {PatternConfig[]} */
const parsePatterns = [
    {
        name: 'targetAmtSourceOnEvent',
        pattern: String.raw `^(?<prop>.*) byAmt (?<byAmtS>.*) on (?<localEventType>.*)`,
        description: 'Target property, amount, and explicit event type',
        //defaultVals,
        //dssKeys: [['targetSpecifier', 'targetSpecifier'], ['sourceSpecifier', 'sourceSpecifier']]
    },
    {
        name: 'targetAmtSource',
        pattern: String.raw `^(?<prop>.*) byAmt (?<byAmtS>.*)`,
        description: 'Target property and amount with default event',
        //defaultVals,
        //dssKeys: [['targetSpecifier', 'targetSpecifier'], ['sourceSpecifier', 'sourceSpecifier']]
    },
    {
        name: 'targetAmtSource',
        pattern: String.raw `byAmt (?<byAmtS>.*) on (?<localEventType>.*)`,
        description: 'Amount and explicit event type with inferred property',
        //defaultVals,
        //dssKeys: [['targetSpecifier', 'targetSpecifier'], ['sourceSpecifier', 'sourceSpecifier']]
    },
    {
        name: 'targetAmtSource',
        pattern: String.raw `byAmt (?<byAmtS>.*)`,
        description: 'Target property and amount with default event',
        //defaultVals,
        //dssKeys: [['targetSpecifier', 'targetSpecifier'], ['sourceSpecifier', 'sourceSpecifier']]
    },
    {
        name: 'targetOnly',
        pattern: String.raw `^(?<prop>.+)$`,
        description: 'Target property only, infers amount of 1 and click event',
        //defaultVals,
        //dssKeys: [['targetSpecifier', 'targetSpecifier'], ['sourceSpecifier', 'sourceSpecifier']]
    }
];

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions> >}
 */
export const emc = {
    enhConfig: {
        enhKey: 'doInc',
        spawn: 'do-inc/do-inc.js',
        withAttrs: {
            base: 'do-inc',
            _base: {
                mapsTo: 'parsedStatements',
                parser: 'parse-grouped-capture-statements',
                instanceOf: 'Array',
                parserConfig: parsePatterns
            }
        }
    },
    customData: {
        weakRef: {
            properties: ['enhancedElement']
        },
        actions: {
            hydrate: {
                ifAllOf: ['parsedStatements', 'enhancedElement']
            }
        }
    }
};

export function render(){
    return JSON.stringify(emc, null, 4);
}

console.log(render());
