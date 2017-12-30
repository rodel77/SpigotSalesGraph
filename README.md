# SpigotSellsViewer-ChromeExtension

[![chrome-version](https://img.shields.io/chrome-web-store/v/ipcabmoaiebegllbfjbljlpcedjehiaj.svg)](https://chrome.google.com/webstore/detail/spigot-sales-graph/ipcabmoaiebegllbfjbljlpcedjehiaj)
[![chrome-users](https://img.shields.io/chrome-web-store/users/ipcabmoaiebegllbfjbljlpcedjehiaj.svg)](https://chrome.google.com/webstore/detail/spigot-sales-graph/ipcabmoaiebegllbfjbljlpcedjehiaj)
[![chrome-rating](https://img.shields.io/chrome-web-store/rating/ipcabmoaiebegllbfjbljlpcedjehiaj.svg)](https://chrome.google.com/webstore/detail/spigot-sales-graph/ipcabmoaiebegllbfjbljlpcedjehiaj)

Spigot Sales or... sells that its a grammar error right? (I am not english native speaker... sorry)

Its a tool for Spigot Premium Resources management, you will get charts, average sales/money per day/month info, the total money gained and stuff

## Supported Browsers

+ Chrome 42? or major
+ Firefox 39? or major (Not yet in store)
+ Opera (Not in store but works same as chrome)


## Develop

You can also support in the development of Spigot Sales, since this is just a hobby i cannot spend to much time on it!

### Testing

#### Chrome

+ Go to `chrome://extensions/`
+ Enable `Developer mode`
+ And `Load unpacked extension...`
+ Now search the folder on the project that contains the `manifest.json` file
+ Now you should see the dashboard when entering to any of your resources buyers page
+ You can reload the extension by pressing `Ctrl+R`

#### Firefox

+ Go to `about:debugging#addons`
+ `Load temporal addon`
+ Select the `manifest.json` file
+ Now you can reload the extension on the `Reload` link

### Building

Building its not needed to make changes, you can always just reload the scripts from the browser, but in case you need it you can zip all files or let the script do it self, you will need Python 3.x to run build.py, it will put all the files in a zip and name it with the version in the manifest.json

### Portal

+ [manifest.json](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/develop/manifest.json) Version/Icons/Scripts
+ [/common/](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/develop/common) Helpers used in multiple cases (money.js, helper.js)
+ [/libs/](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/develop/libs) External libraries (highcharts.js, exporting.js (Part of highcharts))
+ [/resource/](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/develop/resource) Stuff used in resource buyers page (buyers.js, dashboard.js)
+ [/author/](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/develop/author) Extract buyers from all your resources, used to display it in https://www.spigotmc.org/resources/authors/YOUR-SPIGOT-ID/

## Misc links

+ Spigot thread: https://www.spigotmc.org/resources/37425/
+ Download page http://spigot.rodel.com.mx/
+ Download in ChromeStore https://chrome.google.com/webstore/detail/spigot-sales-graph/ipcabmoaiebegllbfjbljlpcedjehiaj
+ Report issue on the [issue tracker](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/issues)
