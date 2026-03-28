# AffiliateHub

## Current State
AffiliateHub is a live affiliate marketing website with hero, stats, offers, how-it-works, deals, CTA, and footer sections. Users can sign up/login via Internet Identity. After login, their principal ID shows in the navbar.

## Requested Changes (Diff)

### Add
- Personal dashboard page visible only to logged-in users
- Dashboard shows: welcome message with principal, affiliate links section (a list of generated unique affiliate links per offer), stats overview (clicks, earnings, active links)
- Each offer shows a unique referral link that user can copy
- A "My Dashboard" navigation link/button in navbar for logged-in users

### Modify
- Navbar: when logged in, add "Dashboard" button/link alongside Logout
- After login, optionally navigate user to dashboard

### Remove
- Nothing removed

## Implementation Plan
1. Create a `Dashboard` component in `src/frontend/src/components/Dashboard.tsx`
2. Add simple routing state in App.tsx (no router library needed -- just a `view` state: 'home' | 'dashboard')
3. Dashboard shows:
   - Welcome header with truncated principal
   - Stats cards: Total Links, Total Clicks (mock), Total Earnings (mock)
   - Table/list of affiliate links per offer (generate a mock unique link like `affiliatehub.app/ref/{shortId}/{offerSlug}`)
   - Copy-to-clipboard button for each link
4. Navbar: when logged in, show Dashboard button that switches view, plus Logout
5. On logout, return to home view
