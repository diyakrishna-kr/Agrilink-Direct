$targetDir = "public/uploads"
if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir }

$items = @(
    @{ name = "onions.jpg"; url = "https://images.unsplash.com/photo-1508747703725-71977713d2ee?w=400" },
    @{ name = "cauliflower.jpg"; url = "https://images.unsplash.com/photo-1568584711075-2d02bb5545f4?w=400" },
    @{ name = "butter_homemade.jpg"; url = "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400" },
    @{ name = "paneer_fresh.jpg"; url = "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=400" },
    @{ name = "milk_a2.jpg"; url = "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400" },
    @{ name = "milk_buffalo.jpg"; url = "https://images.unsplash.com/photo-1563636619-e91001933565?w=400" }
)

Write-Host "Fetching CORRECTED and DISTINCT images..."
foreach ($p in $items) {
    $dest = Join-Path $targetDir $p.name
    try {
        Invoke-WebRequest -Uri $p.url -OutFile $dest -TimeoutSec 30
        Write-Host "Downloaded: $($p.name)"
        Start-Sleep -Milliseconds 500
    } catch {
        Write-Error "Failed: $($p.name) - $($_.Exception.Message)"
    }
}
Write-Host "Final fix complete."
