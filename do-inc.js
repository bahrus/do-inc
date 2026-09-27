// @ts-check
/** @import {Actions, PAP, AllProps, AP, IncParameters, Increments} from './types/do-inc/types' */;
/** @import {RoundaboutOptions} from './types/roundabout/types' */;
/** @import {ElementEnhancementGateway, SpawnContext} from './types/assign-gingerly/types' */;
/** @import {Infer} from './types/inferencer/types' */
/** @import {EMC} from './types/mount-observer/types' */;
/** @import {RAConfig} from './types/roundabout/types' */;

/**
 * @implements {Actions}
 */
class DoInc {

    /**
     * @this {AllProps & Actions}
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {SpawnContext} ctx 
     * @param {PAP} initVals 
     */
    constructor(enhancedElement, ctx, initVals){
        this.init(this, enhancedElement, ctx, initVals);
    }

    /**
     * @param {AllProps & Actions} self 
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {SpawnContext} ctx 
     * @param {PAP} initVals 
     */
    async init(self, enhancedElement, ctx, initVals){
        const {customData} = /** @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions>>} */ (ctx.emc || ctx.config);
        /**
         * @type {RoundaboutOptions}
         */
        const raOptions = {
            ...customData,
            vm: self,
            initialPropVals: {
                enhancedElement,
                ...customData?.defaultPropVals,
                ...initVals
            }
        };
        await (await import('roundabout-lib/roundabout.js')).roundabout(raOptions);
        self.initialized = true;
    }

    /**
     * Transfers the attribute-parsed `parsedStatements` into `increments` --
     * the property `hydrate` actually reads.  Programmatic callers skip
     * `parsedStatements` entirely and assign `increments` directly.
     * Invoked via the `when_parsedStatements_changes_call_onParsedStatementsChange`
     * compact, never called directly.
     * @param {AP} self
     * @returns {PAP}
     */
    onParsedStatementsChange(self){
        const {parsedStatements} = self;
        if(parsedStatements === undefined) return {};
        const {success, statements} = parsedStatements;
        if(!success) throw 400;
        /** @type {Array<IncParameters>} */
        const increments = [];
        for(const statement of statements){
            if(statement.value !== undefined) increments.push(statement.value);
        }
        return {increments};
    }

    /** @type {AbortController | undefined} */
    #ac;

    /**
     * @param {AP & Actions} self
     */
    async hydrate(self){
        const { increments, enhancedElement } = self;
        const { nudge } = await import('assign-gingerly/handlers/nudge.js');
        // Re-hydrating (increments reassigned) replaces the listeners from the
        // previous pass rather than stacking on them.
        this.#ac?.abort();
        const {signal} = this.#ac = new AbortController();
        const rules = toRules(increments);
        for(const value of rules){
            let {localEventType} = value;
            if(!localEventType){
                localEventType = /** */ (await infer(enhancedElement)).eventType;
            }
            enhancedElement.addEventListener(localEventType, e => {
                self.handleEvent(self, e, value);
            }, {signal});
        }
        nudge(enhancedElement);
        return /** @type {PAP} */({
            resolved: true,
        });
    }


    /**
     * 
     * @param {AP} self 
     * @param {Event} e 
     * @param {IncParameters} incParameters 
     * @returns 
     */
    async handleEvent(self, e, incParameters){
        const {enhancedElement} = self;
        let {prop, byAmtN, byAmtS, targetElementId} = incParameters;
        // Computed locally, so a caller-supplied rule object is never mutated.
        if(byAmtN === undefined){
            if(byAmtS){
                byAmtN = Number(byAmtS.replaceAll('`', ''));
            } else {
                byAmtN = 1; // Default increment amount
            }
        }

        const target = /** @type {any} */ (await ((await import('assign-gingerly/inferencer/upSearch.js')).upSearch(enhancedElement, targetElementId )));
        prop = prop || enhancedElement.getAttribute('name');
        if(!prop){
            const inference = await infer(target);
            const currentVal = inference.value || 0;
            const newVal = currentVal + byAmtN;
            inference.value = newVal;
        }else{
            const currentVal = target[prop] || 0;
            const newVal = currentVal + byAmtN;
            target[prop] = newVal;
        }
        
    }
}

/**
 * Normalize `increments` into an array of rules.  Programmatic callers may
 * pass a property name ('age'), a single rule object, or an array mixing both.
 * An empty array yields a single rule with everything inferred:  the property
 * from the name attribute, an amount of 1, and the inferred event.
 * @param {Increments} increments
 * @returns {Array<IncParameters>}
 */
function toRules(increments){
    const arr = Array.isArray(increments) ? increments : [increments];
    if(arr.length === 0) return [{}];
    return arr.map(inc => typeof inc === 'string' ? {prop: inc} : inc);
}

/**
 *
 * @param {Element & ElementEnhancementGateway} from
 */
async function infer(from){return /** @type {Infer} */ (/** @type {any} */ (from.enh.get((await import('assign-gingerly/inferencer/inferencer.js')).registryItem)));}

export {DoInc}
