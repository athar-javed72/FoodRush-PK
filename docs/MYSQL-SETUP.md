# MySQL Setup – Step by Step

Is project ke backend ke liye **MySQL** aur **Redis** dono chahiye. Ye guide local, Docker, aur optional cloud options batati hai.

---

## Option 1: Docker se (sabse aasaan)

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) install karo.
2. Project root par:

```bash
docker-compose up -d mysql redis
```

3. `.env` mein (optional – default already set):

```env
DATABASE_URL=mysql://root:password@localhost:3306/foodie
REDIS_URL=redis://localhost:6379
```

4. Phir:

```bash
npm install
npm run dev
```

MySQL `localhost:3306` par chal raha hoga; database name `foodie` automatically banta hai.

---

## Option 2: MySQL local install

### Windows

- [MySQL Installer](https://dev.mysql.com/downloads/installer/) se install karo, ya **XAMPP** / **WAMP** use karo (unme MySQL aata hai).
- Install ke baad MySQL service start karo (Services app se ya XAMPP Control Panel se).
- Root password set karo (installer mein ya baad mein).

### Mac

```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### Database banao

MySQL mein login karo aur `foodie` database banao:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE foodie;
EXIT;
```

### .env set karo

Project root par `.env` file mein:

```env
DATABASE_URL=mysql://root:YOUR_PASSWORD@localhost:3306/foodie
REDIS_URL=redis://localhost:6379
```

`YOUR_PASSWORD` ki jagah apna MySQL root password daalo.

### Redis

Redis bhi chahiye. Options:

- **Docker:** `docker run -d -p 6379:6379 --name redis redis:7-alpine`
- **Local:** [Redis download](https://redis.io/download) – install karke `redis-server` chalao.
- **Cloud:** [Upstash](https://upstash.com) – free Redis, connection URL `.env` mein `REDIS_URL` daalo.

---

## Option 3: MySQL cloud (bina local install)

Agar MySQL local install nahi karna, to cloud provider use kar sakte ho:

- **[PlanetScale](https://planetscale.com)** – MySQL-compatible, free tier
- **[Railway](https://railway.app)** – MySQL add-on
- **[AWS RDS](https://aws.amazon.com/rds/mysql/)** – managed MySQL

Unme se kisi par database banao, connection string copy karo. Format usually:

```text
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

`.env` mein:

```env
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/foodie
REDIS_URL=redis://localhost:6379
```

**Redis** ke liye bina Docker: [Upstash](https://upstash.com) use karo aur `REDIS_URL` daalo.

Phir `npm run dev` se project chalao.

---

## Summary

| Step | Kya kiya |
|------|----------|
| 1 | MySQL chala (Docker / local / cloud) |
| 2 | Database `foodie` banao (Docker mein auto; local/cloud par manually) |
| 3 | `.env` mein `DATABASE_URL` aur `REDIS_URL` set kiya |
| 4 | Redis chala (Docker / local / Upstash) |
| 5 | `npm run dev` se project run kiya |

MySQL check karne ke liye: **MySQL Workbench**, **DBeaver**, ya command line: `mysql -u root -p` → `USE foodie;` → `SHOW TABLES;`
