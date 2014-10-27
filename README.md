# Cramond Island Causeway Crossing
A demo nodejs app to display safe times to cross Cramond Island causeway.

[http://cramond.herokuapp.com/](http://cramond.herokuapp.com/)

## What is this?
Between 2008-2013 where nearly 600 people were rescued from Cramond Island by Queensferry lifeboat at great cost to the RNLI. At the time of writing the only notice of safe crossing times is the small noticeboard at the causeway.

This is a proof of concept app that, in the absence of any open data, relies on scraped low tide predictions for the nearest port, Leith.  It therefore should not constitute your sole guide for planning a trip to Cramond Island. Always check the safe crossing times on the noticeboard at the causeway.

The frontend attemptes to solve the design problem of displaying a 24 hour period in an immediately intuitive interface.

## How does it work?
The safe times are based on the coastguard advise that it is onnly safe to cross the causeway for period of four hours, two hours either side of low tide. 

Low tide data from the nearest port (Leith) are scraped from http://www.thebeachguide.co.uk/south-scotland/lothian/cramond-weather.htm. The data is cleaned up, safe times and unsafe times calculated then presented into a vertical 24 hour clockface showing the time for the current day and the safe times for the next week.

## How does it work, exactly?
Causeway crossing data is stored as json in a file. The app reads the data file and checks it's last modified date. If the data file is older than the current day, the cramondTides module is run. It scrapes the beach guide website for the low tide data, cleans it up and writes it out to the json data file.

Once the data checking/scraping is complete the app compiles the data with a Jade template and starts a very basic http server to display the output.

## If you wish to run your own installation
Requires a node environment

1. Fork this repo
2. 'npm install' for all dependencies
3. push to heroku or to run locally 'node index.js'

If you want to edit the frontend, the cs and html are inlined in a jade template in /template. The source js files live in /src, runthe 'gulp js' task to concat and minify into the build (/js) dir.