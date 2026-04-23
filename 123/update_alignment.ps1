$path = "c:/Users/edaml/OneDrive/Desktop/app/123/index copy.html"
$content = Get-Content $path -Raw -Encoding UTF8

# Function to replace regex match
function Replace-SvgAttributes {
    param(
        [string]$content,
        [int]$dataIndex,
        [string]$newViewBox
    )
    $regex = '(?s)(<div class="enterprise-showcase-card-overlay" data-index="' + $dataIndex + '".*?<svg class="enterprise-showcase-logo")([^>]*)>'
    
    if ($content -match $regex) {
        Write-Host "Processing index $dataIndex..."
        $attrs = $matches[2]
        
        # Clean attributes
        $attrs = $attrs -replace 'width="[^"]*?"', ''
        $attrs = $attrs -replace 'height="[^"]*?"', ''
        $attrs = $attrs -replace 'viewBox="[^"]*?"', ''
        $attrs = $attrs -replace 'preserveAspectRatio="[^"]*?"', ''
        
        # Append new corrected attributes
        # Using "Safe" coordinates to prevent clipping
        $newAttrs = $attrs + ' viewBox="' + $newViewBox + '" preserveAspectRatio="xMinYMid meet"'
        
        $newString = $matches[1] + $newAttrs + ">"
        $content = $content -replace [regex]::Escape($matches[0]), $newString
    } else {
        Write-Host "Index $dataIndex Pattern NOT found."
    }
    return $content
}

# 1. BMW (Index 0) - Already good, but ensuring consistency.
# Use 70 0 50 40 as before? Or 70 0 60 40 to be safe?
# Let's keep 70 0 50 40 if user didn't complain, but to be safe let's ensure padding.
$content = Replace-SvgAttributes -content $content -dataIndex 0 -newViewBox "70 0 50 40"

# 2. Amazon (Index 1)
# Was 63 -> Still Clipped.
# Dropping to 50.
# Width: Old Right edge ~200. 50 + 150 = 200.
$content = Replace-SvgAttributes -content $content -dataIndex 1 -newViewBox "50 0 150 40"

# 3. Maersk (Index 2)
# Was 25 -> Still Clipped.
# Dropping to 15.
# Width: Old Right edge ~146. 15 + 131 = 146.
$content = Replace-SvgAttributes -content $content -dataIndex 2 -newViewBox "15 0 131 40"

# 4. Twilio (Index 3)
# Was 48 -> Still Clipped.
# Dropping to 30.
# Width: Old Right edge ~200. 30 + 170 = 200.
$content = Replace-SvgAttributes -content $content -dataIndex 3 -newViewBox "30 0 170 40"

Set-Content $path -Value $content -Encoding UTF8
Write-Host "Done."
