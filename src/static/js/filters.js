function applyFilters(data, filters) {
    var result = data;

    filters.forEach(f => {
        result = result.filter(x => f(x));
    })

    return result;
}