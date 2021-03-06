var style = {
    fillColor: 'white',
    fillOpacity: 1.0,
    weight: 0
};

function setColor(id) {
    style.fillColor = photos[id]["hexvalue"];
    document.body.style.background = style.fillColor;
    colorLayer.setStyle(style);
};

var photos;
var links = [];
var datelinks = {};
var sortable_datelinks = [];
var imglinks = [];

$(document).ready(function() {

    function getArray(){
        return $.getJSON("data/photodata/colordata.json");
    }

    getArray().done(function(json) {
        photos = json;

        var onclick = 'onclick="setColor(this.id);return false;">'

        $.each( json, function( key, val ) {
            val = val["datetime"].replace(/:/, "/").replace(/:/, "/");
            datelinks[key] = val;
            sortable_datelinks.push([key, datelinks[key]]);
        });

        dates_sorted = sortable_datelinks.sort(function(a,b) {return Date.parse(a[1]) - Date.parse(b[1])});

        // generate and place links for map page

        for (var i = 0; i < sortable_datelinks.length; i++) {
            links.push( "<li><a id='" + sortable_datelinks[i][0] + "' href='#' class='datelink'" + onclick + Date.parse(sortable_datelinks[i][1]).toString('M/d/yyyy h:mm tt') + "</a></li>" );
        }

        for (var i = 0; i < links.length; i++) {
            $(".photolist").append(links[i]);
        }

        // generate and place links for image page

        for (var i = 0; i < sortable_datelinks.length; i++) {
            imglinks.push( "<li><img src='./data/photodata/images/" + sortable_datelinks[i][0] + "' class='imglink' alt='" + sortable_datelinks[i][1] + "'</ img></li>" );
        }

        for (var i = 0; i < imglinks.length; i++) {
            $("#imglinks").append(imglinks[i]);
        }

        var $datelinks = $("a.datelink");

        function activateLink(linkIndex) {
            $datelinks.removeClass("active");
            $datelinks.eq(linkIndex).addClass("active");
            setColor($datelinks[linkIndex].id);
        }

        $('a.datelink').click(function(){
            activateLink($(this).parent().index());
            window.clearTimeout(4);
        });

        function rotate() {
            var index = 0;
            timeoutID = window.setInterval(function() {
                activateLink(index);
                index = (index + 1) % $datelinks.length; 
            }, 2000);
        }

        rotate();

    });

});
