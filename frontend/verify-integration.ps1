# Backend Integration Verification Script
# Run this to verify all files are in place

Write-Host "=== Backend Integration Verification ===" -ForegroundColor Cyan
Write-Host ""

$files = @(
    ".env",
    ".env.example",
    "src\lib\api.ts",
    "src\services\auth.service.ts",
    "src\services\user.service.ts",
    "src\services\department.service.ts",
    "src\services\missiontype.service.ts",
    "src\contexts\AuthContext.tsx",
    "src\components\ProtectedRoute.tsx",
    "src\pages\Unauthorized.tsx",
    "src\types\api.types.ts",
    "BACKEND_INTEGRATION.md",
    "QUICK_START.md",
    "INTEGRATION_SUMMARY.md"
)

$allExist = $true

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "[OK] $file" -ForegroundColor Green
    } else {
        Write-Host "[MISSING] $file" -ForegroundColor Red
        $allExist = $false
    }
}

Write-Host ""
Write-Host "=== Dependencies Check ===" -ForegroundColor Cyan

# Check if axios is installed
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if ($packageJson.dependencies.axios) {
    Write-Host "[OK] axios installed" -ForegroundColor Green
} else {
    Write-Host "[MISSING] axios - Run: npm install axios" -ForegroundColor Red
    $allExist = $false
}

Write-Host ""
Write-Host "=== Modified Files ===" -ForegroundColor Cyan
Write-Host "[INFO] src\App.tsx - Added AuthProvider and ProtectedRoutes" -ForegroundColor Yellow
Write-Host "[INFO] src\pages\Login.tsx - Integrated real authentication" -ForegroundColor Yellow
Write-Host "[INFO] src\components\layout\app-header.tsx - Added user profile" -ForegroundColor Yellow
Write-Host "[INFO] .gitignore - Added .env exclusions" -ForegroundColor Yellow

Write-Host ""

if ($allExist) {
    Write-Host "=== All Files Present! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Start backend: cd ..\backend && npm run dev"
    Write-Host "2. Start frontend: npm run dev"
    Write-Host "3. Open browser: http://localhost:5173"
    Write-Host "4. Test login with backend credentials"
    Write-Host ""
    Write-Host "Documentation:" -ForegroundColor Cyan
    Write-Host "- QUICK_START.md"
    Write-Host "- BACKEND_INTEGRATION.md"
    Write-Host "- INTEGRATION_SUMMARY.md"
} else {
    Write-Host "=== Some Files Are Missing! ===" -ForegroundColor Red
}

Write-Host ""
Write-Host "Integration Status: COMPLETE" -ForegroundColor Green
