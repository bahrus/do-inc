// @ts-check
/** @import {Actions, PAP, AllProps, AP, IncParameters} from './types/do-inc/types' */;
/** @import {RoundaboutOptions} from './types/roundabout/types' */;
/** @import {ElementEnhancementGateway, ElementInfer} from './types/assign-gingerly/types' */;
/** @import {EMC} from './types/mount-observer/types' */;
/** @import {RAConfig} from './types/roundabout/types' */;
/** @import {Specifier} from './types/do-inc/types' */
/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions>>}
 */
import emc from './emc.json' with {type: 'json'};

const {customData} = emc;

/**
 * @implements {Actions}
 */
class DoInc {

    /**
     * @this {AllProps & Actions}
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {*} ctx 
     * @param {AllProps} initVals 
     */
    constructor(enhancedElement, ctx, initVals){
        this.init(this, enhancedElement, initVals);
    }

    /**
     * @param {AllProps & Actions} self 
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {PAP} initVals 
     */
    async init(self, enhancedElement, initVals){
        /**
         * @type {RoundaboutOptions}
         */
        const raOptions = {
            ...customData,
            vm: self,
            initialPropVals: {
                enhancedElement,
                ...initVals
            }
        };
        (await import('roundabout-lib/roundabout.js')).roundabout(raOptions);
    }

    /**
     * @param {AP & Actions} self 
     */
    async hydrate(self){
        const { parsedStatements, enhancedElement } = self;
        const {success, statements} = parsedStatements;
        if(!success) throw 400;
        const { nudge } = await import('mount-observer/nudge.js');
        /** @type Set<string> */
        //const alreadyAdded = new Set();
        if(statements.length === 0){
            const prop = enhancedElement.getAttribute('name');
            const inference = await infer(enhancedElement);
            statements.push({
                value: {
                    localEventType: inference.eventType,
                    prop,
                    byAmtN: 1
                }
            });
        }
        for(const statement of statements){
            const {value} = statement;
            if(!value) continue;
            // If prop is empty or undefined, fall back to inference
            // if(!value.prop){
            //     const inference = await infer(enhancedElement);
            //     value.prop = inference.propName;
            // }
            let {localEventType} = value;
            if(!localEventType){
                localEventType = (await infer(enhancedElement)).eventType;
            }
            enhancedElement.addEventListener(localEventType, e => {
                self.handleEvent(self, e, value);
            });
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
        if(byAmtN === undefined){
            if(byAmtS){
                byAmtN = Number(byAmtS.replaceAll('`', ''));
            } else {
                byAmtN = 1; // Default increment amount
            }
            incParameters.byAmtN = byAmtN;
        }
        const rn = /** @type {DocumentFragment & {host: unknown}} */ (enhancedElement.getRootNode());

        /** @type {any} */
        const target = targetElementId ? rn.getElementById(targetElementId) : (enhancedElement.closest('[itemscope]') || rn.host);
        if(!target) throw 404;
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
 * 
 * @param {Element & ElementEnhancementGateway} from 
 */
async function infer(from){return /** @type {ElementInfer} */ (/** @type {any} */ (from.enh.get((await import('assign-gingerly/Infer.js')).registryItem)));}

export {DoInc}
