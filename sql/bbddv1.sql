CREATE DATABASE IF NOT EXISTS project;
USE project;

CREATE TABLE IF NOT EXISTS users
(
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      user_login VARCHAR(50) NOT NULL UNIQUE,
      user_password VARCHAR(50) NOT NULL,
      nif VARCHAR(10) NOT NULL UNIQUE,
      email VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(50) NOT NULL,
      birthday DATE NOT NULL,
      tlf VARCHAR(50),
      address VARCHAR(50),
      avatar_img VARCHAR(50),
      role ENUM("normal", "admin") DEFAULT "normal" NOT NULL,
      active BOOLEAN DEFAULT false NOT NULL,
      registration_code VARCHAR(255),
      user_password_last_update datetime not null,
      create_user TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_user TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS travels
(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
locality VARCHAR(50) NOT NULL,
departure_date DATE NOT NULL,
arrival_date DATE NOT NULL,
category varchar(50) NOT NULL,
budget FLOAT DEFAULT 0,
id_user INT UNSIGNED NOT NULL REFERENCES users,
create_travel TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_travel TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages
(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
msg_text VARCHAR(255) NOT NULL,
id_user INT UNSIGNED REFERENCES users,
create_message TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_message TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rates
(
id INT UNSIGNED PRIMARY KEY NOT NULL,
rate_text VARCHAR(255) NOT NULL,
points INT NOT NULL,
id_user INT UNSIGNED REFERENCES users,
create_rate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_rate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_choose_travel
(
id_user INT UNSIGNED REFERENCES users,
id_travel INT UNSIGNED REFERENCES travels,
choose_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id_user, id_travel),
create_user_choose_travel TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_user_choose_travel TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

select * from users;
select * from messages;
select * from rates;
select * from travels;
select * from user_choose_travel;
select * from rates;
select * from follow;

select t.*, u.profile_name as profile_name from travels t
left join users u on
u.id = t.id_user where t.id = 1;

SELECT * FROM rates WHERE id_user_recive = 1;

select r.*, u.profile_name as profile_name from rates r
left join users u on
u.id = r.id_user_send where r.id_user_recive = 1;

select t.*, u.profile_name as profile_name ,u.avatar_img as avatar_img from travels t
left join users u on
u.id = t.id_user where t.id_user = 1;

      SELECT id, create_user, email, role, profile_name, biography, avatar_img, birthday, tlf, locality, user_login 
      FROM users WHERE id=1;
      
DROP TABLE travels;

SELECT AVG(points)
       AS rate_media
       FROM rates where id_user_recive = 1;
       
