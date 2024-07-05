INSERT INTO users (uuid, email, first_name, last_name, username, role, password, created_at, updated_at) VALUES ('198d7b11-ec01-4a29-9721-8251881aa35a', 'toto@epitech.eu', 'toto', 'tutu', 'totu', 'ADMIN', '$2a$10$bvuFOqKwvzCU9hy8z09IXeZ927fB6GDC5tBn9HOzHNQRH0KSshbHy', '2023-01-04 01:38:59.559424', '2023-01-04 01:38:59.559424');
INSERT INTO users (uuid, email, first_name, last_name, username, role, password, created_at, updated_at) VALUES ('198d7b11-ec01-4a29-9721-8251881aa35b', 'user@epitech.eu', 'firstName', 'lastName', 'username', 'USER', '$2a$10$bvuFOqKwvzCU9hy8z09IXeZ927fB6GDC5tBn9HOzHNQRH0KSshbHy', '2023-01-04 01:38:59.559424', '2023-01-04 01:38:59.559424');

INSERT INTO coins (id, name) VALUES (1, 'BTC');
INSERT INTO coins (id, name) VALUES (2, 'ETH');

INSERT INTO preferences (article_id, coin_id, created_at, updated_at, user_id) VALUES (1, 2, '2023-01-04 01:38:59.559424', '2023-01-04 01:38:59.559424', '198d7b11-ec01-4a29-9721-8251881aa35a');
INSERT INTO preferences (article_id, coin_id, created_at, updated_at, user_id) VALUES (2, 1, '2023-01-04 01:38:59.559424', '2023-01-04 01:38:59.559424', '198d7b11-ec01-4a29-9721-8251881aa35b');
