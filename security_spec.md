# Security Specification — Mr. J Collections (`security_spec.md`)

## 1. Data Invariants & Master Source of Truth

1. **Global Default-Deny**: Every path not explicitly matched is unconditionally denied (`allow read, write: if false;`).
2. **Product Catalog Integrity (`/products/{productId}`)**:
   - Public storefront visitors may `get` and `list` products only if `resource.data.category in ['male', 'female', 'unisex']`.
   - Client list queries on `/products` must include `where('category', 'in', ['male', 'female', 'unisex'])` to satisfy Firestore's query rule evaluation.
   - Only verified administrators (`isAdmin()`) may `create`, `update`, or `delete` product documents.
   - All product mutations must satisfy `isValidProduct(incoming())`, enforcing strict keys (`hasAll` and `hasOnly`), string `.size()` bounds (`name <= 150`, `subcategory <= 80`, `description <= 2000`), bounded arrays (`images.size() >= 1 && images.size() <= 10`, `sizes.size() <= 15`, `colors.size() <= 15`), and valid enums.
   - `createdAt` is strictly equal to `request.time` on creation and immutable (`incoming().createdAt == existing().createdAt`) on update.
   - `updatedAt` must always equal `request.time` on both creation and update.
3. **Administrator Registry Integrity (`/admins/{adminId}`)**:
   - No PII (emails, phone numbers, or addresses) is stored in `/admins/{adminId}`.
   - Document ID `{adminId}` must match `request.auth.uid` and pass `isValidId(adminId)`.
   - Only verified bootstrapped administrators (`request.auth.token.email_verified == true`) can create an admin document, and `update`/`delete`/`list` are strictly forbidden (`if false`).

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1 (Unauthenticated Product Creation)**: Anonymous client attempts to create `/products/prod_1`. -> `PERMISSION_DENIED`
2. **Payload 2 (Email Spoofing Attack)**: Authenticated user with `email == 'amiri3x3@gmail.com'` or `'admin@mrjcollections.com'` but `email_verified == false` attempts to create/update a product. -> `PERMISSION_DENIED`
3. **Payload 3 (Shadow Field / Ghost Key Injection)**: Admin sends valid product payload plus an undeclared field `isFeaturedSuper: true`. Rejected by `hasOnly()`. -> `PERMISSION_DENIED`
4. **Payload 4 (ID Poisoning Attack)**: Admin attempts to create `/products/invalid$id!with/slashes` or a 200-char ID. Rejected by `isValidId(productId)`. -> `PERMISSION_DENIED`
5. **Payload 5 (Denial of Wallet — Oversized Description)**: Admin sends a 10,000-character `description` string (exceeding `maxLength: 2000`). Rejected by `isValidProduct()`. -> `PERMISSION_DENIED`
6. **Payload 6 (Unbounded Array Injection)**: Admin sends 25 items in `images` array (exceeding max 10). Rejected by `data.images.size() <= 10`. -> `PERMISSION_DENIED`
7. **Payload 7 (Array Type Poisoning)**: Admin sends `[12345]` in `images` instead of a string URL. Rejected by `data.images[0] is string`. -> `PERMISSION_DENIED`
8. **Payload 8 (Negative Price Injection)**: Admin sends `price: -50`. Rejected by `data.price >= 0`. -> `PERMISSION_DENIED`
9. **Payload 9 (Invalid Category Enum)**: Admin sends `category: "kids"`. Rejected by `data.category in ['male', 'female', 'unisex']`. -> `PERMISSION_DENIED`
10. **Payload 10 (Immortal Field Tampering)**: Admin updates a product and modifies `createdAt`. Rejected by `incoming().createdAt == existing().createdAt`. -> `PERMISSION_DENIED`
11. **Payload 11 (Forged Client Timestamp)**: Admin creates or updates a product with a past/future `updatedAt` instead of `request.time`. Rejected by `incoming().updatedAt == request.time`. -> `PERMISSION_DENIED`
12. **Payload 12 (Privilege Escalation / Self-Admin Assignment)**: Standard non-admin user attempts to create `/admins/{theirUid}` with `role: 'admin'`. Rejected by `isAdmin()`. -> `PERMISSION_DENIED`

---

## 3. Red Team Audit & Conflict Report

| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning | Validation Helper in Update | Value Poisoning | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/products/{productId}` | Blocked (`email_verified == true` + `isAdmin()`) | Blocked (strict enum checks on `stockStatus` & `category`) | Blocked (`isValidId` + `.size()` on all strings/lists) | Present (`isValidProduct(incoming())` wraps `allow update`) | Blocked (`isValidProduct` validates every field type & boundary) | **PASS** |
| `/admins/{adminId}` | Blocked (`adminId == request.auth.uid` + `isAdmin()`) | Blocked (`allow update: if false`) | Blocked (`isValidId(adminId)` + strict 3-key schema) | N/A (`allow update: if false`) | Blocked (`isValidAdmin(incoming())`) | **PASS** |
