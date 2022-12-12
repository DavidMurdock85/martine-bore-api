-- add meta fields to products table
ALTER TABLE products ADD COLUMN metaTitle varchar(255);
ALTER TABLE products ADD COLUMN metaDescription varchar(3000);

-- add meta fields to categories table
ALTER TABLE categories ADD COLUMN metaTitle varchar(255);
ALTER TABLE categories ADD COLUMN metaDescription varchar(3000);