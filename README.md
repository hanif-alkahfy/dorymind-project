# 📚 Dory Mind



> Aplikasi pengingat jadwal kuliah dan deadline tugas yang terintegrasi langsung dengan WhatsApp.

---

## 🧱 Stack Teknologi

- **Frontend**: React + Vite, Tailwind CSS, React Router, Framer Motion
- **Backend**: Node.js (Express), Sequelize ORM
- **Database**: MySQL / MariaDB
- **Realtime & Bot**:
  - WhatsApp Bot menggunakan **wweb.js**
  - Socket.IO
- **Deployment**:
  - Frontend: **Vercel**
  - Backend: **VPS** (Ubuntu + PM2)
  - API ditunnel via **Cloudflare Tunnel**

---

## 📂 Struktur Proyek

### Frontend (`/frontend`)

```
/client
├── src
│   ├── pages/
│   ├── components/
│   └── main.jsx
└── .env
```

### Backend (`/backend`)

```
/server
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── whatsappBot/
├── config/
└── server.js
```

---

## 🧭 Flow Aplikasi

1. User register dan login
2. Input **Reminder** (isi detail tugas dan waktu)
3. Input **Jadwal Kuliah** (nama matkul, hari, jam)
4. Data disimpan ke DB berdasarkan `userId`
5. WhatsApp Bot membaca DB sesuai waktu yang ditentukan → kirim pesan ke WhatsApp user
6. User dapat memilih nomor WA: pakai nomor sendiri (custom) atau nomor default milik sistem

---

## 🧬 Arsitektur MVC

- **Model**: Sequelize models (`User`, `Reminder`, `Jadwal`, `Recipient`)
- **View**: React frontend
- **Controller**: Logic utama, validasi, filtering berdasarkan `userId`
- **Middleware**: JWT Auth Middleware, Error Handler
- **Utils**: Scheduler, fungsi kirim pesan WA

---

## 🧠 Struktur Database

### Tabel: `Users`

| Field    | Tipe Data |
| -------- | --------- |
| id (PK)  | INTEGER   |
| name     | STRING    |
| email    | STRING    |
| password | STRING    |

### Tabel: `Reminders`

| Field          | Tipe Data |
| -------------- | --------- |
| id (PK)        | INTEGER   |
| mataKuliah     | STRING    |
| tugas          | STRING    |
| deskripsi      | TEXT      |
| deadline       | DATETIME  |
| reminderTime   | DATETIME  |
| attachmentLink | STRING    |
| status         | ENUM      |
| userId (FK)    | INTEGER   |

### Tabel: `Jadwals`

| Field       | Tipe Data |
| ----------- | --------- |
| id (PK)     | INTEGER   |
| mataKuliah  | STRING    |
| hari        | STRING    |
| jam         | TIME      |
| userId (FK) | INTEGER   |

### Tabel: `Recipients`

| Field       | Tipe Data |
| ----------- | --------- |
| id (PK)     | INTEGER   |
| phoneNumber | STRING    |
| type        | ENUM      |
| userId (FK) | INTEGER   |

### Relasi:

- 1 User → banyak Reminder
- 1 User → banyak Jadwal
- 1 User → 1 Recipient

---

## 🔐 Autentikasi

- JWT Token disimpan di `localStorage`
- Header request:
  ```http
  Authorization: Bearer <token>
  ```
- Semua endpoint dibungkus middleware JWT

---

## 🔌 API Endpoint

### Auth

#### `POST /api/auth/register`

```json
{
  "name": "Hannif",
  "email": "hannif@mail.com",
  "password": "123456"
}
```

#### `POST /api/auth/login`

```json
{
  "email": "hannif@mail.com",
  "password": "123456"
}
```

### Reminder

#### `GET /api/reminders`

Header: `Authorization: Bearer <token>`

```json
{
  "mataKuliah": "Pancasila",
  "tugas": "Makalah",
  "deskripsi": "Tentang ideologi",
  "deadline": "2025-07-20T10:00",
  "reminderTime": "2025-07-19T09:00",
  "attachmentLink": "https://link.com/file.pdf"
}
```

#### `POST /api/reminders`

Header: `Authorization: Bearer <token>`

```json
{
  "mataKuliah": "Pancasila",
  "tugas": "Makalah",
  "deskripsi": "Tentang ideologi",
  "deadline": "2025-07-20T10:00",
  "reminderTime": "2025-07-19T09:00",
  "attachmentLink": "https://link.com/file.pdf"
}
```

#### `PUT /api/reminders/:id`

Header: `Authorization: Bearer <token>`

```json
{
  "mataKuliah": "Revisi Pancasila",
  "tugas": "Makalah",
  "deskripsi": "Tentang ideologi",
  "deadline": "2025-07-20T10:00",
  "reminderTime": "2025-07-19T09:00",
  "attachmentLink": "https://link.com/file.pdf"
}
```

#### `DELETE /api/reminders/:id`

Header: `Authorization: Bearer <token>`

### Jadwal

#### `GET /api/jadwals`

Header: `Authorization: Bearer <token>`

```json
{
  "mataKuliah": "Basis Data",
  "hari": "Senin",
  "jam": "09:00"
}
```

#### `POST /api/jadwals`

Header: `Authorization: Bearer <token>`

```json
{
  "mataKuliah": "Basis Data",
  "hari": "Senin",
  "jam": "09:00"
}
```

#### `PUT /api/jadwals/:id`

Header: `Authorization: Bearer <token>`

```json
{
  "mataKuliah": "Revisi Basis Data",
  "hari": "Senin",
  "jam": "09:00"
}
```

#### `DELETE /api/jadwals/:id`

Header: `Authorization: Bearer <token>`

### Recipient

#### `GET /api/recipients`

```json
{
  "phoneNumber": "628123456789",
  "type": "custom"
}
```

#### `POST /api/recipients`

```json
{
  "phoneNumber": "628123456789",
  "type": "custom"
}
```

---

## 🤖 WhatsApp Bot (wweb.js)

- Menggunakan `wweb.js`
- Multi-session (default & custom)
- Baca data dari DB
- Kirim pesan otomatis berdasarkan `reminderTime` atau `jam`
- Logika:
  - Jika user punya `Recipient` bertipe `custom`, gunakan itu
  - Jika tidak, fallback ke bot default

---

## 🧪 Pengembangan Lokal

- Jalankan frontend: `npm run dev`
- Jalankan backend: `pm2 start server.js`
- Gunakan Cloudflare Tunnel untuk expose backend ke publik

Contoh `.env`:

```
JWT_SECRET=xxx
DB_NAME=dorydb
DB_USER=root
DB_PASS=123456
```

---

## 🚀 Deployment

- **Frontend**: Vercel
- **Backend & Bot**: VPS (PM2)
- **API**: Ditunnel via Cloudflare

---
