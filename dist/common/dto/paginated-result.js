"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParamOptions = exports.SortType = exports.PaginatedResult = void 0;
class PaginatedResult {
    fromInstance(value) {
        return Object.assign(this, value);
    }
}
exports.PaginatedResult = PaginatedResult;
var SortType;
(function (SortType) {
    SortType[SortType["asc"] = 0] = "asc";
    SortType[SortType["desc"] = 1] = "desc";
})(SortType || (exports.SortType = SortType = {}));
class QueryParamOptions {
}
exports.QueryParamOptions = QueryParamOptions;
//# sourceMappingURL=paginated-result.js.map