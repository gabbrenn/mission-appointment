#!/bin/bash
# Quick testing script for the Authentication API
# Usage: bash test-auth-api.sh

BASE_URL="http://localhost:3000/api/users"

echo "========================================="
echo "Mission Management Auth API - Test Suite"
echo "========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Register a new user
echo -e "\n${BLUE}1. Registering a new user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "email": "testuser@example.com",
    "password": "SecurePassword123",
    "firstName": "Test",
    "lastName": "User",
    "role": "EMPLOYEE",
    "phone": "1234567890",
    "position": "Software Engineer"
  }')

echo "Response: $REGISTER_RESPONSE"

# Extract user ID from response (if needed for subsequent tests)
# USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Test 2: Login with the user
echo -e "\n${BLUE}2. Logging in with user credentials...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePassword123"
  }')

echo "Response: $LOGIN_RESPONSE"

# Extract JWT token from response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${YELLOW}Could not extract token. Make sure the login was successful.${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Token obtained: ${TOKEN:0:50}...${NC}"

# Test 3: Get login history (protected endpoint)
echo -e "\n${BLUE}3. Getting login history (protected endpoint)...${NC}"
HISTORY_RESPONSE=$(curl -s -X GET "$BASE_URL/login-history" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $HISTORY_RESPONSE"

# Test 4: Logout
echo -e "\n${BLUE}4. Logging out...${NC}"
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/logout" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $LOGOUT_RESPONSE"

# Test 5: Try to access protected endpoint with logged-out user
echo -e "\n${BLUE}5. Attempting to access protected endpoint after logout...${NC}"
PROTECTED_RESPONSE=$(curl -s -X GET "$BASE_URL/login-history" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $PROTECTED_RESPONSE"

# Test 6: Login again with wrong password
echo -e "\n${BLUE}6. Attempting login with wrong password...${NC}"
WRONG_PASS_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "WrongPassword123"
  }')

echo "Response: $WRONG_PASS_RESPONSE"

# Test 7: Login with non-existent user
echo -e "\n${BLUE}7. Attempting login with non-existent user...${NC}"
NONEXISTENT_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "SomePassword123"
  }')

echo "Response: $NONEXISTENT_RESPONSE"

# Test 8: Missing credentials
echo -e "\n${BLUE}8. Attempting login with missing credentials...${NC}"
MISSING_CREDS_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "Response: $MISSING_CREDS_RESPONSE"

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}Test suite completed!${NC}"
echo -e "${GREEN}=========================================${NC}"
