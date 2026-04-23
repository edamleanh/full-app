$path = "c:/Users/edaml/OneDrive/Desktop/app/123/index copy.html"
$content = Get-Content $path -Raw -Encoding UTF8

$newSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40" fill="none" class="enterprise-showcase-logo" preserveAspectRatio="xMidYMid meet" viewBox="0 0 200 40">
                  <path fill="var(--userLogoColor, #F22F46)" d="M64.4 16.3c0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1zm-3.1 4.3c-1.7 0-3.1 1.4-3.1 3.1 0 1.7 1.4 3.1 3.1 3.1 1.7 0 3.1-1.4 3.1-3.1 0-1.7-1.4-3.1-3.1-3.1zM80 20c0 8.3-6.7 15-15 15s-15-6.7-15-15S56.7 5 65 5s15 6.7 15 15zm-4 0c0-6.1-4.9-11-11-11s-11 4.9-11 11 4.9 11 11 11 11-4.9 11-11zm-7.3.6c-1.7 0-3.1 1.4-3.1 3.1 0 1.7 1.4 3.1 3.1 3.1 1.7 0 3.1-1.4 3.1-3.1 0-1.7-1.4-3.1-3.1-3.1zm0-7.4c-1.7 0-3.1 1.4-3.1 3.1 0 1.7 1.4 3.1 3.1 3.1 1.7 0 3.1-1.4 3.1-3.1 0-1.7-1.4-3.1-3.1-3.1zm51.6-2.3c.1 0 .2.1.3.2v3.2c0 .2-.2.3-.3.3H115c-.2 0-.3-.2-.3-.3v-3.1c0-.2.2-.3.3-.3h5.3zm-.1 4.5H110c-.1 0-.3.1-.3.3l-1.3 5-.1.3-1.6-5.3c0-.1-.2-.3-.3-.3h-4c-.1 0-.3.1-.3.3l-1.5 5-.1.3-.1-.3-.6-2.5-.6-2.5c0-.1-.2-.3-.3-.3h-8v-4.3c0-.1-.2-.3-.4-.2l-5 1.6c-.2 0-.3.1-.3.3v2.7h-1.3c-.1 0-.3.1-.3.3v3.8c0 .1.1.3.3.3h1.3v4.7c0 3.3 1.8 4.8 5.1 4.8 1.4 0 2.7-.3 3.6-.8v-4c0-.2-.2-.3-.3-.2-.5.2-1 .3-1.4.3-.9 0-1.4-.4-1.4-1.4v-3.4h2.9c.1 0 .3-.1.3-.3v-3.2L97.8 29c0 .1.2.3.3.3h4.2c.1 0 .3-.1.3-.3l1.8-5.6.9 2.9.8 2.7c0 .1.2.3.3.3h4.2c.1 0 .3-.1.3-.3l3.8-12.6V29c0 .1.1.3.3.3h5.1c.1 0 .3-.1.3-.3V15.7c0-.1-.1-.3-.2-.3zm6.7-4.5h-5.1c-.1 0-.3.1-.3.3v17.7c0 .1.1.3.3.3h5.1c.1 0 .3-.1.3-.3V11.1c0-.1-.1-.2-.3-.2zm6.8 0h-5.3c-.1 0-.3.1-.3.3v3.1c0 .1.1.3.3.3h5.3c.1 0 .3-.1.3-.3v-3.2c0-.1-.1-.2-.3-.2zm-.1 4.5h-5.1c-.1 0-.3.1-.3.3v13.1c0 .1.1.3.3.3h5.1c.1 0 .3-.1.3-.3V15.7c0-.1-.1-.3-.3-.3zm16.1 6.8c0 3.8-3.2 7.1-7.7 7.1-4.4 0-7.6-3.3-7.6-7.1s3.2-7.1 7.7-7.1c4.4 0 7.6 3.3 7.6 7.1zm-5.4.1c0-1.4-1-2.5-2.2-2.4-1.3 0-2.2 1.1-2.2 2.4 0 1.3 1 2.4 2.2 2.4 1.3 0 2.2-1.1 2.2-2.4z"></path>
                  <title>Twilio logo</title>
                </svg>'

$newNavSvg = $newSvg -replace 'class="enterprise-showcase-logo"', 'class="enterprise-showcase-nav-logo"'

# 1. Replace Overlay Logo (data-index="3")
$regexOverlay = '(?s)(<div class="enterprise-showcase-card-overlay" data-index="3">\s*<div class="enterprise-showcase-overlay-header">\s*)<svg class="enterprise-showcase-logo".*?</svg>'
if ($content -match $regexOverlay) {
    Write-Host "Overlay match found. Replacing..."
    $content = $content -replace $regexOverlay, ('$1' + $newSvg)
} else {
    Write-Host "Overlay Pattern NOT found."
}

# 2. Replace Navigation Logo (data-index="3")
$regexNav = '(?s)(<div class="enterprise-showcase-nav-item" data-index="3".*?>\s*)<svg class="enterprise-showcase-nav-logo".*?</svg>'
# Need to be somewhat flexible as there might be inline styles or newlines
# From previous view_file, line 4329: <div class="enterprise-showcase-nav-item" data-index="3"
# line 4330:             style="--showcase-accent-color: var(--showcase-twilio-color)">
# So the regex needs to span multiple lines for the div tag closing if needed, or just match up to the svg start.
# The previous regex worked for Maersk which had similar structure.

if ($content -match $regexNav) {
    Write-Host "Nav match found. Replacing..."
    $content = $content -replace $regexNav, ('$1' + $newNavSvg)
} else {
    Write-Host "Nav Pattern NOT found."
}

Set-Content $path -Value $content -Encoding UTF8
Write-Host "Done."
