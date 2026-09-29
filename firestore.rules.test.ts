/**
 * Verification Suite for Firestore Security Rules ("Dirty Dozen" Payloads)
 * Ensures all 12 adversarial payloads defined in security_spec.md are rejected.
 */

export interface DirtyPayloadTestCase {
  id: number;
  name: string;
  collection: string;
  docId: string;
  operation: 'create' | 'update' | 'delete' | 'get' | 'list';
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyPayloadTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Product Creation',
    collection: 'products',
    docId: 'prod_1',
    operation: 'create',
    auth: null,
    payload: { name: 'Sneakers', price: 350 },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Email Spoofing Attack (email_verified: false)',
    collection: 'products',
    docId: 'prod_2',
    operation: 'create',
    auth: { uid: 'spoof_uid', email: 'amiri3x3@gmail.com', email_verified: false },
    payload: { name: 'Sneakers', price: 350 },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow Field / Ghost Key Injection',
    collection: 'products',
    docId: 'prod_3',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'amiri3x3@gmail.com', email_verified: true },
    payload: {
      name: 'Luxury Slides',
      price: 220,
      discountPrice: null,
      category: 'male',
      subcategory: 'Slides',
      description: 'Premium slides',
      images: ['https://example.com/slide.jpg'],
      sizes: ['42', '43'],
      colors: ['Black'],
      stockStatus: 'in_stock',
      hotSelling: true,
      isFeaturedSuper: true, // Ghost key
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'ID Poisoning Attack',
    collection: 'products',
    docId: 'invalid$id!with*bad*chars',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'amiri3x3@gmail.com', email_verified: true },
    payload: { name: 'Valid Name', price: 150 },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Denial of Wallet — Oversized Description (>2000 chars)',
    collection: 'products',
    docId: 'prod_5',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'amiri3x3@gmail.com', email_verified: true },
    payload: {
      name: 'Oversized Item',
      price: 200,
      description: 'A'.repeat(2500),
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Unbounded Array Injection (>10 images)',
    collection: 'products',
    docId: 'prod_6',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'amiri3x3@gmail.com', email_verified: true },
    payload: {
      name: 'Too Many Images',
      price: 200,
      images: Array.from({ length: 12 }, (_, i) => `https://example.com/${i}.jpg`),
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Array Type Poisoning (non-string image element)',
    collection: 'products',
    docId: 'prod_7',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'amiri3x3@gmail.com', email_verified: true },
    payload: {
      name: 'Bad Image Array',
      price: 200,
      images: [12345],
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Negative Price Injection',
    collection: 'products',
    docId: 'prod_8',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'amiri3x3@gmail.com', email_verified: true },
    payload: {
      name: 'Negative Price Item',
      price: -100,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Invalid Category Enum',
    collection: 'products',
    docId: 'prod_9',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'amiri3x3@gmail.com', email_verified: true },
    payload: {
      name: 'Invalid Category',
      price: 150,
      category: 'children',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Immortal Field Tampering (modifying createdAt on update)',
    collection: 'products',
    docId: 'prod_10',
    operation: 'update',
    auth: { uid: 'admin_1', email: 'amiri3x3@gmail.com', email_verified: true },
    payload: {
      createdAt: '2099-01-01T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Forged Client Timestamp (updatedAt != request.time)',
    collection: 'products',
    docId: 'prod_11',
    operation: 'update',
    auth: { uid: 'admin_1', email: 'amiri3x3@gmail.com', email_verified: true },
    payload: {
      updatedAt: '2020-01-01T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Privilege Escalation / Self-Admin Assignment',
    collection: 'admins',
    docId: 'attacker_uid',
    operation: 'create',
    auth: { uid: 'attacker_uid', email: 'attacker@example.com', email_verified: true },
    payload: {
      uid: 'attacker_uid',
      role: 'admin',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
];
