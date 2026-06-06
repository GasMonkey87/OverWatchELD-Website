# OverWatch ELD Website

Public static website for OverWatch ELD by Gas Monkey Creations.

## Pages

- `/` Home
- `/features` Feature list
- `/downloads` Windows ELD client download page
- `/live-map` Live fleet map information
- `/dashboard` Driver dashboard entry page
- `/maintenance` Fleet maintenance page
- `/profile` Driver profile page
- `/support` Support page

## Cloudflare Pages

Use these settings:

- Framework preset: None
- Build command: leave blank
- Build output directory: `/`
- Branch: `main`

The `_redirects` file handles clean routes like `/downloads` and `/live-map`.

## Download file

Upload the latest Windows client to:

```txt
/downloads/OverWatchELD.exe
```

Then the Download Latest button will work automatically.
