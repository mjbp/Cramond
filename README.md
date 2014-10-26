# Cramond Island Causeway Crossing
A demo app to display safe times to cross Cramond Island causeway.

[http://cramond.herokuapp.com/](http://cramond.herokuapp.com/)


##What is this?
Between 2008-2013 where nearly 600 people were rescued from Cramond Island by Queensferry lifeboat at great cost to the RNLI. At the time of writing the only notice of safe cordsing times is the small noticeboard at the causeway.

This is a proof of concept app and therefore should not constitute your sole guide for planning a trip to Cramond Island. Crossing times are estimated based on the low tide times at the port of Leith. 

Always check the safe crossing times on the noticeboard at the causeway.



Tide data licensing...

All times in DST/BST???

***
Also check: http://www.ntslf.org/tides/tidepred?port=Leith

##How does it work
Based on the premise that it is safe to cross for period of four hours, two hours either side of low tide. 

Low tide data from the nearest port (Leith) are scraped from http://www.thebeachguide.co.uk/south-scotland/lothian/cramond-weather.htm. The data is cleaned up and processed into a vertical 24 hour clockface showing the time for he current day and the safe times for the next week.

*****
Move the site building into index.js
****





## If you wish to run your own installation
1. Fork this repo
2. npm install all dependencies
3. Run 'node build'

Frontend js production file in /src, gulp task to minify it and put it in /js for build

