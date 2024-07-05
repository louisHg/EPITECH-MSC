## SQL DB Creation

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(255),
    lname VARCHAR(255),
    gender VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(15)
);
```

Swagger access :
```shell
http://localhost:5000/apidocs
```

pip install Flask-JWT-Extended
Make requirement.txt
