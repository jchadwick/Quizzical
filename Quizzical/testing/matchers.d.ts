/// <reference path="../typings/jasmine/jasmine.d.ts" />

declare module jasmine {
    interface Matchers {

        toContainItem(actual: any): boolean;
        toContainAllItemsIn(actual: any[]): boolean;

    }
}

