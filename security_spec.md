# Security Specification for Dash Star Toys

## 1. Data Invariants
- A user can only access and modify their own wishlist, orders, and user profile data.
- Product reviews are readable by everyone, but only signed-in users can create reviews.
- When creating a review, `userId` must strictly equal `request.auth.uid`.
- Ratings must be between 1 and 5 stars.
- Comment text must be a valid string up to 2000 characters.

## 2. The Dirty Dozen Payloads & Guard Checks
1. Spoofed `userId` in review -> Rejected: `request.resource.data.userId != request.auth.uid`.
2. Rating out of bounds (< 1 or > 5) -> Rejected by rating validator `rating >= 1 && rating <= 5`.
3. Excessively long comments (> 2000 chars) -> Rejected by size check.
4. Unauthorized modification of another user's wishlist -> Rejected: `request.auth.uid != userId`.
5. Anonymous write when auth required -> Rejected by `isSignedIn()`.
