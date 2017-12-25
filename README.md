# SpigotSellsViewer-ChromeExtension

[![chrome-version](https://img.shields.io/chrome-web-store/v/ipcabmoaiebegllbfjbljlpcedjehiaj.svg)](https://chrome.google.com/webstore/detail/spigot-sales-graph/ipcabmoaiebegllbfjbljlpcedjehiaj)
[![chrome-users](https://img.shields.io/chrome-web-store/users/ipcabmoaiebegllbfjbljlpcedjehiaj.svg)](https://chrome.google.com/webstore/detail/spigot-sales-graph/ipcabmoaiebegllbfjbljlpcedjehiaj)
[![chrome-rating](https://img.shields.io/chrome-web-store/rating/ipcabmoaiebegllbfjbljlpcedjehiaj.svg)](https://chrome.google.com/webstore/detail/spigot-sales-graph/ipcabmoaiebegllbfjbljlpcedjehiaj)

Spigot Sales or... sells that its a grammar error right? (I am not english native speaker... sorry)

Its a tool for Spigot Premium Resources management, you will get charts, average sales/money per day/month info, the total money gained and stuff

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

I don't rememeber how to do it, i make the support a lot of time, if somebody find the way to install in-development extensions please feel free to fill this section

### Portal

+ [manifest.json](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/master/manifest.json) Version/Icons/Scripts
+ [helper.js](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/master/helper.js) Helper class
+ [money.js](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/master/money.js) Exchange utilities (Data extracted from https://api.fixer.io/latest?base=USD)
+ [buyers.js](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/master/buyers.js) Used to extract buyers from the spigot resource buyers page
+ [dashboard.js](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/master/dashboard.js) Displays the dashboard in the spigot resource buyers page
+ [author.js](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/master/author.js) Extract buyers from all your resources, used to display it in https://www.spigotmc.org/resources/authors/YOUR-SPIGOT-ID/
+ HighCharts stuff (Better don't see this files, they can cause eye bleeding)
    + [highcharts.js](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/master/highcharts.js)
    + [exporting.js](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/blob/master/exporting.js)

## Misc links

+ Spigot thread: https://www.spigotmc.org/resources/37425/
+ Download page http://spigot.rodel.com.mx/
+ Download in ChromeStore https://chrome.google.com/webstore/detail/spigot-sales-graph/ipcabmoaiebegllbfjbljlpcedjehiaj
+ Report issue on the [issue tracker](https://github.com/rodel77/SpigotSellsViewer-ChromeExtension/issues)
