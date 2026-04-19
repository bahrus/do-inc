// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC, EventListenerOrFn} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP,  AP} from './ts-refs/do-toggle/types' */;

const targetPartAmtSourcePart = String.raw `^(?<targetPart>.*) byAmt (?<sourcePart>.*)`;
const targetPartAmtSourcePartOnEventType = String.raw `${targetPartAmtSourcePart} on (?<localEventType>.*)`;

/**
 * @type {Array<[string, string]>}
 */
const dssKeys = [['targetPart', 'targetSpecifier'], ['sourcePart', 'sourceSpecifier']];

/**
 * @type {Partial<EMC<any, AP>>}
 */
export const emc = {
    base: 'do-inc',
    map: {
        '0.0':{
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                parsedStatements: [
                    {
                        regExp: targetPartAmtSourcePartOnEventType,
                        defaultVals: {},
                        dssKeys,
                    },
                    {
                        regExp: targetPartAmtSourcePart,
                        defaultVals: {},
                        dssKeys,
                    }
                ]
            }
        }
    },
    enhPropKey: 'doInc',
    importEnh: async () => {
        const { DoInc } = await import('./do-inc.js');
        return DoInc;
    }
}

const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);