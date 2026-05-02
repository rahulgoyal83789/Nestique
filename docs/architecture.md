# Nestique - Architecture & Flow Diagrams

> **Auto-generated diagrams for your Nestique project**
> Based on analysis of: https://github.com/rahulgoyal83789/Nestique

---

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [User Authentication Flow](#user-authentication-flow)
3. [Listing CRUD Operations](#listing-crud-operations)
4. [Image Upload Flow](#image-upload-flow)
5. [Review System Flow](#review-system-flow)
6. [Complete Request Lifecycle](#complete-request-lifecycle)
7. [Database Schema](#database-schema)
8. [Folder Structure](#folder-structure)

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end
    
    subgraph Frontend["Frontend - EJS Templates"]
        Views[Views/EJS Templates]
        CSS[CSS Stylesheets]
        JS[Client-side JavaScript]
    end
    
    subgraph Backend["Backend - Node.js/Express"]
        App[app.js - Main Server]
        Routes[Routes Layer]
        Controllers[Controllers Layer]
        Middleware[Middleware Layer]
        Utils[Utils/Helpers]
    end
    
    subgraph Data["Data Layer"]
        Models[Mongoose Models]
        MongoDB[(MongoDB Database)]
        Cloudinary[Cloudinary - Image Storage]
    end
    
    Browser --> Views
    Mobile --> Views
    Views --> Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Models
    Controllers --> Utils
    Models --> MongoDB
    Controllers --> Cloudinary
    
    style Backend fill:#e1f5ff
    style Data fill:#fff4e1
    style Frontend fill:#f0f0f0
```

---

## 🔐 User Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Routes as Express Routes
    participant AuthController as Auth Controller
    participant Middleware as Auth Middleware
    participant UserModel as User Model
    participant DB as MongoDB
    participant Session as Express Session
    
    Note over User,Session: User Registration Flow
    User->>Browser: Fill signup form
    Browser->>Routes: POST /signup
    Routes->>AuthController: handleSignup()
    AuthController->>UserModel: validate & hash password
    UserModel->>DB: save new user
    DB-->>UserModel: user created
    UserModel-->>AuthController: user object
    AuthController->>Session: create session
    AuthController-->>Browser: redirect to /listings
    Browser-->>User: Show listings page
    
    Note over User,Session: User Login Flow
    User->>Browser: Enter credentials
    Browser->>Routes: POST /login
    Routes->>AuthController: handleLogin()
    AuthController->>UserModel: findUser & verify password
    UserModel->>DB: query user
    DB-->>UserModel: user data
    UserModel-->>AuthController: authenticated user
    AuthController->>Session: create session
    AuthController-->>Browser: redirect to /listings
    Browser-->>User: Show listings page
    
    Note over User,Session: Protected Route Access
    User->>Browser: Access protected page
    Browser->>Routes: GET /listings/new
    Routes->>Middleware: isLoggedIn check
    Middleware->>Session: verify session
    alt User authenticated
        Session-->>Middleware: valid session
        Middleware->>Routes: proceed
        Routes-->>Browser: render page
    else Not authenticated
        Session-->>Middleware: no session
        Middleware-->>Browser: redirect to /login
    end
```

---

## 🏠 Listing CRUD Operations

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Routes
    participant ListingController as Listing Controller
    participant ValidationMiddleware as Validation Middleware
    participant ListingModel as Listing Model
    participant DB as MongoDB
    participant Cloudinary
    
    Note over User,Cloudinary: CREATE - New Listing
    User->>Browser: Fill listing form & upload images
    Browser->>Routes: POST /listings
    Routes->>ValidationMiddleware: validate listing schema
    ValidationMiddleware->>ListingController: createListing()
    ListingController->>Cloudinary: upload images
    Cloudinary-->>ListingController: image URLs
    ListingController->>ListingModel: create listing with image URLs
    ListingModel->>DB: save listing
    DB-->>ListingModel: saved listing
    ListingModel-->>ListingController: listing object
    ListingController-->>Browser: redirect to /listings/:id
    Browser-->>User: Show new listing
    
    Note over User,Cloudinary: READ - View Listings
    User->>Browser: Navigate to listings
    Browser->>Routes: GET /listings
    Routes->>ListingController: getAllListings()
    ListingController->>ListingModel: find all listings
    ListingModel->>DB: query listings
    DB-->>ListingModel: listings array
    ListingModel-->>ListingController: listings data
    ListingController-->>Browser: render listings page
    Browser-->>User: Display listings
    
    Note over User,Cloudinary: UPDATE - Edit Listing
    User->>Browser: Edit listing form
    Browser->>Routes: PUT /listings/:id
    Routes->>ValidationMiddleware: validate updates
    ValidationMiddleware->>ListingController: updateListing()
    ListingController->>Cloudinary: upload new images (if any)
    Cloudinary-->>ListingController: new image URLs
    ListingController->>ListingModel: update listing
    ListingModel->>DB: update document
    DB-->>ListingModel: updated listing
    ListingModel-->>ListingController: listing object
    ListingController-->>Browser: redirect to /listings/:id
    
    Note over User,Cloudinary: DELETE - Remove Listing
    User->>Browser: Click delete button
    Browser->>Routes: DELETE /listings/:id
    Routes->>ListingController: deleteListing()
    ListingController->>ListingModel: find and delete
    ListingModel->>DB: remove document
    ListingController->>Cloudinary: delete associated images
    Cloudinary-->>ListingController: images deleted
    DB-->>ListingModel: deletion confirmed
    ListingModel-->>ListingController: success
    ListingController-->>Browser: redirect to /listings
```

---

## 📸 Image Upload Flow (Cloudinary Integration)

```mermaid
graph TD
    A[User selects images] --> B[Browser prepares FormData]
    B --> C[POST request to server]
    C --> D{Multer Middleware}
    D --> E[File validation - size, type]
    
    E -->|Valid| F[Temporary storage in memory]
    E -->|Invalid| G[Return error to user]
    
    F --> H[Controller receives file buffer]
    H --> I[Upload to Cloudinary API]
    
    I --> J{Cloudinary Response}
    J -->|Success| K[Receive secure_url & public_id]
    J -->|Error| L[Handle upload error]
    
    K --> M[Store URLs in database]
    M --> N[Return success response]
    
    L --> O[Cleanup temp files]
    G --> O
    O --> P[Send error to client]
    
    N --> Q[Display image on page]
    
    style I fill:#ffd700
    style M fill:#90EE90
    style P fill:#FFB6C1
```

**Detailed Cloudinary Flow:**

```mermaid
sequenceDiagram
    participant User
    participant Multer as Multer Middleware
    participant Controller
    participant Cloudinary as Cloudinary API
    participant DB as MongoDB
    
    User->>Multer: Upload image file
    Multer->>Multer: Validate file (size, type)
    
    alt File valid
        Multer->>Controller: Pass file buffer
        Controller->>Cloudinary: cloudinary.uploader.upload()
        
        Note over Cloudinary: Process & store image
        Cloudinary->>Cloudinary: Optimize image
        Cloudinary->>Cloudinary: Generate secure URL
        
        Cloudinary-->>Controller: {url, public_id, format}
        Controller->>DB: Save image metadata
        DB-->>Controller: Confirmation
        Controller-->>User: Success + image URL
        
    else File invalid
        Multer-->>User: Error: Invalid file type/size
    end
    
    Note over User,DB: Image Deletion Flow
    User->>Controller: Request delete image
    Controller->>DB: Get image public_id
    DB-->>Controller: public_id
    Controller->>Cloudinary: cloudinary.uploader.destroy(public_id)
    Cloudinary-->>Controller: Deletion confirmed
    Controller->>DB: Remove image record
    Controller-->>User: Image deleted
```

---

## ⭐ Review System Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Routes
    participant ReviewController as Review Controller
    participant ListingModel as Listing Model
    participant ReviewModel as Review Model
    participant DB as MongoDB
    
    Note over User,DB: Create Review
    User->>Browser: Fill review form (rating + comment)
    Browser->>Routes: POST /listings/:id/reviews
    Routes->>ReviewController: createReview()
    ReviewController->>ReviewModel: create review object
    ReviewModel->>DB: save review
    DB-->>ReviewModel: review saved
    ReviewModel-->>ReviewController: review object
    ReviewController->>ListingModel: push review to listing
    ListingModel->>DB: update listing.reviews[]
    DB-->>ListingModel: updated
    ListingModel-->>ReviewController: success
    ReviewController-->>Browser: redirect to /listings/:id
    Browser-->>User: Show updated listing with review
    
    Note over User,DB: Delete Review
    User->>Browser: Click delete review
    Browser->>Routes: DELETE /listings/:id/reviews/:reviewId
    Routes->>ReviewController: deleteReview()
    ReviewController->>ReviewModel: findByIdAndDelete
    ReviewModel->>DB: remove review
    DB-->>ReviewModel: deleted
    ReviewController->>ListingModel: pull review from listing
    ListingModel->>DB: update listing.reviews[]
    DB-->>ListingModel: updated
    ReviewController-->>Browser: redirect to /listings/:id
```

---

## 🔄 Complete Request Lifecycle

```mermaid
graph TB
    Start([User Action]) --> Request[HTTP Request]
    
    Request --> App[app.js - Express App]
    App --> Session[Session Middleware]
    Session --> MethodOverride[Method Override Middleware]
    MethodOverride --> Static[Static Files Middleware]
    Static --> BodyParser[Body Parser Middleware]
    
    BodyParser --> Router{Route Matching}
    
    Router -->|/listings| ListingRoutes[Listing Routes]
    Router -->|/listings/:id/reviews| ReviewRoutes[Review Routes]
    Router -->|/signup /login| AuthRoutes[Auth Routes]
    Router -->|Not Found| NotFound404[404 Handler]
    
    ListingRoutes --> AuthCheck{Authentication Check}
    ReviewRoutes --> AuthCheck
    
    AuthCheck -->|Authenticated| ValidationMiddleware[Schema Validation]
    AuthCheck -->|Not Authenticated| Redirect[Redirect to /login]
    
    ValidationMiddleware -->|Valid| Controller[Controller Function]
    ValidationMiddleware -->|Invalid| ErrorHandler[Error Handler]
    
    Controller --> Model[Mongoose Model]
    Model --> MongoDB[(MongoDB)]
    MongoDB --> Model
    Model --> Controller
    
    Controller --> CloudinaryAPI{Cloudinary API?}
    CloudinaryAPI -->|Yes| Cloudinary[Upload/Delete Images]
    Cloudinary --> Controller
    CloudinaryAPI -->|No| ResponsePrep
    
    Controller --> ResponsePrep[Prepare Response]
    ResponsePrep --> RenderEngine{Response Type}
    
    RenderEngine -->|Render| EJS[EJS Template Engine]
    RenderEngine -->|Redirect| RedirectResponse[HTTP Redirect]
    RenderEngine -->|JSON| JSONResponse[JSON Response]
    
    EJS --> Response([HTTP Response])
    RedirectResponse --> Response
    JSONResponse --> Response
    ErrorHandler --> Response
    NotFound404 --> Response
    Redirect --> Response
    
    Response --> End([Browser Renders])
    
    style Controller fill:#4CAF50
    style MongoDB fill:#00C853
    style Cloudinary fill:#FFD700
    style ErrorHandler fill:#F44336
```

---

## 🗄️ Database Schema (Mongoose Models)

```mermaid
erDiagram
    USER ||--o{ LISTING : creates
    USER ||--o{ REVIEW : writes
    LISTING ||--o{ REVIEW : has
    LISTING ||--o{ IMAGE : contains
    
    USER {
        ObjectId _id PK
        string username UK
        string email UK
        string password
        date createdAt
        date updatedAt
    }
    
    LISTING {
        ObjectId _id PK
        string title
        string description
        number price
        string location
        string country
        ObjectId owner FK
        array reviews
        array images
        object geometry
        date createdAt
        date updatedAt
    }
    
    REVIEW {
        ObjectId _id PK
        number rating
        string comment
        ObjectId author FK
        ObjectId listing FK
        date createdAt
    }
    
    IMAGE {
        string url
        string filename
        string public_id
    }
```

---

## 📁 Folder Structure Diagram

```mermaid
graph TB
    Root[Nestique/] --> App[app.js]
    Root --> Package[package.json]
    Root --> Cloud[cloudConfig.js]
    Root --> MW[middleware.js]
    Root --> Schema[schema.js]
    
    Root --> Controllers[controllers/]
    Controllers --> ListingCtrl[listing.js]
    Controllers --> ReviewCtrl[review.js]
    Controllers --> UserCtrl[user.js]
    
    Root --> Models[models/]
    Models --> ListingModel[listing.js]
    Models --> ReviewModel[review.js]
    Models --> UserModel[user.js]
    
    Root --> Routes[routes/]
    Routes --> ListingRoutes[listing.js]
    Routes --> ReviewRoutes[review.js]
    Routes --> UserRoutes[user.js]
    
    Root --> Views[views/]
    Views --> Layouts[layouts/]
    Views --> Listings[listings/]
    Views --> Users[users/]
    Views --> Includes[includes/]
    
    Root --> Public[public/]
    Public --> CSS[css/]
    Public --> JS[js/]
    Public --> Images[images/]
    
    Root --> Utils[utils/]
    Utils --> ExpressErr[ExpressError.js]
    Utils --> WrapAsync[wrapAsync.js]
    
    Root --> Init[init/]
    Init --> Data[data.js]
    Init --> Index[index.js]
    
    style App fill:#4CAF50
    style Controllers fill:#2196F3
    style Models fill:#FF9800
    style Routes fill:#9C27B0
    style Views fill:#00BCD4
```

---

## 🔗 API Endpoints & Route Mapping

```mermaid
graph LR
    subgraph "Listing Routes - /listings"
        L1[GET /] --> ShowAll[Show All Listings]
        L2[GET /new] --> ShowForm[New Listing Form]
        L3[POST /] --> Create[Create Listing]
        L4[GET /:id] --> ShowOne[Show Single Listing]
        L5[GET /:id/edit] --> EditForm[Edit Form]
        L6[PUT /:id] --> Update[Update Listing]
        L7[DELETE /:id] --> Delete[Delete Listing]
    end
    
    subgraph "Review Routes - /listings/:id/reviews"
        R1[POST /] --> CreateReview[Create Review]
        R2[DELETE /:reviewId] --> DeleteReview[Delete Review]
    end
    
    subgraph "User Routes - /"
        U1[GET /signup] --> SignupForm[Signup Form]
        U2[POST /signup] --> Register[Register User]
        U3[GET /login] --> LoginForm[Login Form]
        U4[POST /login] --> Login[Login User]
        U5[GET /logout] --> Logout[Logout User]
    end
    
    style ShowAll fill:#90EE90
    style Create fill:#FFD700
    style Update fill:#87CEEB
    style Delete fill:#FFB6C1
```

---

## 🛡️ Middleware Flow

```mermaid
graph TD
    Request[Incoming Request] --> ExpressSession[express-session]
    ExpressSession --> Flash[connect-flash]
    Flash --> MethodOverride[method-override]
    MethodOverride --> BodyParser[body-parser / express.json]
    BodyParser --> Passport[Passport Initialize]
    Passport --> PassportSession[Passport Session]
    
    PassportSession --> RouteCheck{Route Type?}
    
    RouteCheck -->|Public Route| PublicRoute[Serve Response]
    RouteCheck -->|Protected Route| IsLoggedIn{isLoggedIn?}
    
    IsLoggedIn -->|Yes| IsOwner{isOwner?}
    IsLoggedIn -->|No| RedirectLogin[Redirect to /login]
    
    IsOwner -->|Yes| ValidateSchema{validateSchema?}
    IsOwner -->|No| Unauthorized[403 Forbidden]
    
    ValidateSchema -->|Valid| Controller[Controller Handler]
    ValidateSchema -->|Invalid| ValidationError[400 Bad Request]
    
    Controller --> Response[Send Response]
    PublicRoute --> Response
    
    style IsLoggedIn fill:#FFD700
    style ValidateSchema fill:#87CEEB
    style Controller fill:#90EE90
```

---

## 📊 Data Validation Flow (Joi Schema)

```mermaid
sequenceDiagram
    participant Client
    participant Route
    participant ValidationMW as Validation Middleware
    participant JoiSchema as Joi Schema
    participant Controller
    participant DB
    
    Client->>Route: POST /listings (form data)
    Route->>ValidationMW: validateListing middleware
    ValidationMW->>JoiSchema: schema.validate(req.body)
    
    alt Validation Success
        JoiSchema-->>ValidationMW: {value, error: null}
        ValidationMW->>Controller: next()
        Controller->>DB: Save listing
        DB-->>Controller: Success
        Controller-->>Client: 201 Created
    else Validation Failure
        JoiSchema-->>ValidationMW: {error: details}
        ValidationMW-->>Client: 400 Bad Request + errors
    end
```

---

## 🎯 How to Use These Diagrams

### **Step 1: Copy to Your Repository**
```bash
# Create docs folder in your project
mkdir -p docs

# Copy this file to your docs folder
cp NESTIQUE-DIAGRAMS.md /path/to/Nestique/docs/
```

### **Step 2: View on GitHub**
- Just push to GitHub - diagrams render automatically in markdown files!
- Visit: `https://github.com/rahulgoyal83789/Nestique/blob/main/docs/NESTIQUE-DIAGRAMS.md`

### **Step 3: Preview Locally in VS Code**
1. Install extension: "Markdown Preview Mermaid Support"
2. Open this file in VS Code
3. Press `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac)

### **Step 4: Edit Diagrams Online**
- Visit: https://mermaid.live
- Copy any diagram code from above
- Edit and export as SVG/PNG if needed

---

## 📝 Customization Tips

**To update any diagram:**
1. Find the relevant section above
2. Edit the mermaid code block
3. Commit and push - GitHub renders it automatically!

**Common changes you might want:**
- Add new routes → Update "API Endpoints" section
- Add new middleware → Update "Middleware Flow" section
- Add new database models → Update "Database Schema" section

---

## 🚀 Next Steps

1. **Review the diagrams** - Are they accurate for your project?
2. **Add more details** - Add specific endpoint paths, error codes, etc.
3. **Keep updated** - Update diagrams when you add new features
4. **Share with team** - These are great for onboarding new developers!

---

**Generated for:** Nestique by Rahul Goyal  
**Date:** May 2, 2026  
**Repository:** https://github.com/rahulgoyal83789/Nestique
