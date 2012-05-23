// Uses AMD or browser globals to create a jQuery plugin.

// It does not try to register in a CommonJS environment since
// jQuery is not likely to run in those environments.
// See jqueryPluginCommonJs.js for that version.

/**
 * Input Grid - jQuery Plugin
 *
 * Version: 0.2.0 (5/21/2012)
 * Requires: jQuery v1.7+
 *
 * Copyright (c) 2011 Adam Draper - http://github.com/adamwdraper
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
        $beacon = $('<div class="beacon"></div>'),
        Grid = {};
    
    var methods = {
        init : function( options ) {
            return this.each(function(){
                var $this = $(this),
                    offset = $this.offset(),
                    data = $this.data('initialized');
         
                if ( ! data ) {
                    $this = $(this);
                    $this.data('initialized', true);
                    $this.append($beacon);
                    
                    Grid = {
                        width: $this.width(),
                        height: $this.height(),
                        left: offset.left,
                        top: offset.top,
                        x: {
                            value: options.x.value || options.x.min || 0,
                            min: options.x.min || 0,
                            max: options.x.max || 20
                        },
                        y: {
                            value: options.y.value || options.y.min  || 0,
                            min: options.y.min || 0,
                            max: options.y.max || 20
                        },
                        beacon: {
                            width: $beacon.width(),
                            height: $beacon.height(),
                            position: function() {
                                $beacon.css({
                                    'bottom': (Grid.y.col * Grid.y.base) + (Grid.y.base / 2) - (this.height / 2),
                                    'left': (Grid.x.row * Grid.x.base) + (Grid.x.base / 2) - (this.width / 2)
                                });
                            }
                        },
                        setCoordsFromOffset: function(x, y) {
                            var xPrev = this.x.value,
                                yPrev = this.y.value,
                                row = Math.floor((x - this.left) / this.x.base),
                                col = (this.y.max - this.y.min) - Math.floor((y - this.top) / this.y.base);
                                
                            if(row >= 0 && row < this.rows) {
                                this.x.row = Math.floor((x - this.left) / this.x.base);
                                this.x.value = this.x.row + this.x.min;
                            }

                            if(col >= 0 && col < this.cols) {
                                this.y.col = (this.y.max - this.y.min) - Math.floor((y - this.top) / this.y.base);
                                this.y.value = this.y.col + this.y.min;
                            }

                            if(xPrev != this.x.value || yPrev != this.y.value) {
                                $this.trigger('change');
                            }
                        },
                        setCoords: function(x, y) {
                            
                            var xPrev = this.x.value,
                                yPrev = this.y.value;

                            this.x.value = x;
                            this.x.row = this.x.value - this.x.min;
                            this.y.value = y;
                            this.y.col = this.y.value - this.y.min;
                            if(xPrev != this.x.value || yPrev != this.y.value) {
                                $this.trigger('change');
                            }
                        },
                        
                        startDrag: function() {
                            $this.on('mousemove', function(e) {
                                Grid.setCoordsFromOffset(e.pageX, e.pageY);
                            });
                        },
                        
                        stopDrag: function() {
                            $this.off('mousemove');
                        }
                    };
                    
                    Grid.rows = (Grid.x.max - Grid.x.min) + 1;
                    Grid.x.base = Grid.width / (Grid.rows);
                    if(Grid.x.value < Grid.x.min) {
                        Grid.x.value = Grid.x.min;
                    } else if(Grid.x.value > Grid.x.max) {
                        Grid.x.value = Grid.x.max;
                    }
                    
                    Grid.cols = (Grid.y.max - Grid.y.min) + 1;
                    Grid.y.base = Grid.height / (Grid.cols);
                    if(Grid.y.value < Grid.y.min) {
                        Grid.y.value = Grid.y.min;
                    } else if(Grid.y.value > Grid.y.max) {
                        Grid.y.value = Grid.y.max;
                    }
                    
                    Grid.x.initValue = Grid.x.value;
                    Grid.y.initValue = Grid.y.value;

                    Grid.setCoords(Grid.x.value, Grid.y.value);
                    Grid.beacon.position();

                    $this.on('mousedown', function(e) {
                        Grid.setCoordsFromOffset(e.pageX, e.pageY);
                        Grid.startDrag();
                    })
                    .on('change', function() {
                        Grid.beacon.position();
                    });
                    
                    $(document).on('mouseup', function(e) {
                        Grid.stopDrag();
                    });
                }
            });
        },
        getCoords : function( ) {
            return {
                x: Grid.x.value,
                y: Grid.y.value
            };
        },
        setCoords : function(coords) {
            Grid.setCoords(coords.x, coords.y);
        },
        reset: function() {
            Grid.setCoords(Grid.x.initValue, Grid.y.initValue);
        }
    };

    $.fn.inputGrid = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.inputGrid' );
        }

    };
}));