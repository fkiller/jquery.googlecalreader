/*
* Google Calendar feed reader - migrated version of jquery.googlecalreader-1.0.js
* 
* Google Calendar API v1, v2 are now shutdown from 11/17/2014
* (http://googleappsupdates.blogspot.com/2014/10/deprecated-google-calendar-apis-v1-v2.html),
* and jquery.googlecalreader-1.0.js doesn't support newer version of API, which is v3.
* This plug-in is based on bradoyler/GoogleCalReader-jquery-plugin but has the same interface of jquery.googlecalreader-1.0.js.
*
* Modified by Won Dong (@fkiller)
* @version 1.1
*/
String.format = function (text) {
    //check if there are two arguments in the arguments list
    if (arguments.length <= 1) {
        //if there are not 2 or more arguments there's nothing to replace
        //just return the original text
        return text;
    }
    //decrement to move to the second argument in the array
    var tokenCount = arguments.length - 2;
    for (var token = 0; token <= tokenCount; token++) {
        //iterate through the tokens and replace their placeholders from the original text in order
        text = text.replace(new RegExp("\\{" + token + "\\}", "gi"), arguments[token + 1].replace(/\n/g, '<br />'));
    }
    return text;
};

function formatDate(strDate, strFormat) {
    var fd, arrDate, am, time;
    var calendar = {
        months: {
            full: ['', 'January', 'February', 'March', 'April', 'May',
              'June', 'July', 'August', 'September', 'October',
              'November', 'December'
            ],
            short: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
              'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ]
        },
        days: {
            full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
              'Friday', 'Saturday', 'Sunday'
            ],
            short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
              'Sun'
            ]
        }
    };

    if (strDate.length > 10) {
        arrDate = /(\d+)\-(\d+)\-(\d+)T(\d+)\:(\d+)/.exec(strDate);

        am = (arrDate[4] < 12);
        time = am ? (parseInt(arrDate[4]) + ':' + arrDate[5] + ' AM') : (
          arrDate[4] - 12 + ':' + arrDate[5] + ' PM');

        if (time.indexOf('0') === 0) {
            if (time.indexOf(':00') === 1) {
                if (time.indexOf('AM') === 5) {
                    time = 'MIDNIGHT';
                } else {
                    time = 'NOON';
                }
            } else {
                time = time.replace('0:', '12:');
            }
        }

    } else {
        arrDate = /(\d+)\-(\d+)\-(\d+)/.exec(strDate);
        time = '00:00 AM';
    }

    var year = parseInt(arrDate[1]);
    var month = parseInt(arrDate[2]);
    var dayNum = parseInt(arrDate[3]);

    var d = new Date(year, month - 1, dayNum);

    switch (strFormat) {
        case 'ShortTime':
            fd = time;
            break;
        case 'ShortDate':
            fd = month + '/' + dayNum + '/' + year;
            break;
        case 'LongDate':
            fd = calendar.days.full[d.getDay()] + ' ' + calendar.months.full[
              month] + ' ' + dayNum + ', ' + year;
            break;
        case 'LongDate+ShortTime':
            fd = calendar.days.full[d.getDay()] + ' ' + calendar.months.full[
              month] + ' ' + dayNum + ', ' + year + ' ' + time;
            break;
        case 'ShortDate+ShortTime':
            fd = month + '/' + dayNum + '/' + year + ' ' + time;
            break;
        case 'DayMonth':
            fd = calendar.days.short[d.getDay()] + ', ' + calendar.months.full[
              month] + ' ' + dayNum;
            break;
        case 'MonthDay':
            fd = calendar.months.full[month] + ' ' + dayNum;
            break;
        case 'YearMonth':
            fd = calendar.months.full[month] + ' ' + year;
            break;
        default:
            fd = calendar.days.full[d.getDay()] + ' ' + calendar.months.short[
              month] + ' ' + dayNum + ', ' + year + ' ' + time;
    }

    return fd;
}

(function ($) {

    //Add gcal element
    $(document).ready(function () {
        $('#gcal').html('Loading...');
    });

    $.gCalReader = function (inputs) {
        var addendum = {};

        // Legacy detection for feedUri, which is v1 URL.
        if (inputs.feedUri) {
            addendum.calendarId = decodeURIComponent(inputs.feedUri.split('/')[5]);
        }

        if (inputs.maxresults) {
            addendum.maxEvents = inputs.maxresults;
        }

        if (inputs.displayCount) {
            // Not implemented
        }

        var options = $.extend({
            calendarId: 'en.usa#holiday@group.v.calendar.google.com',
            apiKey: 'AIzaSyAVhU0GdCZQidylxz7whIln82rWtZ4cIDQ',
            dateFormat: 'LongDate',
            errorMsg: 'No events in calendar',
            maxEvents: 50,
            format: 'Title:{0}, Time:{1}, Where:{2}, Detail:{3}',
            sortDescending: true
        }, inputs, addendum);

        var s = '';
        var feedUrl = 'https://www.googleapis.com/calendar/v3/calendars/' +
          encodeURIComponent(options.calendarId.trim()) + '/events?key=' + options.apiKey +
          '&orderBy=startTime&singleEvents=true';

        $.ajax({
            type: 'GET',
            url: feedUrl,
            dataType: 'jsonp',
            crossDomain: true,
            success: function (data) {
                $('#gcal').html('');
                if (options.displayCount) {
                    $('#gcal').html(data.items.length + ' upcoming events');
                }
                $('#gcal').append('<ul id="eventlist"></ul>');

                if (options.sortDescending) {
                    data.items = data.items.reverse();
                }
                data.items = data.items.slice(0, options.maxEvents);

                // To list events under the same date
                var previousDate = null;

                $.each(data.items, function (e, item) {
                    var eventdate = item.start.dateTime || item.start.date || '';
                    var summary = item.summary || '';
                    var description = item.description || '';
                    var location = item.location || '';
                    var time = formatDate(eventdate, "ShortTime");
                    var eventhtml = String.format(options.format, summary, time, location, description);
                    var formattedDate = formatDate(eventdate, options.dateFormat.trim());
                    var url = options.linkUri || item.htmlLink || '';

                    if (previousDate != formattedDate) {
                        $('#eventlist').append('<li class="main_cal_date"><a href="' + url + '" target="_blank">' + formattedDate + '</a></li>');
                        previousDate = formattedDate;
                    }

                    $('#eventlist').append('<li class="main_cal_event"><a href="' + url + '" target="_blank">' + eventhtml + '</a></li>');
                });

                if (jQuery.isFunction(options.onFinish)) {
                    options.onFinish();
                }
            },
            error: function (error) {
                $('#gcal').html('<pre>' + error + '</pre>');
            }
        });
    };

})(jQuery);
