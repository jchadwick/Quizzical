beforeEach(() => {

    var containsItem = (actual, expected, comparer?) => {
        var cmp = comparer;

        if (!cmp && angular.isDefined(expected) && angular.isDefined(expected.id))
            cmp = function (x) { return x.id == expected.id; }

        if (!cmp)
            cmp = function (x) { return x == expected; }

        return actual.filter(cmp).length > 0;
    }

    jasmine.addMatchers({

        toContainItem: () => {
            return {
                compare: (actual, expected) => {
                    return {
                        pass: containsItem(actual, expected)
                    };
                }
            };
        },

        toContainAllItemsIn: () => {
            return {
                compare: (actual, expected) => {
                    var matches = true;

                    expected.forEach(x => {
                        if (!containsItem(actual, x))
                            matches = false;
                    });

                    return {
                        pass: matches
                    };
                }
            };
        }
    });
}) 