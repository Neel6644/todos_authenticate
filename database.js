CREATE DATABSAE todos_authenticate;

CREATE TABLE users(
    user_id uuid DEFAULT gen_random_uuid (),
    user_name varchar(255) not null,
    user_email varchar(255) not null,
    user_password varchar(255) not null,
    primary key (user_id)
);

INSERT INTO users (user_name,user_email,user_password) VALUES ('Neel','neel6644@gmail.com','Neel');

CREATE TABLE todos(
    todo_id serial primary key,
    user_id uuid,
    description varchar not null,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
