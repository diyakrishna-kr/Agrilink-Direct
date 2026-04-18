$targetDir = "public/uploads"
if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir }

$products = @(
    @{ name = "onions.jpg"; kw = "onion" },
    @{ name = "tomatoes.jpg"; kw = "tomato" },
    @{ name = "grapes.jpg"; kw = "grapes" },
    @{ name = "wheat_lokwan.jpg"; kw = "wheat,grain" },
    @{ name = "rice_basmati.jpg"; kw = "rice,white" },
    @{ name = "potatoes_desi.jpg"; kw = "potato" },
    @{ name = "cabbage_green.jpg"; kw = "cabbage" },
    @{ name = "cauliflower.jpg"; kw = "cauliflower" },
    @{ name = "carrots.jpg"; kw = "carrot" },
    @{ name = "spinach.jpg"; kw = "spinach" },
    @{ name = "eggplant.jpg"; kw = "eggplant" },
    @{ name = "garlic.jpg"; kw = "garlic" },
    @{ name = "green_chilies.jpg"; kw = "chili,green" },
    @{ name = "capsicum.jpg"; kw = "capsicum" },
    @{ name = "lady_finger.jpg"; kw = "okra" },
    @{ name = "apple_kashmiri.jpg"; kw = "apple,red" },
    @{ name = "apple_himachal.jpg"; kw = "apple,fresh" },
    @{ name = "banana_robusta.jpg"; kw = "banana" },
    @{ name = "banana_elaichi.jpg"; kw = "banana,small" },
    @{ name = "mango_alphonso.jpg"; kw = "mango" },
    @{ name = "mango_kesar.jpg"; kw = "mango,fruit" },
    @{ name = "cherries.jpg"; kw = "cherry" },
    @{ name = "peaches.jpg"; kw = "peach" },
    @{ name = "papaya.jpg"; kw = "papaya" },
    @{ name = "pomegranate.jpg"; kw = "pomegranate" },
    @{ name = "wheat_sharbati.jpg"; kw = "wheat,flour" },
    @{ name = "rice_sonamasoori.jpg"; kw = "rice,grain" },
    @{ name = "bajra.jpg"; kw = "millet" },
    @{ name = "jowar.jpg"; kw = "sorghum" },
    @{ name = "groundnuts.jpg"; kw = "peanuts" },
    @{ name = "yellow_dal.jpg"; kw = "lentils,yellow" },
    @{ name = "red_lentils.jpg"; kw = "lentils,red" },
    @{ name = "chickpeas.jpg"; kw = "chickpeas" },
    @{ name = "black_gram.jpg"; kw = "beans,black" },
    @{ name = "black_pepper.jpg"; kw = "pepper,black" },
    @{ name = "cardamom.jpg"; kw = "cardamom" },
    @{ name = "cloves.jpg"; kw = "cloves" },
    @{ name = "cinnamon.jpg"; kw = "cinnamon" },
    @{ name = "nutmeg.jpg"; kw = "nutmeg" },
    @{ name = "milk_cow.jpg"; kw = "milk,cow" },
    @{ name = "milk_buffalo.jpg"; kw = "milk,glass" },
    @{ name = "ghee.jpg"; kw = "butter,melted" },
    @{ name = "butter.jpg"; kw = "butter" },
    @{ name = "paneer.jpg"; kw = "cheese,white" }
)

Write-Host "Fetching 44 unique images via LoremFlickr..."
foreach ($p in $products) {
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
Write-Host "Finished downloading all 44 unique assets."
