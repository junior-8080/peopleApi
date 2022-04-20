-- // create persons table
-- Migration SQL that makes the change goes here.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table persons (id uuid primary key,name varchar,email varchar not null,gender varchar(8),title varchar(6),msisdn varchar not null,country varchar,city varchar,occupation varchar,status varchar(2) default 'A',posted_ts timestamp default current_timestamp );

create unique index uniqe_person on persons(email,msisdn);
create index index_name on persons(name);
create index index_country on persons(country);
create index index_city on persons(city);
create index index_gender on persons(gender);
create index index_email on persons(email);
create index index_posted_ts on persons(gender);
create index index_status on persons(status);






-- //@UNDO
-- SQL to undo the change goes here.
drop table persons


