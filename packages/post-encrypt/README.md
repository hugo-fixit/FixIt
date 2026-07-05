# @hugo-fixit/post-encrypt

Post-build AES-256-GCM encryption tool for the [FixIt](https://github.com/hugo-fixit/FixIt) Hugo theme.

## Usage

After building your Hugo site, run the encryption tool from your site root:

```bash
npx @hugo-fixit/post-encrypt --input public
```

### Options

| Option | Description | Default |
| --- | --- | --- |
| `--input <dir>` | Input directory containing HTML files | `public` |
| `--dry-run | Show which files would be modified without writing | `false` |
| `--verify | Verify all encryption templates are encrypted | `false` |

### Examples

```bash
# Encrypt content in the default public/ directory
npx @hugo-fixit/post-encrypt

# Encrypt content in a custom directory
npx @hugo-fixit/post-encrypt --input dist

# Verify encryption without modifying files
npx @hugo-fixit/post-encrypt --verify

# Dry run to see which files would be changed
npx @hugo-fixit/post-encrypt --dry-run
```

## How It Works

1. Scans all `.html` files in the input directory
2. Finds `<template data-password="...">` elements (encryption placeholders)
3. Encrypts the plaintext content using AES-256-GCM with PBKDF2 key derivation
4. Replaces the `data-password` hash with a PBKDF2-protected version
5. Writes the encrypted payload back to the template element

### Security

- **Algorithm**: AES-256-GCM (authenticated encryption)
- **Key derivation**: PBKDF2 with 100,000 iterations and random 16-byte salt
- **Password verification**: PBKDF2-protected hash (not raw SHA-256)
- **Payload format**: `base64(salt).base64(iv).base64(ciphertext+tag)`

## License

MIT
