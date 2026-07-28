import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env.config";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Maysar API",
    version: "1.0.0",
    contact: {
      name: "API Support",
      email: "[EMAIL_ADDRESS]",
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token in the format: Bearer <your_jwt_token>",
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          statusCode: { type: "number", example: 200 },
          message: { type: "string", example: "Operation completed successfully." },
          data: { type: "object" },
          meta: { type: "object" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          statusCode: { type: "number", example: 400 },
          message: { type: "string", example: "Error description message." },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string", example: "email" },
                message: { type: "string", example: "Invalid input format." },
              },
            },
          },
        },
      },
      AddressSchema: {
        type: "object",
        required: ["firstName", "lastName", "phone", "country", "state", "city", "zipCode", "addressLine1"],
        properties: {
          firstName: { type: "string", example: "John" },
          lastName: { type: "string", example: "Doe" },
          phone: { type: "string", example: "+19999999999" },
          country: { type: "string", example: "USA" },
          state: { type: "string", example: "California" },
          city: { type: "string", example: "San Francisco" },
          zipCode: { type: "string", example: "94105" },
          addressLine1: { type: "string", example: "123 Market Street" },
          addressLine2: { type: "string", example: "Suite 400" },
          landmark: { type: "string", example: "Near Tech Hub" },
          isDefault: { type: "boolean", example: true },
        },
      },
      PaymentMethodSchema: {
        type: "object",
        required: ["provider", "accountNumberOrLast4"],
        properties: {
          provider: { type: "string", example: "Visa" },
          accountNumberOrLast4: { type: "string", example: "4242" },
          isDefault: { type: "boolean", example: true },
        },
      },
      ProductSchema: {
        type: "object",
        required: ["title", "description", "brand", "category", "price", "SKU", "stock", "thumbnail"],
        properties: {
          title: { type: "string", example: "Wireless Noise-Canceling Headphones" },
          description: { type: "string", example: "High-fidelity audio with active noise cancellation." },
          brand: { type: "string", example: "AudioPro" },
          category: { type: "string", example: "66a01234567890abcdef1234" },
          subCategory: { type: "string", example: "66a01234567890abcdef5678" },
          price: { type: "number", example: 199.99 },
          salePrice: { type: "number", example: 149.99 },
          discount: { type: "number", example: 25 },
          SKU: { type: "string", example: "AUD-NC-001" },
          barcode: { type: "string", example: "123456789012" },
          stock: { type: "number", example: 50 },
          images: { type: "array", items: { type: "string" }, example: ["https://example.com/img1.jpg"] },
          thumbnail: { type: "string", example: "https://example.com/thumb.jpg" },
          tags: { type: "array", items: { type: "string" }, example: ["audio", "wireless", "headphones"] },
          featured: { type: "boolean", example: true },
        },
      },
      CategorySchema: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Electronics" },
          description: { type: "string", example: "Gadgets and devices." },
          image: { type: "string", example: "https://example.com/cat.jpg" },
          parentCategory: { type: "string", example: "66a01234567890abcdef1234" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
        },
      },
      CouponSchema: {
        type: "object",
        required: ["code", "discountType", "discountValue", "expiryDate"],
        properties: {
          code: { type: "string", example: "SUMMER2026" },
          discountType: { type: "string", enum: ["percentage", "fixed"], example: "percentage" },
          discountValue: { type: "number", example: 20 },
          minimumOrder: { type: "number", example: 50 },
          maximumDiscount: { type: "number", example: 100 },
          expiryDate: { type: "string", format: "date-time", example: "2026-12-31T23:59:59.000Z" },
          usageLimit: { type: "number", example: 500 },
        },
      },
      ReviewSchema: {
        type: "object",
        required: ["productId", "rating", "comment"],
        properties: {
          productId: { type: "string", example: "66a01234567890abcdef1234" },
          rating: { type: "number", minimum: 1, maximum: 5, example: 5 },
          comment: { type: "string", example: "Outstanding build quality and sound experience!" },
          images: { type: "array", items: { type: "string" }, example: ["https://example.com/review.jpg"] },
        },
      },
    },
  },
  tags: [
    { name: "Authentication", description: "Passwordless OTP Email Auth (Signup, Login, Resend, Current User)" },
    { name: "Profile", description: "Customer Profile Management" },
    { name: "Address", description: "Customer Shipping/Billing Addresses CRUD" },
    { name: "Wishlist", description: "Customer Wishlist Operations" },
    { name: "Cart", description: "Shopping Cart Operations" },
    { name: "Orders", description: "Checkout & Customer Orders Lifecycle" },
    { name: "Payments", description: "Payment Gateway Integration & Methods" },
    { name: "Products Catalog", description: "Public Product Browsing & Filtering" },
    { name: "Categories Catalog", description: "Product Categories Browsing" },
    { name: "Coupons", description: "Discount Coupons & Validation" },
    { name: "Reviews", description: "Product Ratings & Customer Reviews" },
    { name: "Returns", description: "Product Return Requests" },
    { name: "Admin Dashboard & Management", description: "Admin Suite (Stats, Customer Moderation, Inventory, Orders, Reports, Notifications, Settings)" },
  ],
  paths: {
    // AUTHENTICATION APIs
    "/api/auth/signup/send-otp": {
      post: {
        summary: "Send Signup OTP",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email"],
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "nitishdev021@gmail.com" },
                  phone: { type: "string", example: "9999999999" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "OTP sent to email", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } } },
          "409": { description: "Email already registered" },
        },
      },
    },
    "/api/auth/signup/verify": {
      post: {
        summary: "Verify Signup OTP & Create Account",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                  email: { type: "string", example: "nitishdev021@gmail.com" },
                  otp: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "User registered and verified, JWT token returned" },
          "400": { description: "Invalid or expired OTP" },
        },
      },
    },
    "/api/auth/login/send-otp": {
      post: {
        summary: "Send Login OTP",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", example: "nitishdev021@gmail.com" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login OTP sent to email" },
          "404": { description: "No account found" },
        },
      },
    },
    "/api/auth/login/verify": {
      post: {
        summary: "Verify Login OTP",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                  email: { type: "string", example: "nitishdev021@gmail.com" },
                  otp: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Logged in successfully, JWT token returned" },
        },
      },
    },
    "/api/auth/resend-otp": {
      post: {
        summary: "Resend OTP (60 Seconds Cooldown)",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "purpose"],
                properties: {
                  email: { type: "string", example: "nitishdev021@gmail.com" },
                  purpose: { type: "string", enum: ["signup", "login"], example: "signup" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "New OTP sent" },
          "400": { description: "Cooldown period active" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        summary: "Get Authenticated User",
        tags: ["Authentication"],
        security: [{ BearerAuth: [] }],
        responses: {
          "200": { description: "Current authenticated user profile" },
          "401": { description: "Unauthorized" },
        },
      },
    },

    // PROFILE APIs
    "/api/profile": {
      get: {
        summary: "Get User Profile",
        tags: ["Profile"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Profile details" } },
      },
      put: {
        summary: "Update Profile",
        tags: ["Profile"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Johnathan Doe" },
                  phone: { type: "string", example: "+19876543210" },
                  avatar: { type: "string", example: "https://example.com/avatar.jpg" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Updated profile" } },
      },
    },

    // ADDRESS APIs
    "/api/addresses": {
      get: {
        summary: "Get Saved Addresses",
        tags: ["Address"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "List of saved user addresses" } },
      },
      post: {
        summary: "Add New Address",
        tags: ["Address"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AddressSchema" } } },
        },
        responses: { "200": { description: "Address added successfully" } },
      },
    },
    "/api/addresses/{id}": {
      put: {
        summary: "Update Address",
        tags: ["Address"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AddressSchema" } } },
        },
        responses: { "200": { description: "Address updated" } },
      },
      delete: {
        summary: "Delete Address",
        tags: ["Address"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Address deleted" } },
      },
    },
    "/api/addresses/{id}/default": {
      put: {
        summary: "Set Default Address",
        tags: ["Address"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Default address set" } },
      },
    },

    // WISHLIST APIs
    "/api/wishlist": {
      get: {
        summary: "Get Customer Wishlist",
        tags: ["Wishlist"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Wishlist products" } },
      },
      post: {
        summary: "Add Product to Wishlist",
        tags: ["Wishlist"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId"],
                properties: { productId: { type: "string", example: "66a01234567890abcdef1234" } },
              },
            },
          },
        },
        responses: { "200": { description: "Product added to wishlist" } },
      },
      delete: {
        summary: "Clear Entire Wishlist",
        tags: ["Wishlist"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Wishlist cleared" } },
      },
    },
    "/api/wishlist/{productId}": {
      delete: {
        summary: "Remove Product from Wishlist",
        tags: ["Wishlist"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Product removed from wishlist" } },
      },
    },

    // PRODUCTS APIs
    "/api/products": {
      get: {
        summary: "List Products (Filter, Search, Sort, Paginate)",
        tags: ["Products Catalog"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["price_asc", "price_desc", "rating"] } },
        ],
        responses: { "200": { description: "Paginated products list" } },
      },
      post: {
        summary: "Create Product (Admin)",
        tags: ["Products Catalog"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProductSchema" } } },
        },
        responses: { "201": { description: "Product created" } },
      },
    },
    "/api/products/{id}": {
      get: {
        summary: "Get Product Details",
        tags: ["Products Catalog"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Product ObjectId or Slug" }],
        responses: { "200": { description: "Product details" } },
      },
      put: {
        summary: "Update Product (Admin)",
        tags: ["Products Catalog"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProductSchema" } } } },
        responses: { "200": { description: "Product updated" } },
      },
      delete: {
        summary: "Delete Product (Admin)",
        tags: ["Products Catalog"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Product deleted" } },
      },
    },

    // CATEGORIES APIs
    "/api/categories": {
      get: {
        summary: "Get Categories",
        tags: ["Categories Catalog"],
        parameters: [{ name: "status", in: "query", schema: { type: "string", enum: ["active", "inactive"] } }],
        responses: { "200": { description: "List of categories" } },
      },
      post: {
        summary: "Create Category (Admin)",
        tags: ["Categories Catalog"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CategorySchema" } } },
        },
        responses: { "201": { description: "Category created" } },
      },
    },
    "/api/categories/{id}": {
      get: {
        summary: "Get Category Details",
        tags: ["Categories Catalog"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Category details" } },
      },
      put: {
        summary: "Update Category (Admin)",
        tags: ["Categories Catalog"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CategorySchema" } } } },
        responses: { "200": { description: "Category updated" } },
      },
      delete: {
        summary: "Delete Category (Admin)",
        tags: ["Categories Catalog"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Category deleted" } },
      },
    },

    // CART APIs
    "/api/cart": {
      get: {
        summary: "Get Shopping Cart",
        tags: ["Cart"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Customer cart with items and grandTotal" } },
      },
      post: {
        summary: "Add Item to Cart",
        tags: ["Cart"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "string", example: "66a01234567890abcdef1234" },
                  quantity: { type: "integer", example: 2 },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Updated cart" } },
      },
      delete: {
        summary: "Clear Shopping Cart",
        tags: ["Cart"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Cart emptied" } },
      },
    },
    "/api/cart/items/{productId}": {
      put: {
        summary: "Update Cart Item Quantity",
        tags: ["Cart"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["quantity"],
                properties: { quantity: { type: "integer", example: 3 } },
              },
            },
          },
        },
        responses: { "200": { description: "Cart updated" } },
      },
      delete: {
        summary: "Remove Item from Cart",
        tags: ["Cart"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Item removed from cart" } },
      },
    },

    // ORDERS APIs
    "/api/orders": {
      get: {
        summary: "Get Customer Orders",
        tags: ["Orders"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Customer order history" } },
      },
      post: {
        summary: "Create Order / Checkout",
        tags: ["Orders"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["shippingAddress", "billingAddress", "paymentMethod"],
                properties: {
                  shippingAddress: { $ref: "#/components/schemas/AddressSchema" },
                  billingAddress: { $ref: "#/components/schemas/AddressSchema" },
                  paymentMethod: { type: "string", example: "Credit Card" },
                  couponCode: { type: "string", example: "SUMMER2026" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Order created successfully" } },
      },
    },
    "/api/orders/{id}": {
      get: {
        summary: "Get Order Details",
        tags: ["Orders"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Detailed order information" } },
      },
    },
    "/api/orders/{id}/cancel": {
      put: {
        summary: "Cancel Order",
        tags: ["Orders"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Order status updated to Cancelled and stock restored" } },
      },
    },
    "/api/orders/{id}/track": {
      get: {
        summary: "Track Order Status",
        tags: ["Orders"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Order status & tracking number" } },
      },
    },
    "/api/orders/{id}/return": {
      post: {
        summary: "Request Order Return",
        tags: ["Orders"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["reason"],
                properties: {
                  reason: { type: "string", example: "Defective item" },
                  description: { type: "string", example: "The right ear cup has no sound." },
                  images: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Return request submitted" } },
      },
    },

    // COUPONS APIs
    "/api/coupons/validate": {
      post: {
        summary: "Validate Coupon Code",
        tags: ["Coupons"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["code", "cartTotal"],
                properties: {
                  code: { type: "string", example: "SUMMER2026" },
                  cartTotal: { type: "number", example: 150 },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Coupon validity & discount details" } },
      },
    },
    "/api/coupons": {
      get: {
        summary: "Get All Coupons (Admin)",
        tags: ["Coupons"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "List of coupons" } },
      },
      post: {
        summary: "Create Coupon (Admin)",
        tags: ["Coupons"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CouponSchema" } } },
        },
        responses: { "201": { description: "Coupon created" } },
      },
    },
    "/api/coupons/{id}": {
      put: {
        summary: "Update Coupon (Admin)",
        tags: ["Coupons"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CouponSchema" } } } },
        responses: { "200": { description: "Coupon updated" } },
      },
      delete: {
        summary: "Delete Coupon (Admin)",
        tags: ["Coupons"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Coupon deleted" } },
      },
    },

    // PAYMENTS APIs
    "/api/payments/process": {
      post: {
        summary: "Process Payment",
        tags: ["Payments"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId", "paymentGateway", "amount", "transactionId"],
                properties: {
                  orderId: { type: "string", example: "66a01234567890abcdef1234" },
                  paymentGateway: { type: "string", example: "Stripe" },
                  amount: { type: "number", example: 149.99 },
                  transactionId: { type: "string", example: "txn_123456789" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Payment recorded successfully" } },
      },
    },
    "/api/payments/history": {
      get: {
        summary: "Get Payment History",
        tags: ["Payments"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "List of transactions" } },
      },
    },
    "/api/payments/methods": {
      get: {
        summary: "Get Saved Payment Methods",
        tags: ["Payments"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Saved payment cards/accounts" } },
      },
      post: {
        summary: "Save Payment Method",
        tags: ["Payments"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/PaymentMethodSchema" } } },
        },
        responses: { "201": { description: "Payment method saved" } },
      },
    },
    "/api/payments/methods/{id}": {
      delete: {
        summary: "Delete Payment Method",
        tags: ["Payments"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Payment method deleted" } },
      },
    },

    // REVIEWS APIs
    "/api/reviews/product/{productId}": {
      get: {
        summary: "Get Reviews for Product",
        tags: ["Reviews"],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "List of product reviews" } },
      },
    },
    "/api/reviews": {
      post: {
        summary: "Add Product Review",
        tags: ["Reviews"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewSchema" } } },
        },
        responses: { "201": { description: "Review added and rating updated" } },
      },
    },
    "/api/reviews/{id}": {
      delete: {
        summary: "Delete Review (Admin)",
        tags: ["Reviews"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Review deleted" } },
      },
    },

    // RETURNS APIs
    "/api/returns": {
      get: {
        summary: "Get Product Returns",
        tags: ["Returns"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "List of return requests" } },
      },
    },
    "/api/returns/{id}/status": {
      put: {
        summary: "Update Return Request Status (Admin)",
        tags: ["Returns"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: { status: { type: "string", enum: ["requested", "approved", "rejected", "completed"], example: "approved" } },
              },
            },
          },
        },
        responses: { "200": { description: "Return status updated" } },
      },
    },

    // ADMIN APIs
    "/api/admin/dashboard": {
      get: {
        summary: "Get Admin Analytics Dashboard",
        tags: ["Admin Dashboard & Management"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Total revenue, orders, active customers, inventory status" } },
      },
    },
    "/api/admin/customers": {
      get: {
        summary: "List Customers (Admin)",
        tags: ["Admin Dashboard & Management"],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: { "200": { description: "Paginated customers list" } },
      },
    },
    "/api/admin/customers/{id}/status": {
      put: {
        summary: "Block/Unblock Customer (Admin)",
        tags: ["Admin Dashboard & Management"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: { status: { type: "string", enum: ["active", "blocked"], example: "blocked" } },
              },
            },
          },
        },
        responses: { "200": { description: "Customer status updated" } },
      },
    },
    "/api/admin/inventory/{productId}": {
      put: {
        summary: "Update Product Inventory Stock (Admin)",
        tags: ["Admin Dashboard & Management"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["stock"],
                properties: { stock: { type: "integer", example: 100 } },
              },
            },
          },
        },
        responses: { "200": { description: "Stock updated" } },
      },
    },
    "/api/admin/orders/{id}/status": {
      put: {
        summary: "Update Order Fulfillment Status (Admin)",
        tags: ["Admin Dashboard & Management"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderStatus"],
                properties: {
                  orderStatus: { type: "string", enum: ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"], example: "Shipped" },
                  trackingNumber: { type: "string", example: "TRK-987654321" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Order status updated" } },
      },
    },
    "/api/admin/reports": {
      get: {
        summary: "Get Sales & Analytics Reports (Admin)",
        tags: ["Admin Dashboard & Management"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Sales analytics summary report" } },
      },
    },
    "/api/admin/notifications/broadcast": {
      post: {
        summary: "Broadcast Push/In-App Notification (Admin)",
        tags: ["Admin Dashboard & Management"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "message"],
                properties: {
                  title: { type: "string", example: "Flash Sale Alert!" },
                  message: { type: "string", example: "50% off on all electronics today." },
                  type: { type: "string", example: "promotional" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Notification broadcasted to all users" } },
      },
    },
    "/api/admin/settings": {
      get: {
        summary: "Get Global App Settings (Admin)",
        tags: ["Admin Dashboard & Management"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "App configurations" } },
      },
      put: {
        summary: "Update Global App Settings (Admin)",
        tags: ["Admin Dashboard & Management"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: { type: "object", properties: { freeShippingThreshold: { type: "number", example: 100 } } },
            },
          },
        },
        responses: { "200": { description: "Settings saved" } },
      },
    },
  },
};

const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
