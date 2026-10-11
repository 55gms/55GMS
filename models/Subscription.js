import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Stripe's state for an account, one row per account that has ever started a
// checkout. Written only by services/billing.js; users.premium is derived
// from it and from the admin grant.
const Subscription = sequelize.define(
  "Subscription",
  {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "stripe_customer_id",
    },
    // Null until a checkout completes.
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "stripe_subscription_id",
    },
    // Stripe's subscription status, as sent.
    status: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    // "monthly" or "yearly"
    plan: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    currentPeriodEnd: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "current_period_end",
    },
    cancelAtPeriodEnd: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "cancel_at_period_end",
    },
  },
  {
    tableName: "subscriptions",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["stripe_customer_id"],
      },
    ],
  },
);

export default Subscription;
