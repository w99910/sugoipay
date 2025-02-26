First Intuitive Node-based Billing Management

First create a plan -> one-time or recurring

Invite user to plan/trial

Metered Usaged Billing

- Create meter
  - event_name
- Create price
  - recurring.meter === meter_id
- Create subscription with that price id

---

So, user must specify the product. Then create main plan and addons. Main plan and addons can be either recurring or one-time.

- If recurring, one can set [interval_count(default:1)][day|week|month|year]. When resolving feature, one need to take trial periods into account.
- whenever a feature is attached, price will be created. If object is recurring, price will be created as recurring. price can be 0. ( Can feature be optional - pay what you want)

A feature's total can be -1 which means unlimited.

---

## Flat-Rate Pricing

Flat-rate pricing involves charging a fixed amount for a product or service on a periodic basis.

Examples
Monthly Subscription: Charge $15 per month for a streaming service.

Annual Subscription: Charge $90 per year for the same service, offering a discount compared to monthly billing.

Setup Steps
In Stripe Dashboard, create a product and choose "Recurring" as the pricing type.

Set the price (e.g., $15) and billing interval (e.g., monthly).

Optionally, add another price for yearly billing with a discounted rate (e.g., $90/year)1.

## Per-Seat Pricing

This model charges based on the number of users or seats.

Examples
A team collaboration tool charges $50 per user per month.

Setup Steps
Create a product and select "Recurring" pricing.

Set the price per seat (e.g., $50) and billing interval (e.g., monthly).

During subscription creation, specify the number of seats to calculate the total cost dynamically1.

## Tiered Pricing

Tiered pricing adjusts costs based on usage or quantity, with two main modes:

Volume-Based: The entire usage is billed at the rate of the highest applicable tier.

Graduated: Each tier applies only to usage within its range.

Examples
Volume-Based
1–5 units: $7/unit

6–10 units: $6.50/unit

11+ units: $6/unit
If a customer uses 6 units, all 6 are billed at $6.50/unit, totaling $393.

Graduated
1–5 units: $7/unit

6–10 units: $6.50/unit
If a customer uses 6 units, they pay:

$35 for the first 5 units at $7/unit.

$6.50 for the 6th unit.
Total: $41.503.

Setup Steps
Create a product and select "Tiered" pricing.

Define tiers with ranges and rates.

Choose "Volume" or "Graduated" as the tier mode3.

## Usage-Based Pricing

This model charges customers based on actual usage during a billing period.

Examples
Pay-As-You-Go
Charge $0.01 per API call without a base fee.

Fixed Fee + Overage
Base fee of $200/month includes up to 100,000 tokens; additional tokens are billed at $0.001 each.

Setup Steps
Create a product and select "Recurring" with "Metered" usage tracking.

Define pricing tiers if needed (e.g., flat fee plus overage).

Use Stripe's API to track usage and generate invoices45.

## Hybrid Pricing Models

Combines multiple pricing strategies, such as credit burndown and pay-as-you-go.

Examples
A texting service offers:

Starter plan: $139/month for 2,500 credits.

Additional credits beyond 2,500 are billed at $0.05 each.

Setup Steps
Create products with credit-based tiers (e.g., allocate credits per plan).

Add overage rates for additional usage beyond allocated credits.

Use Stripe's API to track credit consumption and apply overage charges5.

## Custom Pricing Schemes

Custom schemes involve conditional fees based on transaction properties.

Examples
Fixed fee: Charge $1 per transaction.

Variable fee: Charge 0.45% of transaction value.

Blended fee: Charge 0.45% + $0.10 per transaction.

Setup Steps
Go to "Platform Pricing" in Stripe Dashboard.

Define rules based on conditions (e.g., transaction amount).

Set fallback rules for unmatched conditions2.

## Free Trials and Discounts

These options enhance subscription flexibility:

Offer free trials before billing starts (e.g., 14 days free).

Provide discounts for annual subscriptions compared to monthly plans13.

By combining these models, intervals, and customizations, businesses can create tailored pricing structures to meet diverse customer needs across industries like SaaS, e-commerce, and more!
