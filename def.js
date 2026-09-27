import  'assign-gingerly/object-extension.js';

/**
 * Registers do-inc's config with the enhancement registry, so it can be
 * attached programmatically via `enh.set.doInc` or `enh.get(emc)`.
 * @param {Element | undefined} ref
 */
export async function defDoInc(ref){
    const {default: emc} = await import('./emc.json', {with: {type: 'json'}});
    return await push(ref, emc);
}

async function push(ref, emc){
    const {DoInc} = await import('./do-inc.js');
    const {enhConfig} = emc;
    enhConfig.spawn = DoInc;
    enhConfig.customData = emc.customData;
    const registry = ref?.customElementRegistry ?? customElements;
    const {enhancementRegistry} = registry;
    enhancementRegistry.push(enhConfig);
    return enhConfig;
}
