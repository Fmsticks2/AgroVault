// Marketplace.leo
// A secure and efficient smart contract for agricultural product trading on Aleo

program Marketplace.aleo;

// Product record structure with enhanced fields
record Product {
    owner: address,
    name: field,
    description: field,
    price: u64,
    category: field,
    quantity: u64,
    harvest_date: field,
    certification: field,
    is_listed: bool,
    created_at: field
}

// Transaction record for tracking sales
record Transaction {
    buyer: address,
    seller: address,
    product_id: field,
    price: u64,
    timestamp: field
}

// Mapping structures
mapping products: field => Product;
mapping categories: field => Vec<field>;
mapping user_products: address => Vec<field>;
mapping transactions: field => Transaction;

// Function to add a new product
function add_product(
    owner: address,
    name: field,
    description: field,
    price: u64,
    category: field,
    quantity: u64,
    harvest_date: field,
    certification: field
) -> field {
    // Generate unique product ID
    let product_id: field = Poseidon8::hash_to_field(owner, name, price);
    
    // Create new product record
    let product: Product = Product {
        owner,
        name,
        description,
        price,
        category,
        quantity,
        harvest_date,
        certification,
        is_listed: true,
        created_at: block.height
    };
    
    // Store product
    products.set(product_id, product);
    
    // Update category mapping
    let mut cat_products: Vec<field> = categories.get_or_use(category, Vec::new());
    cat_products.push(product_id);
    categories.set(category, cat_products);
    
    // Update user products
    let mut user_prods: Vec<field> = user_products.get_or_use(owner, Vec::new());
    user_prods.push(product_id);
    user_products.set(owner, user_prods);
    
    return product_id
}

// Function to purchase a product
function buy_product(buyer: address, product_id: field, payment: u64) {
    // Get product details
    let product: Product = products.get(product_id);
    
    // Verify product is listed and payment is sufficient
    assert(product.is_listed == true);
    assert(payment >= product.price);
    assert(product.quantity > 0u64);
    
    // Create transaction record
    let transaction: Transaction = Transaction {
        buyer,
        seller: product.owner,
        product_id,
        price: payment,
        timestamp: block.height
    };
    
    // Update product status
    product.quantity -= 1u64;
    if product.quantity == 0u64 {
        product.is_listed = false;
    }
    
    // Store updated records
    products.set(product_id, product);
    transactions.set(product_id, transaction);
    
    // Transfer payment (to be implemented with Aleo credits)
    // credits.transfer(buyer, product.owner, payment);
}

// Function to get products by category
function get_products_by_category(category: field) -> Vec<field> {
    return categories.get_or_use(category, Vec::new())
}

// Function to get user's products
function get_user_products(user: address) -> Vec<field> {
    return user_products.get_or_use(user, Vec::new())
}

// Function to update product price
function update_price(owner: address, product_id: field, new_price: u64) {
    let mut product: Product = products.get(product_id);
    assert(product.owner == owner);
    product.price = new_price;
    products.set(product_id, product);
}

// Function to delist product
function delist_product(owner: address, product_id: field) {
    let mut product: Product = products.get(product_id);
    assert(product.owner == owner);
    product.is_listed = false;
    products.set(product_id, product);
}