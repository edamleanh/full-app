$ErrorActionPreference = "Stop"

Write-Host "Creating C:\src directory..."
New-Item -ItemType Directory -Force -Path 'C:\src' | Out-Null

Write-Host "Downloading depot_tools.zip..."
Invoke-WebRequest -Uri 'https://storage.googleapis.com/chrome-infra/depot_tools.zip' -OutFile 'C:\src\depot_tools.zip'

Write-Host "Extracting depot_tools.zip..."
# Remove old directory if it exists to ensure clean extraction
if (Test-Path 'C:\src\depot_tools') {
    Remove-Item 'C:\src\depot_tools' -Recurse -Force
}
New-Item -ItemType Directory -Force -Path 'C:\src\depot_tools' | Out-Null
Expand-Archive -Path 'C:\src\depot_tools.zip' -DestinationPath 'C:\src\depot_tools' -Force

Write-Host "Setting User Environment Variables..."
$userPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
$depotPath = 'C:\src\depot_tools'
if ([string]::IsNullOrEmpty($userPath)) {
    [Environment]::SetEnvironmentVariable('PATH', $depotPath, 'User')
    Write-Host "Added depot_tools to empty User PATH."
} elseif ($userPath -notlike "*$depotPath*") {
    [Environment]::SetEnvironmentVariable('PATH', "$depotPath;" + $userPath, 'User')
    Write-Host "Prepended depot_tools to User PATH."
} else {
    Write-Host "depot_tools already in User PATH."
}

[Environment]::SetEnvironmentVariable('DEPOT_TOOLS_WIN_TOOLCHAIN', '0', 'User')
Write-Host "Set DEPOT_TOOLS_WIN_TOOLCHAIN=0"

Write-Host "Setup Script Completed."
