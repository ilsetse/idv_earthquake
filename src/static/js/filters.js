function applyFilters(data, filters) {
    var result = data;

    filters.forEach(f => {
        result = result.filter(x => f(x));
    })

    return result;
}

function applyMinMagnitude(sliderVal, filters) {
    const filterFunc = t => {
        const isMagnitudeOn = $('#magnitude-filter-is-on')[0].checked;
        return (t['properties']['mag'] >= sliderVal || !isMagnitudeOn);
    }

    filters.set('min-mag', filterFunc);
    return filters;
}

function applyMaxMagnitude(sliderVal, filters) {
    const filterFunc = t => {
        const isMagnitudeOn = $('#magnitude-filter-is-on')[0].checked;
        return (t['properties']['mag'] <= sliderVal || !isMagnitudeOn);
    }

    filters.set('max-mag', filterFunc);
    return filters;
}

function getFlooredDate() {
    return new Date(Math.floor(new Date() / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24))
}

function applyMaxYear(sliderVal, filters) {
    const filterFunc = t => {
        const maxYear = getFlooredDate().setFullYear(sliderVal);
        return t['properties']['time'] <= maxYear;
    }

    filters.set('max-year', filterFunc)
    return filters;
}

function applyMinYear(sliderVal, filters) {
    const filterFunc = t => {
        const minYear = getFlooredDate().setFullYear(sliderVal);
        return t['properties']['time'] >= minYear;
    }

    filters.set('min-year', filterFunc)
    return filters;
}

function getSlider(namePrefix, minVal, maxVal) {
    const slider =   
        $( function() {
            $( "#" + namePrefix + "-slider-range" ).slider({
            range: true,
            min: minVal,
            max: maxVal,
            values: [ minVal, maxVal ],
            slide: function( event, ui ) {
                const min = ui.values[0];
                const max = ui.values[1];

                $( "#" + namePrefix + "-amount" ).val( min + " - " + max );
                setRange(namePrefix, min, max);
            }
            });
            $( "#" + namePrefix + "-amount" ).val( $( "#" + namePrefix + "-slider-range" ).slider( "values", 0 ) +
            " - " + $( "#" + namePrefix + "-slider-range" ).slider( "values", 1 ) );
        } );

    return slider;
}

const validFilters = 
    {'min-year':  applyMinYear,
     'max-year': applyMaxYear,
     'min-magnitude': applyMinMagnitude,
     'max-magnitude': applyMaxMagnitude}

function isInBounds(bounds, point) {
    const min = bounds.getSouthWest();
    const max = bounds.getNorthEast();

    const lat = point['geometry']['coordinates'][1];
    const lng = point['geometry']['coordinates'][0];

    return min.lat() <= lat && lat <= max.lat() && min.lng() <= lng && lng <= max.lng();
}