# Visit-Chrome Extension

## Overview
The Visit-Chrome Extension 
is responsible for tracking the URLs that users visit while browsing, check using a whitelist whether they are suspicous of being LLMs and send them to visit-service.
the visted urls are sent in batches to the backend service untill either 10 visits were collected or 1 minute has been passed since the first visit of that batch.

The extension is built using Manifest V3 for Chrome extensions

## Installation
1. Clone this repository.
2. Open Chrome and navigate to chrome://extensions/.
3. Enable developer mode.
4. Click 'Load unpacked'
5. Select the directory where the extension is located.
6. The extension should now appear in your browser's extensions bar.