# Final Robust Visual Fix
$targetDir = "public/uploads"
if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir }

$items = @(
    @{ name = "ghee_pure.jpg"; kw = "oil,golden,butter" },
    @{ name = "paneer_fresh.jpg"; kw = "cheese,white,cube" },
    @{ name = "eggplant.jpg"; kw = "purple,vegetable,eggplant" },
    @{ name = "spinach.jpg"; kw = "green,leaves,vegetable" },
    @{ name = "garlic.jpg"; kw = "garlic,raw,root" },
    @{ name = "lady_finger.jpg"; kw = "okra,green,vegetable" }
)

foreach ($p in $items) {
    $r = Get-Random -Minimum 101 -Maximum 999
    $url = "https://loremflickr.com/400/300/$($p.kw)?lock=$r"
    $dest = Join-Path $targetDir $p.name
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -TimeoutSec 30
        Write-Host "Re-Fetched: $($p.name) (Seed: $r)"
        Start-Sleep -Seconds 1
    } catch {
        Write-Host "Failed to fetch $($p.name)"
    }
}
Write-Host "Done."
