// @ts-check
/** @import {Actions, PAP, AllProps, AP} from './types/do-inc/types' */;
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
 * @implements {EventListenerObject}
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
     * @param {AP} self 
     */
    async hydrate(self){
        const { parsedStatements, enhancedElement } = self;
        if(!parsedStatements.success) return;
        const { nudge } = await import('mount-observer/nudge.js');
        /** @type Set<string> */
        const alreadyAdded = new Set();
        for (const parsedStatement of parsedStatements.statements) {
            let { localEventType } = parsedStatement.value;
            if (!localEventType) {
                const { stdEvt } = await import('trans-render/asmr/stdEvt.js');
                localEventType = stdEvt(enhancedElement);
            }
            if(alreadyAdded.has(localEventType)) continue;
            enhancedElement.addEventListener(localEventType, this);
            alreadyAdded.add(localEventType);
        }
        nudge(enhancedElement);
        return /** @type {PAP} */({
            resolved: true,
        });
    }

    /** @type {Map<Specifier, WeakRef<EventTarget>>} */
    #cache = new Map();

    async handleEvent(){
        const self = /** @type {AP} */ (/** @type {any} */ (this));
        const { parsedStatements, enhancedElement } = self;
        if(!parsedStatements.success) return;
        const { find } = await import('trans-render/dss/find.js');
        for (const parsedStatement of parsedStatements.statements) {
            const {targetSpecifier, sourceSpecifier} = parsedStatement.value;
            let targetTarget = this.#cache.get(targetSpecifier)?.deref();
            const {prop} = targetSpecifier;
            if(prop === undefined) throw 'NI';
            if (targetTarget === undefined) {
                const remoteTargetTest = await find(enhancedElement, targetSpecifier);
                if (!remoteTargetTest)
                    throw 404;
                targetTarget = remoteTargetTest;
                this.#cache.set(targetSpecifier, new WeakRef(/** @type {any} */(targetTarget)));
            }
            const {constVal} = sourceSpecifier;
            if(constVal === undefined){
                throw 'NI';
            }else{
                const val = Number(constVal);
                /** @type {any} */(targetTarget)[prop] += val;
            }

        }
    }
}

export {DoInc}
