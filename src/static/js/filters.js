function applyFilters(data, filters) {
    var result = data;

    filters.forEach(f => {
        result = result.filter(x => f(x));
    })

    return result;
}

function applyMinMagnitude(targetSlider, filters) {
    const filterFunc = t => {
        const sliderVal = targetSlider.value;
        return t['properties']['mag'] >= sliderVal;
    }

    filters.set('min-mag', filterFunc);
    return filters;
}

function applyMaxMagnitude(targetSlider, filters) {
    const filterFunc = t => {
        const sliderVal = targetSlider.value;
        return t['properties']['mag'] <= sliderVal;
    }

    filters.set('max-mag', filterFunc);
    return filters;
}

function getFlooredDate() {
    return new Date(Math.floor(new Date() / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24))
}

function applyMaxYear(targetSlider, filters) {
    const filterFunc = t => {
        const sliderVal = targetSlider.value;
        const maxYear = getFlooredDate().setFullYear(sliderVal);
        return t['properties']['time'] <= maxYear;
    }

    filters.set('max-year', filterFunc)
    return filters;
}

function applyMinYear(targetSlider, filters) {
    const filterFunc = t => {
        const sliderVal = targetSlider.value;
        const minYear = getFlooredDate().setFullYear(sliderVal);
        return t['properties']['time'] >= minYear;
    }

    filters.set('min-year', filterFunc)
    return filters;
}