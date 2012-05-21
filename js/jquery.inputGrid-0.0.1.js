// Uses AMD or browser globals to create a jQuery plugin.

// It does not try to register in a CommonJS environment since
// jQuery is not likely to run in those environments.
// See jqueryPluginCommonJs.js for that version.

/**
 * Touch Grid - jQuery Plugin
 *
 * Version: 0.0.1 (10/05/2012)
 * Requires: jQuery v1.7+
 *
 * Copyright (c) 2011 Adam Draper
 * Under MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jQuery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var $this,
        $beacon = $('<div class="beacon" style="width:10px; height:10px; background: green; position: absolute;"></div>'),
        Grid = {};
    
    var methods = {
        init : function( options ) {
            return this.each(function(){
                var $this = $(this),
                    data = $this.data('initialized');
         
                // If the plugin hasn't been initialized yet
                if ( ! data ) {
                    $this = $(this);
                    // set plugin to initialized
                    $this.data('initialized', true);
                    // append beacon
                    $this.append($beacon);
                    // main grid object
                    Grid = {
                        width: $this.width(),
                        height: $this.height(),
                        columns: options.columns || 10,
                        rows: options.rows || 10,
                        x: options.x || 0,
                        y: options.y || 0,
                        beacon: {
                            width: $beacon.width(),
                            height: $beacon.height(),
                            position: function() {
                                $beacon.css({
                                    'bottom': (Grid.y * Grid.yBase) + (Grid.yBase / 2) - (this.height / 2),
                                    'left': (Grid.x * Grid.xBase) + (Grid.xBase / 2) - (this.width / 2)
                                });
                            }
                        },
                        setCoords: function(x, y) {
                            var xPrev = this.x,
                                yPrev = this.y;

                            this.x = Math.floor(x / this.xBase);
                            this.y = (this.rows - 1) - Math.floor(y / this.yBase);

                            if(xPrev != this.x || yPrev != this.y) {
                                $this.trigger('changed');
                            }
                        },
                        getCoords: function() {

                        }
                    };    
                    
                    Grid.xBase = Grid.width / Grid.columns;
                    Grid.yBase = Grid.height / Grid.rows;
                    // initial beacon position
                    Grid.beacon.position();

                    $this.on('mousedown', function(e) {
                        // get click coords
                        var x = e.offsetX, y = e.offsetY;

                        Grid.setCoords(x, y);
                    })
                    .on('changed', function() {
                        Grid.beacon.position();
                    });
                }
            });
        },
        getCoords : function( ) { 
            return {
                x: Grid.x,
                y: Grid.y
            };
        },
        setCoords : function( x, y ) { 
            Grid.setCoords(x, y);
        }
    };

    $.fn.inputGrid = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }    

    };
}));