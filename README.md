start the project with
docker-compose up --build
it will start running the swagger url is
http://localhost:3000/api

cron runs on every 5th minute checks the alerts and stores the data into the database
for the initial start it will run the OnModuleInit for fetching first entries into db.
then will continue to run on every 5th minute
