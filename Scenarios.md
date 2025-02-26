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

Node Workflow

1. Product
2. Plan and Addons
3. Create features in plan and addons
4. Create `Price` node on edge drop from feature

- First create product
