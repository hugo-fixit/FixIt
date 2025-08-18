# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

### Current Versions

| Version | Hugo Version      | Supported          | Status         |
| :-----: | :---------------: | :----------------: | :------------: |
| 0.4.x   | >= 0.147.7        | :white_check_mark: | Latest (Alpha) |
| 0.3.x   | 0.112.0 ~ 0.146.0 | :white_check_mark: | Stable         |

### Legacy and Transitional Versions

| Version | Hugo Version     | LoveIt Compatibility | Supported |
| :-----: | :--------------: | :------------------: | :-------: |
| 0.1.x   | Unknown          | :white_check_mark:   | :x:       |
| 0.2.x   | 0.62.0 ~ 0.110.0 | :white_check_mark:   | :x:       |

## Security Considerations

### Theme Security Features

- **Content Security Policy (CSP)** support
- **Subresource Integrity (SRI)** for external resources
- **XSS protection** through Hugo's built-in escaping
- **Safe HTML rendering** with configurable markup
- **Secure defaults** for all theme configurations

### Best Practices

1. **Keep Hugo Updated**: Always use the latest stable Hugo version
2. **Regular Updates**: Update the theme regularly to get security patches
3. **Content Validation**: Validate user-generated content before publishing
4. **HTTPS Only**: Always deploy sites with HTTPS enabled

### Known Security Considerations

- External CDN resources should be reviewed before enabling
- User-generated content requires proper sanitization
- Third-party integrations (comments, analytics) should be configured securely

## Reporting a Vulnerability

We take security seriously and appreciate your help in keeping FixIt secure.

### How to Report

1. **Create an Issue**: Report vulnerabilities at https://github.com/hugo-fixit/FixIt/issues
2. **Private Disclosure**: For sensitive security issues, email the maintainers directly
3. **Include Details**: Provide clear steps to reproduce the vulnerability

### What to Include

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and severity
- **Reproduction**: Step-by-step instructions to reproduce
- **Environment**: Hugo version, theme version, and platform details
- **Solution**: Suggested fix if you have one

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Status Updates**: Weekly updates on progress
- **Resolution**: Security fixes are prioritized and released as soon as possible

### Disclosure Policy

- We follow responsible disclosure practices
- We will coordinate with you on the disclosure timeline

## Security Resources

- [Hugo Security Model](https://gohugo.io/about/security/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

<!-- This security policy was enhanced and generated with assistance from GitHub Copilot AI -->
