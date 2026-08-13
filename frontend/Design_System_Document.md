# VendSway - Design System Document

## Document Information

- **Project Name**: VendSway
- **Document Version**: 1.0
- **Date**: July 15, 2026
- **Purpose**: Complete design system reference for UI implementation
- **Status**: FINAL - Design language specification
- **Author**: Senior Product Designer and React UI Architect

---

# 1. Design Philosophy

## Core Design Principles

VendSway's design system is built on modern, premium e-commerce dashboard aesthetics with these foundational principles:

### Clarity Over Complexity
- Information hierarchy is clear and scannable
- Visual noise is minimized through intentional spacing
- Data is presented in digestible, actionable formats

### Purposeful Color
- Color is used strategically, not decoratively
- Semantic colors convey meaning (success, warning, error)
- Brand colors are used sparingly for emphasis

### Consistent Rhythm
- Spacing follows a mathematical scale
- Components align to a consistent grid
- Typography creates predictable visual flow

### Accessible by Default
- All color combinations meet WCAG 2.1 AA standards
- Interactive elements have clear focus states
- Content is navigable via keyboard

### Performance-First Visuals
- Lightweight visual treatments
- Optimized imagery and assets
- Smooth, purposeful animations

## Visual Personality

- **Modern**: Contemporary aesthetics with clean lines and ample whitespace
- **Premium**: Sophisticated color palette and refined typography
- **Data-Driven**: Information architecture optimized for decision-making
- **Trustworthy**: Professional, reliable appearance suitable for business contexts
- **Culturally Aware**: Design respects and celebrates regional diversity

---

# 2. Typography System

## Font Families

### Primary Font Family: Inter
**Use Cases**: Body text, UI elements, data displays
**Characteristics**: Clean, highly legible, excellent screen rendering
**Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Secondary Font Family: Poppins
**Use Cases**: Headings, display text, emphasis
**Characteristics**: Modern geometric sans-serif, distinctive personality
**Weights**: 500 (Medium), 600 (Semibold), 700 (Bold)

### Monospace Font Family: Fira Code
**Use Cases**: Code snippets, technical data, numbers in tables
**Characteristics**: Clear distinction between similar characters, excellent readability

## Type Scale

### Display Typography

```
Display Large: 48px / 56px line-height / -0.5px letter-spacing
Use Cases: Hero section titles, major page headings

Display Medium: 36px / 44px line-height / -0.3px letter-spacing
Use Cases: Section headers, card titles

Display Small: 30px / 38px line-height / -0.2px letter-spacing
Use Cases: Subsection headers, modal titles
```

### Heading Typography

```
H1: 28px / 36px line-height / -0.2px letter-spacing
Use Cases: Page titles, main section headings

H2: 24px / 32px line-height / -0.1px letter-spacing
Use Cases: Section headings, card group titles

H3: 20px / 28px line-height / 0px letter-spacing
Use Cases: Subsection headings, feature titles

H4: 18px / 24px line-height / 0px letter-spacing
Use Cases: Component headings, list titles
```

### Body Typography

```
Body Large: 16px / 24px line-height / 0px letter-spacing
Use Cases: Primary body text, descriptions

Body Regular: 14px / 20px line-height / 0px letter-spacing
Use Cases: Secondary body text, form labels

Body Small: 12px / 16px line-height / 0px letter-spacing
Use Cases: Captions, metadata, helper text
```

### Utility Typography

```
Caption: 11px / 14px line-height / 0.1px letter-spacing
Use Cases: Timestamps, status labels, fine print

Overline: 10px / 16px line-height / 0.15px letter-spacing / uppercase
Use Cases: Category labels, section headers, badges
```

## Typography Usage Guidelines

### Font Weight Hierarchy
- **Light (300)**: Rarely used, for large display text only
- **Regular (400)**: Body text, standard UI elements
- **Medium (500)**: Emphasized body text, buttons
- **Semibold (600)**: Headings, important labels
- **Bold (700)**: Strong emphasis, call-to-action elements

### Line Height Guidelines
- **Tight (1.1-1.2)**: Large headings, display text
- **Normal (1.4-1.5)**: Body text, standard UI
- **Loose (1.6-1.8)**: Long-form content, descriptions

### Letter Spacing
- **Negative (-0.5px to -0.1px)**: Large headings for tighter appearance
- **Normal (0px)**: Body text, standard UI
- **Positive (0.1px to 0.15px)**: Small text, uppercase text for readability

### Text Color Usage
- **Primary Text**: #171717 (near black) for main content
- **Secondary Text**: #525252 (medium gray) for supporting content
- **Tertiary Text**: #a3a3a3 (light gray) for metadata, captions
- **Disabled Text**: #d4d4d4 (very light gray) for disabled states

---

# 3. Color Palette

## Brand Colors

### Primary Brand Color: Coral Red
Inspired by fashion and commerce, conveying energy and action

```
Primary 50: #FEF2F2 (Lightest tint)
Primary 100: #FEE2E2
Primary 200: #FECACA
Primary 300: #FCA5A5
Primary 400: #F87171
Primary 500: #EF4444 (Primary brand color)
Primary 600: #DC2626 (Darkened for hover states)
Primary 700: #B91C1C
Primary 800: #991B1B
Primary 900: #7F1D1D (Darkest shade)
```

**Usage Guidelines**:
- Primary 500: Main CTAs, primary actions, brand accents
- Primary 600: Hover states for primary buttons
- Primary 50-100: Background tints, subtle highlights
- Primary 700-900: Dark mode equivalents, strong emphasis

### Secondary Brand Color: Ocean Blue
Complementary color for information and secondary actions

```
Secondary 50: #F0F9FF (Lightest tint)
Secondary 100: #E0F2FE
Secondary 200: #BAE6FD
Secondary 300: #7DD3FC
Secondary 400: #38BDF8
Secondary 500: #0EA5E9 (Secondary brand color)
Secondary 600: #0284C7 (Darkened for hover states)
Secondary 700: #0369A1
Secondary 800: #075985
Secondary 900: #0C4A6E (Darkest shade)
```

**Usage Guidelines**:
- Secondary 500: Secondary actions, informational elements
- Secondary 600: Hover states for secondary buttons
- Secondary 50-100: Background tints for information sections
- Secondary 700-900: Dark mode equivalents

## Neutral Colors

### Gray Scale
Provides structure and hierarchy without drawing attention

```
Gray 50: #FAFAFA (Background, very light surfaces)
Gray 100: #F5F5F5 (Light backgrounds, dividers)
Gray 200: #E5E5E5 (Borders, subtle dividers)
Gray 300: #D4D4D4 (Disabled borders, subtle text)
Gray 400: #A3A3A3 (Secondary text, placeholders)
Gray 500: #737373 (Tertiary text, icons)
Gray 600: #525252 (Secondary text, body text)
Gray 700: #404040 (Primary text, headings)
Gray 800: #262626 (Dark text, strong emphasis)
Gray 900: #171717 (Near black, primary text)
```

**Usage Guidelines**:
- Gray 50: Page backgrounds, card backgrounds
- Gray 100-200: Section backgrounds, subtle dividers
- Gray 300-400: Borders, disabled states
- Gray 500-600: Secondary text, icons
- Gray 700-800: Primary text, headings
- Gray 900: Near-black text, strong emphasis

## Semantic Colors

### Success Color: Emerald Green
Conveys positive outcomes, completed states

```
Success 50: #ECFDF5 (Lightest tint)
Success 100: #D1FAE5
Success 200: #A7F3D0
Success 300: #6EE7B7
Success 400: #34D399
Success 500: #10B981 (Primary success color)
Success 600: #059669 (Darkened for hover)
Success 700: #047857
Success 800: #065F46
Success 900: #064E3B (Darkest shade)
```

**Usage Guidelines**:
- Success 500: Success messages, completed states
- Success 600: Hover states for success actions
- Success 50-100: Background tints for success sections
- Success badges, checkmarks, positive indicators

### Warning Color: Amber Orange
Conveys caution, attention needed

```
Warning 50: #FFFBEB (Lightest tint)
Warning 100: #FEF3C7
Warning 200: #FDE68A
Warning 300: #FCD34D
Warning 400: #FBBF24
Warning 500: #F59E0B (Primary warning color)
Warning 600: #D97706 (Darkened for hover)
Warning 700: #B45309
Warning 800: #92400E
Warning 900: #78350F (Darkest shade)
```

**Usage Guidelines**:
- Warning 500: Warning messages, attention states
- Warning 600: Hover states for warning actions
- Warning 50-100: Background tints for warning sections
- Warning badges, alerts, caution indicators

### Error Color: Rose Red
Conveys errors, destructive actions, critical states

```
Error 50: #FEF2F2 (Lightest tint)
Error 100: #FEE2E2
Error 200: #FECACA
Error 300: #FCA5A5
Error 400: #F87171
Error 500: #EF4444 (Primary error color)
Error 600: #DC2626 (Darkened for hover)
Error 700: #B91C1C
Error 800: #991B1B
Error 900: #7F1D1B (Darkest shade)
```

**Usage Guidelines**:
- Error 500: Error messages, destructive actions
- Error 600: Hover states for error actions
- Error 50-100: Background tints for error sections
- Error badges, critical alerts, failure states

### Info Color: Sky Blue
Conveys informational content, neutral states

```
Info 50: #F0F9FF (Lightest tint)
Info 100: #E0F2FE
Info 200: #BAE6FD
Info 300: #7DD3FC
Info 400: #38BDF8
Info 500: #0EA5E9 (Primary info color)
Info 600: #0284C7 (Darkened for hover)
Info 700: #0369A1
Info 800: #075985
Info 900: #0C4A6E (Darkest shade)
```

**Usage Guidelines**:
- Info 500: Informational messages, neutral states
- Info 600: Hover states for info actions
- Info 50-100: Background tints for info sections
- Info badges, informational indicators

## Color Usage Guidelines

### Color Contrast Requirements
- **Normal Text**: Minimum 4.5:1 contrast ratio against background
- **Large Text**: Minimum 3:1 contrast ratio against background
- **UI Components**: Minimum 3:1 contrast ratio for interactive elements

### Color Hierarchy
1. **Brand Colors**: Use sparingly for emphasis and CTAs
2. **Semantic Colors**: Use for status and feedback
3. **Neutral Colors**: Use for structure and content
4. **Tints**: Use for backgrounds and subtle accents

### Color Combinations to Avoid
- Red text on green background (color blindness issues)
- Green text on red background (color blindness issues)
- Pure black (#000000) on pure white (#FFFFFF) (too harsh)
- Low contrast combinations (below WCAG standards)

---

# 4. Spacing Scale

## Spacing Philosophy

VendSway uses a mathematical spacing scale based on powers of two, ensuring consistent rhythm and predictable visual relationships throughout the interface.

## Spacing Scale

```
Space 0: 0px (No spacing)
Space 1: 4px (Micro spacing - tight elements)
Space 2: 8px (Extra small spacing - related elements)
Space 3: 12px (Small spacing - grouped elements)
Space 4: 16px (Base spacing - standard spacing)
Space 5: 20px (Medium spacing - section separation)
Space 6: 24px (Large spacing - content groups)
Space 8: 32px (Extra large spacing - major sections)
Space 10: 40px (Huge spacing - page sections)
Space 12: 48px (Massive spacing - page layout)
Space 16: 64px (Giant spacing - major layout divisions)
Space 20: 80px (Colossal spacing - hero sections)
Space 24: 96px (Maximum spacing - page-level divisions)
```

## Spacing Usage Guidelines

### Component Internal Spacing
- **Tight Components**: Space 2-3 (8-12px) - Buttons, badges, small cards
- **Standard Components**: Space 4 (16px) - Form inputs, standard cards
- **Loose Components**: Space 5-6 (20-24px) - Large cards, panels

### Component External Spacing
- **Related Components**: Space 4 (16px) - Grouped items
- **Section Separation**: Space 6-8 (24-32px) - Content sections
- **Major Divisions**: Space 10-12 (40-48px) - Page sections

### Layout Spacing
- **Page Margins**: Space 6-8 (24-32px) - Standard page margins
- **Section Margins**: Space 8-10 (32-40px) - Major section margins
- **Hero Spacing**: Space 12-16 (48-64px) - Hero section spacing

### Grid Spacing
- **Tight Grid**: Space 3-4 (12-16px) - Dense grids
- **Standard Grid**: Space 4-6 (16-24px) - Standard grids
- **Loose Grid**: Space 6-8 (24-32px) - Featured grids

### Typography Spacing
- **Line Height**: 1.4-1.6 for body text, 1.1-1.2 for headings
- **Paragraph Spacing**: Space 4-6 (16-24px) between paragraphs
- **List Item Spacing**: Space 2-3 (8-12px) between list items

---

# 5. Border Radius System

## Border Radius Philosophy

Border radius values create visual softness and modernity while maintaining clarity. The system uses a consistent scale that balances approachability with professionalism.

## Border Radius Scale

```
None: 0px (Sharp corners - technical elements)
Small: 2px (Subtle rounding - standard UI)
Default: 4px (Standard rounding - cards, buttons)
Medium: 6px (Moderate rounding - larger cards)
Large: 8px (Significant rounding - featured elements)
XL: 12px (Extra large rounding - hero elements)
2XL: 16px (Very large rounding - special elements)
Full: 9999px (Fully rounded - badges, pills, avatars)
```

## Border Radius Usage Guidelines

### Component-Specific Border Radius

**Buttons**
- Primary/Secondary Buttons: Default (4px)
- Ghost/Text Buttons: Small (2px)
- Icon Buttons: Full (9999px) or Default (4px)

**Cards**
- Standard Cards: Default (4px)
- Feature Cards: Medium (6px)
- Hero Cards: Large (8px)

**Inputs**
- Text Inputs: Default (4px)
- Select Dropdowns: Default (4px)
- Search Inputs: Medium (6px)

**Badges & Tags**
- Status Badges: Full (9999px)
- Category Tags: Full (9999px)
- Notification Badges: Full (9999px)

**Modals**
- Standard Modals: Large (8px)
- Dialog Modals: Medium (6px)
- Alert Modals: Default (4px)

**Avatars**
- User Avatars: Full (9999px)
- Organization Logos: Small (2px) or Default (4px)

**Tables**
- Table Cells: None (0px)
- Table Headers: Small (2px) top only
- Table Containers: Default (4px)

### Border Radius Combinations

**Consistent Grouping**
- Use the same border radius for related elements
- Example: All cards in a grid use the same radius

**Hierarchy Through Radius**
- Larger radius for more prominent elements
- Smaller radius for less prominent elements

**Special Cases**
- Sharp corners (0px) for technical/data elements
- Fully rounded for badges, tags, and circular elements

---

# 6. Elevation & Shadow System

## Elevation Philosophy

Elevation creates visual hierarchy through depth, helping users understand the relative importance and interactivity of elements. The system uses subtle, sophisticated shadows that enhance without overwhelming.

## Shadow Scale

```
Shadow XS: 0 1px 2px 0 rgb(0 0 0 / 0.05)
Use Cases: Subtle elevation, hover states, tooltips

Shadow SM: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
Use Cases: Cards, buttons, dropdowns

Shadow DEFAULT: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
Use Cases: Standard cards, panels, modals

Shadow MD: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
Use Cases: Elevated cards, dropdowns, popovers

Shadow LG: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
Use Cases: Modals, drawers, elevated panels

Shadow XL: 0 25px 50px -12px rgb(0 0 0 / 0.25)
Use Cases: Hero elements, major modals, overlays

Inner Shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05)
Use Cases: Inset elements, pressed states
```

## Elevation Usage Guidelines

### Elevation Levels

**Level 0 (No Shadow)**
- Base page elements
- Background elements
- Non-interactive content

**Level 1 (Shadow XS)**
- Hover states for buttons
- Tooltips
- Small interactive elements

**Level 2 (Shadow SM)**
- Standard cards
- Buttons (default state)
- Dropdown menus

**Level 3 (Shadow DEFAULT)**
- Featured cards
- Panels
- Small modals

**Level 4 (Shadow MD)**
- Elevated cards
- Navigation dropdowns
- Popovers

**Level 5 (Shadow LG)**
- Standard modals
- Drawers
- Sidebars

**Level 6 (Shadow XL)**
- Hero elements
- Major modals
- Overlays

### Shadow Color Guidelines

**Light Mode**
- Use rgba(0, 0, 0, opacity) for shadows
- Opacity ranges from 0.05 to 0.25
- Lower opacity for subtle elevation
- Higher opacity for strong elevation

**Dark Mode**
- Use rgba(0, 0, 0, opacity) with higher opacity
- Opacity ranges from 0.1 to 0.4
- Consider using lighter shadow colors for contrast

### Shadow Animation

**Hover States**
- Transition from no shadow to Shadow SM
- Duration: 150-200ms
- Easing: ease-out

**Focus States**
- Add colored shadow (brand color) in addition to elevation shadow
- Duration: 150-200ms
- Easing: ease-out

**Active States**
- Reduce shadow or use inner shadow
- Duration: 100ms
- Easing: ease-in

---

# 7. Grid System

## Grid Philosophy

The grid system provides structure and consistency across all layouts, ensuring alignment and visual harmony while maintaining flexibility for diverse content types.

## Grid Configuration

### Base Grid
- **Columns**: 12 columns
- **Gutter**: 24px (Space 6)
- **Margin**: 32px (Space 8) on desktop, 16px (Space 4) on mobile
- **Max Width**: 1280px (2XL breakpoint)

### Column Widths
```
1 Column: Full width (100%)
2 Columns: 50% each
3 Columns: 33.33% each
4 Columns: 25% each
6 Columns: 16.66% each
12 Columns: 8.33% each
```

## Responsive Grid Behavior

### Mobile (Default - < 640px)
- **Columns**: 1-2 columns
- **Gutter**: 16px (Space 4)
- **Margin**: 16px (Space 4)

### Tablet (640px - 1024px)
- **Columns**: 2-3 columns
- **Gutter**: 20px (Space 5)
- **Margin**: 24px (Space 6)

### Desktop (1024px - 1280px)
- **Columns**: 3-4 columns
- **Gutter**: 24px (Space 6)
- **Margin**: 32px (Space 8)

### Large Desktop (> 1280px)
- **Columns**: 4-6 columns
- **Gutter**: 24px (Space 6)
- **Margin**: 32px (Space 8)
- **Max Width**: 1280px centered

## Grid Usage Patterns

### Standard Card Grid
```
Mobile: 1 column
Tablet: 2 columns
Desktop: 3 columns
Large Desktop: 4 columns
```

### Dense Card Grid
```
Mobile: 2 columns
Tablet: 3 columns
Desktop: 4 columns
Large Desktop: 6 columns
```

### Feature Grid
```
Mobile: 1 column
Tablet: 2 columns
Desktop: 2 columns (spanning)
Large Desktop: 3 columns
```

### Dashboard Grid
```
Mobile: 1 column
Tablet: 2 columns
Desktop: 3 columns (with sidebar)
Large Desktop: 4 columns (with sidebar)
```

## Grid Alignment

### Horizontal Alignment
- **Left Aligned**: Standard for most content
- **Center Aligned**: Hero sections, featured content
- **Right Aligned**: Rare, for specific design needs

### Vertical Alignment
- **Top Aligned**: Standard for card grids
- **Middle Aligned**: Feature sections, hero content
- **Bottom Aligned**: Footer content, call-to-action sections

---

# 8. Breakpoints

## Breakpoint Philosophy

Breakpoints are based on common device sizes and use cases, ensuring responsive behavior across all screen sizes while maintaining design integrity.

## Breakpoint Scale

```
XS: 0px - 639px (Mobile portrait)
SM: 640px - 767px (Mobile landscape)
MD: 768px - 1023px (Tablet portrait)
LG: 1024px - 1279px (Tablet landscape, small desktop)
XL: 1280px - 1535px (Desktop)
2XL: 1536px+ (Large desktop)
```

## Breakpoint Usage Guidelines

### Mobile First Approach
- Design for mobile (XS) as base
- Enhance for larger breakpoints
- Use min-width media queries

### Content Adaptation
- **XS**: Single column, simplified navigation, stacked content
- **SM**: 1-2 columns, horizontal navigation possible
- **MD**: 2-3 columns, standard navigation
- **LG**: 3-4 columns, full navigation
- **XL**: 4-6 columns, enhanced layouts
- **2XL**: Maximum columns, premium layouts

### Component Behavior
- **Navigation**: Hamburger menu (XS) → Horizontal menu (MD+)
- **Tables**: Horizontal scroll (XS) → Full width (MD+)
- **Cards**: 1 column (XS) → 2 columns (SM) → 3-4 columns (LG+)
- **Modals**: Full screen (XS) → Centered (MD+)

---

# 9. Animation Guidelines

## Animation Philosophy

Animations should enhance user experience without causing distraction or performance issues. All animations follow principles of purposeful motion, smooth transitions, and respect for user preferences.

## Animation Principles

### Purposeful Motion
- Every animation should have a clear purpose
- Avoid decorative animations that don't add value
- Use animation to guide attention and provide feedback

### Smooth Transitions
- Use easing functions that feel natural
- Avoid abrupt or jarring movements
- Maintain consistent timing across similar interactions

### Performance First
- Use CSS transforms and opacity for smooth animations
- Avoid animating layout properties (width, height)
- Respect reduced motion preferences

## Animation Duration

```
Instant: 0ms (No animation - for instant feedback)
Fast: 150ms (Micro interactions - hover states)
Standard: 200ms (Standard interactions - button clicks)
Slow: 300ms (Complex interactions - modal open)
Very Slow: 500ms (Major transitions - page transitions)
```

## Animation Easing

```
Ease Out: cubic-bezier(0.4, 0, 0.2, 1)
Use Cases: Standard transitions, hover states

Ease In: cubic-bezier(0.4, 0, 1, 1)
Use Cases: Elements entering screen

Ease In Out: cubic-bezier(0.4, 0, 0.2, 1)
Use Cases: Modal transitions, complex animations

Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
Use Cases: Special emphasis, attention-grabbing elements
```

## Animation Types

### Micro Interactions
- **Button Hover**: Scale 1.02, shadow increase, 150ms ease-out
- **Button Click**: Scale 0.98, 100ms ease-in
- **Link Hover**: Color transition, 150ms ease-out
- **Input Focus**: Border color transition, 150ms ease-out

### Component Transitions
- **Modal Open**: Fade in + scale up, 300ms ease-out
- **Modal Close**: Fade out + scale down, 200ms ease-in
- **Dropdown Open**: Fade in + slide down, 200ms ease-out
- **Dropdown Close**: Fade out + slide up, 150ms ease-in

### Page Transitions
- **Page Load**: Fade in, 300ms ease-out
- **Page Transition**: Fade out + fade in, 500ms ease-in-out
- **Section Scroll**: Fade in, 400ms ease-out

### Loading States
- **Spinner**: Rotate animation, 1s linear infinite
- **Skeleton**: Shimmer effect, 1.5s ease-in-out infinite
- **Progress Bar**: Width transition, 300ms ease-out

### Data Updates
- **List Item Addition**: Slide in + fade in, 300ms ease-out
- **List Item Removal**: Slide out + fade out, 200ms ease-in
- **Value Change**: Color transition, 200ms ease-out

## Accessibility Considerations

### Reduced Motion
- Respect `prefers-reduced-motion` media query
- Disable or simplify animations for users who prefer reduced motion
- Provide static alternatives for animated content

### Animation Triggers
- Avoid auto-playing animations
- Provide controls for animation playback
- Ensure animations can be paused or stopped

---

# 10. Icon Usage Guidelines

## Icon Philosophy

Icons should be clear, consistent, and meaningful. They enhance comprehension without replacing text labels. The icon system uses Lucide React for consistency and reliability.

## Icon Style

### Visual Characteristics
- **Stroke Width**: 2px (standard), 1.5px (delicate), 2.5px (bold)
- **Corner Radius**: Small (2px) for softness
- **Style**: Outline (primary), Filled (secondary)
- **Size**: Consistent within context

### Icon Sizes

```
XS: 16px (12px grid) - Compact icons, inline with text
SM: 20px (16px grid) - Standard icons, buttons
MD: 24px (20px grid) - Large icons, cards
LG: 32px (24px grid) - Feature icons, headers
XL: 48px (32px grid) - Hero icons, illustrations
```

## Icon Categories

### Navigation Icons
- **Home**: Home icon for dashboard
- **Map**: Map icon for regional intelligence
- **Chart**: Chart icon for analytics
- **Users**: Users icon for seller discovery
- **Settings**: Settings icon for configuration

### Action Icons
- **Add**: Plus icon for adding items
- **Edit**: Pencil icon for editing
- **Delete**: Trash icon for deleting
- **Search**: Search icon for search
- **Filter**: Filter icon for filtering

### Status Icons
- **Check**: Checkmark for success
- **X**: X icon for error/close
- **Alert**: Alert icon for warnings
- **Info**: Info icon for information
- **Loading**: Spinner for loading states

### Content Icons
- **Folder**: Folder icon for categories
- **File**: File icon for documents
- **Image**: Image icon for media
- **Link**: Link icon for URLs
- **Tag**: Tag icon for labels

## Icon Usage Guidelines

### With Text Labels
- **Primary**: Icon + text label (icon left of text)
- **Secondary**: Text label + icon (icon right of text)
- **Spacing**: 8px (Space 2) between icon and text

### Standalone Icons
- **Context**: Ensure meaning is clear from context
- **Tooltips**: Provide tooltips for ambiguous icons
- **Size**: Use appropriate size for importance

### Icon States
- **Default**: Standard color (Gray 500)
- **Hover**: Brand color (Primary 500)
- **Active**: Darkened brand color (Primary 600)
- **Disabled**: Gray 300

### Icon Combinations
- **Avoid**: Multiple icons in close proximity
- **Group**: Related icons together
- **Align**: Align icons with text baseline

---

# 11. Card Design

## Card Philosophy

Cards are the primary container for content, providing structure and hierarchy. They should be clean, scannable, and purposeful.

## Card Structure

### Standard Card
```
Container (Border Radius: Default, Shadow: SM)
├── Header (Optional)
│   ├── Title (H4 or H3)
│   └── Actions (Optional)
├── Body (Required)
│   └── Content
└── Footer (Optional)
    └── Actions or Metadata
```

### Compact Card
```
Container (Border Radius: Default, Shadow: XS)
├── Body (Required)
│   ├── Title (H4)
│   └── Content
```

## Card Spacing

### Internal Spacing
- **Header Padding**: Space 4 (16px)
- **Body Padding**: Space 4 (16px)
- **Footer Padding**: Space 4 (16px)
- **Header-Bottom Border**: Space 0 (no extra spacing)

### External Spacing
- **Card Grid Gap**: Space 4-6 (16-24px)
- **Card Margin**: Space 0 (use grid gap instead)

## Card Styles

### Default Card
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 200 (#E5E5E5)
- **Border Radius**: Default (4px)
- **Shadow**: SM (hover: DEFAULT)
- **Padding**: Space 4 (16px)

### Elevated Card
- **Background**: White (#FFFFFF)
- **Border**: None
- **Border Radius**: Medium (6px)
- **Shadow**: DEFAULT (hover: MD)
- **Padding**: Space 4-6 (16-24px)

### Featured Card
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Primary 200 (#FECACA)
- **Border Radius**: Large (8px)
- **Shadow**: DEFAULT (hover: LG)
- **Padding**: Space 6 (24px)

### Interactive Card
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 200 (#E5E5E5)
- **Border Radius**: Default (4px)
- **Shadow**: SM (hover: DEFAULT)
- **Cursor**: Pointer
- **Transition**: All 150ms ease-out

## Card Content Guidelines

### Card Titles
- **Typography**: H4 (18px) or H3 (20px)
- **Color**: Gray 900 (#171717)
- **Weight**: Semibold (600)
- **Spacing**: Space 2-3 (8-12px) below title

### Card Body
- **Typography**: Body Large (16px) or Body Regular (14px)
- **Color**: Gray 600 (#525252) for primary, Gray 500 (#737373) for secondary
- **Line Height**: 1.5 for readability
- **Spacing**: Space 2-3 (8-12px) between paragraphs

### Card Footer
- **Typography**: Body Small (12px) or Caption (11px)
- **Color**: Gray 500 (#737373)
- **Alignment**: Right or left depending on content
- **Spacing**: Space 3-4 (12-16px) above footer

---

# 12. Button Styles

## Button Philosophy

Buttons are primary interaction points. They should be clear, accessible, and provide immediate visual feedback. The button system ensures consistency across all interactions.

## Button Hierarchy

### Primary Button
- **Use Cases**: Main CTAs, primary actions, form submissions
- **Visual Weight**: High
- **Frequency**: Use sparingly for emphasis

### Secondary Button
- **Use Cases**: Secondary actions, alternative options
- **Visual Weight**: Medium
- **Frequency**: Use for secondary actions

### Ghost Button
- **Use Cases**: Tertiary actions, less prominent options
- **Visual Weight**: Low
- **Frequency**: Use for subtle interactions

### Text Button
- **Use Cases**: Inline actions, links that look like buttons
- **Visual Weight**: Very Low
- **Frequency**: Use for subtle, contextual actions

## Button Styles

### Primary Button
- **Background**: Primary 500 (#EF4444)
- **Text**: White (#FFFFFF)
- **Border**: None
- **Border Radius**: Default (4px)
- **Padding**: Space 3-4 (12-16px) vertical, Space 6 (24px) horizontal
- **Typography**: Body Regular (14px), Semibold (600)
- **Shadow**: SM
- **Hover**: Primary 600 (#DC2626), Shadow DEFAULT
- **Active**: Primary 700 (#B91C1C), Shadow XS
- **Disabled**: Gray 300 (#D4D4D4) background, Gray 500 (#737373) text

### Secondary Button
- **Background**: White (#FFFFFF)
- **Text**: Primary 500 (#EF4444)
- **Border**: 1px solid Primary 500 (#EF4444)
- **Border Radius**: Default (4px)
- **Padding**: Space 3-4 (12-16px) vertical, Space 6 (24px) horizontal
- **Typography**: Body Regular (14px), Semibold (600)
- **Shadow**: XS
- **Hover**: Primary 50 (#FEF2F2) background, Shadow SM
- **Active**: Primary 100 (#FEE2E2) background
- **Disabled**: Gray 200 (#E5E5E5) border, Gray 400 (#A3A3A3) text

### Ghost Button
- **Background**: Transparent
- **Text**: Gray 700 (#404040)
- **Border**: None
- **Border Radius**: Default (4px)
- **Padding**: Space 3-4 (12-16px) vertical, Space 6 (24px) horizontal
- **Typography**: Body Regular (14px), Medium (500)
- **Shadow**: None
- **Hover**: Gray 100 (#F5F5F5) background
- **Active**: Gray 200 (#E5E5E5) background
- **Disabled**: Gray 400 (#A3A3A3) text

### Text Button
- **Background**: Transparent
- **Text**: Primary 500 (#EF4444)
- **Border**: None
- **Border Radius**: Small (2px)
- **Padding**: Space 2-3 (8-12px) vertical, Space 3-4 (12-16px) horizontal
- **Typography**: Body Regular (14px), Medium (500)
- **Shadow**: None
- **Hover**: Primary 600 (#DC2626) text
- **Active**: Primary 700 (#B91C1C) text
- **Disabled**: Gray 400 (#A3A3A3) text

## Button Sizes

### Small Button
- **Height**: 32px
- **Padding**: Space 2 (8px) vertical, Space 4 (16px) horizontal
- **Typography**: Body Small (12px)
- **Icon Size**: 16px

### Medium Button (Default)
- **Height**: 40px
- **Padding**: Space 3-4 (12-16px) vertical, Space 6 (24px) horizontal
- **Typography**: Body Regular (14px)
- **Icon Size**: 20px

### Large Button
- **Height**: 48px
- **Padding**: Space 4-5 (16-20px) vertical, Space 8 (32px) horizontal
- **Typography**: Body Large (16px)
- **Icon Size**: 24px

## Button with Icons

### Icon + Text
- **Icon Position**: Left of text
- **Spacing**: Space 2 (8px) between icon and text
- **Icon Size**: Match button size guidelines

### Text + Icon
- **Icon Position**: Right of text
- **Spacing**: Space 2 (8px) between text and icon
- **Icon Size**: Match button size guidelines

### Icon Only
- **Icon Position**: Centered
- **Padding**: Square (equal horizontal and vertical)
- **Icon Size**: Match button size guidelines

## Button States

### Focus State
- **Outline**: 2px solid Primary 500 (#EF4444)
- **Offset**: 2px outside button
- **Duration**: 150ms ease-out

### Loading State
- **Content**: Replace with spinner
- **Spinner**: Primary 500 (#EF4444)
- **Disabled**: True during loading
- **Cursor**: Not allowed

### Success State
- **Background**: Success 500 (#10B981)
- **Text**: White (#FFFFFF)
- **Icon**: Checkmark
- **Duration**: 2 seconds, then revert

### Error State
- **Background**: Error 500 (#EF4444)
- **Text**: White (#FFFFFF)
- **Icon**: X or Alert
- **Duration**: Until dismissed

---

# 13. Input Styles

## Input Philosophy

Inputs should be clear, accessible, and provide immediate feedback. The input system ensures consistency across all form elements while maintaining flexibility for different use cases.

## Input Structure

### Standard Input
```
Container
├── Label (Optional)
├── Input Field
│   ├── Placeholder
│   ├── Value
│   └── Icon (Optional)
└── Helper Text (Optional)
    ├── Validation Message
    └── Character Count
```

## Input Styles

### Default Input
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 300 (#D4D4D4)
- **Border Radius**: Default (4px)
- **Padding**: Space 3 (12px) vertical, Space 4 (16px) horizontal
- **Typography**: Body Regular (14px)
- **Text Color**: Gray 900 (#171717)
- **Placeholder Color**: Gray 400 (#A3A3A3)
- **Focus**: Primary 500 (#EF4444) border, Shadow XS
- **Hover**: Gray 400 (#A3A3A3) border
- **Disabled**: Gray 100 (#F5F5F5) background, Gray 300 (#D4D4D4) border
- **Error**: Error 500 (#EF4444) border
- **Success**: Success 500 (#10B981) border

### Search Input
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 300 (#D4D4D4)
- **Border Radius**: Medium (6px)
- **Padding**: Space 3 (12px) vertical, Space 4 (16px) horizontal + Space 8 (32px) for icon
- **Typography**: Body Regular (14px)
- **Icon**: Search icon, left side, Gray 400 (#A3A3A3)
- **Focus**: Primary 500 (#EF4444) border, icon color Primary 500 (#EF4444)

### Textarea
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 300 (#D4D4D4)
- **Border Radius**: Default (4px)
- **Padding**: Space 3 (12px) vertical, Space 4 (16px) horizontal
- **Typography**: Body Regular (14px)
- **Min Height**: 80px
- **Resize**: Vertical only

### Select Dropdown
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 300 (#D4D4D4)
- **Border Radius**: Default (4px)
- **Padding**: Space 3 (12px) vertical, Space 4 (16px) horizontal + Space 8 (32px) for chevron
- **Typography**: Body Regular (14px)
- **Icon**: Chevron down, right side, Gray 400 (#A3A3A3)
- **Focus**: Primary 500 (#EF4444) border

## Input Sizes

### Small Input
- **Height**: 32px
- **Padding**: Space 2 (8px) vertical, Space 3 (12px) horizontal
- **Typography**: Body Small (12px)
- **Icon Size**: 16px

### Medium Input (Default)
- **Height**: 40px
- **Padding**: Space 3 (12px) vertical, Space 4 (16px) horizontal
- **Typography**: Body Regular (14px)
- **Icon Size**: 20px

### Large Input
- **Height**: 48px
- **Padding**: Space 4 (16px) vertical, Space 5 (20px) horizontal
- **Typography**: Body Large (16px)
- **Icon Size**: 24px

## Input Labels

### Label Style
- **Typography**: Body Regular (14px), Medium (500)
- **Color**: Gray 700 (#404040)
- **Spacing**: Space 2 (8px) below label
- **Required Indicator**: Asterisk, Error 500 (#EF4444)

### Helper Text
- **Typography**: Body Small (12px)
- **Color**: Gray 500 (#737373)
- **Spacing**: Space 2 (8px) above helper text
- **Error Text**: Error 500 (#EF4444)
- **Success Text**: Success 500 (#10B981)

## Input States

### Focus State
- **Border**: Primary 500 (#EF4444), 2px
- **Shadow**: 0 0 0 3px Primary 100 (#FEE2E2)
- **Transition**: 150ms ease-out

### Error State
- **Border**: Error 500 (#EF4444)
- **Shadow**: 0 0 0 3px Error 100 (#FEE2E2)
- **Helper Text**: Error message in Error 500 (#EF4444)
- **Icon**: Error icon, Error 500 (#EF4444)

### Success State
- **Border**: Success 500 (#10B981)
- **Shadow**: 0 0 0 3px Success 100 (#D1FAE5)
- **Helper Text**: Success message in Success 500 (#10B981)
- **Icon**: Checkmark icon, Success 500 (#10B981)

### Disabled State
- **Background**: Gray 100 (#F5F5F5)
- **Border**: Gray 200 (#E5E5E5)
- **Text**: Gray 400 (#A3A3A3)
- **Cursor**: Not allowed

---

# 14. Table Styles

## Table Philosophy

Tables should present data clearly and scannably. The table system prioritizes readability, hierarchy, and interaction while maintaining visual consistency.

## Table Structure

### Standard Table
```
Container
├── Table Header
│   ├── Sortable Headers
│   └── Filters (Optional)
├── Table Body
│   ├── Rows
│   └── Cells
└── Table Footer (Optional)
    ├── Pagination
    └── Summary
```

## Table Styles

### Container
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 200 (#E5E5E5)
- **Border Radius**: Default (4px)
- **Shadow**: SM
- **Overflow**: Horizontal scroll on mobile

### Table Header
- **Background**: Gray 50 (#FAFAFA)
- **Border Bottom**: 1px solid Gray 200 (#E5E5E5)
- **Typography**: Body Small (12px), Semibold (600), Uppercase
- **Color**: Gray 600 (#525252)
- **Padding**: Space 3-4 (12-16px) vertical, Space 4 (16px) horizontal
- **Text Align**: Left (default), Right for numbers

### Table Body
- **Background**: White (#FFFFFF)
- **Typography**: Body Regular (14px)
- **Color**: Gray 700 (#404040)
- **Padding**: Space 3-4 (12-16px) vertical, Space 4 (16px) horizontal
- **Border Bottom**: 1px solid Gray 100 (#F5F5F5)

### Table Row
- **Hover**: Gray 50 (#FAFAFA) background
- **Selected**: Primary 50 (#FEF2F2) background
- **Transition**: Background color 150ms ease-out

### Table Cell
- **Typography**: Body Regular (14px)
- **Color**: Gray 700 (#404040)
- **Vertical Align**: Middle
- **Text Align**: Left (default), Right for numbers, Center for status

## Table States

### Sortable Header
- **Default**: Gray 400 (#A3A3A3) sort icon
- **Hover**: Gray 600 (#525252) sort icon
- **Active**: Primary 500 (#EF4444) sort icon
- **Cursor**: Pointer

### Status Cell
- **Badge**: Full rounded badge
- **Padding**: Space 1-2 (4-8px) vertical, Space 2-3 (8-12px) horizontal
- **Typography**: Caption (11px), Medium (500)
- **Colors**: Based on status (Success, Warning, Error, Info)

### Action Cell
- **Buttons**: Ghost or Text buttons
- **Icons**: Gray 500 (#737373)
- **Hover**: Primary 500 (#EF4444)
- **Spacing**: Space 2 (8px) between actions

## Table Variants

### Compact Table
- **Row Height**: 40px
- **Padding**: Space 2-3 (8-12px) vertical, Space 3-4 (12-16px) horizontal
- **Typography**: Body Small (12px)

### Standard Table (Default)
- **Row Height**: 48px
- **Padding**: Space 3-4 (12-16px) vertical, Space 4 (16px) horizontal
- **Typography**: Body Regular (14px)

### Spacious Table
- **Row Height**: 56px
- **Padding**: Space 4-5 (16-20px) vertical, Space 5-6 (20-24px) horizontal
- **Typography**: Body Large (16px)

---

# 15. Dashboard Design

## Dashboard Philosophy

Dashboards should present information at a glance, enabling quick decision-making. The dashboard system prioritizes hierarchy, scannability, and actionability.

## Dashboard Structure

### Standard Dashboard Layout
```
Header
├── Logo
├── Navigation
└── User Menu

Sidebar (Optional)
├── Navigation Items
└── Filters

Main Content
├── Summary Cards
├── Charts/Visualizations
├── Data Tables
└── Action Panels
```

## Dashboard Components

### Summary Cards
- **Purpose**: High-level metrics at a glance
- **Layout**: Grid of 2-4 cards
- **Height**: Consistent (120-140px)
- **Content**: Label, Value, Trend, Icon
- **Style**: Elevated card with subtle shadow

### Charts/Visualizations
- **Purpose**: Data visualization and trends
- **Types**: Line charts, bar charts, pie charts
- **Height**: 300-400px
- **Style**: Clean, minimal grid lines
- **Colors**: Brand colors with semantic variations

### Data Tables
- **Purpose**: Detailed data view
- **Features**: Sorting, filtering, pagination
- **Style**: Standard table with hover states
- **Actions**: Row actions, bulk actions

### Action Panels
- **Purpose**: Quick actions and filters
- **Style**: Card with form elements
- **Position**: Right sidebar or top panel

## Dashboard Spacing

### Section Spacing
- **Header to Content**: Space 8 (32px)
- **Summary to Charts**: Space 6 (24px)
- **Charts to Tables**: Space 6 (24px)
- **Table to Footer**: Space 8 (32px)

### Component Spacing
- **Summary Cards**: Space 4 (16px) gap
- **Chart Panels**: Space 4 (16px) gap
- **Table Containers**: Space 6 (24px) margin

---

# 16. Navigation Design

## Navigation Philosophy

Navigation should be intuitive, consistent, and provide clear indication of current location. The navigation system ensures users can move through the application efficiently.

## Navigation Types

### Top Navigation
- **Use Cases**: Primary navigation, main menu
- **Position**: Fixed at top
- **Style**: Horizontal menu with dropdowns
- **Height**: 64px

### Sidebar Navigation
- **Use Cases**: Secondary navigation, admin panels
- **Position**: Fixed left
- **Style**: Vertical menu with icons
- **Width**: 240px (collapsed: 64px)

### Breadcrumb Navigation
- **Use Cases**: Hierarchical navigation, deep pages
- **Position**: Below header
- **Style**: Horizontal breadcrumb trail
- **Height**: 32px

### Tab Navigation
- **Use Cases**: Content organization, parallel views
- **Position**: Above content
- **Style**: Horizontal tabs with underline
- **Height**: 48px

## Navigation Styles

### Navigation Item
- **Typography**: Body Regular (14px), Medium (500)
- **Color**: Gray 600 (#525252)
- **Padding**: Space 3-4 (12-16px) vertical, Space 4 (16px) horizontal
- **Border Radius**: Small (2px)
- **Hover**: Gray 100 (#F5F5F5) background, Gray 900 (#171717) text
- **Active**: Primary 50 (#FEF2F2) background, Primary 600 (#DC2626) text
- **Focus**: 2px Primary 500 (#EF4444) outline

### Navigation with Icon
- **Icon Size**: 20px
- **Icon Color**: Gray 500 (#737373)
- **Spacing**: Space 2 (8px) between icon and text
- **Active Icon**: Primary 500 (#EF4444)

### Dropdown Menu
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 200 (#E5E5E5)
- **Border Radius**: Default (4px)
- **Shadow**: MD
- **Padding**: Space 2 (8px)
- **Min Width**: 180px

---

# 17. Sidebar Design

## Sidebar Philosophy

Sidebars provide navigation and filtering while maximizing content space. They should be collapsible, responsive, and provide clear visual hierarchy.

## Sidebar Structure

### Standard Sidebar
```
Sidebar Container
├── Logo Area
├── Navigation Items
│   ├── Section Headers
│   ├── Navigation Links
│   └── Active Indicators
└── Footer Area
    ├── User Profile
    └── Settings
```

## Sidebar Styles

### Container
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 200 (#E5E5E5) (right side)
- **Width**: 240px (expanded), 64px (collapsed)
- **Height**: 100vh
- **Shadow**: SM
- **Z-Index**: 10

### Navigation Item
- **Typography**: Body Regular (14px), Medium (500)
- **Color**: Gray 600 (#525252)
- **Padding**: Space 3 (12px) vertical, Space 4 (16px) horizontal
- **Border Radius**: Small (2px)
- **Margin**: Space 1 (4px) vertical
- **Hover**: Gray 100 (#F5F5F5) background
- **Active**: Primary 50 (#FEF2F2) background, Primary 600 (#DC2626) text

### Section Header
- **Typography**: Overline (10px), Semibold (600), Uppercase
- **Color**: Gray 500 (#737373)
- **Padding**: Space 4 (16px) vertical, Space 4 (16px) horizontal
- **Margin**: Space 4 (16px) top

### Collapsed Sidebar
- **Width**: 64px
- **Icons**: Centered, 24px
- **Tooltips**: On hover
- **Text**: Hidden

---

# 18. Modal Design

## Modal Philosophy

Modals focus user attention on specific tasks or content. They should be purposeful, accessible, and easy to dismiss.

## Modal Structure

### Standard Modal
```
Overlay (Backdrop)
└── Modal Container
    ├── Header
    │   ├── Title
    │   └── Close Button
    ├── Body
    │   └── Content
    └── Footer
        ├── Actions
        └── Cancel Button
```

## Modal Styles

### Overlay
- **Background**: Gray 900 (#171717) with 50% opacity
- **Backdrop Filter**: Blur 2px
- **Z-Index**: 100
- **Animation**: Fade in 200ms ease-out

### Container
- **Background**: White (#FFFFFF)
- **Border Radius**: Large (8px)
- **Shadow**: XL
- **Max Width**: 500px (small), 700px (medium), 900px (large)
- **Max Height**: 90vh
- **Padding**: Space 6 (24px)
- **Animation**: Scale up + fade in 300ms ease-out

### Header
- **Typography**: H3 (20px), Semibold (600)
- **Color**: Gray 900 (#171717)
- **Padding**: Space 0 (uses container padding)
- **Border Bottom**: 1px solid Gray 200 (#E5E5E5)
- **Margin Bottom**: Space 4 (16px)

### Close Button
- **Position**: Top right
- **Style**: Ghost button
- **Icon**: X icon, 20px
- **Padding**: Space 2 (8px)

### Body
- **Typography**: Body Regular (14px)
- **Color**: Gray 700 (#404040)
- **Max Height**: Calc(90vh - 200px)
- **Overflow**: Auto

### Footer
- **Padding**: Space 4 (16px) top
- **Border Top**: 1px solid Gray 200 (#E5E5E5)
- **Alignment**: Right (default)
- **Button Spacing**: Space 3 (12px) between buttons

## Modal Sizes

### Small Modal
- **Max Width**: 400px
- **Use Cases**: Confirmations, simple forms

### Medium Modal (Default)
- **Max Width**: 600px
- **Use Cases**: Standard forms, detailed content

### Large Modal
- **Max Width**: 800px
- **Use Cases**: Complex forms, tables, large content

### Full Screen Modal
- **Width**: 100vw
- **Height**: 100vh
- **Use Cases**: Mobile, immersive experiences

---

# 19. Empty States

## Empty State Philosophy

Empty states should be helpful, guiding users toward next actions. They should provide context, explanation, and clear calls-to-action.

## Empty State Structure

### Standard Empty State
```
Container
├── Icon/Illustration
├── Title
├── Description
└── Action Button (Optional)
```

## Empty State Styles

### Container
- **Background**: White (#FFFFFF) or Gray 50 (#FAFAFA)
- **Border Radius**: Default (4px)
- **Padding**: Space 8 (32px) vertical, Space 6 (24px) horizontal
- **Text Align**: Center
- **Min Height**: 300px

### Icon/Illustration
- **Size**: 64px (XL)
- **Color**: Gray 300 (#D4D4D4)
- **Margin Bottom**: Space 4 (16px)

### Title
- **Typography**: H4 (18px), Medium (500)
- **Color**: Gray 700 (#404040)
- **Margin Bottom**: Space 2 (8px)

### Description
- **Typography**: Body Regular (14px)
- **Color**: Gray 500 (#737373)
- **Max Width**: 400px
- **Margin**: 0 auto Space 4 (16px) bottom
- **Line Height**: 1.5

### Action Button
- **Style**: Primary or Secondary button
- **Margin Top**: Space 4 (16px)

## Empty State Types

### No Data Empty State
- **Icon**: Database or document icon
- **Title**: "No data found"
- **Description**: "There are no items to display"
- **Action**: "Add item" or "Refresh"

### No Results Empty State
- **Icon**: Search icon
- **Title**: "No results found"
- **Description**: "Try adjusting your search or filters"
- **Action**: "Clear filters"

### No Selection Empty State
- **Icon**: Selection icon
- **Title**: "No selection"
- **Description**: "Select an item to view details"
- **Action**: None

### Error Empty State
- **Icon**: Error icon
- **Title**: "Something went wrong"
- **Description**: "We couldn't load the content"
- **Action**: "Try again"

---

# 20. Loading States

## Loading State Philosophy

Loading states should provide clear feedback without causing frustration. They should be fast, informative, and maintain context.

## Loading State Types

### Spinner Loading
- **Use Cases**: Buttons, small components, inline loading
- **Style**: Circular spinner
- **Size**: 16px (small), 24px (medium), 32px (large)
- **Color**: Primary 500 (#EF4444)
- **Animation**: Rotate 1s linear infinite

### Skeleton Loading
- **Use Cases**: Cards, lists, content placeholders
- **Style**: Gray background with shimmer effect
- **Animation**: Shimmer 1.5s ease-in-out infinite
- **Color**: Gray 200 (#E5E5E5) to Gray 100 (#F5F5F5)

### Progress Loading
- **Use Cases**: File uploads, multi-step processes
- **Style**: Progress bar with percentage
- **Height**: 4px (thin), 8px (standard)
- **Color**: Primary 500 (#EF4444)
- **Background**: Gray 200 (#E5E5E5)

### Full Page Loading
- **Use Cases**: Initial page load, route transitions
- **Style**: Centered spinner with logo
- **Background**: White (#FFFFFF)
- **Animation**: Fade in 300ms ease-out

## Loading State Guidelines

### Timing
- **Fast (< 500ms)**: Show spinner only
- **Medium (500ms - 2s)**: Show spinner with message
- **Slow (> 2s)**: Show skeleton or progress indicator

### Messaging
- **Generic**: "Loading..."
- **Specific**: "Loading regional data..."
- **Actionable**: "Please wait while we process..."

### Positioning
- **Inline**: Next to relevant content
- **Centered**: In component or page center
- **Overlay**: Over content being loaded

---

# 21. Error States

## Error State Philosophy

Error states should be clear, helpful, and provide recovery options. They should explain what went wrong and how to fix it.

## Error State Structure

### Inline Error
```
Error Container
├── Error Icon
├── Error Message
└── Retry Button (Optional)
```

### Full Page Error
```
Error Container
├── Error Illustration
├── Error Title
├── Error Description
├── Error Details (Optional)
└── Recovery Actions
```

## Error State Styles

### Inline Error
- **Background**: Error 50 (#FEF2F2)
- **Border**: 1px solid Error 200 (#FECACA)
- **Border Radius**: Default (4px)
- **Padding**: Space 3 (12px) vertical, Space 4 (16px) horizontal
- **Icon**: Error icon, Error 500 (#EF4444), 20px
- **Text**: Error 700 (#B91C1C), Body Regular (14px)
- **Button**: Text button, Error 600 (#DC2626)

### Full Page Error
- **Background**: White (#FFFFFF)
- **Text Align**: Center
- **Padding**: Space 12 (48px) vertical
- **Illustration**: Error illustration, 120px
- **Title**: H2 (24px), Error 700 (#B91C1C)
- **Description**: Body Regular (14px), Gray 600 (#525252)
- **Button**: Primary button, margin top Space 4 (16px)

## Error State Types

### Network Error
- **Title**: "Connection error"
- **Description**: "Please check your internet connection"
- **Action**: "Retry"

### Server Error
- **Title**: "Server error"
- **Description**: "Something went wrong on our end"
- **Action**: "Try again" or "Contact support"

### Not Found Error
- **Title**: "Not found"
- **Description**: "The requested resource was not found"
- **Action**: "Go back" or "Go home"

### Permission Error
- **Title**: "Access denied"
- **Description**: "You don't have permission to access this"
- **Action**: "Contact administrator"

---

# 22. Charts

## Chart Philosophy

Charts should present data clearly and accurately. They should be simple, scannable, and use color strategically to highlight insights.

## Chart Types

### Line Chart
- **Use Cases**: Trends over time, continuous data
- **Style**: Smooth lines with data points
- **Colors**: Primary 500 (#EF4444) for main line
- **Grid**: Light gray horizontal lines
- **Tooltip**: Dark background with white text

### Bar Chart
- **Use Cases**: Comparisons, categorical data
- **Style**: Vertical bars with rounded corners
- **Colors**: Primary 500 (#EF4444) for positive, Error 500 (#EF4444) for negative
- **Grid**: Light gray horizontal lines
- **Tooltip**: Dark background with white text

### Pie Chart
- **Use Cases**: Proportions, parts of whole
- **Style**: Donut chart with hollow center
- **Colors**: Brand color palette
- **Legend**: Right side with color indicators
- **Tooltip**: Dark background with white text

### Area Chart
- **Use Cases**: Volume over time, cumulative data
- **Style**: Filled area below line
- **Colors**: Primary 500 (#EF4444) with gradient
- **Grid**: Light gray horizontal lines
- **Tooltip**: Dark background with white text

## Chart Guidelines

### Colors
- **Primary Data**: Primary 500 (#EF4444)
- **Secondary Data**: Secondary 500 (#0EA5E9)
- **Positive**: Success 500 (#10B981)
- **Negative**: Error 500 (#EF4444)
- **Neutral**: Gray 400 (#A3A3A3)

### Typography
- **Axis Labels**: Body Small (12px), Gray 500 (#737373)
- **Data Labels**: Body Regular (14px), Gray 700 (#404040)
- **Legend**: Body Small (12px), Gray 600 (#525252)

### Spacing
- **Chart Padding**: Space 4 (16px)
- **Axis Padding**: Space 3 (12px)
- **Legend Spacing**: Space 2 (8px) between items

---

# 23. Maps

## Map Philosophy

Maps should be clear, interactive, and provide context. They should use markers and overlays strategically to highlight information without overwhelming the user.

## Map Styles

### Base Map
- **Provider**: Leaflet with OpenStreetMap
- **Style**: Light, minimal base map
- **Zoom**: 4-6 (India level)
- **Center**: 20.5937° N, 78.9629° E (India center)

### Map Markers
- **Style**: Circular pins with brand color
- **Size**: 24px (medium), 32px (large)
- **Color**: Primary 500 (#EF4444) for selected, Gray 400 (#A3A3A3) for unselected
- **Shadow**: SM
- **Hover**: Scale 1.2, Shadow DEFAULT
- **Animation**: Scale 150ms ease-out

### Map Overlays
- **Style**: Semi-transparent colored regions
- **Colors**: Primary 500 (#EF4444) with 20% opacity
- **Border**: 1px solid Primary 500 (#EF4444)
- **Hover**: 40% opacity

### Map Tooltip
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 200 (#E5E5E5)
- **Border Radius**: Default (4px)
- **Shadow**: MD
- **Padding**: Space 3 (12px)
- **Typography**: Body Regular (14px)
- **Max Width**: 200px

## Map Controls

### Zoom Controls
- **Position**: Top right
- **Style**: Vertical button group
- **Buttons**: Ghost buttons with icons
- **Size**: 32px square

### Layer Controls
- **Position**: Top left
- **Style**: Horizontal button group
- **Buttons**: Ghost buttons with labels
- **Size**: 32px height

### Filter Controls
- **Position**: Bottom left or right
- **Style**: Card with form elements
- **Width**: 280px
- **Shadow**: DEFAULT

---

# 24. Product Cards

## Product Card Philosophy

Product cards should showcase products attractively while providing essential information. They should be scannable, actionable, and maintain visual consistency.

## Product Card Structure

### Standard Product Card
```
Card Container
├── Product Image
│   ├── Image
│   └── Badges (Optional)
├── Product Info
│   ├── Product Name
│   ├── Price
│   ├── Seller Name
│   └── Badges (GI, Regional)
└── Actions
    └── Add to Cart / View Details
```

## Product Card Styles

### Container
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 200 (#E5E5E5)
- **Border Radius**: Default (4px)
- **Shadow**: SM (hover: DEFAULT)
- **Overflow**: Hidden
- **Transition**: All 150ms ease-out

### Product Image
- **Aspect Ratio**: 1:1 (square) or 4:5 (portrait)
- **Background**: Gray 100 (#F5F5F5)
- **Object Fit**: Cover
- **Height**: 200px (standard), 240px (large)

### Badges
- **Position**: Top left or top right
- **Style**: Full rounded badge
- **Padding**: Space 1-2 (4-8px) vertical, Space 2-3 (8-12px) horizontal
- **Typography**: Caption (11px), Medium (500)
- **Colors**: GI (Success 500), Regional (Secondary 500), New (Primary 500)

### Product Name
- **Typography**: Body Regular (14px), Medium (500)
- **Color**: Gray 900 (#171717)
- **Lines**: 2 max, ellipsis
- **Margin**: Space 2-3 (8-12px) top

### Price
- **Typography**: Body Large (16px), Semibold (600)
- **Color**: Gray 900 (#171717)
- **Margin**: Space 1 (4px) top

### Seller Name
- **Typography**: Body Small (12px)
- **Color**: Gray 500 (#737373)
- **Margin**: Space 1 (4px) top

### Actions
- **Style**: Primary or Secondary button
- **Width**: Full width
- **Margin**: Space 3 (12px) top

## Product Card Variants

### Compact Product Card
- **Image Height**: 160px
- **Padding**: Space 3 (12px)
- **Typography**: Body Small (12px)

### Standard Product Card (Default)
- **Image Height**: 200px
- **Padding**: Space 4 (16px)
- **Typography**: Body Regular (14px)

### Featured Product Card
- **Image Height**: 240px
- **Padding**: Space 4-5 (16-20px)
- **Typography**: Body Large (16px)
- **Border**: 1px solid Primary 200 (#FECACA)

---

# 25. Seller Cards

## Seller Card Philosophy

Seller cards should present seller information clearly and professionally. They should build trust and provide essential details for decision-making.

## Seller Card Structure

### Standard Seller Card
```
Card Container
├── Seller Header
│   ├── Seller Logo/Avatar
│   ├── Business Name
│   └── Badges (GI, MSME)
├── Seller Info
│   ├── Location
│   ├── Categories
│   ├── Rating
│   └── Capacity
└── Actions
    ├── Contact
    └── View Profile
```

## Seller Card Styles

### Container
- **Background**: White (#FFFFFF)
- **Border**: 1px solid Gray 200 (#E5E5E5)
- **Border Radius**: Default (4px)
- **Shadow**: SM (hover: DEFAULT)
- **Padding**: Space 4 (16px)
- **Transition**: All 150ms ease-out

### Seller Header
- **Display**: Flex, left aligned
- **Spacing**: Space 3 (12px) between elements

### Seller Logo/Avatar
- **Size**: 48px
- **Border Radius**: Full (9999px)
- **Background**: Gray 100 (#F5F5F5)
- **Object Fit**: Cover

### Business Name
- **Typography**: Body Large (16px), Semibold (600)
- **Color**: Gray 900 (#171717)
- **Margin**: Space 1 (4px) top

### Badges
- **Style**: Full rounded badge
- **Padding**: Space 1 (4px) vertical, Space 2 (8px) horizontal
- **Typography**: Caption (11px), Medium (500)
- **Colors**: GI (Success 500), MSME (Secondary 500)
- **Spacing**: Space 1 (4px) between badges

### Seller Info
- **Typography**: Body Regular (14px)
- **Color**: Gray 600 (#525252)
- **Spacing**: Space 2 (8px) between items
- **Margin**: Space 3 (12px) top

### Rating
- **Display**: Star icons + number
- **Icon Color**: Warning 500 (#F59E0B) or Gray 300 (#D4D4D4)
- **Typography**: Body Small (12px)
- **Spacing**: Space 1 (4px) between stars and number

### Actions
- **Style**: Ghost or Text buttons
- **Spacing**: Space 2 (8px) between buttons
- **Margin**: Space 3 (12px) top

## Seller Card Variants

### Compact Seller Card
- **Logo Size**: 40px
- **Padding**: Space 3 (12px)
- **Typography**: Body Small (12px)

### Standard Seller Card (Default)
- **Logo Size**: 48px
- **Padding**: Space 4 (16px)
- **Typography**: Body Regular (14px)

### Featured Seller Card
- **Logo Size**: 56px
- **Padding**: Space 5 (20px)
- **Typography**: Body Large (16px)
- **Border**: 1px solid Primary 200 (#FECACA)

---

# 26. Accessibility Guidelines

## Accessibility Philosophy

VendSway is committed to accessibility by default. All components and interactions should meet WCAG 2.1 AA standards, ensuring the application is usable by everyone.

## Color Accessibility

### Contrast Ratios
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **UI Components**: Minimum 3:1 contrast ratio
- **Graphics**: Minimum 3:1 contrast ratio

### Color Independence
- **Don't rely on color alone to convey meaning**
- **Use icons, text, or patterns in addition to color**
- **Ensure color blind users can distinguish information**

### Focus Indicators
- **Visible**: 2px solid outline
- **Color**: Primary 500 (#EF4444) or system focus color
- **Offset**: 2px outside element
- **Consistent**: Same style across all interactive elements

## Keyboard Accessibility

### Keyboard Navigation
- **Tab Order**: Logical, predictable tab order
- **Skip Links**: Provide skip to main content link
- **Focus Trapping**: Trap focus in modals
- **Escape Key**: Close modals and dropdowns

### Keyboard Shortcuts
- **Tab**: Move to next interactive element
- **Shift + Tab**: Move to previous interactive element
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals, dropdowns, menus
- **Arrow Keys**: Navigate within components

## Screen Reader Support

### Semantic HTML
- **Use proper HTML elements** (header, nav, main, footer)
- **Use heading hierarchy** (h1, h2, h3, h4)
- **Use lists for navigation** (ul, ol, li)
- **Use buttons for actions, links for navigation**

### ARIA Labels
- **Labels**: Provide aria-label for icon-only buttons
- **Roles**: Use aria-role for dynamic content
- **States**: Use aria-expanded, aria-selected for states
- **Live Regions**: Use aria-live for dynamic updates

### Alt Text
- **Descriptive**: Provide meaningful alt text for images
- **Decorative**: Use alt="" for decorative images
- **Functional**: Describe function, not appearance

## Typography Accessibility

### Font Sizes
- **Minimum**: 12px for body text
- **Scalable**: Support browser zoom up to 200%
- **Readable**: Line height 1.4-1.6 for body text

### Text Spacing
- **Letter Spacing**: 0.05em minimum
- **Word Spacing**: 0.1em minimum
- **Line Height**: 1.4 minimum for body text

## Interactive Elements

### Touch Targets
- **Minimum Size**: 44x44 pixels for touch targets
- **Spacing**: 8px minimum between touch targets
- **Padding**: Adequate padding for buttons and links

### Focus Management
- **Visible**: Clear focus indicators
- **Predictable**: Focus moves in logical order
- **Restorable**: Focus returns after modal close

---

# 27. Dark Mode Strategy

## Dark Mode Philosophy

Dark mode should provide a comfortable viewing experience in low-light environments while maintaining visual hierarchy and brand identity. The dark mode system ensures consistency and readability.

## Dark Mode Color Palette

### Background Colors
```
Background Primary: #0A0A0A (Near black)
Background Secondary: #171717 (Dark gray)
Background Tertiary: #262626 (Medium gray)
Background Elevated: #404040 (Light gray)
```

### Text Colors
```
Text Primary: #FAFAFA (Near white)
Text Secondary: #A3A3A3 (Light gray)
Text Tertiary: #737373 (Medium gray)
Text Disabled: #525252 (Dark gray)
```

### Border Colors
```
Border Default: #404040 (Light gray)
Border Subtle: #262626 (Medium gray)
Border Strong: #525252 (Medium-dark gray)
```

### Brand Colors (Dark Mode)
```
Primary 500: #F87171 (Lightened for dark mode)
Primary 600: #EF4444 (Standard)
Secondary 500: #38BDF8 (Lightened for dark mode)
Secondary 600: #0EA5E9 (Standard)
```

## Dark Mode Component Adaptations

### Cards
- **Background**: Background Secondary (#171717)
- **Border**: Border Subtle (#262626)
- **Shadow**: Darker shadows with lower opacity

### Inputs
- **Background**: Background Tertiary (#262626)
- **Border**: Border Default (#404040)
- **Text**: Text Primary (#FAFAFA)
- **Placeholder**: Text Tertiary (#737373)

### Buttons
- **Primary**: Lightened brand colors for better contrast
- **Secondary**: Background Secondary (#171717) with light border
- **Ghost**: Transparent with light text

### Tables
- **Background**: Background Secondary (#171717)
- **Header**: Background Tertiary (#262626)
- **Border**: Border Subtle (#262626)
- **Text**: Text Primary (#FAFAFA)

### Modals
- **Background**: Background Secondary (#171717)
- **Overlay**: Darker overlay with 70% opacity
- **Text**: Text Primary (#FAFAFA)

## Dark Mode Transitions

### Transition Strategy
- **Duration**: 200-300ms for color transitions
- **Easing**: Ease-in-out for smooth transitions
- **Properties**: Background, color, border-color
- **Avoid**: Layout properties (width, height)

### User Preference
- **Respect**: prefers-color-scheme media query
- **Default**: Light mode
- **Toggle**: Manual toggle available
- **Persistence**: Save preference in localStorage

## Dark Mode Guidelines

### Contrast Requirements
- **Text**: Maintain 4.5:1 contrast ratio
- **UI Components**: Maintain 3:1 contrast ratio
- **Borders**: Subtle but visible
- **Shadows**: Adjusted for dark backgrounds

### Visual Hierarchy
- **Preserve**: Maintain visual hierarchy from light mode
- **Emphasis**: Use color and spacing for emphasis
- **Depth**: Use shadows and borders for depth

### Brand Identity
- **Maintain**: Brand colors remain recognizable
- **Adjust**: Lighten brand colors for dark backgrounds
- **Consistency**: Same brand colors across modes

---

# Conclusion

This design system provides a comprehensive visual language for VendSway, ensuring consistency, accessibility, and a premium user experience across all components and interactions.

## Design Principles Summary

- **Clarity**: Information is clear and scannable
- **Consistency**: Visual language is consistent across all components
- **Accessibility**: WCAG 2.1 AA compliant by default
- **Performance**: Optimized for fast loading and smooth interactions
- **Responsiveness**: Mobile-first approach with graceful enhancement

## Implementation Guidelines

1. **Follow the System**: Use design tokens and components as specified
2. **Maintain Consistency**: Don't deviate from established patterns
3. **Test Accessibility**: Verify contrast ratios and keyboard navigation
4. **Optimize Performance**: Use efficient animations and loading states
5. **Iterate Based on Feedback**: Continuously improve based on user testing

## Design System Evolution

This design system is a living document that should evolve based on:
- User feedback and testing
- New feature requirements
- Technology advancements
- Design trend evolution
- Accessibility improvements

---

**Document End**
