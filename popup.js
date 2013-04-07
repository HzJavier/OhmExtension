
var resistorApp =
{
    columns: new Array(),

    setColors: function()
    {
        var value = $('#ohm_inputText').val();
        var regexN = new RegExp('^[0-9]*$');
        var regexD = new RegExp('^[0-9]*.[0-9]$');
        var regexW = new RegExp('^[0-9]*[K,M]$','i');
        var regexWD = new RegExp('^[0-9]*.[0-9][K,M]$','i');
        var newValue = 0;

        if( regexN.test(value) )
        {
            newValue = value;
        }
        else if( regexD.test(value) )
        {
            newValue = value;
        }
        else if( regexW.test(value) )
        {
            var multiplier = value.charAt(value.length-1);
            value +='';
            value = value.split(multiplier)[0];

            if(multiplier === 'm' || multiplier === 'M')
            {
                value *= 1000000;    
            }
            else
            {
                value *= 1000;
            }
            
            newValue = value;
        }
        else if( regexWD.test(value) )
        {
            var multiplier = value.charAt(value.length-1);
            value +='';
            value = value.split(multiplier)[0];
            if(multiplier === 'm' || multiplier === 'M')
            {
                value *= 1000000;    
            }
            else
            {
                value *= 1000;
            }
            newValue = value;
        }
    
        if(newValue >= 10 && newValue <= 99000000)
        {
            var i=0;
            while(newValue >= 100)
            {
                newValue /= 10;
                i++;
            }

            var finalValue = parseInt(newValue/10);
            this.columns[0].setValue(finalValue);
            finalValue = parseInt((newValue%10)+1);
            this.columns[1].setValue(finalValue);
            finalValue = i+1;
            this.columns[2].setValue(finalValue);
            this.calculateResistance();
        }
    },

    calculateResistance: function()
    {
        var value = 0;
        
        if(this.columns[0] && this.columns[1] && this.columns[2])
        {
            value = (this.columns[0].retrieveValue()*10 + this.columns[1].retrieveValue()) * Math.pow(10, this.columns[2].retrieveValue());
            
            if(value===1)
            {
                value += ' Ohm';
            }
            else
            {
                value = this.formatValue(value);
            }
            $('#ohm_value').html(value);   
        }
    },

    calculateTolerance: function()
    {
        if(this.columns[3])
        {
            var value = this.columns[3].retrieveValue();
            if( value === 10)
            {
                 $('#ohm_color_3').addClass('ohm_toleranceHidden');
                 $('#ohm_bottomColor_3').css('margin-top','80px');
            }
            else
            {
                $('#ohm_color_3').removeClass('ohm_toleranceHidden');
                $('#ohm_bottomColor_3').css('margin-top','10px');   
            }

            switch(value)
            {
                case 10:
                    value = '&#177; 20%';
                break;

                case 11:
                    value = '&#177; 10%';
                break;

                case 12:
                    value = '&#177; 5%';
                break;
            }

            $('#ohm_tolerance').html(value);
        }
    },

    formatValue: function(value)
    {
        var formattedValue = value;
        if(formattedValue >= 1000000)
        {
            formattedValue /= 1000000;
            formattedValue += 'M';
        }
        else if(formattedValue >= 1000)
        {
            formattedValue /= 1000;
            formattedValue += 'K';
        }
        
        formattedValue += ' Ohms';

        return formattedValue;
    },

    initApp: function()
    {
        var that = this;
        var invalids = [ [0,10,11,12], [10,11,12], [7,8,9,10,11,12], [0,1,2,3,4,5,6,7,8,9] ];

        for(var i=0; i<4; i++)
        {
            if(i!==3)
            {
                this.columns[i] = new ResistorColorList(i, invalids[i], function(){ that.calculateResistance(); });
            }
            else
            {
                this.columns[i] = new ResistorColorList(i, invalids[i], function(){ that.calculateTolerance(); });
            }
            
            this.columns[i].initList('.ohm_colorList');
        }

        $('#ohm_inputText').change(function()
        {
            that.setColors();
        });
    }
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-39872541-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function ResistorColorList(id, invalids, callback)
{
    this.id = id;
    this.markup =   '<div class="ohm_scroller" id="ohm_scroller_'+id+'">'+
                        '<div id="ohm_topColor_'+id+'" class="ohm_topColor"></div>'+
                        '<div id="ohm_color_'+id+'" class="ohm_color"></div>'+
                        '<div id="ohm_bottomColor_'+id+'" class="ohm_bottomColor"></div>'+
                    '</div>';
    this.colors = 
    [
        {color:'#e1d7cb',   id:100},
        {color:'#000',      id:0},      // Black
        {color:'#493325',   id:1},      // Brown
        {color:'#bb0d30',   id:2},      // Red
        {color:'#ea8d0a',   id:3},      // Orange
        {color:'#fef350',   id:4},      // Yellow
        {color:'#7e923b',   id:5},      // Green
        {color:'#4cb8e6',   id:6},      // Blue 
        {color:'#a06b7f',   id:7},      // Violet
        {color:'#818181',   id:8},      // Gray
        {color:'#ffffff',   id:9},      // White
        {color:'#ffffff',   id:10},      // White
        {color:'#d1d2d6',   id:11},      // Silver
        {color:'#d7a12a',   id:12},      // Gold
        {color:'#e1d7cb',   id:200}
    ];
    this.selected = 1;
    this.callback = callback;

    this.retrieveValue = function()
    {
        return this.colors[this.selected].id;
    }

    this.setValue = function(value)
    {
        var that = this;
        
        if(this.selected < value)
        {
            while(this.selected < value)
            {
                this.changeColor(0);
            }
        }
        else
        {
            while(this.selected > value)
            {
                this.changeColor(1);
            }
        }
    }

    this.initList = function(container)
    {
        $(container).append(this.markup);
        this.addListeners();
        removeInvalids(invalids);
        this.changeColor(1);
    }

    this.changeColor = function(direction)      // Direction = 0 : up , = 1 : down
    {   
        var that = this;
        if(direction === 0) // Up
        {
            if(that.selected < that.colors.length-2)
            {
                that.selected ++;   
            }

            if(that.selected === that.colors.length-2)
            {
                $('#ohm_bottomColor_'+that.id).removeClass('ohm_bottomColor');
                $('#ohm_bottomColor_'+that.id).addClass('ohm_hidden');
            }
            else
            {
                $('#ohm_topColor_'+that.id).removeClass('ohm_hidden');
                $('#ohm_topColor_'+that.id).addClass('ohm_topColor');
                $('#ohm_color_'+that.id).css('margin-top','10px');
            }
        }
        else                // Down
        {
            if(that.selected-1 > 0)
            {
                that.selected --;   
            }

            if(that.selected == 1)
            {
                $('#ohm_topColor_'+that.id).removeClass('ohm_topColor');
                $('#ohm_topColor_'+that.id).addClass('ohm_hidden');
                $('#ohm_color_'+that.id).css('margin-top','40px');
            }
            else
            {
                $('#ohm_bottomColor_'+that.id).removeClass('ohm_hidden');
                $('#ohm_bottomColor_'+that.id).addClass('ohm_bottomColor');
            }
        }

        $('#ohm_topColor_'+that.id).css('background', '-webkit-gradient(linear, left bottom, left top, color-stop(0.05, '+ that.colors[that.selected-1].color +' ),color-stop(0.5, rgba(255,255,255,0.1)))');  
        $('#ohm_color_'+that.id).css('background-color', that.colors[that.selected].color);   
        $('#ohm_bottomColor_'+that.id).css('background', '-webkit-gradient(linear, left bottom, left top, color-stop(0.5, rgba(255,255,255,0.1)), color-stop(0.95, '+ that.colors[that.selected+1].color +' ))');

        if(typeof this.callback === 'function')
        {
            this.callback();
        }
    }

    this.addListeners = function()
    {
        var that = this;
        $('#ohm_topColor_'+that.id).click(function()
        {
            that.changeColor(1);
        });

        $('#ohm_bottomColor_'+that.id).click(function()
        {
            that.changeColor(0);
        });
    }

    var that = this;
    function removeInvalids(invalids)
    {
        for(var i=0; i<invalids.length; i++)
        {
            var j=0;
            while(that.colors[j].id !== invalids[i])
            {
                j++;
            }
            that.colors.splice(j,1);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () 
{
    resistorApp.initApp();
});