# Nestique 🏡

An Airbnb-inspired full stack web application where users can discover, create, and review property listings — with interactive maps and cloud image uploads.

🔗 **Live Demo:** [nestique.onrender.com/listings](https://nestique.onrender.com/listings)

---

## Features

- 🔐 **User Authentication** — Secure signup, login and logout using Passport.js
- 🏠 **Listings** — Create, edit, and delete property listings with images
- ⭐ **Reviews** — Leave and delete reviews on any listing
- 🗺️ **Interactive Maps** — Location picker and map view powered by Maptiler
- ☁️ **Image Uploads** — Cloud-based image storage via Cloudinary
- 🛡️ **Authorization** — Only owners can edit or delete their own listings/reviews
- ✅ **Validation** — Server-side schema validation for all data

---

## Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- Passport.js (Authentication)

**Frontend**
- EJS (Templating)
- Bootstrap 5
- CSS

**Cloud & Services**
- Cloudinary (Image Storage)
- Maptiler (Maps)
- MongoDB Atlas (Database)
- Render (Deployment)

---

## Project Structure

```
Nestique/
├── controllers/      # Route logic (listings, reviews, users)
├── models/           # Mongoose schemas
├── routes/           # Express routers
├── views/            # EJS templates
├── public/           # Static assets (CSS, JS)
├── utils/            # Helper functions & error handling
├── middleware.js     # Custom middleware (auth, validation)
├── cloudConfig.js    # Cloudinary configuration
├── schema.js         # Joi validation schemas
└── app.js            # Express app entry point
```

---

## Getting Started Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Cloudinary account
- Maptiler account

### Installation

```bash
# Clone the repo
git clone https://github.com/rahulgoyal83789/Nestique.git
cd Nestique

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_maptiler_api_key
```

### Run the app

```bash
node app.js
```

Visit `http://localhost:8080/listings`

---

## Author

**Rahul Goyal** — [github.com/rahulgoyal83789](https://github.com/rahulgoyal83789)
