// Marketplace.leo
// LEO smart contract for product listing, categories, and transactions on AleoChain

program Marketplace.aleo;

define product:
    owner: address,
    name: field,
    description: field,
    price: u64,
    category: field,
    is_listed: bool
end

database products: map[u64, product];
database categories: map[field, u64[]];
database recent_purchases: u64[];

define add_product(owner: address, name: field, description: field, price: u64, category: field) -> u64:
    product_id = products.len() as u64;
    products[product_id] = product(owner, name, description, price, category, true);
    // Add to category
    if categories.contains_key(category) {
        cat_products = categories[category];
        cat_products.push(product_id);
        categories[category] = cat_products;
    } else {
        categories[category] = [product_id];
    }
    return product_id
end

define buy_product(product_id: u64, buyer: address, payment: u64):
    prod = products[product_id];
    assert(prod.is_listed, "Product not listed");
    assert(payment >= prod.price, "Insufficient payment");
    // Transfer logic (pseudo, replace with Aleo transfer logic)
    // transfer(prod.owner, payment);
    prod.is_listed = false;
    products[product_id] = prod;
    // Track recent purchases
    recent_purchases.push(product_id);
    if recent_purchases.len() > 10 {
        recent_purchases.remove(0);
    }
end

define get_products_by_category(category: field) -> u64[]:
    return categories[category]
end

define get_recent_purchases() -> u64[]:
    return recent_purchases
end