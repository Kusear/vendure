---
title: "Middleware"
weight: 10
date: 2023-06-07T09:42:20.822Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Middleware
<div class="symbol">


# Middleware

{{< generation-info sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="186" packageName="@vendure/core">}}

Defines API middleware, set in the <a href='/typescript-api/configuration/api-options#apioptions'>ApiOptions</a>. Middleware can be either
[Express middleware](https://expressjs.com/en/guide/using-middleware.html) or [NestJS middleware](https://docs.nestjs.com/middleware).

## Signature

```TypeScript
interface Middleware {
  handler: MiddlewareHandler;
  route: string;
  beforeListen?: boolean;
}
```
## Members

### handler

{{< member-info kind="property" type="MiddlewareHandler"  >}}

{{< member-description >}}The Express middleware function or NestJS `NestMiddleware` class.{{< /member-description >}}

### route

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The route to which this middleware will apply. Pattern based routes are supported as well.

The `'ab*cd'` route path will match `abcd`, `ab_cd`, `abecd`, and so on. The characters `?`, `+`, `*`, and `()` may be used in a route path,
and are subsets of their regular expression counterparts. The hyphen (`-`) and the dot (`.`) are interpreted literally.{{< /member-description >}}

### beforeListen

{{< member-info kind="property" type="boolean" default="false"  since="1.1.0" >}}

{{< member-description >}}When set to `true`, this will cause the middleware to be applied before the Vendure server (and underlying Express server) starts listening
for connections. In practical terms this means that the middleware will be at the very start of the middleware stack, before even the
`body-parser` middleware which is automatically applied by NestJS. This can be useful in certain cases such as when you need to access the
raw unparsed request for a specific route.{{< /member-description >}}


</div>
