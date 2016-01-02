# budget-ng

## idea
kicked mint.com to the curb, then got antsy and started to re-write something basic for it (pure cli)... then frowned at that and wrote this to be cleaner
currently only aimed at citibank transaction imports... but others would not be too big of a deal (shrugs)

## getting started
### init db
node ./scripts/db_create.js

## TODO
- ux: table of charges, with smart filters (date, macro/micro, hash)
- ux: ability to ignore charge
- ux: month view (macro/micro summations, warnings, etc...)
- ux: macro, micro, and/or warning should be smart filter/search in table of charges
(after ingesting multiple months)
- ux: graph over time (per category, net, etc...)

## maybe in the future
- ingestion: ux

