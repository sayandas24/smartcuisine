import pool from "../config/db.connection.js";

/* Run this script to initilize the database*/
const query = {
  Users: `CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    username VARCHAR(20) UNIQUE,
    phone_number VARCHAR(15) NOT NULL,
    profile_pic TEXT,
    password TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    role TINYINT(1) DEFAULT 0,
    provider TINYINT(1) DEFAULT 0,
    verified TINYINT(1) DEFAULT 1,
    register_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`,

  Categories: `CREATE TABLE IF NOT EXISTS Categories (
    id INT PRIMARY  KEY AUTO_INCREMENT,
    name VARCHAR(15),
    description VARCHAR(250),
    img TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`,

  Memories: `CREATE TABLE IF NOT EXISTS Memories(
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid VARCHAR(50),
    img TEXT,
    msg VARCHAR(250),
    rating TINYINT CHECK(rating BETWEEN 0 AND 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_memories_users FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE
);
`,

  Orders: `CREATE TABLE IF NOT EXISTS Orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    item_id INT,
    quantity INT,
    order_status ENUM('pending', 'processing', 'completed', 'cancelled'),
    payment_status ENUM('pending', 'completed'),
    ordered_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fK_orders_users FOREIGN KEY (customer_id) REFERENCES Users(id) ON DELETE CASCADE
);

`,

  Favourite_list: `CREATE TABLE IF NOT EXISTS Favourite_list (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid VARCHAR(50),
    list JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favlist_users FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE
);
`,

  Coupon_codes: `CREATE TABLE IF NOT EXISTS Coupon_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10),
    discount INT,
    discount_type ENUM('fixed', 'percentage'),
    max_discount INT,
    min_order_value INT,
    usage_limit INT,
    times_used INT,
    valid_from DATETIME,
    valid_until DATETIME,
    status ENUM('active', 'full', 'expired'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);
`,

  Inventory: `CREATE TABLE IF NOT EXISTS Inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(250),
    img TEXT,
    is_veg TINYINT(1),
    cost_price INT(5),
    discount INT(2),
    sku VARCHAR(10),
    quantity INT(5),
    status ENUM('available', 'out_of_stock','low_stock'),
    preparation_time INT(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_category FOREIGN KEY (category_id) REFERENCES Categories(id)     
);`,

  Variants: `CREATE TABLE IF NOT EXISTS Variants  (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inventory_id INT,
    name VARCHAR(50),
    description VARCHAR(250),
    img TEXT,
    is_veg TINYINT(1),
    cost_price INT(5),
    discount INT(2),
    sku VARCHAR(10),
    quantity INT(5),
    status ENUM('available', 'out_of_stock','low_stock'),
    preparation_time INT(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ivariants_cinventory FOREIGN KEY (inventory_id) REFERENCES Inventory(id)

);`,

  Otps: `
CREATE TABLE IF NOT EXISTS Otps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid VARCHAR(50),
    code INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 

    CONSTRAINT fk_otps_users FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE
);`,

  Config: `CREATE TABLE IF NOT EXISTS Config (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(50),
     images JSON,
     fav_icon TEXT,
     colors JSON,
     business_info JSON,
     currency VARCHAR(10),
     opening_hours JSON,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
};

(async () => {
  for (let key in query) {
    const result = await pool.query(query[key]);
    if (result[0].warningStatus === 1) {
      console.log(`${key} : Table already exists ❎`);
    } else if (result[0].affectedRows === 0) {
      console.log(`${key} : Table created ☑`);
    }
  }
})();
