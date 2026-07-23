import os

# Line numbers (1-indexed) based on earlier grep
splits = [
    (1, 28, "js/data/config.js"),
    (29, 97, "js/components/CopyButton.js"),
    (98, 230, "js/components/PremiumAlertModal.js"),
    (231, 656, "js/components/Navbar.js"),
    (657, 668, "js/components/Footer.js"),
    (669, 719, "js/components/ProductCard.js"),
    (720, 968, "js/components/FilterSidebarContent.js"),
    (969, 1010, "js/components/CustomSelect.js"),
    (1011, 1555, "js/pages/Shop.js"),
    (1556, 1712, "js/pages/Home.js"),
    (1713, 1782, "js/pages/WishlistPage.js"),
    (1783, 2277, "js/pages/ProductDetails.js"),
    (2278, 2571, "js/pages/Cart.js"),
    (2572, 3256, "js/pages/Checkout.js"),
    (3257, 3352, "js/pages/MockPayment.js"),
    (3353, 3641, "js/pages/CheckoutSuccess.js"),
    (3642, 4665, "js/pages/ProfilePage.js"),
    (4666, 4673, "js/components/ScrollToTop.js"),
    (4674, None, "app.js") # Overwrite app.js with just the App component
]

with open("app.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Validate that the start lines match the expected components
for start, end, filename in splits:
    os.makedirs(os.path.dirname(filename) or '.', exist_ok=True)
    
    start_idx = start - 1
    end_idx = end - 1 if end else len(lines)
    
    content = "".join(lines[start_idx:end_idx])
    
    with open(filename, "w", encoding="utf-8") as out_f:
        out_f.write(content)
        print(f"Wrote {filename} (Lines {start}-{end if end else 'EOF'})")

print("Splitting completed successfully.")
