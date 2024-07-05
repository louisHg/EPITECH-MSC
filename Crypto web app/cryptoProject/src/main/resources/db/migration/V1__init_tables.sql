CREATE table Users
(
    uuid       uuid                not null
        constraint users_pkey primary key,
    first_name varchar(50)         not null,
    last_name  varchar(100)        not null,
    email      varchar(255) unique not null,
    password   varchar(255)        not null,
    username   varchar(255)        not null,
    role       varchar(50)         not null,
    created_at timestamp           not null,
    updated_at timestamp           not null,
    CONSTRAINT users_email_uk UNIQUE(email)
);

CREATE table Articles
(
    id   SERIAL
        constraint articles_pkey primary key,
    url  varchar(255) not null,
    name varchar(255) not null,
    CONSTRAINT articles_url_name_uk UNIQUE(url, name)
);

CREATE table Coins
(
    id   SERIAL
        constraint coins_pkey primary key,
    name varchar(255) not null,
    CONSTRAINT coins_name_uk UNIQUE(name)
);

CREATE table Preferences
(
    id         SERIAL
        constraint preferences_pkey primary key,
    user_id    uuid      not null
        constraint preferences_user_fkey references Users,
    article_id int
        constraint preferences_article_fkey references Articles,
    coin_id    int
        constraint preferences_coin_fkey references Coins,
    created_at timestamp not null,
    updated_at  timestamp not null
);
