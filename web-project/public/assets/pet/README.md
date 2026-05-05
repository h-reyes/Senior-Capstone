# Pet Shop Assets

Drop images into these folders:

- `food`
- `accessories`
- `pets`

Food named with `extraordinary` fills more hunger than regular food.

You can adjust an image item's potency in the filename:

```text
Extraordinary_Kibble_hunger50_energy-12_happiness6_price0.0002.png
```

Supported effect tags:

- `hunger50`
- `happiness12`
- `energy-8`
- `price0.0002`

You can also create a sidecar JSON file with the same base name as the image:

```text
Extraordinary_Kibble.png
Extraordinary_Kibble.json
```

Example JSON:

```json
{
  "name": "Extraordinary Kibble",
  "priceEth": "0.0002",
  "effect": {
    "hunger": 50,
    "happiness": 6,
    "energy": -12
  }
}
```

The default shop items live in `shop-items.json`.
