# AgriLync — Farmer Onboarding Data Fields

**Version:** June 2026 · **Models:** `Farmer` (MongoDB) + linked `Farm` record

---

## Onboarding paths

| Path                 | Entry point                                | Status on save | Agent assigned           |
| -------------------- | ------------------------------------------ | -------------- | ------------------------ |
| **Agent onboarding** | Agent Dashboard → Add Farmer (4-step form) | `active`       | Yes, immediately         |
| **Self onboarding**  | Public Solo Farmer Registration            | `pending`      | No, until agent verifies |

---

## 1. Agent onboarding — Step 1: Identity

| UI label           | DB field          | Type               | Required | Notes                            |
| ------------------ | ----------------- | ------------------ | -------- | -------------------------------- |
| Profile photo      | `profilePicture`  | Image (Cloudinary) | Optional | Crop + compress before upload    |
| Grower full name   | `name`            | Text               | **Yes**  | Legal name as on Ghana Card      |
| Phone number       | `contact`         | Text               | **Yes**  | SMS via mNotify                  |
| Preferred language | `language`        | Select             | Optional | Region language list             |
| Other language     | `otherLanguage`   | Text               | Optional | If language = Other              |
| Email address      | `email`           | Email              | Optional |                                  |
| Gender             | `gender`          | Select             | **Yes**  | male \| female \| other          |
| Date of birth      | `dob`             | Date               | **Yes**  | Must not be future date          |
| Ghana Card number  | `ghanaCardNumber` | Text               | **Yes**  | Format `GHA-XXXXXXXXX-X`, unique |

---

## 2. Agent onboarding — Step 2: Operation

| UI label               | DB field                     | Type           | Required    | Notes                                       |
| ---------------------- | ---------------------------- | -------------- | ----------- | ------------------------------------------- |
| Region                 | `region`                     | Text           | **Yes**     | From agent operational zone                 |
| District               | `district`                   | Select         | **Yes**     | `GHANA_REGIONS` list                        |
| Community              | `community`                  | Select / text  | **Yes**     | Or custom via Other                         |
| Years of experience    | `yearsOfExperience`          | Number         | **Yes**     |                                             |
| Primary farm type      | `farmType`                   | Select         | **Yes**     | crop \| livestock \| mixed                  |
| Land ownership status  | `landOwnershipStatus`        | Select         | Optional    | owned \| leased \| sharecropped \| communal |
| Estimated acreage      | `farmSize`                   | Number (acres) | Optional    | From map or manual                          |
| Crops under production | `cropList`                   | String[]       | Conditional | If crop or mixed                            |
| Other crop             | `cropsGrownOther`            | Text           | Conditional | When Other in cropList                      |
| Crops display          | `cropsGrown`                 | Text           | System      | Auto from cropList                          |
| Livestock inventory    | `livestockInventory`         | Array          | Conditional | `{ type, count, otherLabel }`               |
| Livestock display      | `livestockType`              | Text           | System      | Auto-generated string                       |
| Farm map latitude      | `farmLocation.lat`           | Number         | Optional    | From FarmMap                                |
| Farm map longitude     | `farmLocation.lng`           | Number         | Optional    | From FarmMap                                |
| Measured acres         | `farmLocation.measuredAcres` | Number         | Optional    | From drawn boundary                         |
| GPS (synced)           | `gpsLocation`                | Object         | System      | Mirrors farmLocation                        |

---

## 3. Agent onboarding — Step 3: Capital

| UI label                     | DB field                   | Type         | Required | Notes                                   |
| ---------------------------- | -------------------------- | ------------ | -------- | --------------------------------------- |
| Investment interest          | `investmentInterest`       | Select       | Optional | yes \| maybe \| no                      |
| Capital requirement (GHS)    | `estimatedCapitalNeed`     | Number       | Optional |                                         |
| Primary investment objective | `preferredInvestmentType`  | Select       | Optional | inputs, mechanization, irrigation, etc. |
| Market readiness index       | `investmentReadinessScore` | Number 0–100 | Optional | Agent slider                            |
| Training modules completed   | `trainingModules`          | String[]     | Optional | See module list below                   |
| Verified credit profile      | `hasPreviousInvestment`    | Boolean      | Optional |                                         |

---

## 4. Agent onboarding — Step 4: Validate

| UI label               | DB field                | Type    | Required | Notes                                         |
| ---------------------- | ----------------------- | ------- | -------- | --------------------------------------------- |
| Ghana Card — front     | `idCardFront`           | Image   | **Yes**  | OCR validation                                |
| Ghana Card — back      | `idCardBack`            | Image   | **Yes**  |                                               |
| Onboarding agent ID    | `onboardingAgentId`     | Text    | **Yes**  | Auto-stamped from logged-in agent (`agentId`) |
| Verification confirmed | `verificationConfirmed` | Boolean | System   | Set when agent ID is stamped                  |
| Field notes            | `fieldNotes`            | Text    | Optional |                                               |
| Password               | `password`              | Hashed  | System   | Auto-generated if omitted                     |

---

## 5. Self onboarding (public signup)

| UI label                 | DB field           | Type         | Required    | Notes                                     |
| ------------------------ | ------------------ | ------------ | ----------- | ----------------------------------------- |
| Full name                | `name`             | Text         | **Yes**     |                                           |
| Gender                   | `gender`           | Select       | **Yes**     |                                           |
| Phone                    | `contact`          | Text         | **Yes**     | OTP (prototype: 1234)                     |
| Email                    | `email`            | Email        | Optional    |                                           |
| Password                 | `password`         | Text         | **Yes**     | Hashed on save                            |
| Region                   | `region`           | Select       | **Yes**     | All Ghana regions                         |
| District                 | `district`         | Text         | **Yes**     | Free text at signup                       |
| Farm address / community | `community`        | Text         | **Yes**     |                                           |
| Farm type                | `farmType`         | Select       | **Yes**     | crop \| livestock \| mixed \| aquaculture |
| Primary crops            | `cropList`         | Multi-select | Conditional |                                           |
| Other crop               | `cropsGrownOther`  | Text         | Conditional |                                           |
| Onboarding source        | `onboardingSource` | Text         | System      | Always `self`                             |
| Status                   | `status`           | Text         | System      | Always `pending`                          |
| Assigned agent           | `agent`            | ObjectId     | System      | Null until verification                   |

---

## 6. System-generated fields

| Field                       | Type                          | Description                            |
| --------------------------- | ----------------------------- | -------------------------------------- |
| `id` (Lync ID)              | Text                          | `LYG-…` from Ghana Card or internal ID |
| `onboardingSource`          | agent \| self                 | Which path created the record          |
| `profileCompleteness`       | 0–100                         | Calculated from filled fields          |
| `status`                    | active \| pending \| inactive |                                        |
| `investmentStatus`          | Text                          | Default: Pending                       |
| `currentStage`              | Text                          | Default: planning                      |
| `stageDetails`              | Map                           | planning → harvesting lifecycle        |
| `imageHash`                 | Text                          | Duplicate ID image detection           |
| `flags`                     | String[]                      | Fraud / duplicate alerts               |
| `rating`                    | 0–5                           | Default 0                              |
| `lastUpdated` / `lastVisit` | Text                          | Operational timestamps                 |
| `createdAt` / `updatedAt`   | Timestamp                     | MongoDB auto                           |

---

## 7. Linked Farm record (on agent onboard or verification)

| Field           | Source                      | Description            |
| --------------- | --------------------------- | ---------------------- |
| `id`            | System                      | `F-XXXX`               |
| `name`          | System                      | `{Farmer name}'s Farm` |
| `farmer`        | System                      | Farmer `_id`           |
| `agent`         | System                      | Assigned agent         |
| `location`      | community, district, region | Text                   |
| `crop`          | cropList[0] or cropsGrown   | Primary crop           |
| `coordinates`   | farmLocation                | lat / lng              |
| `measuredAcres` | farmLocation or farmSize    |                        |
| `status`        | Default                     | scheduled              |

---

## 8. Training modules (`trainingModules` IDs)

| ID                        | Title                               |
| ------------------------- | ----------------------------------- |
| `soil_crop`               | Soil & Crop Management              |
| `financial_lit`           | Financial Literacy & Record Keeping |
| `market_access`           | Market Access & Pricing             |
| `sustainable_farming`     | Sustainable Farming Practices       |
| `climate_smart`           | Climate Smart Agriculture           |
| `farmpartner_orientation` | FarmPartner Investment Orientation  |

---

## 9. Standard crop list (`cropList`)

Maize, Rice, Cocoa, Cassava, Yam, Plantain, Tomato, Pepper, Soybean, Groundnut, Cowpea, Millet, Sorghum, Oil Palm, Coconut, Citrus, Mango, Pineapple, Vegetables (Mixed), Other

---

## 10. Standard livestock list (`livestockInventory.type`)

Poultry, Cattle, Goats, Sheep, Pigs, Fish / Aquaculture, Rabbits, Bees / Apiculture, Other
