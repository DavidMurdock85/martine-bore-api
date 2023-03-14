
/* Table for category information */

CREATE TABLE categories (
    id int NOT NULL AUTO_INCREMENT,
    title varchar(50) NOT NULL,
    route varchar(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (route)
);

/* Table for product information */

CREATE TABLE products (
    id int NOT NULL AUTO_INCREMENT,
    route varchar (200) NOT NULL,
    categoryId varchar(200) NOT NULL,
    title varchar(200),
    description varchar(500),
    details varchar(200),
    period varchar(200),
    date varchar(200),
    origin varchar(200),
    maker varchar(200),
    medium varchar(200),
    dimensions varchar(200),
    productCondition varchar(200),
    price varchar(200),
    PRIMARY KEY (id),
    UNIQUE (route)
);

/* Table for product images */

CREATE TABLE images (
    id int NOT NULL AUTO_INCREMENT,
    productId int NOT NULL,
    original varchar(200) NOT NULL,
    thumbnail varchar(200) NOT NULL,
    PRIMARY KEY (id)
);

/* Table for homepage image assets */

CREATE TABLE assets (
    id int NOT NULL AUTO_INCREMENT,
    original varchar(200) NOT NULL,
    thumbnail varchar(200) NOT NULL,
    PRIMARY KEY (id)
);

/* Table for user information */

CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(250) NOT NULL,
    passwordDigest varchar(250) NOT NULL,
    token varchar(250),
    PRIMARY KEY (id),
    UNIQUE(username)
);




