# WeChat Mobile Number Login Implementation

## Overview

This document describes the implementation of WeChat mobile number login functionality for the online store Mini-Program. This feature allows users to login using their WeChat account and authorized mobile number, providing a seamless authentication experience.

## Implementation Details

### Frontend Implementation

1. **UI Components**:
   - Added a "Login with WeChat Mobile" button to the login page
   - Styled the button with WeChat branding colors
   - Added a divider to separate traditional login from WeChat login

2. **Functionality**:
   - Uses `wx.login()` to get WeChat code
   - Uses `wx.getPhoneNumber()` to request mobile number authorization
   - Sends encrypted data to backend for decryption and validation
   - Handles success and failure cases with appropriate user feedback

### Backend Implementation

1. **New API Endpoint**:
   - `POST /api/auth/wechat-mobile-login` - Handles WeChat mobile number login

2. **Process Flow**:
   - Receives WeChat code, encryptedData, and iv from frontend
   - Calls WeChat API to exchange code for session key and openid
   - Decrypts phone number data using session key
   - Finds or creates user based on phone number
   - Generates JWT token for authenticated session

3. **Security Measures**:
   - Validates all input parameters
   - Verifies WeChat signatures
   - Securely decrypts sensitive data
   - Associates WeChat openid with user accounts

### Data Model Updates

1. **User Model**:
   - Added `wechatOpenId` field to store WeChat openid
   - Modified save method to handle WeChat login users
   - Updated database initialization with new field

## How It Works

### Frontend Flow

1. User taps "Login with WeChat Mobile" button
2. App calls `wx.login()` to get WeChat code
3. App calls `wx.getPhoneNumber()` to request mobile number authorization
4. WeChat prompts user to authorize mobile number access
5. If authorized, encrypted phone data is sent to backend
6. Backend processes data and returns JWT token
7. App stores token and navigates to home page

### Backend Flow

1. Receive code, encryptedData, and iv from frontend
2. Call WeChat API: `https://api.weixin.qq.com/sns/jscode2session`
3. Receive session_key and openid
4. Decrypt phone number data using AES-128-CBC
5. Extract phone number, pure phone number, and country code
6. Find existing user by openid or phone number
7. Create new user if not found
8. Generate and return JWT token

## API Endpoints

### WeChat Mobile Login
```
POST /api/auth/wechat-mobile-login

Request Body:
{
  "code": "WeChat login code",
  "encryptedData": "Encrypted phone number data",
  "iv": "Initialization vector"
}

Response:
{
  "message": "WeChat mobile login successful",
  "token": "JWT token",
  "user": {
    "id": "User ID",
    "username": "Generated username",
    "email": "User email (if any)",
    "phone": "Phone number",
    "avatar": "User avatar (if any)",
    "createdAt": "Account creation time",
    "updatedAt": "Last update time"
  }
}
```

## Security Considerations

1. **Data Encryption**: Phone numbers are encrypted by WeChat and decrypted server-side
2. **Session Management**: Uses WeChat's secure session key exchange
3. **Input Validation**: All parameters are validated before processing
4. **Error Handling**: Proper error messages without exposing sensitive information
5. **Token Security**: JWT tokens with expiration for secure sessions

## Configuration Requirements

1. **WeChat App Credentials**:
   - `WECHAT_APP_ID` - WeChat Mini-Program App ID
   - `WECHAT_APP_SECRET` - WeChat Mini-Program App Secret

2. **Environment Variables**:
   ```
   WECHAT_APP_ID=your_wechat_app_id
   WECHAT_APP_SECRET=your_wechat_app_secret
   ```

## Testing

For development and testing purposes, the implementation includes simulation capabilities:

1. **Simulated WeChat Response**: Generates realistic phone number data
2. **Error Simulation**: Tests various failure scenarios
3. **Edge Cases**: Handles invalid data and network issues

## User Experience

1. **Simple One-Tap Login**: Users can login with a single tap after authorization
2. **Clear Authorization Prompt**: WeChat provides clear permission requests
3. **Error Guidance**: Helpful error messages and retry options
4. **Seamless Integration**: Consistent with overall app design

## Future Enhancements

1. **WeChat User Info**: Retrieve additional user information (nickname, avatar)
2. **Account Linking**: Allow users to link multiple login methods
3. **SMS Verification**: Fallback to SMS verification if WeChat authorization fails
4. **Analytics**: Track login success rates and user preferences