$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "public\images\food"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$items = @(
  @{ file="chicken"; query="chicken curry dish" },
  @{ file="mutton"; query="mutton curry lamb dish" },
  @{ file="veg-meals"; query="vegetarian thali indian food" },
  @{ file="biryani"; query="biryani rice dish" },
  @{ file="noodles"; query="noodles food dish" },
  @{ file="fried-rice"; query="fried rice food" },
  @{ file="breakfast"; query="dosa idli breakfast" },
  @{ file="snacks"; query="samosa indian snack" },
  @{ file="soft-drinks"; query="soft drink bottles" },
  @{ file="cool-drinks"; query="cold coffee milkshake drink" },
  @{ file="ice-creams"; query="ice cream dessert" },
  @{ file="juices"; query="fruit juice glass" },
  @{ file="tea-coffee"; query="tea coffee cup" },
  @{ file="burgers"; query="burger food" },
  @{ file="sandwiches"; query="sandwich food" },
  @{ file="rolls"; query="wrap roll food" },
  @{ file="south-indian"; query="masala dosa idli" },
  @{ file="north-indian"; query="paneer naan indian food" },
  @{ file="desserts"; query="dessert cake sweets" },
  @{ file="combo-offers"; query="combo meal food" },
  @{ file="chicken-manchurian"; query="chicken manchurian" },
  @{ file="chicken-noodles"; query="chicken noodles" },
  @{ file="chicken-fried-rice"; query="chicken fried rice" },
  @{ file="chicken-biryani"; query="chicken biryani" },
  @{ file="chicken-roll"; query="chicken wrap roll" },
  @{ file="chicken-65"; query="fried chicken spicy" },
  @{ file="mutton-curry"; query="mutton curry lamb curry" },
  @{ file="mutton-biryani"; query="mutton biryani" },
  @{ file="mutton-fry"; query="mutton fry meat dish" },
  @{ file="mutton-keema"; query="keema minced meat curry" },
  @{ file="mutton-fried-rice"; query="meat fried rice" },
  @{ file="mutton-soup"; query="mutton soup" },
  @{ file="veg-thali"; query="vegetarian thali" },
  @{ file="curd-rice"; query="curd rice" },
  @{ file="lemon-rice"; query="lemon rice" },
  @{ file="tomato-rice"; query="tomato rice" },
  @{ file="chapati-curry"; query="chapati curry" },
  @{ file="veg-pulao"; query="vegetable pulao" },
  @{ file="veg-biryani"; query="vegetable biryani" },
  @{ file="egg-biryani"; query="egg biryani" },
  @{ file="chicken-dum-biryani"; query="chicken dum biryani" },
  @{ file="mutton-dum-biryani"; query="mutton dum biryani" },
  @{ file="paneer-biryani"; query="paneer biryani" },
  @{ file="family-biryani-bowl"; query="biryani bowl" },
  @{ file="veg-noodles"; query="vegetable noodles" },
  @{ file="egg-noodles"; query="egg noodles" },
  @{ file="schezwan-noodles"; query="schezwan noodles" },
  @{ file="paneer-noodles"; query="paneer noodles" },
  @{ file="triple-noodles"; query="mixed noodles" },
  @{ file="veg-fried-rice"; query="vegetable fried rice" },
  @{ file="egg-fried-rice"; query="egg fried rice" },
  @{ file="schezwan-fried-rice"; query="schezwan fried rice" },
  @{ file="paneer-fried-rice"; query="paneer fried rice" },
  @{ file="mixed-fried-rice"; query="mixed fried rice" },
  @{ file="idli-sambar"; query="idli sambar" },
  @{ file="masala-dosa"; query="masala dosa" },
  @{ file="poori-masala"; query="poori masala" },
  @{ file="aloo-paratha"; query="aloo paratha" },
  @{ file="bread-omelette"; query="bread omelette" },
  @{ file="upma-bowl"; query="upma" },
  @{ file="samosa"; query="samosa" },
  @{ file="puffs"; query="vegetable puff pastry" },
  @{ file="french-fries"; query="french fries" },
  @{ file="chilli-potato"; query="chilli potato" },
  @{ file="paneer-pakoda"; query="paneer pakora" },
  @{ file="masala-maggi"; query="maggi noodles" },
  @{ file="coke"; query="cola drink bottle" },
  @{ file="pepsi"; query="cola soft drink" },
  @{ file="sprite"; query="lemon soda drink" },
  @{ file="thums-up"; query="cola glass soft drink" },
  @{ file="fanta"; query="orange soda drink" },
  @{ file="soda-lime"; query="lime soda drink" },
  @{ file="cold-coffee"; query="cold coffee" },
  @{ file="lassi"; query="lassi drink" },
  @{ file="rose-milk"; query="rose milk drink" },
  @{ file="lemon-mint-cooler"; query="lemon mint drink" },
  @{ file="chocolate-shake"; query="chocolate milkshake" },
  @{ file="mango-shake"; query="mango milkshake" },
  @{ file="vanilla-scoop"; query="vanilla ice cream" },
  @{ file="chocolate-scoop"; query="chocolate ice cream" },
  @{ file="butterscotch-cup"; query="butterscotch ice cream" },
  @{ file="strawberry-sundae"; query="strawberry sundae" },
  @{ file="brownie-ice-cream"; query="brownie ice cream" },
  @{ file="kulfi-stick"; query="kulfi" },
  @{ file="orange-juice"; query="orange juice" },
  @{ file="watermelon-juice"; query="watermelon juice" },
  @{ file="pineapple-juice"; query="pineapple juice" },
  @{ file="mango-juice"; query="mango juice" },
  @{ file="apple-juice"; query="apple juice" },
  @{ file="mixed-fruit-juice"; query="mixed fruit juice" },
  @{ file="masala-tea"; query="masala chai" },
  @{ file="ginger-tea"; query="ginger tea" },
  @{ file="filter-coffee"; query="filter coffee" },
  @{ file="cappuccino"; query="cappuccino" },
  @{ file="black-coffee"; query="black coffee" },
  @{ file="hot-chocolate"; query="hot chocolate" },
  @{ file="veg-burger"; query="vegetable burger" },
  @{ file="cheese-burger"; query="cheese burger" },
  @{ file="chicken-burger"; query="chicken burger" },
  @{ file="paneer-burger"; query="paneer burger" },
  @{ file="double-patty-burger"; query="double burger" },
  @{ file="crispy-burger"; query="crispy burger" },
  @{ file="veg-grilled-sandwich"; query="grilled vegetable sandwich" },
  @{ file="cheese-corn-sandwich"; query="cheese corn sandwich" },
  @{ file="chicken-sandwich"; query="chicken sandwich" },
  @{ file="paneer-tikka-sandwich"; query="paneer sandwich" },
  @{ file="club-sandwich"; query="club sandwich" },
  @{ file="chocolate-sandwich"; query="chocolate sandwich" },
  @{ file="veg-roll"; query="vegetable wrap roll" },
  @{ file="egg-roll"; query="egg roll wrap" },
  @{ file="paneer-roll"; query="paneer wrap roll" },
  @{ file="double-egg-roll"; query="egg wrap roll" },
  @{ file="cheese-chicken-roll"; query="chicken cheese wrap" },
  @{ file="plain-dosa"; query="plain dosa" },
  @{ file="onion-dosa"; query="onion dosa" },
  @{ file="medu-vada"; query="medu vada" },
  @{ file="ghee-podi-idli"; query="podi idli" },
  @{ file="uttapam"; query="uttapam" },
  @{ file="pongal"; query="pongal dish" },
  @{ file="paneer-butter-masala"; query="paneer butter masala" },
  @{ file="dal-tadka"; query="dal tadka" },
  @{ file="chole-bhature"; query="chole bhature" },
  @{ file="butter-naan"; query="butter naan" },
  @{ file="rajma-chawal"; query="rajma chawal" },
  @{ file="aloo-jeera"; query="aloo jeera" },
  @{ file="gulab-jamun"; query="gulab jamun" },
  @{ file="rasmalai"; query="rasmalai" },
  @{ file="chocolate-brownie"; query="chocolate brownie" },
  @{ file="cheesecake-cup"; query="cheesecake" },
  @{ file="fruit-custard"; query="fruit custard" },
  @{ file="caramel-pudding"; query="caramel pudding" },
  @{ file="burger-fries-combo"; query="burger fries combo" },
  @{ file="biryani-coke-combo"; query="biryani cola meal" },
  @{ file="dosa-coffee-combo"; query="dosa coffee meal" },
  @{ file="noodles-manchurian-combo"; query="noodles manchurian" },
  @{ file="thali-sweet-combo"; query="thali dessert" },
  @{ file="roommates-mega-combo"; query="indian food platter" },
  @{ file="fallback-food"; query="food meal plate" }
)

function Get-CommonsImageUrl([string]$query) {
  $api = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=$([uri]::EscapeDataString($query))&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json"
  $data = Invoke-RestMethod -Uri $api -Headers @{ "User-Agent" = "RoomBitesDemo/1.0" }
  if (-not $data.query.pages) { return $null }
  foreach ($page in $data.query.pages.PSObject.Properties.Value) {
    $info = $page.imageinfo[0]
    if ($info.thumburl -match "\.(jpg|jpeg|png|webp)(\?|$)") {
      return $info.thumburl
    }
  }
  return $data.query.pages.PSObject.Properties.Value[0].imageinfo[0].thumburl
}

foreach ($item in $items) {
  $target = Join-Path $outDir "$($item.file).jpg"
  if (Test-Path $target) { continue }
  try {
    $url = Get-CommonsImageUrl $item.query
    if ($url) {
      Invoke-WebRequest -Uri $url -OutFile $target -Headers @{ "User-Agent" = "RoomBitesDemo/1.0" }
      Write-Host "Downloaded $($item.file)"
    }
  } catch {
    Write-Warning "Failed $($item.file): $($_.Exception.Message)"
  }
}
