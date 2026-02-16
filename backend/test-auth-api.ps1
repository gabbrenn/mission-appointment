# Quick testing script for the Authentication API (Windows PowerShell)
# Usage: powershell.exe -ExecutionPolicy Bypass -File test-auth-api.ps1

$BaseUrl = "http://localhost:3000/api/users"

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Mission Management Auth API - Test Suite" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Test 1: Register a new user
Write-Host "`n1. Registering a new user..." -ForegroundColor Cyan
$registerPayload = @{
    employeeId = "EMP001"
    email = "testuser@example.com"
    password = "SecurePassword123"
    firstName = "Test"
    lastName = "User"
    role = "EMPLOYEE"
    phone = "1234567890"
    position = "Software Engineer"
} | ConvertTo-Json

$registerResponse = Invoke-WebRequest -Uri "$BaseUrl/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $registerPayload

Write-Host "Response: $($registerResponse.Content)" -ForegroundColor White

# Test 2: Login with the user
Write-Host "`n2. Logging in with user credentials..." -ForegroundColor Cyan
$loginPayload = @{
    email = "testuser@example.com"
    password = "SecurePassword123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "$BaseUrl/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginPayload

$loginContent = $loginResponse.Content | ConvertFrom-Json
$token = $loginContent.data.token

Write-Host "Response: $($loginResponse.Content)" -ForegroundColor White
Write-Host "Token obtained: $($token.Substring(0, 50))..." -ForegroundColor Green

# Test 3: Get login history (protected endpoint)
Write-Host "`n3. Getting login history (protected endpoint)..." -ForegroundColor Cyan
$historyResponse = Invoke-WebRequest -Uri "$BaseUrl/login-history" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $token" }

Write-Host "Response: $($historyResponse.Content)" -ForegroundColor White

# Test 4: Logout
Write-Host "`n4. Logging out..." -ForegroundColor Cyan
$logoutResponse = Invoke-WebRequest -Uri "$BaseUrl/logout" `
    -Method POST `
    -Headers @{ Authorization = "Bearer $token" }

Write-Host "Response: $($logoutResponse.Content)" -ForegroundColor White

# Test 5: Try to access protected endpoint with logged-out user
Write-Host "`n5. Attempting to access protected endpoint after logout..." -ForegroundColor Cyan
try {
    $protectedResponse = Invoke-WebRequest -Uri "$BaseUrl/login-history" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    Write-Host "Response: $($protectedResponse.Content)" -ForegroundColor White
} catch {
    Write-Host "Response: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 6: Login again with wrong password
Write-Host "`n6. Attempting login with wrong password..." -ForegroundColor Cyan
$wrongPassPayload = @{
    email = "testuser@example.com"
    password = "WrongPassword123"
} | ConvertTo-Json

try {
    $wrongPassResponse = Invoke-WebRequest -Uri "$BaseUrl/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $wrongPassPayload
    Write-Host "Response: $($wrongPassResponse.Content)" -ForegroundColor White
} catch {
    Write-Host "Response: $($_.Exception.Response.StatusCode) - $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 7: Login with non-existent user
Write-Host "`n7. Attempting login with non-existent user..." -ForegroundColor Cyan
$nonexistentPayload = @{
    email = "nonexistent@example.com"
    password = "SomePassword123"
} | ConvertTo-Json

try {
    $nonexistentResponse = Invoke-WebRequest -Uri "$BaseUrl/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $nonexistentPayload
    Write-Host "Response: $($nonexistentResponse.Content)" -ForegroundColor White
} catch {
    Write-Host "Response: $($_.Exception.Response.StatusCode) - $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 8: Missing credentials
Write-Host "`n8. Attempting login with missing credentials..." -ForegroundColor Cyan
try {
    $missingCredsResponse = Invoke-WebRequest -Uri "$BaseUrl/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body "{}"
    Write-Host "Response: $($missingCredsResponse.Content)" -ForegroundColor White
} catch {
    Write-Host "Response: $($_.Exception.Response.StatusCode) - $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "Test suite completed!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
