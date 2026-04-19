// @ts-check
/** @import {Actions, PAP, AllProps, AP, IncParameters} from './types/do-inc/types' */;
/** @import {RoundaboutOptions} from './types/roundabout/types' */;
/** @import {ElementEnhancementGateway} from './types/assign-gingerly/types' */;
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
        console.log({parsedStatements});
        const {success, statements} = parsedStatements;
        if(!success) return;
        const { nudge } = await import('mount-observer/nudge.js');
        /** @type Set<string> */
        //const alreadyAdded = new Set();
        if(statements.length === 0){
            const name = enhancedElement.getAttribute('name');
            if(!name) throw 400;
            statements.push({
                value: {
                    localEventType: 'click',
                    prop: name,
                    byAmtN: 1
                }
            });
        }
        for(const statement of statements){
            const {value} = statement;
            if(!value) continue;
            const {localEventType} = value;
            enhancedElement.addEventListener(localEventType || 'click', e => {
                self.handleEvent(self, e, value);
            });
        }
        // for (const parsedStatement of parsedStatements.statements) {
        //     let { value } = parsedStatement;
        //     if ()
        //     const {  } = value;
        //     if (!localEventType) {
        //         const { stdEvt } = await import('trans-render/asmr/stdEvt.js');
        //         localEventType = stdEvt(enhancedElement);
        //     }
        //     //if(alreadyAdded.has(localEventType)) continue;
        //     enhancedElement.addEventListener(localEventType, this);
        //     alreadyAdded.add(localEventType);
        // }
        nudge(enhancedElement);
        return /** @type {PAP} */({
            resolved: true,
        });
    }

    /** @type {Map<Specifier, WeakRef<EventTarget>>} */
    #cache = new Map();

    /**
     * 
     * @param {AP} self 
     * @param {Event} e 
     * @param {IncParameters} incParameters 
     * @returns 
     */
    async handleEvent(self, e, incParameters){
        console.log({self, e, incParameters});
        const {enhancedElement} = self;
        let {prop, byAmtN, byAmtS, targetElementId} = incParameters;
        if(byAmtN === undefined){
            if(!byAmtS) throw 400;
            byAmtN = Number(byAmtS.replaceAll('`', ''));
            incParameters.byAmtN = byAmtN;
        }
        const rn = /** @type {DocumentFragment & {host: unknown}} */ (enhancedElement.getRootNode());

        /** @type {any} */
        const target = targetElementId ? rn.getElementById(targetElementId) : (enhancedElement.closest('[itemscope]') || rn.host);
        if(!target) throw 404;
        const currentVal = target[prop] || 0;
        const newVal = currentVal + byAmtN;
        target[prop] = newVal;
        // const { parsedStatements, enhancedElement } = self;
        // if(!parsedStatements.success) return;
        // const { find } = await import('trans-render/dss/find.js');
        // for (const parsedStatement of parsedStatements.statements) {
        //     const {targetSpecifier, sourceSpecifier} = parsedStatement.value;
        //     let targetTarget = this.#cache.get(targetSpecifier)?.deref();
        //     const {prop} = targetSpecifier;
        //     if(prop === undefined) throw 'NI';
        //     if (targetTarget === undefined) {
        //         const remoteTargetTest = await find(enhancedElement, targetSpecifier);
        //         if (!remoteTargetTest)
        //             throw 404;
        //         targetTarget = remoteTargetTest;
        //         this.#cache.set(targetSpecifier, new WeakRef(/** @type {any} */(targetTarget)));
        //     }
        //     const {constVal} = sourceSpecifier;
        //     if(constVal === undefined){
        //         throw 'NI';
        //     }else{
        //         const val = Number(constVal);
        //         /** @type {any} */(targetTarget)[prop] += val;
        //     }

        // }
    }
}

export {DoInc}
