# budget-ng

## idea
kicked mint.com to the curb, then got antsy and started to re-write something basic for it (pure cli)... then frowned at that and wrote this to be cleaner

currently only aimed at citibank transaction imports... but others would not be too big of a deal (shrugs)

to use (reference 'getting started' section below), you would initialize the db, ingest some transactions (slowly building your categorization rules in rules.yml), and then start the ux and enjoy.

you can start/stop the ux as needed and injest as needed... db is sqlite so things are tidy.


## getting started
### init db
node ./scripts/db_create.js
### ingest citibank export
node scripts/ingest.js /PATH/TO/ExportData.csv
### enjoy the ux
sudo npm start (sudo needed because of port 80)


## TODO
- ux: ability to ignore charge
- ux: month view (warnings)
(after ingesting multiple months)
- ux: graph over time (per category, net, etc...)

## maybe in the future
- ingestion: ux

