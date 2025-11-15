-- AddColumn for Billing Address
ALTER TABLE "User" ADD COLUMN "billingStreet" VARCHAR(255),
ADD COLUMN "billingCity" VARCHAR(100),
ADD COLUMN "billingProvince" VARCHAR(100),
ADD COLUMN "billingZipCode" VARCHAR(20),
ADD COLUMN "billingCountry" VARCHAR(100);

-- AddColumn for Delivery Address
ALTER TABLE "User" ADD COLUMN "deliveryStreet" VARCHAR(255),
ADD COLUMN "deliveryCity" VARCHAR(100),
ADD COLUMN "deliveryProvince" VARCHAR(100),
ADD COLUMN "deliveryZipCode" VARCHAR(20),
ADD COLUMN "deliveryCountry" VARCHAR(100);
