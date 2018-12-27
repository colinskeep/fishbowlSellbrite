##### Prerequisites
MySQL
NodeJS
Windows Build Tools

##### Installation
Log in to MySQL to configure tables
`mysql -u root -p`
`use mysql;`
`create table legend (asin varchar(255), fbsku varchar(255), sbsku varchar(255), isfba varchar(255), iskit varchar(255), channelname varchar(255), quantity varchar(255));`
`load data infile 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/legend2.csv' INTO TABLE legend FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;`

`npm install`

`node app.js`
