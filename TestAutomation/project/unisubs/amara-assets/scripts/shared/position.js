/*
 * Amara, universalsubtitles.org
 *
 * Copyright (C) 2018 Participatory Culture Foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see
 * http://www.gnu.org/licenses/agpl-3.0.html.
 */

// position -- position elements in various ways

$ = require('jquery');
_ = require('underscore');

function boundsForElt(elt) {
    var offset = elt.offset();
    return {
        left: offset.left,
        top: offset.top,
        right: offset.left + elt.outerWidth(),
        bottom: offset.top + elt.outerHeight()
    };
}

function boundsFromEventPoint(eventObj) {
    return {
        left: eventObj.pageX,
        right: eventObj.pageX,
        top: eventObj.pageY,
        bottom: eventObj.pageY
    };
}

function boundsForViewport() {
    var $window = $(window);
    var scrollTop = $window.scrollTop();
    return {
        left: 0,
        top: scrollTop,
        right: $window.width(),
        bottom: scrollTop + $window.height()
    };
}

// Position an element below another element.
//
// Args:
// 1) elt - the element to be positioned
// 2) reference - the reference element where elt will be positioned against
// 3) options - dictionary of additional options: dropLeft
//
// By default, the element "drops" to the right (left edge of dropdown aligned with left edge of reference). 
// Add a dropLeft key with a value of true to drop the dropdown to the left instead (right edge of dropdown aligned with right edge of ref)
//
// If the element being positioned would be offscreen, then position it on top instead.
function below(elt, reference, options) {
    if(options === undefined) {
        options = {};
    }
    options = _.defaults(options, {
        dropLeft: false
    });
    elt.detach().appendTo($('body'));

    if(reference.pageX) {
        // position relative to a mouse click
        var referenceBounds = boundsFromEventPoint(reference);
    } else if(reference.touches) {
        // position relative to a touch event
        var referenceBounds = boundsFromEventPoint(reference.touches[0]);
    } else {
        // position relative to an element
        var referenceBounds = boundsForElt(reference);
    }
    var viewportBounds = boundsForViewport();
    var height = elt.outerHeight();
    var width = elt.outerWidth();


    // By default we position the element below the reference elt.  But we position it on top if:
    //   - The element would go below the bottom of the screen
    //   - There's room above the reference element to show it there
    if(referenceBounds.bottom + height >= viewportBounds.bottom &&
            height < referenceBounds.top - viewportBounds.top) {
        var top = referenceBounds.top - height + 'px';
    } else {
        var top = referenceBounds.bottom + 'px';
    }

    // Do the same thing for left/right
    if (options.dropLeft) {
        if(referenceBounds.right - width <= viewportBounds.left &&
            width < viewportBounds.right - referenceBounds.right) {
            var left = referenceBounds.left + 'px';
        } else {
            var left = referenceBounds.right - width + 'px';
        }   
    } else {
        if(referenceBounds.left + width >= viewportBounds.right &&
            width < referenceBounds.left - viewportBounds.left) {
            var left = referenceBounds.right - width + 'px';
        } else {
            var left = referenceBounds.left + 'px';
        }  
    }
    elt.css({
        position: 'absolute',
        left: left,
        top: top
    })
}

module.exports = {
    below: below
};
