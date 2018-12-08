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

var $ = require('jquery');
var contentUpdate = require('./contentUpdate');

$.behaviors('.compoundField', compoundField);

function compoundField(container) {
    var container = $(container);

    function updateHiddenInputs() {
        var selectedValue = $('.compoundField-selector input:checked', container).val();
        $('.compoundField-input', container).each(function() {
            var input = $(this);
            if(input.data('for') == selectedValue) {
                input.show();
            } else {
                input.hide();
            }
        });
    }

    function sizeContainerToMaxChildHeight() {
        var maxChildHeight = 0;
        $('.compoundField-input', container).each(function() {
            maxChildHeight = Math.max(maxChildHeight, $(this).outerHeight(true));
        });

        container.css('min-height', maxChildHeight + 'px');
    }

    sizeContainerToMaxChildHeight();
    contentUpdate.add(sizeContainerToMaxChildHeight);
    $('.compoundField-selector input', container).change(updateHiddenInputs);
    updateHiddenInputs();
}
