import {objectToString} from "./account-settings/overview/overview.datasource";
import {of} from "rxjs";
import {map} from "rxjs/operators";

let responseCache: Map<string, Map<string, any>> = new Map();

export const cache = (uniqId: string) => {
    if (!responseCache.has(uniqId)) {
        responseCache.set(uniqId, new Map())
    }
    const scopeCache: Map<string, any> = responseCache.get(uniqId);

    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {

        const method = descriptor.value;
        descriptor.value = function() {
            const key = propertyKey + objectToString(arguments);
            const cachedData = scopeCache.get(key);
            if (cachedData) return of(cachedData);

            let result = method.apply(this, arguments);

            return result.pipe(map((data) => {
                scopeCache.set(key, data);
                return data;
            }))
        };
        return descriptor
    };
};

export const clearCache = (uniqId: string) => {
    if (responseCache.has(uniqId))
        responseCache.get(uniqId).clear();
};
