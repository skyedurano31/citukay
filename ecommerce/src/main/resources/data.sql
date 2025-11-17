-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Fashion and apparel'),
('Books', 'Books and literature'),
('Home & Garden', 'Home and garden supplies');

-- Insert sample products
INSERT INTO products (name, description, price, stock_quantity, category_id, sku) VALUES
('Smartphone', 'Latest smartphone with great features', 699.99, 50, 1, 'PHN-001'),
('Laptop', 'High-performance laptop', 999.99, 30, 1, 'LTP-001'),
('T-Shirt', 'Cotton t-shirt', 19.99, 100, 2, 'TSH-001'),
('Java Programming Book', 'Learn Java programming', 39.99, 25, 3, 'BOK-001'),
('Garden Chair', 'Comfortable outdoor chair', 49.99, 75, 4, 'GCH-001');

-- Insert sample user
INSERT INTO users (email, password, first_name, last_name, phone) VALUES
('john.doe@example.com', 'password123', 'John', 'Doe', '123-456-7890');