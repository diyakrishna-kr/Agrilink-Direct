$targetDir = "public/uploads"
if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir }

$items = @(
    # Dairy Group
    @{ name = "milk_a2.jpg"; kw = "milk,bottle" },
    @{ name = "milk_buffalo.jpg"; kw = "milk,glass" },
    @{ name = "ghee_pure.jpg"; kw = "butter,melted" },
    @{ name = "butter_homemade.jpg"; kw = "butter,block" },
    @{ name = "paneer_fresh.jpg"; kw = "cheese,white,cube" },
    # Pulse Group (User said "and ...", so I'll add more pulses)
    @{ name = "dal_yellow.jpg"; kw = "lentils,yellow" },
    @{ name = "dal_red.jpg"; kw = "lentils,red" },
    @{ name = "chana.jpg"; kw = "chickpeas" },
    @{ name = "groundnuts.jpg"; kw = "peanuts" }
)

Write-Host "Fetching specific images to differentiate Dairy and Pulses..."
foreach ($p in $items) {
    $url = "https://loremflickr.com/400/300/$($p.kw)"
    $dest = Join-Path $targetDir $p.name
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -TimeoutSec 30
        Write-Host "Downloaded: $($p.name) ($($p.kw))"
        Start-Sleep -Milliseconds 500
    } catch {
        Write-Error "Failed: $($p.name) - $($_.Exception.Message)"
    }
}
Write-Host "Download complete."
