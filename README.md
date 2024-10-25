# E-Commerce Backend API

This project is an e-commerce backend API built with **NestJS** and **Prisma ORM**. It provides a range of functionalities for managing users, products, carts, and transactions, integrating with **Cloudinary** for image storage and **Paystack** as a payment gateway.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [User](#user)
  - [Cart](#cart)
  - [Product](#product)
  - [Transaction/Payment](#transactionpayment)
- [License](#license)

## Technologies Used

- **NestJS**: For building and organizing the backend API.
- **Prisma ORM**: For interacting with a PostgreSQL database.
- **Cloudinary**: To handle image uploads and storage.
- **Paystack**: For secure payment processing.
- **JWT Authentication**: To secure user authentication.

## Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL database
- Cloudinary and Paystack accounts for image storage and payment gateway, respectively.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/username/e-commerce-backend.git
   cd e-commerce-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see the [Environment Variables](#environment-variables) section).

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the application:

   ```bash
   npm run start:dev
   ```

### Environment Variables

To run this project, you’ll need to add the following environment variables to your `.env` file:

```dotenv
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

## API Endpoints

### User

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | `/auth/signup` | Register a new user |
| POST   | `/auth/login`  | Authenticate a user |

### Cart

| Method | Endpoint                  | Description                       |
| ------ | ------------------------- | --------------------------------- |
| POST   | `/cart/add`               | Add product to the user's cart    |
| POST   | `/cart/start-checkout`    | Begin checkout for the cart       |
| POST   | `/cart/complete-checkout` | Complete the checkout process     |
| POST   | `/cart/archived`          | Save a cart item for later        |
| POST   | `/cart/cart-items`        | Retrieve active items in the cart |

### Product

| Method | Endpoint        | Description                                                        |
| ------ | --------------- | ------------------------------------------------------------------ |
| POST   | `/products`     | Create a new product with image upload                             |
| GET    | `/products/:id` | Retrieve product by ID                                             |
| GET    | `/products`     | Retrieve all products or search by title, description, or category |
| PATCH  | `/products/:id` | Update a product                                                   |
| DELETE | `/products/:id` | Delete a product                                                   |

### Transaction/Payment

| Method | Endpoint                            | Description                           |
| ------ | ----------------------------------- | ------------------------------------- |
| POST   | `/paymentgateway/initialize`        | Initialize a payment                  |
| GET    | `/paymentgateway/verify/:reference` | Verify a payment                      |
| GET    | `/paymentgateway/cart-total`        | Calculate the total cost for the cart |

---

## License

This project is licensed under the MIT License.

## credit

[Roadmap](https://roadmap.sh/projects/ecommerce-api)
