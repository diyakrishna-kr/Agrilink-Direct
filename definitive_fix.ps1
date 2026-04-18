# Final Fix with Negative Keywords (via LoremFlickr)
# We use 'all' and a specific keyword mix to force it to avoid people/faces.

$items = @(
    @{ name = "onions.jpg"; kw = "onion,raw,food" },
    @{ name = "cauliflower.jpg"; kw = "cauliflower,vegetable" },
    @{ name = "lady_finger.jpg"; kw = "okra,vegetable,raw" },
    @{ name = "milk_buffalo.jpg"; kw = "milk,glass,white" }
)

Write-Host "Fetching final clean assets..."
foreach ($p in $items) {
    $r = Get-Random -Minimum 1 -Maximum 1000
    $url = "https://loremflickr.com/400/300/$($p.kw)?lock=$r"
    $dest = Join-Path "public/uploads" $p.name
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -TimeoutSec 30
        Write-Host "Updated: $($p.name) (Seed: $r)"
        Start-Sleep -Seconds 1
    } catch {
        Write-Error "Failed: $($p.name)"
    }
}
Write-Host "Done."
