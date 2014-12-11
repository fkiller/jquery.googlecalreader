Google Calendar feed reader - migrated version of jquery.googlecalreader-1.0.js

Google Calendar API v1, v2 are now shutdown from 11/17/2014(http://googleappsupdates.blogspot.com/2014/10/deprecated-google-calendar-apis-v1-v2.html), and jquery.googlecalreader-1.0.js doesn't support newer version of API, which is v3.

This plug-in is based on bradoyler/GoogleCalReader-jquery-plugin but has the same interface of jquery.googlecalreader-1.0.js.

Ask my twitter([@fkiller](https://twitter.com/fkiller)) if you have any questions.

#### [Demo](http://fkiller.github.io/jquery.googlecalreader/examples/index.html)

### Default Options
```js
{
    calendarId: 'en.usa#holiday@group.v.calendar.google.com',
    apiKey: 'API Key',
    dateFormat: 'LongDate',
    errorMsg: 'No events in calendar',
    maxEvents: 50,
    format: 'Title:{0}, Time:{1}, Where:{2}, Detail:{3}',
    sortDescending: true
}
```

### Example

```html
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="jquery.googlecalreader-1.1.js" type="text/javascript"></script>

<script type="text/javascript">
$(document).ready(function() {
  $.gCalReader({ calendarId:'your_calendar@group.v.calendar.google.com', apiKey:'your_public_api_key'});
});
</script>
<div id="gcal"></div>
```
