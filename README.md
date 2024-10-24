Project saves the eth and polygon data from the blockchain at every 5 minutes 
check for the alerts if any alert set  for Chain  Polygon or for Etherum
can not set for any other chain other than Ethereum and Polygon.

also checks the 2 chains ethereum and polygon if there is 3% increase in price send notification to email
hyperhire_assignment@hyperhire.in




start the project with

Command : docker-compose up --build

it will start running the swagger url is

Swagger url : http://localhost:3000/api

cron runs on every 5th minute checks the alerts and stores the data into the database
for the initial start it will run the OnModuleInit for fetching first entries into db.
then will continue to run on every 5th minute
