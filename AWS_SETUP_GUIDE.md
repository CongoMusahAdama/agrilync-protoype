# AWS Setup Guide for AgriLync

This guide will walk you through the steps to get your AWS credentials (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) and set up an S3 bucket for the project.

## Step 1: Create an AWS Account
If you don't already have one, go to [aws.amazon.com](https://aws.amazon.com/) and create a free account. You will need a credit card for verification, even for the free tier.

## Step 2: Create an IAM User
It is best practice NOT to use your root account for applications. Create a specific user for AgriLync.

1.  Log in to the **AWS Console**.
2.  Search for **IAM** (Identity and Access Management) in the top search bar.
3.  Click **Users** on the left sidebar, then click **Create user**.
4.  **User details**:
    *   User name: `AgrilyncDev` (or any name you prefer).
    *   Click **Next**.
5.  **Permissions**:
    *   Select **Attach policies directly**.
    *   Search for `AmazonS3FullAccess` and check the box.
        *   *Note: For production, you should create a more restrictive policy, but for development, this ensures you won't hit permission errors.*
    *   Click **Next**, then **Create user**.

## Step 3: Generate Access Keys
1.  Click on the newly created user (`AgrilyncDev`) in the list.
2.  Go to the **Security credentials** tab.
3.  Scroll down to **Access keys** and click **Create access key**.
4.  Select **Local code** or **Application running outside AWS**.
    *   Check the box "I understand the recommendation...".
    *   Click **Next**.
5.  (Optional) Add a description tag like "For AgriLync Backend".
6.  Click **Create access key**.
7.  **IMPORTANT:** Copy the **Access key ID** and **Secret access key** immediately.
    *   The Secret Access Key is shown only once. If you lose it, you have to create a new one.

## Step 4: Create an S3 Bucket
1.  Search for **S3** in the top AWS search bar.
2.  Click **Create bucket**.
3.  **Bucket name**: `agrilync-assets` (or a unique name like `agrilync-assets-[your-name]`).
    *   *Note: Bucket names must be globally unique across all of AWS.*
4.  **AWS Region**: Select `us-east-1` (or the region closest to you).
    *   *Make sure this matches the `AWS_REGION` in your .env file.*
5.  **Object Ownership**: Leave as **ACLs disabled** (recommended).
6.  **Block Public Access settings**:
    *   **Uncheck** "Block all public access".
    *   Check the warning box "I acknowledge that the current settings might result in this bucket and the objects within becoming public."
    *   *Why? The application needs to serve these images to the frontend users.*
7.  Click **Create bucket**.

## Step 5: Configure Bucket Policy (Optional but Recommended)
To ensure files are readable by the public (for profile pictures to load), add a bucket policy.

1.  Click on your new bucket name.
2.  Go to the **Permissions** tab.
3.  Scroll to **Bucket policy** and click **Edit**.
4.  Paste this JSON (replace `YOUR_BUCKET_NAME` with your actual bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```
5. Click **Save changes**.

## Step 6: Update Your Environment Variables
Open your `backend/.env` file and paste the values:

```env
# AWS Infrastructure
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA......           # From Step 3
AWS_SECRET_ACCESS_KEY=wJalr......      # From Step 3
AWS_S3_BUCKET_NAME=agrilync-assets     # From Step 4 (The exact name you chose)
```

Restart your backend server for changes to take effect.
