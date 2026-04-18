# Final Cleanup of Inappropriate Images
$targetDir = "public/uploads"
if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir }

$items = @(
    @{ name = "eggplant_brinjal.jpg"; url = "https://images.unsplash.com/photo-1628102431548-68e498c4d115?w=400&q=80" },
    @{ name = "ghee_pure.jpg"; url = "https://images.unsplash.com/photo-1626202341490-5712c98a39f6?w=400&q=80" },
    @{ name = "spinach_leafy.jpg"; url = "https://images.unsplash.com/photo-1576045057995-534ef73c7136?w=400&q=80" },
    @{ name = "garlic_raw.jpg"; url = "https://images.unsplash.com/photo-1589927951187-282c063c1f97?w=400&q=80" },
    @{ name = "salt_table.jpg"; url = "https://images.unsplash.com/photo-1518113175563-847d0f02756e?w=400&q=80" },
    @{ name = "paneer_fresh.jpg"; url = "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=400&q=80" }
)

foreach ($p in $items) {
    $dest = Join-Path $targetDir $p.name
    try {
        Invoke-WebRequest -Uri $p.url -OutFile $dest -TimeoutSec 30
        Write-Host "Fixed: $($p.name)"
        Start-Sleep -Seconds 1
    } catch {
        Write-Host "Failed URL for $($p.name). Falling back to LoremFlickr..."
        $r = Get-Random -Minimum 1 -Maximum 500
        $fallback = "https://loremflickr.com/400/400/$($p.name.Split('_')[0])?lock=$r"
        Invoke-WebRequest -Uri $fallback -OutFile $dest -TimeoutSec 30
        Write-Host "Fallback Fixed: $($p.name)"
    }
}
Write-Host "Cleanup done."
