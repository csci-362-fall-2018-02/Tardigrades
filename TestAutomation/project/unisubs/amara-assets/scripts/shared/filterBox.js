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
var _ = require('underscore');
var position = require('./position');
var querystring = require('./querystring');
var select = require('./select/main');
var ajax = require('./ajax');
var filters = require('./filters');
var keyCodes = require('./keyCodes');

$.behaviors('.filterBox', filterBox);

function filterBox(filterBox) {
    filterBox = $(filterBox);
    var dropdownMenu = $('.dropdownMenu', filterBox);
    var button = $('.filterBox-button', filterBox);
    var chooser = null;

    var filtersContainer = $('<div class="filterBox-filters">').appendTo(filterBox);

    // create the clear all button
    var clearAllButton = $('<button class="filterBox-clearAllButton">').appendTo(filterBox);
    clearAllButton.text(gettext('Clear Filters '));
    clearAllButton.append('<span class="fa fa-times-circle">');
    clearAllButton.on('click', clearAllFilters);

    dropdownMenu.on('link-activate', function(evt, fieldName) {
        if(fieldName == 'update-filter') {
            // menu item that updates the filter without needing a dialog
            return;
        }
        buildChooser(fieldName, filterBox);
    }).on('show', function() {
        removeChooserIfShown();
    });

    function buildChooser(fieldName, positioner) {
        removeChooserIfShown();

        var inputSelector = ('[name=' + fieldName + ']');
        var sourceInput = $(inputSelector, filterBox);
        var isSelect2 = Boolean(sourceInput.is('.select'));

        if(isSelect2 && sourceInput.data('select2')) {
            sourceInput.select2('destroy');
        }
        var formField = sourceInput.closest('.form-group').clone();
        var formLabel = $('label', formField);
        var input = $(inputSelector, formField);

        chooser = $('<div class="filterBox-chooser">');
        if(formLabel.length > 0) {
            // convert label to a title for the dialog
            chooser.append($('<h4>', { 'class': 'modal-title'}).text(formLabel.text()));
            formLabel.remove();
        }
        chooser.append($('<div class="filterBox-chooserField">').append(formField));
        var buttonContainer = $('<div class="filterBox-chooserActions">').appendTo(chooser);
        var cancelButton = $('<button class="filterBox-chooserAction borderless">').text(gettext('Cancel')).appendTo(buttonContainer);
        var applyButton = $('<button class="filterBox-chooserAction cta">').text(gettext('Apply')).appendTo(buttonContainer);
        $('body').append(chooser);

        setupChooserInput(fieldName, input, isSelect2);
        cancelButton.click(removeChooserIfShown);
        applyButton.click(function() {
            removeChooserIfShown();
            if(inputIsMultiValued(input)) {
                var values = input.val();
            } else {
                var values = [input.val()];
            }
            createFilterBoxes(fieldName, values);
            filters.add(fieldName, values);
        });
        input.on('input change', function() {
            if(input.val() == '') {
                applyButton.prop('disabled', true);
                applyButton.addClass('disabled');
            } else {
                applyButton.prop('disabled', false);
                applyButton.removeClass('disabled');
            }
        }).change();

        position.below(chooser, positioner);
        if(isSelect2) {
            input.select2('focus');
        } else {
            input.focus();
        }
        if(input.is(':text')) {
            input.on('keydown', function(evt) {
                if(evt.which == keyCodes.enter && input.val() != '') {
                    applyButton.click();
                } else if(evt.which == keyCodes.esc) {
                    removeChooserIfShown();
                }
            });
        }
    }

    function setupChooserInput(name, input, isSelect2) {
        // Pre-select the currently selected value for singletons
        if(inputIsMultiValued(input)) {
            var currentVal = querystring.parseList()[name];
        } else {
            var currentVal = querystring.parse()[name];
        }
        if(currentVal) {
            input.val(currentVal);
            // for textboxes, select the value as well
            input.filter(':text').select();
        }

        if(isSelect2) {
            select.initSelect(input);
        }
    }

    function removeChooserIfShown() {
        if(chooser) {
            chooser.remove();
            chooser = null;
        }
    }

    function createFilterBoxes(name, values) {
        var inputLabel = labelForInput(name);
        if(inputLabel === null) {
            return;
        }
        // remove existing filter elements before adding a new one
        filtersContainer.children().each(function() {
            var elt = $(this);
            if(elt.data('name') == name) {
                elt.remove();
            }
        });
        _.each(values, function(value) {
            if(filterBox.data(name + 'Default') == value) {
                // Don't add the filter box if the value is the default value
                return;
            }

            var elt = $('<div class="filterBox-filter">');
            elt.append($('<span class="filterBox-filterText">').text(
                        inputLabel + ': ' + labelForInputValue(name, value)));
            var closeButton = $('<button class="filter-removeFilter">x</button>').appendTo(elt);
            elt.data('name', name);
            closeButton.on('click', function() { elt.remove(); updateHasFilters(); filters.remove(name, value); });

            filtersContainer.append(elt);
        });
        updateHasFilters();
    }

    function inputIsMultiValued(input) {
        if(input.prop('type') == 'select-multiple') {
            return true;
        } else {
            return false;
        }
    }

    function labelForInput(name) {
        var label = null;

        $('.dropdownMenu-link', dropdownMenu).each(function() {
            var link = $(this);
            var activateArgs = link.data('activateArgs');
            if(activateArgs.length == 1 && activateArgs[0] == name) {
                label = link.text();
                return false;
            }
        });

        return label;
    }

    function labelForInputValue(name, value) {
        var input = $('[name=' + name + ']', filterBox);

        if(input.prop('tagName') == 'SELECT') {
            return $('option[value=' + value + ']:first', input).text();
        } else {
            return value;
        }
    }

    function updateHasFilters() {
        if(filtersContainer.is(':empty')) {
            filterBox.removeClass('hasFilters');
        } else {
            filterBox.addClass('hasFilters');
        }
    }

    function clearAllFilters() {
        filtersContainer.empty();
        filters.clear();
        updateHasFilters();
    };

    // Add existing querystring args as filters
    _.each(querystring.parseList(), function(values, name) { createFilterBoxes(name, values) });
}

