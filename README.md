# budget-ng

## idea
kicked mint.com to the curb, then got antsy and started to re-write something basic for it (pure cli; https://github.com/cheenpo/budget)... then frowned at that and wrote this to be more boomsauce   >:)

currently only aimed at citibank transaction imports... but maybe I should add more types of impors and via the ux vs the cli and make this super spicy boomsauce   (shrugs)

to use (reference 'getting started' section below), you would initialize the db, ingest some transactions (slowly building your categorization rules in rules.yml), and then start the ux and enjoy.

you can start/stop the ux as needed and injest as needed... db is sqlite so things are tidy.


## getting started
### init db
node ./scripts/db_create.js
### ingest citibank export
node scripts/ingest.js /PATH/TO/ExportData.csv
### enjoy the ux
sudo npm start (sudo needed because of port 80)

## helpful
### test to make sure everything is ok
npm test


## TODO
- ingestion: ux

