-- // create account_person
-- Migration SQL that makes the change goes here.
create table account_persons(account_id uuid not null , person_id uuid not null,posted_ts timestamp default current_timestamp);

create index index_persons_accountid on account_persons(account_id);
create index index_account_personid on account_persons(person_id);

-- //@UNDO
-- SQL to undo the change goes here.
drop table account_persons

