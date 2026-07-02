# Coding Standards

Complete coding standards for the Rituals Next.js e-commerce application. These are **mandatory** conventions enforced through ESLint, Stylelint, and code reviews.

## File Naming Conventions

### Components
**React Components**: PascalCase
- `UserProfile.tsx`
- `ProductCard.tsx`
- `CheckoutForm.tsx`
- `MiniCartWrapper.tsx`

### Services & Helpers
**Services**: camelCase with descriptive suffix
- `userService.ts`
- `productApi.ts`
- `authHelper.ts`
- `cartCalculations.ts`

### Hooks
**Custom Hooks**: camelCase starting with `use`
- `useAuth.ts`
- `useCartActions.ts`
- `useProductData.ts`

### Styles
**Component-specific**: PascalCase matching component name
- `ProductCard.module.scss`
- `UserProfile.module.scss`

**Page-specific**: camelCase matching page route
- `checkout.module.scss`
- `productDetail.module.scss`

### Tests
**Unit tests**: `ComponentName.unit.test.tsx`
**Integration tests**: `ComponentName.integration.test.tsx`
**E2E tests**: `feature-name.spec.ts`

**Location**: Always in `__tests__/` subdirectory

```bash
ComponentName/
├── __tests__/
│   ├── ComponentName.unit.test.tsx
│   └── ComponentName.integration.test.tsx
├── ComponentName.tsx
└── ComponentName.module.scss
```

## Naming Conventions in Code

### TypeScript Interfaces

**REQUIRED**: Interfaces start with "I" prefix

```typescript
// ✅ CORRECT
interface IUserProps {
  name: string;
  age: number;
}

interface IProductData {
  id: string;
  title: string;
  price: number;
}

// Component props MUST use "Props" suffix
interface ICartItemProps {
  product: IProduct;
  quantity: number;
  onRemove: (id: string) => void;
}

interface ICheckoutFormProps {
  initialData?: ICheckoutData;
  onSubmit: (data: ICheckoutData) => Promise<void>;
}

// ❌ WRONG - Missing "I" prefix
interface UserProps {
  name: string;
}

interface ProductData {
  id: string;
}
```

### Types vs Interfaces

**Prefer interfaces** for object shapes (especially props)
**Use types** for unions, intersections, primitives

```typescript
// ✅ Interfaces for object shapes
interface IUser {
  id: string;
  name: string;
}

// ✅ Types for unions
type Status = 'loading' | 'success' | 'error';

// ✅ Types for intersections
type UserWithAddress = IUser & IAddress;

// ✅ Types for mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### Constants and Enums

**UPPERCASE** with underscores for constants

```typescript
// Constants
const MAX_CART_ITEMS = 999;
const API_TIMEOUT = 5000;
const DEFAULT_PAGE_SIZE = 20;

// Enums with ENUM suffix (also UPPERCASE)
enum PAGE_TYPE_ENUM {
  CART = 'cart',
  CHECKOUT = 'checkout',
  PDP = 'pdp',
  COP = 'cop'
}

enum ORDER_STATUS_ENUM {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered'
}
```

### Variables and Functions

**camelCase** for variables and functions

```typescript
// Variables
const userName = "John Doe";
const productList = [];
const isLoading = false;
const hasError = true;

// Functions
function calculateTotal(items: ICartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

const getUserData = async (userId: string): Promise<IUser> => {
  // ...
};

const handleCheckout = () => {
  // Event handlers: handle + Action
};

// Boolean variables/functions: is/has/should prefix
const isAuthenticated = true;
const hasPermission = false;
const shouldShowModal = true;

const isValidEmail = (email: string): boolean => {
  // ...
};
```

### Components

**PascalCase** for component names

```typescript
// ✅ CORRECT
export const UserProfile: FC<IUserProfileProps> = ({user}) => {
  return <div>{user.name}</div>;
};

export const ProductCard: FC<IProductCardProps> = ({product}) => {
  return <div>{product.title}</div>;
};

// ❌ WRONG
export const userProfile = () => {}; // camelCase wrong for components
export const USERPROFILE = () => {}; // All caps wrong
```

## File Structure Rules

### Component Folder Structure

```bash
ComponentName/
├── __tests__/
│   ├── __snapshots__/
│   │   └── ComponentName.unit.test.tsx.snap
│   ├── ComponentName.unit.test.tsx
│   └── ComponentName.integration.test.tsx
├── __mocks__/
│   ├── mockData.mock.json
│   └── mockData.mock.ts
├── components/                     # Child components
│   ├── ChildComponent/
│   │   ├── ChildComponent.tsx
│   │   └── ChildComponent.module.scss
│   └── index.ts
├── hooks/
│   ├── useCustomHook.ts
│   ├── useAnotherHook.ts
│   └── index.ts
├── helpers/
│   ├── helperFunction.ts
│   └── calculations.ts
├── ComponentName.tsx               # Main component
├── ComponentName.module.scss       # Component styles
├── types.ts                        # Component-specific types
├── README.md                       # Optional: complex components only
└── index.ts                        # Public exports
```

### Index File Rules

**DO use index files for**:
- Feature-specific exports (component folders)
- Grouping related hooks/helpers

**DON'T add index files in**:
- Generic `components/` folders
- Generic `helpers/` folders
- Generic `services/` folders

```typescript
// ✅ GOOD - Feature-specific index
// src/domains/cart/components/MiniCart/index.ts
export {MiniCartProvider} from './MiniCartProvider';
export {MiniCartWrapper} from './MiniCartWrapper';
export type {IMiniCartProps} from './types';

// ❌ BAD - Don't add index to generic folders
// src/common/helpers/index.ts (DON'T CREATE THIS)
```

**Default export pattern**: Use named exports by default

```typescript
// ✅ PREFERRED - Named exports
export {ComponentName} from './ComponentName';
export {useCustomHook} from './useCustomHook';

// ❌ AVOID - Default exports (harder to refactor)
export default ComponentName;
```

## CSS Modules Guidelines

### Class Naming

**camelCase** for all class names

```scss
// ✅ CORRECT - Button.module.scss
.button {
  display: flex;
}

.buttonPrimary {
  background: blue;
}

.buttonLarge {
  padding: 16px;
}

.productCard {
  border: 1px solid #ccc;
}

.productCardActive {
  border-color: blue;
}

// ❌ WRONG - kebab-case
.button-primary {
  background: blue;
}

.product-card {
  border: 1px solid #ccc;
}
```

### Mobile-First Approach

**Always start with mobile** (smallest breakpoint), then progressively enhance

```scss
// ✅ CORRECT - Mobile first
.button {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  
  // Tablet
  @include tablet {
    width: 200px;
    padding: 12px;
    font-size: 16px;
  }
  
  // Desktop
  @include desktop {
    width: 300px;
    padding: 16px;
    font-size: 18px;
  }
}

// ❌ WRONG - Desktop first (requires overrides)
.button {
  width: 300px;
  padding: 16px;
  
  @include mobile {
    width: 100%;
    padding: 8px;
  }
}
```

### Style Organization

**Rules**:
1. Use shortcuts (margin, padding) whenever possible
2. Don't add default properties (e.g., `flex-direction: row`)
3. Alphabetically sorted properties
4. Media queries inside elements, not around them

```scss
// ✅ CORRECT
.container {
  align-items: center;
  background-color: white;
  border-radius: 4px;
  display: flex;
  margin: 0 auto; // Use shortcuts
  padding: 16px;
  
  @include tablet {
    padding: 24px;
  }
  
  @include desktop {
    padding: 32px;
  }
}

// ❌ WRONG
.container {
  display: flex;
  flex-direction: row; // Don't add default
  padding: 32px; // Desktop first
  background-color: white;
  align-items: center; // Not alphabetical
  margin-top: 0;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto; // Don't use longhand
  
  @include mobile {
    padding: 16px;
  }
}
```

### Using `clsx` for Dynamic Classes

```typescript
import clsx from 'clsx';
import styles from './Component.module.scss';

// ✅ Simple conditional
const buttonClasses = clsx({
  [styles.button]: true,
  [styles.buttonActive]: isActive,
  [styles.buttonDisabled]: isDisabled
});

// ✅ With external classes
const classes = clsx({
  [styles.label]: true,
  [styles.labelDiscount]: hasDiscount,
  'external-class': true, // External class
  customClass // Variable
});

// ✅ Array syntax for multiple
const classes = clsx(
  styles.card,
  isActive && styles.cardActive,
  isLoading && styles.cardLoading
);
```

## Import Organization

**Mandatory order**: External → Internal Absolute → Relative → Styles

```typescript
// 1. External libraries (React, third-party)
import {useState, useEffect, useMemo} from 'react';
import clsx from 'clsx';
import {useRouter} from 'next/navigation';

// 2. Internal absolute imports (@/ alias)
import {Button} from '@rituals/common/components/ui/Button';
import {useAuth} from '@rituals/common/hooks/auth';
import {ProductType} from '@rituals/common/types/product';
import {evaServiceCart} from '@rituals/common/services/eva/evaServiceCart';

// 3. Relative imports (same domain/folder)
import {ChildComponent} from './components/ChildComponent';
import {useLocalHook} from './hooks/useLocalHook';
import {helper} from './helpers/helper';
import type {ILocalType} from './types';

// 4. Styles (always last)
import styles from './Component.module.scss';
```

## TypeScript Standards

### Type Safety

**NO `any` types - EVER**

```typescript
// ❌ FORBIDDEN
function processData(data: any): any {
  return data.someProperty;
}

// ✅ CORRECT - Specific types
interface IUserData {
  id: string;
  name: string;
  email: string;
}

function processUserData(data: IUserData): string {
  return data.name;
}

// ✅ CORRECT - Generics
function getData<T>(id: string): Promise<T> {
  return fetch(`/api/data/${id}`).then(r => r.json());
}

// ✅ CORRECT - Union types
type Status = 'loading' | 'success' | 'error';

function setStatus(status: Status): void {
  // Type-safe
}

// ✅ CORRECT - Unknown with type guards
function parseJson(json: string): unknown {
  return JSON.parse(json);
}

function isUserData(value: unknown): value is IUserData {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  );
}
```

### Props Interface Pattern

```typescript
// Component props - must start with I and end with Props
interface IProductCardProps {
  product: IProduct;
  onAddToCart: (id: string) => void;
  isLoading?: boolean; // Optional props use ?
  className?: string; // Optional external class
}

export const ProductCard: FC<IProductCardProps> = ({
  product,
  onAddToCart,
  isLoading = false, // Default values in destructure
  className
}) => {
  // Component logic
  return <div className={clsx(styles.card, className)} />;
};
```

### Async/Await Pattern

```typescript
// ✅ CORRECT - async/await
async function fetchUserData(userId: string): Promise<IUser> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Failed to fetch user', {userId, error});
    throw error;
  }
}

// ❌ WRONG - Callbacks
function fetchUserData(userId: string, callback: (data: IUser) => void) {
  fetch(`/api/users/${userId}`)
    .then(r => r.json())
    .then(data => callback(data));
}
```

## Code Organization Principles

### Single Responsibility Principle

```typescript
// ✅ GOOD - Focused component
export const ProductCard: FC<IProductCardProps> = ({product}) => {
  return (
    <div className={styles.card}>
      <ProductImage src={product.image} />
      <ProductTitle title={product.name} />
      <ProductPrice price={product.price} />
      <AddToCartButton productId={product.id} />
    </div>
  );
};

// ❌ BAD - Too many responsibilities
export const ProductPage: FC = () => {
  // Handles: fetching, filtering, sorting, cart logic, favorites, reviews...
  // Split into smaller components!
};
```

### Destructuring Best Practices

```typescript
// ✅ CORRECT - Destructure props/objects
const {name, email, age} = user;
const {isLoading, error, data} = useQuery();
const {user, isAuthenticatedUser, isHydrated} = useAuthState();

// ❌ WRONG - Repeated access
const userName = user.name;
const userEmail = user.email;
const userAge = user.age;

// ✅ CORRECT - Rename with destructure if needed
const {name: userName, email: userEmail} = user;
```

### Avoid Magic Numbers/Strings

```typescript
// ❌ BAD - Magic values
if (status === 2) { }
if (type === 'cart') { }
if (items.length > 10) { }

// ✅ GOOD - Named constants
const STATUS_COMPLETED = 2;
const CART_PAGE_TYPE = 'cart';
const MAX_VISIBLE_ITEMS = 10;

if (status === STATUS_COMPLETED) { }
if (type === CART_PAGE_TYPE) { }
if (items.length > MAX_VISIBLE_ITEMS) { }

// ✅ BEST - Use enums
enum ORDER_STATUS_ENUM {
  PENDING = 1,
  COMPLETED = 2,
  CANCELLED = 3
}

enum PAGE_TYPE_ENUM {
  CART = 'cart',
  CHECKOUT = 'checkout',
  PDP = 'pdp'
}

if (status === ORDER_STATUS_ENUM.COMPLETED) { }
if (type === PAGE_TYPE_ENUM.CART) { }
```

### Avoid Nested Ternaries

```typescript
// ❌ BAD - Nested ternaries
const display = isLoading ? 'Loading...' : hasError ? 'Error' : data ? data.name : 'Unknown';

// ✅ GOOD - Early returns or if/else
function getDisplay() {
  if (isLoading) return 'Loading...';
  if (hasError) return 'Error';
  if (data) return data.name;
  return 'Unknown';
}

// ✅ GOOD - Simple ternary OK for straightforward cases
const buttonText = isLoading ? 'Loading...' : 'Submit';
```

## Documentation Standards

### Code Comments

```typescript
// ✅ GOOD - Explain WHY, not WHAT
// Retry logic handles intermittent network failures common in mobile environments
const result = await retryFetch(url, {retries: 3});

// Complex business rule explanation
/**
 * Calculates discount with special B2B rules:
 * - Members get 10% base discount
 * - Orders > €100 get additional 5%
 * - Cannot exceed 20% total discount
 * - GWP discounts are separate and don't count toward limit
 */
function calculateDiscount(amount: number, isMember: boolean): number {
  // Implementation
}

// ❌ BAD - Stating the obvious
// Call retryFetch function
const result = await retryFetch(url);

// Increment counter
counter++;
```

### JSDoc for Public APIs

```typescript
/**
 * Fetches user data from the EVA API
 * 
 * @param userId - The unique identifier for the user
 * @param options - Optional configuration for the request
 * @returns Promise resolving to user data
 * @throws {UnauthorizedError} When auth token is invalid
 * @throws {NotFoundError} When user doesn't exist
 * 
 * @example
 * const user = await fetchUser('123', {includeOrders: true});
 */
export async function fetchUser(
  userId: string,
  options?: IFetchUserOptions
): Promise<IUserData> {
  // Implementation
}
```

## Validation Checklist

Before committing, verify:
- [ ] All files follow naming conventions (PascalCase/camelCase/UPPERCASE)
- [ ] All interfaces have "I" prefix
- [ ] Component props interfaces end with "Props"
- [ ] CSS Modules use camelCase classes
- [ ] Mobile-first media queries
- [ ] Properties alphabetically sorted in SCSS
- [ ] ES6 imports (not require)
- [ ] Import order correct (external → internal → relative → styles)
- [ ] No `any` types used
- [ ] No magic numbers/strings (use constants/enums)
- [ ] Tests exist in `__tests__/` folder
- [ ] No cross-domain imports
- [ ] clsx for conditional classes

## Code Quality Principles

Fundamental principles that guide code design and implementation decisions. These principles complement the mechanical conventions above and help determine when to abstract, when to simplify, and how to balance consistency with pragmatism.

### 1. Readability First

**Code is read more than written**

- **Clear variable and function names** - Choose descriptive names that reveal intent
  - ✅ `const isUserAuthenticated = checkUserSession()`
  - ❌ `const x = check()`
- **Self-documenting code preferred over comments** - Code should explain what it does through structure and naming
  - Use comments for WHY, not WHAT
  - Domain logic and edge cases deserve explanation
- **Consistent formatting** - Follow ESLint/Prettier rules for uniform appearance
  - Enables faster comprehension
  - Reduces cognitive load during code review

**Application in this codebase:**
- Interface names with `I` prefix make types immediately recognizable
- PascalCase vs camelCase distinction clarifies components vs functions
- Domain folder structure makes file purpose obvious from location

### 2. KISS (Keep It Simple, Stupid)

**Simplest solution that works**

- **Avoid over-engineering** - Don't add complexity until proven necessary
  - Start with straightforward implementation
  - Refactor to patterns when duplication becomes painful
- **No premature optimization** - Optimize for readability first, performance second
  - Measure before optimizing
  - Simple code is easier to optimize later
- **Easy to understand > clever code** - Clarity beats brevity
  - ✅ Explicit conditional logic
  - ❌ Dense one-liners requiring mental parsing

**Application in this codebase:**
- Domain boundaries prevent tangled dependencies
- Server/client component separation keeps concerns focused
- CSS Modules scope styles naturally without complex naming schemes

### 3. DRY (Don't Repeat Yourself)

**Extract common logic into functions**

- **Create reusable components** - Shared UI patterns belong in common components
  - `src/common/ui-kit/` for cross-domain UI
  - Domain-specific components stay in their domain
- **Share utilities across modules** - Common operations get helper functions
  - `src/common/helpers/` for shared logic
  - `src/common/services/` for API integrations
- **Avoid copy-paste programming** - When you copy code the second time, extract it
  - Two instances: acceptable
  - Three instances: refactor into shared function/component

**Application in this codebase:**
- Contentful service provides single source of CMS queries
- CONFIG object centralizes environment variables
- `tryCatch` wrapper standardizes error handling
- Successful patterns documented in `.ai/patterns/` for reuse

### 4. YAGNI (You Aren't Gonna Need It)

**Don't build features before they're needed**

- **Avoid speculative generality** - Build for current requirements, not imagined future ones
  - ✅ Add flexibility when second use case appears
  - ❌ Generic solutions for single use case
- **Add complexity only when required** - Every abstraction has maintenance cost
  - Defer abstractions until pattern emerges
  - Delete unused code promptly
- **Start simple, refactor when needed** - Easy-to-change simple code beats hard-to-use complex code
  - Simple solutions adapt easily
  - Premature abstraction locks in assumptions

**Application in this codebase:**
- Components start in domain folders, move to common/ when reused
- Types defined inline until shared across files
- Feature flags and configurations added when requirements confirmed
- Domain-specific logic stays isolated until cross-domain need proven

**Balancing DRY vs YAGNI:**
- DRY says "eliminate duplication"
- YAGNI says "don't abstract prematurely"
- **Resolution**: Extract when you see the same code **three times** (Rule of Three)
  - First time: write it
  - Second time: duplicate it (wince)
  - Third time: refactor it

---